import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: any }) {
    try {
        await verifyAdmin();
        await connectDB();
        const { id } = await params;
        const userId = id;

        const user = await User.findById(userId).lean();

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userOrders = await Order.find({
            $or: [
                { userId: userId },
                { userEmail: user.email }
            ]
        }).sort({ createdAt: -1 }).lean();

        // Calculate Stats
        const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        const lastOrderDate = userOrders.length > 0 ? userOrders[0].createdAt : null;
        const averageOrderValue = userOrders.length > 0 ? totalSpent / userOrders.length : 0;

        const activityLog = [
            { action: 'Account Created', date: user.createdAt || new Date().toISOString() },
            ...userOrders.map((o: any) => ({ action: `Order Placed #${o._id.toString().substring(0, 8)}`, date: o.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const { password, ...safeUser } = user;

        const responseData = {
            user: {
                ...safeUser,
                id: user._id.toString(),
                status: (safeUser.status === 'deleted') ? 'deleted' : (safeUser.isBlocked ? 'blocked' : 'active'),
                isActive: !safeUser.isBlocked,
                isVerified: safeUser.isVerified ?? true
            },
            orders: userOrders.map((o: any) => ({ ...o, id: o._id.toString() })),
            stats: {
                totalOrders: userOrders.length,
                totalSpent,
                lastOrderDate,
                averageOrderValue
            },
            activityLog
        };

        return NextResponse.json(responseData);

    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: any }) {
    try {
        await verifyAdmin();
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { action, notes } = body;
        let updateData: any = {};

        if (action === 'block') {
            updateData.isBlocked = true;
        } else if (action === 'unblock') {
            updateData.isBlocked = false;
        } else if (notes !== undefined) {
            updateData.adminNotes = notes;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();

        const safeUser = { ...updatedUser, id: updatedUser._id.toString() };
        delete safeUser.password;

        return NextResponse.json({ success: true, user: safeUser });

    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: any }) {
    try {
        await verifyAdmin();
        await connectDB();
        const { id } = await params;

        const user = await User.findByIdAndUpdate(id, { isBlocked: true, status: 'deleted' });

        if (user) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ message: 'User not found' }, { status: 404 });

    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
