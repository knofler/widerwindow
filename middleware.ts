import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin'];

function getOrigin(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  return host ? `${proto}://${host}` : undefined;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const requiresAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  // Edge-safe auth check: presence of token cookie only.
  const hasToken = req.cookies.get('token');
  if (hasToken) return NextResponse.next();

  const origin = getOrigin(req) || req.nextUrl.origin;
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('next', pathname + (search || ''));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
