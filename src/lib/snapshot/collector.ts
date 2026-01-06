import { Platform } from '@/types/DailySnapshot';
import { PLATFORM_SOURCES } from '@/lib/platforms';

export interface CollectedSignals {
  mentionCount24h: number;
  baseline14d: number;
  sources: string[];
}

const REDDIT_SEARCH_BASE = 'https://www.reddit.com/search/?q=';

/**
 * Keywords intentionally conservative.
 * We care about enforcement *signals*, not drama.
 */
const PLATFORM_KEYWORDS: Record<Platform, string[]> = {
  instagram: [
    'instagram account suspended',
    'instagram account disabled',
    'instagram appeal ignored'
  ],
  facebook: [
    'facebook account disabled',
    'facebook ads account suspended',
    'facebook business manager restricted'
  ],
  tiktok: [
    'tiktok account banned',
    'tiktok account suspended'
  ],
  x: [
    'twitter account suspended',
    'x account locked'
  ]
};

/**
 * Fetch Reddit HTML and extract result count.
 * Uses conservative parsing — no fragile DOM assumptions.
 */
async function fetchRedditCount(
  query: string,
  timeFilter: 'day' | 'month'
): Promise<number> {
  const url =
    REDDIT_SEARCH_BASE +
    encodeURIComponent(query) +
    `&sort=new&t=${timeFilter}`;

  try {
    const res = await fetch(url, {
      headers: {
        // Reddit blocks generic fetchers without this
        'User-Agent':
          'Mozilla/5.0 (compatible; AccountSignal/1.0; +https://accountsignal.app)'
      }
    });

    if (!res.ok) return 0;

    const html = await res.text();

    /**
     * We count post result containers.
     * This is intentionally approximate but stable.
     */
    const matches = html.match(/data-testid="post-container"/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

export async function collectSignals(
  platform: Platform
): Promise<CollectedSignals> {
  const keywords = PLATFORM_KEYWORDS[platform] ?? [];

  let mentionCount24h = 0;
  let baseline14dTotal = 0;

  for (const keyword of keywords) {
    // Last 24 hours
    const dayCount = await fetchRedditCount(keyword, 'day');
    mentionCount24h += dayCount;

    // Last 30 days → approximate 14-day baseline
    const monthCount = await fetchRedditCount(keyword, 'month');
    baseline14dTotal += Math.round((monthCount / 30) * 14);
  }

  // Defensive minimums — avoids divide-by-zero logic later
  const baseline14d = Math.max(baseline14dTotal, 5);

  return {
    mentionCount24h,
    baseline14d,
    sources: PLATFORM_SOURCES[platform]
  };
}
