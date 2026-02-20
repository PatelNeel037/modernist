import { NextResponse } from 'next/server';
import { MockOrderStore } from '@/lib/mock-store';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;
        console.log(`[API] Fetching Order ID: ${id}`);

        const order = MockOrderStore.getById(id);

        if (!order) {
            console.log(`[API] Order ${id} not found.`);
            // Maybe try decoding? Though usually not needed
            const decodedId = decodeURIComponent(id);
            if (decodedId !== id) {
                const order2 = MockOrderStore.getById(decodedId);
                if (order2) return NextResponse.json(order2);
            }

            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (e) {
        console.error("[API] GET Order Error:", e);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { status, trackingId, carrier, refundStatus } = body;
        const params = await props.params;
        const id = params.id;

        console.log(`[API] Updating Order ${id}:`, { status, trackingId, carrier, refundStatus });

        const updatedOrder = MockOrderStore.update(id, {
            ...(status && { status }),
            ...(trackingId && { trackingId }),
            ...(carrier && { carrier }),
            ...(refundStatus && { refundStatus })
        });

        if (!updatedOrder) {
            console.log(`[API] Update failed: Order ${id} not found.`);
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);

    } catch (e) {
        console.error("[API] PUT Order Error:", e);
        return NextResponse.json({ message: 'Update failed' }, { status: 500 });
    }
}
