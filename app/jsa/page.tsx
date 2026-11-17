"use client"

import { useState, useEffect, useId, useRef } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useLanguage } from '../LanguageContext'

type JsaStatus = 'DRAFT' | 'APPROVED' | 'REJECTED'

interface JsaStep {
  id: string
  task: string
  hazard: string
  control: string
}

interface JsaRecord {
  id: string
  jobTitle: string
  location: string
  department: string
  supervisor: string
  date: string
  status: JsaStatus
  steps: JsaStep[]
  createdAt: number
}

export default function JSAPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)
  
  const [records, setRecords] = useState<JsaRecord[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form States
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [department, setDepartment] = useState('TECHNICAL')
  const [supervisor, setSupervisor] = useState('')
  const [date, setDate] = useState('')
  const [steps, setSteps] = useState<JsaStep[]>([
    { id: 'step-1', task: '', hazard: '', control: '' }
  ])

  // Print Mode State
  const [printData, setPrintData] = useState<JsaRecord | null>(null)

  useEffect(() => {
    setMounted(true)
    setDate(new Date().toISOString().split('T')[0])

    const q = query(collection(db, 'jsa_records'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as JsaRecord)
      setRecords(items)
      setLoadingDb(false)
      setDbError('')
    }, (err) => {
      console.error(err)
      setLoadingDb(false)
      setDbError(lang === 'ID' ? 'Gagal terhubung ke Cloud. Pastikan Anda sudah login Admin.' : 'Failed to connect to Cloud. Ensure you are logged in.')
    })

    return () => unsubscribe()
  }, [lang])

  useEffect(() => {
    if (printData) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [printData])

  // Batal print saat tekan ESC atau selesai print
  useEffect(() => {
    const handleAfterPrint = () => setPrintData(null)
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        setPrintData(null)
      }
    }
    window.addEventListener('afterprint', handleAfterPrint)
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleAddStep = () => {
    setSteps([...steps, { id: `step-${Date.now()}`, task: '', hazard: '', control: '' }])
  }

  const handleRemoveStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const updateStep = (id: string, field: keyof JsaStep, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const resetForm = () => {
    setJobTitle('')
    setLocation('')
    setSupervisor('')
    setDate(new Date().toISOString().split('T')[0])
    setSteps([{ id: `step-${Date.now()}`, task: '', hazard: '', control: '' }])
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (rec: JsaRecord) => {
    setJobTitle(rec.jobTitle)
    setLocation(rec.location)
    setDepartment(rec.department)
    setSupervisor(rec.supervisor)
    setDate(rec.date)
    setSteps(rec.steps.length > 0 ? rec.steps : [{ id: `step-${Date.now()}`, task: '', hazard: '', control: '' }])
    setEditingId(rec.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobTitle.trim() || submitting) return
    setSubmitting(true)

    try {
      const validSteps = steps.filter(s => s.task.trim() || s.hazard.trim() || s.control.trim())
      const finalSteps = validSteps.length > 0 ? validSteps : [{ id: 'step-1', task: '-', hazard: '-', control: '-' }]

      const docId = editingId || `JSA-${Date.now().toString().slice(-6)}`
      const payload: JsaRecord = {
        id: docId,
        jobTitle: jobTitle.trim(),
        location: location.trim(),
        department,
        supervisor: supervisor.trim() || '-',
        date,
        status: editingId ? (records.find(r => r.id === editingId)?.status || 'DRAFT') : 'DRAFT',
        steps: finalSteps,
        createdAt: editingId ? (records.find(r => r.id === editingId)?.createdAt || Date.now()) : Date.now()
      }

      await setDoc(doc(db, 'jsa_records', docId), payload)
      resetForm()
    } catch (err) {
      console.error(err)
      setDbError('Gagal menyimpan JSA. Pastikan koneksi lancar & izin akses sesuai.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(lang === 'ID' ? 'Yakin ingin menghapus JSA ini?' : 'Delete this JSA?')) return
    try {
      await deleteDoc(doc(db, 'jsa_records', id))
    } catch (err) {
      console.error(err)
    }
  }

  const updateStatus = async (id: string, newStatus: JsaStatus) => {
    try {
      await updateDoc(doc(db, 'jsa_records', id), { status: newStatus })
    } catch (err) {
      console.error(err)
    }
  }

  const t = {
    ID: {
      hub: "HUB",
      bc: "KONTROL PEKERJAAN",
      title: "JOB SAFETY ANALYSIS (JSA)",
      subtitle: "Identifikasi bahaya dan pengendalian risiko langkah demi langkah.",
      btn_new: "+ BUAT JSA BARU",
      btn_cancel: "BATAL",
      btn_save: submitting ? "MENYIMPAN..." : "SIMPAN JSA",
      f_title: "Nama Pekerjaan *",
      f_loc: "Lokasi",
      f_dept: "Departemen",
      f_pic: "Supervisor / PIC",
      f_date: "Tanggal",
      step_task: "Uraian Langkah Pekerjaan",
      step_hz: "Potensi Bahaya / Risiko",
      step_ctrl: "Tindakan Pengendalian",
      btn_add_step: "+ TAMBAH LANGKAH",
      th_id: "NO. DOKUMEN",
      th_job: "PEKERJAAN & LOKASI",
      th_dept: "DEPT / PIC",
      th_status: "STATUS",
      th_action: "AKSI",
      print_doc: "DOKUMEN JOB SAFETY ANALYSIS RESMI",
      sign_spv: "Dibuat Oleh (Supervisor):",
      sign_hse: "Disetujui Oleh (HSE):"
    },
    EN: {
      hub: "HUB",
      bc: "WORK CONTROL",
      title: "JOB SAFETY ANALYSIS (JSA)",
      subtitle: "Step-by-step hazard identification and risk control.",
      btn_new: "+ CREATE NEW JSA",
      btn_cancel: "CANCEL",
      btn_save: submitting ? "SAVING..." : "SAVE JSA",
      f_title: "Job Title *",
      f_loc: "Location",
      f_dept: "Department",
      f_pic: "Supervisor / PIC",
      f_date: "Date",
      step_task: "Job Steps Description",
      step_hz: "Potential Hazards / Risks",
      step_ctrl: "Control Measures",
      btn_add_step: "+ ADD STEP",
      th_id: "DOC NO.",
      th_job: "JOB TITLE & LOCATION",
      th_dept: "DEPT / PIC",
      th_status: "STATUS",
      th_action: "ACTION",
      print_doc: "OFFICIAL JOB SAFETY ANALYSIS DOCUMENT",
      sign_spv: "Prepared By (Supervisor):",
      sign_hse: "Approved By (HSE):"
    }
  }[lang]

  if (!mounted) return null

  // =========================================================================
  // TAMPILAN MODE CETAK (PRINT)
  // =========================================================================
  if (printData) {
    return (
      <div className="bg-white text-black p-8 min-h-screen">
        <div className="border-4 border-black mb-6">
          <div className="border-b-4 border-black flex justify-between items-center p-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">JOB SAFETY ANALYSIS</h1>
              <p className="text-xs font-black uppercase tracking-widest mt-1">{t.print_doc}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono">{printData.id}</span>
              <p className="text-xs font-bold uppercase tracking-widest mt-1">STATUS: {printData.status}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 divide-x-4 divide-black border-b-4 border-black">
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">{t.f_title}</span>
              <p className="text-sm font-black uppercase">{printData.jobTitle}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">{t.f_loc}</span>
              <p className="text-sm font-black uppercase">{printData.location || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x-4 divide-black">
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">{t.f_date}</span>
              <p className="text-sm font-bold uppercase">{printData.date}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">{t.f_dept}</span>
              <p className="text-sm font-bold uppercase">{printData.department}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">{t.f_pic}</span>
              <p className="text-sm font-bold uppercase">{printData.supervisor}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-4 border-black text-left text-sm mb-12">
          <thead className="bg-slate-200 border-b-4 border-black">
            <tr>
              <th className="p-3 border-r-2 border-black w-10 text-center font-black">NO</th>
              <th className="p-3 border-r-2 border-black w-1/3 font-black uppercase">{t.step_task}</th>
              <th className="p-3 border-r-2 border-black w-1/3 font-black uppercase">{t.step_hz}</th>
              <th className="p-3 font-black uppercase">{t.step_ctrl}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {printData.steps.map((step, idx) => (
              <tr key={step.id} className="align-top">
                <td className="p-3 border-r-2 border-black text-center font-black">{idx + 1}</td>
                <td className="p-3 border-r-2 border-black font-medium">{step.task}</td>
                <td className="p-3 border-r-2 border-black font-medium">{step.hazard}</td>
                <td className="p-3 font-medium">{step.control}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-12 mt-16 pt-8">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest mb-20">{t.sign_spv}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-xs font-black mt-2 uppercase">{printData.supervisor || '..............................'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-xs font-black mt-2 uppercase">SYSPEX HSE DEPT.</p>
          </div>
        </div>
        
        <div className="fixed top-4 right-4 print:hidden">
          <button onClick={() => setPrintData(null)} className="px-4 py-2 bg-rose-600 text-white font-black text-xs uppercase rounded">Tutup Print</button>
        </div>
      </div>
    )
  }

  // =========================================================================
  // TAMPILAN NORMAL (DASHBOARD & FORM JSA)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 w-full max-w-[1400px] mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">{t.hub}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.bc}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-3">
              {t.title}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 rounded-[2px] text-[8px] font-black text-blue-800 dark:text-blue-400 tracking-widest">
                FIRESTORE SYNC
              </span>
            </h1>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5">{t.subtitle}</p>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm min-h-[44px]"
            >
              {t.btn_new}
            </button>
          )}
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-rose-50 border-2 border-rose-400 text-rose-800 text-xs font-bold rounded-[4px]">
          {dbError}
        </div>
      )}

      {/* FORMULIR JSA */}
      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 sm:p-6 space-y-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-teal-700 dark:text-teal-400 mb-1.5">{t.f_title}</label>
                <input required type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" placeholder="e.g. Pengelasan Pipa Tangki" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.f_loc}</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.f_date}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.f_dept}</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500">
                  <option value="TECHNICAL">TECHNICAL</option>
                  <option value="OPERATION">OPERATION</option>
                  <option value="HR/GA">HR / GA</option>
                  <option value="CONTRACTOR">CONTRACTOR</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">{t.f_pic}</label>
                <input type="text" value={supervisor} onChange={e => setSupervisor(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">JOB STEPS & CONTROLS</h3>
                <button type="button" onClick={handleAddStep} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors">
                  {t.btn_add_step}
                </button>
              </div>
              
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={step.id} className="p-4 bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-[4px] flex flex-col lg:flex-row gap-3 relative group">
                    <div className="absolute -left-2.5 -top-2.5 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black font-mono shadow-sm">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">{t.step_task}</label>
                      <textarea rows={2} value={step.task} onChange={e => updateStep(step.id, 'task', e.target.value)} className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2px] text-xs font-medium focus:border-teal-500 resize-none" placeholder="Langkah kerja..." />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">{t.step_hz}</label>
                      <textarea rows={2} value={step.hazard} onChange={e => updateStep(step.id, 'hazard', e.target.value)} className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2px] text-xs font-medium focus:border-teal-500 resize-none" placeholder="Potensi bahaya..." />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">{t.step_ctrl}</label>
                      <textarea rows={2} value={step.control} onChange={e => updateStep(step.id, 'control', e.target.value)} className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2px] text-xs font-medium focus:border-teal-500 resize-none" placeholder="Tindakan pencegahan..." />
                    </div>
                    
                    {steps.length > 1 && (
                      <button type="button" onClick={() => handleRemoveStep(step.id)} className="lg:w-8 h-8 self-end lg:self-center flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-[2px] border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-colors" aria-label="Hapus Langkah">
                        [X]
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 justify-end">
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors">
                {t.btn_cancel}
              </button>
              <button type="submit" disabled={!jobTitle.trim() || submitting} className="px-8 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors shadow-sm">
                {t.btn_save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL REGISTER JSA */}
      {!showForm && (
        <div className="bg-white dark:bg-[#0b0f19] rounded-[4px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-32">{t.th_id}</th>
                  <th className="py-3 px-4 border-l-2 border-slate-200 dark:border-slate-800">{t.th_job}</th>
                  <th className="py-3 px-4 w-48 border-l-2 border-slate-200 dark:border-slate-800">{t.th_dept}</th>
                  <th className="py-3 px-4 w-36 text-center border-l-2 border-slate-200 dark:border-slate-800">{t.th_status}</th>
                  <th className="py-3 px-4 w-44 text-center border-l-2 border-slate-200 dark:border-slate-800">{t.th_action}</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-100">
                {loadingDb ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-teal-600">LOADING DATABASE...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">NO JSA RECORDS FOUND</td></tr>
                ) : (
                  records.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 align-top">
                      <td className="py-3 px-4 font-mono text-[9px] font-black text-slate-500">
                        {rec.id} <br/> <span className="font-bold text-slate-800 dark:text-slate-300">{rec.date}</span>
                      </td>
                      <td className="py-3 px-4 border-l-2 border-slate-100 dark:border-slate-800/50">
                        <p className="font-black text-slate-900 dark:text-white uppercase">{rec.jobTitle}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{rec.location}</p>
                      </td>
                      <td className="py-3 px-4 border-l-2 border-slate-100 dark:border-slate-800/50">
                        <p className="font-black text-slate-800 dark:text-slate-300 uppercase">{rec.department}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">PIC: {rec.supervisor}</p>
                      </td>
                      <td className="py-3 px-4 text-center border-l-2 border-slate-100 dark:border-slate-800/50">
                        <select
                          value={rec.status}
                          onChange={e => updateStatus(rec.id, e.target.value as JsaStatus)}
                          className={`w-full px-2 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-[2px] border focus:outline-none ${
                            rec.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-400' :
                            rec.status === 'REJECTED' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-400' :
                            'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 border-l-2 border-slate-100 dark:border-slate-800/50">
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => setPrintData(rec)} className="px-2 py-1.5 text-[8px] font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-700 rounded-[2px] transition-colors">
                            PRINT
                          </button>
                          <button onClick={() => handleEdit(rec)} className="px-2 py-1.5 text-[8px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-teal-600 hover:text-white rounded-[2px] transition-colors">
                            EDIT
                          </button>
                          <button onClick={() => handleDelete(rec.id)} className="px-2 py-1.5 text-[8px] font-black text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 rounded-[2px] transition-colors">
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
    </div>
  )
}
