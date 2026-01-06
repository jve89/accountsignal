import { supabase } from "@/lib/supabase";
import { DailySnapshot } from "@/types/DailySnapshot";

export async function getLatestSnapshot(
  platform: string
): Promise<DailySnapshot | null> {
  const { data, error } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("platform", platform)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
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
    createdAt: data.created_at,
  };
}
