import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password } = body;

        const user = await User.findOne({ email });

        if (user) {
            if (user.isBlocked) {
                return NextResponse.json({ success: false, message: 'Your account has been suspended. Please contact support.' }, { status: 403 });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
            }

            const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

            const { password: _, ...safeUser } = user.toObject();
            safeUser.id = safeUser._id.toString();

            const response = NextResponse.json({
                success: true,
                token,
                user: safeUser,
                message: 'Login successful'
            });

            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });

            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
