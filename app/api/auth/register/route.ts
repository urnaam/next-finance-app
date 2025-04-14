import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Missing or invalid username/password' },
        { status: 400 }
      );
    }

    const existingUser = db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username.trim());
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(
      username.trim(),
      hashedPassword
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
