"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

type WasteCategory = 'B105d' | 'B110d' | 'B104d' | 'A102d' | 'B107d' | 'A338-1'
type StorageStatus = 'IN_TPS' | 'DISPOSED'

interface WasteRecord {
  id: string
  logDate: string
  wasteCode: WasteCategory
  sourceArea: string
  volume: number
  unit: string
  maxStorageDays: number
  status: StorageStatus
  disposalDate: string
  manifestNo: string
  transporter: string
  createdAt: number
}

export default function EnvWasteLogPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)
  const [todayDate, setTodayDate] = useState<string>('')

  // DB States
  const [logs, setLogs] = useState<WasteRecord[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterCode, setFilterCode] = useState<string>('ALL')

  // Form States
  const [logDate, setLogDate] = useState('')
  const [wasteCode, setWasteCode] = useState<WasteCategory>('B105d')
  const [sourceArea, setSourceArea] = useState('')
  const [volume, setVolume] = useState<number | ''>('')
  const [unit, setUnit] = useState('Kg')
  const [maxStorageDays, setMaxStorageDays] = useState<number>(90)
  const [status, setStatus] = useState<StorageStatus>('IN_TPS')
  const [manifestNo, setManifestNo] = useState('')
  const [transporter, setTransporter] = useState('')

  useEffect(() => {
    setMounted(true)
    const today = new Date().toISOString().split('T')[0]
    setTodayDate(today)
    setLogDate(today)

    const q = query(collection(db, 'waste_logs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLogs(snap.docs.map((d) => d.data() as WasteRecord))
        setLoadingDb(false)
        setDbError('')
      },
      (err) => {
        console.error(err)
        setLoadingDb(false)
        setDbError(
          lang === 'ID'
            ? 'Gagal memuat data TPS B3 dari Firestore.'
            : 'Failed to load TPS B3 records from Firestore.'
        )
      }
    )

    return () => unsub()
  }, [lang])

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sourceArea.trim() || volume === '' || submitting) return
    setSubmitting(true)
    setDbError('')

    try {
      const docId = `TPS-${Date.now().toString().slice(-6)}`
      const payload: WasteRecord = {
        id: docId,
        logDate: logDate || todayDate,
        wasteCode,
        sourceArea: sourceArea.trim(),
        volume: Number(volume),
        unit,
        maxStorageDays,
        status,
        disposalDate: status === 'DISPOSED' ? (logDate || todayDate) : '',
        manifestNo: status === 'DISPOSED' ? (manifestNo.trim().toUpperCase() || 'FESTRONIK-PENDING') : 'IN TPS B3 STORAGE',
        transporter: status === 'DISPOSED' ? (transporter.trim() || 'Authorized Transporter') : 'TPS B3 Internal Syspex',
        createdAt: Date.now()
      }

      await setDoc(doc(db, 'waste_logs', docId), payload)
      setSourceArea('')
      setVolume('')
      setManifestNo('')
      setTransporter('')
      setStatus('IN_TPS')
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menyimpan catatan limbah. Pastikan Anda login sebagai Admin.'
          : 'Failed to save waste log. Ensure you are logged in as Admin.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkDisposed = async (item: WasteRecord) => {
    const inputManifest = window.prompt(
      lang === 'ID'
        ? `Masukkan Nomor Manifest / Festronik untuk pengangkutan ${item.id}:`
        : `Enter Festronik / Manifest Number for disposal of ${item.id}:`
    )
    if (inputManifest === null) return

    const inputVendor = window.prompt(
      lang === 'ID'
        ? 'Masukkan Nama Vendor Transporter Berizin:'
        : 'Enter Licensed Transporter Vendor Name:'
    )
    if (inputVendor === null) return

    try {
      await updateDoc(doc(db, 'waste_logs', item.id), {
        status: 'DISPOSED',
        disposalDate: todayDate,
        manifestNo: inputManifest.trim().toUpperCase() || 'FESTRONIK-RECORDED',
        transporter: inputVendor.trim() || 'Licensed Transporter'
      })
    } catch (err) {
      console.error(err)
      setDbError(lang === 'ID' ? 'Gagal memperbarui status manifest.' : 'Failed to update manifest status.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(lang === 'ID' ? 'Hapus catatan limbah B3 ini?' : 'Delete this hazardous waste record?')) return
    try {
      await deleteDoc(doc(db, 'waste_logs', id))
    } catch (err) {
      console.error(err)
    }
  }

  // Hitung sisa hari masa simpan di TPS B3
  const getStorageDeadlineInfo = (item: WasteRecord) => {
    if (item.status === 'DISPOSED') {
      return {
        label: lang === 'ID' ? `DIANGKUT (${item.disposalDate})` : `DISPOSED (${item.disposalDate})`,
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
      }
    }

    const start = new Date(item.logDate).getTime()
    const now = new Date().getTime()
    const elapsedDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
    const remainingDays = item.maxStorageDays - elapsedDays

    if (remainingDays < 0) {
      return {
        label: lang === 'ID' ? `LEWAT BATAS (${Math.abs(remainingDays)} HARI)` : `OVERDUE (${Math.abs(remainingDays)} DAYS)`,
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
      }
    }
    if (remainingDays <= 15) {
      return {
        label: lang === 'ID' ? `SISA ${remainingDays} HARI` : `${remainingDays} DAYS LEFT`,
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
      }
    }
    return {
      label: lang === 'ID' ? `SISA ${remainingDays} / ${item.maxStorageDays} HARI` : `${remainingDays} / ${item.maxStorageDays} DAYS LEFT`,
      badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400'
    }
  }

  const formatCategory = (code: WasteCategory) => {
    const map: Record<WasteCategory, string> = {
      B105d: lang === 'ID' ? 'B105d - Minyak Pelumas / Oli Bekas' : 'B105d - Used Lubricating Oil',
      B110d: lang === 'ID' ? 'B110d - Kain Majun & Sarung Tangan Terkontaminasi' : 'B110d - Contaminated Rags & Gloves',
      B104d: lang === 'ID' ? 'B104d - Kemasan Bekas B3 (Kaleng Cat/Tiner/Kimia)' : 'B104d - Empty Hazardous Containers',
      A102d: lang === 'ID' ? 'A102d - Aki / Baterai Bekas' : 'A102d - Used Lead-Acid Batteries',
      B107d: lang === 'ID' ? 'B107d - Limbah Elektronik (Lampu TL, PCB, Toner)' : 'B107d - E-Waste (Fluorescent, PCB, Toner)',
      'A338-1': lang === 'ID' ? 'A338-1 - Bahan Kimia / Pelarut Kadaluarsa' : 'A338-1 - Expired Chemicals / Solvents'
    }
    return map[code] || code
  }

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "PENGELOLAAN TPS B3 & WASTE LOG",
      subtitle: "Neraca keluar-masuk penyimpanan sementara Limbah B3 (TPS B3), masa simpan PP 22/2021, dan pelacakan manifest Festronik ISO 14001.",
      btn_print: "Cetak Neraca TPS B3",

      kpi_in_tps: "STOK TERSIMPAN DI TPS B3",
      kpi_expiring: "MENDEKATI BATAS SIMPAN (<=15 HARI)",
      kpi_disposed: "TOTAL DIANGKUT VENDOR",

      p1_title: "1. Input Pencatatan Masuk / Keluar TPS B3",
      p1_date: "Tanggal Masuk / Transaksi",
      p1_cat: "Kode & Jenis Limbah B3 (KLHK)",
      p1_source: "Unit / Area Penghasil Limbah *",
      p1_vol: "Jumlah / Berat *",
      p1_unit: "Satuan",
      p1_limit: "Batas Simpan Maksimal (PP 22/2021)",
      p1_status: "Status Penyimpanan",
      p1_manifest: "No. Manifest / Festronik",
      p1_vendor: "Vendor Transporter Berizin",
      btn_add: submitting ? "MENYIMPAN..." : "SIMPAN KE LOG TPS B3",

      p2_title: "2. Buku Catatan & Neraca Limbah TPS B3",
      all_stat: "SEMUA STATUS TPS",
      all_code: "SEMUA KODE LIMBAH",
      empty: "Belum ada catatan limbah di TPS B3.",
      loading: "Memuat neraca TPS B3...",

      th_id: "ID / TANGGAL",
      th_waste: "KODE LIMBAH & SUMBER",
      th_vol: "JUMLAH",
      th_deadline: "MASA SIMPAN / STATUS",
      th_manifest: "MANIFEST & VENDOR",
      th_action: "AKSI",
      btn_dispose: "ANGKUT",
      btn_del: "HAPUS",

      print_doc_type: "NERACA PENGELOLAAN LIMBAH B3 (TPS B3) • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      sign_hse: "Penanggung Jawab TPS B3 (Syspex HSE):",
      sign_vendor: "Diverifikasi Oleh (Manajemen / Transporter):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "TPS B3 STORAGE & ISO 14001 WASTE LOG",
      subtitle: "Hazardous waste temporary storage (TPS B3) balance log, statutory retention countdown, and Festronik manifest tracking.",
      btn_print: "Print TPS B3 Balance Sheet",

      kpi_in_tps: "ACTIVE ITEMS IN TPS B3",
      kpi_expiring: "APPROACHING RETENTION LIMIT",
      kpi_disposed: "DISPOSED VIA TRANSPORTER",

      p1_title: "1. Record Hazardous Waste In / Out (TPS B3)",
      p1_date: "Entry / Transaction Date",
      p1_cat: "Hazardous Waste Code & Type",
      p1_source: "Source Area / Department *",
      p1_vol: "Quantity / Weight *",
      p1_unit: "Unit",
      p1_limit: "Max Storage Retention Limit",
      p1_status: "Storage Status",
      p1_manifest: "Manifest / Festronik No.",
      p1_vendor: "Licensed Transporter Vendor",
      btn_add: submitting ? "SAVING..." : "RECORD TO TPS B3 LOG",

      p2_title: "2. TPS B3 Master Balance Logbook",
      all_stat: "ALL STORAGE STATUS",
      all_code: "ALL WASTE CODES",
      empty: "No hazardous waste records in TPS B3 yet.",
      loading: "Loading TPS B3 logbook...",

      th_id: "ID / DATE",
      th_waste: "WASTE CODE & SOURCE",
      th_vol: "QUANTITY",
      th_deadline: "RETENTION / STATUS",
      th_manifest: "MANIFEST & VENDOR",
      th_action: "ACTION",
      btn_dispose: "DISPOSE",
      btn_del: "DEL",

      print_doc_type: "HAZARDOUS WASTE TPS B3 BALANCE LOG • SYSPEX HSE",
      print_reg: "Registration No:",
      sign_hse: "TPS B3 Person In Charge (Syspex HSE):",
      sign_vendor: "Verified By (Management / Transporter):"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN

  const filteredLogs = logs.filter((item) => {
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus
    const matchCode = filterCode === 'ALL' || item.wasteCode === filterCode
    return matchStatus && matchCode
  })

  const inTpsCount = logs.filter((l) => l.status === 'IN_TPS').length
  const disposedCount = logs.filter((l) => l.status === 'DISPOSED').length
  const expiringCount = logs.filter((l) => {
    if (l.status !== 'IN_TPS') return false
    const elapsed = Math.floor((new Date().getTime() - new Date(l.logDate).getTime()) / (1000 * 60 * 60 * 24))
    return l.maxStorageDays - elapsed <= 15
  }).length

  if (!mounted) return null

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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">
              {t.title}
            </h1>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed max-w-3xl">
              {t.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={logs.length === 0}
            className="px-6 py-2.5 min-h-[44px] bg-slate-900 dark:bg-slate-100 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-slate-900 dark:hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">TPS B3 Hazardous Waste Log</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black font-mono text-black uppercase">TPS-B3-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px] print:hidden">
          {dbError}
        </div>
      )}

      {/* KPI TPS B3 SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 block">{t.kpi_in_tps}</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{inTpsCount} BATCH</span>
        </div>
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">{t.kpi_expiring}</span>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1 block">{expiringCount} BATCH</span>
        </div>
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">{t.kpi_disposed}</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{disposedCount} BATCH</span>
        </div>
      </div>

      {/* 1. FORMULIR INPUT TPS B3 (HIDE ON PRINT) */}
      <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddLog} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-cat`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_cat}</label>
            <select id={`${formId}-cat`} value={wasteCode} onChange={(e) => setWasteCode(e.target.value as WasteCategory)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
              <option value="B105d">{formatCategory('B105d')}</option>
              <option value="B110d">{formatCategory('B110d')}</option>
              <option value="B104d">{formatCategory('B104d')}</option>
              <option value="A102d">{formatCategory('A102d')}</option>
              <option value="B107d">{formatCategory('B107d')}</option>
              <option value="A338-1">{formatCategory('A338-1')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-source`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_source}</label>
            <input id={`${formId}-source`} required type="text" value={sourceArea} onChange={(e) => setSourceArea(e.target.value)} placeholder="e.g. Workshop Technical / Warehouse" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-vol`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_vol}</label>
            <input id={`${formId}-vol`} required type="number" min="0.1" step="any" value={volume} onChange={(e) => setVolume(e.target.value ? Number(e.target.value) : '')} placeholder="0" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-unit`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_unit}</label>
            <select id={`${formId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-600">
              <option value="Kg">Kg</option>
              <option value="Liters">Liters</option>
              <option value="Drum">Drum</option>
              <option value="Pcs">Pcs</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label htmlFor={`${formId}-date`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_date}</label>
            <input id={`${formId}-date`} type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor={`${formId}-limit`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_limit}</label>
            <select id={`${formId}-limit`} value={maxStorageDays} onChange={(e) => setMaxStorageDays(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
              <option value={90}>90 Hari (Kategori 1 / Timbulan &gt;= 50 kg/hari)</option>
              <option value={180}>180 Hari (Kategori 1 Timbulan &lt; 50 kg/hari)</option>
              <option value={365}>365 Hari (Kategori 2 Timbulan &lt; 50 kg/hari)</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label htmlFor={`${formId}-status`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_status}</label>
            <select id={`${formId}-status`} value={status} onChange={(e) => setStatus(e.target.value as StorageStatus)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
              <option value="IN_TPS">IN TPS B3 (Disimpan)</option>
              <option value="DISPOSED">DISPOSED (Diangkut)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button type="submit" disabled={!sourceArea.trim() || volume === '' || submitting} className="w-full py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>

          {status === 'DISPOSED' && (
            <>
              <div className="md:col-span-3">
                <label htmlFor={`${formId}-manifest`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_manifest}</label>
                <input id={`${formId}-manifest`} type="text" value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} placeholder="e.g. FESTRONIK-2026-0091" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-600" />
              </div>
              <div className="md:col-span-3">
                <label htmlFor={`${formId}-vendor`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.p1_vendor}</label>
                <input id={`${formId}-vendor`} type="text" value={transporter} onChange={(e) => setTransporter(e.target.value)} placeholder="Nama PT Pengangkut Limbah B3 Berizin" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
            </>
          )}
        </form>
      </div>

      {/* 2. TABEL NERACA LIMBAH TPS B3 */}
      <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:hidden transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {t.p2_title} ({filteredLogs.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <select aria-label={t.all_code} value={filterCode} onChange={(e) => setFilterCode(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-[10px] font-black uppercase text-slate-800 dark:text-slate-200">
              <option value="ALL">{t.all_code}</option>
              <option value="B105d">B105d (Oli Bekas)</option>
              <option value="B110d">B110d (Majun)</option>
              <option value="B104d">B104d (Kemasan B3)</option>
              <option value="A102d">A102d (Aki Bekas)</option>
              <option value="B107d">B107d (E-Waste)</option>
              <option value="A338-1">A338-1 (Bahan Kimia)</option>
            </select>
            <select aria-label={t.all_stat} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-[10px] font-black uppercase text-slate-800 dark:text-slate-200">
              <option value="ALL">{t.all_stat}</option>
              <option value="IN_TPS">IN TPS B3</option>
              <option value="DISPOSED">DISPOSED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-[4px]">
          <table className="w-full text-left text-xs min-w-[820px]">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-3">{t.th_id}</th>
                <th className="py-3 px-3">{t.th_waste}</th>
                <th className="py-3 px-3 text-center">{t.th_vol}</th>
                <th className="py-3 px-3 text-center">{t.th_deadline}</th>
                <th className="py-3 px-3">{t.th_manifest}</th>
                <th className="py-3 px-3 text-center">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
              {loadingDb ? (
                <tr><td colSpan={6} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-teal-600">{t.loading}</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{t.empty}</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const deadline = getStorageDeadlineInfo(log)
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-[10px] font-black text-slate-500">
                        {log.id} <br />
                        <span className="font-bold text-slate-900 dark:text-slate-300">{log.logDate}</span>
                      </td>
                      <td className="py-3 px-3 leading-relaxed">
                        <p className="font-black text-slate-900 dark:text-white uppercase">{formatCategory(log.wasteCode)}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase">{log.sourceArea}</p>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {log.volume} <span className="text-[9px] text-slate-500 uppercase">{log.unit}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-[2px] inline-block ${deadline.badgeClass}`}>
                          {deadline.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[10px]">
                        <p className="font-mono font-black text-slate-800 dark:text-slate-200">{log.manifestNo}</p>
                        <p className="font-bold text-slate-500 uppercase mt-0.5">{log.transporter}</p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {log.status === 'IN_TPS' && (
                            <button
                              type="button"
                              onClick={() => handleMarkDisposed(log)}
                              className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
                            >
                              {t.btn_dispose}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(log.id)}
                            className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-800 rounded-[2px] transition-colors"
                          >
                            {t.btn_del}
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
      </div>

      {/* DOKUMEN CETAK (PRINT) - NERACA TPS B3 */}
      <div className="hidden print:block w-full">
        <table className="w-full text-left text-[10px] border-2 border-black">
          <thead className="border-b-2 border-black font-black uppercase tracking-widest text-black bg-slate-200">
            <tr>
              <th className="py-2 px-2 w-24">{t.th_id}</th>
              <th className="py-2 px-2 border-l-2 border-black">{t.th_waste}</th>
              <th className="py-2 px-2 w-20 text-center border-l-2 border-black">{t.th_vol}</th>
              <th className="py-2 px-2 w-32 text-center border-l-2 border-black">{t.th_deadline}</th>
              <th className="py-2 px-2 border-l-2 border-black">{t.th_manifest}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black text-black font-bold">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-2 font-mono">
                  {log.id} <br /> {log.logDate}
                </td>
                <td className="py-2 px-2 uppercase border-l-2 border-black">
                  {formatCategory(log.wasteCode)} <br />
                  <span className="font-medium text-[9px]">{log.sourceArea}</span>
                </td>
                <td className="py-2 px-2 text-center border-l-2 border-black font-mono">
                  {log.volume} {log.unit}
                </td>
                <td className="py-2 px-2 text-center border-l-2 border-black uppercase">
                  {log.status === 'DISPOSED' ? `DISPOSED (${log.disposalDate})` : `IN TPS (MAX ${log.maxStorageDays}D)`}
                </td>
                <td className="py-2 px-2 uppercase border-l-2 border-black font-mono">
                  {log.manifestNo} <br />
                  <span className="font-sans text-[9px]">{log.transporter}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="grid grid-cols-2 gap-12 pt-10 mt-8 text-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-16">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-slate-100">
            <p className="text-[9px] font-black uppercase tracking-widest mb-16">{t.sign_vendor}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Authorized Person</p>
          </div>
        </div>
      </div>

    </div>
  )
}
