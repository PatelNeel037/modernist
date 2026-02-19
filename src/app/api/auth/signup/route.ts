import { NextResponse } from 'next/server';
import { MockUserStore } from '@/lib/mock-store';

const MOCK_TOKEN = "jwt_token_user_signup";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        // Check if user exists
        const existing = MockUserStore.findByEmail(email);
        if (existing) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
        }

        // Create new user
        const newUser = MockUserStore.create({ name, email, password, role: 'user' });

        // Safe user object (no password)
        const { password: _, ...safeUser } = newUser;

        return NextResponse.json({
            success: true,
            token: MOCK_TOKEN,
            user: safeUser,
            message: 'Account created successfully!'
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
