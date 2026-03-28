import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Collection } from "@/models/Collection";

export async function GET() {
    try {
        await connectDB();
        const collections = await Collection.find().sort({ order: 1 });
        return NextResponse.json(collections);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        
        if (!body.title || !body.subtitle || !body.img || !body.href || !body.className) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const collection = await Collection.create(body);
        return NextResponse.json(collection, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
