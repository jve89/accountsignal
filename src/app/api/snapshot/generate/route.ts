import { NextResponse } from 'next/server';
import { PLATFORMS } from '@/lib/platforms';
import { generateSnapshotForPlatform } from '@/lib/snapshot/snapshot';

export async function GET() {
  const results = [];

  for (const platform of PLATFORMS) {
    try {
      const snapshot = await generateSnapshotForPlatform(platform);
      results.push({ platform, status: 'ok', snapshotDate: snapshot.snapshotDate });
    } catch (err) {
      console.error(`Snapshot generation failed for ${platform}`, err);
      results.push({ platform, status: 'error' });
    }
  }

  return NextResponse.json({ results });
}
