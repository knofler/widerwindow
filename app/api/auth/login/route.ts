import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signAuthToken } from '@/lib/auth';

function getOrigin(req: Request) {
  try {
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    if (host) return `${proto}://${host}`;
  } catch {}
  return undefined;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const next = url.searchParams.get('next') || '/admin/new';
    const origin = getOrigin(req) || url.origin;

    const contentType = req.headers.get('content-type') || '';
    let email: string = '';
    let password: string = '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = String(body?.email || '');
      password = String(body?.password || '');
    } else {
      const form = await req.formData();
      email = String(form.get('email') || '');
      password = String(form.get('password') || '');
    }

    if (!email || !password) {
      if (contentType.includes('application/json'))
        return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
      const back = new URL('/login', origin);
      back.searchParams.set('error', 'missing');
      back.searchParams.set('next', next);
      return NextResponse.redirect(back, { status: 303 });
    }

    const emailNorm = String(email).trim().toLowerCase();

    // Try DB user first
    await connectDB();
    const user: any = await User.findOne({ email: emailNorm }).lean();
    if (user) {
      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) {
        if (contentType.includes('application/json'))
          return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
        const back = new URL('/login', origin);
        back.searchParams.set('error', 'invalid');
        back.searchParams.set('next', next);
        return NextResponse.redirect(back, { status: 303 });
      }
      const token = signAuthToken({ sub: String(user._id), email: emailNorm, role: (user.role as any) || 'author', name: user.name });
      const dest = new URL(next, origin);
      const res = NextResponse.redirect(dest, { status: 303 });
      res.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // If no DB users exist at all, allow dev-only env-based admin (disabled in production)
    if (process.env.NODE_ENV !== 'production') {
      const count = await User.countDocuments({});
      if (count === 0) {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        if (ADMIN_EMAIL && ADMIN_PASSWORD && emailNorm === String(ADMIN_EMAIL).toLowerCase() && String(password) === ADMIN_PASSWORD) {
          const token = signAuthToken({ sub: 'admin', email: emailNorm, role: 'admin', name: 'Admin' });
          const dest = new URL(next, origin);
          const res = NextResponse.redirect(dest, { status: 303 });
          res.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: false,
            maxAge: 60 * 60 * 24 * 7,
          });
          return res;
        }
      }
    }

    if (contentType.includes('application/json'))
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    const back = new URL('/login', origin);
    back.searchParams.set('error', 'invalid');
    back.searchParams.set('next', next);
    return NextResponse.redirect(back, { status: 303 });
  } catch (e: any) {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json'))
      return NextResponse.json({ error: 'login_failed', message: e?.message || 'error' }, { status: 500 });
    const origin = getOrigin(req) || new URL(req.url).origin;
    const back = new URL('/login', origin);
    back.searchParams.set('error', 'server');
    return NextResponse.redirect(back, { status: 303 });
  }
}
