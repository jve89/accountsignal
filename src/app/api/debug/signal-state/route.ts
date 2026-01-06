import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_signal_state')
    .select('*')
    .eq('snapshot_date', today)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'no signal state for today' },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
