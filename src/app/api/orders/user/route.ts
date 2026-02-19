import { NextResponse } from 'next/server';
import { MockOrderStore } from '@/lib/mock-store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
        return NextResponse.json({ message: 'User ID or Email is required' }, { status: 400 });
    }

    try {
        let orders = MockOrderStore.getAll();

        if (userId) {
            // Convert to string for comparison as userId might be number in store
            orders = orders.filter((o: any) => String(o.userId) === String(userId));
        } else if (email) {
            // Fallback for older orders without userId
            orders = orders.filter((o: any) => o.userEmail === email);
        }

        // Sort by date desc
        orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(orders);
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
