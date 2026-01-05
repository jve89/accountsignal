import { Platform } from '@/types/DailySnapshot';
import { PLATFORM_SOURCES } from '@/lib/platforms';

export interface CollectedSignals {
  mentionCount24h: number;
  baseline14d: number;
  sources: string[];
}

export async function collectSignals(platform: Platform): Promise<CollectedSignals> {
  // v1: placeholder values (replace with real scraping next step)
  // This is NOT throwaway — shape is final.

  return {
    mentionCount24h: Math.floor(Math.random() * 50) + 10,
    baseline14d: 20,
    sources: PLATFORM_SOURCES[platform]
  };
}
