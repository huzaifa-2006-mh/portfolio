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
    const { role, company, duration, description, bullets, sort_order } = body;

    const bulletList = Array.isArray(bullets)
      ? bullets
      : (typeof bullets === 'string' ? bullets.split('\n').filter(Boolean) : undefined);

    const res = await query(
      `UPDATE experiences SET
        role = COALESCE($1, role),
        company = COALESCE($2, company),
        duration = COALESCE($3, duration),
        description = COALESCE($4, description),
        bullets = COALESCE($5, bullets),
        sort_order = COALESCE($6, sort_order)
      WHERE id = $7
      RETURNING *`,
      [role, company, duration, description, bulletList, sort_order, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, experience: res.rows[0] });
  } catch (error: any) {
    console.error('Update experience error:', error);
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
    const res = await query('DELETE FROM experiences WHERE id = $1 RETURNING id', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Experience deleted' });
  } catch (error: any) {
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
