import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { assembleReport } from '@/lib/report/assemble';
import { Platform } from '@/types/DailySnapshot';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getSnapshotForDate(platform: Platform, date: string) {
  const { data, error } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('platform', platform)
    .eq('snapshot_date', date)
    .single();

  if (error || !data) return null;
  return data;
}

async function getLatestSnapshot(platform: Platform) {
  const { data, error } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('platform', platform)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

async function getDailySignalState(date: string) {
  const { data, error } = await supabase
    .from('daily_signal_state')
    .select('*')
    .eq('snapshot_date', date)
    .single();

  if (error || !data) return null;
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as Platform | null;

  if (!platform) {
    return NextResponse.json(
      { error: 'platform required' },
      { status: 400 }
    );
  }

  // 1. Try today’s snapshot
  let snapshot = await getSnapshotForDate(platform, todayISO());

  // 2. Fallback to latest available snapshot
  if (!snapshot) {
    snapshot = await getLatestSnapshot(platform);
  }

  // 3. Nothing exists
  if (!snapshot) {
    return NextResponse.json(
      { error: 'no completed snapshot available' },
      { status: 404 }
    );
  }

  // 4. Fetch global signal state (best effort)
  const globalState = await getDailySignalState(snapshot.snapshot_date);

  // 5. Assemble base report
  const report = assembleReport({
    platform: snapshot.platform,
    snapshotDate: snapshot.snapshot_date,
    signalLevel: snapshot.signal_level,
    signalConfidence: snapshot.signal_confidence,
    enforcementType: snapshot.enforcement_type,
    enforcementConfidence: snapshot.enforcement_confidence,
    primaryPattern: snapshot.primary_pattern,
    secondaryPatterns: snapshot.secondary_patterns,
    summaryNote: snapshot.summary_note,
    sourcesUsed: snapshot.sources_used,
    createdAt: snapshot.created_at
  });

  // 6. Inject cross-platform context (text-only, no schema change)
  if (globalState) {
    report.sections[0].body +=
      `\n\nCross-platform context: Overall enforcement activity today is classified as "${globalState.global_activity_level}".`;

    if (globalState.generated_from_partial_data) {
      report.disclaimer +=
        ' Note: This assessment was generated from partial platform data and may be updated as additional signals are observed.';
    }
  }

  return NextResponse.json(report);
}
