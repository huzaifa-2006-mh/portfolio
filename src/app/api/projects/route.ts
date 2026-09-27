import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const res = await query('SELECT * FROM projects ORDER BY sort_order ASC, id DESC');
    return NextResponse.json({ projects: res.rows });
  } catch (error: any) {
    console.error('Fetch projects error:', error);
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
    const { title, category, description, live_url, github_url, tech_stack, image_url, featured, sort_order } = body;

    if (!title) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO projects (title, category, description, live_url, github_url, tech_stack, image_url, featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        category || 'Web Application',
        description || '',
        live_url || '',
        github_url || '',
        tech_stack || '',
        image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        featured !== false,
        sort_order || 0
      ]
    );

    return NextResponse.json({ success: true, project: res.rows[0] });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
