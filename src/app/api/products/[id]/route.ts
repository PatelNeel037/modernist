import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const params = await props.params;
        const id = params.id;

        const product = await Product.findById(id);

        if (!product || product.status === 'deleted') {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        const safeProduct = product.toObject();
        safeProduct.id = safeProduct._id.toString();

        return NextResponse.json(safeProduct);
    } catch (e) {
        console.error("GET Product Error:", e);
        return NextResponse.json({ success: false, message: 'Fetch failed' }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await verifyAdmin();
        await connectDB();
        const params = await props.params;
        const id = params.id;
        const body = await request.json();

        if (body.image) {
            body.images = [body.image];
        }

        // Check product existence
        const updated = await Product.findByIdAndUpdate(id, body, { new: true });

        if (!updated) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        const safeProduct = updated.toObject();
        safeProduct.id = safeProduct._id.toString();

        return NextResponse.json({ success: true, product: safeProduct });
    } catch (e) {
        console.error("PUT Product Error:", e);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await verifyAdmin();
        await connectDB();
        const params = await props.params;
        const id = params.id;

        const { searchParams } = new URL(request.url);
        const hardDelete = searchParams.get('hard') === 'true';

        let deleted;
        if (hardDelete) {
            deleted = await Product.findByIdAndDelete(id);
        } else {
            deleted = await Product.findByIdAndUpdate(id, { status: 'deleted' });
        }

        if (!deleted) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (e) {
        console.error("DELETE Product Error:", e);
        return NextResponse.json({ success: false, message: 'Deletion failed' }, { status: 500 });
    }
}
