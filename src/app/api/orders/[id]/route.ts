import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/auth';

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
        await verifyAdmin();
        await connectDB();
        const body = await request.json();
        const { status, trackingId, carrier, refundStatus } = body;
        const params = await props.params;
        const id = params.id;

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

        return NextResponse.json(safeOrder);

    } catch (e) {
        console.error("[API] PUT Order Error:", e);
        return NextResponse.json({ message: 'Update failed' }, { status: 500 });
    }
}
