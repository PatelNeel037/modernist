import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // For security, do not reveal if the user exists
            return NextResponse.json({ success: true, message: 'If you have an account, a reset link has been sent to your email.' });
        }

        if (user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Your account is blocked.' }, { status: 403 });
        }

        // Generate a fast-expiring reset token (15 mins)
        const resetToken = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        return NextResponse.json({
            success: true,
            message: 'If you have an account, a reset link has been sent to your email.',
            resetToken_dev_only: resetToken // Only returning to help developer integration
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
