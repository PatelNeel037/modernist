import { validateEmail } from '@/lib/validation';
import { sendVerificationEmail } from '@/lib/email';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, password } = body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json({ success: false, message: emailValidation.message }, { status: 400 });
        }

        if (!password || !name) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false,
            verificationCode,
            verificationCodeExpires
        });

        const { password: _, ...safeUser } = newUser.toObject();
        safeUser.id = safeUser._id.toString();

        // Send Verification Email
        console.log("SIGNUP DEBUG: About to call sendVerificationEmail for", safeUser.email);
        await sendVerificationEmail(safeUser.email, safeUser.name, verificationCode);
        console.log("SIGNUP DEBUG: sendVerificationEmail call finished");

        return NextResponse.json({
            success: true,
            user: safeUser,
            requireVerification: true,
            message: 'Verification code sent to your email.'
        });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
