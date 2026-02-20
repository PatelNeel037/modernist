import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await verifyAdmin();
        await connectDB();
        const users = await User.find().lean();
        const orders = await Order.find().lean();

        // Enrich users with stats
        const enrichedUsers = users.map((u: any) => {
            const userOrders = orders.filter((o: any) => o.userEmail === u.email || String(o.userId) === String(u._id));
            const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);

            return {
                ...u,
                id: u._id.toString(),
                status: u.isBlocked ? 'blocked' : (u.status || 'active'),
                isActive: !u.isBlocked,
                joined: u.createdAt,
                totalOrders: userOrders.length,
                totalSpent: totalSpent
            };
        });

        return NextResponse.json(enrichedUsers);
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
