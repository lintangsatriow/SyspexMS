"use client"

import { useState, useEffect, useId, useRef, useMemo } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { useLanguage } from '../LanguageContext'

type PermitType = 'SIO' | 'SKP_AHLI' | 'BNSP' | 'SILO_SUKET' | 'RIKSA_UJI'
type ComputedStatus = 'VALID' | 'WARNING_90' | 'CRITICAL_60' | 'EXPIRED'

interface K3ComplianceRecord {
  id: string
  permitType: PermitType
  certificateNo: string
  holderOrAssetName: string
  equipmentClass: string
  department: string
  expiryDate: string // 'YYYY-MM-DD' atau 'LIFETIME'
  issuer: string
}

const WARNING_DAYS = 90
const CRITICAL_DAYS = 60

const PERMIT_LABELS: Record<PermitType, { short: string; full: string; badgeCls: string }> = {
  SIO: {
    short: 'SIO',
    full: 'SIO (Operator & Teknisi K3)',
    badgeCls: 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800'
  },
  SKP_AHLI: {
    short: 'SKP / AHLI',
    full: 'SKP & Sertifikat Ahli / Pengawas K3',
    badgeCls: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
  },
  BNSP: {
    short: 'BNSP',
    full: 'Sertifikat Kompetensi (BNSP)',
    badgeCls: 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800'
  },
  SILO_SUKET: {
    short: 'SILO / SUKET',
    full: 'SILO / Suket Layak K3 (Disnaker)',
    badgeCls: 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
  },
  RIKSA_UJI: {
    short: 'RIKSA UJI',
    full: 'Laporan Hasil Riksa Uji (PJK3)',
    badgeCls: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
  }
}

const INITIAL_RECORDS: K3ComplianceRecord[] = [
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
    permitType: 'SILO_SUKET',
    certificateNo: '5/882/AS.02.01/XI/2025',
    holderOrAssetName: 'Forklift Counterbalance Toyota #01',
    equipmentClass: 'Pesawat Angkat & Angkut (3.5 Ton)',
    department: 'Operation',
    expiryDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    issuer: 'Disnakertrans Banten'
  }
]

const MONTH_MAP: Record<string, string> = {
  jan: '01', january: '01', januari: '01',
  feb: '02', february: '02', februari: '02',
  mar: '03', march: '03', maret: '03',
  apr: '04', april: '04',
  may: '05', mei: '05',
  jun: '06', june: '06', juni: '06',
  jul: '07', july: '07', juli: '07',
  aug: '08', august: '08', agu: '08', agustus: '08',
  sep: '09', sept: '09', september: '09',
  oct: '10', october: '10', okt: '10', oktober: '10',
  nov: '11', november: '11',
  dec: '12', december: '12', des: '12', desember: '12'
}

const normalizeYear = (rawYear: number): number => {
  if (rawYear < 100) return 2000 + rawYear
  if (rawYear >= 1930 && rawYear <= 1945) return rawYear + 100
  return rawYear
}

const parseExcelExpiryDate = (rawVal: unknown): string => {
  if (rawVal === null || rawVal === undefined || String(rawVal).trim() === '' || String(rawVal).trim() === '-') {
    return 'LIFETIME'
  }

  if (typeof rawVal === 'number' && rawVal > 1000 && rawVal < 90000) {
    const parsed = XLSX.SSF.parse_date_code(rawVal)
    if (parsed && parsed.y && parsed.m && parsed.d) {
      const yr = normalizeYear(parsed.y)
      const mm = String(parsed.m).padStart(2, '0')
      const dd = String(parsed.d).padStart(2, '0')
      return `${yr}-${mm}-${dd}`
    }
  }

  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    const yr = normalizeYear(rawVal.getFullYear())
    const mm = String(rawVal.getMonth() + 1).padStart(2, '0')
    const dd = String(rawVal.getDate()).padStart(2, '0')
    return `${yr}-${mm}-${dd}`
  }

  const str = String(rawVal).trim()

  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (isoMatch) {
    const yr = normalizeYear(Number(isoMatch[1]))
    return `${yr}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`
  }

  const textMonthMatch = str.match(/^(\d{1,2})[-/\s]+([a-zA-Z]+)[-/\s]+(\d{2,4})/)
  if (textMonthMatch) {
    const dd = textMonthMatch[1].padStart(2, '0')
    const monKey = textMonthMatch[2].toLowerCase()
    const mm = MONTH_MAP[monKey]
    const yr = normalizeYear(Number(textMonthMatch[3]))
    if (mm) return `${yr}-${mm}-${dd}`
  }

  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/)
  if (dmyMatch) {
    const yr = normalizeYear(Number(dmyMatch[3]))
    return `${yr}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`
  }

  return 'LIFETIME'
}

const detectPermitCategory = (rawType: string, eqClass: string, holderName: string, issuer: string): PermitType => {
  const combined = `${rawType} ${eqClass} ${holderName} ${issuer}`.toLowerCase()

  if (rawType.includes('RIKSA') || combined.includes('riksa uji') || combined.includes('pjk3') || combined.includes('pengujian')) {
    return 'RIKSA_UJI'
  }
  if (rawType.includes('SILO') || rawType.includes('SUKET') || combined.includes('suket') || combined.includes('layak operasi')) {
    return 'SILO_SUKET'
  }
  if (rawType.includes('BNSP') || combined.includes('bnsp') || combined.includes('welder') || combined.includes('p3k') || combined.includes('damkar')) {
    return 'BNSP'
  }
  if (
    rawType.includes('SKP') ||
    rawType.includes('AHLI') ||
    combined.includes('k3 umum') ||
    combined.includes('supervisi') ||
    combined.includes('pengawas') ||
    combined.includes('tkbt') ||
    combined.includes('k3 perancah')
  ) {
    return 'SKP_AHLI'
  }
  if (
    holderName.toLowerCase().includes('unit ') ||
    holderName.toLowerCase().includes('forklift #') ||
    holderName.toLowerCase().includes('crane #')
  ) {
    return 'SILO_SUKET'
  }
  return 'SIO'
}

const getPermitStatus = (expiryDateStr: string): { status: ComputedStatus; daysLeft: number } => {
  if (!expiryDateStr || expiryDateStr === 'LIFETIME') {
    return { status: 'VALID', daysLeft: 9999 }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expiryDateStr)
  exp.setHours(0, 0, 0, 0)

  if (isNaN(exp.getTime())) return { status: 'VALID', daysLeft: 9999 }

  const diffMs = exp.getTime() - today.getTime()
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { status: 'EXPIRED', daysLeft }
  if (daysLeft <= CRITICAL_DAYS) return { status: 'CRITICAL_60', daysLeft }
  if (daysLeft <= WARNING_DAYS) return { status: 'WARNING_90', daysLeft }
  return { status: 'VALID', daysLeft }
}

const formatIcsDate = (dateObj: Date): string => {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

export default function K3ComplianceRegisterPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [todayDate, setTodayDate] = useState('')
  const [records, setRecords] = useState<K3ComplianceRecord[]>([])

  const [typeFilter, setTypeFilter] = useState<'ALL' | PermitType>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | ComputedStatus>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [importBanner, setImportBanner] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null)

  const [permitType, setPermitType] = useState<PermitType>('SIO')
  const [certificateNo, setCertificateNo] = useState('')
  const [holderOrAssetName, setHolderOrAssetName] = useState('')
  const [equipmentClass, setEquipmentClass] = useState('')
  const [department, setDepartment] = useState('Technical')
  const [expiryDate, setExpiryDate] = useState('')
  const [issuer, setIssuer] = useState('Kemnaker RI')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<K3ComplianceRecord | null>(null)

  useEffect(() => {
    setMounted(true)
    setTodayDate(new Date().toISOString().split('T')[0])
    const saved = localStorage.getItem('syspex_sio_db')
    if (saved) {
      const parsed: K3ComplianceRecord[] = JSON.parse(saved)
      const normalized = parsed.map(item => ({
        ...item,
        permitType: (item.permitType as string) === 'SILO' ? 'SILO_SUKET' : item.permitType
      }))
      setRecords(normalized)
    } else {
      setRecords(INITIAL_RECORDS)
      localStorage.setItem('syspex_sio_db', JSON.stringify(INITIAL_RECORDS))
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingId(null)
        setEditDraft(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const saveRecords = (updated: K3ComplianceRecord[]) => {
    setRecords(updated)
    localStorage.setItem('syspex_sio_db', JSON.stringify(updated))
    window.dispatchEvent(new Event('syspex_hse_sync'))
  }

  // --- EXPORT JADWAL REMINDER KE KALENDER (.ICS) ---
  const handleExportCalendarIcs = () => {
    const datedRecords = records.filter(r => r.expiryDate && r.expiryDate !== 'LIFETIME')
    if (datedRecords.length === 0) {
      setImportBanner({
        type: 'ERROR',
        text: lang === 'ID'
          ? 'Tidak ada dokumen dengan tanggal kedaluwarsa untuk diekspor ke kalender.'
          : 'No dated permits found to export to calendar.'
      })
      return
    }

    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Syspex Management System//K3 Compliance Reminder//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ]

    datedRecords.forEach(rec => {
      const exp = new Date(rec.expiryDate)
      if (isNaN(exp.getTime())) return
      const catLabel = PERMIT_LABELS[rec.permitType]?.short || rec.permitType

      // Event 1: Peringatan H-90 (Persiapan Berkas PJK3)
      const warn90Date = new Date(exp.getTime() - 90 * 86400000)
      const nextWarn90 = new Date(warn90Date.getTime() + 86400000)
      lines.push(
        'BEGIN:VEVENT',
        `UID:${rec.id}-H90@syspexms.local`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;VALUE=DATE:${formatIcsDate(warn90Date)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(nextWarn90)}`,
        `SUMMARY:[H-90 WARNING] Perpanjangan ${catLabel}: ${rec.holderOrAssetName}`,
        `DESCRIPTION:Persiapan berkas perpanjangan ${catLabel} (${rec.equipmentClass}) milik ${rec.holderOrAssetName}. No Dokumen: ${rec.certificateNo}. Kedaluwarsa pada ${rec.expiryDate}.`,
        'BEGIN:VALARM',
        'TRIGGER:-PT9H',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder H-90 ${catLabel} - ${rec.holderOrAssetName}`,
        'END:VALARM',
        'END:VEVENT'
      )

      // Event 2: Peringatan H-60 (Kritis Birokrasi Kemnaker)
      const crit60Date = new Date(exp.getTime() - 60 * 86400000)
      const nextCrit60 = new Date(crit60Date.getTime() + 86400000)
      lines.push(
        'BEGIN:VEVENT',
        `UID:${rec.id}-H60@syspexms.local`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;VALUE=DATE:${formatIcsDate(crit60Date)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(nextCrit60)}`,
        `SUMMARY:[H-60 CRITICAL] Segera Proses ${catLabel}: ${rec.holderOrAssetName}`,
        `DESCRIPTION:Batas kritis 60 hari sebelum habis masa berlaku (${rec.expiryDate}) untuk ${rec.holderOrAssetName} - ${rec.equipmentClass}.`,
        'BEGIN:VALARM',
        'TRIGGER:-PT9H',
        'ACTION:DISPLAY',
        `DESCRIPTION:CRITICAL H-60 ${catLabel} - ${rec.holderOrAssetName}`,
        'END:VALARM',
        'END:VEVENT'
      )
    })

    lines.push('END:VCALENDAR')

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Syspex_K3_Reminder_Kalender.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setImportBanner({
      type: 'SUCCESS',
      text: lang === 'ID'
        ? `FILE KALENDER (.ICS) BERISI ${datedRecords.length * 2} ALARM PENGINGAT (H-90 & H-60) BERHASIL DIUNDUH.`
        : `CALENDAR FILE (.ICS) WITH ${datedRecords.length * 2} ALARMS (H-90 & H-60) DOWNLOADED.`
    })
  }

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        'Kategori (SIO/SKP_AHLI/BNSP/SILO_SUKET/RIKSA_UJI)': 'SIO',
        'Nomor Lisensi / Sertifikat': '5/1428/AS.02.04/III/2024',
        'Nama Personel / Unit Alat': 'Adi Dwi Sandi',
        'Klasifikasi / Kompetensi / Objek Uji': 'Operator Forklift Kelas II',
        'Departemen': 'Technical',
        'Berlaku Hingga (YYYY-MM-DD)': '2029-04-15',
        'Instansi Penerbit / PJK3': 'Kemnaker RI'
      },
      {
        'Kategori (SIO/SKP_AHLI/BNSP/SILO_SUKET/RIKSA_UJI)': 'SKP_AHLI',
        'Nomor Lisensi / Sertifikat': '5/991/AS.01.02/II/2025',
        'Nama Personel / Unit Alat': 'Asep Jamaludin',
        'Klasifikasi / Kompetensi / Objek Uji': 'Ahli K3 Umum',
        'Departemen': 'Technical',
        'Berlaku Hingga (YYYY-MM-DD)': '2028-02-04',
        'Instansi Penerbit / PJK3': 'Kemnaker RI'
      },
      {
        'Kategori (SIO/SKP_AHLI/BNSP/SILO_SUKET/RIKSA_UJI)': 'BNSP',
        'Nomor Lisensi / Sertifikat': 'REG-BNSP-2024-882',
        'Nama Personel / Unit Alat': 'Sugeng Purnomo',
        'Klasifikasi / Kompetensi / Objek Uji': 'Welder SMAW 3G',
        'Departemen': 'Technical',
        'Berlaku Hingga (YYYY-MM-DD)': '',
        'Instansi Penerbit / PJK3': 'BNSP'
      },
      {
        'Kategori (SIO/SKP_AHLI/BNSP/SILO_SUKET/RIKSA_UJI)': 'SILO_SUKET',
        'Nomor Lisensi / Sertifikat': '5/882/AS.02.01/XI/2025',
        'Nama Personel / Unit Alat': 'Unit Forklift Toyota #01',
        'Klasifikasi / Kompetensi / Objek Uji': 'Pesawat Angkat & Angkut (3.5 Ton)',
        'Departemen': 'Operation',
        'Berlaku Hingga (YYYY-MM-DD)': '2027-11-20',
        'Instansi Penerbit / PJK3': 'Disnakertrans'
      },
      {
        'Kategori (SIO/SKP_AHLI/BNSP/SILO_SUKET/RIKSA_UJI)': 'RIKSA_UJI',
        'Nomor Lisensi / Sertifikat': 'LHP-PJK3-2026-014',
        'Nama Personel / Unit Alat': 'Instalasi Racking Warehouse B',
        'Klasifikasi / Kompetensi / Objek Uji': 'Hasil Riksa Uji Berkala Tahunan',
        'Departemen': 'Operation',
        'Berlaku Hingga (YYYY-MM-DD)': '2027-06-30',
        'Instansi Penerbit / PJK3': 'PT PJK3 Mitra Inspeksi'
      }
    ]
    const ws = XLSX.utils.json_to_sheet(templateRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Register_Lisensi_RiksaUji')
    XLSX.writeFile(wb, 'Template_Lisensi_K3_RiksaUji_Syspex.xlsx')
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

        const nameIdx = norm.findIndex(c => c.includes('nama') || c.includes('personel') || c.includes('operator') || c.includes('unit') || c.includes('alat') || c.includes('holder'))
        const expIdx = norm.findIndex(c => c.includes('berlaku') || c.includes('expired') || c.includes('expiry') || c.includes('tanggal') || c.includes('date'))

        if (nameIdx !== -1 && expIdx !== -1) {
          headerIdx = i
          colName = nameIdx
          colExp = expIdx
          colType = norm.findIndex(c => c.startsWith('kategori') || c.startsWith('jenis (sio') || c === 'jenis' || c === 'type')
          colCert = norm.findIndex(c => c.includes('nomor') || c.includes('no') || c.includes('sertifikat') || c.includes('lisensi') || c.includes('cert'))
          colClass = norm.findIndex(c => c.includes('klasifikasi') || c.includes('kompetensi') || c.includes('kapasitas') || c.includes('kelas') || c.includes('objek') || c.includes('jenis &'))
          colDept = norm.findIndex(c => c.includes('departemen') || c.includes('dept'))
          colIssuer = norm.findIndex(c => c.includes('penerbit') || c.includes('instansi') || c.includes('pjk3') || c.includes('issuer'))
          break
        }
      }

      if (headerIdx === -1) throw new Error('Header tidak ditemukan')

      const importedItems: K3ComplianceRecord[] = []
      for (let r = headerIdx + 1; r < rows.length; r++) {
        const row = rows[r]
        if (!Array.isArray(row)) continue

        const holderName = String(row[colName] ?? '').trim()
        if (!holderName || holderName.toLowerCase() === 'total') continue

        const parsedDate = parseExcelExpiryDate(row[colExp])
        const rawType = colType !== -1 ? String(row[colType]).trim().toUpperCase() : ''
        const certNo = colCert !== -1 ? String(row[colCert]).trim() : ''
        const eqClass = colClass !== -1 ? String(row[colClass]).trim() : 'Sertifikasi K3'
        const dept = colDept !== -1 && String(row[colDept]).trim() ? String(row[colDept]).trim() : 'Technical'
        const iss = colIssuer !== -1 && String(row[colIssuer]).trim() ? String(row[colIssuer]).trim() : 'Kemnaker RI'

        const detectedType = detectPermitCategory(rawType, eqClass, holderName, iss)

        importedItems.push({
          id: `${detectedType}-${r}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          permitType: detectedType,
          certificateNo: certNo || '-',
          holderOrAssetName: holderName,
          equipmentClass: eqClass || '-',
          department: dept,
          expiryDate: parsedDate,
          issuer: iss
        })
      }

      if (importedItems.length === 0) throw new Error('Tidak ada baris valid')

      saveRecords(importedItems)
      setEditingId(null)
      setEditDraft(null)
      setTypeFilter('ALL')
      setStatusFilter('ALL')
      setSearchQuery('')
      setImportBanner({
        type: 'SUCCESS',
        text: lang === 'ID'
          ? `BERHASIL MEMUAT ${importedItems.length} DOKUMEN K3 DARI "${file.name}" & DIKLASIFIKASIKAN OTOMATIS KE KPI.`
          : `SUCCESSFULLY LOADED & CLASSIFIED ${importedItems.length} K3 COMPLIANCE RECORDS FROM "${file.name}".`
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
    if (!holderOrAssetName.trim()) return

    const newItem: K3ComplianceRecord = {
      id: `${permitType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      permitType,
      certificateNo: certificateNo.trim() || '-',
      holderOrAssetName: holderOrAssetName.trim(),
      equipmentClass: equipmentClass.trim() || '-',
      department: department.trim() || 'Technical',
      expiryDate: expiryDate || 'LIFETIME',
      issuer: issuer.trim() || 'Kemnaker RI'
    }

    saveRecords([newItem, ...records])
    setCertificateNo('')
    setHolderOrAssetName('')
    setEquipmentClass('')
    setExpiryDate('')
  }

  const startRowEdit = (rec: K3ComplianceRecord) => {
    setEditingId(rec.id)
    setEditDraft({ ...rec })
  }

  const cancelRowEdit = () => {
    setEditingId(null)
    setEditDraft(null)
  }

  const saveRowEdit = () => {
    if (!editDraft || !editDraft.holderOrAssetName.trim()) return
    const cleanedDraft: K3ComplianceRecord = {
      ...editDraft,
      certificateNo: editDraft.certificateNo.trim() || '-',
      holderOrAssetName: editDraft.holderOrAssetName.trim(),
      equipmentClass: editDraft.equipmentClass.trim() || '-',
      department: editDraft.department.trim() || 'Technical',
      issuer: editDraft.issuer.trim() || 'Kemnaker RI',
      expiryDate: editDraft.expiryDate ? editDraft.expiryDate : 'LIFETIME'
    }
    saveRecords(records.map(r => (r.id === cleanedDraft.id ? cleanedDraft : r)))
    setEditingId(null)
    setEditDraft(null)
  }

  const handleDelete = (id: string) => {
    if (editingId === id) {
      setEditingId(null)
      setEditDraft(null)
    }
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
    const warning90 = enrichedRecords.filter(r => r.computedStatus === 'WARNING_90').length
    const critical60 = enrichedRecords.filter(r => r.computedStatus === 'CRITICAL_60').length
    const expired = enrichedRecords.filter(r => r.computedStatus === 'EXPIRED').length
    const activeCount = valid + warning90 + critical60
    const validityPct = total > 0 ? Math.round((activeCount / total) * 100) : 100
    return { total, valid, warning90, critical60, expired, activeCount, validityPct }
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
          r.department.toLowerCase().includes(q) ||
          r.issuer.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [enrichedRecords, typeFilter, statusFilter, searchQuery])

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO / SMK3",
      title: "Register Lisensi K3 & Riksa Uji",
      subtitle: "Pemantauan terpadu SIO Operator, SKP Ahli/Pengawas, Sertifikat BNSP, SILO/Suket K3, dan Hasil Riksa Uji PJK3 (Oranye ≤90 Hari • Merah ≤60 Hari).",
      btn_calendar: "Alarm Kalender (.ics)",
      btn_import: "Import Excel (.xlsx)",
      btn_template: "Template Excel",
      btn_print: "Cetak Register",
      form_title: "1. Tambah Dokumen Lisensi K3 / Riksa Uji Manual",
      f_type: "Kategori Dokumen",
      f_cert: "No. Sertifikat / LHP",
      f_name: "Nama Personel / Unit Alat *",
      f_class: "Kompetensi / Objek Uji",
      f_exp: "Berlaku Hingga (Kosong = Seumur Hidup)",
      btn_save: "Simpan & Sinkron KPI",
      reg_title: "2. Register Kepatuhan Lisensi K3 & Hasil Riksa Uji",
      search_ph: "Cari nama, unit alat, kompetensi, PJK3...",
      th_type: "Kategori",
      th_cert: "No. Dokumen",
      th_name: "Personel / Objek Peralatan",
      th_class: "Kompetensi / Klasifikasi",
      th_exp: "Masa Berlaku",
      th_status: "Status Legal",
      th_action: "Aksi",
      btn_edit: "Edit",
      btn_update: "Simpan",
      btn_cancel: "Batal",
      btn_lifetime: "Seumur Hidup",
      print_doc: "REGISTER KEPATUHAN LISENSI PERSONEL K3 & HASIL RIKSA UJI PERALATAN • SYSPEX HSE",
      sign_hse: "Diperiksa Oleh (HSE Officer):",
      sign_mgr: "Disetujui Oleh (Plant / Ops Manager):"
    },
    EN: {
      breadcrumb: "Management & ISO / SMK3",
      title: "K3 Licenses & Riksa Uji Register",
      subtitle: "Unified tracking for Operator SIO, K3 Specialist SKP, BNSP Certificates, Equipment SILO/Suket, and PJK3 Inspection Reports (Orange ≤90D • Red ≤60D).",
      btn_calendar: "Calendar Alarms (.ics)",
      btn_import: "Import Excel (.xlsx)",
      btn_template: "Excel Template",
      btn_print: "Print Register",
      form_title: "1. Add Manual K3 License / Riksa Uji Record",
      f_type: "Document Category",
      f_cert: "Certificate / Report No.",
      f_name: "Personnel Name / Equipment Unit *",
      f_class: "Competency / Inspected Object",
      f_exp: "Valid Until (Blank = Lifetime)",
      btn_save: "Save & Sync KPI",
      reg_title: "2. K3 Licenses & Inspection Compliance Register",
      search_ph: "Search name, equipment, competency, PJK3...",
      th_type: "Category",
      th_cert: "Document No.",
      th_name: "Personnel / Equipment Object",
      th_class: "Competency / Classification",
      th_exp: "Expiry Date",
      th_status: "Legal Status",
      th_action: "Action",
      btn_edit: "Edit",
      btn_update: "Save",
      btn_cancel: "Cancel",
      btn_lifetime: "Lifetime",
      print_doc: "OFFICIAL K3 PERSONNEL LICENSES & EQUIPMENT INSPECTION REGISTER • SYSPEX HSE",
      sign_hse: "Verified By (HSE Officer):",
      sign_mgr: "Approved By (Plant / Ops Manager):"
    }
  }

  const t = dict[lang]
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 w-full">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" aria-label="Upload Excel Lisensi K3" />

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
              onClick={handleExportCalendarIcs}
              disabled={records.length === 0}
              className="px-3 py-2 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t.btn_calendar}
            </button>
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
        <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-4xl">{t.subtitle}</p>
      </div>

      {/* HEADER CETAK DOKUMEN */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Register Lisensi K3 & Riksa Uji</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">Tanggal Cetak:</span>
            <span className="text-sm font-black text-black uppercase">{todayDate}</span>
          </div>
        </div>
      </div>

      {/* 5 KARTU INDIKATOR KEPATUHAN */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 print:grid-cols-5">
        <div className="p-4 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 rounded-[4px] print:border-black">
          <span className="block text-[8px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 print:text-black">COMPLIANCE VALIDITY</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white print:text-black mt-1 block">{stats.validityPct}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">{stats.activeCount} / {stats.total} AKTIF</span>
        </div>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'VALID' ? 'ALL' : 'VALID')}
          className={`text-left p-4 bg-white dark:bg-[#0b0f19] border-2 rounded-[4px] print:border-black transition-colors ${statusFilter === 'VALID' ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400'}`}
        >
          <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 print:text-black">SAFE / VALID (&gt; {WARNING_DAYS}D)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white print:text-black mt-1 block">{stats.valid}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">KLIK UNTUK FILTER</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'WARNING_90' ? 'ALL' : 'WARNING_90')}
          className={`text-left p-4 border-2 rounded-[4px] print:border-black transition-colors ${
            statusFilter === 'WARNING_90'
              ? 'bg-orange-100/80 dark:bg-orange-950/50 border-orange-600 ring-1 ring-orange-600'
              : stats.warning90 > 0
              ? 'bg-orange-50/70 dark:bg-orange-950/25 border-orange-300 dark:border-orange-800 hover:border-orange-500'
              : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="block text-[8px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 print:text-black">WARNING (61–{WARNING_DAYS} HARI)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-orange-600 dark:text-orange-400 print:text-black mt-1 block">{stats.warning90}</span>
          <span className="text-[8px] font-bold text-orange-700/70 dark:text-orange-300/70 uppercase">SIAPKAN BERKAS PJK3</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'CRITICAL_60' ? 'ALL' : 'CRITICAL_60')}
          className={`text-left p-4 border-2 rounded-[4px] print:border-black transition-colors ${
            statusFilter === 'CRITICAL_60'
              ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-600 ring-1 ring-rose-600'
              : stats.critical60 > 0
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 hover:border-rose-500'
              : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="block text-[8px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 print:text-black">CRITICAL (&le; {CRITICAL_DAYS} HARI)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400 print:text-black mt-1 block">{stats.critical60}</span>
          <span className="text-[8px] font-bold text-rose-700/80 dark:text-rose-300/80 uppercase">PROSES SEGERA</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'EXPIRED' ? 'ALL' : 'EXPIRED')}
          className={`col-span-2 sm:col-span-1 text-left p-4 border-2 rounded-[4px] print:border-black transition-colors ${
            statusFilter === 'EXPIRED'
              ? 'bg-red-200 dark:bg-red-950 border-red-700 ring-1 ring-red-700'
              : stats.expired > 0
              ? 'bg-red-100/80 dark:bg-red-950/50 border-red-400 dark:border-red-800 hover:border-red-600'
              : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="block text-[8px] font-black uppercase tracking-widest text-red-700 dark:text-red-400 print:text-black">EXPIRED (KEDALUWARSA)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-red-700 dark:text-red-400 print:text-black mt-1 block">{stats.expired}</span>
          <span className="text-[8px] font-bold text-red-700/80 dark:text-red-300/80 uppercase">WAJIB PERPANJANG</span>
        </button>
      </div>

      {/* 1. FORM INPUT MANUAL */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.form_title}
        </h2>
        <form onSubmit={handleAddManual} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3 items-end">
          <div className="lg:col-span-2">
            <label htmlFor={`${formId}-type`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">{t.f_type}</label>
            <select id={`${formId}-type`} value={permitType} onChange={e => setPermitType(e.target.value as PermitType)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-black">
              <option value="SIO">SIO (Operator & Teknisi K3)</option>
              <option value="SKP_AHLI">SKP / Sertifikat Ahli & Pengawas</option>
              <option value="BNSP">Sertifikat Kompetensi (BNSP)</option>
              <option value="SILO_SUKET">SILO / Suket Layak K3 (Disnaker)</option>
              <option value="RIKSA_UJI">Hasil Riksa Uji Berkala (PJK3)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${formId}-cert`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_cert}</label>
            <input id={`${formId}-cert`} type="text" placeholder="No. Dokumen" value={certificateNo} onChange={e => setCertificateNo(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor={`${formId}-name`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">{t.f_name}</label>
            <input id={`${formId}-name`} type="text" required placeholder="Nama Karyawan / Unit Alat" value={holderOrAssetName} onChange={e => setHolderOrAssetName(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <label htmlFor={`${formId}-class`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_class}</label>
            <input id={`${formId}-class`} type="text" placeholder="Bidang / Objek" value={equipmentClass} onChange={e => setEquipmentClass(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <label htmlFor={`${formId}-exp`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.f_exp}</label>
            <input id={`${formId}-exp`} type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full px-2.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[2px] text-xs font-bold" />
          </div>
          <div>
            <button type="submit" disabled={!holderOrAssetName.trim()} className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-[2px] text-[9px] font-black uppercase tracking-widest h-[34px] disabled:opacity-40 transition-colors">
              {t.btn_save}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL REGISTER DENGAN MODE EDIT LANGSUNG */}
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
              aria-label="Filter kategori dokumen K3"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as 'ALL' | PermitType)}
              className="px-2.5 py-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2px]"
            >
              <option value="ALL">SEMUA KATEGORI (5)</option>
              <option value="SIO">SIO ONLY</option>
              <option value="SKP_AHLI">SKP / AHLI ONLY</option>
              <option value="BNSP">BNSP ONLY</option>
              <option value="SILO_SUKET">SILO / SUKET ONLY</option>
              <option value="RIKSA_UJI">RIKSA UJI ONLY</option>
            </select>
            <select
              aria-label="Filter status masa berlaku"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'ALL' | ComputedStatus)}
              className="px-2.5 py-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2px]"
            >
              <option value="ALL">ALL STATUS</option>
              <option value="VALID">VALID (&gt; {WARNING_DAYS}D)</option>
              <option value="WARNING_90">ORANGE (61–{WARNING_DAYS}D)</option>
              <option value="CRITICAL_60">RED (&le; {CRITICAL_DAYS}D)</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs min-w-[960px] print:min-w-0">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-32 text-center">{t.th_type}</th>
                <th className="py-3 px-3 w-40 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_cert}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_name}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_class}</th>
                <th className="py-3 px-3 w-36 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_exp}</th>
                <th className="py-3 px-3 w-48 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_status}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 dark:border-slate-800 print:hidden">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-100 print:divide-black">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    NO COMPLIANCE RECORDS FOUND
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => {
                  const isEditing = editingId === rec.id && editDraft !== null

                  if (isEditing && editDraft) {
                    return (
                      <tr key={rec.id} className="bg-teal-50/60 dark:bg-teal-950/30 align-top">
                        <td className="py-2.5 px-2">
                          <select
                            aria-label="Edit kategori dokumen"
                            value={editDraft.permitType}
                            onChange={e => setEditDraft({ ...editDraft, permitType: e.target.value as PermitType })}
                            className="w-full px-1.5 py-1.5 text-[9px] font-black bg-white dark:bg-slate-950 border border-teal-500 rounded-[2px]"
                          >
                            <option value="SIO">SIO</option>
                            <option value="SKP_AHLI">SKP / AHLI</option>
                            <option value="BNSP">BNSP</option>
                            <option value="SILO_SUKET">SILO / SUKET</option>
                            <option value="RIKSA_UJI">RIKSA UJI</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2 border-l-2 border-teal-200 dark:border-teal-900">
                          <input
                            type="text"
                            aria-label="Edit nomor sertifikat"
                            value={editDraft.certificateNo === '-' ? '' : editDraft.certificateNo}
                            placeholder="No. Sertifikat"
                            onChange={e => setEditDraft({ ...editDraft, certificateNo: e.target.value })}
                            className="w-full px-2 py-1.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-950 border border-teal-500 rounded-[2px]"
                          />
                        </td>
                        <td className="py-2.5 px-2 border-l-2 border-teal-200 dark:border-teal-900 space-y-1.5">
                          <input
                            type="text"
                            aria-label="Edit nama personel atau unit"
                            value={editDraft.holderOrAssetName}
                            onChange={e => setEditDraft({ ...editDraft, holderOrAssetName: e.target.value })}
                            className="w-full px-2 py-1 text-[10px] font-black bg-white dark:bg-slate-950 border border-teal-500 rounded-[2px]"
                          />
                          <div className="flex gap-1">
                            <input
                              type="text"
                              aria-label="Edit departemen"
                              value={editDraft.department}
                              placeholder="Dept"
                              onChange={e => setEditDraft({ ...editDraft, department: e.target.value })}
                              className="w-1/2 px-1.5 py-1 text-[9px] font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]"
                            />
                            <input
                              type="text"
                              aria-label="Edit instansi penerbit"
                              value={editDraft.issuer}
                              placeholder="Penerbit"
                              onChange={e => setEditDraft({ ...editDraft, issuer: e.target.value })}
                              className="w-1/2 px-1.5 py-1 text-[9px] font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-2 border-l-2 border-teal-200 dark:border-teal-900">
                          <input
                            type="text"
                            aria-label="Edit klasifikasi kompetensi"
                            value={editDraft.equipmentClass}
                            onChange={e => setEditDraft({ ...editDraft, equipmentClass: e.target.value })}
                            className="w-full px-2 py-1.5 text-[10px] font-bold bg-white dark:bg-slate-950 border border-teal-500 rounded-[2px]"
                          />
                        </td>
                        <td className="py-2.5 px-2 border-l-2 border-teal-200 dark:border-teal-900 space-y-1">
                          <input
                            type="date"
                            aria-label="Edit tanggal berlaku"
                            value={editDraft.expiryDate === 'LIFETIME' ? '' : editDraft.expiryDate}
                            onChange={e => setEditDraft({ ...editDraft, expiryDate: e.target.value || 'LIFETIME' })}
                            className="w-full px-1.5 py-1 text-[10px] font-mono font-bold bg-white dark:bg-slate-950 border border-teal-500 rounded-[2px]"
                          />
                          <button
                            type="button"
                            onClick={() => setEditDraft({ ...editDraft, expiryDate: 'LIFETIME' })}
                            className="w-full py-0.5 text-[8px] font-black uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[2px]"
                          >
                            Set {t.btn_lifetime}
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-center border-l-2 border-teal-200 dark:border-teal-900">
                          <span className="text-[8px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                            EDITING MODE
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center border-l-2 border-teal-200 dark:border-teal-900 space-y-1">
                          <button
                            type="button"
                            onClick={saveRowEdit}
                            className="block w-full py-1 bg-teal-700 hover:bg-teal-600 text-white text-[8px] font-black uppercase tracking-widest rounded-[2px]"
                          >
                            {t.btn_update}
                          </button>
                          <button
                            type="button"
                            onClick={cancelRowEdit}
                            className="block w-full py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[8px] font-black uppercase tracking-widest rounded-[2px]"
                          >
                            {t.btn_cancel}
                          </button>
                        </td>
                      </tr>
                    )
                  }

                  const isLifetime = rec.expiryDate === 'LIFETIME'
                  const catInfo = PERMIT_LABELS[rec.permitType] || PERMIT_LABELS.SIO
                  const statusBadge =
                    rec.computedStatus === 'EXPIRED'
                      ? { label: `EXPIRED (${Math.abs(rec.daysLeft)}D AGO)`, cls: 'bg-red-700 text-white border-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-700' }
                      : rec.computedStatus === 'CRITICAL_60'
                      ? { label: `CRITICAL (${rec.daysLeft}D LEFT)`, cls: 'bg-rose-100 text-rose-800 border-rose-400 dark:bg-rose-950/70 dark:text-rose-400 dark:border-rose-800' }
                      : rec.computedStatus === 'WARNING_90'
                      ? { label: `WARNING (${rec.daysLeft}D LEFT)`, cls: 'bg-orange-100 text-orange-800 border-orange-400 dark:bg-orange-950/70 dark:text-orange-400 dark:border-orange-800' }
                      : isLifetime
                      ? { label: 'PERMANENT / LIFETIME', cls: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-400 dark:border-teal-800' }
                      : { label: `VALID (${rec.daysLeft}D)`, cls: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800' }

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-white">
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase tracking-widest border inline-block whitespace-nowrap print:border-black print:bg-transparent print:text-black ${catInfo.badgeCls}`}>
                          {catInfo.short}
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`Edit ${rec.holderOrAssetName}`}
                            onClick={() => startRowEdit(rec)}
                            className="px-2 py-1 text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-[2px] transition-colors"
                          >
                            {t.btn_edit}
                          </button>
                          <button
                            type="button"
                            aria-label={`Hapus ${rec.holderOrAssetName}`}
                            onClick={() => handleDelete(rec.id)}
                            className="px-1.5 py-1 text-[8px] font-black text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 rounded-[2px] transition-colors"
                          >
                            [X]
                          </button>
                        </div>
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
