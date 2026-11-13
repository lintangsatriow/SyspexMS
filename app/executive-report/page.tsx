"use client"

import { useState, useEffect, useId, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

// Struktur Database Internal
interface HseRecord {
  id: string
  year: number
  month: number // 1-12
  lti: number
  spills: number
  manHours: number
  recordableIncidents: number
  hazardReports: number
}

type PeriodFilter = 'YTD' | 'Q1' | 'Q2' | 'Q3' | 'Q4'

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Filter States
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('YTD')

  // Database State (Disimpan di LocalStorage)
  const [records, setRecords] = useState<HseRecord[]>([])

  // Form Input States
  const [inputYear, setInputYear] = useState<number>(currentYear)
  const [inputMonth, setInputMonth] = useState<number>(new Date().getMonth() + 1)
  const [inputLti, setInputLti] = useState<number | ''>('')
  const [inputSpills, setInputSpills] = useState<number | ''>('')
  const [inputManHours, setInputManHours] = useState<number | ''>('')
  const [inputIncidents, setInputIncidents] = useState<number | ''>('')
  const [inputHazards, setInputHazards] = useState<number | ''>('')

  // Inisialisasi Database
  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
    setMounted(true)
    
    const savedData = localStorage.getItem('syspex_hse_db')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    } else {
      // Seed Data Awal agar tidak kosong
      const seedData: HseRecord[] = [
        { id: '1', year: currentYear, month: 1, lti: 0, spills: 0, manHours: 250000, recordableIncidents: 0, hazardReports: 22 },
        { id: '2', year: currentYear, month: 2, lti: 0, spills: 1, manHours: 245000, recordableIncidents: 1, hazardReports: 18 },
        { id: '3', year: currentYear, month: 3, lti: 0, spills: 0, manHours: 260000, recordableIncidents: 0, hazardReports: 35 },
      ]
      setRecords(seedData)
      localStorage.setItem('syspex_hse_db', JSON.stringify(seedData))
    }
  }, [currentYear])

  // Menyimpan perubahan ke LocalStorage
  const saveRecords = (newRecords: HseRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('syspex_hse_db', JSON.stringify(newRecords))
  }

  // Fungsi Tambah Data Manual
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputLti === '' || inputManHours === '' || inputIncidents === '' || inputHazards === '') return

    const newRecord: HseRecord = {
      id: Math.random().toString(36).substring(2, 9),
      year: inputYear,
      month: inputMonth,
      lti: Number(inputLti),
      spills: Number(inputSpills) || 0,
      manHours: Number(inputManHours),
      recordableIncidents: Number(inputIncidents),
      hazardReports: Number(inputHazards)
    }

    // Cek apakah bulan dan tahun sudah ada, jika ya timpa (update)
    const existingIdx = records.findIndex(r => r.year === inputYear && r.month === inputMonth)
    let updatedRecords = [...records]
    
    if (existingIdx >= 0) {
      updatedRecords[existingIdx] = newRecord
    } else {
      updatedRecords.push(newRecord)
    }
    
    saveRecords(updatedRecords)
    
    // Reset sebagian form
    setInputLti(''); setInputSpills(''); setInputManHours(''); setInputIncidents(''); setInputHazards('')
  }

  const handleDeleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
  }

  // MESIN FILTER & KALKULASI OTOMATIS
  const filteredData = useMemo(() => {
    let filtered = records.filter(r => r.year === selectedYear)
    
    if (selectedPeriod === 'Q1') filtered = filtered.filter(r => r.month >= 1 && r.month <= 3)
    if (selectedPeriod === 'Q2') filtered = filtered.filter(r => r.month >= 4 && r.month <= 6)
    if (selectedPeriod === 'Q3') filtered = filtered.filter(r => r.month >= 7 && r.month <= 9)
    if (selectedPeriod === 'Q4') filtered = filtered.filter(r => r.month >= 10 && r.month <= 12)

    // Agregasi Data Lagging
    const totalLti = filtered.reduce((sum, r) => sum + r.lti, 0)
    const totalSpills = filtered.reduce((sum, r) => sum + r.spills, 0)
    const totalManHours = filtered.reduce((sum, r) => sum + r.manHours, 0)
    const totalIncidents = filtered.reduce((sum, r) => sum + r.recordableIncidents, 0)

    // Rumus TRIR OSHA: (Total Insiden * 200,000) / Total Man Hours
    const trir = totalManHours > 0 ? ((totalIncidents * 200000) / totalManHours).toFixed(2) : '0.00'

    // Format Man Hours (K / M)
    let formattedManHours = '0'
    if (totalManHours >= 1000000) formattedManHours = (totalManHours / 1000000).toFixed(1) + 'M'
    else if (totalManHours >= 1000) formattedManHours = (totalManHours / 1000).toFixed(1) + 'K'
    else formattedManHours = totalManHours.toString()

    // Siapkan Data Chart agar berurutan per bulan
    const chartData = filtered.sort((a, b) => a.month - b.month).map(r => ({
      month: new Date(2000, r.month - 1).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase(),
      hazards: r.hazardReports,
      incidents: r.recordableIncidents
    }))

    const maxHazards = chartData.length > 0 ? Math.max(...chartData.map(d => Math.max(d.hazards, d.incidents))) : 0

    return { totalLti, totalSpills, totalManHours, formattedManHours, trir, chartData, maxHazards }
  }, [records, selectedYear, selectedPeriod, lang])

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "Visibilitas metrik kinerja K3L tersinkronisasi otomatis dari database internal.",
      btn_print: "Cetak Laporan",
      
      sect_lagging: "Lagging Indicators (Data Langsung)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Insiden Lingkungan (Spills)",
      lag_4: "Total Jam Kerja (Man-Hours)",
      
      sect_leading: "Leading Indicators (Dalam Pengembangan)",
      lead_soon: "Akan Terintegrasi Otomatis Dengan Modul Operasional.",
      lead_1: "Pelaporan Bahaya Terbuka",
      lead_2: "Penyelesaian CAPA",
      lead_3: "Kepatuhan TBM",
      lead_4: "Skor Audit",
      
      chart_title: `Korelasi Pelaporan Proaktif vs Insiden (${selectedPeriod} ${selectedYear})`,
      chart_hazards: "Laporan Bahaya (Pencegahan)",
      chart_incidents: "Insiden Tercatat",
      
      mgr_title: "DATA HSE (Input & Log Histori)",
      mgr_add: "Tambah / Ubah Data Kinerja Bulanan",
      form_y: "Tahun", form_m: "Bulan", form_lti: "Total LTI", form_spill: "Total Spills", form_hrs: "Man-Hours", form_inc: "Recordable Incidents", form_haz: "Hazard Reports", btn_save: "Simpan Database",

      print_doc_type: "LAPORAN KINERJA K3L",
      print_reg: "Periode Laporan:",
      sign_hse: "Dianalisa Oleh (HSE Supervisor):",
      sign_gm: "Diketahui Oleh (Director):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "HSE performance metrics visibility automatically synchronized from internal database.",
      btn_print: "Print Report",
      
      sect_lagging: "Lagging Indicators (Live Data)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Environmental Spills",
      lag_4: "Total Safe Man-Hours",
      
      sect_leading: "Leading Indicators (Coming Soon)",
      lead_soon: "Will Be Auto-Synchronized With Operational Modules.",
      lead_1: "Open Hazard Reports",
      lead_2: "CAPA Closure Rate",
      lead_3: "TBM Compliance",
      lead_4: "Audit Score",
      
      chart_title: `Proactive Reporting vs Incident Correlation (${selectedPeriod} ${selectedYear})`,
      chart_hazards: "Hazard Reports (Prevention)",
      chart_incidents: "Recordable Incidents",
      
      mgr_title: "DATA HSE (Input & History Logs)",
      mgr_add: "Add / Update Monthly Performance Data",
      form_y: "Year", form_m: "Month", form_lti: "Total LTI", form_spill: "Total Spills", form_hrs: "Man-Hours", form_inc: "Recordable Inc.", form_haz: "Hazard Reports", btn_save: "Save to Database",

      print_doc_type: "HSE PERFORMANCE REPORT",
      print_reg: "Report Period:",
      sign_hse: "Analyzed By (HSE Supervisor):",
      sign_gm: "Acknowledged By (Director):"
    }
  }

  const t = dict[lang]

  if (!mounted) return null // Mencegah hydration error

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB & FILTER BAR */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
          </div>
          
          {/* FILTER MESIN WAKTU */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px]">
            <div className="flex items-center gap-2 px-2 border-r border-slate-300 dark:border-slate-700">
              <span className="text-[9px] font-black uppercase text-slate-500">Year:</span>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                {[currentYear-1, currentYear, currentYear+1].map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 px-2">
              <span className="text-[9px] font-black uppercase text-slate-500">Period:</span>
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                <option value="YTD" className="dark:bg-slate-900">YEAR TO DATE (YTD)</option>
                <option value="Q1" className="dark:bg-slate-900">QUARTER 1 (Q1)</option>
                <option value="Q2" className="dark:bg-slate-900">QUARTER 2 (Q2)</option>
                <option value="Q3" className="dark:bg-slate-900">QUARTER 3 (Q3)</option>
                <option value="Q4" className="dark:bg-slate-900">QUARTER 4 (Q4)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse"></span>
                <span className="text-[8px] font-black text-emerald-800 dark:text-emerald-500 tracking-widest">INTERNAL DATABASE</span>
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button onClick={() => window.print()} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm shrink-0">
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">{selectedPeriod} {selectedYear}</span>
          </div>
        </div>
      </div>

      {/* 1. LAGGING INDICATORS (LIVE) */}
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:text-black print:border-black">
          {t.sect_lagging}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${Number(filteredData.trir) > 1.0 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_1}</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black print:text-black ${Number(filteredData.trir) > 1.0 ? 'text-rose-600 dark:text-rose-500' : 'text-slate-900 dark:text-white'}`}>{filteredData.trir}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">/ 200K HRS</span>
            </div>
          </div>
          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.totalLti > 0 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_2}</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black print:text-black ${filteredData.totalLti > 0 ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>{filteredData.totalLti}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">CASES</span>
            </div>
          </div>
          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.totalSpills > 0 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_3}</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black print:text-black ${filteredData.totalSpills > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-slate-900 dark:text-white'}`}>{filteredData.totalSpills}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">EVENTS</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white print:text-black">{filteredData.formattedManHours}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">HOURS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LEADING INDICATORS (COMING SOON) */}
      <div className="mt-8 relative group opacity-60 hover:opacity-100 transition-opacity duration-500">
        <div className="flex justify-between items-end border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:text-black print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 print:text-black">
            {t.sect_leading}
          </h2>
          <span className="text-[8px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 rounded-[2px]">
            {t.lead_soon}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4 grayscale">
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_1}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-</span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_2}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_3}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TREND CHART SECTION (DYNAMIC) */}
      <div className="mt-8 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black print:bg-transparent transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.chart_title}
          </h2>
          <div className="flex flex-wrap gap-4 mt-3 sm:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-600 border border-teal-700 print:border-black print:bg-gray-300"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_hazards}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-600 border border-rose-700 print:border-black print:bg-black"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_incidents}</span>
            </div>
          </div>
        </div>

        {/* CSS Grid Bar Chart */}
        <div className="flex items-end gap-2 sm:gap-6 h-56 pt-4">
          {filteredData.chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              NO DATA FOR SELECTED PERIOD
            </div>
          ) : (
            filteredData.chartData.map((data, idx) => {
              const hazardHeight = filteredData.maxHazards > 0 ? (data.hazards / filteredData.maxHazards) * 100 : 0
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1.5 h-full relative">
                    <div style={{ height: `${hazardHeight}%` }} className="w-1/2 max-w-[45px] bg-teal-600 border-t-2 border-teal-400 dark:border-teal-300 print:border-black print:bg-gray-300 transition-all duration-500 relative group">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-teal-700 dark:text-teal-400 print:text-black opacity-0 group-hover:opacity-100 print:opacity-100">{data.hazards}</span>
                    </div>
                    {data.incidents > 0 && (
                      <div style={{ height: `${(data.incidents / filteredData.maxHazards) * 100}%` }} className="w-1/2 max-w-[45px] bg-rose-600 border-t-2 border-rose-400 dark:border-rose-300 print:border-black print:bg-black transition-all duration-500 relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-700 dark:text-rose-400 print:text-black opacity-0 group-hover:opacity-100 print:opacity-100">{data.incidents}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 print:text-black border-t-2 border-slate-200 dark:border-slate-800 print:border-black w-full text-center pt-3">
                    {data.month}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 4. DOKUMEN CETAK (PRINT) - SIGNATURES */}
      <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black text-black">
        <div className="text-center border-2 border-black p-4">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">HSE Supervisor</p>
        </div>
        <div className="text-center border-2 border-black p-4 bg-gray-100">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_gm}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">Director</p>
        </div>
      </div>

      {/* 5. DATA HSE (HIDE ON PRINT) */}
      <div className="mt-12 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 14h6M9 10h6" /></svg>
          {t.mgr_title}
        </h2>
        
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] p-5">
          <p className="text-[9px] font-black text-slate-700 dark:text-slate-300 mb-4">{t.mgr_add}</p>
          <form onSubmit={handleAddRecord} className="grid grid-cols-2 md:grid-cols-8 gap-3 items-end">
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_y}</label>
              <input type="number" value={inputYear} onChange={e=>setInputYear(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_m}</label>
              <select value={inputMonth} onChange={e=>setInputMonth(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_hrs}</label>
              <input type="number" placeholder="250000" value={inputManHours} onChange={e=>setInputManHours(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_lti}</label>
              <input type="number" min="0" placeholder="0" value={inputLti} onChange={e=>setInputLti(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_spill}</label>
              <input type="number" min="0" placeholder="0" value={inputSpills} onChange={e=>setInputSpills(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_inc}</label>
              <input type="number" min="0" placeholder="0" value={inputIncidents} onChange={e=>setInputIncidents(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_haz}</label>
              <input type="number" min="0" placeholder="0" value={inputHazards} onChange={e=>setInputHazards(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <button type="submit" disabled={inputManHours===''} className="w-full py-1.5 bg-teal-700 dark:bg-teal-600 hover:bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] disabled:opacity-50 transition-colors h-[30px]">
                {t.btn_save}
              </button>
            </div>
          </form>

          {/* HISTORICAL LOG TABLE */}
          <div className="mt-6 border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2 px-3">PERIOD</th>
                  <th className="py-2 px-3">MAN-HOURS</th>
                  <th className="py-2 px-3">LTI</th>
                  <th className="py-2 px-3">SPILLS</th>
                  <th className="py-2 px-3">INCIDENTS</th>
                  <th className="py-2 px-3">HAZARDS</th>
                  <th className="py-2 px-3 text-center">ACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {records.sort((a,b) => b.year - a.year || b.month - a.month).map(r => (
                  <tr key={r.id} className="hover:bg-white dark:hover:bg-slate-950 transition-colors">
                    <td className="py-2 px-3">{r.year} - M{r.month.toString().padStart(2, '0')}</td>
                    <td className="py-2 px-3 font-mono">{r.manHours.toLocaleString()}</td>
                    <td className="py-2 px-3">{r.lti}</td>
                    <td className="py-2 px-3">{r.spills}</td>
                    <td className="py-2 px-3 text-rose-600 dark:text-rose-400">{r.recordableIncidents}</td>
                    <td className="py-2 px-3 text-teal-600 dark:text-teal-400">{r.hazardReports}</td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => handleDeleteRecord(r.id)} className="text-[8px] font-black uppercase text-rose-500 hover:text-rose-700 border border-transparent hover:border-rose-300 rounded px-1">DEL</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
