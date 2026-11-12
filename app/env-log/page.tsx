"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type WasteCategory = 'USED_OIL' | 'CONTAMINATED_RAGS' | 'USED_BATTERY' | 'CHEMICAL_WASTE' | 'E_WASTE'

interface WasteRecord {
  id: string
  logDate: string
  category: WasteCategory
  sourceArea: string
  volume: number
  unit: string
  manifestNo: string
  transporter: string
}

export default function EnvWasteLogPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Dummy Data
  const [logs, setLogs] = useState<WasteRecord[]>([
    {
      id: 'WST-1029A', logDate: new Date().toISOString().split('T')[0],
      category: 'USED_OIL', sourceArea: 'Maintenance Workshop',
      volume: 150, unit: 'Liters', manifestNo: 'MNF-2026-001', transporter: 'PT. Limbah Hijau Lestari'
    },
    {
      id: 'WST-1028B', logDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      category: 'CONTAMINATED_RAGS', sourceArea: 'Production Line 1 & 2',
      volume: 25, unit: 'Kg', manifestNo: 'MNF-2026-002', transporter: 'PT. Limbah Hijau Lestari'
    }
  ])

  // Form States
  const [newCat, setNewCat] = useState<WasteCategory>('USED_OIL')
  const [newSource, setNewSource] = useState('')
  const [newVol, setNewVol] = useState<number | ''>('')
  const [newUnit, setNewUnit] = useState('Kg')
  const [newManifest, setNewManifest] = useState('')
  const [newTransporter, setNewTransporter] = useState('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSource.trim() || newVol === '') return

    const newLog: WasteRecord = {
      id: `WST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      logDate: todayDate,
      category: newCat,
      sourceArea: newSource,
      volume: Number(newVol),
      unit: newUnit,
      manifestNo: newManifest.toUpperCase() || 'PENDING DISPOSAL',
      transporter: newTransporter || 'Internal Storage (TPS B3)'
    }

    setLogs([newLog, ...logs])
    setNewSource(''); setNewVol(''); setNewManifest(''); setNewTransporter('')
  }

  const handleDelete = (id: string) => {
    setLogs(logs.filter(p => p.id !== id))
  }

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "ISO 14001 Waste Log",
      subtitle: "Pencatatan dan pelacakan manifest pembuangan Limbah B3 (Bahan Berbahaya & Beracun) sesuai standar ISO 14001.",
      btn_print: "Cetak Manifest Limbah",
      
      p1_title: "1. Registrasi Timbulan Limbah B3",
      p1_cat: "Kategori Limbah",
      p1_source: "Area Sumber Limbah",
      p1_vol: "Volume / Jumlah",
      p1_unit: "Satuan",
      p1_manifest: "No. Dokumen Manifest (Bila ada)",
      p1_vendor: "Vendor Transporter",
      btn_add: "Rekam Data Limbah",
      
      p2_title: "2. Database Log Limbah B3",
      th_id: "ID Log / Tanggal",
      th_waste: "Kategori & Sumber",
      th_vol: "Volume",
      th_manifest: "Manifest Pengangkutan",
      th_vendor: "Vendor / Lokasi Simpan",
      th_action: "Kelola",
      
      btn_del: "Hapus",

      print_doc_type: "DOKUMEN RESMI PENGELOLAAN LINGKUNGAN • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      sign_hse: "Diserahkan Oleh (HSE Syspex):",
      sign_vendor: "Diterima Oleh (Transporter):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "ISO 14001 Waste Log",
      subtitle: "Hazardous waste tracking and disposal manifest logging conforming to ISO 14001 standards.",
      btn_print: "Print Waste Manifest Log",
      
      p1_title: "1. Hazardous Waste Registration",
      p1_cat: "Waste Category",
      p1_source: "Source Area",
      p1_vol: "Volume / Quantity",
      p1_unit: "Unit",
      p1_manifest: "Manifest Document No. (If disposed)",
      p1_vendor: "Transporter Vendor",
      btn_add: "Record Waste Data",
      
      p2_title: "2. Hazardous Waste Database Log",
      th_id: "Log ID / Date",
      th_waste: "Category & Source",
      th_vol: "Volume",
      th_manifest: "Disposal Manifest",
      th_vendor: "Vendor / Storage Loc",
      th_action: "Manage",
      
      btn_del: "Del",

      print_doc_type: "OFFICIAL ENVIRONMENTAL MANAGEMENT RECORD • SYSPEX HSE",
      print_reg: "Registration No:",
      sign_hse: "Handed Over By (Syspex HSE):",
      sign_vendor: "Received By (Transporter):"
    }
  }

  const t = dict[lang]

  const formatCategory = (cat: WasteCategory) => {
    const map: Record<WasteCategory, string> = {
      'USED_OIL': lang === 'ID' ? 'Oli Bekas' : 'Used Oil',
      'CONTAMINATED_RAGS': lang === 'ID' ? 'Majun Terkontaminasi' : 'Contaminated Rags',
      'USED_BATTERY': lang === 'ID' ? 'Aki Bekas' : 'Used Battery',
      'CHEMICAL_WASTE': lang === 'ID' ? 'Sisa Bahan Kimia' : 'Chemical Waste',
      'E_WASTE': lang === 'ID' ? 'Limbah Elektronik' : 'E-Waste'
    }
    return map[cat]
  }

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
            disabled={logs.length === 0}
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
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Hazardous Waste Manifest Log</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">LOG-ENV-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. FORMULIR INPUT LIMBAH (HIDE ON PRINT) */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddLog} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-cat`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_cat}</label>
            <select id={`${formId}-cat`} value={newCat} onChange={(e) => setNewCat(e.target.value as WasteCategory)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500">
              <option value="USED_OIL">{lang === 'ID' ? 'Oli Bekas' : 'Used Oil'}</option>
              <option value="CONTAMINATED_RAGS">{lang === 'ID' ? 'Majun Terkontaminasi' : 'Contaminated Rags'}</option>
              <option value="USED_BATTERY">{lang === 'ID' ? 'Aki Bekas' : 'Used Battery'}</option>
              <option value="CHEMICAL_WASTE">{lang === 'ID' ? 'Sisa Bahan Kimia' : 'Chemical Waste'}</option>
              <option value="E_WASTE">{lang === 'ID' ? 'Limbah Elektronik' : 'E-Waste'}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-source`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_source}</label>
            <input id={`${formId}-source`} type="text" value={newSource} onChange={(e) => setNewSource(e.target.value)} placeholder="..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-vol`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_vol}</label>
            <input id={`${formId}-vol`} type="number" min="0" value={newVol} onChange={(e) => setNewVol(e.target.value ? Number(e.target.value) : '')} placeholder="0" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-unit`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_unit}</label>
            <select id={`${formId}-unit`} value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500">
              <option value="Kg">Kg</option>
              <option value="Liters">Liters</option>
              <option value="Tons">Tons</option>
              <option value="Pcs">Pcs</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-manifest`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_manifest}</label>
            <input id={`${formId}-manifest`} type="text" value={newManifest} onChange={(e) => setNewManifest(e.target.value)} placeholder="Opsional jika belum diangkut" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-4 flex items-end justify-between gap-4">
            <div className="flex-1">
              <label htmlFor={`${formId}-vendor`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_vendor}</label>
              <input id={`${formId}-vendor`} type="text" value={newTransporter} onChange={(e) => setNewTransporter(e.target.value)} placeholder="Kosongkan jika disimpan di TPS B3 Internal" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
            </div>
            <button type="submit" disabled={!newSource.trim() || newVol === ''} className="px-8 py-2.5 h-[34px] bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition shrink-0">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL LOG LIMBAH B3 */}
      <div className="bg-white dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            TOTAL: {logs.length} RECORDS
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-[4px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors">
              <tr>
                <th className="py-3 px-3 w-32">{t.th_id}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 dark:border-slate-800">{t.th_waste}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 dark:border-slate-800">{t.th_vol}</th>
                <th className="py-3 px-3 w-40 border-l-2 border-slate-200 dark:border-slate-800">{t.th_manifest}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 dark:border-slate-800">{t.th_vendor}</th>
                <th className="py-3 px-3 text-center w-20 border-l-2 border-slate-200 dark:border-slate-800">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <td className="py-3 px-3 font-mono text-[10px] font-black text-slate-500">
                    {log.id} <br/> <span className="font-bold text-slate-900 dark:text-slate-300">{log.logDate}</span>
                  </td>
                  <td className="py-3 px-3 leading-relaxed border-l-2 border-slate-100 dark:border-slate-800">
                    <p className="font-black text-rose-700 dark:text-rose-400 uppercase">{formatCategory(log.category)}</p>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">{log.sourceArea}</p>
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {log.volume} <span className="text-[9px] text-slate-500 uppercase">{log.unit}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-700 dark:text-slate-400 border-l-2 border-slate-100 dark:border-slate-800">
                    {log.manifestNo}
                  </td>
                  <td className="py-3 px-3 font-bold text-[10px] uppercase border-l-2 border-slate-100 dark:border-slate-800">
                    {log.transporter}
                  </td>
                  <td className="py-3 px-3 border-l-2 border-slate-100 dark:border-slate-800 text-center">
                    <button onClick={() => handleDelete(log.id)} className="text-slate-400 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-500 font-black px-1.5 py-1 text-[9px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900 rounded-[2px] transition">
                      {t.btn_del}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOKUMEN CETAK (PRINT) - LOG TABEL BERSAMA TANDA TANGAN */}
      <div className="hidden print:block w-full">
        <table className="w-full text-left text-[10px] border-2 border-black">
          <thead className="border-b-2 border-black font-black uppercase tracking-widest text-black">
            <tr>
              <th className="py-2 px-2 w-24">{t.th_id}</th>
              <th className="py-2 px-2 w-1/4 border-l-2 border-black">{t.th_waste}</th>
              <th className="py-2 px-2 w-20 text-center border-l-2 border-black">{t.th_vol}</th>
              <th className="py-2 px-2 w-32 border-l-2 border-black">{t.th_manifest}</th>
              <th className="py-2 px-2 border-l-2 border-black">{t.th_vendor}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black text-black font-bold">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-2 font-mono">
                  {log.id} <br/> {log.logDate}
                </td>
                <td className="py-2 px-2 uppercase border-l-2 border-black">
                  {formatCategory(log.category)} <br/>
                  <span className="font-medium text-[9px]">{log.sourceArea}</span>
                </td>
                <td className="py-2 px-2 text-center border-l-2 border-black">
                  {log.volume} {log.unit}
                </td>
                <td className="py-2 px-2 font-mono border-l-2 border-black">
                  {log.manifestNo}
                </td>
                <td className="py-2 px-2 uppercase border-l-2 border-black">
                  {log.transporter}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="grid grid-cols-2 gap-12 pt-12 mt-8 border-t-4 border-black text-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-16">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-gray-100">
            <p className="text-[9px] font-black uppercase tracking-widest mb-16">{t.sign_vendor}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Authorized Transporter</p>
          </div>
        </div>
      </div>

    </div>
  )
}
