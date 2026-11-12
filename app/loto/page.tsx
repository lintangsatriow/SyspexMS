"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type LotoStatus = 'LOCKED' | 'CLEARED'
type EnergyType = 'ELECTRICAL' | 'MECHANICAL' | 'PNEUMATIC' | 'HYDRAULIC'

interface LotoPermit {
  id: string
  date: string
  equipmentId: string
  equipmentName: string
  energyTypes: EnergyType[]
  authorizedPic: string
  status: LotoStatus
}

export default function LotoPermitPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Dummy Data
  const [permits, setPermits] = useState<LotoPermit[]>([
    {
      id: 'LOTO-992A', date: new Date().toISOString().split('T')[0],
      equipmentId: 'MC-PACK-01', equipmentName: 'Stretch Wrapper Line 1',
      energyTypes: ['ELECTRICAL', 'PNEUMATIC'], authorizedPic: 'Agus Santoso', status: 'LOCKED'
    },
    {
      id: 'LOTO-881B', date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      equipmentId: 'CV-MAIN-05', equipmentName: 'Main Conveyor Belt',
      energyTypes: ['ELECTRICAL', 'MECHANICAL'], authorizedPic: 'Rendi Saputra', status: 'CLEARED'
    }
  ])

  // Form States
  const [newEqId, setNewEqId] = useState('')
  const [newEqName, setNewEqName] = useState('')
  const [newPic, setNewPic] = useState('')
  const [selectedEnergies, setSelectedEnergies] = useState<EnergyType[]>([])

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const toggleEnergy = (type: EnergyType) => {
    setSelectedEnergies(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleAddPermit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEqId.trim() || !newEqName.trim() || selectedEnergies.length === 0) return

    const newPermit: LotoPermit = {
      id: `LOTO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      date: todayDate,
      equipmentId: newEqId.toUpperCase(),
      equipmentName: newEqName,
      energyTypes: selectedEnergies,
      authorizedPic: newPic || 'Anonim',
      status: 'LOCKED'
    }

    setPermits([newPermit, ...permits])
    setNewEqId(''); setNewEqName(''); setNewPic(''); setSelectedEnergies([])
  }

  const handleDelete = (id: string) => {
    setPermits(permits.filter(p => p.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setPermits(permits.map(p => {
      if (p.id === id) return { ...p, status: p.status === 'LOCKED' ? 'CLEARED' : 'LOCKED' }
      return p
    }))
  }

  const dict = {
    ID: {
      breadcrumb: "K3L & Operasional",
      title: "LOTO Permit Register",
      subtitle: "Registrasi isolasi energi berbahaya (Lockout/Tagout) untuk perawatan mesin dan peralatan.",
      btn_print: "Cetak Danger Tag (LOTO)",
      
      p1_title: "1. Registrasi Izin Isolasi Energi (LOTO)",
      p1_eq_id: "ID Mesin / Peralatan",
      p1_eq_name: "Nama Mesin / Peralatan",
      p1_pic: "Authorized Person (Teknisi)",
      p1_energy: "Sumber Energi Diisolasi",
      btn_add: "Terbitkan Izin LOTO",
      
      p2_title: "2. LOTO Active Log",
      th_id: "ID Izin / Tgl",
      th_eq: "Identitas Peralatan",
      th_energy: "Isolasi Energi",
      th_status: "Status LOTO",
      th_pic: "Authorized Person",
      th_action: "Kelola",
      
      btn_lock: "Kunci LOTO",
      btn_clear: "Cabut LOTO",
      btn_del: "Hapus",

      print_doc_type: "DANGER TAG (LOTO) • SYSPEX HSE",
      print_warn: "DILARANG MENGOPERASIKAN",
      print_reason: "PERALATAN INI SEDANG DIKUNCI (LOCKED OUT) UNTUK PERAWATAN.",
      sign_tech: "Teknisi Berwenang (Authorized):",
      sign_hse: "Mengetahui (HSE Dept):"
    },
    EN: {
      breadcrumb: "HSE & Operations",
      title: "LOTO Permit Register",
      subtitle: "Hazardous energy isolation (Lockout/Tagout) registry for machine maintenance and servicing.",
      btn_print: "Print Danger Tag (LOTO)",
      
      p1_title: "1. Energy Isolation Permit Registration (LOTO)",
      p1_eq_id: "Machine / Equipment ID",
      p1_eq_name: "Equipment Name",
      p1_pic: "Authorized Person (Technician)",
      p1_energy: "Isolated Energy Sources",
      btn_add: "Issue LOTO Permit",
      
      p2_title: "2. LOTO Active Log",
      th_id: "Permit ID / Date",
      th_eq: "Equipment Identity",
      th_energy: "Energy Isolation",
      th_status: "LOTO Status",
      th_pic: "Authorized Person",
      th_action: "Manage",
      
      btn_lock: "Apply Lock",
      btn_clear: "Clear Lock",
      btn_del: "Del",

      print_doc_type: "DANGER TAG (LOTO) • SYSPEX HSE",
      print_warn: "DO NOT OPERATE",
      print_reason: "THIS EQUIPMENT IS LOCKED OUT FOR MAINTENANCE.",
      sign_tech: "Authorized Technician:",
      sign_hse: "Acknowledged By (HSE Dept):"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={permits.filter(p => p.status === 'LOCKED').length === 0}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* 1. FORMULIR INPUT LOTO (HIDE ON PRINT) */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddPermit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor={`${formId}-id`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_eq_id}</label>
            <input id={`${formId}-id`} type="text" value={newEqId} onChange={(e) => setNewEqId(e.target.value)} placeholder="e.g. CV-01" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500" />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor={`${formId}-name`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_eq_name}</label>
            <input id={`${formId}-name`} type="text" value={newEqName} onChange={(e) => setNewEqName(e.target.value)} placeholder="..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor={`${formId}-pic`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_pic}</label>
            <input id={`${formId}-pic`} type="text" value={newPic} onChange={(e) => setNewPic(e.target.value)} placeholder="..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          
          <div className="lg:col-span-4 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
            <label className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">{t.p1_energy}</label>
            <div className="flex flex-wrap gap-3">
              {(['ELECTRICAL', 'MECHANICAL', 'PNEUMATIC', 'HYDRAULIC'] as EnergyType[]).map((type) => (
                <button
                  key={type} type="button" onClick={() => toggleEnergy(type)}
                  className={`px-4 py-2 rounded-[4px] text-[9px] font-black uppercase tracking-widest border transition-colors ${
                    selectedEnergies.includes(type) 
                      ? 'bg-rose-600 border-rose-600 text-white' 
                      : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-500 hover:border-rose-500 dark:hover:border-rose-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex items-end justify-end mt-4">
            <button type="submit" disabled={!newEqId.trim() || !newEqName.trim() || selectedEnergies.length === 0} className="px-8 py-2.5 bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL LOTO REGISTER */}
      <div className="bg-white dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            {permits.filter(p => p.status === 'LOCKED').length} ACTIVE LOCKS
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-[4px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors">
              <tr>
                <th className="py-3 px-3 w-32">{t.th_id}</th>
                <th className="py-3 px-3 w-1/3 border-l-2 border-slate-200 dark:border-slate-800">{t.th_eq}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 dark:border-slate-800">{t.th_energy}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 dark:border-slate-800">{t.th_status}</th>
                <th className="py-3 px-3 w-32 border-l-2 border-slate-200 dark:border-slate-800">{t.th_pic}</th>
                <th className="py-3 px-3 text-center w-24 border-l-2 border-slate-200 dark:border-slate-800">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
              {permits.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <td className="py-3 px-3 font-mono text-[10px] font-black text-slate-500">
                    {p.id} <br/> <span className="font-bold text-slate-900 dark:text-slate-300">{p.date}</span>
                  </td>
                  <td className="py-3 px-3 leading-relaxed border-l-2 border-slate-100 dark:border-slate-800">
                    <p className="font-black text-slate-900 dark:text-white uppercase">{p.equipmentId}</p>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">{p.equipmentName}</p>
                  </td>
                  <td className="py-3 px-3 border-l-2 border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-1">
                      {p.energyTypes.map(en => (
                        <span key={en} className="text-[8px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-1.5 py-0.5 rounded-[2px]">{en}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800">
                    <span className={`px-2 py-1 rounded-[2px] text-[9px] font-black uppercase tracking-widest inline-block border ${
                      p.status === 'LOCKED' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-900/50'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[10px] uppercase border-l-2 border-slate-100 dark:border-slate-800">
                    {p.authorizedPic}
                  </td>
                  <td className="py-3 px-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-2">
                    <button onClick={() => handleToggleStatus(p.id)} className={`block w-full text-center font-black px-1.5 py-1 text-[8px] uppercase tracking-widest border rounded-[2px] transition ${
                      p.status === 'LOCKED' ? 'text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                    }`}>
                      {p.status === 'LOCKED' ? t.btn_clear : t.btn_lock}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="block w-full text-center text-slate-400 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-500 font-black px-1.5 py-1 text-[8px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900 rounded-[2px] transition">
                      {t.btn_del}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOKUMEN CETAK (PRINT) - DANGER TAGS */}
      <div className="hidden print:block w-full">
        {permits.filter(p => p.status === 'LOCKED').length === 0 ? (
          <p className="text-black font-black">NO ACTIVE LOTO PERMITS TO PRINT.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {permits.filter(p => p.status === 'LOCKED').map((p) => (
              <div key={p.id} className="border-[8px] border-black p-0 flex flex-col h-[600px] text-center bg-white relative overflow-hidden break-inside-avoid">
                <div className="h-8 w-full bg-[repeating-linear-gradient(45deg,#000000,#000000_15px,#ffffff_15px,#ffffff_30px)] border-b-4 border-black"></div>
                <div className="bg-black text-white py-8 px-4 border-b-4 border-black">
                  <h1 className="text-6xl font-black tracking-tighter uppercase mb-2">DANGER</h1>
                  <h2 className="text-2xl font-black uppercase tracking-widest">{t.print_warn}</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col text-black">
                  <p className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">{t.print_reason}</p>
                  
                  <div className="text-left mb-6 mt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Equipment ID:</p>
                    <p className="text-3xl font-black border-b-2 border-black pb-1">{p.equipmentId}</p>
                    <p className="text-sm font-bold uppercase mt-1">{p.equipmentName}</p>
                  </div>

                  <div className="text-left mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Energy Isolated:</p>
                    <div className="flex flex-wrap gap-2">
                      {p.energyTypes.map(en => (
                        <span key={en} className="text-xs font-black uppercase border-2 border-black px-2 py-1">{en}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t-4 border-black pt-4 text-left text-[10px] font-black uppercase tracking-widest space-y-4">
                    <div>
                      <p className="mb-8">{t.sign_tech}</p>
                      <div className="border-b-2 border-black w-full"></div>
                      <p className="mt-1">{p.authorizedPic}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p>Date Applied:</p>
                        <p className="border-b-2 border-black pb-1">{p.date}</p>
                      </div>
                      <div>
                        <p>Time:</p>
                        <p className="border-b-2 border-black pb-1">______:______</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
