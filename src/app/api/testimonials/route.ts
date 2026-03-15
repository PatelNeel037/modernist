import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';
        
        const query = showAll ? {} : { isActive: true };
        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const testimonial = await Testimonial.create(body);
        return NextResponse.json({ success: true, testimonial });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to create testimonial' }, { status: 500 });
    }
}
