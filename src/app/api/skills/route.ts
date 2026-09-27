import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM skill_groups ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ skills: res.rows });
  } catch (error: any) {
    console.error('Fetch skills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
