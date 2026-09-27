import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, category, description, live_url, github_url, tech_stack, image_url, featured, sort_order } = body;

    const res = await query(
      `UPDATE projects SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        description = COALESCE($3, description),
        live_url = COALESCE($4, live_url),
        github_url = COALESCE($5, github_url),
        tech_stack = COALESCE($6, tech_stack),
        image_url = COALESCE($7, image_url),
        featured = COALESCE($8, featured),
        sort_order = COALESCE($9, sort_order)
      WHERE id = $10
      RETURNING *`,
      [title, category, description, live_url, github_url, tech_stack, image_url, featured, sort_order, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: res.rows[0] });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const res = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
