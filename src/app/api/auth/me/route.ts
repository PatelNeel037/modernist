import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function GET(req: any) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password").lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Adapt to `id` for consistency in frontend
        return NextResponse.json({ user: { ...user, id: user._id.toString() } });
    } catch (error) {
        console.error("Auth Me Error:", error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}
