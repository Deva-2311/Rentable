import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In Next.js middleware, we can't easily decode JWTs without a lightweight library like jose
// because standard jsonwebtoken uses Node core modules not available in Edge runtime.
// For MVP frontend routing protection, we'll do basic path checks based on cookies if available.
// If not using cookies, middleware protection is limited and we must rely on client-side protection.

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Owner Routes
  if (path.startsWith('/owner')) {
    if (!token || (role !== 'owner' && role !== 'admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Borrower Routes
  if (path.startsWith('/borrower')) {
    if (!token || (role !== 'borrower' && role !== 'admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If logged in, don't allow access to login/signup
  if (token && (path === '/login' || path === '/signup')) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (role === 'owner') return NextResponse.redirect(new URL('/owner/dashboard', request.url));
    if (role === 'borrower') return NextResponse.redirect(new URL('/borrower/dashboard', request.url));
  }

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
