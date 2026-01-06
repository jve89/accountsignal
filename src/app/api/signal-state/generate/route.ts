import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { buildDailySignalState } from '@/lib/snapshot/buildDailySignalState';
import { PLATFORMS } from '@/lib/platforms';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: snapshots, error } = await supabase
    .from('daily_snapshots')
    .select('platform, signal_level')
    .eq('snapshot_date', today);

  if (error || !snapshots || snapshots.length === 0) {
    return NextResponse.json(
      { error: 'daily snapshots not available' },
      { status: 404 }
    );
  }

  const observedPlatforms = snapshots.map(s => s.platform);
  const expectedPlatforms = PLATFORMS;
  const isPartial =
    observedPlatforms.length < expectedPlatforms.length;

  const state = buildDailySignalState({
    snapshotDate: today,
    snapshots
  });

  const { error: insertError } = await supabase
    .from('daily_signal_state')
    .upsert(
      {
        ...state,
        platforms_expected: expectedPlatforms,
        platforms_observed: observedPlatforms,
        generated_from_partial_data: isPartial
      },
      { onConflict: 'snapshot_date' }
    );

  if (insertError) {
    console.error(insertError);
    return NextResponse.json(
      { error: 'failed to store daily signal state' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    snapshotDate: today,
    partial: isPartial
  });
}
