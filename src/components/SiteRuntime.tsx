'use client';

import { useEffect } from 'react';
// siteRuntime.js is the page's original vanilla script, kept as JS on purpose.
import { initSite } from '@/lib/siteRuntime';

/**
 * Starts the dissertation hub's own script — the theme switch, the printed
 * cover's fallback, the carousel and the opening panel — once React has
 * committed the markup it reaches for by id.
 *
 * It was a deferred <script> on the static page. It now returns a teardown, so
 * a client navigation to /admin takes the frame loop, the two observers and
 * every listener with it.
 */
export default function SiteRuntime() {
  useEffect(() => initSite() as () => void, []);
  return null;
}
