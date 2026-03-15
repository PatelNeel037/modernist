import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ success: false, message: 'Email and code are required' }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('-addresses');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: 'Account already verified' }, { status: 400 });
        }

        // Check if code matches and is not expired
        if (user.verificationCode !== code) {
            return NextResponse.json({ success: false, message: 'Invalid verification code' }, { status: 400 });
        }

        if (new Date() > user.verificationCodeExpires) {
            return NextResponse.json({ success: false, message: 'Verification code expired' }, { status: 400 });
        }

        // Mark as verified and clear code
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generate JWT Token now that they are verified
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send Welcome Email
        sendWelcomeEmail(user.email, user.name).catch(console.error);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: 'Email verified successfully!'
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
