"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

export default function SyspexSafetyRulesPage() {
  const { lang } = useLanguage()
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const dict = {
    ID: {
      breadcrumb: "K3L & Operasional",
      title: "Syspex Safety Rules",
      subtitle: "6 Aturan Keselamatan Tak Boleh Dilanggar (Golden Rules). Pelanggaran terhadap aturan ini berakibat pada pemutusan hubungan kerja atau pengusiran dari area.",
      btn_print: "Cetak Lembar Kepatuhan",
      
      rules: [
        { 
          id: 1, title: 'ISOLASI ENERGI (LOTO)', 
          desc: 'Wajib memastikan status bebas energi dan memasang Lockout/Tagout sebelum memperbaiki mesin atau peralatan berarus.',
          pen: 'PELANGGARAN: FATAL / SP-3' 
        },
        { 
          id: 2, title: 'BEKERJA DI KETINGGIAN', 
          desc: 'Wajib menggunakan Full Body Harness (100% tie-off) dan memastikan Scaffolding memiliki Tag Hijau saat bekerja di atas 1.8 meter.',
          pen: 'PELANGGARAN: FATAL / SP-3' 
        },
        { 
          id: 3, title: 'PENGANGKATAN AMAN (LIFTING)', 
          desc: 'Dilarang keras melintas atau berdiri di bawah beban yang sedang diangkat (suspended load) oleh Crane atau Hoist.',
          pen: 'PELANGGARAN: FATAL / SP-3' 
        },
        { 
          id: 4, title: 'ALAT BERAT (MOBILE EQUIPMENT)', 
          desc: 'Pejalan kaki wajib menggunakan jalur khusus. Jaga jarak minimal 3 meter dari Forklift atau alat berat yang sedang beroperasi.',
          pen: 'PELANGGARAN: TINGGI / SP-2' 
        },
        { 
          id: 5, title: 'IZIN KERJA (PERMIT TO WORK)', 
          desc: 'Pekerjaan risiko tinggi (Panas, Ruang Terbatas, Ketinggian, Kelistrikan) tidak boleh dimulai tanpa Izin Kerja & JSA yang sah.',
          pen: 'PELANGGARAN: FATAL / SP-3' 
        },
        { 
          id: 6, title: 'FIT TO WORK', 
          desc: 'Nol toleransi terhadap penggunaan alkohol, obat terlarang, atau bekerja dalam kondisi kelelahan ekstrem / sakit.',
          pen: 'PELANGGARAN: FATAL / PENGUSIRAN' 
        },
      ],

      print_doc_type: "SURAT PERNYATAAN KEPATUHAN K3L • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      print_statement: "Saya yang bertanda tangan di bawah ini menyatakan telah membaca, memahami, dan siap mematuhi 6 Aturan Keselamatan (Safety Rules) Syspex. Saya memahami bahwa pelanggaran terhadap aturan ini dapat mengakibatkan sanksi tegas hingga pemutusan hubungan kerja.",
      
      form_name: "Nama Lengkap:",
      form_company: "Perusahaan / Dept:",
      form_date: "Tanggal:",
      sign_worker: "Tanda Tangan Pekerja",
      sign_hse: "Verifikasi HSE Dept"
    },
    EN: {
      breadcrumb: "HSE & Operations",
      title: "Syspex Safety Rules",
      subtitle: "6 Non-Negotiable Golden Rules. Violation of these rules will result in immediate termination or site expulsion.",
      btn_print: "Print Compliance Agreement",
      
      rules: [
        { 
          id: 1, title: 'ENERGY ISOLATION (LOTO)', 
          desc: 'Must verify zero-energy state and apply Lockout/Tagout before servicing machinery or electrical equipment.',
          pen: 'PENALTY: FATAL / TERMINATION' 
        },
        { 
          id: 2, title: 'WORK AT HEIGHT', 
          desc: 'Must use Full Body Harness (100% tie-off) and verify Green Tag Scaffolding when working above 1.8 meters.',
          pen: 'PENALTY: FATAL / TERMINATION' 
        },
        { 
          id: 3, title: 'SAFE LIFTING & RIGGING', 
          desc: 'Strictly prohibited from walking or standing under suspended loads lifted by cranes or hoists.',
          pen: 'PENALTY: FATAL / TERMINATION' 
        },
        { 
          id: 4, title: 'MOBILE EQUIPMENT', 
          desc: 'Pedestrians must use designated walkways. Maintain a minimum 3-meter distance from operating Forklifts or MHE.',
          pen: 'PENALTY: HIGH / WARNING' 
        },
        { 
          id: 5, title: 'PERMIT TO WORK', 
          desc: 'High-risk tasks (Hot Work, Confined Space, Height, Electrical) must not commence without a valid Permit & JSA.',
          pen: 'PENALTY: FATAL / TERMINATION' 
        },
        { 
          id: 6, title: 'FIT TO WORK', 
          desc: 'Zero tolerance for the use of alcohol, illegal drugs, or working under extreme fatigue / illness.',
          pen: 'PENALTY: FATAL / SITE EXPULSION' 
        },
      ],

      print_doc_type: "HSE COMPLIANCE AGREEMENT • SYSPEX HSE",
      print_reg: "Registration No:",
      print_statement: "I, the undersigned, declare that I have read, understood, and am ready to comply with the 6 Safety Rules of PT. Syspex Kemasindo. I understand that violating these rules may result in severe disciplinary action, including termination.",
      
      form_name: "Full Name:",
      form_company: "Company / Dept:",
      form_date: "Date:",
      sign_worker: "Worker Signature",
      sign_hse: "HSE Dept Verification"
    }
  }

  const t = dict[lang]

  // Mekanikal Icons (Sharp SVG)
  const icons = [
    <path key={1} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    <path key={2} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    <path key={3} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />,
    <path key={4} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-2" />,
    <path key={5} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    <path key={6} strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ]

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
            <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 tracking-tight uppercase transition-colors">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">AGR-HSE-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* SAFETY RULES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:gap-4 print:grid-cols-2">
        {t.rules.map((rule, idx) => (
          <div 
            key={rule.id} 
            className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] flex flex-col justify-between transition-colors print:border-black print:bg-transparent print:p-4 print:break-inside-avoid"
          >
            <div>
              <div className="flex justify-between items-start mb-4 print:mb-2">
                <div className="text-rose-600 dark:text-rose-500 print:text-black">
                  <svg className="w-8 h-8 print:w-6 print:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[idx]}</svg>
                </div>
                <span className="text-xl font-black text-slate-300 dark:text-slate-800 print:text-gray-400">
                  0{rule.id}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-tight print:text-black">{rule.title}</h3>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-3 leading-relaxed print:text-black">{rule.desc}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t-2 border-slate-100 dark:border-slate-800 print:border-black print:mt-4 print:pt-2">
              <span className="inline-block px-2 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest print:bg-transparent print:border print:border-black print:text-black print:px-1">
                {rule.pen}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DOKUMEN CETAK (PRINT) - FORM PERNYATAAN */}
      <div className="hidden print:block w-full mt-8 pt-8 border-t-4 border-black">
        <p className="text-xs font-bold text-black text-justify leading-relaxed mb-8">
          {t.print_statement}
        </p>
        
        <div className="grid grid-cols-2 gap-8 text-xs font-black uppercase tracking-widest text-black">
          <div className="space-y-4">
            <div className="flex border-b-2 border-black pb-1">
              <span className="w-32">{t.form_name}</span>
              <span className="flex-1"></span>
            </div>
            <div className="flex border-b-2 border-black pb-1">
              <span className="w-32">{t.form_company}</span>
              <span className="flex-1"></span>
            </div>
            <div className="flex border-b-2 border-black pb-1">
              <span className="w-32">{t.form_date}</span>
              <span className="flex-1">{todayDate}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[120px]">
              <p className="text-[9px]">{t.sign_worker}</p>
              <div className="w-full border-b-2 border-black mt-16"></div>
            </div>
            <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[120px] bg-gray-100">
              <p className="text-[9px]">{t.sign_hse}</p>
              <div className="w-full border-b-2 border-black mt-16"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
