import { NextResponse } from 'next/server';
import { MockUserStore } from '@/lib/mock-store';

const MOCK_TOKEN = "jwt_token_user_login";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Find user in memory store
        const user = MockUserStore.validateCredentials(email, password);

        if (user) {
            // Check Blocked Status
            if (user.isBlocked) {
                return NextResponse.json({ success: false, message: 'Your account has been suspended. Please contact support.' }, { status: 403 });
            }

            // Success
            // Don't return password in response
            const { password: _, ...safeUser } = user;

            return NextResponse.json({
                success: true,
                token: MOCK_TOKEN,
                user: safeUser,
                message: 'Login successful'
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
