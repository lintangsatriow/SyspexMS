"use client"

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [techOpen, setTechOpen] = useState(false)
  const [opsOpen, setOpsOpen] = useState(false)
  const [mgmtOpen, setMgmtOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeAllMenus = () => {
    setTechOpen(false)
    setOpsOpen(false)
    setMgmtOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <html lang="id">
      <head>
        <title>Syspex HSE Management System</title>
        <meta name="description" content="Industrial HSE Management System for PT. Syspex Kemasindo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" type="image/png" href="/favicon-syspex.png" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo Resmi Syspex */}
            <div className="flex items-center gap-2">
              <Link href="/" onClick={closeAllMenus} className="flex items-center gap-2 sm:gap-3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/Syspex%20Logo%20(Trademark)%20black.png" 
                  alt="Syspex Logo" 
                  className="h-6 sm:h-7 w-auto object-contain"
                />
                <div className="hidden lg:block border-l border-slate-300 pl-3">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">
                    MANAGEMENT SYSTEM
                  </span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-teal-600 mt-0.5">
                    HSE & Compliance Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigasi Desktop (Hidden di HP) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link 
                href="/" 
                className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Hub Utama
              </Link>

              <Link 
                href="/executive-report" 
                className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Dashboard KPI
              </Link>

              {/* Dropdown 1: Manajemen & ISO */}
              <div className="relative">
                <button 
                  onClick={() => { setMgmtOpen(!mgmtOpen); setTechOpen(false); setOpsOpen(false) }}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                >
                  Manajemen & ISO ▾
                </button>
                {mgmtOpen && (
                  <div 
                    onClick={() => setMgmtOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <Link href="/executive-report" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      📊 Executive HSE Report
                    </Link>
                    <Link href="/document-control" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      📑 Document Control (ISO 9001)
                    </Link>
                    <Link href="/env-log" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      ♻️ B3 Waste Log (ISO 14001)
                    </Link>
                    <Link href="/sio-silo" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      📜 Competency & License Tracker
                    </Link>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Kalkulator & Teknis */}
              <div className="relative">
                <button 
                  onClick={() => { setTechOpen(!techOpen); setOpsOpen(false); setMgmtOpen(false) }}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                >
                  Kalkulator & Teknis ▾
                </button>
                {techOpen && (
                  <div 
                    onClick={() => setTechOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <Link href="/scaffolding" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🏗️ Scaffolding BoQ & Erection
                    </Link>
                    <Link href="/racking-swl" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      📦 Racking SWL Calculator
                    </Link>
                    <Link href="/lifting-plan" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🪝 Lifting Plan Rigging
                    </Link>
                    <Link href="/jsa" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🛡️ Job Safety Analysis (JSA)
                    </Link>
                  </div>
                )}
              </div>

              {/* Dropdown 3: K3 & Operasional */}
              <div className="relative">
                <button 
                  onClick={() => { setOpsOpen(!opsOpen); setTechOpen(false); setMgmtOpen(false) }}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                >
                  K3 & Operasional ▾
                </button>
                {opsOpen && (
                  <div 
                    onClick={() => setOpsOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <Link href="/forklift-inspection" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🚜 Forklift Pre-Op & LOTO
                    </Link>
                    <Link href="/loto" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🔒 LOTO Permit & Danger Tag
                    </Link>
                    <Link href="/safety-talk" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      🗣️ Daily Safety Talk (TBM)
                    </Link>
                    <Link href="/hazard-report" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      ⚠️ Hazard & Near-Miss Hunting
                    </Link>
                    <Link href="/induction" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      📋 Induction & Training ID
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link href="/ai-assistant" className="block px-4 py-2 text-xs font-black text-teal-700 hover:bg-teal-50">
                      🤖 HSE AI Copilot
                    </Link>
                  </div>
                )}
              </div>

              {/* Tombol AI Copilot Desktop */}
              <Link
                href="/ai-assistant"
                className="ml-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                AI Copilot
              </Link>
            </nav>

            {/* Tombol Hamburger Mobile Menu (Muncul hanya di HP) */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/ai-assistant"
                onClick={closeAllMenus}
                className="px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-lg flex items-center gap-1 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Copilot
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>

          {/* Drawer Menu Vertikal untuk HP */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/"
                  onClick={closeAllMenus}
                  className="px-3 py-2.5 text-center bg-slate-100 text-slate-900 text-xs font-bold rounded-xl"
                >
                  🏠 Hub Utama
                </Link>
                <Link
                  href="/executive-report"
                  onClick={closeAllMenus}
                  className="px-3 py-2.5 text-center bg-teal-600 text-white text-xs font-black rounded-xl shadow-sm"
                >
                  📊 Dashboard KPI
                </Link>
              </div>

              {/* Grup 1: Manajemen & ISO */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">Manajemen & ISO</p>
                <div className="bg-slate-50 rounded-xl p-1.5 space-y-1 border border-slate-100">
                  <Link href="/document-control" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    📑 Document Control (ISO 9001)
                  </Link>
                  <Link href="/env-log" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    ♻️ B3 Waste Log (ISO 14001)
                  </Link>
                  <Link href="/sio-silo" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    📜 License Tracker (SIO / SILO)
                  </Link>
                </div>
              </div>

              {/* Grup 2: Kalkulator & Teknis */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">Kalkulator & Teknis</p>
                <div className="bg-slate-50 rounded-xl p-1.5 space-y-1 border border-slate-100">
                  <Link href="/scaffolding" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🏗️ Scaffolding BoQ & Erection
                  </Link>
                  <Link href="/racking-swl" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    📦 Racking SWL Calculator
                  </Link>
                  <Link href="/lifting-plan" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🪝 Lifting Plan Rigging
                  </Link>
                  <Link href="/jsa" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🛡️ Job Safety Analysis (JSA)
                  </Link>
                </div>
              </div>

              {/* Grup 3: K3 & Operasional */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">K3 & Operasional Lapangan</p>
                <div className="bg-slate-50 rounded-xl p-1.5 space-y-1 border border-slate-100">
                  <Link href="/forklift-inspection" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🚜 Forklift Pre-Op Checklist
                  </Link>
                  <Link href="/loto" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🔒 LOTO Permit & Danger Tag
                  </Link>
                  <Link href="/safety-talk" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    🗣️ Daily Safety Talk (TBM)
                  </Link>
                  <Link href="/hazard-report" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    ⚠️ Hazard & Near-Miss Hunting
                  </Link>
                  <Link href="/induction" onClick={closeAllMenus} className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg">
                    📋 Induction & Training ID
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 print:hidden">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-medium">
            <p>© 2026 PT. Syspex Kemasindo — Integrated HSE Management System (ISO 9001 / 14001 / 45001 & SMK3)</p>
          </div>
        </footer>

      </body>
    </html>
  )
}
