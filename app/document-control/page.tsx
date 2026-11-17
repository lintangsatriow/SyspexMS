"use client"

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

type DocCategory = 'SOP' | 'WI' | 'FORM' | 'POLICY' | 'REGULATION'
type DocStatus = 'ACTIVE' | 'REVIEW' | 'OBSOLETE'

interface IsoDocumentRecord {
  id: string
  docNumber: string
  title: string
  category: DocCategory
  department: string
  revision: string
  effectiveDate: string
  status: DocStatus
  fileUrl: string
  summary: string
  createdAt: number
}

export default function DocumentManagementPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)

  // DB States
  const [documents, setDocuments] = useState<IsoDocumentRecord[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null)
  const [docNumber, setDocNumber] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<DocCategory>('SOP')
  const [department, setDepartment] = useState('HSE / QMS')
  const [revision, setRevision] = useState('Rev. 00')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [status, setStatus] = useState<DocStatus>('ACTIVE')
  const [fileUrl, setFileUrl] = useState('')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    setMounted(true)
    setEffectiveDate(new Date().toISOString().split('T')[0])

    const q = query(collection(db, 'iso_documents'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocuments(snap.docs.map((d) => d.data() as IsoDocumentRecord))
        setLoadingDb(false)
        setDbError('')
      },
      (err) => {
        console.error(err)
        setLoadingDb(false)
        setDbError(
          lang === 'ID'
            ? 'Gagal memuat register dokumen dari Firestore.'
            : 'Failed to load document register from Firestore.'
        )
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
  }, [lang])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setDocNumber('')
    setTitle('')
    setCategory('SOP')
    setDepartment('HSE / QMS')
    setRevision('Rev. 00')
    setEffectiveDate(new Date().toISOString().split('T')[0])
    setStatus('ACTIVE')
    setFileUrl('')
    setSummary('')
  }

  const handleEditClick = (item: IsoDocumentRecord) => {
    setEditingId(item.id)
    setDocNumber(item.docNumber)
    setTitle(item.title)
    setCategory(item.category)
    setDepartment(item.department)
    setRevision(item.revision)
    setEffectiveDate(item.effectiveDate)
    setStatus(item.status)
    setFileUrl(item.fileUrl)
    setSummary(item.summary)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docNumber.trim() || !title.trim() || submitting) return
    setSubmitting(true)
    setDbError('')

    try {
      const recordId = editingId || `DOC-${Date.now().toString().slice(-6)}`
      const payload: IsoDocumentRecord = {
        id: recordId,
        docNumber: docNumber.trim().toUpperCase(),
        title: title.trim(),
        category,
        department: department.trim() || 'GENERAL',
        revision: revision.trim() || 'Rev. 00',
        effectiveDate,
        status,
        fileUrl: fileUrl.trim(),
        summary: summary.trim(),
        createdAt: editingId
          ? documents.find((d) => d.id === editingId)?.createdAt || Date.now()
          : Date.now()
      }

      await setDoc(doc(db, 'iso_documents', recordId), payload)
      resetForm()
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menyimpan dokumen. Pastikan Anda login sebagai Admin.'
          : 'Failed to save document. Ensure you are logged in as Admin.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm(lang === 'ID' ? 'Hapus dokumen ini dari register?' : 'Remove this document from register?')) return
    try {
      await deleteDoc(doc(db, 'iso_documents', id))
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menghapus dokumen. Akses khusus Admin.'
          : 'Failed to delete document. Admin access required.'
      )
    }
  }

  const t = {
    ID: {
      hub: 'HUB',
      bc: 'MANAJEMEN & ISO',
      title: 'DOCUMENT MANAGEMENT SYSTEM',
      subtitle: 'Pusat kendali dokumen master (SOP, Work Instruction, Formulir, & Kebijakan K3L) sebagai basis pengetahuan terpadu Syspex.',
      btn_add: showForm ? 'TUTUP FORMULIR' : '+ REGISTRASI DOKUMEN BARU',
      btn_print: 'CETAK MASTER LIST',

      form_title: editingId ? 'PERBARUI DOKUMEN MASTER' : 'REGISTRASI DOKUMEN BARU',
      f_num: 'Nomor Dokumen *',
      f_title: 'Judul Dokumen *',
      f_cat: 'Jenis Dokumen',
      f_dept: 'Departemen Pemilik',
      f_rev: 'Status Revisi',
      f_date: 'Tanggal Efektif',
      f_status: 'Status Kendali',
      f_url: 'Tautan File (Google Drive / PDF Link)',
      f_sum: 'Ringkasan Isi / Ruang Lingkup Dokumen (Untuk Referensi Tim & AI Copilot)',
      btn_save: submitting ? 'MENYIMPAN...' : editingId ? 'SIMPAN PERUBAHAN' : 'SIMPAN KE MASTER REGISTER',
      btn_cancel: 'BATAL',

      stat_total: 'TOTAL DOKUMEN',
      stat_active: 'DOKUMEN AKTIF',
      stat_review: 'DALAM TINJAUAN',

      search_ph: 'Cari nomor dokumen, judul, atau isi ringkasan...',
      all_cat: 'SEMUA JENIS',
      all_stat: 'SEMUA STATUS',
      empty: 'Belum ada dokumen terdaftar di Document Management System.',
      loading: 'Memuat master list dokumen...',

      th_num: 'NO. DOKUMEN',
      th_title: 'JUDUL & RINGKASAN',
      th_cat: 'JENIS / DEPT',
      th_rev: 'REVISI & EFEKTIF',
      th_stat: 'STATUS',
      th_act: 'AKSI',
      btn_open: 'BUKA FILE',
      no_link: 'BELUM ADA LINK'
    },
    EN: {
      hub: 'HUB',
      bc: 'MANAGEMENT & ISO',
      title: 'DOCUMENT MANAGEMENT SYSTEM',
      subtitle: 'Master document control repository (SOP, Work Instructions, Forms, & HSE Policies) serving as Syspex unified knowledge base.',
      btn_add: showForm ? 'CLOSE FORM' : '+ REGISTER NEW DOCUMENT',
      btn_print: 'PRINT MASTER LIST',

      form_title: editingId ? 'UPDATE MASTER DOCUMENT' : 'REGISTER NEW DOCUMENT',
      f_num: 'Document Number *',
      f_title: 'Document Title *',
      f_cat: 'Document Type',
      f_dept: 'Owner Department',
      f_rev: 'Revision',
      f_date: 'Effective Date',
      f_status: 'Control Status',
      f_url: 'File URL (Google Drive / PDF Link)',
      f_sum: 'Document Scope / Key Summary (For Field Reference & AI Copilot)',
      btn_save: submitting ? 'SAVING...' : editingId ? 'SAVE CHANGES' : 'SAVE TO MASTER REGISTER',
      btn_cancel: 'CANCEL',

      stat_total: 'TOTAL DOCUMENTS',
      stat_active: 'ACTIVE CONTROLLED',
      stat_review: 'UNDER REVIEW',

      search_ph: 'Search document number, title, or summary...',
      all_cat: 'ALL TYPES',
      all_stat: 'ALL STATUS',
      empty: 'No documents registered in Document Management System yet.',
      loading: 'Loading document master list...',

      th_num: 'DOC NUMBER',
      th_title: 'TITLE & SCOPE SUMMARY',
      th_cat: 'TYPE / DEPT',
      th_rev: 'REV & EFFECTIVE',
      th_stat: 'STATUS',
      th_act: 'ACTION',
      btn_open: 'OPEN FILE',
      no_link: 'NO FILE LINK'
    }
  }[lang]

  const filteredDocs = documents.filter((d) => {
    const matchCat = filterCategory === 'ALL' || d.category === filterCategory
    const matchStat = filterStatus === 'ALL' || d.status === filterStatus
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      d.docNumber.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q)
    return matchCat && matchStat && matchSearch
  })

  const totalCount = documents.length
  const activeCount = documents.filter((d) => d.status === 'ACTIVE').length
  const reviewCount = documents.filter((d) => d.status === 'REVIEW').length

  if (!mounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 w-full max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:border-black">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 print:hidden">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">{t.hub}</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.bc}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase print:text-black">
            {t.title}
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 print:text-black">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 min-h-[44px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors"
          >
            {t.btn_print}
          </button>
          <button
            type="button"
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
            className="px-5 py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors"
          >
            {t.btn_add}
          </button>
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px] print:hidden">
          {dbError}
        </div>
      )}

      {/* KPI SUMMARY STRIP */}
      <div className="grid grid-cols-3 gap-4 print:hidden">
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">{t.stat_total}</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 block">{t.stat_active}</span>
          <span className="text-2xl font-black font-mono text-teal-700 dark:text-teal-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 p-4 rounded-[4px]">
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">{t.stat_review}</span>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1 block">{reviewCount}</span>
        </div>
      </div>

      {/* FORM INPUT / EDIT DOKUMEN */}
      {showForm && (
        <form
          onSubmit={handleSaveDocument}
          className="bg-white dark:bg-[#0b0f19] border-2 border-teal-600 rounded-[4px] p-5 sm:p-6 space-y-4 print:hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
              {t.form_title}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-black text-slate-400 hover:text-rose-600 px-2 py-1"
            >
              [X]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${formId}-num`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_num}
              </label>
              <input
                id={`${formId}-num`}
                required
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. SOP-HSE-001"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-title`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_title}
              </label>
              <input
                id={`${formId}-title`}
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prosedur Isolasi Energi Berbahaya (LOTO)"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-cat`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_cat}
              </label>
              <select
                id={`${formId}-cat`}
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
              >
                <option value="SOP">SOP (Standard Operating Procedure)</option>
                <option value="WI">WI / IK (Work Instruction)</option>
                <option value="FORM">FORM / CHECKLIST</option>
                <option value="POLICY">POLICY (Kebijakan Manajemen)</option>
                <option value="REGULATION">REGULATION (Regulasi Kemenaker / ISO)</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-dept`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_dept}
              </label>
              <input
                id={`${formId}-dept`}
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="HSE / Technical / Warehouse"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${formId}-rev`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                  {t.f_rev}
                </label>
                <input
                  id={`${formId}-rev`}
                  type="text"
                  value={revision}
                  onChange={(e) => setRevision(e.target.value)}
                  placeholder="Rev. 00"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-date`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                  {t.f_date}
                </label>
                <input
                  id={`${formId}-date`}
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-stat`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_status}
              </label>
              <select
                id={`${formId}-stat`}
                value={status}
                onChange={(e) => setStatus(e.target.value as DocStatus)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
              >
                <option value="ACTIVE">ACTIVE (Berlaku)</option>
                <option value="REVIEW">REVIEW (Revisi / Tinjauan)</option>
                <option value="OBSOLETE">OBSOLETE (Kadaluarsa)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-url`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_url}
              </label>
              <input
                id={`${formId}-url`}
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor={`${formId}-sum`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">
                {t.f_sum}
              </label>
              <textarea
                id={`${formId}-sum`}
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tuliskan poin utama prosedur, ketentuan APD, atau aturan penting dalam dokumen ini..."
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 min-h-[44px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-[4px]"
            >
              {t.btn_cancel}
            </button>
            <button
              type="submit"
              disabled={!docNumber.trim() || !title.trim() || submitting}
              className="px-6 py-2.5 min-h-[44px] bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] disabled:opacity-40"
            >
              {t.btn_save}
            </button>
          </div>
        </form>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search_ph}
          className="flex-1 px-3.5 py-2.5 bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
        />
        <select
          aria-label={t.all_cat}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-black text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">{t.all_cat}</option>
          <option value="SOP">SOP</option>
          <option value="WI">WI / IK</option>
          <option value="FORM">FORM</option>
          <option value="POLICY">POLICY</option>
          <option value="REGULATION">REGULATION</option>
        </select>
        <select
          aria-label={t.all_stat}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-black text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">{t.all_stat}</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="REVIEW">REVIEW</option>
          <option value="OBSOLETE">OBSOLETE</option>
        </select>
      </div>

      {/* MASTER DOCUMENT TABLE */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden print:border-2 print:border-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[820px] print:min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 print:bg-slate-200 print:text-black print:border-black">
              <tr>
                <th className="py-3 px-4">{t.th_num}</th>
                <th className="py-3 px-4">{t.th_title}</th>
                <th className="py-3 px-4">{t.th_cat}</th>
                <th className="py-3 px-4">{t.th_rev}</th>
                <th className="py-3 px-4 text-center">{t.th_stat}</th>
                <th className="py-3 px-4 text-center print:hidden">{t.th_act}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100 print:divide-black print:text-black">
              {loadingDb ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-teal-600">
                    {t.loading}
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 align-top">
                    <td className="py-3.5 px-4 font-mono text-[11px] font-black text-teal-700 dark:text-teal-400 whitespace-nowrap print:text-black">
                      {item.docNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="font-black uppercase text-slate-900 dark:text-white print:text-black">
                        {item.title}
                      </p>
                      {item.summary && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed print:text-black">
                          {item.summary}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase rounded-[2px] print:border-black">
                        {item.category}
                      </span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 print:text-black">
                        {item.department}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] whitespace-nowrap">
                      <p className="font-black">{item.revision}</p>
                      <p className="text-slate-500 mt-0.5 print:text-black">{item.effectiveDate}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-[2px] ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : item.status === 'REVIEW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
                          >
                            {t.btn_open}
                          </a>
                        ) : (
                          <span className="px-2 py-1.5 text-[8px] font-black uppercase text-slate-400 border border-slate-200 dark:border-slate-800 rounded-[2px]">
                            {t.no_link}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(item.id)}
                          aria-label="Hapus Dokumen"
                          className="px-2 py-1.5 text-[9px] font-black text-slate-400 hover:text-rose-600 rounded-[2px]"
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
    </div>
  )
}
