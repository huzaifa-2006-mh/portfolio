import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const res = await query('SELECT * FROM experiences ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ experiences: res.rows });
  } catch (error: any) {
    console.error('Fetch experiences error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { role, company, duration, description, bullets, sort_order } = body;

    if (!role || !company || !duration) {
      return NextResponse.json({ error: 'Role, company and duration are required' }, { status: 400 });
    }

    const bulletList = Array.isArray(bullets)
      ? bullets
      : (typeof bullets === 'string' ? bullets.split('\n').filter(Boolean) : []);

    const res = await query(
      `INSERT INTO experiences (role, company, duration, description, bullets, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [role, company, duration, description || '', bulletList, sort_order || 0]
    );

    return NextResponse.json({ success: true, experience: res.rows[0] });
  } catch (error: any) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
