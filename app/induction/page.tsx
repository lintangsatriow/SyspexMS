"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface InductionTopic {
  id: string
  titleEn: string
  titleId: string
  descEn: string
  descId: string
  isChecked: boolean
}

export default function SafetyInductionPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Inductee Details
  const [inducteeName, setInducteeName] = useState('')
  const [inducteeId, setInducteeId] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')

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
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const toggleTopic = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, isChecked: !t.isChecked } : t))
  }

  const isAllChecked = topics.every(t => t.isChecked)
  const isFormValid = inducteeName.trim() && inducteeId.trim() && company.trim() && role.trim() && isAllChecked

  const dict = {
    ID: {
      breadcrumb: "K3L & Operasional",
      title: "Safety Induction",
      subtitle: "Checklist orientasi dan induksi K3L wajib bagi karyawan baru, tamu, dan kontraktor sebelum memasuki area operasional.",
      btn_print: "Cetak Berita Acara",
      
      p1_title: "1. Data Peserta Induksi",
      p1_name: "Nama Lengkap",
      p1_id: "No. Identitas (KTP/ID Badge)",
      p1_company: "Perusahaan / Instansi",
      p1_role: "Posisi / Peran (Role)",
      
      p2_title: "2. Checklist Materi Induksi",
      
      print_doc_type: "BERITA ACARA INDUKSI KESELAMATAN • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      print_statement: "Saya menyatakan bahwa saya telah menerima, memahami, dan menyetujui seluruh materi orientasi keselamatan (Safety Induction) yang disampaikan. Saya bersedia mematuhi semua peraturan K3L yang berlaku di area PT. Syspex Kemasindo.",
      
      sign_inductee: "Tanda Tangan Peserta",
      sign_hse: "Instruktur (HSE Dept)"
    },
    EN: {
      breadcrumb: "HSE & Operations",
      title: "Safety Induction",
      subtitle: "Mandatory HSE orientation checklist for new employees, visitors, and contractors prior to site entry.",
      btn_print: "Print Induction Record",
      
      p1_title: "1. Inductee Information",
      p1_name: "Full Name",
      p1_id: "Identity No. (ID Card/Passport)",
      p1_company: "Company / Organization",
      p1_role: "Position / Role",
      
      p2_title: "2. Induction Topics Checklist",
      
      print_doc_type: "OFFICIAL SAFETY INDUCTION RECORD • SYSPEX HSE",
      print_reg: "Registration No:",
      print_statement: "I declare that I have received, understood, and agreed to all safety orientation (Safety Induction) materials provided. I am willing to comply with all HSE regulations applicable within the PT. Syspex Kemasindo area.",
      
      sign_inductee: "Inductee Signature",
      sign_hse: "Instructor (HSE Dept)"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!isFormValid}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Safety Induction Record</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">IND-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. DATA PESERTA */}
      <div className="bg-white dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:border-none print:p-0 transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 print:border-black print:text-black">
          {t.p1_title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${formId}-name`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_name}</label>
            <input id={`${formId}-name`} type="text" value={inducteeName} onChange={(e) => setInducteeName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-id`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_id}</label>
            <input id={`${formId}-id`} type="text" value={inducteeId} onChange={(e) => setInducteeId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-company`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_company}</label>
            <input id={`${formId}-company`} type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-role`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_role}</label>
            <input id={`${formId}-role`} type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
        </div>
      </div>

      {/* 2. CHECKLIST MATERI */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 space-y-4 print:border-none print:p-0 transition-colors">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2 print:border-black print:text-black">
          {t.p2_title}
        </h2>
        
        <div className="space-y-2 print:space-y-0">
          {topics.map(topic => (
            <div 
              key={topic.id} 
              onClick={() => toggleTopic(topic.id)}
              className={`flex items-start gap-4 p-4 rounded-[4px] border-2 cursor-pointer transition-colors print:border-b-2 print:border-t-0 print:border-l-0 print:border-r-0 print:border-black print:rounded-none print:py-3 print:px-0 ${
                topic.isChecked 
                  ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-500' 
                  : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="mt-0.5 print:hidden">
                <div className={`w-5 h-5 rounded-[2px] border-2 flex items-center justify-center transition-colors ${
                  topic.isChecked ? 'bg-teal-500 border-teal-500' : 'bg-transparent border-slate-300 dark:border-slate-600'
                }`}>
                  {topic.isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="hidden print:block mt-0.5">
                <div className="w-4 h-4 border-2 border-black flex items-center justify-center">
                  {topic.isChecked && <span className="font-black text-[10px]">X</span>}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest print:text-black">
                  {lang === 'ID' ? topic.titleId : topic.titleEn}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider leading-relaxed print:text-black">
                  {lang === 'ID' ? topic.descId : topic.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOKUMEN CETAK (PRINT) - FORM PERNYATAAN */}
      <div className="hidden print:block w-full mt-6 pt-6">
        <p className="text-[11px] font-bold text-black text-justify leading-relaxed mb-10 border-2 border-black p-4">
          {t.print_statement}
        </p>
        
        <div className="grid grid-cols-2 gap-12 text-center text-[10px] font-black uppercase tracking-widest text-black">
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[140px]">
            <p>{t.sign_inductee}</p>
            <div className="w-full border-b-2 border-black mt-16"></div>
            <p className="mt-2">{inducteeName || '....................'}</p>
          </div>
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[140px] bg-gray-100">
            <p>{t.sign_hse}</p>
            <div className="w-full border-b-2 border-black mt-16"></div>
            <p className="mt-2">Syspex HSE Instructor</p>
          </div>
        </div>
      </div>

    </div>
  )
}
