"use client"

import { useState, useId, useEffect, useRef } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

type ReportCategory = 'UNSAFE_CONDITION' | 'UNSAFE_ACT' | 'NEAR_MISS'
type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'OPEN' | 'ON_PROGRESS' | 'CLOSED'

interface HazardItem {
  id: string
  date: string
  time: string
  category: ReportCategory
  location: string
  description: string
  riskLevel: RiskLevel
  suggestedAction: string
  hseNotes?: string
  reporter: string
  photoDataUrl?: string
  status: Status
  createdAt?: number
}

export default function HazardReportPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isQrPublicMode, setIsQrPublicMode] = useState(false)
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState<string>('')
  const [todayDate, setTodayDate] = useState<string>('')
  const [publicReportUrl, setPublicReportUrl] = useState<string>('https://syspexms.vercel.app/hazard-report?mode=qr')
  const [hazards, setHazards] = useState<HazardItem[]>([])

  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL')

  const [newCategory, setNewCategory] = useState<ReportCategory>('UNSAFE_CONDITION')
  const [newLoc, setNewLoc] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newRisk, setNewRisk] = useState<RiskLevel>('MEDIUM')
  const [newAction, setNewAction] = useState('')
  const [newReporter, setNewReporter] = useState('')
  const [newPhoto, setNewPhoto] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<string>('')
  const [previewPhotoModal, setPreviewPhotoModal] = useState<string | null>(null)
  const [showQrModal, setShowQrModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTodayDate(new Date().toISOString().split('T')[0])
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsQrPublicMode(params.get('mode') === 'qr')
      setPublicReportUrl(`${window.location.origin}/hazard-report?mode=qr`)
    }

    // REAL-TIME LISTENER KE FIREBASE FIRESTORE
    const q = query(collection(db, 'hazard_reports'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: HazardItem[] = snapshot.docs.map(d => d.data() as HazardItem)
        setHazards(items)
        // Sinkronkan juga ke cache lokal untuk indikator KPI & Notifikasi Beranda
        localStorage.setItem('syspex_hazard_db', JSON.stringify(items))
        window.dispatchEvent(new Event('syspex_hse_sync'))
        setLoadingDb(false)
        setDbError('')
      },
      (err) => {
        console.error('Firestore error:', err)
        setLoadingDb(false)
        setDbError(
          lang === 'ID'
            ? 'Gagal terhubung ke Firebase Firestore. Pastikan Firestore Database sudah dibuat dalam Test Mode.'
            : 'Failed to connect to Firebase Firestore. Ensure Firestore Database is created in Test Mode.'
        )
      }
    )

    return () => unsubscribe()
  }, [lang])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewPhotoModal(null)
        setEditingNoteId(null)
        setShowQrModal(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('')
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 720
        const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          setNewPhoto(canvas.toDataURL('image/jpeg', 0.65))
        }
      }
      img.onerror = () => setPhotoError(lang === 'ID' ? 'Gagal memproses gambar.' : 'Failed to process image.')
      if (event.target?.result) img.src = event.target.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleAddHazard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLoc.trim() || !newDesc.trim() || submitting) return

    setSubmitting(true)
    setDbError('')

    try {
      const nowTime = new Date().toTimeString().slice(0, 5)
      const generatedId = `HZD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      const newItem: HazardItem = {
        id: generatedId,
        date: todayDate || new Date().toISOString().split('T')[0],
        time: nowTime,
        category: newCategory,
        location: newLoc.trim(),
        description: newDesc.trim(),
        riskLevel: newRisk,
        suggestedAction: newAction.trim() || (lang === 'ID' ? 'Menunggu peninjauan tim HSE' : 'Pending HSE review'),
        hseNotes: '',
        reporter: newReporter.trim() || 'Anonim',
        ...(newPhoto ? { photoDataUrl: newPhoto } : {}),
        status: 'OPEN',
        createdAt: Date.now()
      }

      await setDoc(doc(db, 'hazard_reports', generatedId), newItem)

      setNewLoc('')
      setNewDesc('')
      setNewAction('')
      setNewReporter('')
      setNewRisk('MEDIUM')
      setNewCategory('UNSAFE_CONDITION')
      setNewPhoto(null)
      setSubmittedTicket(generatedId)
    } catch (err) {
      console.error('Submit error:', err)
      setDbError(
        lang === 'ID'
          ? 'Gagal mengirim laporan ke server Firebase. Periksa koneksi internet Anda.'
          : 'Failed to send report to Firebase. Please check your internet connection.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyQrUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicReportUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    } catch {
      setCopiedLink(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'hazard_reports', id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleChangeStatus = async (id: string, newStatus: Status) => {
    try {
      await updateDoc(doc(db, 'hazard_reports', id), { status: newStatus })
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const startEditNote = (item: HazardItem) => {
    setEditingNoteId(item.id)
    setNoteDraft(item.hseNotes || '')
  }

  const saveHseNote = async (id: string) => {
    try {
      await updateDoc(doc(db, 'hazard_reports', id), { hseNotes: noteDraft.trim() })
      setEditingNoteId(null)
    } catch (err) {
      console.error('Note update error:', err)
    }
  }

  const dict = {
    ID: {
      breadcrumb: "Keselamatan Lapangan",
      title: "Hazard & Near-Miss Report",
      subtitle: "Portal pelaporan lapangan tersinkronisasi real-time dengan Firebase Cloud & Dasbor KPI.",
      btn_qr: "Poster QR Code",
      btn_print: "Cetak Log Pelaporan",
      
      p1_title: "1. Formulir Pelaporan Temuan Baru",
      p1_cat: "Kategori Temuan",
      cat_uc: "Unsafe Condition (Kondisi Tidak Aman)",
      cat_ua: "Unsafe Act (Tindakan Tidak Aman)",
      cat_nm: "Near-Miss (Hampir Celaka)",
      p1_loc: "Lokasi Penemuan",
      p1_loc_ph: "Contoh: Warehouse B / Area Mesin Press",
      p1_risk: "Tingkat Bahaya",
      p1_reporter: "Nama Anda / Dept",
      p1_reporter_ph: "Boleh dikosongkan (Anonim)",
      p1_photo: "Bukti Foto Lokasi",
      btn_capture: "Ambil Foto / Pilih Gambar",
      btn_retake: "Ganti Foto",
      btn_remove_photo: "Hapus",
      p1_desc: "Apa yang Anda temukan?",
      p1_desc_ph: "Jelaskan kondisi tidak aman atau kejadian hampir celaka...",
      p1_action: "Saran Perbaikan Awal (Opsional)",
      p1_action_ph: "Contoh: Sudah dipasang pembatas sementara...",
      btn_add: submitting ? "Mengirim..." : "Kirim Laporan",
      
      p2_title: "2. Register & Kontrol Tindak Lanjut HSE",
      th_id: "ID / Waktu",
      th_cat: "Kategori",
      th_photo: "Foto",
      th_loc_desc: "Lokasi & Deskripsi Temuan",
      th_risk: "Risiko",
      th_action: "Rencana & Progres Tindak Lanjut HSE",
      th_status: "Status CAPA",
      th_reporter: "Pelapor",
      th_manage: "Aksi",
      
      btn_delete: "Hapus",
      no_photo: "TANPA FOTO",
      view_photo: "LIHAT",
      add_note: "+ Catatan Progres HSE",
      save_note: "Simpan Catatan",

      print_doc_type: "DOKUMEN RESMI REGISTER PELAPORAN BAHAYA & NEAR-MISS • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      sign_hse: "Ditinjau & Disetujui (HSE Officer):",
      sign_mgr: "Mengetahui (Plant Manager):"
    },
    EN: {
      breadcrumb: "Field Safety",
      title: "Hazard & Near-Miss Report",
      subtitle: "Field reporting portal live-synced with Firebase Cloud & Executive KPI Dashboard.",
      btn_qr: "QR Code Poster",
      btn_print: "Print Hazard Log",
      
      p1_title: "1. New Field Finding Form",
      p1_cat: "Finding Category",
      cat_uc: "Unsafe Condition",
      cat_ua: "Unsafe Act",
      cat_nm: "Near-Miss (Close Call)",
      p1_loc: "Discovery Location",
      p1_loc_ph: "e.g. Warehouse B / Press Machine Area",
      p1_risk: "Severity Level",
      p1_reporter: "Your Name / Dept",
      p1_reporter_ph: "Optional (Anonymous)",
      p1_photo: "Location Photo Evidence",
      btn_capture: "Capture Photo / Upload",
      btn_retake: "Change Photo",
      btn_remove_photo: "Remove",
      p1_desc: "What did you observe?",
      p1_desc_ph: "Briefly describe the unsafe condition or close call...",
      p1_action: "Immediate Containment (Optional)",
      p1_action_ph: "e.g. Placed temporary safety cone...",
      btn_add: submitting ? "Submitting..." : "Submit Report",
      
      p2_title: "2. Hazard Register & HSE Follow-Up Control",
      th_id: "ID / Time",
      th_cat: "Category",
      th_photo: "Photo",
      th_loc_desc: "Location & Description",
      th_risk: "Risk",
      th_action: "CAPA & HSE Follow-Up Notes",
      th_status: "CAPA Status",
      th_reporter: "Reporter",
      th_manage: "Action",
      
      btn_delete: "Del",
      no_photo: "NO PHOTO",
      view_photo: "VIEW",
      add_note: "+ HSE Follow-Up Note",
      save_note: "Save Note",

      print_doc_type: "OFFICIAL HAZARD & NEAR-MISS REGISTER DOCUMENT • SYSPEX HSE",
      print_reg: "Registration No:",
      sign_hse: "Reviewed & Approved (HSE Officer):",
      sign_mgr: "Acknowledged By (Plant Manager):"
    }
  }

  const t = dict[lang]
  if (!mounted) return null

  // =========================================================================
  // TAMPILAN KHUSUS USER UMUM SAAT SCAN QR CODE (/hazard-report?mode=qr)
  // =========================================================================
  if (isQrPublicMode) {
    return (
      <div className="max-w-lg mx-auto w-full py-2 pb-12 space-y-5 animate-in fade-in duration-300">
        <div className="border-b-2 border-teal-600 pb-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
            SYSPEX HSE • ZERO HARM
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase mt-0.5">
            {lang === 'ID' ? 'Lapor Bahaya & Near-Miss' : 'Report Hazard & Near-Miss'}
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'ID'
              ? 'Laporkan kondisi tidak aman atau kejadian hampir celaka di area kerja Anda.'
              : 'Report unsafe conditions or close calls in your work area.'}
          </p>
        </div>

        {dbError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-400 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px]">
            {dbError}
          </div>
        )}

        {submittedTicket ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-[4px] p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg">
              OK
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {lang === 'ID' ? 'LAPORAN TERKIRIM KE SERVER HSE' : 'REPORT SENT TO HSE SERVER'}
              </p>
              <h2 className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {submittedTicket}
              </h2>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                {lang === 'ID'
                  ? 'Terima kasih telah menjaga keselamatan kerja. Laporan Anda sudah langsung diterima oleh tim HSE.'
                  : 'Thank you for keeping our workplace safe. Your report has been received by the HSE team.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmittedTicket('')}
              className="w-full py-3.5 min-h-[48px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[4px] text-xs font-black uppercase tracking-widest"
            >
              {lang === 'ID' ? 'Kirim Laporan Baru' : 'Submit Another Report'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddHazard} className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4 shadow-sm">
            <div>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.p1_cat} *
              </span>
              <div className="grid grid-cols-1 gap-2">
                {([
                  { val: 'UNSAFE_CONDITION', label: t.cat_uc },
                  { val: 'UNSAFE_ACT', label: t.cat_ua },
                  { val: 'NEAR_MISS', label: t.cat_nm }
                ] as const).map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setNewCategory(opt.val)}
                    className={`w-full text-left px-3.5 py-3 min-h-[44px] rounded-[4px] border-2 text-xs font-bold transition-colors ${
                      newCategory === opt.val
                        ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 text-teal-900 dark:text-teal-200'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-qr-loc`} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.p1_loc} *
              </label>
              <input
                id={`${formId}-qr-loc`}
                type="text"
                required
                placeholder={t.p1_loc_ph}
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                className="w-full px-3.5 py-3 min-h-[46px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-qr-desc`} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.p1_desc} *
              </label>
              <textarea
                id={`${formId}-qr-desc`}
                required
                rows={3}
                placeholder={t.p1_desc_ph}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.p1_photo}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
                aria-label={t.p1_photo}
              />
              {!newPhoto ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[52px] px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-600 rounded-[4px] text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
                >
                  <svg aria-hidden="true" className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.btn_capture}
                </button>
              ) : (
                <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-teal-600 rounded-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newPhoto} alt="Preview foto lokasi" className="w-full max-h-48 object-cover rounded-[2px]" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-2.5 min-h-[40px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase rounded-[2px]">
                      {t.btn_retake}
                    </button>
                    <button type="button" onClick={() => setNewPhoto(null)} className="px-4 py-2.5 min-h-[40px] border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase rounded-[2px]">
                      {t.btn_remove_photo}
                    </button>
                  </div>
                </div>
              )}
              {photoError && <p className="text-xs font-bold text-rose-600 mt-1">{photoError}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${formId}-qr-risk`} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.p1_risk}
                </label>
                <select
                  id={`${formId}-qr-risk`}
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value as RiskLevel)}
                  className="w-full px-3 py-3 min-h-[46px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="LOW">LOW (Rendah)</option>
                  <option value="MEDIUM">MEDIUM (Sedang)</option>
                  <option value="HIGH">HIGH (Tinggi)</option>
                  <option value="CRITICAL">CRITICAL (Kritis)</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-qr-rep`} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.p1_reporter}
                </label>
                <input
                  id={`${formId}-qr-rep`}
                  type="text"
                  placeholder={t.p1_reporter_ph}
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className="w-full px-3 py-3 min-h-[46px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-qr-act`} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.p1_action}
              </label>
              <input
                id={`${formId}-qr-act`}
                type="text"
                placeholder={t.p1_action_ph}
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                className="w-full px-3.5 py-3 min-h-[46px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!newLoc.trim() || !newDesc.trim() || submitting}
              className="w-full py-4 min-h-[50px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-xs font-black uppercase tracking-widest disabled:opacity-40 transition-colors shadow-sm"
            >
              {t.btn_add}
            </button>
          </form>
        )}
      </div>
    )
  }

  // =========================================================================
  // TAMPILAN ADMIN HSE LENGKAP (REAL-TIME FIRESTORE SYNC)
  // =========================================================================
  const openCount = hazards.filter(h => h.status === 'OPEN').length
  const progressCount = hazards.filter(h => h.status === 'ON_PROGRESS').length
  const closedCount = hazards.filter(h => h.status === 'CLOSED').length
  const closureRate = hazards.length > 0 ? Math.round((closedCount / hazards.length) * 100) : 100

  const displayedHazards = statusFilter === 'ALL' ? hazards : hazards.filter(h => h.status === statusFilter)
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(publicReportUrl)}`

  const getCategoryBadge = (cat: ReportCategory) => {
    if (cat === 'NEAR_MISS') {
      return {
        label: 'NEAR-MISS',
        cls: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800'
      }
    }
    if (cat === 'UNSAFE_ACT') {
      return {
        label: 'UNSAFE ACT',
        cls: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
      }
    }
    return {
      label: 'UNSAFE COND.',
      cls: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 w-full">
      
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
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm min-h-[44px] flex items-center gap-2"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              {t.btn_qr}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={hazards.length === 0}
              className="px-5 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 min-h-[44px]"
            >
              {t.btn_print}
            </button>
          </div>
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px] print:hidden">
          {dbError}
        </div>
      )}

      {/* HEADER CETAK DOKUMEN REGISTER */}
      {!showQrModal && (
        <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight">Hazard & Near-Miss Register</h1>
              <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
            </div>
            <div className="text-right border-2 border-black p-2">
              <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
              <span className="text-sm font-black text-black uppercase">HZL-{todayDate.replace(/-/g, '')}</span>
            </div>
          </div>
        </div>
      )}

      <div className={showQrModal ? 'print:hidden space-y-6' : 'space-y-6'}>
        {/* HIERARCHICAL CAPA STATUS SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 print:hidden">
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'OPEN' ? 'ALL' : 'OPEN')}
            className={`col-span-2 text-left p-4 rounded-[4px] border-2 transition-colors ${
              openCount > 0
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800'
                : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="block text-[9px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                OPEN (BUTUH TINDAKAN SEGERA)
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">KLIK FILTER</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">{openCount}</span>
              <span className="text-[10px] font-bold text-slate-500">TEMUAN BARU</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'ON_PROGRESS' ? 'ALL' : 'ON_PROGRESS')}
            className="text-left p-4 bg-white dark:bg-[#0b0f19] border-2 border-amber-200 dark:border-amber-900/60 rounded-[4px] hover:border-amber-400 transition-colors"
          >
            <span className="block text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">ON PROGRESS</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{progressCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'CLOSED' ? 'ALL' : 'CLOSED')}
            className="text-left p-4 bg-white dark:bg-[#0b0f19] border-2 border-emerald-200 dark:border-emerald-900/60 rounded-[4px] hover:border-emerald-400 transition-colors"
          >
            <span className="block text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">CLOSED</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{closedCount}</span>
          </button>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[4px]">
            <span className="block text-[8px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">CLOSURE RATE</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{closureRate}%</span>
          </div>
        </div>

        {submittedTicket && (
          <div role="status" className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 rounded-[4px] flex items-center justify-between gap-4 print:hidden">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              {lang === 'ID' ? `Laporan berhasil disimpan ke Cloud dengan Nomor Tiket ${submittedTicket}.` : `Report saved to Cloud under Ticket ${submittedTicket}.`}
            </span>
            <button type="button" onClick={() => setSubmittedTicket('')} aria-label="Tutup pesan sukses" className="text-xs font-black text-emerald-700 dark:text-emerald-300 px-2 py-1">[X]</button>
          </div>
        )}

        {/* 1. FORMULIR INPUT ADMIN */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 sm:p-6 space-y-4 print:hidden transition-colors">
          <h2 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
            {t.p1_title}
          </h2>
          <form onSubmit={handleAddHazard} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor={`${formId}-cat`} className="block text-[10px] font-bold text-teal-700 dark:text-teal-400 mb-1.5">{t.p1_cat} *</label>
              <select
                id={`${formId}-cat`}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                <option value="UNSAFE_CONDITION">{t.cat_uc}</option>
                <option value="UNSAFE_ACT">{t.cat_ua}</option>
                <option value="NEAR_MISS">{t.cat_nm}</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor={`${formId}-risk`} className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_risk}</label>
              <select id={`${formId}-risk`} value={newRisk} onChange={(e) => setNewRisk(e.target.value as RiskLevel)} className="w-full px-3 py-2.5 min-h-[44px] bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500">
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor={`${formId}-reporter`} className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_reporter}</label>
              <input id={`${formId}-reporter`} type="text" placeholder={t.p1_reporter_ph} value={newReporter} onChange={(e) => setNewReporter(e.target.value)} className="w-full px-3 py-2.5 min-h-[44px] bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor={`${formId}-loc`} className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_loc} *</label>
              <input id={`${formId}-loc`} type="text" required placeholder={t.p1_loc_ph} value={newLoc} onChange={(e) => setNewLoc(e.target.value)} className="w-full px-3 py-2.5 min-h-[44px] bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
            </div>

            <div className="md:col-span-2">
              <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_photo}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
                aria-label={t.p1_photo}
              />
              {!newPhoto ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[44px] px-4 py-2 bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg aria-hidden="true" className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.btn_capture}
                </button>
              ) : (
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-950 border border-teal-600/60 rounded-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newPhoto} alt="Preview temuan lapangan" width={56} height={44} className="w-14 h-11 object-cover rounded-[2px] border border-slate-300 dark:border-slate-700 shrink-0" />
                  <div className="flex-1 flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 min-h-[36px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[9px] font-black uppercase tracking-wider rounded-[2px]">
                      {t.btn_retake}
                    </button>
                    <button type="button" onClick={() => setNewPhoto(null)} className="px-3 py-2 min-h-[36px] border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-wider rounded-[2px]">
                      {t.btn_remove_photo}
                    </button>
                  </div>
                </div>
              )}
              {photoError && <p className="text-[10px] font-bold text-rose-600 mt-1">{photoError}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor={`${formId}-desc`} className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_desc} *</label>
              <textarea id={`${formId}-desc`} required rows={2} placeholder={t.p1_desc_ph} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor={`${formId}-action`} className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.p1_action}</label>
              <textarea id={`${formId}-action`} rows={2} placeholder={t.p1_action_ph} value={newAction} onChange={(e) => setNewAction(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none" />
            </div>
            
            <div className="md:col-span-4 flex justify-end">
              <button type="submit" disabled={!newLoc.trim() || !newDesc.trim() || submitting} className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition-colors">
                {t.btn_add}
              </button>
            </div>
          </form>
        </div>

        {/* 2. TABEL REGISTER BAHAYA & KONTROL HSE */}
        <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 print:border-none print:p-0 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 print:border-black">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
              {t.p2_title}
            </h2>
            
            <div className="flex flex-wrap gap-1.5 print:hidden">
              {(['ALL', 'OPEN', 'ON_PROGRESS', 'CLOSED'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-[2px] border transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 print:border-black rounded-[4px] print:rounded-none">
            <table className="w-full text-left text-xs min-w-[980px] print:min-w-0">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 print:bg-white print:border-black print:text-black transition-colors">
                <tr>
                  <th className="py-3 px-3 w-28">{t.th_id}</th>
                  <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_cat}</th>
                  <th className="py-3 px-3 w-20 text-center border-l-2 border-slate-200 dark:border-slate-800 print:hidden">{t.th_photo}</th>
                  <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_loc_desc}</th>
                  <th className="py-3 px-3 w-20 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_risk}</th>
                  <th className="py-3 px-3 w-1/3 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_action}</th>
                  <th className="py-3 px-3 w-36 text-center border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_status}</th>
                  <th className="py-3 px-3 w-24 border-l-2 border-slate-200 dark:border-slate-800 print:border-black">{t.th_reporter}</th>
                  <th className="py-3 px-3 text-center w-16 border-l-2 border-slate-200 dark:border-slate-800 print:hidden">{t.th_manage}</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-100 print:divide-black transition-colors">
                {loadingDb ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[10px] font-black uppercase tracking-wider text-teal-600">
                      {lang === 'ID' ? 'MENGHUBUNGKAN KE FIREBASE CLOUD...' : 'SYNCING WITH FIREBASE CLOUD...'}
                    </td>
                  </tr>
                ) : displayedHazards.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {lang === 'ID' ? 'BELUM ADA DATA TEMUAN DI FIREBASE' : 'NO HAZARD RECORDS IN FIREBASE YET'}
                    </td>
                  </tr>
                ) : (
                  displayedHazards.map((hz) => {
                    const catBadge = getCategoryBadge(hz.category)
                    return (
                      <tr key={hz.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-white align-top">
                        <td className="py-3 px-3 font-mono text-[9px] font-black text-slate-500 dark:text-slate-400 print:text-black">
                          {hz.id} <br/> <span className="font-bold">{hz.date} {hz.time}</span>
                        </td>
                        <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                          <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-wider inline-block border print:border-black print:bg-transparent print:text-black ${catBadge.cls}`}>
                            {catBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:hidden">
                          {hz.photoDataUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewPhotoModal(hz.photoDataUrl!)}
                              aria-label={`Lihat foto bukti ${hz.id}`}
                              className="group relative inline-block border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-hidden"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={hz.photoDataUrl} alt={`Bukti ${hz.location}`} width={48} height={36} className="w-12 h-9 object-cover" />
                              <span className="block bg-slate-900/80 text-white text-[7px] font-black tracking-wider py-0.5">{t.view_photo}</span>
                            </button>
                          ) : (
                            <span className="text-[8px] font-black text-slate-400 tracking-wider">{t.no_photo}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 leading-relaxed border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black print:text-[10px]">
                          <p className="font-black text-slate-900 dark:text-white print:text-black uppercase">{hz.location}</p>
                          <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 print:text-black mt-1">{hz.description}</p>
                        </td>
                        <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                          <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-wider inline-block print:border print:border-black print:bg-transparent print:text-black ${
                            hz.riskLevel === 'CRITICAL' ? 'bg-rose-900 text-rose-100' :
                            hz.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 dark:border dark:border-rose-900' :
                            hz.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 dark:border dark:border-amber-900' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border dark:border-emerald-900'
                          }`}>
                            {hz.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-[11px] leading-relaxed border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black space-y-2">
                          <p>{hz.suggestedAction}</p>
                          
                          {editingNoteId === hz.id ? (
                            <div className="pt-1 space-y-1.5 print:hidden">
                              <input
                                type="text"
                                aria-label="Catatan progres tindak lanjut HSE"
                                autoFocus
                                value={noteDraft}
                                onChange={e => setNoteDraft(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && saveHseNote(hz.id)}
                                placeholder="Tulis progres penanganan / PIC..."
                                className="w-full px-2 py-1 text-[10px] font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-teal-500 rounded-[2px]"
                              />
                              <div className="flex gap-1.5">
                                <button type="button" onClick={() => saveHseNote(hz.id)} className="px-2 py-1 bg-teal-700 text-white text-[8px] font-black uppercase tracking-wider rounded-[2px]">{t.save_note}</button>
                                <button type="button" onClick={() => setEditingNoteId(null)} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[8px] font-black uppercase tracking-wider rounded-[2px]">Batal</button>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                              {hz.hseNotes && (
                                <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400">
                                  HSE LOG: {hz.hseNotes}
                                </p>
                              )}
                              <button
                                type="button"
                                onClick={() => startEditNote(hz)}
                                className="mt-1 text-[9px] font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 print:hidden"
                              >
                                {hz.hseNotes ? 'Edit Catatan HSE' : t.add_note}
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                          <select
                            aria-label={`Ubah status CAPA untuk ${hz.id}`}
                            value={hz.status}
                            onChange={(e) => handleChangeStatus(hz.id, e.target.value as Status)}
                            className={`print:hidden w-full px-2 py-1.5 rounded-[2px] text-[8px] font-black uppercase tracking-wider border focus:outline-none ${
                              hz.status === 'OPEN'
                                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-400'
                                : hz.status === 'ON_PROGRESS'
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-400'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="ON_PROGRESS">ON PROGRESS</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                          <span className="hidden print:inline-block px-2 py-1 border border-black text-[8px] font-black uppercase">
                            {hz.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-[9px] uppercase border-l-2 border-slate-100 dark:border-slate-800/50 print:border-black">
                          {hz.reporter}
                        </td>
                        <td className="py-3 px-3 border-l-2 border-slate-100 dark:border-slate-800/50 print:hidden text-center">
                          <button type="button" aria-label={`Delete ${hz.id}`} onClick={() => handleDelete(hz.id)} className="w-full text-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-black px-1.5 py-1.5 text-[8px] uppercase tracking-wider border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/60 rounded-[2px] transition-colors">
                            {t.btn_delete}
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
              <p className="text-[10px] font-black mt-2 uppercase">Plant Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL LIGHTBOX FOTO BUKTI */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden" onClick={() => setPreviewPhotoModal(null)}>
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-700 p-3 rounded-[4px] max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">BUKTI FOTO LAPANGAN</span>
              <button type="button" onClick={() => setPreviewPhotoModal(null)} aria-label="Tutup foto" className="text-xs font-black text-slate-400 hover:text-rose-500 px-2 py-1">[X]</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewPhotoModal} alt="Bukti foto temuan" className="w-full max-h-[75vh] object-contain rounded-[2px]" />
          </div>
        </div>
      )}

      {/* MODAL POSTER QR CODE SIAP CETAK UNTUK LAPANGAN */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 print:static print:bg-white print:p-0" onClick={() => setShowQrModal(false)}>
          <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 print:border-black p-6 sm:p-8 rounded-[4px] print:rounded-none max-w-md w-full text-center space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-800 pb-3 print:hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">QR FIELD ACCESS</span>
              <button type="button" onClick={() => setShowQrModal(false)} aria-label="Tutup QR Poster" className="text-xs font-black text-slate-400 hover:text-rose-500 px-2 py-1">[X]</button>
            </div>

            <div className="border-2 border-slate-900 dark:border-slate-600 print:border-black p-5 bg-white text-black space-y-4">
              <div className="border-b-2 border-black pb-3">
                <p className="text-[10px] font-black uppercase tracking-widest">SYSPEX HSE • ZERO HARM</p>
                <h3 className="text-xl font-black uppercase tracking-tight mt-1">LAPOR BAHAYA &amp; NEAR-MISS</h3>
                <p className="text-[10px] font-bold mt-1">Scan QR Code dengan kamera HP untuk melaporkan kondisi tidak aman atau hampir celaka</p>
              </div>

              <div className="flex justify-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageSrc}
                  alt="QR Code Pelaporan Bahaya Syspex"
                  width={220}
                  height={220}
                  className="w-52 h-52 border-2 border-black p-1 bg-white"
                />
              </div>

              <div className="border-t-2 border-black pt-3">
                <p className="text-[9px] font-black uppercase tracking-wider">TANPA LOGIN • BISA LANGSUNG FOTO LOKASI</p>
                <p className="text-[9px] font-mono break-all mt-1 text-slate-700">{publicReportUrl}</p>
              </div>
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={handleCopyQrUrl}
                className="w-1/2 py-3 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {copiedLink ? 'LINK TERSALIN' : 'SALIN LINK QR'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-3 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                CETAK POSTER QR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
