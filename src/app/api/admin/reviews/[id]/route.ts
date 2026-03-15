import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: any }) {
    try {
        await connectDB();
        
        // Verify admin token
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const { id } = await params;
        const updateData = await req.json();

        // Ensure status is valid if provided
        if (updateData.status && !['pending', 'approved', 'rejected'].includes(updateData.status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!review) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }

        // Must recalculate product rating if fields that affect it changed
        const allApprovedReviews = await Review.find({ product: review.product, status: 'approved' });
        const totalRating = allApprovedReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = allApprovedReviews.length > 0 ? (totalRating / allApprovedReviews.length) : 0;

        await Product.findByIdAndUpdate(review.product, {
            rating: avgRating.toFixed(1),
            reviews: allApprovedReviews.length
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("Update Review Error:", error);
        return NextResponse.json({ message: 'Error updating review' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: any }) {
    try {
        await connectDB();
        
        // Verify admin token
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const { id } = await params;

        const review = await Review.findByIdAndDelete(id);
        
        if (!review) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }

        // Recalculate rating
        const allApprovedReviews = await Review.find({ product: review.product, status: 'approved' });
        const totalRating = allApprovedReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = allApprovedReviews.length > 0 ? (totalRating / allApprovedReviews.length) : 0;

        await Product.findByIdAndUpdate(review.product, {
            rating: avgRating.toFixed(1),
            reviews: allApprovedReviews.length
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Review Error:", error);
        return NextResponse.json({ message: 'Error deleting review' }, { status: 500 });
    }
}
