import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;
    const uploadType = (formData.get('type') as string) || 'profile'; // 'profile' or 'project'

    let finalUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, sanitizedName);
      await writeFile(filePath, buffer);

      finalUrl = `/uploads/${sanitizedName}`;
    } else if (imageUrl) {
      finalUrl = imageUrl;
    } else {
      return NextResponse.json({ error: 'No file or image URL provided' }, { status: 400 });
    }

    // If uploading for profile, also update profile avatar directly
    if (uploadType === 'profile') {
      await query(
        `UPDATE profile SET avatar_url = $1, updated_at = NOW() 
         WHERE id = (SELECT id FROM profile ORDER BY id ASC LIMIT 1)`,
        [finalUrl]
      );
    }

    return NextResponse.json({ success: true, url: finalUrl, avatar_url: finalUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
