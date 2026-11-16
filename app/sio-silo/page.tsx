"use client"

import { useState, useEffect, useId, useRef, useMemo } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { useLanguage } from '../LanguageContext'

type PermitType = 'SIO' | 'SILO'
type ComputedStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED'

interface SioSiloRecord {
  id: string
  permitType: PermitType
  certificateNo: string
  holderOrAssetName: string
  equipmentClass: string
  department: string
  expiryDate: string
  issuer: string
}

const INITIAL_RECORDS: SioSiloRecord[] = [
  {
    id: 'SIO-001',
    permitType: 'SIO',
    certificateNo: '5/1428/AS.02.04/III/2024',
    holderOrAssetName: 'Budi Prakoso',
    equipmentClass: 'Operator Forklift Kelas II (< 15 Ton)',
    department: 'Operation',
    expiryDate: '2029-03-15',
    issuer: 'Kemnaker RI'
  },
  {
    id: 'SILO-002',
    permitType: 'SILO',
    certificateNo: '5/882/AS.02.01/XI/2025',
    holderOrAssetName: 'Forklift Counterbalance Toyota #01',
    equipmentClass: 'Pesawat Angkat & Angkut (3.5 Ton)',
    department: 'Operation',
    expiryDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    issuer: 'Disnakertrans Banten'
  }
]

const parseExcelExpiryDate = (rawVal: unknown): string | null => {
  if (rawVal === null || rawVal === undefined || rawVal === '') return null

  if (typeof rawVal === 'number' && rawVal > 20000 && rawVal < 90000) {
    const parsed = XLSX.SSF.parse_date_code(rawVal)
    if (parsed && parsed.y && parsed.m && parsed.d) {
      const mm = String(parsed.m).padStart(2, '0')
      const dd = String(parsed.d).padStart(2, '0')
      return `${parsed.y}-${mm}-${dd}`
    }
  }

  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return rawVal.toISOString().split('T')[0]
  }

  const str = String(rawVal).trim()
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`
  }

  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/)
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`
  }

  return null
}

const getPermitStatus = (expiryDateStr: string): { status: ComputedStatus; daysLeft: number } => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expiryDateStr)
  exp.setHours(0, 0, 0, 0)

  if (isNaN(exp.getTime())) return { status: 'EXPIRED', daysLeft: -999 }

  const diffMs = exp.getTime() - today.getTime()
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { status: 'EXPIRED', daysLeft }
  if (daysLeft <= 30) return { status: 'EXPIRING_SOON', daysLeft }
  return { status: 'VALID', daysLeft }
}

export default function SioSiloPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [todayDate, setTodayDate] = useState('')
  const [records, setRecords] = useState<SioSiloRecord[]>([])

  const [typeFilter, setTypeFilter] = useState<'ALL' | PermitType>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | ComputedStatus>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [importBanner, setImportBanner] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null)

  const [permitType, setPermitType] = useState<PermitType>('SIO')
  const [certificateNo, setCertificateNo] = useState('')
  const [holderOrAssetName, setHolderOrAssetName] = useState('')
  const [equipmentClass, setEquipmentClass] = useState('')
  const [department, setDepartment] = useState('Operation')
  const [expiryDate, setExpiryDate] = useState('')
  const [issuer, setIssuer] = useState('Kemnaker RI')

  useEffect(() => {
    setMounted(true)
    setTodayDate(new Date().toISOString().split('T')[0])
    const saved = localStorage.getItem('syspex_sio_db')
    if (saved) {
      setRecords(JSON.parse(saved))
    } else {
      setRecords(INITIAL_RECORDS)
      localStorage.setItem('syspex_sio_db', JSON.stringify(INITIAL_RECORDS))
    }
  }, [])

  const saveRecords = (updated: SioSiloRecord[]) => {
    setRecords(updated)
    localStorage.setItem('syspex_sio_db', JSON.stringify(updated))
    window.dispatchEvent(new Event('syspex_hse_sync'))
  }

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        'Jenis (SIO/SILO)': 'SIO',
        'Nomor Lisensi / Sertifikat': '5/1428/AS.02.04/III/2024',
        'Nama Operator / Nama Unit Alat': 'Budi Prakoso',
        'Jenis & Kapasitas Alat': 'Operator Forklift Kelas II (< 15 Ton)',
        'Departemen': 'Operation',
        'Tanggal Berlaku Hingga (YYYY-MM-DD)': '2029-03-15',
        'Instansi Penerbit': 'Kemnaker RI'
      },
      {
        'Jenis (SIO/SILO)': 'SILO',
        'Nomor Lisensi / Sertifikat': '5/882/AS.02.01/XI/2025',
        'Nama Operator / Nama Unit Alat': 'Forklift Counterbalance Toyota #01',
        'Jenis & Kapasitas Alat': 'Pesawat Angkat & Angkut (3.5 Ton)',
        'Departemen': 'Operation',
        'Tanggal Berlaku Hingga (YYYY-MM-DD)': '2027-11-20',
        'Instansi Penerbit': 'Disnakertrans'
      }
    ]
    const ws = XLSX.utils.json_to_sheet(templateRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template_SIO_SILO')
    XLSX.writeFile(wb, 'Template_Import_SIO_SILO_Syspex.xlsx')
  }

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })

      let headerIdx = -1
      let colType = -1, colCert = -1, colName = -1, colClass = -1, colDept = -1, colExp = -1, colIssuer = -1

      for (let i = 0; i < Math.min(rows.length, 15); i++) {
        const row = rows[i]
        if (!Array.isArray(row)) continue
        const norm = row.map(c => String(c).trim().toLowerCase())

        const nameIdx = norm.findIndex(c => c.includes('nama') || c.includes('operator') || c.includes('unit') || c.includes('alat') || c.includes('holder'))
        const expIdx = norm.findIndex(c => c.includes('berlaku') || c.includes('expired') || c.includes('expiry') || c.includes('tanggal') || c.includes('date'))

        if (nameIdx !== -1 && expIdx !== -1) {
          headerIdx = i
          colName = nameIdx
          colExp = expIdx
          colType = norm.findIndex(c => c.includes('jenis (sio') || c === 'jenis' || c === 'type' || c.includes('kategori'))
          colCert = norm.findIndex(c => c.includes('nomor') || c.includes('no') || c.includes('sertifikat') || c.includes('lisensi') || c.includes('cert'))
          colClass = norm.findIndex(c => c.includes('kapasitas') || c.includes('kelas') || c.includes('class') || c.includes('spesifikasi'))
          colDept = norm.findIndex(c => c.includes('departemen') || c.includes('dept'))
          colIssuer = norm.findIndex(c => c.includes('penerbit') || c.includes('instansi') || c.includes('issuer'))
          break
        }
      }

      if (headerIdx === -1) throw new Error('Header tidak ditemukan')

      const importedItems: SioSiloRecord[] = []
      for (let r = headerIdx + 1; r < rows.length; r++) {
        const row = rows[r]
        if (!Array.isArray(row)) continue

        const holderName = String(row[colName] ?? '').trim()
        if (!holderName) continue

        const parsedDate = parseExcelExpiryDate(row[colExp])
        if (!parsedDate) continue

        const rawType = colType !== -1 ? String(row[colType]).trim().toUpperCase() : ''
        const pType: PermitType = rawType.includes('SILO') || holderName.toLowerCase().includes('forklift') || holderName.toLowerCase().includes('crane') || holderName.toLowerCase().includes('hoist')
          ? 'SILO'
          : 'SIO'

        const certNo = colCert !== -1 ? String(row[colCert]).trim() : `REG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        const eqClass = colClass !== -1 ? String(row[colClass]).trim() : 'Pesawat Angkat & Angkut'
        const dept = colDept !== -1 && String(row[colDept]).trim() ? String(row[colDept]).trim() : 'Operation'
        const iss = colIssuer !== -1 && String(row[colIssuer]).trim() ? String(row[colIssuer]).trim() : 'Kemnaker RI'

        importedItems.push({
          id: `${pType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          permitType: pType,
          certificateNo: certNo || '-',
          holderOrAssetName: holderName,
          equipmentClass: eqClass || '-',
          department: dept,
          expiryDate: parsedDate,
          issuer: iss
        })
      }

      if (importedItems.length === 0) throw new Error('Tidak ada baris valid')

      // Langsung ganti database dengan data master dari file Excel terbaru agar bersih dari data contoh
      saveRecords(importedItems)
      setTypeFilter('ALL')
      setStatusFilter('ALL')
      setSearchQuery('')
      setImportBanner({
        type: 'SUCCESS',
        text: lang === 'ID'
          ? `BERHASIL MEMUAT ${importedItems.length} DATA SIO/SILO DARI "${file.name}" & TERSINKRON KE KPI.`
          : `SUCCESSFULLY LOADED ${importedItems.length} SIO/SILO RECORDS FROM "${file.name}".`
      })
    } catch {
      setImportBanner({
        type: 'ERROR',
        text: lang === 'ID'
          ? 'Gagal membaca file Excel. Gunakan tombol "Template Excel" untuk memastikan nama kolom sesuai.'
          : 'Failed to parse Excel file. Use "Excel Template" button to match column headers.'
      })
    } finally {
      e.target.value = ''
    }
  }

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (!holderOrAssetName.trim() || !expiryDate) return

    const newItem: SioSiloRecord = {
      id: `${permitType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      permitType,
      certificateNo: certificateNo.trim() || '-',
      holderOrAssetName: holderOrAssetName.trim(),
      equipmentClass: equipmentClass.trim() || '-',
      department: department.trim() || 'Operation',
      expiryDate,
      issuer: issuer.trim() || 'Kemnaker RI'
    }

    saveRecords([newItem, ...records])
    setCertificateNo('')
    setHolderOrAssetName('')
    setEquipmentClass('')
    setExpiryDate('')
  }

  const handleDelete = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
  }

  const enrichedRecords = useMemo(() => {
    return records.map(r => {
      const { status, daysLeft } = getPermitStatus(r.expiryDate)
      return { ...r, computedStatus: status, daysLeft }
    }).sort((a, b) => a.daysLeft - b.daysLeft)
  }, [records])

  const stats = useMemo(() => {
    const total = enrichedRecords.length
    const valid = enrichedRecords.filter(r => r.computedStatus === 'VALID').length
    const expiring = enrichedRecords.filter(r => r.computedStatus === 'EXPIRING_SOON').length
    const expired = enrichedRecords.filter(r => r.computedStatus === 'EXPIRED').length
    const validityPct = total > 0 ? Math.round(((valid + expiring) / total) * 100) : 100
    return { total, valid, expiring, expired, validityPct }
  }, [enrichedRecords])

  const filteredRecords = useMemo(() => {
    return enrichedRecords.filter(r => {
      if (typeFilter !== 'ALL' && r.permitType !== typeFilter) return false
      if (statusFilter !== 'ALL' && r.computedStatus !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          r.holderOrAssetName.toLowerCase().includes(q) ||
          r.certificateNo.toLowerCase().includes(q) ||
          r.equipmentClass.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [enrichedRecords, typeFilter, statusFilter, searchQuery])

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO / SMK3",
      title: "Database SIO & SILO Tracker",
      subtitle: "Pemantauan lisensi operator (SIO) dan kelayakan operasi peralatan (SILO) sesuai PP 50/2012 & Permenaker 8/2020.",
      btn_import: "Import Excel (.xlsx)",
      btn_template: "Template Excel",
      btn_print: "Cetak Register",
      form_title: "1. Tambah Data SIO / SILO Manual",
      f_type: "Jenis Dokumen",
      f_cert: "Nomor Lisensi / Sertifikat",
      f_name: "Nama Operator / Unit Alat *",
      f_class: "Jenis & Kapasitas Alat",
      f_dept: "Departemen",
      f_exp: "Berlaku Hingga *",
      f_issuer: "Instansi Penerbit",
      btn_save: "Simpan & Sinkron KPI",
      reg_title: "2. Register Kepatuhan SIO & SILO",
      search_ph: "Cari nama operator, unit alat, no sertifikat...",
      th_type: "Jenis",
      th_cert: "No. Sertifikat",
      th_name: "Nama Operator / Unit Alat",
      th_class: "Klasifikasi & Kapasitas",
      th_exp: "Masa Berlaku",
      th_status: "Status Legal",
      th_del: "Hapus",
      print_doc: "REGISTER KEPATUHAN LISENSI OPERATOR (SIO) & KELAYAKAN ALAT (SILO) • SYSPEX HSE",
      sign_hse: "Diperiksa Oleh (HSE Officer):",
      sign_mgr: "Disetujui Oleh (Plant / Ops Manager):"
    },
    EN: {
      breadcrumb: "Management & ISO / SMK3",
      title: "SIO & SILO Compliance Tracker",
      subtitle: "Operator license (SIO) and equipment operating permit (SILO) validity tracking synced with KPI Dashboard.",
      btn_import: "Import Excel (.xlsx)",
      btn_template: "Excel Template",
      btn_print: "Print Register",
      form_title: "1. Add Manual SIO / SILO Record",
      f_type: "Permit Type",
      f_cert: "License / Certificate No.",
      f_name: "Operator Name / Equipment Unit *",
      f_class: "Equipment Type & Capacity",
      f_dept: "Department",
      f_exp: "Valid Until *",
      f_issuer: "Issuing Authority",
      btn_save: "Save & Sync KPI",
      reg_title: "2. SIO & SILO Compliance Register",
      search_ph: "Search operator, equipment, certificate no...",
      th_type: "Type",
      th_cert: "Certificate No.",
      th_name: "Operator / Equipment Unit",
      th_class: "Class & Capacity",
      th_exp: "Expiry Date",
      th_status: "Legal Status",
      th_del: "Del",
      print_doc: "OFFICIAL OPERATOR LICENSE (SIO) & EQUIPMENT PERMIT (SILO) REGISTER • SYSPEX HSE",
      sign_hse: "Verified By (HSE Officer):",
      sign_mgr: "Approved By (Plant / Ops Manager):"
    }
  }

  const t = dict[lang]
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" aria-label="Upload Excel SIO SILO" />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors"
            >
              {t.btn_template}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              {t.btn_import}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={records.length === 0}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {t.btn_print}
            </button>
          </div>
        </div>

        {importBanner && (
          <div className={`mb-4 p-3 border-2 rounded-[4px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest ${importBanner.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
            <span>{importBanner.text}</span>
            <button type="button" onClick={() => setImportBanner(null)}>[X]</button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t.title}</h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 rounded-[2px] text-[8px] font-black text-teal-800 dark:text-teal-400 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span> LIVE SYNC TO KPI
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-3xl">{t.subtitle}</p>
      </div>

      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">SIO & SILO Compliance Register</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">Tanggal Cetak:</span>
            <span className="text-sm font-black text-black uppercase">{todayDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="p-4 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 rounded-[4px] print:border-black">
          <span className="block text-[8px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 print:text-black">SIO / SILO VALIDITY</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white print:text-black mt-1 block">{stats.validityPct}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">{stats.valid + stats.expiring} / {stats.total} AKTIF</span>
        </div>
        <div className="p-4 bg-white dark:bg-[#0b0f19] border-2 border-emerald-200 dark:border-emerald-900/60 rounded-[4px] print:border-black">
          <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 print:text-black">VALID (&gt; 30 HARI)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white print:text-black mt-1 block">{stats.valid}</span>
        </div>
        <div className="p-4 bg-white dark:bg-[#0b0f19] border-2 border-amber-200 dark:border-amber-900/60 rounded-[4px] print:border-black">
          <span className="block text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 print:text-black">EXPIRING SOON (&le; 30 HARI)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 print:text-black mt-1 block">{stats.expiring}</span>
        </div>
        <div className={`p-4 border-2 rounded-[4px] print:border-black ${stats.expired > 0 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
          <span className="block text-[8px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 print:text-black">EXPIRED (STOP OPERASI)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400 print:text-black mt-1 block">{stats.expired}</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.form_title}
        </h2>
        <form onSubmit={handleAddManual} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
          <div>
            <label htmlFor={`${formId}-type`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_type}</label>
            <select id={`${formId}-type`} value={permitType} onChange={e => setPermitType(e.target.value as PermitType)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-black">
              <option value="SIO">SIO (Operator)</option>
              <option value="SILO">SILO (Alat)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${formId}-cert`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_cert}</label>
            <input id={`${formId}-cert`} type="text" placeholder="No. Sertifikat" value={certificateNo} onChange={e => setCertificateNo(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor={`${formId}-name`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">{t.f_name}</label>
            <input id={`${formId}-name`} type="text" required placeholder="Nama Karyawan / Unit Forklift" value={holderOrAssetName} onChange={e => setHolderOrAssetName(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <label htmlFor={`${formId}-class`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_class}</label>
            <input id={`${formId}-class`} type="text" placeholder="Kelas / Tonase" value={equipmentClass} onChange={e => setEquipmentClass(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <label htmlFor={`${formId}-exp`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">{t.f_exp}</label>
            <input id={`${formId}-exp`} type="date" required value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <button type="submit" disabled={!holderOrAssetName.trim() || !expiryDate} className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-[2px] text-[9px] font-black uppercase tracking-widest h-[34px] disabled:opacity-40 transition-colors">
              {t.btn_save}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 border border-slate-200 dark:border-slate-800 print:border-none print:p-0 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.reg_title} ({filteredRecords.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto print:hidden">
            <input
              type="text"
              placeholder={t.search_ph}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label={t.search_ph}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2px] flex-1 sm:w-56 focus:outline-none focus:border-teal-500"
            />
            <select
              aria-label="Filter jenis SIO atau SILO"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as 'ALL' | PermitType)}
              className="px-2.5 py-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2px]"
            >
              <option value="ALL">ALL TYPE</option>
              <option value="SIO">SIO ONLY</option>
              <option value="SILO">SILO ONLY</option>
            </select>
            <select
              aria-label="Filter status masa berlaku"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'ALL' | ComputedStatus)}
              className="px-2.5 py-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2px]"
            >
              <option value="ALL">ALL STATUS</option>
              <option value="VALID">VALID</option>
              <option value="EXPIRING_SOON">EXPIRING SOON</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs min-w-[850px] print:min-w-0">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-20 text-center">{t.th_type}</th>
                <th className="py-3 px-3 w-44 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_cert}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_name}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_class}</th>
                <th className="py-3 px-3 w-32 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_exp}</th>
                <th className="py-3 px-3 w-40 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_status}</th>
                <th className="py-3 px-3 w-16 text-center border-l-2 border-slate-200 dark:border-slate-800 print:hidden">{t.th_del}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-100 print:divide-black">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    NO SIO / SILO RECORDS FOUND
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => {
                  const statusBadge =
                    rec.computedStatus === 'EXPIRED'
                      ? { label: `EXPIRED (${Math.abs(rec.daysLeft)}D AGO)`, cls: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800' }
                      : rec.computedStatus === 'EXPIRING_SOON'
                      ? { label: `EXPIRING (${rec.daysLeft}D LEFT)`, cls: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800' }
                      : { label: `VALID (${rec.daysLeft}D)`, cls: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800' }

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-white">
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-widest border print:border-black print:bg-transparent print:text-black ${
                          rec.permitType === 'SIO'
                            ? 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
                        }`}>
                          {rec.permitType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] font-bold border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                        {rec.certificateNo}
                      </td>
                      <td className="py-2.5 px-3 border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                        <p className="font-black text-slate-900 dark:text-white print:text-black uppercase">{rec.holderOrAssetName}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{rec.department} • {rec.issuer}</p>
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-bold border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                        {rec.equipmentClass}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[10px] font-black border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                        {rec.expiryDate}
                      </td>
                      <td className="py-2.5 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                        <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest inline-block border print:border-black print:bg-transparent print:text-black ${statusBadge.cls}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:hidden">
                        <button type="button" aria-label={`Hapus ${rec.holderOrAssetName}`} onClick={() => handleDelete(rec.id)} className="text-slate-400 hover:text-rose-600 font-black px-2 py-1">
                          [X]
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_mgr}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Plant / Ops Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}
