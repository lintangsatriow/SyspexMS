"use client"

import { useState, useEffect, useId, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface HseRecord {
  id: string
  year: number
  month: number
  lti: number
  spills: number
  manDays?: number
  manHours: number
  recordableIncidents: number
  hazardReports: number
  capaClosure?: number
  tbmCompliance?: number
  auditScore?: number
}

type PeriodFilter = 'YTD' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
type YearFilter = number | 'ALL'

const TrendLineChart = ({ 
  title, 
  data, 
  labels, 
  minTarget, 
  maxTarget, 
  unit,
  isMultiYear
}: { 
  title: string, data: number[], labels: string[], minTarget: number, maxTarget: number, unit: string, isMultiYear?: boolean 
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black transition-colors">
        <div className="flex justify-between items-end border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
        </div>
        <div className="h-48 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-800">
          NO DATA FOR SELECTED PERIOD
        </div>
      </div>
    )
  }

  const formatVal = (val: number) => val >= 1000 ? (val/1000).toFixed(1) + 'K' : val.toString()

  const padX = 40
  const padY = 40
  const width = 1000
  const height = 260
  const plotWidth = width - padX * 2
  const plotHeight = height - padY * 2

  const maxValue = Math.max(...data, maxTarget) * 1.15 
  const mapY = (val: number) => padY + plotHeight - (val / (maxValue || 1)) * plotHeight
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : plotWidth / 2

  const points = data.map((val, i) => `${data.length > 1 ? padX + i * stepX : padX + stepX},${mapY(val)}`).join(' ')

  return (
    <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black print:bg-transparent transition-colors">
      <div className="flex justify-between items-end border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
        <div className="text-right">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">SAFE RANGE / MO</span>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500">{formatVal(minTarget)} - {formatVal(maxTarget)} {unit}</span>
        </div>
      </div>
      
      <div className="w-full overflow-hidden relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <rect x={padX} y={mapY(maxTarget)} width={plotWidth} height={mapY(minTarget) - mapY(maxTarget)} className="fill-emerald-50 dark:fill-emerald-900/20 print:fill-gray-100" />
          
          <line x1={padX} y1={mapY(maxTarget)} x2={width-padX} y2={mapY(maxTarget)} className="stroke-emerald-500 dark:stroke-emerald-600 print:stroke-black" strokeWidth="2" strokeDasharray="6,6" />
          <line x1={padX} y1={mapY(minTarget)} x2={width-padX} y2={mapY(minTarget)} className="stroke-emerald-500 dark:stroke-emerald-600 print:stroke-black" strokeWidth="2" strokeDasharray="6,6" />

          {data.length > 1 && <polyline points={points} fill="none" className="stroke-slate-800 dark:stroke-slate-300 print:stroke-black" strokeWidth="2.5" />}

          {data.map((val, i) => {
            const cx = data.length > 1 ? padX + i * stepX : padX + stepX
            const cy = mapY(val)
            const isSafe = val >= minTarget && val <= maxTarget
            
            const pointClass = isSafe ? "fill-slate-800 dark:fill-slate-300 print:fill-black" : (val > maxTarget ? "fill-rose-600 print:fill-gray-500" : "fill-amber-500 print:fill-gray-300")
            const labelClass = isSafe ? "fill-slate-600 dark:fill-slate-400 print:fill-black" : (val > maxTarget ? "fill-rose-600 dark:fill-rose-400 print:fill-black" : "fill-amber-600 dark:fill-amber-500 print:fill-black")

            return (
              <g key={i} className="group cursor-pointer">
                <circle cx={cx} cy={cy} r={isMultiYear ? "4.5" : "6"} className={`${pointClass} stroke-white dark:stroke-[#0b0f19] print:stroke-white`} strokeWidth="1.5" />
                <text x={cx} y={cy - 12} textAnchor="middle" className={`text-[10px] font-black ${labelClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {labels[i]}: {formatVal(val)}
                </text>
              </g>
            )
          })}
        </svg>
        
        <div className="flex justify-between mt-2" style={{ paddingLeft: `${(padX/width)*100}%`, paddingRight: `${(padX/width)*100}%` }}>
          {labels.map((lbl, i) => {
            // Jika data lebih dari 14 bulan (multi-year), tampilkan label setiap 3 bulan agar tidak bertumpuk
            const showLabel = !isMultiYear || labels.length <= 14 || i % 3 === 0 || i === labels.length - 1
            return (
              <span key={i} className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest text-center w-10 -ml-5">
                {showLabel ? lbl : ''}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)

  const currentYear = new Date().getFullYear()
  // Default langsung ke 'ALL' agar rentang 2024 - 2026 langsung terlihat
  const [selectedYear, setSelectedYear] = useState<YearFilter>('ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('YTD')

  const [records, setRecords] = useState<HseRecord[]>([])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inputYear, setInputYear] = useState<number>(currentYear)
  const [inputMonth, setInputMonth] = useState<number>(new Date().getMonth() + 1)
  const [inputManDays, setInputManDays] = useState<number | ''>('')
  const [inputManHours, setInputManHours] = useState<number | ''>('')
  const [inputLti, setInputLti] = useState<number | ''>(0)
  const [inputSpills, setInputSpills] = useState<number | ''>(0)
  const [inputIncidents, setInputIncidents] = useState<number | ''>(0)
  const [inputHazards, setInputHazards] = useState<number | ''>(0)

  const [showInfo, setShowInfo] = useState(false)

  const TARGET_TRIR = 1.0
  const TARGET_LTI = 0
  const TARGET_MAN_DAYS_MIN = 1350
  const TARGET_MAN_DAYS_MAX = 1650
  const TARGET_MAN_HOURS_MIN = 10800 
  const TARGET_MAN_HOURS_MAX = 13200 

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem('syspex_hse_db')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    }
  }, [])

  const saveRecords = (newRecords: HseRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('syspex_hse_db', JSON.stringify(newRecords))
  }

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputManHours === '' || inputManDays === '') return

    const newRecord: HseRecord = {
      id: editingId || Math.random().toString(36).substring(2, 9),
      year: inputYear,
      month: inputMonth,
      lti: inputLti === '' ? 0 : Number(inputLti),
      spills: inputSpills === '' ? 0 : Number(inputSpills),
      manDays: Number(inputManDays),
      manHours: Number(inputManHours),
      recordableIncidents: inputIncidents === '' ? 0 : Number(inputIncidents),
      hazardReports: inputHazards === '' ? 0 : Number(inputHazards)
    }

    if (editingId) {
      const updatedRecords = records.map(r => r.id === editingId ? newRecord : r)
      saveRecords(updatedRecords)
      setEditingId(null)
    } else {
      const existingIdx = records.findIndex(r => r.year === inputYear && r.month === inputMonth)
      const updatedRecords = [...records]
      
      if (existingIdx >= 0) {
        newRecord.id = updatedRecords[existingIdx].id
        updatedRecords[existingIdx] = newRecord
      } else {
        updatedRecords.push(newRecord)
      }
      saveRecords(updatedRecords)
    }
    
    setInputManDays('')
    setInputManHours('')
    setInputLti(0)
    setInputSpills(0)
    setInputIncidents(0)
    setInputHazards(0)
  }

  const handleEditClick = (record: HseRecord) => {
    setEditingId(record.id)
    setInputYear(record.year)
    setInputMonth(record.month)
    setInputLti(record.lti)
    setInputSpills(record.spills)
    setInputManDays(record.manDays || 0)
    setInputManHours(record.manHours)
    setInputIncidents(record.recordableIncidents)
    setInputHazards(record.hazardReports)
    
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const handleDeleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setInputManDays(''); setInputManHours(''); setInputLti(0); setInputSpills(0); setInputIncidents(0); setInputHazards(0)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setInputManDays(''); setInputManHours(''); setInputLti(0); setInputSpills(0); setInputIncidents(0); setInputHazards(0)
  }

  // Daftar tahun dinamis berdasarkan data yang sudah diinput + rentang 2024-2026
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>([2024, 2025, 2026, currentYear])
    records.forEach(r => yearsSet.add(r.year))
    return Array.from(yearsSet).sort((a, b) => a - b)
  }, [records, currentYear])

  const filteredData = useMemo(() => {
    let filtered = selectedYear === 'ALL' 
      ? [...records] 
      : records.filter(r => r.year === selectedYear)
    
    if (selectedYear !== 'ALL') {
      if (selectedPeriod === 'Q1') filtered = filtered.filter(r => r.month >= 1 && r.month <= 3)
      if (selectedPeriod === 'Q2') filtered = filtered.filter(r => r.month >= 4 && r.month <= 6)
      if (selectedPeriod === 'Q3') filtered = filtered.filter(r => r.month >= 7 && r.month <= 9)
      if (selectedPeriod === 'Q4') filtered = filtered.filter(r => r.month >= 10 && r.month <= 12)
    }

    const totalLti = filtered.reduce((sum, r) => sum + r.lti, 0)
    const totalSpills = filtered.reduce((sum, r) => sum + r.spills, 0)
    const totalManDays = filtered.reduce((sum, r) => sum + (r.manDays || 0), 0)
    const totalManHours = filtered.reduce((sum, r) => sum + r.manHours, 0)
    const totalIncidents = filtered.reduce((sum, r) => sum + r.recordableIncidents, 0)

    const numMonths = filtered.length || 1
    const periodTargetManDays = TARGET_MAN_DAYS_MIN * numMonths
    const periodTargetManHours = TARGET_MAN_HOURS_MIN * numMonths

    const trirNum = totalManHours > 0 ? ((totalIncidents * 200000) / totalManHours) : 0
    const trir = trirNum.toFixed(2)

    let formattedManHours = '0'
    if (totalManHours >= 1000000) formattedManHours = (totalManHours / 1000000).toFixed(2) + 'M'
    else if (totalManHours >= 1000) formattedManHours = (totalManHours / 1000).toFixed(1) + 'K'
    else formattedManHours = totalManHours.toString()

    // Urutkan kronologis dari tahun terlama ke terbaru, lalu bulan 1 ke 12
    const sortedRecords = filtered.sort((a, b) => a.year - b.year || a.month - b.month)
    
    const chartLabels = sortedRecords.map(r => {
      const mStr = new Date(2000, r.month - 1).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase()
      return selectedYear === 'ALL' ? `${mStr} '${r.year.toString().slice(-2)}` : mStr
    })
    
    const chartManHours = sortedRecords.map(r => r.manHours)
    const chartManDays = sortedRecords.map(r => r.manDays || 0)

    return { 
      totalLti, totalSpills, totalManDays, totalManHours, formattedManHours, 
      trir, trirNum, chartLabels, chartManHours, chartManDays, periodTargetManHours, periodTargetManDays
    }
  }, [records, selectedYear, selectedPeriod, lang])

  const periodLabel = selectedYear === 'ALL' 
    ? `2024 – ${Math.max(...availableYears)}` 
    : `${selectedPeriod} ${selectedYear}`

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "Visibilitas metrik kinerja K3L tersinkronisasi otomatis dari database internal.",
      btn_print: "Cetak Laporan",
      all_years: "SEMUA TAHUN (2024–2026)",
      
      sect_lagging: "Lagging Indicators (Data Langsung)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Total Hari Kerja (Man-Days)",
      lag_4: "Total Jam Kerja (Man-Hours)",
      
      sect_leading: "Leading Indicators (Dalam Pengembangan)",
      lead_soon: "Akan Terintegrasi Otomatis Dengan Modul Operasional.",
      lead_1: "Pelaporan Bahaya Terbuka",
      lead_2: "Penyelesaian CAPA",
      lead_3: "Kepatuhan TBM",
      lead_4: "Skor Audit",
      
      chart_title_mhrs: `Tren Jam Kerja Bulanan (${periodLabel})`,
      chart_title_mdys: `Tren Hari Kerja Bulanan (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & Log Histori)",
      mgr_add: "Tambah / Ubah Data Kinerja Bulanan",
      form_y: "Tahun", form_m: "Bulan", form_lti: "Total LTI", form_spill: "Total Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Recordable Inc.", form_haz: "Hazard Reports", 
      btn_save: "Simpan Baru",
      btn_update: "Perbarui Data",
      btn_cancel: "Batal",

      print_doc_type: "LAPORAN KINERJA K3L",
      print_reg: "Periode Laporan:",
      sign_hse: "Dianalisa Oleh (HSE Supervisor):",
      sign_gm: "Diketahui Oleh (Director):",

      info_title: "Panduan Metrik & Batas Toleransi",
      info_q1: "1. Mengapa Ada Batas Atas dan Bawah di Grafik?",
      info_a1_1: "Garis Bawah (Lower Bound): Menandakan target minimum agar operasional dianggap produktif. Jika grafik jatuh ke bawah batas ini (warna kuning), itu menandakan tingginya absensi karyawan, mesin mati (downtime), atau kurangnya hari kerja produktif.",
      info_a1_2: "Garis Atas (Upper Bound): Menandakan ambang batas aman kelelahan (Fatigue Limit). Jika grafik menembus batas atas ini (warna merah), itu menandakan terjadinya lembur ekstrem (overtime). Pekerja yang kelelahan berisiko sangat tinggi mengalami kecelakaan kerja fatal.",
      info_a1_3: "Kotak Hijau (Safe Zone): Area ideal di mana produktivitas terjaga dan risiko kelelahan minim.",
      info_q2: "2. Bagaimana Cara Menentukan Angkanya?",
      info_a2_desc: "Target ini bukan ditebak, melainkan dihitung secara matematis berdasarkan jumlah karyawan Anda (Manpower).",
      info_a2_f1: "Rumus Man-Days (Hari Kerja Bulanan):",
      info_a2_f1_c: "Jumlah Karyawan x Jumlah Hari Kerja Efektif. (Contoh: 60 orang x 25 hari = 1.500 Man-Days). Beri toleransi ±10% untuk batas atas dan bawah.",
      info_a2_f2: "Rumus Man-Hours (Jam Kerja Bulanan):",
      info_a2_f2_c: "Jumlah Karyawan x Jam Kerja Per Hari x Jumlah Hari Kerja Efektif. (Contoh: 60 orang x 8 Jam x 25 hari = 12.000 Man-Hours). Beri toleransi ±10% untuk batas atas dan bawah.",
      btn_close: "Tutup Panduan"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "HSE performance metrics visibility automatically synchronized from internal database.",
      btn_print: "Print Report",
      all_years: "ALL YEARS (2024–2026)",
      
      sect_lagging: "Lagging Indicators (Live Data)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Total Safe Man-Days",
      lag_4: "Total Safe Man-Hours",
      
      sect_leading: "Leading Indicators (Coming Soon)",
      lead_soon: "Will Be Auto-Synchronized With Operational Modules.",
      lead_1: "Open Hazard Reports",
      lead_2: "CAPA Closure Rate",
      lead_3: "TBM Compliance",
      lead_4: "Audit Score",
      
      chart_title_mhrs: `Monthly Man-Hours Trend (${periodLabel})`,
      chart_title_mdys: `Monthly Man-Days Trend (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & History Logs)",
      mgr_add: "Add / Update Monthly Performance Data",
      form_y: "Year", form_m: "Month", form_lti: "Total LTI", form_spill: "Total Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Recordable Inc.", form_haz: "Hazard Reports", 
      btn_save: "Save New",
      btn_update: "Update Record",
      btn_cancel: "Cancel",

      print_doc_type: "HSE PERFORMANCE REPORT",
      print_reg: "Report Period:",
      sign_hse: "Analyzed By (HSE Supervisor):",
      sign_gm: "Acknowledged By (Director):",

      info_title: "Productivity Metrics & Tolerance Guide",
      info_q1: "1. Why Are There Upper and Lower Bounds?",
      info_a1_1: "Lower Bound (Minimum Target): Ensures operations remain productive. If the graph falls below this line (yellow), it indicates high absenteeism, machine downtime, or a lack of productive working days.",
      info_a1_2: "Upper Bound (Fatigue Limit): Marks the safe limit for physical exhaustion. If the graph breaches this line (red), it signifies extreme overtime. Exhausted workers have a significantly higher risk of fatal workplace accidents.",
      info_a1_3: "Green Box (Safe Zone): The ideal operational area where productivity is maintained and fatigue risks are minimized.",
      info_q2: "2. How to Determine the Targets?",
      info_a2_desc: "These targets are calculated mathematically based on your total headcount (Manpower).",
      info_a2_f1: "Target Man-Days (Monthly Working Days) Formula:",
      info_a2_f1_c: "Total Employees x Effective Working Days. (Example: 60 people x 25 days = 1,500 Man-Days). Apply a ±10% tolerance for upper and lower bounds.",
      info_a2_f2: "Target Man-Hours (Monthly Working Hours) Formula:",
      info_a2_f2_c: "Total Employees x Working Hours per Day x Effective Working Days. (Example: 60 people x 8 Hours x 25 days = 12,000 Man-Hours). Apply a ±10% tolerance.",
      btn_close: "Close Guide"
    }
  }

  const t = dict[lang]
  if (!mounted) return null 

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px]">
            <div className={`flex items-center gap-2 px-2 ${selectedYear !== 'ALL' ? 'border-r border-slate-300 dark:border-slate-700' : ''}`}>
              <label htmlFor={`${formId}-fyear`} className="text-[9px] font-black uppercase text-slate-500">Year:</label>
              <select 
                id={`${formId}-fyear`} 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))} 
                className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="dark:bg-slate-900">{t.all_years}</option>
                {availableYears.map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
              </select>
            </div>
            {selectedYear !== 'ALL' && (
              <div className="flex items-center gap-2 px-2">
                <label htmlFor={`${formId}-fperiod`} className="text-[9px] font-black uppercase text-slate-500">Period:</label>
                <select id={`${formId}-fperiod`} value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                  <option value="YTD" className="dark:bg-slate-900">YEAR TO DATE (YTD)</option>
                  <option value="Q1" className="dark:bg-slate-900">QUARTER 1 (Q1)</option>
                  <option value="Q2" className="dark:bg-slate-900">QUARTER 2 (Q2)</option>
                  <option value="Q3" className="dark:bg-slate-900">QUARTER 3 (Q3)</option>
                  <option value="Q4" className="dark:bg-slate-900">QUARTER 4 (Q4)</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
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

      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">{periodLabel}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.sect_lagging}
          </h2>
          <button onClick={() => setShowInfo(true)} aria-label="Informasi Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.trirNum > TARGET_TRIR ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_1}</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black print:text-black ${filteredData.trirNum > TARGET_TRIR ? 'text-rose-600 dark:text-rose-500' : 'text-slate-900 dark:text-white'}`}>{filteredData.trir}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">/ 200K HRS</span>
            </div>
            <p className={`text-[8px] font-black uppercase tracking-widest mt-3 pt-2 border-t print:border-black print:text-black ${filteredData.trirNum > TARGET_TRIR ? 'text-rose-500 border-rose-200 dark:border-rose-800' : 'text-slate-400 border-slate-100 dark:border-slate-800'}`}>
              TARGET: &lt; {TARGET_TRIR.toFixed(1)} {filteredData.trirNum > TARGET_TRIR && '(OFF TRACK)'}
            </p>
          </div>

          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.totalLti > TARGET_LTI ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_2}</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black print:text-black ${filteredData.totalLti > TARGET_LTI ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>{filteredData.totalLti}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">CASES</span>
            </div>
            <p className={`text-[8px] font-black uppercase tracking-widest mt-3 pt-2 border-t print:border-black print:text-black ${filteredData.totalLti > TARGET_LTI ? 'text-rose-500 border-rose-200 dark:border-rose-800' : 'text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800'}`}>
              TARGET: {TARGET_LTI} CASES {filteredData.totalLti > TARGET_LTI && '(OFF TRACK)'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_3}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white print:text-black">{filteredData.totalManDays.toLocaleString()}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">DAYS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              MIN. BASELINE: &gt; {(filteredData.periodTargetManDays).toLocaleString()} DAYS
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white print:text-black">{filteredData.formattedManHours}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">HOURS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              MIN. BASELINE: &gt; {(filteredData.periodTargetManHours / 1000).toFixed(0)}K HRS
            </p>
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TrendLineChart 
          title={t.chart_title_mhrs} 
          data={filteredData.chartManHours} 
          labels={filteredData.chartLabels}
          minTarget={TARGET_MAN_HOURS_MIN}
          maxTarget={TARGET_MAN_HOURS_MAX}
          unit="HRS"
          isMultiYear={selectedYear === 'ALL'}
        />
        <TrendLineChart 
          title={t.chart_title_mdys} 
          data={filteredData.chartManDays} 
          labels={filteredData.chartLabels}
          minTarget={TARGET_MAN_DAYS_MIN}
          maxTarget={TARGET_MAN_DAYS_MAX}
          unit="DAYS"
          isMultiYear={selectedYear === 'ALL'}
        />
      </div>

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

      <div className="mt-12 print:hidden">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 14h6M9 10h6" /></svg>
            {t.mgr_title}
          </h2>
        </div>
        
        <div className={`bg-slate-100 dark:bg-slate-900 border ${editingId ? 'border-amber-400 dark:border-amber-600 shadow-md' : 'border-slate-300 dark:border-slate-800'} rounded-[4px] p-5 transition-all`}>
          <p className={`text-[9px] font-black mb-4 ${editingId ? 'text-amber-600 dark:text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {editingId ? "EDITING MODE ACTIVE" : t.mgr_add}
          </p>
          <form onSubmit={handleSubmitRecord} className="grid grid-cols-2 md:grid-cols-10 gap-3 items-end">
            <div>
              <label htmlFor={`${formId}-y`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_y}</label>
              <input id={`${formId}-y`} type="number" value={inputYear} onChange={e=>setInputYear(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-m`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_m}</label>
              <select id={`${formId}-m`} value={inputMonth} onChange={e=>setInputMonth(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${formId}-mdys`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Man-Days</label>
              <input id={`${formId}-mdys`} type="number" placeholder="1200" value={inputManDays} onChange={e=>setInputManDays(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-hrs`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_hrs}</label>
              <input id={`${formId}-hrs`} type="number" placeholder="9600" value={inputManHours} onChange={e=>setInputManHours(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-lti`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_lti}</label>
              <input id={`${formId}-lti`} type="number" min="0" value={inputLti} onChange={e=>setInputLti(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-spl`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_spill}</label>
              <input id={`${formId}-spl`} type="number" min="0" value={inputSpills} onChange={e=>setInputSpills(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-inc`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_inc}</label>
              <input id={`${formId}-inc`} type="number" min="0" value={inputIncidents} onChange={e=>setInputIncidents(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-haz`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_haz}</label>
              <input id={`${formId}-haz`} type="number" min="0" value={inputHazards} onChange={e=>setInputHazards(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={inputManHours==='' || inputManDays===''} className={`flex-1 py-1.5 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] disabled:opacity-50 transition-colors h-[30px] ${editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-700 dark:bg-teal-600 hover:bg-teal-500'}`}>
                {editingId ? t.btn_update : t.btn_save}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="px-3 py-1.5 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[9px] font-black uppercase tracking-widest rounded-[2px] hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors h-[30px]">
                  {t.btn_cancel}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2 px-3 w-20">PERIOD</th>
                  <th className="py-2 px-3">M-DAYS</th>
                  <th className="py-2 px-3">M-HOURS</th>
                  <th className="py-2 px-3">LTI</th>
                  <th className="py-2 px-3">INCIDENTS</th>
                  <th className="py-2 px-3">HAZARDS</th>
                  <th className="py-2 px-3 text-center w-24">ACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-slate-400">NO DATA FOUND</td>
                  </tr>
                ) : (
                  [...records].sort((a,b) => b.year - a.year || b.month - a.month).map(r => (
                    <tr key={r.id} className={`transition-colors ${editingId === r.id ? 'bg-amber-50 dark:bg-amber-950/30' : 'hover:bg-white dark:hover:bg-slate-950'}`}>
                      <td className="py-2 px-3">{r.year} - M{r.month.toString().padStart(2, '0')}</td>
                      <td className="py-2 px-3 font-mono">{(r.manDays || 0).toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono">{r.manHours.toLocaleString()}</td>
                      <td className="py-2 px-3">{r.lti}</td>
                      <td className="py-2 px-3 text-rose-600 dark:text-rose-400">{r.recordableIncidents}</td>
                      <td className="py-2 px-3 text-teal-600 dark:text-teal-400">{r.hazardReports}</td>
                      <td className="py-2 px-3 text-center flex justify-center gap-1.5">
                        <button onClick={() => handleEditClick(r)} aria-label="Edit record" className="text-[8px] font-black uppercase text-blue-600 dark:text-blue-500 hover:text-blue-700 border border-transparent hover:border-blue-300 dark:hover:border-blue-800 rounded px-1 transition-colors">EDIT</button>
                        <button onClick={() => handleDeleteRecord(r.id)} aria-label="Delete record" className="text-[8px] font-black uppercase text-rose-500 hover:text-rose-700 border border-transparent hover:border-rose-300 dark:hover:border-rose-900 rounded px-1 transition-colors">DEL</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden" onClick={() => setShowInfo(false)}>
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-[4px] max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-700 dark:text-teal-500">
                {t.info_title}
              </h3>
              <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-6 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.info_q1}</h4>
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex gap-2">
                    <span className="text-teal-600 mt-0.5">▪</span>
                    <span>{t.info_a1_1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-600 mt-0.5">▪</span>
                    <span>{t.info_a1_2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-600 mt-0.5">▪</span>
                    <span>{t.info_a1_3}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.info_q2}</h4>
                <p className="mb-3">{t.info_a2_desc}</p>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] mb-3 font-mono">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.info_a2_f1}</p>
                  <p>{t.info_a2_f1_c}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] mb-3 font-mono">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.info_a2_f2}</p>
                  <p>{t.info_a2_f2_c}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800 text-right">
              <button onClick={() => setShowInfo(false)} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors">
                {t.btn_close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
