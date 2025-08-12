import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // Disable in production for safety
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

    await connectDB();

    // Only allow if no users exist yet (bootstrap)
    const count = await User.countDocuments({});
    if (count > 0) return NextResponse.json({ error: 'already_initialized' }, { status: 403 });

    const emailNorm = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email: emailNorm }).lean();
    if (exists) return NextResponse.json({ error: 'user_exists' }, { status: 409 });

    const passwordHash = await bcrypt.hash(String(password), 10);
    await User.create({ name: String(name).trim(), email: emailNorm, passwordHash, role: 'admin' });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'create_failed', message: e?.message || 'error' }, { status: 500 });
  }
}
