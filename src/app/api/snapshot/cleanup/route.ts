import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { error } = await supabase
    .from('daily_snapshots')
    .delete()
    .lt('snapshot_date', new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  if (error) {
    console.error('Cleanup failed', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  return NextResponse.json({ status: 'ok' });
}
