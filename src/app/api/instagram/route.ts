import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import InstagramPost from '@/models/InstagramPost';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const all = searchParams.get('all') === 'true';

        const query = all ? {} : { isActive: true };
        const posts = await InstagramPost.find(query).sort({ order: 1, createdAt: -1 });
        
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching instagram posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const post = await InstagramPost.create(data);
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ message: 'Error creating instagram post' }, { status: 500 });
    }
}
