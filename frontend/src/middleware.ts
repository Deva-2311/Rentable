import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In Next.js middleware, we can't easily decode JWTs without a lightweight library like jose
// because standard jsonwebtoken uses Node core modules not available in Edge runtime.
// For MVP frontend routing protection, we'll do basic path checks based on cookies if available.
// If not using cookies, middleware protection is limited and we must rely on client-side protection.

export function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  
  // Basic route protection logic will go here
  // For now, let requests pass through. We will implement robust protection in Phase 3.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/borrower/:path*',
    '/owner/:path*',
    '/admin/:path*',
    '/login',
    '/signup'
  ],
};
