import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

interface User {
  id: number;
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username) as User | undefined;

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 400 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 400 }
    );
  }

  const authToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  const response = NextResponse.json({ message: 'Login successful' });

  // ✅ Set cookie properly using App Router
  response.cookies.set('auth_token', authToken, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/', // ensure it's accessible site-wide
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
