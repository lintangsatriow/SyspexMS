"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface Attendee {
  id: string
  name: string
  department: string
}

export default function SafetyTalkPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Meeting Parameters
  const [topic, setTopic] = useState<string>('Prosedur Evakuasi Darurat & Penggunaan APAR')
  const [location, setLocation] = useState<string>('Loading Dock Area B')
  const [supervisor, setSupervisor] = useState<string>('Agus Santoso')
  const [notes, setNotes] = useState<string>('Penekanan pada jalur evakuasi yang terhalang palet minggu lalu. Semua tim wajib memastikan jalur tetap bersih (5R).')

  // Attendees
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'Budi Prakoso', department: 'Warehouse' },
    { id: '2', name: 'Siti Aminah', department: 'QA/QC' },
    { id: '3', name: 'Rendi Saputra', department: 'Logistics' }
  ])

  const [newName, setNewName] = useState('')
  const [newDept, setNewDept] = useState('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setAttendees([...attendees, {
      id: Math.random().toString(36).substring(2, 7),
      name: newName,
      department: newDept || 'General'
    }])
    setNewName('')
    setNewDept('')
  }

  const handleRemoveAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id))
  }

  const dict = {
    ID: {
      breadcrumb: "Keselamatan Lapangan",
      title: "Safety Talk (TBM)",
      subtitle: "Pencatatan materi Toolbox Meeting harian dan daftar hadir (presensi) pekerja lapangan.",
      btn_print: "Cetak Daftar Hadir TBM",
      
      p1_title: "1. Parameter Pertemuan",
      p1_topic: "Topik Pembahasan",
      p1_loc: "Lokasi TBM",
      p1_spv: "Pemimpin Rapat (Supervisor)",
      p1_notes: "Ringkasan Materi / Catatan Kritis",
      
      p2_title: "2. Daftar Hadir Pekerja",
      p2_name: "Nama Pekerja",
      p2_dept: "Departemen / Bagian",
      btn_add: "+ Tambah Peserta",
      
      th_no: "No",
      th_name: "Nama Lengkap",
      th_dept: "Departemen",
      th_action: "Aksi",
      btn_delete: "Hapus",

      print_doc_type: "DOKUMEN RESMI TOOLBOX MEETING • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      th_sign: "Tanda Tangan",
      sign_spv: "Pemimpin Pertemuan (Supervisor):",
      sign_hse: "Mengetahui (HSE Officer):"
    },
    EN: {
      breadcrumb: "Field Safety",
      title: "Safety Talk (TBM)",
      subtitle: "Daily Toolbox Meeting records and field worker attendance logging.",
      btn_print: "Print TBM Attendance List",
      
      p1_title: "1. Meeting Parameters",
      p1_topic: "Discussion Topic",
      p1_loc: "TBM Location",
      p1_spv: "Meeting Lead (Supervisor)",
      p1_notes: "Briefing Summary / Critical Notes",
      
      p2_title: "2. Worker Attendance",
      p2_name: "Worker Name",
      p2_dept: "Department / Section",
      btn_add: "+ Add Attendee",
      
      th_no: "No",
      th_name: "Full Name",
      th_dept: "Department",
      th_action: "Action",
      btn_delete: "Del",

      print_doc_type: "OFFICIAL TOOLBOX MEETING RECORD • SYSPEX HSE",
      print_reg: "Registration No:",
      th_sign: "Signature",
      sign_spv: "Meeting Lead (Supervisor):",
      sign_hse: "Acknowledged By (HSE Officer):"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      
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
            disabled={attendees.length === 0}
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
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Toolbox Meeting (TBM)</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">TBM-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. PARAMETER PERTEMUAN */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 print:border-black print:text-black">
          {t.p1_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor={`${formId}-topic`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_topic}</label>
            <input id={`${formId}-topic`} type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-none print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none print:text-sm" />
          </div>
          <div>
            <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_loc}</label>
            <input id={`${formId}-loc`} type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-none print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-date`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">Tanggal (Date)</label>
            <input id={`${formId}-date`} type="date" value={todayDate} onChange={(e) => setTodayDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-none print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-spv`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_spv}</label>
            <input id={`${formId}-spv`} type="text" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-none print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor={`${formId}-notes`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_notes}</label>
            <textarea id={`${formId}-notes`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 resize-none print:border-none print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
        </div>
      </div>

      {/* 2. TAMBAH PESERTA (HIDE ON PRINT) */}
      <div className="bg-slate-900 rounded-md p-6 border border-slate-800 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-slate-800 pb-2">
          {t.p2_title}
        </h2>
        <form onSubmit={handleAddAttendee} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor={`${formId}-newname`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_name}</label>
            <input id={`${formId}-newname`} type="text" placeholder="..." value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${formId}-newdept`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_dept}</label>
            <input id={`${formId}-newdept`} type="text" placeholder="..." value={newDept} onChange={(e) => setNewDept(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={!newName.trim()} className="w-full py-2 bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 3. TABEL DAFTAR HADIR */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <div className="flex justify-between items-end border-b border-slate-200 pb-2 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 print:text-black print:hidden">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:text-black">
            TOTAL: {attendees.length} KARYAWAN
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b-2 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-12 text-center">{t.th_no}</th>
                <th className="py-3 px-3 w-1/2 border-l-2 border-slate-200 print:border-black">{t.th_name}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 print:border-black">{t.th_dept}</th>
                <th className="py-3 px-3 w-32 border-l-2 border-black hidden print:table-cell">{t.th_sign}</th>
                <th className="py-3 px-3 text-center w-20 border-l-2 border-slate-200 print:hidden">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-slate-900 print:divide-black">
              {attendees.map((att, idx) => (
                <tr key={att.id} className="hover:bg-slate-50 print:hover:bg-white">
                  <td className="py-3 px-3 text-center font-black text-slate-400 print:text-black">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold uppercase tracking-wider border-l-2 border-slate-100 print:border-black print:text-xs">
                    {att.name}
                  </td>
                  <td className="py-3 px-3 font-bold text-[10px] uppercase border-l-2 border-slate-100 print:border-black">
                    {att.department}
                  </td>
                  <td className="py-5 px-3 border-l-2 border-black hidden print:table-cell">
                    {/* Empty cell for physical signature */}
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:hidden">
                    <button onClick={() => handleRemoveAttendee(att.id)} className="text-slate-400 hover:text-rose-600 font-black px-1.5 py-0.5 text-[9px] uppercase tracking-widest border border-transparent hover:border-rose-200 rounded transition">
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
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_spv}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">{supervisor}</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
