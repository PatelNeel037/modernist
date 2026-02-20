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
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json({ success: false, message: 'Token and new password required' }, { status: 400 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password has been successfully reset' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
