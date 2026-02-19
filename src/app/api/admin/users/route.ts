import { NextResponse } from 'next/server';
import { MockUserStore, MockOrderStore } from '@/lib/mock-store';

export async function GET() {
    try {
        const users = MockUserStore.getAll();
        const orders = MockOrderStore.getAll();

        // Enrich users with stats
        const enrichedUsers = users.map((user: any) => {
            const userOrders = orders.filter((o: any) => o.userEmail === user.email || o.userId === user.id);
            const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);

            return {
                ...user,
                joined: user.id, // Timestamp is ID in mock
                totalOrders: userOrders.length,
                totalSpent: totalSpent
            };
        });

        return NextResponse.json(enrichedUsers);
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
