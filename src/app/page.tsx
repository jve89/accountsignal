import { Section } from "@/components/Section";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Text */}
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                Daily enforcement signals for major online platforms
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                AccountSignal analyzes public enforcement patterns and reported cases to
                identify whether platforms are experiencing elevated suspension or review
                activity on a given day.
              </p>

              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
                The goal is not prediction — but context. Understanding whether your
                situation aligns with broader enforcement signals helps you decide
                whether to wait, proceed carefully, or escalate.
              </p>

              <div className="mt-8">
                <a
                  href="/report"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Generate today’s AccountSignal report — $10
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                AccountSignal is an intelligence tool by{" "}
                <a
                  href="https://accountappeal.net"
                  className="font-medium text-purple-600 hover:underline"
                >
                  AccountAppeal
                </a>
                .
              </p>
            </div>

            {/* Image placeholder */}
            <div className="relative h-[420px] w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              Intelligence briefing visual
            </div>
          </div>

          {/* Supporting points */}
          <div className="mt-12 grid gap-6 md:grid-cols-3 text-m text-slate-700">
            {[
              "Based on daily observed enforcement signals",
              "Designed to reduce guesswork and emotional decisions",
              "Contextual guidance — not automated outcomes",
            ].map((t) => (
              <div
                key={t}
                className="rounded-lg bg-slate-50 px-5 py-6 text-center font-semibold text-slate-800 leading-relaxed"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT THIS IS */}
      <Section
        id="what-this-is"
        title="What AccountSignal is"
        subtitle="A situational awareness tool — not an appeal service."
      >
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8">
          <div className="space-y-4 text-slate-700">
            <p>
              <strong>AccountSignal provides daily context</strong> around platform
              enforcement activity by analyzing publicly observable patterns and
              reported cases.
            </p>

            <p>
              It helps answer questions like:
            </p>

            <ul className="list-disc space-y-2 pl-5">
              <li>Is enforcement activity elevated today?</li>
              <li>Does this look like automated or policy-driven review?</li>
              <li>Is this likely an individual issue or a broader platform pattern?</li>
            </ul>

            <p>
              This information can help you avoid unnecessary actions, repeated appeals,
              or premature escalation.
            </p>
          </div>
        </div>
      </Section>

      {/* WHAT THIS IS NOT */}
      <Section
        id="boundaries"
        title="What this is — and is not"
        subtitle="Clear boundaries to avoid false expectations."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-6">
            <h3 className="font-medium text-slate-900">This tool does provide:</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Daily enforcement signal context</li>
              <li>Pattern-based interpretation</li>
              <li>Guidance on what typically helps or hurts</li>
              <li>A calm, non-alarmist framing</li>
            </ul>
          </div>

          <div className="rounded-lg bg-slate-50 p-6">
            <h3 className="font-medium text-slate-900">This tool does not provide:</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Account recovery or appeals</li>
              <li>Direct platform contact</li>
              <li>Guaranteed outcomes</li>
              <li>Automated decision-making</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* WHEN TO ESCALATE */}
      <Section
        id="escalation"
        title="When professional help may make sense"
        subtitle="Understanding when context alone is not enough."
      >
        <div className="rounded-lg bg-white border border-slate-200 p-8">
          <div className="space-y-4 text-slate-700">
            <p>
              In many cases, waiting and avoiding repeated actions is the safest path.
              However, if a suspension persists, affects business operations, or receives
              a rejection without explanation, structured escalation may be appropriate.
            </p>

            <p>
              In those situations, professional document preparation and procedural
              guidance may help.
            </p>

            <p className="text-sm">
              AccountSignal is built by{" "}
              <a
                href="https://accountappeal.net"
                className="font-medium text-purple-600 hover:underline"
              >
                AccountAppeal
              </a>
              , which provides structured appeal support when escalation is warranted.
            </p>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Get today’s enforcement context before taking action
          </h2>

          <p className="mt-3 text-slate-600">
            One report. Clear framing. No speculation.
          </p>

          <div className="mt-8">
            <a
              href="/report"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Generate today’s AccountSignal report — $10
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
