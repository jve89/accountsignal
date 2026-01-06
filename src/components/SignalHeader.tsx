"use client";

import { useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SignalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" aria-label={site.name} className="flex flex-col">
          <span className="text-lg font-semibold text-slate-900">
            {site.name}
          </span>
          <span className="text-xs text-slate-500">
            {site.tagline}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Primary action */}
        <Link
          href="/report"
          className="hidden rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 md:inline-flex"
        >
          Generate report
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 hover:bg-slate-50 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto max-w-5xl space-y-3 px-6 py-4 text-sm text-slate-700">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/report"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-purple-600 px-3 py-2 text-center font-medium text-white"
            >
              Generate report
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
