import { NextResponse } from 'next/server';
import { getSessionCookieName } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete(getSessionCookieName());
  return response;
}
