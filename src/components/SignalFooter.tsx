import Link from "next/link";
import { site } from "@/lib/site";

export function SignalFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-slate-600">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="font-bold text-slate-900">
              {site.name}
            </div>
            <p className="mt-2 leading-relaxed">
              Daily intelligence on platform enforcement patterns and review activity.
            </p>
          </div>

          {/* Sections */}
          <div className="text-center md:text-left">
            <div className="text-sm font-bold text-slate-900">
              Sections
            </div>
            <ul className="mt-3 space-y-2">
              <li><a href="#what" className="hover:text-slate-900">What this is</a></li>
              <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
              <li><Link href="/report" className="hover:text-slate-900">Report</Link></li>
              <li><a href="#faq" className="hover:text-slate-900">FAQ</a></li>
            </ul>
          </div>

          {/* Parent brand */}
          <div className="text-center md:text-left">
            <div className="text-sm font-bold text-slate-900">
              Operated by
            </div>
            <p className="mt-3">
              <a
                href="https://accountappeal.net"
                className="font-medium text-purple-600 hover:underline"
              >
                AccountAppeal
              </a>
            </p>
            <p className="mt-2 text-xs">
              Professional appeal guidance and documentation services.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-500 space-y-2">
          <p>
            AccountSignal provides informational context only and does not have access
            to internal platform systems. All decisions are made by the platforms.
          </p>
          <p>
            © {new Date().getFullYear()} AccountAppeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
