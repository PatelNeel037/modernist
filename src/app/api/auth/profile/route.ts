import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Strip sensitive/immutable fields from body so they can't be accidentally overwritten
        const { id, _id, email, currentEmail, password, role, isVerified, isActive, createdAt, updatedAt, __v, ...allowedUpdates } = body;
        
        const searchId = id || _id;

        if (!searchId) {
            return NextResponse.json({ success: false, message: 'User ID required to update profile' }, { status: 400 });
        }

        const user = await User.findById(searchId);
        
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found in database' }, { status: 404 });
        }
        if (user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
        }

        const updatedUser = await User.findByIdAndUpdate(searchId, { $set: allowedUpdates }, { new: true });

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

export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (deletedUser) {
            return NextResponse.json({ success: true, message: 'Account deleted successfully' });
        }

        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
