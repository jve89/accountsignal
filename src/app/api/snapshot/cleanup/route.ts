import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RETENTION_DAYS = 10;

function cutoffDateISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - RETENTION_DAYS);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const cutoff = cutoffDateISO();

  const { error, count } = await supabase
    .from("daily_snapshots")
    .delete({ count: "exact" })
    .lt("snapshot_date", cutoff);

  if (error) {
    console.error("Snapshot cleanup failed", {
      cutoff,
      error,
    });

    return NextResponse.json(
      { status: "error" },
      { status: 500 }
    );
  }

  console.log("Snapshot cleanup complete", {
    cutoff,
    deleted: count,
  });

  return NextResponse.json({
    status: "ok",
    deleted: count,
  });
}
