import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId, items, totalAmount, shippingAddress, guestInfo } = body;

        let customerEmail = guestInfo?.email;
        let customerName = guestInfo?.name || shippingAddress?.name || 'Customer';

        // We will verify block status if the user is in the database.
        if (userId && userId !== 'GUEST') {
            const user = await User.findById(userId);
            if (user) {
                if (user.isBlocked) {
                    return NextResponse.json({ success: false, message: 'Account is blocked' }, { status: 403 });
                }
                customerEmail = user.email;
                customerName = user.name;
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

        // Dispatch Confirmation Email Async
        if (customerEmail) {
            sendOrderConfirmationEmail(customerEmail, customerName, safeOrder.id, items, totalAmount).catch(console.error);
        }

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
