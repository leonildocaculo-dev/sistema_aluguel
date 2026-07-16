import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Protected routes matcher prefix
  const protectedRoutes = ['/checkout', '/admin', '/owner', '/dashboard'];

  // Check if current path matches any protected route
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      // Not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to these routes
  matcher: [
    '/checkout/:path*', 
    '/admin/:path*', 
    '/owner/:path*', 
    '/dashboard/:path*'
  ],
};
