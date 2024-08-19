import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    const userData = await req.cookies.get('userData');

    // Allow public paths and API routes
    if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    // Check if userData cookie exists
    if (!userData) {
        console.log('Redirecting to login because userData cookie is missing');
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
