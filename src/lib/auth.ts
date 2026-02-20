import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function verifyAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("No token");

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (e) {
        throw new Error("Invalid token");
    }
}

export async function verifyAdmin() {
    const decoded = await verifyAuth();

    if (decoded.role !== "admin") {
        throw new Error("Access denied");
    }

    return decoded;
}
