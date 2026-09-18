'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId, getSessionUtm } from '@/lib/session';

export default function VisitTracker() {
  const pathname = usePathname();

  // Mutable refs — never trigger re-renders
  const prevPage = useRef(pathname);
  const activeMs = useRef(0);
  const lastVisible = useRef<number | null>(null);

  // Set up visibility + pagehide handlers once on mount
  useEffect(() => {
    lastVisible.current = document.visibilityState === 'visible' ? Date.now() : null;

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        lastVisible.current = Date.now();
      } else {
        // Going to the background is the last reliable moment to report dwell
        // on mobile, where `pagehide` frequently never fires.
        sendLeave(prevPage.current);
      }
    }

    function sendLeave(page: string) {
      if (page.startsWith('/admin')) return;
      if (lastVisible.current !== null) {
        activeMs.current += Date.now() - lastVisible.current;
        lastVisible.current = null;
      }
      const seconds = Math.round(activeMs.current / 1000);
      activeMs.current = 0;
      if (seconds < 1) return;
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'page_leave', page, duration_seconds: seconds, sessionId: getSessionId() }),
        keepalive: true,
      }).catch(() => {});
    }

    function onPageHide() { sendLeave(prevPage.current); }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  // On SPA navigation: flush dwell time for the page being left, reset timer
  useEffect(() => {
    const current = pathname;
    const prev = prevPage.current;
    if (prev === current) return;
    prevPage.current = current;

    if (lastVisible.current !== null) {
      activeMs.current += Date.now() - lastVisible.current;
      lastVisible.current = null;
    }
    const seconds = Math.round(activeMs.current / 1000);
    activeMs.current = 0;
    lastVisible.current = document.visibilityState === 'visible' ? Date.now() : null;

    if (seconds >= 1 && !prev.startsWith('/admin')) {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'page_leave', page: prev, duration_seconds: seconds, sessionId: getSessionId() }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  // Fire page_visit on mount and on route change — skip admin pages
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, sessionId: getSessionId(), utm: getSessionUtm() }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
