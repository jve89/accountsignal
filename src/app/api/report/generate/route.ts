import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { assembleReport } from '@/lib/report/assemble';
import { Platform } from '@/types/DailySnapshot';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as Platform;

  if (!platform) {
    return NextResponse.json(
      { error: 'platform required' },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('platform', platform)
    .eq('snapshot_date', today)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'snapshot not available' },
      { status: 404 }
    );
  }

  const report = assembleReport({
    platform: data.platform,
    snapshotDate: data.snapshot_date,
    signalLevel: data.signal_level,
    signalConfidence: data.signal_confidence,
    enforcementType: data.enforcement_type,
    enforcementConfidence: data.enforcement_confidence,
    primaryPattern: data.primary_pattern,
    secondaryPatterns: data.secondary_patterns,
    summaryNote: data.summary_note,
    sourcesUsed: data.sources_used,
    createdAt: data.created_at
  });

  return NextResponse.json(report);
}
