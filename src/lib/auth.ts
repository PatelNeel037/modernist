import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function verifyAuth(req?: Request) {
    let token: string | undefined;

    if (req) {
        const authHeader = req.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        try {
            const cookieStore = await cookies();
            token = cookieStore.get("token")?.value;
        } catch (e) {
            // cookies() might throw if called in a context where it is not available
        }
    }

    if (!token || token === 'undefined' || token === 'null') {
        throw new Error("Authentication token required. Please login.");
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (e: any) {
        console.error("Token Verification Failed:", e.message);
        throw new Error("Invalid or expired session. Please login again.");
    }
}

export async function verifyAdmin(req?: Request) {
    const decoded = await verifyAuth(req);

    if (decoded.role !== "admin") {
        throw new Error("Permission denied: Admin access required.");
    }

    return decoded;
}
