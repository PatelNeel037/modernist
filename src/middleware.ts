import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: any) {
    if (req.nextUrl.pathname.startsWith("/admin/login")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_for_development_only');
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
