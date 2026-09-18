// Visit derivation, ported from the agentic-sdlc admin (src/lib/visitAnalytics.ts).

const DEFAULT_SESSION_GAP_MS = 30 * 60 * 1000;
const MIN_HUMAN_DWELL_SECONDS = 8;

type VisitActivityRow = {
  timestamp: string;
  readerId: string;
  event: string;
  duration_seconds?: string;
  country?: string;
  page?: string;
};

type InteractionRow = {
  timestamp: string;
  readerId: string;
  event: string;
};

export interface DerivedVisit {
  readerId: string;
  startedAt: string;
  endedAt: string;
  pageViews: number;
  dwellSeconds: number;
  interactions: number;
  qualified: boolean;
  country: string;
  pageSequence: string[];
}

type Activity = {
  at: number;
  timestamp: string;
  kind: 'page_view' | 'dwell' | 'interaction';
  durationSeconds: number;
  country: string;
  page: string;
};

/**
 * Derive browser visits from raw activity instead of trusting a tab-scoped
 * session id. Activity from the same visitor stays in one visit until there is
 * a 30-minute inactivity gap, so dwell flushed by a sibling tab can still
 * qualify the visit without rewriting the raw events.
 *
 * A visit qualifies as human with at least 8s of active dwell, a second page
 * view, or an interaction (e.g. a form submission).
 */
export function deriveVisits(
  visits: VisitActivityRow[],
  events: InteractionRow[] = [],
  sessionGapMs = DEFAULT_SESSION_GAP_MS,
): DerivedVisit[] {
  const byReader = new Map<string, Activity[]>();

  function add(readerId: string, activity: Activity) {
    if (!readerId || !Number.isFinite(activity.at)) return;
    const key = readerId.toLowerCase();
    const current = byReader.get(key) ?? [];
    current.push(activity);
    byReader.set(key, current);
  }

  visits.forEach((row) => {
    const at = new Date(row.timestamp).getTime();
    if (row.event === 'page_visit') {
      add(row.readerId, { at, timestamp: row.timestamp, kind: 'page_view', durationSeconds: 0, country: row.country ?? '', page: row.page ?? '' });
      return;
    }
    if (row.event !== 'page_leave') return;
    const durationSeconds = Number(row.duration_seconds);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return;
    add(row.readerId, { at, timestamp: row.timestamp, kind: 'dwell', durationSeconds, country: row.country ?? '', page: row.page ?? '' });
  });

  events.forEach((row) => {
    add(row.readerId, { at: new Date(row.timestamp).getTime(), timestamp: row.timestamp, kind: 'interaction', durationSeconds: 0, country: '', page: '' });
  });

  const result: DerivedVisit[] = [];
  byReader.forEach((activities, readerId) => {
    activities.sort((a, b) => a.at - b.at);
    let group: Activity[] = [];

    function finishGroup() {
      if (group.length === 0) return;
      const pageViews = group.filter((item) => item.kind === 'page_view');
      if (pageViews.length === 0) {
        group = [];
        return;
      }
      const dwellSeconds = group.reduce((sum, item) => sum + (item.kind === 'dwell' ? item.durationSeconds : 0), 0);
      const interactions = group.filter((item) => item.kind === 'interaction').length;
      const firstPageView = pageViews[0];
      const pageSequence = pageViews.reduce<string[]>((pages, item) => {
        if (!item.page || pages[pages.length - 1] === item.page) return pages;
        pages.push(item.page);
        return pages;
      }, []);
      result.push({
        readerId,
        startedAt: firstPageView.timestamp,
        endedAt: group[group.length - 1].timestamp,
        pageViews: pageViews.length,
        dwellSeconds,
        interactions,
        qualified: dwellSeconds >= MIN_HUMAN_DWELL_SECONDS || pageViews.length >= 2 || interactions > 0,
        country: firstPageView.country,
        pageSequence,
      });
      group = [];
    }

    activities.forEach((activity) => {
      const previous = group[group.length - 1];
      if (previous && activity.at - previous.at > sessionGapMs) finishGroup();
      group.push(activity);
    });
    finishGroup();
  });

  return result.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}
