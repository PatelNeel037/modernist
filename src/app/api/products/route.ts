import { NextResponse } from 'next/server';
import { MockProductStore } from '@/lib/mock-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    let products = MockProductStore.getAll();

    // Filter out deleted products for public view
    if (mode !== 'admin') {
        products = products.filter((p: any) => p.status !== 'deleted' && p.status !== 'hidden');
    }

    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validation: Name, Category, Price
        if (!body.name || !body.category || !body.price) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const newProduct = MockProductStore.create(body);
        return NextResponse.json({ success: true, product: newProduct });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Creation failed' }, { status: 500 });
    }
}
