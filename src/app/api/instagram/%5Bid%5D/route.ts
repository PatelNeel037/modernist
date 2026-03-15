import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import InstagramPost from '@/models/InstagramPost';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: any }) {
    try {
        await connectDB();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const data = await req.json();
        const post = await InstagramPost.findByIdAndUpdate(id, data, { new: true });
        
        if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating instagram post' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: any }) {
    try {
        await connectDB();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const post = await InstagramPost.findByIdAndDelete(id);
        
        if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting instagram post' }, { status: 500 });
    }
}
