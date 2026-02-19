import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Just mock success
    return NextResponse.json({ success: true, message: 'Password reset link sent to your email.' });
}
