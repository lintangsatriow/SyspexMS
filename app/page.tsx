"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './lib/firebase'
import { useLanguage } from './LanguageContext'

export default function MainHubPage() {
  const { lang } = useLanguage()
  const [mounted, setMounted] = useState(false)

  const [openHazards, setOpenHazards] = useState(0)
  const [totalHazards, setTotalHazards] = useState(0)
  const [expiringLicenses, setExpiringLicenses] = useState(0)
  const [totalLicenses, setTotalLicenses] = useState(0)
  const [totalJsa, setTotalJsa] = useState(0)

  useEffect(() => {
    setMounted(true)

    const unsubHazard = onSnapshot(collection(db, 'hazard_reports'), (snap) => {
      const items = snap.docs.map(d => d.data())
      setTotalHazards(items.length)
      setOpenHazards(items.filter(h => h.status !== 'CLOSED').length)
    })

    const unsubK3 = onSnapshot(collection(db, 'k3_compliance'), (snap) => {
      const items = snap.docs.map(d => d.data())
      setTotalLicenses(items.length)
      const now = new Date().setHours(0, 0, 0, 0)
      const warnCount = items.filter(rec => {
        if (!rec.expiryDate || rec.expiryDate === 'LIFETIME') return false
        const exp = new Date(rec.expiryDate).setHours(0, 0, 0, 0)
        const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
        return daysLeft <= 90
      }).length
      setExpiringLicenses(warnCount)
    })

    const unsubJsa = onSnapshot(collection(db, 'jsa_records'), (snap) => {
      setTotalJsa(snap.size)
    })

    return () => {
      unsubHazard()
      unsubK3()
      unsubJsa()
    }
  }, [])

  const t = {
    ID: {
      badge: "PUSAT KENDALI K3L TERPADU",
      title: "SYSPEX MANAGEMENT SYSTEM",
      subtitle: "Pemantauan keselamatan operasional, kepatuhan lisensi K3, dan analisis bahaya secara real-time.",
      card_hz_title: "PELAPORAN BAHAYA & NEAR-MISS",
      card_hz_desc: "Pantau temuan lapangan, tindak lanjut CAPA, dan cetak poster QR Code.",
      card_sio_title: "LISENSI K3 & RIKSA UJI",
      card_sio_desc: "Kontrol masa berlaku SIO, SKP Ahli, BNSP, SILO, dan jadwal kalender alarm.",
      card_jsa_title: "JOB SAFETY ANALYSIS (JSA)",
      card_jsa_desc: "Susun identifikasi bahaya dan pengendalian risiko sebelum pekerjaan dimulai.",
      card_kpi_title: "DASBOR KPI EKSEKUTIF",
      card_kpi_desc: "Evaluasi metrik TRIR, LTI, jam kerja aman, serta tren indikator proaktif.",
      card_rules_title: "ATURAN KESELAMATAN SYSPEX",
      card_rules_desc: "Standar keselamatan wajib dan prosedur operasional di seluruh area kerja.",
      btn_open: "BUKA MODUL"
    },
    EN: {
      badge: "INTEGRATED HSE COMMAND CENTER",
      title: "SYSPEX MANAGEMENT SYSTEM",
      subtitle: "Real-time operational safety monitoring, K3 license compliance, and hazard analysis.",
      card_hz_title: "HAZARD & NEAR-MISS REPORT",
      card_hz_desc: "Track field observations, CAPA follow-ups, and print QR Code posters.",
      card_sio_title: "K3 LICENSES & RIKSA UJI",
      card_sio_desc: "Monitor SIO, SKP, BNSP, SILO validity and export calendar alarms.",
      card_jsa_title: "JOB SAFETY ANALYSIS (JSA)",
      card_jsa_desc: "Build step-by-step hazard identification and risk controls before work.",
      card_kpi_title: "EXECUTIVE KPI DASHBOARD",
      card_kpi_desc: "Review TRIR, LTI, safe man-hours, and leading indicator trends.",
      card_rules_title: "SYSPEX SAFETY RULES",
      card_rules_desc: "Mandatory safety standards and operational procedures across all sites.",
      btn_open: "OPEN MODULE"
    }
  }[lang]

  if (!mounted) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
          {t.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mt-1">
          {t.title}
        </h1>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* RINGKASAN STATUS CLOUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-[4px] border-2 ${openHazards > 0 ? 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-400 dark:border-rose-800' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
          <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">OPEN HAZARDS</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono ${openHazards > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>{openHazards}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">/ {totalHazards} TOTAL</span>
          </div>
        </div>

        <div className={`p-5 rounded-[4px] border-2 ${expiringLicenses > 0 ? 'bg-orange-50/70 dark:bg-orange-950/25 border-orange-400 dark:border-orange-800' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
          <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">PERMITS &le; 90 DAYS / EXPIRED</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono ${expiringLicenses > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{expiringLicenses}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">/ {totalLicenses} RECORDS</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px]">
          <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">REGISTERED JSA</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-teal-600 dark:text-teal-400">{totalJsa}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">DOCUMENTS</span>
          </div>
        </div>
      </div>

      {/* NAVIGASI MODUL AKTIF */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/hazard-report" className="group p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">{t.card_hz_title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{t.card_hz_desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">{t.btn_open}</span>
        </Link>

        <Link href="/sio-silo" className="group p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">{t.card_sio_title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{t.card_sio_desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">{t.btn_open}</span>
        </Link>

        {/* <Link href="/jsa" className="group p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">{t.card_jsa_title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{t.card_jsa_desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">{t.btn_open}</span>
        </Link> */}

        <Link href="/executive-report" className="group p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">{t.card_kpi_title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{t.card_kpi_desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">{t.btn_open}</span>
        </Link>

        <Link href="/syspex-safety-rules" className="group p-5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">{t.card_rules_title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{t.card_rules_desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">{t.btn_open}</span>
        </Link>
      </div>
    </div>
  )
}
