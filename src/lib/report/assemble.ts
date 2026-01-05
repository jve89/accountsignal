import { DailySnapshot } from '@/types/DailySnapshot';
import { AccountSignalReport } from '@/types/Report';

export function assembleReport(snapshot: DailySnapshot): AccountSignalReport {
  const headline =
    snapshot.signalLevel === 'spike'
      ? `Elevated enforcement activity detected`
      : snapshot.signalLevel === 'elevated'
      ? `Higher-than-normal enforcement signals`
      : `No abnormal enforcement signals detected`;

  const sections = [
    {
      title: 'Current signal overview',
      body: snapshot.summaryNote
    },
    {
      title: 'What this usually means',
      body: meaningFor(snapshot)
    },
    {
      title: 'Recommended next step',
      body: recommendationFor(snapshot)
    },
    {
      title: 'What to avoid',
      body: avoidFor(snapshot)
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

function meaningFor(s: DailySnapshot): string {
  if (s.enforcementType === 'automated') {
    return 'Signals suggest automated enforcement activity. In these periods, reviews are typically processed in batches and initial appeals may not receive immediate responses.';
  }

  if (s.enforcementType === 'policy_update') {
    return 'Signals align with a policy or enforcement update. These events often affect multiple accounts simultaneously.';
  }

  return 'No strong indicators point to a specific enforcement mechanism at this time.';
}

function recommendationFor(s: DailySnapshot): string {
  if (s.signalLevel === 'spike') {
    return 'Submit one clear appeal if available and allow time for automated review queues to process before taking further action.';
  }

  return 'Avoid rapid repeated actions and allow the platform’s review process time to complete.';
}

function avoidFor(_: DailySnapshot): string {
  return 'Avoid submitting multiple appeals in quick succession, creating replacement accounts, or using third-party recovery services promising guaranteed outcomes.';
}
