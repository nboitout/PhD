import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, markInternalTraffic } from '@/lib/internalTraffic';

/**
 * Admin route protection. Every /admin path except the login page needs the
 * httpOnly admin_session cookie; without it the request is redirected to
 * /admin/login, so a dashboard page's HTML never leaves the server.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const session = req.cookies.get(ADMIN_SESSION_COOKIE);
  if (!session || session.value !== 'authenticated') {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Mark the admin's own browser so their later public browsing is excluded
  // from the visitor-analytics sheet.
  const res = NextResponse.next();
  markInternalTraffic(res);
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
