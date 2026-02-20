import { NextResponse } from 'next/server';
import { MockUserStore } from '@/lib/mock-store';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'User email required' }, { status: 400 });
        }

        const user = MockUserStore.findByEmail(email);
        if (user && user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
        }

        const updatedUser = MockUserStore.update(email, body);

        if (updatedUser) {
            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        }

        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
