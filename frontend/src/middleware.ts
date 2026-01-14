import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/v1')) {
        console.log("🔴 [MIDDLEWARE VIVO] --------------------------------");
        console.log("👉 Petición detectada:", request.nextUrl.pathname);
        console.log("👉 INTERNAL_API_URL:", process.env.INTERNAL_API_URL || "VACÍA/UNDEFINED");
        console.log("👉 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
        console.log("----------------------------------------------------");
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/api/v1/:path*',
};