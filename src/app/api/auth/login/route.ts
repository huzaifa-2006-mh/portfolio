import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionCookieName, getSessionValue } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Check DB or direct credentials
    const res = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
    
    let valid = false;
    if (res.rows.length > 0) {
      const user = res.rows[0];
      if (user.password === password) {
        valid = true;
      }
    } else if (username === 'huzaifa' && password === 'Sedil@1234') {
      valid = true;
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    response.cookies.set({
      name: getSessionCookieName(),
      value: getSessionValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
