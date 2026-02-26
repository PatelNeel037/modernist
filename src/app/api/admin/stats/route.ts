import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await verifyAdmin();
        await connectDB();

        // 1. Customers Model
        const customersCount = await User.countDocuments({ role: 'user' });

        // 2. Low Stock Products (< 10)
        const lowStockDocs = await Product.find({ stock: { $lt: 10 }, status: { $ne: 'deleted' } })
            .select('name stock _id')
            .limit(5);
        const lowStock = lowStockDocs.map(p => ({
            id: p._id.toString(),
            name: p.name,
            stock: p.stock
        }));

        // 3. Orders and Revenue and Top Selling
        const allOrders = await Order.find();

        let totalRev = 0;
        let todayRev = 0;
        let monthRev = 0;
        const ordersStatusCount = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        const productSalesCount: Record<string, { name: string, count: number, revenue: number }> = {};

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        allOrders.forEach(order => {
            if (ordersStatusCount[order.status as keyof typeof ordersStatusCount] !== undefined) {
                ordersStatusCount[order.status as keyof typeof ordersStatusCount]++;
            } else {
                ordersStatusCount.Pending++;
            }

            if (order.status !== 'Cancelled') {
                const amt = Number(order.totalAmount || 0);
                totalRev += amt;

                const orderDate = new Date(order.createdAt || order._id.getTimestamp());
                if (orderDate >= todayStart) todayRev += amt;
                if (orderDate >= monthStart) monthRev += amt;

                // Tally products
                if (Array.isArray(order.items)) {
                    order.items.forEach((item: any) => {
                        const pid = item.id || item.name; // fallback to name if ID missing
                        if (!productSalesCount[pid]) {
                            productSalesCount[pid] = { name: item.name, count: 0, revenue: 0 };
                        }
                        const itemQty = Number(item.quantity || 1);
                        productSalesCount[pid].count += itemQty;
                        productSalesCount[pid].revenue += (Number(item.price || 0) * itemQty);
                    });
                }
            }
        });

        const topSelling = Object.values(productSalesCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const stats = {
            revenue: {
                total: totalRev,
                today: todayRev,
                month: monthRev
            },
            orders: ordersStatusCount,
            customers: customersCount,
            lowStock: lowStock,
            topSelling: topSelling
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}
