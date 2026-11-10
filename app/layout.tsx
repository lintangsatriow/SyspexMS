"use client"

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const [mgmtOpen, setMgmtOpen] = useState(true)
  const [techOpen, setTechOpen] = useState(false)
  const [opsOpen, setOpsOpen] = useState(true)

  const closeMobile = () => setMobileOpen(false)

  return (
    <html lang="en">
      <head>
        <title>Syspex Management System</title>
        <meta name="description" content="Syspex Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon-syspex.png?v=3" type="image/png" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex font-sans antialiased selection:bg-teal-500 selection:text-white overflow-x-hidden">
        
        {/* FLOATING TRIGGER BUTTON */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed top-5 left-4 z-50 p-2.5 bg-slate-900/90 hover:bg-slate-800 text-teal-400 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 items-center gap-2"
            title="Open Sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Menu</span>
          </button>
        )}

        {/* COLLAPSIBLE DESKTOP SIDEBAR */}
        <aside
          className={`hidden lg:flex flex-col bg-slate-900/95 border-r border-slate-800/80 p-5 shrink-0 h-screen sticky top-0 justify-between transition-all duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'w-72 translate-x-0' : '-ml-72 w-72 -translate-x-full pointer-events-none opacity-0'
          }`}
        >
          <div className="flex flex-col overflow-y-auto pr-1 space-y-6">
            
            {/* Header Sidebar: Logo & Tombol Tutup */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <Link href="/" className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/Syspex%20Logo%20(Trademark)%20black.png" 
                  alt="Syspex Logo" 
                  className="h-6 w-auto object-contain bg-white px-1.5 py-0.5 rounded"
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Collapse Sidebar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Quick Hub Links (Tanpa Emoji) */}
            <div className="space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition"
              >
                Main Hub
              </Link>
              <Link 
                href="/executive-report" 
                className="block px-3 py-2 text-xs font-bold text-teal-400 hover:bg-teal-500/10 rounded-xl transition"
              >
                KPI Dashboard
              </Link>
              <Link 
                href="/ai-assistant" 
                className="flex items-center gap-2 px-3 py-2 text-xs font-black text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 rounded-xl transition hover:bg-cyan-900/50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                AI Copilot
              </Link>
            </div>

            {/* Category: HSE & Operations */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setOpsOpen(!opsOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300 transition"
              >
                <span>HSE & Operations</span>
                <span className="text-[9px]">{opsOpen ? '▲' : '▼'}</span>
              </button>
              {opsOpen && (
                <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                  <Link href="/syspex-safety-rules" className="block px-3 py-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 hover:bg-slate-800/50 rounded-lg transition">
                    Syspex Safety Rules
                  </Link>
                  <Link href="/forklift-inspection" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Forklift & MHE
                  </Link>
                  <Link href="/loto" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    LOTO Permit
                  </Link>
                  <Link href="/safety-talk" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Toolbox Talk (TBM)
                  </Link>
                  <Link href="/hazard-report" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Hazard & Near-Miss
                  </Link>
                  <Link href="/induction" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Safety Induction
                  </Link>
                </div>
              )}
            </div>

            {/* Category: Technical & Calculators */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setTechOpen(!techOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300 transition"
              >
                <span>Technical Calculators</span>
                <span className="text-[9px]">{techOpen ? '▲' : '▼'}</span>
              </button>
              {techOpen && (
                <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                  <Link href="/scaffolding" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Scaffolding BoQ
                  </Link>
                  <Link href="/racking-swl" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Racking SWL
                  </Link>
                  <Link href="/lifting-plan" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    Lifting & Rigging
                  </Link>
                  <Link href="/jsa" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    JSA Builder
                  </Link>
                </div>
              )}
            </div>

            {/* Category: Management & ISO */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setMgmtOpen(!mgmtOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300 transition"
              >
                <span>Management & ISO</span>
                <span className="text-[9px]">{mgmtOpen ? '▲' : '▼'}</span>
              </button>
              {mgmtOpen && (
                <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                  <Link href="/document-control" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    ISO 9001 Doc Control
                  </Link>
                  <Link href="/env-log" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    ISO 14001 Waste Log
                  </Link>
                  <Link href="/sio-silo" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
                    SIO / SILO Tracker
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Footer Sidebar */}
          <div className="pt-4 border-t border-slate-800 text-[10px] font-medium text-slate-600 text-center">
            Syspex Management System © 2026
          </div>
        </aside>

        {/* MOBILE TOPBAR */}
        <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-50">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-6 bg-white px-1.5 py-0.5 rounded" />
            <span className="text-xs font-black text-white">Syspex Management System</span>
          </Link>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/95 pt-16 px-6 overflow-y-auto space-y-4">
            <Link href="/" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200 border-b border-slate-800">Main Hub</Link>
            <Link href="/executive-report" onClick={closeMobile} className="block py-2 text-sm font-bold text-teal-400 border-b border-slate-800">KPI Dashboard</Link>
            <Link href="/syspex-safety-rules" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200 border-b border-slate-800">Safety Rules</Link>
            <Link href="/ai-assistant" onClick={closeMobile} className="block py-2 text-sm font-bold text-cyan-300 border-b border-slate-800">AI Copilot</Link>
          </div>
        )}

        {/* MAIN VIEWPORT */}
        <main className="flex-1 min-h-screen flex flex-col justify-center px-4 sm:px-8 py-6 lg:py-4 pt-16 lg:pt-4 overflow-hidden transition-all duration-300">
          {children}
        </main>

      </body>
    </html>
  )
}
