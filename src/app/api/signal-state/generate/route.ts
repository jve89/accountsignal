import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { buildDailySignalState } from '@/lib/snapshot/buildDailySignalState';
import { PLATFORMS } from '@/lib/platforms';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const today = todayISO();

  const { data: snapshots, error } = await supabase
    .from('daily_snapshots')
    .select('platform, signal_level')
    .eq('snapshot_date', today);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'failed to load daily snapshots' },
      { status: 500 }
    );
  }

  const observedPlatforms = snapshots?.map(s => s.platform) ?? [];
  const expectedPlatforms = PLATFORMS;
  const isPartial =
    observedPlatforms.length < expectedPlatforms.length;

  // ─────────────────────────────────────────────
  // Case 1: NO snapshots at all (early / failed day)
  // ─────────────────────────────────────────────
  if (!snapshots || snapshots.length === 0) {
    const { error: insertError } = await supabase
      .from('daily_signal_state')
      .upsert(
        {
          snapshot_date: today,
          global_activity_level: 'calm',
          confidence: 'low',
          platforms_spiking: [],
          platforms_elevated: [],
          platforms_normal: [],
          narrative_note:
            'Insufficient data collected so far today to detect cross-platform enforcement activity.',
          platforms_expected: expectedPlatforms,
          platforms_observed: [],
          generated_from_partial_data: true
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
      partial: true,
      reason: 'no snapshots available yet'
    });
  }

  // ─────────────────────────────────────────────
  // Case 2: SOME snapshots exist (partial or full)
  // ─────────────────────────────────────────────
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
