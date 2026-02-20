import { NextResponse } from 'next/server';
import { MockUserStore, MockOrderStore } from '@/lib/mock-store';

export async function GET(request: Request, { params }: { params: any }) {
    try {
        // Await params to support Next.js 15+ where it's a Promise
        const { id } = await params;
        const userId = id;

        const allUsers = MockUserStore.getAll();
        const user = allUsers.find((u: any) => u.id.toString() === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const allOrders = MockOrderStore.getAll();
        // Match by ID or Email
        const userOrders = allOrders.filter((o: any) =>
            (o.userId && o.userId.toString() === userId) ||
            (o.userEmail === user.email)
        );

        // Calculate Stats
        const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        const lastOrderDate = userOrders.length > 0 ? userOrders[0].createdAt : null;
        const averageOrderValue = userOrders.length > 0 ? totalSpent / userOrders.length : 0;

        // Mock Activity Log (In a real app, this would be a separate DB table)
        const activityLog = [
            { action: 'Account Created', date: user.createdAt || new Date(user.id).toISOString() },
            { action: 'Last Login', date: new Date().toISOString() }, // Mock
            ...userOrders.map((o: any) => ({ action: `Order Placed #${o.id}`, date: o.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Sensitivity Check
        // Remove password hash if present
        const { password, ...safeUser } = user;

        const responseData = {
            user: {
                ...safeUser,
                status: (safeUser.status === 'deleted') ? 'deleted' : (safeUser.isBlocked ? 'blocked' : 'active'),
                isActive: !safeUser.isBlocked,
                isVerified: safeUser.isVerified ?? true
            },
            orders: userOrders,
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
        const { id } = await params;
        const userId = id;
        const body = await request.json();

        // This is a bit tricky because MockStore.update uses EMAIL as key currently.
        // We should really update MockStore to support finding by ID or ensure we get the email first.

        const allUsers = MockUserStore.getAll();
        const user = allUsers.find((u: any) => u.id.toString() === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { action, notes } = body;
        let success = false;

        if (action === 'block') {
            success = MockUserStore.toggleBlockStatus(user.email, true);
        } else if (action === 'unblock') {
            success = MockUserStore.toggleBlockStatus(user.email, false);
        } else if (notes !== undefined) {
            MockUserStore.update(user.email, { adminNotes: notes });
            success = true;
        }

        if (success) {
            const updatedUser = MockUserStore.findByEmail(user.email);
            return NextResponse.json({ success: true, user: updatedUser });
        }

        return NextResponse.json({ success: false, message: 'Update failed' });

    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: any }) {
    try {
        const { id } = await params;
        const userId = id;
        // MockStore doesn't expose DELETE for users yet. 
        // We'll mock it by marking as deleted or we need to add a delete method to MockUserStore.
        // For now, let's just use the `isActive: false` (Blocked) as a soft delete or implement a delete method.

        // Actually, let's update MockUserStore to support hard delete if requested, 
        // but typically "Delete Account" in admin panel might just soft delete.
        // The user prompt said: "Delete Account... These are control actions."

        // I'll call update to set status = 'deleted'
        const allUsers = MockUserStore.getAll();
        const user = allUsers.find((u: any) => u.id.toString() === userId);

        if (user) {
            MockUserStore.update(user.email, { status: 'deleted', isBlocked: true, isActive: false });
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ message: 'User not found' }, { status: 404 });

    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
