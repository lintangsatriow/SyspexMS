"use client"

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface HazardReport {
  id: string
  date: string
  time: string
  location: string
  category: 'HAZARD' | 'NEAR_MISS'
  severity: number
  likelihood: number
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  description: string
  immediateAction: string
  status: 'OPEN' | 'CLOSED'
}

export default function HazardReportPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)
  const [reports, setReports] = useState<HazardReport[]>([])

  // Form State
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState<'HAZARD' | 'NEAR_MISS'>('HAZARD')
  const [severity, setSeverity] = useState<number>(1)
  const [likelihood, setLikelihood] = useState<number>(1)
  const [description, setDescription] = useState('')
  const [immediateAction, setImmediateAction] = useState('')

  useEffect(() => {
    setMounted(true)
    // Set default date & time to now
    const now = new Date()
    setDate(now.toISOString().split('T')[0])
    setTime(now.toTimeString().slice(0, 5))
    
    // Load local data
    const saved = localStorage.getItem('syspex_hazard_db')
    if (saved) {
      setReports(JSON.parse(saved))
    }
  }, [])

  const calculateRisk = (s: number, l: number) => {
    const score = s * l
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    if (score >= 5 && score <= 12) level = 'MEDIUM'
    if (score >= 15) level = 'HIGH'
    return { score, level }
  }

  const risk = calculateRisk(severity, likelihood)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !location || !description) return

    const newReport: HazardReport = {
      id: `HZR-${Date.now().toString().slice(-6)}`,
      date, time, location, category, severity, likelihood,
      riskScore: risk.score, riskLevel: risk.level,
      description, immediateAction,
      status: 'OPEN'
    }

    const updatedReports = [newReport, ...reports]
    setReports(updatedReports)
    localStorage.setItem('syspex_hazard_db', JSON.stringify(updatedReports))

    // Reset Form
    setDescription('')
    setImmediateAction('')
    setSeverity(1)
    setLikelihood(1)
    alert(lang === 'ID' ? 'Laporan berhasil disimpan!' : 'Report saved successfully!')
  }

  const handleToggleStatus = (id: string) => {
    const updated = reports.map(r => 
      r.id === id ? { ...r, status: r.status === 'OPEN' ? 'CLOSED' : 'OPEN' as const } : r
    )
    setReports(updated)
    localStorage.setItem('syspex_hazard_db', JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    if (!confirm(lang === 'ID' ? 'Hapus laporan ini?' : 'Delete this report?')) return
    const updated = reports.filter(r => r.id !== id)
    setReports(updated)
    localStorage.setItem('syspex_hazard_db', JSON.stringify(updated))
  }

  const dict = {
    ID: {
      title: "Pelaporan Bahaya & Near-Miss",
      subtitle: "Laporkan kondisi tidak aman atau insiden hampir celaka untuk tindakan perbaikan segera.",
      breadcrumb: "K3L & Operasional",
      form_title: "Formulir Pelaporan Baru",
      f_date: "Tanggal Kejadian", f_time: "Waktu", f_loc: "Lokasi Detail",
      f_cat: "Kategori Temuan", c_haz: "Hazard (Kondisi/Tindakan Bahaya)", c_nm: "Near-Miss (Hampir Celaka)",
      f_sev: "Tingkat Keparahan (Severity 1-5)", f_lik: "Peluang Terjadi (Likelihood 1-5)",
      f_desc: "Deskripsi Temuan", f_desc_ph: "Jelaskan apa yang Anda lihat...",
      f_act: "Tindakan Langsung (Opsional)", f_act_ph: "Apa yang langsung dilakukan di lokasi?",
      f_submit: "Kirim Laporan",
      risk_res: "Tingkat Risiko (Otomatis):",
      log_title: "Log Temuan Terbuka (Open)",
      log_empty: "Tidak ada temuan terbuka. Area aman.",
      btn_close: "Tutup Kasus", btn_open: "Buka Kembali"
    },
    EN: {
      title: "Hazard & Near-Miss Report",
      subtitle: "Report unsafe conditions or near-miss incidents for immediate corrective action.",
      breadcrumb: "HSE & Operations",
      form_title: "New Report Form",
      f_date: "Incident Date", f_time: "Time", f_loc: "Exact Location",
      f_cat: "Report Category", c_haz: "Hazard (Unsafe Act/Condition)", c_nm: "Near-Miss",
      f_sev: "Severity (1-5)", f_lik: "Likelihood (1-5)",
      f_desc: "Description of Finding", f_desc_ph: "Describe what you saw...",
      f_act: "Immediate Action Taken (Optional)", f_act_ph: "What was done immediately on-site?",
      f_submit: "Submit Report",
      risk_res: "Calculated Risk Level:",
      log_title: "Open Findings Log",
      log_empty: "No open findings. Area is safe.",
      btn_close: "Close Case", btn_open: "Reopen"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN
  if (!mounted) return null

  const getRiskColor = (level: string) => {
    if (level === 'HIGH') return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400'
    if (level === 'MEDIUM') return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-400'
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-1">{t.title}</h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORM */}
        <div className="lg:col-span-7">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 sm:p-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-sm"></span> {t.form_title}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor={`${formId}-date`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_date}</label>
                  <input id={`${formId}-date`} type="date" required value={date} onChange={e=>setDate(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label htmlFor={`${formId}-time`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_time}</label>
                  <input id={`${formId}-time`} type="time" required value={time} onChange={e=>setTime(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_loc}</label>
                <input id={`${formId}-loc`} type="text" required placeholder="e.g. Warehouse B, Loading Dock 2" value={location} onChange={e=>setLocation(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label htmlFor={`${formId}-cat`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_cat}</label>
                <select id={`${formId}-cat`} value={category} onChange={e=>setCategory(e.target.value as any)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500 cursor-pointer">
                  <option value="HAZARD">{t.c_haz}</option>
                  <option value="NEAR_MISS">{t.c_nm}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-[4px]">
                <div>
                  <label htmlFor={`${formId}-sev`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_sev}</label>
                  <select id={`${formId}-sev`} value={severity} onChange={e=>setSeverity(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2px] focus:outline-none focus:border-teal-500 cursor-pointer">
                    <option value={1}>1 - Minor / First Aid</option>
                    <option value={2}>2 - Medical Treatment</option>
                    <option value={3}>3 - Lost Time Injury</option>
                    <option value={4}>4 - Single Fatality</option>
                    <option value={5}>5 - Multiple Fatalities</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-lik`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_lik}</label>
                  <select id={`${formId}-lik`} value={likelihood} onChange={e=>setLikelihood(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2px] focus:outline-none focus:border-teal-500 cursor-pointer">
                    <option value={1}>1 - Rare</option>
                    <option value={2}>2 - Unlikely</option>
                    <option value={3}>3 - Possible</option>
                    <option value={4}>4 - Likely</option>
                    <option value={5}>5 - Almost Certain</option>
                  </select>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.risk_res}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border rounded-[2px] ${getRiskColor(risk.level)}`}>
                    {risk.score} - {risk.level}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-desc`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_desc}</label>
                <textarea id={`${formId}-desc`} required rows={3} placeholder={t.f_desc_ph} value={description} onChange={e=>setDescription(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label htmlFor={`${formId}-act`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_act}</label>
                <textarea id={`${formId}-act`} rows={2} placeholder={t.f_act_ph} value={immediateAction} onChange={e=>setImmediateAction(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
              </div>

              <button type="submit" className="w-full py-3 bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer">
                {t.f_submit}
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: LOG TEMUAN */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
            {t.log_title} ({reports.filter(r => r.status === 'OPEN').length})
          </h2>
          
          <div className="space-y-3">
            {reports.filter(r => r.status === 'OPEN').length === 0 ? (
              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[4px] text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.log_empty}
              </div>
            ) : (
              reports.filter(r => r.status === 'OPEN').map(r => (
                <div key={r.id} className="p-4 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 rounded-[4px]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] font-black font-mono text-slate-900 dark:text-white">{r.id}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border rounded-[2px] ${getRiskColor(r.riskLevel)}`}>{r.riskLevel}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{r.description}</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-4 flex gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {r.location}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleStatus(r.id)} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer">
                      {t.btn_close}
                    </button>
                    <button onClick={() => handleDelete(r.id)} aria-label="Delete Report" className="px-3 py-1.5 border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[2px] cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
