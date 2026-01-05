export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'x';

export interface DailySnapshot {
  platform: Platform;
  snapshotDate: string; // YYYY-MM-DD

  signalLevel: 'normal' | 'elevated' | 'spike';
  signalConfidence: 'low' | 'moderate' | 'high';

  enforcementType: 'automated' | 'manual' | 'policy_update' | 'unknown';
  enforcementConfidence: 'low' | 'moderate' | 'high';

  primaryPattern:
    | 'activity_spike'
    | 'login_change'
    | 'policy_signal'
    | 'no_clear_trigger';

  secondaryPatterns?: string[];

  summaryNote: string;
  sourcesUsed: string[];

  createdAt: string;
}
