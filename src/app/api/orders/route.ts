import { NextResponse } from 'next/server';
import { MockOrderStore } from '@/lib/mock-store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, items, totalAmount, shippingAddress, guestInfo } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
        }

        const newOrder = MockOrderStore.create({
            userId: userId || 'GUEST',
            userEmail: userId ? null : guestInfo?.email, // If guest, store email
            guestInfo,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending',
        });

        return NextResponse.json({ success: true, orderId: newOrder.id, message: 'Order placed successfully!' });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ success: false, message: 'Failed to process order' }, { status: 500 });
    }
}
