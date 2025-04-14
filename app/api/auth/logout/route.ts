import { NextResponse } from 'next/server';

export async function POST() {
  return new NextResponse(
    JSON.stringify({ message: 'Logged out successfully' }),
    {
      status: 200,
      headers: {
        'Set-Cookie': 'auth_token=; Max-Age=0; path=/; SameSite=Strict',
        'Content-Type': 'application/json',
      },
    }
  );
}
