import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await verifyAdmin(request);
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 });

        // Map _id to id
        const formattedOrders = orders.map(o => {
            const obj = o.toObject();
            obj.id = obj._id.toString();
            return obj;
        });

        return NextResponse.json(formattedOrders);
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
