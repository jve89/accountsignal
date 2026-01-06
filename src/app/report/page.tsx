'use client';

import { useEffect, useState } from 'react';
import { AccountSignalReport } from '@/types/Report';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X (Twitter)' }
];

export default function ReportPage() {
  const [platform, setPlatform] = useState<string>('instagram');
  const [report, setReport] = useState<AccountSignalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReport(p: string) {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch(`/api/report/generate?platform=${p}`);

      if (!res.ok) {
        throw new Error('Report unavailable');
      }

      const data = await res.json();
      setReport(data);
    } catch {
      setError(
        'No completed signal snapshot is available yet. Signals update once per day.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport(platform);
  }, [platform]);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            AccountSignal report
          </h1>

          <p className="mt-2 text-slate-600">
            Daily enforcement signal overview based on publicly observable patterns.
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-purple-600 focus:ring-purple-600"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {loading && (
          <p className="text-sm text-slate-500">Loading report…</p>
        )}

        {error && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {error}
          </div>
        )}

        {report && (
          <article className="space-y-8">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm text-slate-500">
                {report.platform} · Last updated: {report.snapshotDate}
              </div>

              <h2 className="mt-2 text-xl font-medium text-slate-900">
                {report.headline}
              </h2>

              <div className="mt-2 text-sm text-slate-600">
                Confidence level: <strong>{report.confidence}</strong>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                Signals update once per day. This report reflects the most recent
                completed snapshot.
              </p>
            </div>

            {report.sections.map((s) => (
              <section
                key={s.title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <h3 className="font-medium text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </section>
            ))}

            <footer className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              <p>{report.disclaimer}</p>

              <p className="mt-4">
                AccountSignal is an intelligence tool by{' '}
                <a
                  href="https://accountappeal.net"
                  className="font-medium text-purple-600 hover:underline"
                >
                  AccountAppeal
                </a>
                .
              </p>
            </footer>
          </article>
        )}
      </div>
    </main>
  );
}
