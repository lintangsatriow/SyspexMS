"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '../LanguageContext'
import { useTheme } from '../ThemeContext'
import LogoutButton from './LogoutButton'

export default function ClientSidebarLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const [mgmtOpen, setMgmtOpen] = useState(true)
  const [techOpen, setTechOpen] = useState(false)
  const [opsOpen, setOpsOpen] = useState(true)

  const closeMobile = () => setMobileOpen(false)

  const dict = {
    EN: {
      hub: "Main Hub", kpi: "KPI Dashboard", ai: "AI Copilot",
      cat_ops: "HSE & Operations", ops_1: "Syspex Safety Rules", ops_2: "Forklift & MHE", ops_3: "LOTO Permit", ops_4: "Toolbox Talk (TBM)", ops_5: "Hazard & Near-Miss", ops_6: "Safety Induction",
      cat_tech: "Technical Calculators", tech_1: "Scaffolding BoQ", tech_2: "Racking SWL", tech_3: "Lifting & Rigging", tech_4: "JSA Builder",
      cat_mgmt: "Management & ISO", mgmt_1: "ISO 9001 Doc Control", mgmt_2: "ISO 14001 Waste Log", mgmt_3: "SIO / SILO Tracker"
    },
    ID: {
      hub: "Beranda Utama", kpi: "Dasbor KPI", ai: "AI Copilot",
      cat_ops: "K3L & Operasional", ops_1: "Aturan Keselamatan", ops_2: "Inspeksi Forklift", ops_3: "Izin LOTO", ops_4: "Safety Talk (TBM)", ops_5: "Pelaporan Bahaya", ops_6: "Induksi K3",
      cat_tech: "Kalkulator Teknis", tech_1: "Kalkulasi Scaffolding", tech_2: "Beban Maks. Racking", tech_3: "Rencana Lifting", tech_4: "Pembuat JSA",
      cat_mgmt: "Manajemen & ISO", mgmt_1: "Kontrol Dokumen", mgmt_2: "Limbah B3 & Lingkungan", mgmt_3: "Database SIO & SILO"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] shadow-sm transition-colors items-center gap-2"
        >
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">MENU</span>
        </button>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col bg-slate-50 dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800/60 p-5 shrink-0 h-screen sticky top-0 justify-between transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? 'w-72 translate-x-0' : '-ml-72 w-72 -translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          
          <div className="flex flex-col gap-3 pb-5 border-b border-slate-200 dark:border-slate-800/80 relative">
            <div className="flex justify-end">
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              </button>
            </div>
            <Link href="/" className="w-full flex">
              <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex Logo" className="w-full h-8 object-contain bg-white border border-slate-200 dark:border-transparent px-3 py-1.5 rounded-[2px]" />
            </Link>
          </div>

          <div className="space-y-1">
            <Link href="/" className="block px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-[4px] transition-colors">{t.hub}</Link>
            <Link href="/executive-report" className="block px-3 py-2 text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-[4px] transition-colors">{t.kpi}</Link>
            <Link href="/ai-assistant" className="flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50 rounded-[4px] hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-500"></span> {t.ai}
            </Link>
          </div>

          <div className="space-y-2">
            <button onClick={() => setOpsOpen(!opsOpen)} className="w-full flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 py-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span>{t.cat_ops}</span>
              <svg className={`w-3 h-3 transition-transform ${opsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {opsOpen && (
              <div className="space-y-0.5 pl-3 border-l border-slate-300 dark:border-slate-800 ml-2">
                <Link href="/syspex-safety-rules" className="block px-3 py-1.5 text-[10px] font-bold text-teal-600 dark:text-teal-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_1}</Link>
                <Link href="/forklift-inspection" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_2}</Link>
                <Link href="/loto" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_3}</Link>
                <Link href="/safety-talk" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_4}</Link>
                <Link href="/hazard-report" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_5}</Link>
                <Link href="/induction" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.ops_6}</Link>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button onClick={() => setTechOpen(!techOpen)} className="w-full flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 py-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span>{t.cat_tech}</span>
              <svg className={`w-3 h-3 transition-transform ${techOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {techOpen && (
              <div className="space-y-0.5 pl-3 border-l border-slate-300 dark:border-slate-800 ml-2">
                <Link href="/scaffolding" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.tech_1}</Link>
                <Link href="/racking-swl" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.tech_2}</Link>
                <Link href="/lifting-plan" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.tech_3}</Link>
                <Link href="/jsa" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.tech_4}</Link>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button onClick={() => setMgmtOpen(!mgmtOpen)} className="w-full flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 py-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span>{t.cat_mgmt}</span>
              <svg className={`w-3 h-3 transition-transform ${mgmtOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mgmtOpen && (
              <div className="space-y-0.5 pl-3 border-l border-slate-300 dark:border-slate-800 ml-2">
                <Link href="/document-control" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.mgmt_1}</Link>
                <Link href="/env-log" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.mgmt_2}</Link>
                <Link href="/sio-silo" className="block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-[2px] uppercase tracking-wider transition-colors">{t.mgmt_3}</Link>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-center gap-2">
            <div className="flex bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] overflow-hidden w-full">
              <button onClick={() => setLang('EN')} className={`w-1/2 px-2 py-1.5 text-[9px] font-black tracking-widest transition-colors ${lang === 'EN' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>EN</button>
              <button onClick={() => setLang('ID')} className={`w-1/2 px-2 py-1.5 text-[9px] font-black tracking-widest transition-colors ${lang === 'ID' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>ID</button>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] overflow-hidden w-full">
              <button onClick={() => setTheme('LIGHT')} className={`w-1/2 px-2 py-1.5 text-[9px] font-black tracking-widest transition-colors ${theme === 'LIGHT' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>LGT</button>
              <button onClick={() => setTheme('DARK')} className={`w-1/2 px-2 py-1.5 text-[9px] font-black tracking-widest transition-colors ${theme === 'DARK' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>DRK</button>
            </div>
          </div>
          
          <div className="w-full mt-2">
            <LogoutButton />
          </div>

          <div className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">SYSPEX MS</div>
        </div>
      </aside>

      {/* MOBILE TOPBAR & DRAWER */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-6 bg-white px-2 py-0.5 border border-slate-200 dark:border-transparent rounded-[2px]" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-16 px-6 overflow-y-auto space-y-4 pb-20">
          <Link href="/" onClick={closeMobile} className="block py-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">{t.hub}</Link>
          <Link href="/executive-report" onClick={closeMobile} className="block py-3 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800">{t.kpi}</Link>
          <Link href="/syspex-safety-rules" onClick={closeMobile} className="block py-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">{t.ops_1}</Link>
          
          <div className="pt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setLang('EN')} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] border ${lang === 'EN' ? 'bg-teal-600 text-white border-teal-600' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}>ENG</button>
            <button onClick={() => setLang('ID')} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] border ${lang === 'ID' ? 'bg-teal-600 text-white border-teal-600' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}>IND</button>
            <button onClick={() => setTheme('LIGHT')} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] border ${theme === 'LIGHT' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}>LIGHT</button>
            <button onClick={() => setTheme('DARK')} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] border ${theme === 'DARK' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}>DARK</button>
          </div>

          <div className="pt-4">
            <LogoutButton />
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 min-h-screen flex flex-col justify-start px-4 sm:px-8 py-6 lg:py-8 pt-20 lg:pt-8 overflow-hidden transition-all duration-300 bg-white dark:bg-[#020617]">
        {children}
      </main>
    </>
  )
}
