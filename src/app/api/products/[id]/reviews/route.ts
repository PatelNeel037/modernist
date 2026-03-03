import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

// GET all reviews for a product
export async function GET(req: Request, { params }: { params: any }) {
    try {
        await connectDB();
        const { id } = await params;

        const reviews = await Review.find({
            product: id,
            status: 'approved'
        }).sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
    }
}

// POST a new review
export async function POST(req: Request, { params }: { params: any }) {
    try {
        const decoded = await verifyAuth();
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { rating, comment, reviewerName } = body;

        if (!rating || !comment) {
            return NextResponse.json({ message: 'Rating and comment are required' }, { status: 400 });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ product: id, user: decoded.id });
        if (existingReview) {
            return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
        }

        // Get User Name (Handle old tokens that might not have the name field)
        let userName = reviewerName?.trim() || decoded.name || 'Anonymous';


        const review = await Review.create({
            product: id,
            user: decoded.id,
            userName: userName,
            rating,
            comment
        });

        // Update Product aggregate rating and review count
        const allReviews = await Review.find({ product: id, status: 'approved' });
        const totalRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

        await Product.findByIdAndUpdate(id, {
            rating: avgRating.toFixed(1),
            reviews: allReviews.length
        });

        return NextResponse.json({ success: true, review });
    } catch (error: any) {
        console.error("Review Error:", error);
        return NextResponse.json({ message: error.message || 'Error posting review' }, { status: 500 });
    }
}
