"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type LicenseType = 'SIO' | 'SILO' | 'SKP'
type LicenseStatus = 'VALID' | 'EXPIRING' | 'EXPIRED'

interface LicenseRecord {
  id: string
  type: LicenseType
  holderName: string
  licenseNo: string
  issueDate: string
  expiryDate: string
}

export default function SioSiloTrackerPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Dummy Initial Data
  const [licenses, setLicenses] = useState<LicenseRecord[]>([
    {
      id: 'lic-1', type: 'SIO', holderName: 'Budi Prakoso (Forklift Kelas II)', 
      licenseNo: '5/123/AS/SIO/2022', issueDate: '2022-01-10', expiryDate: '2027-01-10'
    },
    {
      id: 'lic-2', type: 'SILO', holderName: 'Forklift Toyota 3-Ton (FL-01)', 
      licenseNo: '5/882/AS/SILO/2025', issueDate: '2025-12-05', expiryDate: '2026-12-05' // Expiring soon
    },
    {
      id: 'lic-3', type: 'SKP', holderName: 'Ahli K3 Umum (Agus Santoso)', 
      licenseNo: 'Kep.112/BINWASK3/2023', issueDate: '2023-05-20', expiryDate: '2026-05-20' // Expired
    }
  ])

  // Form States
  const [newType, setNewType] = useState<LicenseType>('SIO')
  const [newHolder, setNewHolder] = useState('')
  const [newNo, setNewNo] = useState('')
  const [newIssue, setNewIssue] = useState('')
  const [newExpiry, setNewExpiry] = useState('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // Fungsi Kalkulasi Status Otomatis
  const getStatus = (expiryDate: string): LicenseStatus => {
    if (!todayDate) return 'VALID'
    const today = new Date(todayDate).getTime()
    const exp = new Date(expiryDate).getTime()
    const diffDays = (exp - today) / (1000 * 3600 * 24)

    if (diffDays < 0) return 'EXPIRED'
    if (diffDays <= 60) return 'EXPIRING'
    return 'VALID'
  }

  const handleAddLicense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHolder.trim() || !newNo.trim() || !newExpiry) return

    const newLic: LicenseRecord = {
      id: `lic-${Math.random().toString(36).substring(2, 7)}`,
      type: newType,
      holderName: newHolder,
      licenseNo: newNo.toUpperCase(),
      issueDate: newIssue || '-',
      expiryDate: newExpiry
    }

    setLicenses([newLic, ...licenses])
    setNewHolder(''); setNewNo(''); setNewIssue(''); setNewExpiry('')
  }

  const handleDelete = (id: string) => {
    setLicenses(licenses.filter(d => d.id !== id))
  }

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "SIO & SILO Tracker",
      subtitle: "Database pemantauan masa berlaku Surat Izin Operasi (Operator) dan Kelayakan (Alat Berat) regulasi Kemenaker.",
      btn_print: "Cetak Laporan Validitas",
      
      p1_title: "1. Registrasi Lisensi Baru",
      p1_type: "Kategori Izin",
      p1_holder: "Nama Operator / ID Unit",
      p1_no: "Nomor Registrasi / Lisensi",
      p1_issue: "Tanggal Terbit",
      p1_exp: "Tanggal Kedaluwarsa",
      btn_add: "Simpan Data",
      
      p2_title: "2. Database Validitas Lisensi",
      th_type: "Kategori",
      th_holder: "Nama Pemegang / ID Unit Alat",
      th_no: "Nomor Lisensi",
      th_dates: "Periode Validitas",
      th_status: "Status Kepatuhan",
      th_manage: "Aksi",
      
      btn_delete: "Hapus",
      
      stat_valid: "AKTIF",
      stat_expiring: "HAMPIR HABIS",
      stat_expired: "KEDALUWARSA",

      print_doc_type: "DOKUMEN RESMI KEPATUHAN KEMENAKER • SYSPEX MS",
      print_reg: "Nomor Registrasi:",
      sign_hr: "Disusun Oleh (HR/GA Dept):",
      sign_hse: "Ditinjau & Disetujui (HSE Officer):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "SIO & SILO Tracker",
      subtitle: "Monitoring database for statutory Operation Licenses (Operators) and Eligibility (Heavy Equipment).",
      btn_print: "Print Validity Report",
      
      p1_title: "1. New License Registration",
      p1_type: "License Category",
      p1_holder: "Operator Name / Unit ID",
      p1_no: "Registration / License No.",
      p1_issue: "Issue Date",
      p1_exp: "Expiry Date",
      btn_add: "Save Record",
      
      p2_title: "2. License Validity Database",
      th_type: "Category",
      th_holder: "Holder Name / Unit ID",
      th_no: "License No.",
      th_dates: "Validity Period",
      th_status: "Compliance Status",
      th_manage: "Manage",
      
      btn_delete: "Del",
      
      stat_valid: "VALID",
      stat_expiring: "EXPIRING SOON",
      stat_expired: "EXPIRED",

      print_doc_type: "OFFICIAL STATUTORY COMPLIANCE RECORD • SYSPEX MS",
      print_reg: "Registration No:",
      sign_hr: "Prepared By (HR/GA Dept):",
      sign_hse: "Reviewed & Approved (HSE Officer):"
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
            disabled={licenses.length === 0}
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
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Statutory License Log</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">LOG-LIC-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. FORMULIR INPUT LISENSI (HIDE ON PRINT) */}
      <div className="bg-slate-900 rounded-md p-6 border border-slate-800 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-slate-800 pb-2">
          {t.p1_title}
        </h2>
        <form onSubmit={handleAddLicense} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-type`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_type}</label>
            <select id={`${formId}-type`} value={newType} onChange={(e) => setNewType(e.target.value as LicenseType)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500">
              <option value="SIO">SIO (Personel)</option>
              <option value="SILO">SILO (Unit/Alat)</option>
              <option value="SKP">SKP (Ahli K3)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-holder`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_holder}</label>
            <input id={`${formId}-holder`} type="text" value={newHolder} onChange={(e) => setNewHolder(e.target.value)} placeholder="..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-no`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_no}</label>
            <input id={`${formId}-no`} type="text" value={newNo} onChange={(e) => setNewNo(e.target.value)} placeholder="e.g. 5/123/..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white uppercase focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-issue`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_issue}</label>
            <input id={`${formId}-issue`} type="date" value={newIssue} onChange={(e) => setNewIssue(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-1">
            <label htmlFor={`${formId}-exp`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p1_exp}</label>
            <input id={`${formId}-exp`} type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          
          <div className="md:col-span-6 flex items-end justify-end border-t border-slate-800 pt-4 mt-2">
            <button type="submit" disabled={!newHolder.trim() || !newNo.trim() || !newExpiry} className="px-8 py-2 bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL DATABASE LISENSI */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <div className="flex justify-between items-end border-b border-slate-200 pb-2 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 print:text-black">
            {t.p2_title}
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:hidden">
            TOTAL: {licenses.length} DATA
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b-2 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-16 text-center">{t.th_type}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 print:border-black">{t.th_holder}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 print:border-black">{t.th_no}</th>
                <th className="py-3 px-3 w-32 border-l-2 border-slate-200 print:border-black">{t.th_dates}</th>
                <th className="py-3 px-3 w-28 text-center border-l-2 border-slate-200 print:border-black">{t.th_status}</th>
                <th className="py-3 px-3 text-center w-16 border-l-2 border-slate-200 print:hidden">{t.th_manage}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-slate-900 print:divide-black">
              {licenses.map((lic) => {
                const stat = getStatus(lic.expiryDate)
                return (
                  <tr key={lic.id} className="hover:bg-slate-50 print:hover:bg-white">
                    <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:border-black">
                      <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded-[2px] print:border print:border-black print:bg-transparent print:text-black">
                        {lic.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold leading-relaxed border-l-2 border-slate-100 print:border-black print:text-[10px]">
                      {lic.holderName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[10px] text-slate-700 border-l-2 border-slate-100 print:border-black print:text-black">
                      {lic.licenseNo}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[9px] border-l-2 border-slate-100 print:border-black print:text-[9px]">
                      <p className="text-slate-500 print:text-black">IN: {lic.issueDate}</p>
                      <p className="text-slate-900 print:text-black border-t border-slate-200 mt-1 pt-1">EX: {lic.expiryDate}</p>
                    </td>
                    <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:border-black">
                      <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest inline-block print:border print:border-black print:bg-transparent print:text-black ${
                        stat === 'VALID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        stat === 'EXPIRING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-rose-900 text-rose-100 border border-rose-900'
                      }`}>
                        {stat === 'VALID' ? t.stat_valid : stat === 'EXPIRING' ? t.stat_expiring : t.stat_expired}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:hidden">
                      <button onClick={() => handleDelete(lic.id)} className="text-slate-400 hover:text-rose-600 font-black px-1.5 py-0.5 text-[9px] uppercase tracking-widest border border-transparent hover:border-rose-200 rounded transition">
                        {t.btn_delete}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_hr}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">HR / General Affairs</p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-slate-100">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Dept.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
