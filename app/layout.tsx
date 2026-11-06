'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/calculator') ||
    pathname.startsWith('/safety-talk');

  return (
    <html
      lang="id"
      className="h-full bg-zinc-950 font-sans antialiased text-zinc-900 selection:bg-emerald-500/20 selection:text-emerald-300"
    >
      <body className="h-full bg-zinc-50 flex flex-col">
        {isPublic ? (
          /* ======================================================== */
          /* 1. PUBLIC UTILITY VIEW (Frictionless / Mobile-Optimized) */
          /* ======================================================== */
          <div className="min-h-screen flex flex-col bg-zinc-50 relative selection:bg-emerald-500/20 selection:text-emerald-900">
            {/* Subtle Top Ambient Lighting */}
            <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />

            {/* Precision Navbar */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-700/60 shadow-sm transition group-hover:border-emerald-500/50">
                    <span className="text-[11px] font-black tracking-tighter text-emerald-400">
                      HSE
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-zinc-900">
                    AllAbout<span className="text-emerald-600">HSE</span>
                  </span>
                </Link>

                <nav className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      pathname === '/'
                        ? 'text-zinc-900 bg-zinc-100 font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    Tools
                  </Link>
                  <Link
                    href="/calculator"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      pathname.startsWith('/calculator')
                        ? 'text-emerald-950 bg-emerald-50 font-semibold border border-emerald-500/20'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    Kalkulator
                  </Link>
                  <Link
                    href="/safety-talk"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      pathname.startsWith('/safety-talk')
                        ? 'text-amber-950 bg-amber-50 font-semibold border border-amber-500/20'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    Safety Talk
                  </Link>
                </nav>
              </div>
            </header>

            {/* Public Content Surface */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 relative z-10">
              {children}
            </main>

            <footer className="border-t border-zinc-200/60 bg-white/50 backdrop-blur-sm py-6 text-center">
              <p className="text-[11px] text-zinc-400 tracking-wide">
                © {new Date().getFullYear()} AllAboutHSE • Precision Safety
                Intelligence & Tooling
              </p>
            </footer>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. PRIVATE WORKSPACE VIEW (Tactile Command-Center)       */
          /* ======================================================== */
          <div className="flex h-screen overflow-hidden bg-zinc-950">
            {/* Tactical Command Sidebar */}
            <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between border-r border-zinc-800/60 shrink-0">
              <div className="flex flex-col h-full">
                {/* Brand Identity */}
                <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-700/60 flex items-center justify-center">
                      <span className="text-[10px] font-black text-emerald-400">
                        H
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-tight text-zinc-200 block leading-none">
                        AllAbout<span className="text-emerald-400">HSE</span>
                      </span>
                      <span className="text-[9px] tracking-widest uppercase font-semibold text-zinc-500 block mt-1">
                        Workspace
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                </div>

                {/* Tactical Navigation Items */}
                <div className="px-3 py-5 overflow-y-auto flex-1 space-y-6">
                  <div>
                    <span className="px-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
                      Operasional Tapak
                    </span>
                    <nav className="space-y-0.5">
                      <Link
                        href="/internal"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/internal'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">📊</span>
                        <span>Overview</span>
                      </Link>

                      <Link
                        href="/incident"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/incident'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">📝</span>
                        <span>Incident Log</span>
                      </Link>

                      <Link
                        href="/inspection"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/inspection'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">🔍</span>
                        <span>Safety Walk</span>
                      </Link>
                    </nav>
                  </div>

                  <div>
                    <span className="px-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
                      Kepatuhan & Izin
                    </span>
                    <nav className="space-y-0.5">
                      <Link
                        href="/ptw"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/ptw'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">⚡</span>
                        <span>Permit to Work</span>
                      </Link>

                      <Link
                        href="/license"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/license'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">⚖️</span>
                        <span>Compliance Tracker</span>
                      </Link>

                      <Link
                        href="/induction"
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          pathname === '/induction'
                            ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/60 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="text-sm opacity-80">🪪</span>
                        <span>Visitor Induction</span>
                      </Link>
                    </nav>
                  </div>
                </div>

                {/* Footer Switcher */}
                <div className="p-3 border-t border-zinc-900">
                  <Link
                    href="/"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition"
                  >
                    <span>Mode Publik</span>
                    <span className="text-zinc-600">↗</span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Tactical Main Body */}
            <main className="flex-1 overflow-y-auto bg-zinc-900/40 p-6 md:p-8">
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
