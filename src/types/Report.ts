import { Platform } from './DailySnapshot';

export interface AccountSignalReport {
  platform: Platform;
  snapshotDate: string;

  headline: string;
  confidence: 'low' | 'moderate' | 'high';

  sections: {
    title: string;
    body: string;
  }[];

  disclaimer: string;
}
