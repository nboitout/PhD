import type { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const INTERNAL_TRAFFIC_COOKIE = 'internal_traffic';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function hasInternalTrafficMarker(req: NextRequest): boolean {
  return !!req.cookies.get(INTERNAL_TRAFFIC_COOKIE) || !!req.cookies.get(ADMIN_SESSION_COOKIE);
}

export function markInternalTraffic(response: NextResponse): void {
  response.cookies.set(INTERNAL_TRAFFIC_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  });
}
