import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/verifyToken'; // Optional

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const isProtected = url.startsWith('/admin') || url.startsWith('/dashboard');
  const token = request.cookies.get('auth_token')?.value;

  if (isProtected && !token) {
    // If not logged in, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Optional: Add real token verification
  if (token && !verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
