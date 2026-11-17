"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext'
import { useTheme } from '../ThemeContext'
import LogoutButton from './LogoutButton'

export default function ClientSidebarLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isQrMode, setIsQrMode] = useState(false)
  
  const [mgmtOpen, setMgmtOpen] = useState(true)
  const [techOpen, setTechOpen] = useState(true)
  const [opsOpen, setOpsOpen] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsQrMode(params.get('mode') === 'qr')
    }
  }, [])

  const closeMobile = () => setMobileOpen(false)

  // MODE QR PUBLIK: Tanpa sidebar & tanpa menu navigasi admin agar fokus murni ke form pelaporan
  if (isQrMode) {
    return (
      <main className="w-full min-h-screen px-4 py-6 bg-slate-50 dark:bg-[#020617]">
        {children}
      </main>
    )
  }

  const dict = {
    EN: {
      hub: "Main Hub", kpi: "HSE Performance Dashboard", ai: "AI Copilot",
      cat_ops: "HSE & Operations", ops_1: "Syspex Safety Rules", ops_4: "Toolbox Talk (TBM)", ops_5: "Hazard & Near-Miss", ops_6: "Safety Induction",
      cat_tech: "Work Control & Lifting", tech_3: "Lifting & Rigging",
      cat_mgmt: "Management & ISO", mgmt_1: "ISO 9001 Doc Control", mgmt_2: "ISO 14001 Waste Log", mgmt_3: "K3 Licenses & Riksa Uji"
    },
    ID: {
      hub: "Beranda Utama", kpi: "Dasbor KPI", ai: "AI Copilot",
      cat_ops: "K3L & Operasional", ops_1: "Aturan Keselamatan", ops_4: "Safety Talk (TBM)", ops_5: "Pelaporan Bahaya", ops_6: "Induksi K3",
      cat_tech: "Kontrol Pekerjaan", tech_3: "Rencana Lifting",
      cat_mgmt: "Manajemen & ISO", mgmt_1: "Kontrol Dokumen", mgmt_2: "Limbah B3 & Lingkungan", mgmt_3: "Lisensi K3 & Riksa Uji"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN

  return (
    <>
      {/* FLOATING TRIGGER BUTTON SAAT SIDEBAR TERTUTUP */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar"
          className="hidden lg:flex fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] shadow-sm transition-colors items-center gap-2 print:hidden"
        >
          <svg aria-hidden="true" className="w-4 h-4 text-teal-600 dark:text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">MENU</span>
        </button>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col bg-slate-50 dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800/60 p-5 shrink-0 h-screen sticky top-0 justify-between transition-all duration-300 ease-in-out z-40 print:hidden ${sidebarOpen ? 'w-64 xl:w-72 translate-x-0' : '-ml-64 xl:-ml-72 w-64 xl:w-72 -translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          
          <div className="flex flex-col gap-3 pb-5 border-b border-slate-200 dark:border-slate-800/80 relative">
            <div className="flex justify-end">
              <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar" className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors p-1">
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              </button>
            </div>
            <Link href="/" className="w-full flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex Logo" width={220} height={32} className="w-full h-8 object-contain bg-white border border-slate-200 dark:border-transparent px-3 py-1.5 rounded-[2px]" />
            </Link>
          </div>

          <div className="space-y-1">
            <Link href="/" className="block px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-[4px] transition-colors">{t.hub}</Link>
            <Link href="/executive-report" className="block px-3 py-2 text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-[4px] transition-colors">{t.kpi}</Link>
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-cyan-700/50 dark:text-cyan-300/50 bg-transparent border border-transparent rounded-[4px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600/50 dark:bg-cyan-500/50"></span> {t.ai} <span className="text-[8px]">(Soon)</span>
            </div>
          </div>

          <div className="space-y-2">
            <button type="button" onClick={() => setOpsOpen(!opsOpen)} aria-expanded={opsOpen} className="w-full flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 py-1 hover:text-slate-700 dark:
