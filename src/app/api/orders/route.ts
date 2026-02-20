import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId, items, totalAmount, shippingAddress, guestInfo } = body;

        // Check Blocked Status & Verify Token
        if (userId && userId !== 'GUEST') {
            try {
                const decodedToken = await verifyAuth();
                if (decodedToken.id !== userId) {
                    return NextResponse.json({ success: false, message: 'Token mismatch user ID' }, { status: 401 });
                }
            } catch (e) {
                return NextResponse.json({ success: false, message: 'Invalid or missing token' }, { status: 401 });
            }

            const user = await User.findById(userId);
            if (user && user.isBlocked) {
                return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
            }
        }

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
        }

        const newOrder = await Order.create({
            userId: userId || 'GUEST',
            userEmail: userId ? null : guestInfo?.email, // If guest, store email
            guestInfo,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending',
        });

        // Convert _id to string ID so UI works gracefully
        const safeOrder = newOrder.toObject();
        safeOrder.id = safeOrder._id.toString();

        return NextResponse.json({ success: true, orderId: safeOrder.id, message: 'Order placed successfully!' });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({
            success: false,
            message: 'Failed to process order',
            error: String(error)
        }, { status: 500 });
    }
}
