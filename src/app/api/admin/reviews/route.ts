import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { verifyAdmin } from '@/lib/auth'; // Ensure admin checks

export async function GET(req: Request) {
    try {
        await connectDB();
        
        // Verify admin token
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const reviews = await Review.find()
            .populate('product', 'name images')
            .sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Admin Fetch Reviews Error:", error);
        return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
    }
}
