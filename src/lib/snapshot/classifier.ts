import { CollectedSignals } from './collector';

export function classifySignals(signals: CollectedSignals) {
  const ratio = signals.mentionCount24h / signals.baseline14d;

  let signalLevel: 'normal' | 'elevated' | 'spike' = 'normal';
  if (ratio > 2.5) signalLevel = 'spike';
  else if (ratio > 1.3) signalLevel = 'elevated';

  return {
    signalLevel,
    signalConfidence: 'moderate' as const,
    enforcementType: 'automated' as const,
    enforcementConfidence: 'moderate' as const,
    primaryPattern: 'activity_spike' as const,
    secondaryPatterns: [],
    summaryNote:
      signalLevel === 'spike'
        ? 'Sharp increase in suspension-related reports compared to baseline.'
        : signalLevel === 'elevated'
        ? 'Noticeable increase in suspension-related reports compared to baseline.'
        : 'No unusual increase in suspension-related reports.'
  };
}
