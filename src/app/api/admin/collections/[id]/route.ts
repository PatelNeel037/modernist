import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Collection } from "@/models/Collection";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        // Prevent ID from being modified
        delete body._id;

        const updatedCollection = await Collection.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedCollection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCollection);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedCollection = await Collection.findByIdAndDelete(id);

        if (!deletedCollection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Collection deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
