import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, ...updateFields } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'User email required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        if (user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
        }

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });

        if (updatedUser) {
            const { password, ...safeUser } = updatedUser.toObject();
            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully',
                user: safeUser
            });
        }

        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
