"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type DocStatus = 'DRAFT' | 'ACTIVE' | 'OBSOLETE'

interface IsoDocument {
  id: string
  docNo: string
  title: string
  rev: string
  department: string
  dateEffective: string
  status: DocStatus
}

export default function DocumentControlPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  // Dummy Initial Data (Standar Syspex)
  const [documents, setDocuments] = useState<IsoDocument[]>([
    {
      id: 'doc-1', docNo: 'SOP-HSE-001', title: 'Prosedur Pelaporan Insiden & Investigasi', 
      rev: '02', department: 'HSE', dateEffective: '2025-01-15', status: 'ACTIVE'
    },
    {
      id: 'doc-2', docNo: 'SOP-ENG-012', title: 'Pedoman Preventive Maintenance (MHE)', 
      rev: '01', department: 'Engineering', dateEffective: '2025-06-20', status: 'ACTIVE'
    },
    {
      id: 'doc-3', docNo: 'SOP-HRD-005', title: 'Standar Evaluasi Fit-to-Work', 
      rev: '00', department: 'HRD', dateEffective: '-', status: 'DRAFT'
    },
    {
      id: 'doc-4', docNo: 'WI-HSE-002', title: 'Instruksi Kerja (LOTO) Mesin Wrapping', 
      rev: '01', department: 'HSE', dateEffective: '2023-11-10', status: 'OBSOLETE'
    }
  ])

  // Form States
  const [newDocNo, setNewDocNo] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newRev, setNewRev] = useState('00')
  const [newDept, setNewDept] = useState('HSE')
  const [newStatus, setNewStatus] = useState<DocStatus>('DRAFT')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocNo.trim() || !newTitle.trim()) return

    const newDoc: IsoDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 7)}`,
      docNo: newDocNo.toUpperCase(),
      title: newTitle,
      rev: newRev,
      department: newDept,
      dateEffective: newStatus === 'ACTIVE' ? todayDate : '-',
      status: newStatus
    }

    setDocuments([newDoc, ...documents])
    setNewDocNo(''); setNewTitle(''); setNewRev('00'); setNewStatus('DRAFT')
  }

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id))
  }

  const cycleStatus = (id: string, currentStatus: DocStatus) => {
    const nextStatus: Record<DocStatus, DocStatus> = {
      'DRAFT': 'ACTIVE',
      'ACTIVE': 'OBSOLETE',
      'OBSOLETE': 'DRAFT'
    }
    
    setDocuments(documents.map(d => {
      if (d.id === id) {
        const newStat = nextStatus[currentStatus]
        return { 
          ...d, 
          status: newStat,
          dateEffective: newStat === 'ACTIVE' ? todayDate : (newStat === 'DRAFT' ? '-' : d.dateEffective)
        }
      }
      return d
    }))
  }

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "ISO Document Control",
      subtitle: "Daftar induk dokumen (Master List) untuk merekam, merevisi, dan mendistribusikan prosedur terstandar ISO 9001.",
      btn_print: "Cetak Daftar Induk Dokumen",
      
      p1_title: "1. Registrasi Dokumen Baru",
      p1_no: "Nomor Dokumen",
      p1_title_lbl: "Judul Prosedur / Dokumen",
      p1_rev: "Revisi",
      p1_dept: "Departemen",
      p1_stat: "Status Awal",
      btn_add: "Daftarkan Dokumen",
      
      p2_title: "2. Master List of Documents",
      th_no: "Nomor Dokumen",
      th_title: "Judul Dokumen",
      th_dept_rev: "Dept & Rev",
      th_date: "Tgl. Efektif",
      th_status: "Status",
      th_manage: "Aksi",
      
      btn_delete: "Hapus",

      print_doc_type: "DOKUMEN RESMI PENGENDALIAN MUTU • SYSPEX MS",
      print_reg: "Nomor Registrasi:",
      sign_dcc: "Disusun Oleh (Document Controller):",
      sign_mr: "Disetujui Oleh (Management Rep):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "ISO Document Control",
      subtitle: "Master list of documents to track, revise, and distribute standardized ISO 9001 procedures.",
      btn_print: "Print Master Document List",
      
      p1_title: "1. New Document Registration",
      p1_no: "Document Number",
      p1_title_lbl: "Procedure / Document Title",
      p1_rev: "Revision",
      p1_dept: "Department",
      p1_stat: "Initial Status",
      btn_add: "Register Document",
      
      p2_title: "2. Master List of Documents",
      th_no: "Document No.",
      th_title: "Document Title",
      th_dept_rev: "Dept & Rev",
      th_date: "Effective Date",
      th_status: "Status",
      th_manage: "Manage",
      
      btn_delete: "Del",

      print_doc_type: "OFFICIAL QUALITY CONTROL RECORD • SYSPEX MS",
      print_reg: "Registration No:",
      sign_dcc: "Prepared By (Document Controller):",
      sign_mr: "Approved By (Management Rep):"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={documents.length === 0}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Master List of Documents</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">F-DCC-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. FORMULIR INPUT DOKUMEN (HIDE ON PRINT) */}
      <div className="bg-slate-900 rounded-md p-6 border border-slate-800 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddDocument} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-no`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_no}</label>
            <input id={`${formId}-no`} type="text" value={newDocNo} onChange={(e) => setNewDocNo(e.target.value)} placeholder="e.g. SOP-HSE-01" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white uppercase focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-3">
            <label htmlFor={`${formId}-title`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_title_lbl}</label>
            <input id={`${formId}-title`} type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-dept`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_dept}</label>
            <select id={`${formId}-dept`} value={newDept} onChange={(e) => setNewDept(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500">
              <option value="HSE">HSE</option>
              <option value="Engineering">Engineering</option>
              <option value="Production">Production</option>
              <option value="HRD">HRD</option>
              <option value="Logistics">Logistics</option>
              <option value="QA/QC">QA/QC</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-rev`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_rev}</label>
            <input id={`${formId}-rev`} type="text" value={newRev} onChange={(e) => setNewRev(e.target.value)} placeholder="00" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-center text-white focus:outline-none focus:border-teal-500" />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-stat`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_stat}</label>
            <select id={`${formId}-stat`} value={newStatus} onChange={(e) => setNewStatus(e.target.value as DocStatus)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500">
              <option value="DRAFT">DRAFT (Penyusunan)</option>
              <option value="ACTIVE">ACTIVE (Berlaku)</option>
              <option value="OBSOLETE">OBSOLETE (Usang/Kedaluwarsa)</option>
            </select>
          </div>
          <div className="md:col-span-4 flex items-end justify-end">
            <button type="submit" disabled={!newDocNo.trim() || !newTitle.trim()} className="px-8 py-2 bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL MASTER LIST DOKUMEN */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <div className="flex justify-between items-end border-b border-slate-200 pb-2 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 print:text-black">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:hidden">
            TOTAL: {documents.length} DOKUMEN
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b-2 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-32">{t.th_no}</th>
                <th className="py-3 px-3 w-1/3 border-l-2 border-slate-200 print:border-black">{t.th_title}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 print:border-black">{t.th_dept_rev}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 print:border-black">{t.th_date}</th>
                <th className="py-3 px-3 w-24 text-center border-l-2 border-slate-200 print:border-black">{t.th_status}</th>
                <th className="py-3 px-3 text-center w-20 border-l-2 border-slate-200 print:hidden">{t.th_manage}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-slate-900 print:divide-black">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 print:hover:bg-white">
                  <td className="py-3 px-3 font-mono text-[11px] font-black text-slate-900 print:text-black">
                    {doc.docNo}
                  </td>
                  <td className="py-3 px-3 font-bold leading-relaxed border-l-2 border-slate-100 print:border-black print:text-[10px]">
                    {doc.title}
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:border-black">
                    <p className="text-[10px] font-black uppercase tracking-widest">{doc.department}</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-1">REV: {doc.rev}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[10px] border-l-2 border-slate-100 print:border-black">
                    {doc.dateEffective}
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:border-black">
                    <button 
                      onClick={() => cycleStatus(doc.id, doc.status)}
                      className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest border transition print:bg-transparent print:border-black print:text-black print:px-1 ${
                        doc.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                        doc.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                        'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {doc.status}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:hidden">
                    <button onClick={() => handleDelete(doc.id)} className="text-slate-400 hover:text-rose-600 font-black px-1.5 py-0.5 text-[9px] uppercase tracking-widest border border-transparent hover:border-rose-200 rounded transition">
                      {t.btn_delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4 bg-slate-100">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_dcc}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Document Controller</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_mr}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Management Representative (MR)</p>
          </div>
        </div>

      </div>
    </div>
  )
}
