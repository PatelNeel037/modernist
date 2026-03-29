import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Homepage } from "@/models/Homepage";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        let data = await Homepage.findOne();
        if (!data) {
            // Return empty hero object if not found to prevent crashes
            return NextResponse.json({ 
                hero: {
                    tagline: 'The New Standard',
                    mainTitle: 'ELEVATED',
                    subTitle: 'Everyday Wear',
                    description: 'Premium fabrics. Uncompromising design. Redefining your wardrobe with essentials built for the modern lifestyle.',
                    bgImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
                    buttonText: 'Explore Collection',
                    buttonHref: '/shop'
                }
            });
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        
        let data = await Homepage.findOne();
        if (!data) {
            data = await Homepage.create(body);
        } else {
            data = await Homepage.findOneAndUpdate({}, { $set: body }, { new: true });
        }
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: (error as any).message || "Internal Server Error" }, { status: 500 });
    }
}
