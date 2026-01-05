interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="py-20 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
