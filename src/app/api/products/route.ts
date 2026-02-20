import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode');

        let query: any = {};

        // Filter out deleted products for public view
        if (mode !== 'admin') {
            query.status = { $nin: ['deleted', 'hidden'] };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        const formattedProducts = products.map(p => {
            const obj = p.toObject();
            obj.id = obj._id.toString();
            return obj;
        });

        return NextResponse.json(formattedProducts);
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await verifyAdmin();
        await connectDB();
        const body = await request.json();

        // Validation: Name, Category, Price
        if (!body.name || !body.category || !body.price) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Adapt image if needed
        if (body.image && (!body.images || body.images.length === 0)) {
            body.images = [body.image];
        }

        const newProduct = await Product.create(body);

        const safeProduct = newProduct.toObject();
        safeProduct.id = safeProduct._id.toString();

        return NextResponse.json({ success: true, product: safeProduct });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Creation failed' }, { status: 500 });
    }
}
