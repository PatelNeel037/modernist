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
        const { name, email, password } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...safeUser } = newUser.toObject();
        safeUser.id = safeUser._id.toString();

        const response = NextResponse.json({
            success: true,
            token,
            user: safeUser,
            message: 'Account created successfully!'
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
