import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId, items, totalAmount, shippingAddress, guestInfo } = body;

        // Verify block status if authenticated
        if (userId && userId !== 'GUEST') {
            const user = await User.findById(userId);
            if (user && user.isBlocked) {
                return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
            }
        }

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
        }

        // Create Order with initial 'Pending' status
        const newOrder = await Order.create({
            userId: userId || 'GUEST',
            userEmail: userId ? null : guestInfo?.email,
            guestInfo,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending',
            paymentStatus: 'Pending'
        });

        const orderId = newOrder._id.toString();

        return NextResponse.json({ 
            success: true, 
            orderId, 
            message: 'Order recorded. Proceeding to payment.' 
        });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({
            success: false,
            message: 'Failed to process order',
        }, { status: 500 });
    }
}
