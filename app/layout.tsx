"use client"

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'
import { LanguageProvider, useLanguage } from './LanguageContext'

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const [mgmtOpen, setMgmtOpen] = useState(true)
  const [techOpen, setTechOpen] = useState(false)
  const [opsOpen, setOpsOpen] = useState(true)

  const closeMobile = () => setMobileOpen(false)

  // Kamus Sidebar Global
  const dict = {
    EN: {
      hub: "Main Hub",
      kpi: "KPI Dashboard",
      ai: "AI Copilot",
      cat_ops: "HSE & Operations",
      ops_1: "Syspex Safety Rules",
      ops_2: "Forklift & MHE",
      ops_3: "LOTO Permit",
      ops_4: "Toolbox Talk (TBM)",
      ops_5: "Hazard & Near-Miss",
      ops_6: "Safety Induction",
      cat_tech: "Technical Calculators",
      tech_1: "Scaffolding BoQ",
      tech_2: "Racking SWL",
      tech_3: "Lifting & Rigging",
      tech_4: "JSA Builder",
      cat_mgmt: "Management & ISO",
      mgmt_1: "ISO 9001 Doc Control",
      mgmt_2: "ISO 14001 Waste Log",
      mgmt_3: "SIO / SILO Tracker"
    },
    ID: {
      hub: "Beranda Utama",
      kpi: "Dasbor KPI",
      ai: "AI Copilot",
      cat_ops: "K3L & Operasional",
      ops_1: "Aturan Keselamatan",
      ops_2: "Inspeksi Forklift",
      ops_3: "Izin LOTO",
      ops_4: "Safety Talk (TBM)",
      ops_5: "Pelaporan Bahaya",
      ops_6: "Induksi K3",
      cat_tech: "Kalkulator Teknis",
      tech_1: "Kalkulasi Scaffolding",
      tech_2: "Beban Maks. Racking",
      tech_3: "Rencana Lifting",
      tech_4: "Pembuat JSA",
      cat_mgmt: "Manajemen & ISO",
      mgmt_1: "Kontrol Dokumen",
      mgmt_2: "Limbah B3 & Lingkungan",
      mgmt_3: "Database SIO & SILO"
    }
  }

  const t = dict[lang]

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed top-5 left-4 z-50 p-2.5 bg-slate-900/90 hover:bg-slate-800 text-teal-400 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition hover:scale-105 items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Menu</span>
        </button>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col bg-slate-900/95 border-r border-slate-800/80 p-5 shrink-0 h-screen sticky top-0 justify-between transition-all duration-300 ease-in-out z-40 ${sidebarOpen ? 'w-72 translate-x-0' : '-ml-72 w-72 -translate-x-full pointer-events-none opacity-0'}`}>
        <div className="flex flex-col overflow-y-auto pr-1 space-y-6">
          <div className="flex flex-col gap-3 pb-5 border-b border-slate-800 relative">
            <div className="flex justify-end">
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              </button>
            </div>
            <Link href="/" className="w-full flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex Logo" className="w-full h-10 object-contain bg-white px-4 py-2 rounded-lg shadow-sm" />
            </Link>
          </div>

          <div className="space-y-1">
            <Link href="/" className="block px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition">{t.hub}</Link>
            <Link href="/executive-report" className="block px-3 py-2 text-xs font-bold text-teal-400 hover:bg-teal-500/10 rounded-xl transition">{t.kpi}</Link>
            <Link href="/ai-assistant" className="flex items-center gap-2 px-3 py-2 text-xs font-black text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 rounded-xl transition hover:bg-cyan-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> {t.ai}
            </Link>
          </div>

          <div className="space-y-1.5">
            <button onClick={() => setOpsOpen(!opsOpen)} className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300">
              <span>{t.cat_ops}</span><span className="text-[9px]">{opsOpen ? '▲' : '▼'}</span>
            </button>
            {opsOpen && (
              <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                <Link href="/syspex-safety-rules" className="block px-3 py-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 hover:bg-slate-800/50 rounded-lg">{t.ops_1}</Link>
                <Link href="/forklift-inspection" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.ops_2}</Link>
                <Link href="/loto" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.ops_3}</Link>
                <Link href="/safety-talk" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.ops_4}</Link>
                <Link href="/hazard-report" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.ops_5}</Link>
                <Link href="/induction" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.ops_6}</Link>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <button onClick={() => setTechOpen(!techOpen)} className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300">
              <span>{t.cat_tech}</span><span className="text-[9px]">{techOpen ? '▲' : '▼'}</span>
            </button>
            {techOpen && (
              <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                <Link href="/scaffolding" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.tech_1}</Link>
                <Link href="/racking-swl" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.tech_2}</Link>
                <Link href="/lifting-plan" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.tech_3}</Link>
                <Link href="/jsa" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.tech_4}</Link>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <button onClick={() => setMgmtOpen(!mgmtOpen)} className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 py-1 hover:text-slate-300">
              <span>{t.cat_mgmt}</span><span className="text-[9px]">{mgmtOpen ? '▲' : '▼'}</span>
            </button>
            {mgmtOpen && (
              <div className="space-y-1 pl-3 border-l border-slate-800 ml-2">
                <Link href="/document-control" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.mgmt_1}</Link>
                <Link href="/env-log" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.mgmt_2}</Link>
                <Link href="/sio-silo" className="block px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">{t.mgmt_3}</Link>
              </div>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* GLOBAL LANGUAGE TOGGLE (BOTTOM SIDEBAR) */}
        {/* ========================================= */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-4">
          <div className="flex bg-slate-950 border border-slate-800 rounded overflow-hidden">
            <button 
              onClick={() => setLang('EN')} 
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest ${lang === 'EN' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('ID')} 
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest ${lang === 'ID' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              ID
            </button>
          </div>
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-700">Syspex MS</div>
        </div>
      </aside>

      {/* MOBILE TOPBAR & DRAWER (Terjemahan Singkat) */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-6 bg-white px-1.5 py-0.5 rounded" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-400 hover:text-white">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/95 pt-16 px-6 overflow-y-auto space-y-4">
          <Link href="/" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200 border-b border-slate-800">{t.hub}</Link>
          <Link href="/executive-report" onClick={closeMobile} className="block py-2 text-sm font-bold text-teal-400 border-b border-slate-800">{t.kpi}</Link>
          <Link href="/syspex-safety-rules" onClick={closeMobile} className="block py-2 text-sm font-bold text-slate-200 border-b border-slate-800">{t.ops_1}</Link>
          
          <div className="pt-4 pb-8 flex gap-2">
            <button onClick={() => {setLang('EN'); closeMobile()}} className={`px-4 py-2 text-xs font-black rounded ${lang === 'EN' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>English</button>
            <button onClick={() => {setLang('ID'); closeMobile()}} className={`px-4 py-2 text-xs font-black rounded ${lang === 'ID' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Indonesia</button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 min-h-screen flex flex-col justify-center px-4 sm:px-8 py-6 lg:py-4 pt-16 lg:pt-4 overflow-hidden transition-all duration-300">
        {children}
      </main>
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Syspex Management System</title>
        <meta name="description" content="Industrial HSE Management System for Syspex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon-syspex.png?v=3" type="image/png" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex font-sans antialiased selection:bg-teal-500 selection:text-white overflow-x-hidden">
        <LanguageProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
