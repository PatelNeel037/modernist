import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderStatusEmail } from '@/lib/email';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const params = await props.params;
        const id = params.id;

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const safeOrder = order.toObject();
        safeOrder.id = safeOrder._id.toString();

        return NextResponse.json(safeOrder);
    } catch (e) {
        console.error("[API] GET Order Error:", e);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const body = await request.json();
        const { status, trackingId, carrier, refundStatus, userId } = body;
        const params = await props.params;
        const id = params.id;

        // Fetch original to verify ownership or admin
        const originalOrder = await Order.findById(id);
        if (!originalOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // If it's a customer trying to cancel:
        if (status === 'Cancelled' && userId) {
            // Basic customer check: they must own it.
            if (originalOrder.userId !== userId && originalOrder.guestInfo?.email !== userId) {
                return NextResponse.json({ message: 'Unauthorized to cancel this order' }, { status: 403 });
            }
        } else {
            // Otherwise (updating tracking, marking shipped), it requires admin
            try {
                await verifyAdmin();
            } catch (err) {
                return NextResponse.json({ message: 'Unauthorized action' }, { status: 403 });
            }
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (trackingId !== undefined) updateData.trackingId = trackingId;
        if (carrier !== undefined) updateData.carrier = carrier;
        if (refundStatus !== undefined) updateData.refundStatus = refundStatus;

        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const safeOrder = updatedOrder.toObject();
        safeOrder.id = safeOrder._id.toString();

        // Send email notification based on status change or tracking updates
        if (status || trackingId) {
            let email = safeOrder.userEmail || safeOrder.guestInfo?.email;
            let name = safeOrder.guestInfo?.name || safeOrder.shippingAddress?.name;

            // If it's a registered user, they might not have their email copied directly 
            // over depending on the original checkout route, so let's import User and fetch.
            if ((!email || !name) && safeOrder.userId && safeOrder.userId !== 'GUEST') {
                try {
                    const dbUser = await User.findById(safeOrder.userId).lean();
                    if (dbUser) {
                        email = email || dbUser.email;
                        name = name || dbUser.name;
                    }
                } catch (err) {
                    console.log("Could not find user by ID:", safeOrder.userId);
                }
            }

            if (email && status) {
                // If it's just a tracking update but no status change, status could be lowercase 'shipped'.
                // If status was already "Shipped" and they just add tracking, "status" might not be in body.
                // We'll use the updated order's status.
                const emailStatus = updateData.status ? updateData.status.toLowerCase() : safeOrder.status.toLowerCase();
                sendOrderStatusEmail(email, name || 'Customer', safeOrder.id, emailStatus, updateData.trackingId || safeOrder.trackingId).catch(console.error);
            }
        }

        return NextResponse.json(safeOrder);

    } catch (e) {
        console.error("[API] PUT Order Error:", e);
        return NextResponse.json({ message: 'Update failed' }, { status: 500 });
    }
}
