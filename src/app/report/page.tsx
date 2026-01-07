'use client';

import { useEffect, useMemo, useState } from 'react';
import { AccountSignalReport } from '@/types/Report';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X (Twitter)' }
] as const;

function titleCasePlatform(p: string) {
  const found = PLATFORMS.find((x) => x.id === p);
  return found?.label ?? p;
}

function formatDate(iso: string) {
  // Keep it boring and predictable (YYYY-MM-DD) for now.
  // If you want locale formatting later, we can do that.
  return iso;
}

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
      const res = await fetch(`/api/report/generate?platform=${p}`, {
        cache: 'no-store'
      });

      if (!res.ok) throw new Error('Report unavailable');

      const data = (await res.json()) as AccountSignalReport;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const meta = useMemo(() => {
    if (!report) return null;
    return {
      platformLabel: titleCasePlatform(report.platform),
      date: formatDate(report.snapshotDate),
      confidence: report.confidence,
      headline: report.headline
    };
  }, [report]);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
        {/* Page header (screen only) */}
        <header className="mb-10 print:hidden">
          <h1 className="text-3xl font-medium tracking-tight text-slate-900">
            AccountSignal report
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Daily enforcement signal overview based on publicly observable patterns.
          </p>

          {/* Controls row */}
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr,220px] sm:items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-purple-600 focus:ring-purple-600"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex w-full items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              disabled={!report}
              title={!report ? 'Load a report first' : 'Print or save as PDF'}
            >
              Print / Save report
            </button>
          </div>
        </header>

        {/* States */}
        {loading && (
          <p className="text-sm text-slate-500 print:hidden">Loading report…</p>
        )}

        {error && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 print:hidden">
            {error}
          </div>
        )}

        {/* Document */}
        {report && meta && (
          <article
            className="
              rounded-lg border border-slate-200 bg-white shadow-sm
              print:rounded-none print:border-0 print:shadow-none
            "
          >
            {/* Document header */}
            <div className="border-b border-slate-200 px-8 py-8 print:px-0 print:py-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    AccountSignal report
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Platform: <span className="font-medium text-slate-900">{meta.platformLabel}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    Date:{' '}
                    <span className="font-medium text-slate-900">{meta.date}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    Confidence:{' '}
                    <span className="font-medium text-slate-900">{meta.confidence}</span>
                  </div>

                  <h2 className="mt-5 text-2xl font-medium leading-tight text-slate-900">
                    {meta.headline}
                  </h2>

                  <p className="mt-3 text-sm text-slate-600">
                    Signals update once per day. This report reflects the most recent
                    completed snapshot.
                  </p>
                </div>

                {/* Small print CTA only visible on screen (optional convenience) */}
                <div className="hidden print:hidden sm:block">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Print / Save
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 print:px-0">
              <div className="space-y-8">
                {report.sections.map((s, idx) => (
                  <section key={`${s.title}-${idx}`}>
                    <h3 className="text-sm font-semibold tracking-wide text-slate-900">
                      {s.title}
                    </h3>
                    <div className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                      {s.body}
                    </div>
                  </section>
                ))}

                <hr className="border-slate-200" />

                <section>
                  <h3 className="text-sm font-semibold tracking-wide text-slate-900">
                    Methodology & disclaimer
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {report.disclaimer}
                  </p>

                  <p className="mt-4 text-sm text-slate-700">
                    AccountSignal is an intelligence tool by{' '}
                    <a
                      href="https://accountappeal.net"
                      className="font-medium text-purple-700 hover:underline print:text-slate-900 print:no-underline"
                    >
                      AccountAppeal
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
