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

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
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

  // State untuk menampilkan Modal Panduan
  const [showInfo, setShowInfo] = useState(false)

  // Nilai Target Baseline
  const TARGET_TRIR = 1.0
  const TARGET_LTI = 0
  const TARGET_MAN_DAYS_PER_MONTH = 1500
  const TARGET_MAN_HOURS_PER_MONTH = 12000 

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
    setMounted(true)
    
    const savedData = localStorage.getItem('syspex_hse_db')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    } else {
      const seedData: HseRecord[] = []
      setRecords(seedData)
    }
  }, [currentYear])

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

  const filteredData = useMemo(() => {
    let filtered = records.filter(r => r.year === selectedYear)
    
    if (selectedPeriod === 'Q1') filtered = filtered.filter(r => r.month >= 1 && r.month <= 3)
    if (selectedPeriod === 'Q2') filtered = filtered.filter(r => r.month >= 4 && r.month <= 6)
    if (selectedPeriod === 'Q3') filtered = filtered.filter(r => r.month >= 7 && r.month <= 9)
    if (selectedPeriod === 'Q4') filtered = filtered.filter(r => r.month >= 10 && r.month <= 12)

    const totalLti = filtered.reduce((sum, r) => sum + r.lti, 0)
    const totalSpills = filtered.reduce((sum, r) => sum + r.spills, 0)
    const totalManDays = filtered.reduce((sum, r) => sum + (r.manDays || 0), 0)
    const totalManHours = filtered.reduce((sum, r) => sum + r.manHours, 0)
    const totalIncidents = filtered.reduce((sum, r) => sum + r.recordableIncidents, 0)

    const numMonths = filtered.length || 1
    const periodTargetManDays = TARGET_MAN_DAYS_PER_MONTH * numMonths
    const periodTargetManHours = TARGET_MAN_HOURS_PER_MONTH * numMonths

    const trirNum = totalManHours > 0 ? ((totalIncidents * 200000) / totalManHours) : 0
    const trir = trirNum.toFixed(2)

    let formattedManHours = '0'
    if (totalManHours >= 1000000) formattedManHours = (totalManHours / 1000000).toFixed(1) + 'M'
    else if (totalManHours >= 1000) formattedManHours = (totalManHours / 1000).toFixed(1) + 'K'
    else formattedManHours = totalManHours.toString()

    const chartData = filtered.sort((a, b) => a.month - b.month).map(r => ({
      month: new Date(2000, r.month - 1).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase(),
      manHours: r.manHours,
      manDays: r.manDays || 0
    }))

    const rawMaxManHours = chartData.length > 0 ? Math.max(...chartData.map(d => d.manHours)) : 0
    const rawMaxManDays = chartData.length > 0 ? Math.max(...chartData.map(d => d.manDays)) : 0
    
    const maxManHours = Math.max(rawMaxManHours, TARGET_MAN_HOURS_PER_MONTH)
    const maxManDays = Math.max(rawMaxManDays, TARGET_MAN_DAYS_PER_MONTH)

    return { 
      totalLti, totalSpills, totalManDays, totalManHours, formattedManHours, 
      trir, trirNum, chartData, maxManHours, maxManDays, periodTargetManHours, periodTargetManDays
    }
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
      lag_3: "Total Hari Kerja (Man-Days)",
      lag_4: "Total Jam Kerja (Man-Hours)",
      
      sect_leading: "Leading Indicators (Dalam Pengembangan)",
      lead_soon: "Akan Terintegrasi Otomatis Dengan Modul Operasional.",
      lead_1: "Pelaporan Bahaya Terbuka",
      lead_2: "Penyelesaian CAPA",
      lead_3: "Kepatuhan TBM",
      lead_4: "Skor Audit",
      
      chart_title: `Tren Produktivitas & Jam Kerja K3 (${selectedPeriod} ${selectedYear})`,
      chart_mhrs: "Man-Hours",
      chart_mdys: "Man-Days",
      
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

      // Teks untuk Modal Panduan
      info_title: "Panduan Metrik Produktivitas K3L",
      info_q1: "1. Mengapa HSE Sangat Membutuhkan Man-Hours & Man-Days?",
      info_a1_1: "Sebagai Indikator Eksposur Risiko (Risk Exposure): Semakin besar jam kerja, semakin lama pekerja Anda terpapar risiko di lapangan. 1 insiden yang terjadi dalam 1.000 jam kerja itu sangat buruk, tetapi 1 insiden dalam 1.000.000 jam kerja itu sangat luar biasa aman. Kita butuh Man-Hours sebagai angka pembagi untuk mengetahui skala performa kita.",
      info_a1_2: "Sebagai Deteksi Kelelahan (Fatigue Warning): Jika Man-Hours dan Man-Days tiba-tiba melonjak drastis di atas target normal pada suatu bulan, manajemen harus waspada. Artinya ada Lembur Ekstrem (Overtime) atau pekerja didera beban kerja berlebih. Kelelahan adalah penyebab utama kecelakaan kerja.",
      info_a1_3: "Sebagai Papan Kebanggaan (Milestone): Angka pada papan 'Telah Dicapai 1.000.000 Jam Kerja Aman Tanpa LTI' di depan pabrik didapat dari akumulasi data Man-Hours ini.",
      info_q2: "2. Bagaimana Cara Menentukan Targetnya?",
      info_a2_desc: "Target ini bukan ditebak, melainkan dihitung secara matematis berdasarkan jumlah karyawan Anda (Manpower).",
      info_a2_f1: "Rumus Target Man-Days (Hari Kerja Bulanan):",
      info_a2_f1_c: "Jumlah Karyawan x Jumlah Hari Kerja Efektif Sebulan. (Contoh: 60 karyawan x 25 hari kerja = 1.500 Man-Days).",
      info_a2_f2: "Rumus Target Man-Hours (Jam Kerja Bulanan):",
      info_a2_f2_c: "Jumlah Karyawan x Jam Kerja Per Hari x Jumlah Hari Kerja Efektif. (Contoh: 60 karyawan x 8 Jam x 25 hari kerja = 12.000 Man-Hours).",
      info_a2_note: "Jika aktual perusahaan jauh di bawah target ini, berarti banyak absensi atau mesin mati. Jika jauh di atas target, berarti banyak lembur dan risiko K3L sedang tinggi.",
      btn_close: "Tutup Panduan"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "HSE performance metrics visibility automatically synchronized from internal database.",
      btn_print: "Print Report",
      
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
      
      chart_title: `HSE Productivity & Working Hours Trend (${selectedPeriod} ${selectedYear})`,
      chart_mhrs: "Man-Hours",
      chart_mdys: "Man-Days",
      
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

      // Teks untuk Modal Panduan
      info_title: "HSE Productivity Metrics Guide",
      info_q1: "1. Why Does HSE Need Man-Hours & Man-Days?",
      info_a1_1: "As a Risk Exposure Indicator: The higher the working hours, the longer your workers are exposed to field risks. 1 incident in 1,000 hours is terrible, but 1 incident in 1,000,000 hours is exceptionally safe. We need Man-Hours as a denominator to understand our performance scale.",
      info_a1_2: "As a Fatigue Warning: If Man-Hours and Man-Days suddenly spike above the normal target, management must be alert. It indicates extreme overtime or overworked personnel. Fatigue is a leading cause of workplace accidents.",
      info_a1_3: "As a Milestone Achievement: The '1,000,000 Safe Working Hours Without LTI' signboard in front of the factory is accumulated directly from this Man-Hours data.",
      info_q2: "2. How to Determine the Targets?",
      info_a2_desc: "These targets are not guessed; they are calculated mathematically based on your total headcount (Manpower).",
      info_a2_f1: "Target Man-Days (Monthly Working Days) Formula:",
      info_a2_f1_c: "Total Employees x Effective Working Days per Month. (Example: 60 employees x 25 working days = 1,500 Man-Days).",
      info_a2_f2: "Target Man-Hours (Monthly Working Hours) Formula:",
      info_a2_f2_c: "Total Employees x Working Hours per Day x Effective Working Days. (Example: 60 employees x 8 Hours x 25 working days = 12,000 Man-Hours).",
      info_a2_note: "If the actual data is far below target, it indicates high absenteeism or downtime. If it is far above target, it indicates excessive overtime and elevated HSE risks.",
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
            <div className="flex items-center gap-2 px-2 border-r border-slate-300 dark:border-slate-700">
              <label htmlFor={`${formId}-fyear`} className="text-[9px] font-black uppercase text-slate-500">Year:</label>
              <select id={`${formId}-fyear`} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                {[currentYear-2, currentYear-1, currentYear, currentYear+1, currentYear+2].map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
              </select>
            </div>
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

      <div>
        <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.sect_lagging}
          </h2>
          {/* INFO BUTTON UNTUK LAGGING INDICATORS */}
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
              TARGET: &gt; {(filteredData.periodTargetManDays).toLocaleString()} DAYS
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white print:text-black">{filteredData.formattedManHours}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1.5">HOURS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              TARGET: &gt; {(filteredData.periodTargetManHours / 1000).toFixed(0)}K HRS
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

      <div className="mt-8 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black print:bg-transparent transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.chart_title}
          </h2>
          <div className="flex flex-wrap gap-4 mt-3 sm:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-600 border border-teal-700 print:border-black print:bg-gray-300"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_mhrs}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-600 border border-cyan-700 print:border-black print:bg-gray-400"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_mdys}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2 sm:gap-6 h-56 pt-4 relative">
          {filteredData.maxManHours > 0 && (
            <div 
              className="absolute left-0 w-full border-t-2 border-dashed border-slate-400 dark:border-slate-600 z-0 pointer-events-none flex justify-start items-center opacity-70"
              style={{ bottom: `${(TARGET_MAN_HOURS_PER_MONTH / filteredData.maxManHours) * 100}%` }}
            >
              <span className="absolute -top-4 text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-white dark:bg-[#0b0f19] px-1 print:bg-transparent print:text-black">
                TARGET BASELINE: {(TARGET_MAN_HOURS_PER_MONTH/1000).toFixed(0)}K HRS
              </span>
            </div>
          )}

          {filteredData.chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">
              NO DATA FOR SELECTED PERIOD
            </div>
          ) : (
            filteredData.chartData.map((data, idx) => {
              const hoursHeight = filteredData.maxManHours > 0 ? (data.manHours / filteredData.maxManHours) * 100 : 0
              const daysHeight = filteredData.maxManDays > 0 ? (data.manDays / filteredData.maxManDays) * 100 : 0
              
              const isHoursBelowTarget = data.manHours > 0 && data.manHours < TARGET_MAN_HOURS_PER_MONTH

              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full z-10">
                  <div className="w-full flex items-end justify-center gap-1 h-full relative group">
                    <div 
                      style={{ height: `${hoursHeight}%` }} 
                      className={`w-1/2 max-w-[28px] border-t-2 print:border-black print:bg-gray-300 transition-all duration-500 relative ${isHoursBelowTarget ? 'bg-amber-500 border-amber-400' : 'bg-teal-600 border-teal-400 dark:border-teal-300'}`}
                    >
                      <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black print:text-black opacity-0 group-hover:opacity-100 print:opacity-100 ${isHoursBelowTarget ? 'text-amber-600 dark:text-amber-500' : 'text-teal-700 dark:text-teal-400'}`}>
                        {data.manHours > 1000 ? (data.manHours/1000).toFixed(1)+'k' : data.manHours}
                      </span>
                    </div>

                    <div 
                      style={{ height: `${daysHeight}%` }} 
                      className="w-1/2 max-w-[28px] bg-cyan-600 border-t-2 border-cyan-400 dark:border-cyan-300 print:border-black print:bg-gray-400 transition-all duration-500 relative"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-cyan-700 dark:text-cyan-400 print:text-black opacity-0 group-hover:opacity-100 print:opacity-100">
                        {data.manDays > 1000 ? (data.manDays/1000).toFixed(1)+'k' : data.manDays}
                      </span>
                    </div>
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
          {/* INFO BUTTON UNTUK FORM DATA */}
          <button onClick={() => setShowInfo(true)} aria-label="Informasi Metrik" className="text-slate-400 hover:text-teal-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
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
                  records.sort((a,b) => b.year - a.year || b.month - a.month).map(r => (
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

      {/* INFO MODAL OVERLAY */}
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
                
                <p className="text-[10px] text-amber-700 dark:text-amber-500 font-black uppercase tracking-widest p-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-500">
                  {t.info_a2_note}
                </p>
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
