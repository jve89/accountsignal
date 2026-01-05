import { supabase } from '@/lib/supabase';
import { Platform, DailySnapshot } from '@/types/DailySnapshot';
import { collectSignals } from './collector';
import { classifySignals } from './classifier';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function generateSnapshotForPlatform(
  platform: Platform
): Promise<DailySnapshot> {
  const snapshotDate = todayISO();

  // 1. Check if snapshot already exists (idempotent)
  const { data: existing } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('platform', platform)
    .eq('snapshot_date', snapshotDate)
    .single();

  if (existing) {
    return mapRowToSnapshot(existing);
  }

  // 2. Collect signals
  const signals = await collectSignals(platform);

  // 3. Classify
  const classification = classifySignals(signals);

  // 4. Build snapshot
  const snapshot: Omit<DailySnapshot, 'createdAt'> = {
    platform,
    snapshotDate,
    signalLevel: classification.signalLevel,
    signalConfidence: classification.signalConfidence,
    enforcementType: classification.enforcementType,
    enforcementConfidence: classification.enforcementConfidence,
    primaryPattern: classification.primaryPattern,
    secondaryPatterns: classification.secondaryPatterns,
    summaryNote: classification.summaryNote,
    sourcesUsed: signals.sources
  };

  // 5. Persist
  const { data, error } = await supabase
    .from('daily_snapshots')
    .insert({
      platform: snapshot.platform,
      snapshot_date: snapshot.snapshotDate,
      signal_level: snapshot.signalLevel,
      signal_confidence: snapshot.signalConfidence,
      enforcement_type: snapshot.enforcementType,
      enforcement_confidence: snapshot.enforcementConfidence,
      primary_pattern: snapshot.primaryPattern,
      secondary_patterns: snapshot.secondaryPatterns ?? [],
      summary_note: snapshot.summaryNote,
      sources_used: snapshot.sourcesUsed
    })
    .select()
    .single();

    if (error || !data) {
    console.error('Snapshot insert failed', {
        platform: snapshot.platform,
        date: snapshot.snapshotDate,
        code: error?.code,
        message: error?.message
    });

    throw new Error('Snapshot persistence failed');
    }

  return mapRowToSnapshot(data);
}

function mapRowToSnapshot(row: any): DailySnapshot {
  return {
    platform: row.platform,
    snapshotDate: row.snapshot_date,
    signalLevel: row.signal_level,
    signalConfidence: row.signal_confidence,
    enforcementType: row.enforcement_type,
    enforcementConfidence: row.enforcement_confidence,
    primaryPattern: row.primary_pattern,
    secondaryPatterns: row.secondary_patterns,
    summaryNote: row.summary_note,
    sourcesUsed: row.sources_used,
    createdAt: row.created_at
  };
}
