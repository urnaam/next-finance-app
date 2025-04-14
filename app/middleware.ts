import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const isAdminPage = url.startsWith('/admin');

  // Check if user is trying to access admin page
  if (isAdminPage) {
    const isLoggedIn = request.cookies.has('auth_token'); // Check if user is logged in
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next(); // Allow the request if user is logged in
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // Use `:path*` for wildcard matching
};
