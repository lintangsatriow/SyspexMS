"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

// TODO: Ganti URL di bawah ini dengan link embed YouTube Unlisted atau Google Drive Preview saat video sudah selesai dibuat
const INDUCTION_VIDEO_URL = ""

interface InductionTopic {
  id: string
  titleEn: string
  titleId: string
  descEn: string
  descId: string
  isChecked: boolean
}

interface InductionRecord {
  id: string
  inducteeName: string
  inducteeId: string
  company: string
  role: string
  acknowledged: boolean
  completedAt: string
  createdAt: number
}

export default function SafetyInductionPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)
  const [isQrMode, setIsQrMode] = useState(false)

  // Inductee Form States
  const [inducteeName, setInducteeName] = useState('')
  const [inducteeId, setInducteeId] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [videoWatched, setVideoWatched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<InductionRecord | null>(null)
  const [submitError, setSubmitError] = useState('')

  // Admin Register States
  const [records, setRecords] = useState<InductionRecord[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const [printRecord, setPrintRecord] = useState<InductionRecord | null>(null)

  // Induction Topics Checklist
  const [topics, setTopics] = useState<InductionTopic[]>([
    {
      id: 'top-1',
      titleId: 'Kebijakan K3L & Aturan Emas', titleEn: 'HSE Policy & Golden Rules',
      descId: 'Memahami kebijakan K3L perusahaan dan 6 aturan keselamatan inti yang tidak boleh dilanggar.', descEn: 'Understands company HSE policy and the 6 non-negotiable core safety rules.',
      isChecked: false
    },
    {
      id: 'top-2',
      titleId: 'Prosedur Evakuasi Darurat', titleEn: 'Emergency Evacuation Procedure',
      descId: 'Mengetahui rute evakuasi, lokasi titik kumpul (assembly point), dan alarm tanda bahaya.', descEn: 'Knows evacuation routes, assembly point locations, and emergency alarm signals.',
      isChecked: false
    },
    {
      id: 'top-3',
      titleId: 'Alat Pelindung Diri (APD)', titleEn: 'Personal Protective Equipment (PPE)',
      descId: 'Memahami persyaratan APD wajib (Helm, Sepatu Safety, Rompi) dan area penggunaannya.', descEn: 'Understands mandatory PPE requirements (Helmet, Safety Shoes, Vest) and designated areas.',
      isChecked: false
    },
    {
      id: 'top-4',
      titleId: 'Pelaporan Insiden & Bahaya', titleEn: 'Incident & Hazard Reporting',
      descId: 'Prosedur melaporkan kondisi tidak aman, nyaris celaka (near-miss), dan kecelakaan kerja.', descEn: 'Procedures for reporting unsafe conditions, near-misses, and workplace accidents.',
      isChecked: false
    },
    {
      id: 'top-5',
      titleId: 'Izin Kerja (Permit to Work)', titleEn: 'Permit to Work (PTW)',
      descId: 'Memahami bahwa pekerjaan risiko tinggi wajib memiliki dokumen PTW dan JSA yang disetujui.', descEn: 'Understands that high-risk tasks require approved PTW and JSA documents.',
      isChecked: false
    }
  ])

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const qrActive = params.get('mode') === 'qr'
      setIsQrMode(qrActive)
      setQrUrl(`${window.location.origin}/induction?mode=qr`)

      if (!qrActive) {
        const q = query(collection(db, 'induction_records'), orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(
          q,
          (snap) => {
            setRecords(snap.docs.map((d) => d.data() as InductionRecord))
            setLoadingDb(false)
            setDbError('')
          },
          (err) => {
            console.error(err)
            setLoadingDb(false)
            setDbError(lang === 'ID' ? 'Gagal memuat log induksi. Pastikan sesi Admin aktif.' : 'Failed to load induction logs. Ensure Admin session is active.')
          }
        )
        return () => unsub()
      } else {
        setLoadingDb(false)
      }
    }
  }, [lang])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowQrModal(false)
        setPrintRecord(null)
      }
    }
    const handleAfterPrint = () => {
      setPrintRecord(null)
    }
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [])

  const toggleTopic = (id: string) => {
    setTopics(topics.map((tp) => (tp.id === id ? { ...tp, isChecked: !tp.isChecked } : tp)))
  }

  const isAllChecked = topics.every((tp) => tp.isChecked)
  const isFormValid = Boolean(
    inducteeName.trim() &&
    inducteeId.trim() &&
    company.trim() &&
    role.trim() &&
    videoWatched &&
    isAllChecked
  )

  const handleSubmitInduction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || submitting) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const now = new Date()
      const docId = `IND-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`
      const payload: InductionRecord = {
        id: docId,
        inducteeName: inducteeName.trim(),
        inducteeId: inducteeId.trim().toUpperCase(),
        company: company.trim(),
        role: role.trim(),
        acknowledged: true,
        completedAt: now.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        createdAt: Date.now()
      }

      await setDoc(doc(db, 'induction_records', docId), payload)
      setSubmitSuccess(payload)
    } catch (err) {
      console.error(err)
      setSubmitError(
        lang === 'ID'
          ? 'Gagal menyimpan bukti induksi. Periksa koneksi internet Anda dan coba lagi.'
          : 'Failed to save induction record. Check your internet connection and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm(lang === 'ID' ? 'Hapus catatan induksi ini?' : 'Delete this induction record?')) return
    try {
      await deleteDoc(doc(db, 'induction_records', id))
    } catch (err) {
      console.error(err)
    }
  }

  const triggerPrintSingle = (rec: InductionRecord) => {
    setPrintRecord(rec)
    setTimeout(() => {
      window.print()
    }, 300)
  }

  const dict = {
    ID: {
      breadcrumb: "K3L & Operasional",
      title: "Safety Induction",
      subtitle: "Orientasi keselamatan mandiri via QR Code bagi karyawan baru, tamu, dan kontraktor sebelum memasuki area kerja.",
      btn_qr: "Poster QR Onboarding",
      btn_submit: submitting ? "MENYIMPAN..." : "KONFIRMASI & SELESAI INDUKSI",
      
      v_title: "1. Video Orientasi Keselamatan Kerja",
      v_placeholder_title: "VIDEO INDUKSI SEDANG DISIAPKAN OLEH TIM HSE",
      v_placeholder_desc: "Tonton seluruh penjelasan keselamatan di atas, lalu centang pernyataan di bawah sebelum melanjutkan.",
      v_ack_label: "Saya telah menonton dan menyimak materi video Safety Induction secara menyeluruh.",

      p1_title: "2. Identitas Peserta Induksi",
      p1_name: "Nama Lengkap *",
      p1_id: "NIK / No. Identitas (KTP/Badge) *",
      p1_company: "Departemen / Perusahaan *",
      p1_role: "Jabatan / Posisi *",
      
      p2_title: "3. Pernyataan Pemahaman Materi Wajib",
      
      success_title: "INDUKSI KESELAMATAN SELESAI",
      success_desc: "Data kehadiran dan pernyataan pemahaman Anda telah tercatat di sistem HSE Syspex. Tunjukkan bukti ini kepada HRD atau Petugas Security.",
      success_btn: "Isi Peserta Baru",

      reg_title: "Log Peserta Lulus Safety Induction",
      reg_search: "Cari nama, NIK, atau departemen...",
      reg_empty: "Belum ada catatan peserta induksi.",
      reg_loading: "Memuat data induksi...",
      th_reg: "NO. REGISTRASI",
      th_person: "PESERTA & IDENTITAS",
      th_org: "DEPT / JABATAN",
      th_time: "WAKTU SELESAI",
      th_action: "AKSI",

      qr_modal_title: "POSTER QR SELF-SERVICE SAFETY INDUCTION",
      qr_modal_desc: "Pindai kode QR ini menggunakan kamera ponsel untuk memulai video induksi karyawan baru / tamu.",
      qr_print: "Cetak Poster QR",
      qr_close: "Tutup",

      print_doc_type: "BERITA ACARA INDUKSI KESELAMATAN • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      print_statement: "Saya menyatakan bahwa saya telah menerima, menonton, memahami, dan menyetujui seluruh materi orientasi keselamatan (Safety Induction) yang disampaikan. Saya bersedia mematuhi semua peraturan K3L yang berlaku di area PT. Syspex Kemasindo.",
      sign_inductee: "Tanda Tangan Peserta",
      sign_hse: "Verifikasi (HSE / HRD Dept)"
    },
    EN: {
      breadcrumb: "HSE & Operations",
      title: "Safety Induction",
      subtitle: "Self-paced QR safety orientation for new employees, visitors, and contractors prior to site entry.",
      btn_qr: "Onboarding QR Poster",
      btn_submit: submitting ? "SAVING..." : "CONFIRM & COMPLETE INDUCTION",

      v_title: "1. Workplace Safety Orientation Video",
      v_placeholder_title: "INDUCTION VIDEO IS BEING PREPARED BY HSE TEAM",
      v_placeholder_desc: "Watch the complete safety orientation above, then check the confirmation box below to proceed.",
      v_ack_label: "I have watched and reviewed the complete Safety Induction video material.",

      p1_title: "2. Inductee Information",
      p1_name: "Full Name *",
      p1_id: "Employee ID / Identity No. *",
      p1_company: "Department / Company *",
      p1_role: "Position / Role *",
      
      p2_title: "3. Mandatory Topics Comprehension Checklist",

      success_title: "SAFETY INDUCTION COMPLETED",
      success_desc: "Your attendance and comprehension acknowledgment have been recorded in the Syspex HSE system. Show this confirmation to HR or Security.",
      success_btn: "Register Another Inductee",

      reg_title: "Completed Safety Induction Log",
      reg_search: "Search name, ID, or department...",
      reg_empty: "No safety induction records yet.",
      reg_loading: "Loading induction records...",
      th_reg: "REG NO.",
      th_person: "INDUCTEE & ID",
      th_org: "DEPT / ROLE",
      th_time: "COMPLETED AT",
      th_action: "ACTION",

      qr_modal_title: "SELF-SERVICE SAFETY INDUCTION QR POSTER",
      qr_modal_desc: "Scan this QR code with a mobile phone camera to start the new employee / visitor safety induction.",
      qr_print: "Print QR Poster",
      qr_close: "Close",

      print_doc_type: "OFFICIAL SAFETY INDUCTION RECORD • SYSPEX HSE",
      print_reg: "Registration No:",
      print_statement: "I declare that I have received, watched, understood, and agreed to all safety orientation (Safety Induction) materials provided. I am willing to comply with all HSE regulations applicable within the PT. Syspex Kemasindo area.",
      sign_inductee: "Inductee Signature",
      sign_hse: "Verified By (HSE / HR Dept)"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN

  if (!mounted) return null

  if (printRecord) {
    return (
      <div className="bg-white text-black p-8 min-h-screen">
        <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Safety Induction Record</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black font-mono text-black uppercase">{printRecord.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-2 border-black p-4 mb-6 text-xs">
          <div>
            <span className="block text-[9px] font-black uppercase text-slate-600">{t.p1_name}</span>
            <p className="font-black uppercase text-sm mt-0.5">{printRecord.inducteeName}</p>
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase text-slate-600">{t.p1_id}</span>
            <p className="font-black font-mono uppercase text-sm mt-0.5">{printRecord.inducteeId}</p>
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase text-slate-600">{t.p1_company}</span>
            <p className="font-bold uppercase text-sm mt-0.5">{printRecord.company}</p>
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase text-slate-600">{t.p1_role}</span>
            <p className="font-bold uppercase text-sm mt-0.5">{printRecord.role}</p>
          </div>
        </div>

        <div className="border-2 border-black divide-y-2 divide-black mb-6">
          {topics.map((topic) => (
            <div key={topic.id} className="p-3 flex items-start gap-3">
              <div className="w-4 h-4 border-2 border-black flex items-center justify-center mt-0.5 font-black text-[10px]">X</div>
              <div>
                <p className="text-xs font-black uppercase">{lang === 'ID' ? topic.titleId : topic.titleEn}</p>
                <p className="text-[10px] font-medium mt-0.5">{lang === 'ID' ? topic.descId : topic.descEn}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold text-black text-justify leading-relaxed mb-8 border-2 border-black p-4">
          {t.print_statement}
        </p>

        <div className="grid grid-cols-2 gap-12 text-center text-[10px] font-black uppercase tracking-widest text-black">
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[130px]">
            <p>{t.sign_inductee}</p>
            <div>
              <div className="w-full border-b-2 border-black mt-14"></div>
              <p className="mt-2">{printRecord.inducteeName}</p>
            </div>
          </div>
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[130px] bg-slate-100">
            <p>{t.sign_hse}</p>
            <div>
              <div className="w-full border-b-2 border-black mt-14"></div>
              <p className="mt-2">SYSPEX HSE / HRD ({printRecord.completedAt})</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim()
    return (
      !q ||
      r.inducteeName.toLowerCase().includes(q) ||
      r.inducteeId.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        {!isQrMode && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 block mb-1">
              SYSPEX HSE ONBOARDING
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">
              {t.title}
            </h1>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </div>
          {!isQrMode && (
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-5 py-2.5 min-h-[44px] bg-slate-900 dark:bg-slate-100 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-slate-900 dark:hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shrink-0"
            >
              {t.btn_qr}
            </button>
          )}
        </div>
      </div>

      {submitSuccess ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-600 rounded-[4px] p-6 sm:p-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-[10px] font-black font-mono uppercase tracking-widest rounded-[2px]">
            {submitSuccess.id}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase">
            {t.success_title}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            {t.success_desc}
          </p>
          <div className="p-4 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-md mx-auto text-left text-xs space-y-1">
            <p><span className="font-black uppercase text-slate-500">NAMA:</span> <span className="font-bold text-slate-900 dark:text-white">{submitSuccess.inducteeName}</span></p>
            <p><span className="font-black uppercase text-slate-500">ID / NIK:</span> <span className="font-mono font-bold text-slate-900 dark:text-white">{submitSuccess.inducteeId}</span></p>
            <p><span className="font-black uppercase text-slate-500">DEPT:</span> <span className="font-bold text-slate-900 dark:text-white">{submitSuccess.company} ({submitSuccess.role})</span></p>
            <p><span className="font-black uppercase text-slate-500">WAKTU:</span> <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{submitSuccess.completedAt}</span></p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(null)
                setInducteeName('')
                setInducteeId('')
                setCompany('')
                setRole('')
                setVideoWatched(false)
                setTopics(topics.map((tp) => ({ ...tp, isChecked: false })))
              }}
              className="px-6 py-3 min-h-[44px] bg-slate-900 dark:bg-slate-800 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors"
            >
              {t.success_btn}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitInduction} className="space-y-6 print:hidden">
          {submitError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px]">
              {submitError}
            </div>
          )}

          <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.v_title}
            </h2>

            {INDUCTION_VIDEO_URL ? (
              <div className="w-full aspect-video bg-black rounded-[4px] overflow-hidden border border-slate-300 dark:border-slate-700">
                <iframe
                  src={INDUCTION_VIDEO_URL}
                  title="Syspex Safety Induction Video"
                  width={1280}
                  height={720}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video max-h-72 bg-slate-100 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[4px] flex flex-col items-center justify-center p-6 text-center">
                <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-black font-mono uppercase tracking-widest rounded-[2px] mb-2">
                  VIDEO SLOT READY
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                  {t.v_placeholder_title}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  {t.v_placeholder_desc}
                </p>
              </div>
            )}

            <label
              htmlFor={`${formId}-video-ack`}
              className={`flex items-start gap-3 p-3.5 rounded-[4px] border-2 cursor-pointer transition-colors ${
                videoWatched
                  ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-600'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <input
                id={`${formId}-video-ack`}
                type="checkbox"
                checked={videoWatched}
                onChange={(e) => setVideoWatched(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-teal-600"
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {t.v_ack_label}
              </span>
            </label>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.p1_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-name`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  {t.p1_name}
                </label>
                <input
                  id={`${formId}-name`}
                  required
                  type="text"
                  value={inducteeName}
                  onChange={(e) => setInducteeName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-id`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  {t.p1_id}
                </label>
                <input
                  id={`${formId}-id`}
                  required
                  type="text"
                  value={inducteeId}
                  onChange={(e) => setInducteeId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-company`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  {t.p1_company}
                </label>
                <input
                  id={`${formId}-company`}
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-role`} className="block text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  {t.p1_role}
                </label>
                <input
                  id={`${formId}-role`}
                  required
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0b0f19] rounded-[4px] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.p2_title}
            </h2>
            
            <div className="space-y-2.5">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  role="checkbox"
                  aria-checked={topic.isChecked}
                  onClick={() => toggleTopic(topic.id)}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-[4px] border-2 transition-colors ${
                    topic.isChecked
                      ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-600'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-[2px] border-2 flex items-center justify-center transition-colors ${
                        topic.isChecked ? 'bg-teal-600 border-teal-600' : 'bg-transparent border-slate-400 dark:border-slate-600'
                      }`}
                    >
                      {topic.isChecked && (
                        <svg aria-hidden="true" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                      {lang === 'ID' ? topic.titleId : topic.titleEn}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {lang === 'ID' ? topic.descId : topic.descEn}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition disabled:opacity-40"
              >
                {t.btn_submit}
              </button>
            </div>
          </div>
        </form>
      )}

      {!isQrMode && (
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden print:hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {t.reg_title} ({records.length})
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.reg_search}
              className="w-full sm:w-64 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
            />
          </div>

          {dbError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {dbError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">{t.th_reg}</th>
                  <th className="py-3 px-4">{t.th_person}</th>
                  <th className="py-3 px-4">{t.th_org}</th>
                  <th className="py-3 px-4">{t.th_time}</th>
                  <th className="py-3 px-4 text-center">{t.th_action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
                {loadingDb ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-teal-600">
                      {t.reg_loading}
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.reg_empty}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-mono text-[10px] font-black text-teal-700 dark:text-teal-400">
                        {rec.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-black uppercase">{rec.inducteeName}</p>
                        <p className="text-[10px] font-mono text-slate-500">{rec.inducteeId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold uppercase">{rec.company}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{rec.role}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        {rec.completedAt}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerPrintSingle(rec)}
                            className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
                          >
                            PRINT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            aria-label="Hapus Catatan"
                            className="px-2 py-1.5 text-[9px] font-black text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-300 rounded-[2px] transition-colors"
                          >
                            [X]
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 print:static print:bg-white print:p-0">
          <div className="bg-white text-slate-900 border-4 border-slate-900 rounded-[4px] max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl print:border-black print:shadow-none">
            <div className="border-b-2 border-slate-900 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">SYSPEX HSE ONBOARDING</span>
              <h2 className="text-xl font-black uppercase mt-1">{t.qr_modal_title}</h2>
            </div>

            <div className="flex justify-center py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrUrl)}`}
                alt="QR Code Safety Induction"
                width={240}
                height={240}
                className="w-56 h-56 border-2 border-slate-900 p-2 bg-white"
              />
            </div>

            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              {t.qr_modal_desc}
            </p>

            <p className="text-[10px] font-mono bg-slate-100 p-2 border border-slate-300 break-all">
              {qrUrl}
            </p>

            <div className="flex gap-2 justify-center pt-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px]"
              >
                {t.qr_print}
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-5 py-2.5 min-h-[44px] bg-slate-200 hover:bg-slate-300 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-[4px]"
              >
                {t.qr_close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
