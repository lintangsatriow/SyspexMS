"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'OPEN' | 'CLOSED'

interface HazardItem {
  id: string
  date: string
  location: string
  description: string
  riskLevel: RiskLevel
  suggestedAction: string
  reporter: string
  status: Status
}

export default function HazardReportPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  const [hazards, setHazards] = useState<HazardItem[]>([
    {
      id: 'HZD-8831A',
      date: new Date().toISOString().split('T')[0],
      location: 'Loading Dock Area B',
      description: 'Tumpahan oli hidrolik dari forklift tidak dibersihkan, lantai sangat licin.',
      riskLevel: 'HIGH',
      suggestedAction: 'Tutup area dengan barikade, gunakan spill kit, panggil tim maintenance.',
      reporter: 'Budi Prakoso',
      status: 'OPEN'
    },
    {
      id: 'HZD-9912C',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      location: 'Rak Penyimpanan Lorong C',
      description: 'Karet pelindung kaki rak (column guard) lepas dan baut pengunci hilang.',
      riskLevel: 'MEDIUM',
      suggestedAction: 'Ganti baut dynabolt dan pasang kembali karet pelindung.',
      reporter: 'Siti Aminah',
      status: 'CLOSED'
    }
  ])

  const [newLoc, setNewLoc] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newRisk, setNewRisk] = useState<RiskLevel>('MEDIUM')
  const [newAction, setNewAction] = useState('')
  const [newReporter, setNewReporter] = useState('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleAddHazard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLoc.trim() || !newDesc.trim()) return

    const newItem: HazardItem = {
      id: `HZD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      date: todayDate,
      location: newLoc,
      description: newDesc,
      riskLevel: newRisk,
      suggestedAction: newAction || 'Menunggu peninjauan tim HSE',
      reporter: newReporter || 'Anonim',
      status: 'OPEN'
    }

    setHazards([newItem, ...hazards])
    setNewLoc(''); setNewDesc(''); setNewAction(''); setNewReporter(''); setNewRisk('MEDIUM')
  }

  const handleDelete = (id: string) => {
    setHazards(hazards.filter(h => h.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setHazards(hazards.map(h => {
      if (h.id === id) {
        return { ...h, status: h.status === 'OPEN' ? 'CLOSED' : 'OPEN' }
      }
      return h
    }))
  }

  const dict = {
    ID: {
      breadcrumb: "Keselamatan Lapangan",
      title: "Hazard Report Log",
      subtitle: "Sistem pelaporan kondisi tidak aman (Unsafe Condition) dan tindakan tidak aman (Unsafe Act).",
      btn_print: "Cetak Log Pelaporan",
      
      p1_title: "1. Formulir Pelaporan Bahaya Baru",
      p1_loc: "Lokasi Penemuan",
      p1_risk: "Tingkat Keparahan",
      p1_desc: "Deskripsi Temuan Lapangan",
      p1_action: "Saran Tindakan Perbaikan (CAPA)",
      p1_reporter: "Nama Pelapor",
      btn_add: "Submit Laporan Bahaya",
      
      p2_title: "2. Register Pelaporan Bahaya (Hazard Log)",
      th_id: "ID / Tanggal",
      th_loc_desc: "Lokasi & Deskripsi Bahaya",
      th_risk: "Risiko",
      th_action: "Tindakan Perbaikan (CAPA)",
      th_status: "Status",
      th_reporter: "Pelapor",
      th_manage: "Kelola",
      
      btn_close: "Tutup",
      btn_open: "Buka",
      btn_delete: "Hapus",

      print_doc_type: "DOKUMEN RESMI REGISTER PELAPORAN BAHAYA • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      sign_hse: "Ditinjau & Disetujui (HSE Officer):",
      sign_mgr: "Mengetahui (Plant Manager):"
    },
    EN: {
      breadcrumb: "Field Safety",
      title: "Hazard Report Log",
      subtitle: "Reporting system for Unsafe Conditions and Unsafe Acts in the operational area.",
      btn_print: "Print Hazard Log",
      
      p1_title: "1. New Hazard Report Form",
      p1_loc: "Discovery Location",
      p1_risk: "Severity Level",
      p1_desc: "Field Finding Description",
      p1_action: "Suggested Corrective Action (CAPA)",
      p1_reporter: "Reporter Name",
      btn_add: "Submit Hazard Report",
      
      p2_title: "2. Hazard Reporting Register",
      th_id: "ID / Date",
      th_loc_desc: "Location & Description",
      th_risk: "Risk",
      th_action: "Corrective Action (CAPA)",
      th_status: "Status",
      th_reporter: "Reporter",
      th_manage: "Manage",
      
      btn_close: "Close",
      btn_open: "Open",
      btn_delete: "Del",

      print_doc_type: "OFFICIAL HAZARD REPORT REGISTER DOCUMENT • SYSPEX HSE",
      print_reg: "Registration No:",
      sign_hse: "Reviewed & Approved (HSE Officer):",
      sign_mgr: "Acknowledged By (Plant Manager):"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={hazards.length === 0}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Hazard Report Register</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">HZL-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. FORMULIR INPUT BAHAYA (HIDE ON PRINT) */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-6 space-y-4 print:hidden transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddHazard} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_loc}</label>
            <input id={`${formId}-loc`} type="text" value={newLoc} onChange={(e) => setNewLoc(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-risk`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_risk}</label>
            <select id={`${formId}-risk`} value={newRisk} onChange={(e) => setNewRisk(e.target.value as RiskLevel)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-reporter`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_reporter}</label>
            <input id={`${formId}-reporter`} type="text" value={newReporter} onChange={(e) => setNewReporter(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-desc`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_desc}</label>
            <textarea id={`${formId}-desc`} rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-action`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_action}</label>
            <textarea id={`${formId}-action`} rows={2} value={newAction} onChange={(e) => setNewAction(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none" />
          </div>
          
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" disabled={!newLoc.trim() || !newDesc.trim()} className="px-8 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition-colors">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL REGISTER BAHAYA */}
      <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-6 border border-slate-200 dark:border-slate-800 print:border-none print:p-0 space-y-4 transition-colors">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:hidden">
            TOTAL: {hazards.length} RECORD
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs min-w-[800px] print:min-w-0">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 print:bg-white print:border-black print:text-black transition-colors">
              <tr>
                <th className="py-3 px-3 w-28">{t.th_id}</th>
                <th className="py-3 px-3 w-1/3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_loc_desc}</th>
                <th className="py-3 px-3 w-24 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_risk}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_action}</th>
                <th className="py-3 px-3 w-20 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_status}</th>
                <th className="py-3 px-3 w-24 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_reporter}</th>
                <th className="py-3 px-3 text-center w-24 border-l-2 border-slate-200 dark:border-slate-800 print:hidden">{t.th_manage}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-100 print:divide-black transition-colors">
              {hazards.map((hz) => (
                <tr key={hz.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-white">
                  <td className="py-3 px-3 font-mono text-[9px] font-black text-slate-500 dark:text-slate-400 print:text-black">
                    {hz.id} <br/> <span className="font-bold">{hz.date}</span>
                  </td>
                  <td className="py-3 px-3 leading-relaxed border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black print:text-[10px]">
                    <p className="font-black text-slate-900 dark:text-white print:text-black uppercase">{hz.location}</p>
                    <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 print:text-black mt-1">{hz.description}</p>
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                    <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest inline-block print:border print:border-black print:bg-transparent print:text-black ${
                      hz.riskLevel === 'CRITICAL' ? 'bg-rose-900 text-rose-100' :
                      hz.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 dark:border dark:border-rose-900' :
                      hz.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 dark:border dark:border-amber-900' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border dark:border-emerald-900'
                    }`}>
                      {hz.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-[10px] leading-relaxed border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                    {hz.suggestedAction}
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                    <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest inline-block border print:bg-transparent print:border-black print:text-black ${
                      hz.status === 'OPEN' ? 'bg-white dark:bg-slate-950 border-amber-500 text-amber-600 dark:text-amber-500' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      {hz.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[9px] uppercase border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                    {hz.reporter}
                  </td>
                  <td className="py-3 px-3 border-l-2 border-slate-100 dark:border-slate-800/50 print:hidden space-y-2">
                    <button aria-label={`Toggle status for ${hz.id}`} onClick={() => handleToggleStatus(hz.id)} className={`block w-full text-center font-black px-1.5 py-1 text-[8px] uppercase tracking-widest border rounded-[2px] transition-colors ${
                      hz.status === 'OPEN' ? 'text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                    }`}>
                      {hz.status === 'OPEN' ? t.btn_close : t.btn_open}
                    </button>
                    <button aria-label={`Delete ${hz.id}`} onClick={() => handleDelete(hz.id)} className="block w-full text-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-black px-1.5 py-1 text-[8px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/60 rounded-[2px] transition-colors">
                      {t.btn_delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_mgr}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Plant Manager</p>
          </div>
        </div>

      </div>
    </div>
  )
}
