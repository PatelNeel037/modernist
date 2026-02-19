import { NextResponse } from 'next/server';
import { MockProductStore } from '@/lib/mock-store';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);
        const body = await request.json();

        // Check product existence
        const updated = MockProductStore.update(id, body);

        if (!updated) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updated });
    } catch (e) {
        console.error("PUT Product Error:", e);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);
        const deleted = MockProductStore.delete(id);

        if (!deleted) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (e) {
        console.error("DELETE Product Error:", e);
        return NextResponse.json({ success: false, message: 'Deletion failed' }, { status: 500 });
    }
}
