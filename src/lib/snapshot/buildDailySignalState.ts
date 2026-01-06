import { Platform } from '@/types/DailySnapshot';

export type DailySignalStateInput = {
  snapshotDate: string;
  snapshots: {
    platform: Platform;
    signal_level: string;
  }[];
};

export type DailySignalState = {
  snapshot_date: string;
  global_activity_level: 'calm' | 'elevated' | 'spike';
  confidence: 'low' | 'moderate' | 'high';
  platforms_spiking: Platform[];
  platforms_elevated: Platform[];
  platforms_normal: Platform[];
  narrative_note: string;
};

export function buildDailySignalState(
  input: DailySignalStateInput
): DailySignalState {
  const platforms_spiking: Platform[] = [];
  const platforms_elevated: Platform[] = [];
  const platforms_normal: Platform[] = [];

  for (const s of input.snapshots) {
    if (s.signal_level === 'spike') {
      platforms_spiking.push(s.platform);
    } else if (s.signal_level === 'elevated') {
      platforms_elevated.push(s.platform);
    } else {
      platforms_normal.push(s.platform);
    }
  }

  // Global activity level
  let global_activity_level: 'calm' | 'elevated' | 'spike' = 'calm';

  if (platforms_spiking.length >= 2) {
    global_activity_level = 'spike';
  } else if (
    platforms_spiking.length === 1 ||
    platforms_elevated.length >= 2
  ) {
    global_activity_level = 'elevated';
  }

  // Confidence
  const affected =
    platforms_spiking.length + platforms_elevated.length;

  let confidence: 'low' | 'moderate' | 'high' = 'low';
  if (affected >= 3) confidence = 'high';
  else if (affected === 2) confidence = 'moderate';

  // Narrative
  let narrative_note = 'No unusual cross-platform enforcement activity observed today.';

  if (global_activity_level === 'spike') {
    narrative_note =
      'Multiple platforms show elevated enforcement activity today, suggesting broad automated or policy-driven enforcement.';
  } else if (global_activity_level === 'elevated') {
    narrative_note =
      'Some platforms show above-baseline enforcement signals. This may reflect targeted or partial enforcement activity.';
  }

  return {
    snapshot_date: input.snapshotDate,
    global_activity_level,
    confidence,
    platforms_spiking,
    platforms_elevated,
    platforms_normal,
    narrative_note
  };
}
