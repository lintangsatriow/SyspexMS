"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'

interface ComplianceAlertSummary {
  expired: number
  critical60: number
  warning90: number
  openHazards: number
}

export default function HomePage() {
  const { lang } = useLanguage()
  const [alerts, setAlerts] = useState<ComplianceAlertSummary>({ expired: 0, critical60: 0, warning90: 0, openHazards: 0 })
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('syspex_hub_alert_dismissed') === 'true'

    const evaluateAlerts = () => {
      let expired = 0
      let critical60 = 0
      let warning90 = 0
      let openHazards = 0

      // 1. Cek Database Lisensi K3 & Riksa Uji
      const savedSio = localStorage.getItem('syspex_sio_db')
      if (savedSio) {
        const list: Array<{ expiryDate: string }> = JSON.parse(savedSio)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        list.forEach(item => {
          if (!item.expiryDate || item.expiryDate === 'LIFETIME') return
          const exp = new Date(item.expiryDate)
          exp.setHours(0, 0, 0, 0)
          if (isNaN(exp.getTime())) return
          const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          if (daysLeft < 0) expired++
          else if (daysLeft <= 60) critical60++
          else if (daysLeft <= 90) warning90++
        })
      }

      // 2. Cek Database Hazard Report Open
      const savedHazards = localStorage.getItem('syspex_hazard_db')
      if (savedHazards) {
        const hList: Array<{ status: string }> = JSON.parse(savedHazards)
        openHazards = hList.filter(h => h.status === 'OPEN').length
      }

      setAlerts({ expired, critical60, warning90, openHazards })
      const hasUrgent = expired > 0 || critical60 > 0 || warning90 > 0 || openHazards > 0
      if (hasUrgent && !isDismissed) {
        setDismissed(false)
      }
    }

    evaluateAlerts()
    window.addEventListener('storage', evaluateAlerts)
    window.addEventListener('syspex_hse_sync', evaluateAlerts)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('storage', evaluateAlerts)
      window.removeEventListener('syspex_hse_sync', evaluateAlerts)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('syspex_hub_alert_dismissed', 'true')
  }

  const dict = {
    EN: {
      headline_1: "ENGINEERING PRECISION.",
      headline_2: "ZERO-HARM GOVERNANCE.",
      desc: "Integrated workplace governance. Bridging statutory compliance, structural integrity, and executive visibility.",
      btn_kpi: "KPI Dashboard",
      btn_ai: "AI Copilot",
      rules_title: "SYSPEX SAFETY RULES",
      alert_title: "HSE ACTION REMINDER",
      alert_sio: "K3 Licenses & Riksa Uji",
      alert_haz: "Open Hazard Reports",
      alert_view: "Review",
      rules: [
        { id: 1, title: 'ENERGY ISOLATION', desc: 'Verify zero-energy state (LOTO)' },
        { id: 2, title: 'WORK AT HEIGHT', desc: '100% tie-off & scaffolding check' },
        { id: 3, title: 'SAFE LIFTING', desc: 'Never walk under suspended loads' },
        { id: 4, title: 'MOBILE EQUIPMENT', desc: 'Keep distance from moving MHE' },
        { id: 5, title: 'PERMIT TO WORK', desc: 'Valid JSA for high-risk tasks' },
        { id: 6, title: 'FIT TO WORK', desc: 'Zero tolerance for drugs/fatigue' },
      ]
    },
    ID: {
      headline_1: "PRESISI REKAYASA.",
      headline_2: "TATA KELOLA NIR-INSIDEN.",
      desc: "Tata kelola K3L terintegrasi. Menjembatani kepatuhan regulasi Kemenaker, integritas struktural, dan visibilitas eksekutif.",
      btn_kpi: "Dasbor KPI",
      btn_ai: "AI Copilot",
      rules_title: "ATURAN KESELAMATAN INTI SYSPEX",
      alert_title: "PENGINGAT TINDAK LANJUT K3",
      alert_sio: "Lisensi K3 & Riksa Uji",
      alert_haz: "Temuan Bahaya (Open)",
      alert_view: "Periksa",
      rules: [
        { id: 1, title: 'ISOLASI ENERGI', desc: 'Pastikan status bebas energi (LOTO)' },
        { id: 2, title: 'BEKERJA DI KETINGGIAN', desc: '100% tie-off & cek scaffolding' },
        { id: 3, title: 'PENGANGKATAN AMAN', desc: 'Dilarang melintas di bawah beban' },
        { id: 4, title: 'ALAT BERAT (MHE)', desc: 'Jaga jarak dari Forklift bergerak' },
        { id: 5, title: 'IZIN KERJA', desc: 'JSA wajib untuk tugas risiko tinggi' },
        { id: 6, title: 'FIT TO WORK', desc: 'Nol toleransi untuk obat & kelelahan' },
      ]
    }
  }

  const t = dict[lang]

  const icons = [
    <path key={1} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    <path key={2} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    <path key={3} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />,
    <path key={4} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-2" />,
    <path key={5} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    <path key={6} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ]

  const safetyRules = t.rules.map((rule, idx) => ({ ...rule, icon: icons[idx] }))
  const hasLicenseAlerts = alerts.expired > 0 || alerts.critical60 > 0 || alerts.warning90 > 0

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-6 py-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] transition-colors">
      
      {/* HERO SECTION */}
      <div className="w-full max-w-5xl pt-6">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.05] transition-colors">
          {t.headline_1} <br />
          <span className="text-slate-400 dark:text-slate-500">
            {t.headline_2}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold max-w-xl mt-6 leading-relaxed uppercase tracking-wider transition-colors">
          {t.desc}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-10">
          <Link href="/executive-report" className="px-8 py-3 min-h-[44px] bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors flex items-center gap-2 shadow-sm">
            {t.btn_kpi}
          </Link>
          <Link href="/ai-assistant" className="px-8 py-3 min-h-[44px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-500"></span> {t.btn_ai}
          </Link>
        </div>
      </div>

      {/* SAFETY RULES GRID */}
      <div className="w-full max-w-5xl mt-16 pt-10 border-t border-slate-300 dark:border-slate-800/80 transition-colors">
        <div className="mb-6">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.rules_title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safetyRules.map((rule) => (
            <Link
              key={rule.id} 
              href="/syspex-safety-rules" 
              className="group bg-white dark:bg-[#0b0f19] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 p-5 rounded-[4px] transition-colors flex flex-col gap-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{rule.icon}</svg>
                </div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-widest">
                  0{rule.id}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-widest">{rule.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-wider">{rule.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* COMPACT FLOATING TOAST REMINDER DI KANAN BAWAH (DISMISSIBLE) */}
      {!dismissed && (hasLicenseAlerts || alerts.openHazards > 0) && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-80 bg-white dark:bg-[#0b0f19] border-2 border-slate-900 dark:border-slate-700 rounded-[4px] shadow-xl p-3.5 transition-all"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${alerts.expired > 0 || alerts.critical60 > 0 ? 'bg-rose-600' : 'bg-orange-500'}`}></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                {t.alert_title}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Tutup pengingat"
              className="text-[10px] font-black text-slate-400 hover:text-rose-600 px-1.5 py-0.5 rounded-[2px] transition-colors"
            >
              [X]
            </button>
          </div>

          <div className="space-y-2">
            {hasLicenseAlerts && (
              <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/70 px-2.5 py-2 border border-slate-200 dark:border-slate-800 rounded-[2px]">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-800 dark:text-slate-200">{t.alert_sio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1 text-[8px] font-black font-mono">
                    {alerts.expired > 0 && <span className="text-red-700 dark:text-red-400">{alerts.expired} EXP</span>}
                    {alerts.critical60 > 0 && <span className="text-rose-600 dark:text-rose-400">{alerts.critical60} ≤60D</span>}
                    {alerts.warning90 > 0 && <span className="text-orange-600 dark:text-orange-400">{alerts.warning90} ≤90D</span>}
                  </div>
                </div>
                <Link
                  href="/sio-silo"
                  className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-slate-900 dark:hover:text-white text-[8px] font-black uppercase tracking-widest rounded-[2px] transition-colors shrink-0"
                >
                  {t.alert_view}
                </Link>
              </div>
            )}

            {alerts.openHazards > 0 && (
              <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/70 px-2.5 py-2 border border-slate-200 dark:border-slate-800 rounded-[2px]">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-800 dark:text-slate-200">{t.alert_haz}</p>
                  <span className="text-[8px] font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {alerts.openHazards} OPEN CASE
                  </span>
                </div>
                <Link
                  href="/hazard-report"
                  className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-slate-900 dark:hover:text-white text-[8px] font-black uppercase tracking-widest rounded-[2px] transition-colors shrink-0"
                >
                  {t.alert_view}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
