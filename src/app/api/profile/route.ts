import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const res = await query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ profile: res.rows[0] });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      full_name,
      title,
      tagline,
      location,
      email,
      phone1,
      phone2,
      github,
      linkedin,
      bio_summary,
      education_degree,
      education_institution,
      education_details,
      avatar_url
    } = data;

    const res = await query(
      `UPDATE profile SET 
        full_name = COALESCE($1, full_name),
        title = COALESCE($2, title),
        tagline = COALESCE($3, tagline),
        location = COALESCE($4, location),
        email = COALESCE($5, email),
        phone1 = COALESCE($6, phone1),
        phone2 = COALESCE($7, phone2),
        github = COALESCE($8, github),
        linkedin = COALESCE($9, linkedin),
        bio_summary = COALESCE($10, bio_summary),
        education_degree = COALESCE($11, education_degree),
        education_institution = COALESCE($12, education_institution),
        education_details = COALESCE($13, education_details),
        avatar_url = COALESCE($14, avatar_url),
        updated_at = NOW()
      WHERE id = (SELECT id FROM profile ORDER BY id ASC LIMIT 1)
      RETURNING *`,
      [
        full_name,
        title,
        tagline,
        location,
        email,
        phone1,
        phone2,
        github,
        linkedin,
        bio_summary,
        education_degree,
        education_institution,
        education_details,
        avatar_url
      ]
    );

    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
