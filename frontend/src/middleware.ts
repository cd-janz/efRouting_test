import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    if (pathname.startsWith('/api/v1')) {
        const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
        console.log(`🚀 [MIDDLEWARE PROXY] Redirigiendo ${pathname} -> ${backendUrl}`);
        if (!backendUrl) {
            return NextResponse.json(
                { error: 'Configuration Error: Backend URL missing' },
                { status: 500 }
            );
        }
        const targetUrl = new URL(pathname + search, backendUrl);

        return NextResponse.rewrite(targetUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/v1/:path*',
};