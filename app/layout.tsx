"use client"

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mgmtOpen, setMgmtOpen] = useState(true)
  const [techOpen, setTechOpen] = useState(false)
  const [opsOpen, setOpsOpen] = useState(true)

  const closeMobile = () => setMobileOpen(false)

  return (
    <html lang="en">
      <head>
        <title>Syspex Management System</title>
        <meta name="description" content="Industrial HSE Management System for Syspex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon-syspex.png?v=3" type="image/png" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex font-sans antialiased selection:bg-teal-500 selection:text-white">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-72 bg-slate-900/90 border-r border-slate-800/80 p-5 shrink-0 h-screen sticky top-0 justify-between">
          <div className="flex flex-col overflow-y-auto pr-1 space-y-6">
            
            {/* Logo Brand */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <Link href="/" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/Syspex%20Logo%20(Trademark)%20black.png" 
                  alt="Syspex Logo" 
                  className="h-7 w-auto object-contain bg-white px-2 py-1 rounded"
                />
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-wider text-white">Syspex MS</span>
                  <span className="block text-[9px] font-bold text-teal-400 uppercase tracking-widest">HSE Portal</span>
                </div>
              </Link>
            </div>

            {/* Quick Hub Links */}
            <div className="space-y-1">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition"
              >
                🏠 <span>Main Hub</span>
              </Link>
              <Link 
                href="/executive-report" 
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-teal-400 hover:bg-teal-500/10 rounded-xl transition"
              >
                📊 <span>KPI Dashboard</span>
              </Link>
              <Link 
                href="/ai-assistant" 
                className="flex items-center gap-3 px-3 py-2 text-xs font-black text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 rounded-xl transition hover:bg-cyan-900/50"
              >
                🤖 <span>AI Copilot</span>
              </Link>
            </div>

            {/* Category: HSE & Operations */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setOpsOpen(!opsOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1"
              >
                <span>HSE & Operations</span>
                <span className="text-[9px]">{opsOpen ? '▲' : '▼'}</span>
              </button>
              {opsOpen && (
                <div className="space-y-1 pl-2 border-l border-slate-800">
                  <Link href="/syspex-safety-rules" className="block px-2.5 py-1.5 text-xs font-bold text-teal-400 hover:bg-slate-800 rounded-lg">
                    🛡️ Safety Rules
                  </Link>
                  <Link href="/forklift-inspection" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🚜 Forklift & MHE
                  </Link>
                  <Link href="/loto" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🔒 LOTO Permit
                  </Link>
                  <Link href="/safety-talk" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🗣️ Toolbox Talk (TBM)
                  </Link>
                  <Link href="/hazard-report" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    ⚠️ Hazard & Near-Miss
                  </Link>
                  <Link href="/induction" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    📋 Safety Induction
                  </Link>
                </div>
              )}
            </div>

            {/* Category: Technical & Calculators */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setTechOpen(!techOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1"
              >
                <span>Technical Calculators</span>
                <span className="text-[9px]">{techOpen ? '▲' : '▼'}</span>
              </button>
              {techOpen && (
                <div className="space-y-1 pl-2 border-l border-slate-800">
                  <Link href="/scaffolding" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🏗️ Scaffolding BoQ
                  </Link>
                  <Link href="/racking-swl" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    📦 Racking SWL
                  </Link>
                  <Link href="/lifting-plan" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🪝 Lifting & Rigging
                  </Link>
                  <Link href="/jsa" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    🛡️ JSA Builder
                  </Link>
                </div>
              )}
            </div>

            {/* Category: Management & ISO */}
            <div className="space-y-1.5">
              <button 
                onClick={() => setMgmtOpen(!mgmtOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1"
              >
                <span>Management & ISO</span>
                <span className="text-[9px]">{mgmtOpen ? '▲' : '▼'}</span>
              </button>
              {mgmtOpen && (
                <div className="space-y-1 pl-2 border-l border-slate-800">
                  <Link href="/document-control" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    📑 ISO 9001 Doc Control
                  </Link>
                  <Link href="/env-log" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    ♻️ ISO 14001 Waste Log
                  </Link>
                  <Link href="/sio-silo" className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    📜 SIO / SILO Tracker
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Footer Sidebar */}
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Syspex MS © 2026
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-50">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-6 bg-white px-1.5 py-0.5 rounded" />
            <span className="text-xs font-black text-white">Syspex MS</span>
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
            <Link href="/" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200">🏠 Main Hub</Link>
            <Link href="/executive-report" onClick={closeMobile} className="block py-2 text-sm font-bold text-teal-400">📊 KPI Dashboard</Link>
            <Link href="/syspex-safety-rules" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200">🛡️ Safety Rules</Link>
            <Link href="/ai-assistant" onClick={closeMobile} className="block py-2 text-sm font-bold text-cyan-300">🤖 AI Copilot</Link>
          </div>
        )}

        {/* MAIN VIEWPORT */}
        <main className="flex-1 min-h-screen flex flex-col justify-center px-4 sm:px-8 py-6 lg:py-4 pt-16 lg:pt-4 overflow-hidden">
          {children}
        </main>

      </body>
    </html>
  )
}
