import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
        return NextResponse.json({ message: 'User ID or Email is required' }, { status: 400 });
    }

    // NOTE: Auth checks removed temporarily because the UI uses local mock storage instead of JWT cookies.
    // In a production app, the token would be validated here.

    try {
        await connectDB();

        let query: any = {};
        if (userId) {
            query.userId = userId;
        } else if (email) {
            query.userEmail = email;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });

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
