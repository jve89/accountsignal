import { DailySnapshot } from '@/types/DailySnapshot';
import { AccountSignalReport } from '@/types/Report';

type DailySignalState = {
  snapshot_date: string;
  global_activity_level: 'calm' | 'elevated' | 'spike';
  confidence: 'low' | 'moderate' | 'high';
  platforms_spiking: string[];
  platforms_elevated: string[];
  platforms_normal: string[];
  narrative_note: string;
};

export function assembleReport(
  snapshot: DailySnapshot,
  dailySignalState?: DailySignalState | null
): AccountSignalReport {
  const headline = headlineFor(snapshot, dailySignalState);

  const sections = [
    {
      title: 'Current signal overview',
      body: overviewFor(snapshot, dailySignalState)
    },
    {
      title: 'What this usually means',
      body: meaningFor(snapshot, dailySignalState)
    },
    {
      title: 'Recommended next step',
      body: recommendationFor(snapshot, dailySignalState)
    },
    {
      title: 'What to avoid',
      body: avoidFor()
    }
  ];

  return {
    platform: snapshot.platform,
    snapshotDate: snapshot.snapshotDate,
    headline,
    confidence: snapshot.signalConfidence,
    sections,
    disclaimer:
      'This report is informational only and based on observed public patterns. AccountSignal does not have access to internal platform systems and cannot guarantee outcomes.'
  };
}

/* ---------- helpers ---------- */

function headlineFor(
  s: DailySnapshot,
  global?: DailySignalState | null
): string {
  if (global?.global_activity_level === 'spike') {
    return 'Widespread enforcement activity detected across platforms';
  }

  if (s.signalLevel === 'spike') {
    return 'Elevated enforcement activity detected';
  }

  if (s.signalLevel === 'elevated') {
    return 'Higher-than-normal enforcement signals';
  }

  return 'No abnormal enforcement signals detected';
}

function overviewFor(
  s: DailySnapshot,
  global?: DailySignalState | null
): string {
  if (global) {
    return `${s.summaryNote} ${global.narrative_note}`;
  }

  return s.summaryNote;
}

function meaningFor(
  s: DailySnapshot,
  global?: DailySignalState | null
): string {
  if (global?.global_activity_level === 'spike') {
    return 'Multiple platforms are showing elevated enforcement signals. During such periods, automated systems are often active and individual account outcomes may be delayed or grouped.';
  }

  if (s.enforcementType === 'automated') {
    return 'Signals suggest automated enforcement activity. In these periods, reviews are typically processed in batches and initial appeals may not receive immediate responses.';
  }

  if (s.enforcementType === 'policy_update') {
    return 'Signals align with a policy or enforcement update. These events often affect multiple accounts simultaneously.';
  }

  return 'No strong indicators point to a specific enforcement mechanism at this time.';
}

function recommendationFor(
  s: DailySnapshot,
  global?: DailySignalState | null
): string {
  if (global?.global_activity_level === 'spike') {
    return 'Given broader platform activity, avoid repeated actions. Submit at most one clear appeal if available and allow time for review queues to process.';
  }

  if (s.signalLevel === 'spike') {
    return 'Submit one clear appeal if available and allow time for automated review queues to process before taking further action.';
  }

  return 'Avoid rapid repeated actions and allow the platform’s review process time to complete.';
}

function avoidFor(): string {
  return 'Avoid submitting multiple appeals in quick succession, creating replacement accounts, or using third-party recovery services promising guaranteed outcomes.';
}
