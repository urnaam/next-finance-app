import { verifyToken } from '@/lib/verifyToken';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  'google-credentials.json'
);

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('auth_token'); // Get the cookie object
  const token = tokenCookie?.value; // Extract the value from the cookie object

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if no token
  }

  const decoded = verifyToken(token); // Pass the string token to verifyToken

  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if token is invalid
  }

  return NextResponse.next(); // Proceed if token is valid
}
