"use client"

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

interface SafetyRuleItem {
  id: string
  order: number
  titleID: string
  titleEN: string
  descID: string
  descEN: string
  doID: string
  doEN: string
  dontID: string
  dontEN: string
  ppe: string
  penaltyID: string
  penaltyEN: string
  relatedHref: string
  relatedLabelID: string
  relatedLabelEN: string
}

const DEFAULT_RULES: SafetyRuleItem[] = [
  {
    id: 'RULE-01',
    order: 1,
    titleID: 'ISOLASI ENERGI (LOTO)',
    titleEN: 'ENERGY ISOLATION (LOTO)',
    descID: 'Wajib memastikan status bebas energi (zero energy) dan memasang Lockout/Tagout pribadi sebelum memperbaiki mesin atau panel listrik.',
    descEN: 'Verify zero-energy state and apply personal Lockout/Tagout devices before servicing machinery or electrical panels.',
    doID: 'Matikan sumber utama, pasang gembok & label LOTO pribadi, serta uji coba tombol Start (Try-Out) sebelum bekerja.',
    doEN: 'Isolate main breaker, attach personal padlock & tag, and perform a Try-Out test before starting work.',
    dontID: 'Dilarang melepas gembok LOTO milik pekerja lain atau mengandalkan tombol Emergency Stop sebagai isolasi.',
    dontEN: 'Never remove another worker’s LOTO padlock or rely on an Emergency Stop button for energy isolation.',
    ppe: 'Electrical Gloves, Safety Glasses, Safety Shoes',
    penaltyID: 'PELANGGARAN: FATAL / SP-3',
    penaltyEN: 'PENALTY: FATAL / TERMINATION',
    relatedHref: '/document-control',
    relatedLabelID: 'Cek SOP LOTO',
    relatedLabelEN: 'Check LOTO SOP'
  },
  {
    id: 'RULE-02',
    order: 2,
    titleID: 'BEKERJA DI KETINGGIAN',
    titleEN: 'WORK AT HEIGHT',
    descID: 'Wajib menggunakan Full Body Harness (double lanyard 100% tie-off) dan memastikan Scaffolding ber-Tag Hijau saat bekerja di atas 1.8 meter.',
    descEN: 'Wear Full Body Harness (double lanyard 100% tie-off) and verify Green Tag Scaffolding when working above 1.8 meters.',
    doID: 'Periksa kondisi webbing harness, kaitkan hook di atas bahu (anchor point kuat), dan pastikan barikade area bawah terpasang.',
    doEN: 'Inspect harness webbing, anchor hooks above shoulder level, and barricade the drop zone below.',
    dontID: 'Dilarang naik ke scaffolding bertag merah/tanpa tag, atau berdiri di anak tangga paling atas.',
    dontEN: 'Never climb red-tagged/untagged scaffolding or stand on the top rung of a ladder.',
    ppe: 'Full Body Harness, Chin-Strap Helmet, Safety Shoes',
    penaltyID: 'PELANGGARAN: FATAL / SP-3',
    penaltyEN: 'PENALTY: FATAL / TERMINATION',
    relatedHref: '/sio-silo',
    relatedLabelID: 'Cek Lisensi Ketinggian',
    relatedLabelEN: 'Check Height License'
  },
  {
    id: 'RULE-03',
    order: 3,
    titleID: 'PENGANGKATAN AMAN (LIFTING)',
    titleEN: 'SAFE LIFTING & RIGGING',
    descID: 'Dilarang keras melintas atau berdiri di bawah beban yang sedang diangkat (suspended load) oleh Crane, Hoist, maupun Forklift.',
    descEN: 'Strictly prohibited from walking or standing under suspended loads lifted by cranes, hoists, or forklifts.',
    doID: 'Gunakan tali pemandu (tag line), pastikan beban sesuai kapasitas SWL alat angkat, dan ikuti aba-aba Rigger bersertifikat.',
    doEN: 'Use tag lines to guide loads, verify load weight within SWL limits, and follow certified Rigger signals.',
    dontID: 'Dilarang menahan beban berayun langsung dengan tangan kosong atau menggunakan sling yang rusak/berkarat.',
    dontEN: 'Never stabilize swinging loads with bare hands or use damaged/frayed lifting slings.',
    ppe: 'Safety Helmet, Leather Rigging Gloves, Safety Shoes',
    penaltyID: 'PELANGGARAN: FATAL / SP-3',
    penaltyEN: 'PENALTY: FATAL / TERMINATION',
    relatedHref: '/lifting-plan',
    relatedLabelID: 'Buka Kalkulator Lifting',
    relatedLabelEN: 'Open Lifting Calculator'
  },
  {
    id: 'RULE-04',
    order: 4,
    titleID: 'ALAT BERAT & FORKLIFT (MHE)',
    titleEN: 'MOBILE EQUIPMENT & FORKLIFT',
    descID: 'Pejalan kaki wajib menggunakan jalur hijau khusus. Jaga jarak aman minimal 3 meter dari Forklift atau alat angkut yang beroperasi.',
    descEN: 'Pedestrians must stay within designated green walkways and maintain at least 3 meters clearance from operating MHE.',
    doID: 'Lakukan kontak mata dengan operator sebelum melintas, bunyikan klakson di persimpangan, dan pakai rompi pantul (Hi-Vis).',
    doEN: 'Establish eye contact with operators before crossing, sound horn at blind corners, and wear Hi-Vis vests.',
    dontID: 'Dilarang mengoperasikan Forklift tanpa SIO aktif, mengebut di dalam gudang, atau menumpang di garpu forklift.',
    dontEN: 'Never operate forklifts without valid SIO license, speed indoors, or ride on forklift forks.',
    ppe: 'High-Visibility Vest, Safety Shoes',
    penaltyID: 'PELANGGARAN: TINGGI / SP-2',
    penaltyEN: 'PENALTY: HIGH / WARNING',
    relatedHref: '/sio-silo',
    relatedLabelID: 'Verifikasi SIO Operator',
    relatedLabelEN: 'Verify Operator SIO'
  },
  {
    id: 'RULE-05',
    order: 5,
    titleID: 'IZIN KERJA (PERMIT TO WORK)',
    titleEN: 'PERMIT TO WORK (PTW)',
    descID: 'Pekerjaan risiko tinggi (Hot Work, Ruang Terbatas, Ketinggian, Kelistrikan) tidak boleh dimulai tanpa Izin Kerja & JSA yang disetujui HSE.',
    descEN: 'High-risk tasks (Hot Work, Confined Space, Height, Electrical) must not begin without an approved PTW & JSA.',
    doID: 'Lakukan Toolbox Talk (TBM) sebelum mulai, siapkan APAR di lokasi kerja panas, dan tutup izin kerja setelah selesai.',
    doEN: 'Conduct pre-task Toolbox Talk (TBM), stage fire extinguishers for hot work, and close PTW upon completion.',
    dontID: 'Dilarang melanjutkan pekerjaan jika kondisi lapangan berubah atau masa berlaku izin kerja telah habis.',
    dontEN: 'Never continue work if site conditions change or the work permit has expired.',
    ppe: 'Task-Specific PPE (Welding Shield / Apron / Respirator)',
    penaltyID: 'PELANGGARAN: FATAL / SP-3',
    penaltyEN: 'PENALTY: FATAL / TERMINATION',
    relatedHref: '/safety-talk',
    relatedLabelID: 'Buka Materi TBM',
    relatedLabelEN: 'Open TBM Library'
  },
  {
    id: 'RULE-06',
    order: 6,
    titleID: 'FIT TO WORK & BEBAS ZAT TERLARANG',
    titleEN: 'FIT TO WORK & ZERO SUBSTANCE',
    descID: 'Nol toleransi terhadap konsumsi alkohol, narkotika, atau bekerja dalam kondisi kelelahan ekstrem dan gangguan kesehatan akut.',
    descEN: 'Zero tolerance for alcohol, illegal drugs, or working under extreme fatigue or acute medical impairment.',
    doID: 'Laporkan kondisi kesehatan atau konsumsi obat yang menyebabkan kantuk kepada Supervisor sebelum shift dimulai.',
    doEN: 'Report any illness or drowsy medication to your Supervisor prior to starting your shift.',
    dontID: 'Dilarang membawa atau mengonsumsi minuman beralkohol maupun obat terlarang di seluruh area operasional Syspex.',
    dontEN: 'Never bring or consume alcohol or illegal substances anywhere within Syspex operational premises.',
    ppe: 'Standard Mandatory Site PPE',
    penaltyID: 'PELANGGARAN: FATAL / PENGUSIRAN',
    penaltyEN: 'PENALTY: FATAL / SITE EXPULSION',
    relatedHref: '/hazard-report',
    relatedLabelID: 'Lapor Kondisi Tidak Aman',
    relatedLabelEN: 'Report Unsafe Condition'
  }
]

export default function SyspexSafetyRulesPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)
  const [todayDate, setTodayDate] = useState<string>('')

  // DB States
  const [dbRules, setDbRules] = useState<SafetyRuleItem[]>([])
  const [isSyncedWithDb, setIsSyncedWithDb] = useState(false)
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Print Mode State ('AGREEMENT' | 'POSTER')
  const [printMode, setPrintMode] = useState<'AGREEMENT' | 'POSTER'>('AGREEMENT')

  // Form Modal States
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [order, setOrder] = useState<number>(7)
  const [titleID, setTitleID] = useState('')
  const [titleEN, setTitleEN] = useState('')
  const [descID, setDescID] = useState('')
  const [descEN, setDescEN] = useState('')
  const [doID, setDoID] = useState('')
  const [doEN, setDoEN] = useState('')
  const [dontID, setDontID] = useState('')
  const [dontEN, setDontEN] = useState('')
  const [ppe, setPpe] = useState('Safety Helmet, Safety Shoes, Safety Glasses')
  const [penaltyID, setPenaltyID] = useState('PELANGGARAN: FATAL / SP-3')
  const [penaltyEN, setPenaltyEN] = useState('PENALTY: FATAL / TERMINATION')
  const [relatedHref, setRelatedHref] = useState('/hazard-report')
  const [relatedLabelID, setRelatedLabelID] = useState('Lapor Pelanggaran')
  const [relatedLabelEN, setRelatedLabelEN] = useState('Report Violation')

  useEffect(() => {
    setMounted(true)
    setTodayDate(new Date().toISOString().split('T')[0])

    const q = query(collection(db, 'safety_rules'), orderBy('order', 'asc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setDbRules(snap.docs.map((d) => d.data() as SafetyRuleItem))
          setIsSyncedWithDb(true)
        } else {
          setDbRules(DEFAULT_RULES)
          setIsSyncedWithDb(false)
        }
        setLoadingDb(false)
        setDbError('')
      },
      (err) => {
        console.error(err)
        setDbRules(DEFAULT_RULES)
        setIsSyncedWithDb(false)
        setLoadingDb(false)
      }
    )

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetForm()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      unsub()
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const activeRules = dbRules.length > 0 ? dbRules : DEFAULT_RULES

  const handleSeedDefaultRules = async () => {
    if (submitting) return
    setSubmitting(true)
    setDbError('')
    try {
      for (const r of DEFAULT_RULES) {
        await setDoc(doc(db, 'safety_rules', r.id), r)
      }
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menyinkronkan ke database. Pastikan Anda login sebagai Admin & Rules Firestore sudah di-publish.'
          : 'Failed to sync to database. Ensure you are logged in as Admin & Firestore Rules are published.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setOrder(activeRules.length + 1)
    setTitleID('')
    setTitleEN('')
    setDescID('')
    setDescEN('')
    setDoID('')
    setDoEN('')
    setDontID('')
    setDontEN('')
    setPpe('Safety Helmet, Safety Shoes, Safety Glasses')
    setPenaltyID('PELANGGARAN: FATAL / SP-3')
    setPenaltyEN('PENALTY: FATAL / TERMINATION')
    setRelatedHref('/hazard-report')
    setRelatedLabelID('Lapor Pelanggaran')
    setRelatedLabelEN('Report Violation')
  }

  const handleEditClick = (r: SafetyRuleItem) => {
    setEditingId(r.id)
    setOrder(r.order)
    setTitleID(r.titleID)
    setTitleEN(r.titleEN)
    setDescID(r.descID)
    setDescEN(r.descEN)
    setDoID(r.doID)
    setDoEN(r.doEN)
    setDontID(r.dontID)
    setDontEN(r.dontEN)
    setPpe(r.ppe)
    setPenaltyID(r.penaltyID)
    setPenaltyEN(r.penaltyEN)
    setRelatedHref(r.relatedHref || '/hazard-report')
    setRelatedLabelID(r.relatedLabelID || 'Lapor Pelanggaran')
    setRelatedLabelEN(r.relatedLabelEN || 'Report Violation')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleID.trim() || !descID.trim() || submitting) return
    setSubmitting(true)
    setDbError('')

    try {
      // Seed default rules first if not synced
      if (!isSyncedWithDb) {
        for (const base of DEFAULT_RULES) {
          await setDoc(doc(db, 'safety_rules', base.id), base)
        }
      }

      const ruleId = editingId || `RULE-${Date.now().toString().slice(-5)}`
      const payload: SafetyRuleItem = {
        id: ruleId,
        order: Number(order) || activeRules.length + 1,
        titleID: titleID.trim().toUpperCase(),
        titleEN: (titleEN.trim() || titleID.trim()).toUpperCase(),
        descID: descID.trim(),
        descEN: descEN.trim() || descID.trim(),
        doID: doID.trim(),
        doEN: doEN.trim() || doID.trim(),
        dontID: dontID.trim(),
        dontEN: dontEN.trim() || dontID.trim(),
        ppe: ppe.trim() || 'Mandatory Site PPE',
        penaltyID: penaltyID.trim().toUpperCase(),
        penaltyEN: (penaltyEN.trim() || penaltyID.trim()).toUpperCase(),
        relatedHref,
        relatedLabelID: relatedLabelID.trim() || 'Lapor Pelanggaran',
        relatedLabelEN: relatedLabelEN.trim() || 'Report Violation'
      }

      await setDoc(doc(db, 'safety_rules', ruleId), payload)
      resetForm()
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menyimpan aturan keselamatan. Akses khusus Admin.'
          : 'Failed to save safety rule. Admin access required.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (!isSyncedWithDb) return
    if (!window.confirm(lang === 'ID' ? 'Hapus aturan keselamatan ini?' : 'Delete this safety rule?')) return
    try {
      await deleteDoc(doc(db, 'safety_rules', id))
    } catch (err) {
      console.error(err)
      setDbError(lang === 'ID' ? 'Gagal menghapus aturan. Akses khusus Admin.' : 'Failed to delete rule. Admin access required.')
    }
  }

  const triggerPrint = (mode: 'AGREEMENT' | 'POSTER') => {
    setPrintMode(mode)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const dict = {
    ID: {
      breadcrumb: "K3L & Operasional",
      title: "SYSPEX SAFETY RULES",
      subtitle: `${activeRules.length} Aturan Keselamatan Tak Boleh Dilanggar (Life-Saving Golden Rules). Pelanggaran terhadap aturan ini berakibat pada sanksi tegas hingga pemutusan hubungan kerja.`,
      btn_print_agr: "Cetak Lembar Kepatuhan",
      btn_print_poster: "Cetak Poster Area Kerja",
      btn_add: showForm ? "Tutup Form" : "+ Tambah / Kelola Aturan",
      btn_sync: submitting ? "Menyinkronkan..." : "Aktifkan Mode Edit Database",
      sync_hint: "Saat ini menampilkan 6 Golden Rules bawaan. Klik tombol di kanan jika Admin ingin mengedit atau menambah aturan ke Firestore.",

      do_lbl: "WAJIB DILAKUKAN (DOs)",
      dont_lbl: "DILARANG KERAS (DON'Ts)",
      ppe_lbl: "APD WAJIB",
      btn_report: "Lapor Pelanggaran",

      form_title: editingId ? "PERBARUI ATURAN KESELAMATAN" : "TAMBAH ATURAN KESELAMATAN BARU",
      f_order: "No. Urut",
      f_title_id: "Judul Aturan (ID) *",
      f_title_en: "Judul Aturan (EN)",
      f_desc_id: "Deskripsi Utama (ID) *",
      f_desc_en: "Deskripsi Utama (EN)",
      f_do_id: "Wajib Dilakukan / DOs (ID)",
      f_do_en: "Wajib Dilakukan / DOs (EN)",
      f_dont_id: "Dilarang Keras / DON'Ts (ID)",
      f_dont_en: "Dilarang Keras / DON'Ts (EN)",
      f_ppe: "APD Wajib",
      f_pen_id: "Sanksi Pelanggaran (ID)",
      f_pen_en: "Sanksi Pelanggaran (EN)",
      f_link: "Pintasan Modul Terkait",
      btn_save: submitting ? "MENYIMPAN..." : "SIMPAN ATURAN",
      btn_cancel: "BATAL",

      print_doc_type: printMode === 'AGREEMENT' ? "SURAT PERNYATAAN KEPATUHAN K3L • SYSPEX HSE" : "POSTER STANDAR KESELAMATAN KERJA • SYSPEX HSE",
      print_reg: "Kode Dokumen:",
      print_statement: `Saya yang bertanda tangan di bawah ini menyatakan telah membaca, memahami, dan siap mematuhi ${activeRules.length} Aturan Keselamatan (Syspex Safety Rules). Saya memahami bahwa pelanggaran terhadap aturan ini dapat mengakibatkan sanksi tegas hingga pemutusan hubungan kerja.`,
      form_name: "Nama Lengkap:",
      form_company: "Perusahaan / Dept:",
      form_date: "Tanggal:",
      sign_worker: "Tanda Tangan Pekerja",
      sign_hse: "Verifikasi HSE Dept"
    },
    EN: {
      breadcrumb: "HSE & Operations",
      title: "SYSPEX SAFETY RULES",
      subtitle: `${activeRules.length} Non-Negotiable Life-Saving Golden Rules. Violation of these rules will result in immediate disciplinary action or site expulsion.`,
      btn_print_agr: "Print Compliance Agreement",
      btn_print_poster: "Print Workshop Poster",
      btn_add: showForm ? "Close Form" : "+ Add / Manage Rules",
      btn_sync: submitting ? "Syncing..." : "Enable Database Edit Mode",
      sync_hint: "Currently displaying 6 built-in Golden Rules. Click the button on the right to sync and enable Admin editing in Firestore.",

      do_lbl: "MANDATORY ACTIONS (DOs)",
      dont_lbl: "STRICTLY PROHIBITED (DON'Ts)",
      ppe_lbl: "MANDATORY PPE",
      btn_report: "Report Violation",

      form_title: editingId ? "UPDATE SAFETY RULE" : "ADD NEW SAFETY RULE",
      f_order: "Order No.",
      f_title_id: "Rule Title (ID) *",
      f_title_en: "Rule Title (EN)",
      f_desc_id: "Core Description (ID) *",
      f_desc_en: "Core Description (EN)",
      f_do_id: "Mandatory DOs (ID)",
      f_do_en: "Mandatory DOs (EN)",
      f_dont_id: "Prohibited DON'Ts (ID)",
      f_dont_en: "Prohibited DON'Ts (EN)",
      f_ppe: "Mandatory PPE",
      f_pen_id: "Violation Penalty (ID)",
      f_pen_en: "Violation Penalty (EN)",
      f_link: "Related Module Shortcut",
      btn_save: submitting ? "SAVING..." : "SAVE RULE",
      btn_cancel: "CANCEL",

      print_doc_type: printMode === 'AGREEMENT' ? "HSE COMPLIANCE AGREEMENT • SYSPEX HSE" : "WORKPLACE LIFE-SAVING RULES POSTER • SYSPEX HSE",
      print_reg: "Document Code:",
      print_statement: `I, the undersigned, declare that I have read, understood, and am ready to comply with the ${activeRules.length} Safety Rules of PT. Syspex Kemasindo. I understand that violating these rules may result in severe disciplinary action, including termination.`,
      form_name: "Full Name:",
      form_company: "Company / Dept:",
      form_date: "Date:",
      sign_worker: "Worker Signature",
      sign_hse: "HSE Dept Verification"
    }
  }

  const t = dict[lang as keyof typeof dict] || dict.EN

  const icons = [
    <path key={1} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    <path key={2} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    <path key={3} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />,
    <path key={4} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-2" />,
    <path key={5} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    <path key={6} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ]

  if (!mounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-[1400px] mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 tracking-tight uppercase transition-colors">
              {t.title}
            </h1>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed max-w-3xl">
              {t.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => triggerPrint('POSTER')}
              className="px-4 py-2.5 min-h-[44px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition"
            >
              {t.btn_print_poster}
            </button>
            <button
              type="button"
              onClick={() => triggerPrint('AGREEMENT')}
              className="px-4 py-2.5 min-h-[44px] bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition"
            >
              {t.btn_print_agr}
            </button>
            <button
              type="button"
              onClick={() => {
                if (showForm) resetForm()
                else {
                  setOrder(activeRules.length + 1)
                  setShowForm(true)
                }
              }}
              className="px-4 py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition"
            >
              {t.btn_add}
            </button>
          </div>
        </div>
      </div>

      {/* BANNER SYNC DATABASE (JIKA MASIH PAKAI BAWAAN LOKAL) */}
      {!loadingDb && !isSyncedWithDb && (
        <div className="bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {t.sync_hint}
          </p>
          <button
            type="button"
            onClick={handleSeedDefaultRules}
            disabled={submitting}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-[4px] shrink-0 disabled:opacity-50"
          >
            {t.btn_sync}
          </button>
        </div>
      )}

      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px] print:hidden">
          {dbError}
        </div>
      )}

      {/* FORM TAMBAH / EDIT ATURAN (ADMIN) */}
      {showForm && (
        <form
          onSubmit={handleSaveRule}
          className="bg-white dark:bg-[#0b0f19] border-2 border-teal-600 rounded-[4px] p-5 sm:p-6 space-y-4 print:hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
              {t.form_title}
            </h2>
            <button type="button" onClick={resetForm} className="text-xs font-black text-slate-400 hover:text-rose-600 px-2 py-1">
              [X]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor={`${formId}-order`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_order}
              </label>
              <input
                id={`${formId}-order`}
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-tid`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                  {t.f_title_id}
                </label>
                <input
                  id={`${formId}-tid`}
                  required
                  type="text"
                  value={titleID}
                  onChange={(e) => setTitleID(e.target.value)}
                  placeholder="e.g. KEAMANAN KELISTRIKAN"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-ten`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                  {t.f_title_en}
                </label>
                <input
                  id={`${formId}-ten`}
                  type="text"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                  placeholder="e.g. ELECTRICAL SAFETY"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-did`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_desc_id}
              </label>
              <textarea
                id={`${formId}-did`}
                required
                rows={2}
                value={descID}
                onChange={(e) => setDescID(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-den`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_desc_en}
              </label>
              <textarea
                id={`${formId}-den`}
                rows={2}
                value={descEN}
                onChange={(e) => setDescEN(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-doid`} className="block text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1.5">
                {t.f_do_id}
              </label>
              <input
                id={`${formId}-doid`}
                type="text"
                value={doID}
                onChange={(e) => setDoID(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-dontid`} className="block text-[9px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-1.5">
                {t.f_dont_id}
              </label>
              <input
                id={`${formId}-dontid`}
                type="text"
                value={dontID}
                onChange={(e) => setDontID(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-ppe`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_ppe}
              </label>
              <input
                id={`${formId}-ppe`}
                type="text"
                value={ppe}
                onChange={(e) => setPpe(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-penid`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_pen_id}
              </label>
              <input
                id={`${formId}-penid`}
                type="text"
                value={penaltyID}
                onChange={(e) => setPenaltyID(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-penen`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_pen_en}
              </label>
              <input
                id={`${formId}-penen`}
                type="text"
                value={penaltyEN}
                onChange={(e) => setPenaltyEN(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-link`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_link}
              </label>
              <select
                id={`${formId}-link`}
                value={relatedHref}
                onChange={(e) => setRelatedHref(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="/hazard-report">/hazard-report (Pelaporan Bahaya)</option>
                <option value="/lifting-plan">/lifting-plan (Kalkulator Lifting)</option>
                <option value="/sio-silo">/sio-silo (Lisensi K3 & Riksa Uji)</option>
                <option value="/safety-talk">/safety-talk (Toolbox Talk TBM)</option>
                <option value="/document-control">/document-control (SOP Master)</option>
                <option value="/env-log">/env-log (Pengelolaan TPS B3)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 min-h-[44px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-[4px]">
              {t.btn_cancel}
            </button>
            <button type="submit" disabled={!titleID.trim() || !descID.trim() || submitting} className="px-6 py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] disabled:opacity-40">
              {t.btn_save}
            </button>
          </div>
        </form>
      )}

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black font-mono text-black uppercase">
              {printMode === 'AGREEMENT' ? `AGR-HSE-${todayDate.replace(/-/g, '')}` : `PST-HSE-${todayDate.replace(/-/g, '')}`}
            </span>
          </div>
        </div>
      </div>

      {/* SAFETY RULES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:gap-4 print:grid-cols-2">
        {activeRules.map((rule, idx) => {
          const title = lang === 'ID' ? rule.titleID : rule.titleEN
          const desc = lang === 'ID' ? rule.descID : rule.descEN
          const doText = lang === 'ID' ? rule.doID : rule.doEN
          const dontText = lang === 'ID' ? rule.dontID : rule.dontEN
          const penalty = lang === 'ID' ? rule.penaltyID : rule.penaltyEN
          const relLabel = lang === 'ID' ? rule.relatedLabelID : rule.relatedLabelEN

          return (
            <div
              key={rule.id}
              className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-[4px] flex flex-col justify-between transition-colors print:border-black print:bg-transparent print:p-4 print:break-inside-avoid"
            >
              <div>
                <div className="flex justify-between items-start mb-4 print:mb-2">
                  <div className="text-rose-600 dark:text-rose-500 print:text-black">
                    <svg aria-hidden="true" className="w-8 h-8 print:w-6 print:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {icons[idx % icons.length]}
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSyncedWithDb && (
                      <div className="flex items-center gap-1 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleEditClick(rule)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[9px] font-black uppercase text-slate-700 dark:text-slate-300 rounded-[2px]"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          aria-label="Hapus Aturan"
                          className="px-1.5 py-1 text-[9px] font-black text-slate-400 hover:text-rose-600"
                        >
                          [X]
                        </button>
                      </div>
                    )}
                    <span className="text-xl font-black font-mono text-slate-300 dark:text-slate-800 print:text-black">
                      {String(rule.order).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-tight print:text-black">
                  {title}
                </h2>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed print:text-black">
                  {desc}
                </p>

                {/* DOs & DON'Ts OPERASIONAL */}
                {(doText || dontText) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-[11px] print:border-black">
                    {doText && (
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block print:text-black">
                          ✓ {t.do_lbl}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-snug mt-0.5 print:text-black">
                          {doText}
                        </p>
                      </div>
                    )}
                    {dontText && (
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400 block print:text-black">
                          ✕ {t.dont_lbl}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-snug mt-0.5 print:text-black">
                          {dontText}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* APD WAJIB */}
                {rule.ppe && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 print:border-black">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block print:text-black">
                      {t.ppe_lbl}:
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 print:text-black">
                      {rule.ppe}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-100 dark:border-slate-800 print:border-black print:mt-3 print:pt-2 space-y-2.5">
                <span className="inline-block px-2 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest print:bg-transparent print:border print:border-black print:text-black print:px-1.5">
                  {penalty}
                </span>

                {/* TAUTAN AKSI CEPAT (WEB ONLY) */}
                <div className="flex items-center justify-between gap-2 pt-1 print:hidden">
                  <Link
                    href={rule.relatedHref || '/document-control'}
                    className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    {relLabel} &rarr;
                  </Link>
                  <Link
                    href="/hazard-report"
                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    {t.btn_report}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* DOKUMEN CETAK (PRINT) - HANYA MUNCUL JIKA MODE 'AGREEMENT' DIPILIH */}
      {printMode === 'AGREEMENT' && (
        <div className="hidden print:block w-full mt-8 pt-6 border-t-4 border-black break-inside-avoid">
          <p className="text-xs font-bold text-black text-justify leading-relaxed mb-6">
            {t.print_statement}
          </p>

          <div className="grid grid-cols-2 gap-8 text-xs font-black uppercase tracking-widest text-black">
            <div className="space-y-4">
              <div className="flex border-b-2 border-black pb-1">
                <span className="w-36">{t.form_name}</span>
                <span className="flex-1"></span>
              </div>
              <div className="flex border-b-2 border-black pb-1">
                <span className="w-36">{t.form_company}</span>
                <span className="flex-1"></span>
              </div>
              <div className="flex border-b-2 border-black pb-1">
                <span className="w-36">{t.form_date}</span>
                <span className="flex-1">{todayDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[110px]">
                <p className="text-[9px]">{t.sign_worker}</p>
                <div className="w-full border-b-2 border-black mt-14"></div>
              </div>
              <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[110px] bg-gray-100">
                <p className="text-[9px]">{t.sign_hse}</p>
                <div className="w-full border-b-2 border-black mt-14"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
