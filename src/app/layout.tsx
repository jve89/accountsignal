import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SignalHeader } from "@/components/SignalHeader";
import { SignalFooter } from "@/components/SignalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AccountSignal — Daily enforcement signals",
  description:
    "Daily enforcement signal overview based on publicly observable patterns. AccountSignal is an intelligence tool by AccountAppeal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <SignalHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <SignalFooter />
      </body>
    </html>
  );
}
