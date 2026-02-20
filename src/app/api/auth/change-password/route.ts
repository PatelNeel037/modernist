import { NextResponse } from 'next/server';
import { MockUserStore } from '@/lib/mock-store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, currentPassword, newPassword } = body;

        // Simple validation
        if (!email || !currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = MockUserStore.findByEmail(email);
        if (user && user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
        }

        const success = MockUserStore.changePassword(email, currentPassword, newPassword);

        if (success) {
            return NextResponse.json({
                success: true,
                message: 'Password changed successfully'
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid current password' }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
