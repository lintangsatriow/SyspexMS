"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ExecutiveReportPage() {
  const [todayDate, setTodayDate] = useState<string>('')
  
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    setTodayDate(new Date().toLocaleDateString('en-GB', options))
  }, [])

  const kpiData = { safeManHours: 342850, ltiFreeDays: 418, totalCapa: 24, closedCapa: 20, openCapaHigh: 1, openCapaMediumLow: 3, complianceScore: 92 }
  const closureRate = Math.round((kpiData.closedCapa / kpiData.totalCapa) * 100)

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-300 pb-5 gap-4 print:border-b-2 print:border-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 print:hidden">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">HSE Executive Summary</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Tinjauan Manajemen K3 &amp; Lingkungan</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Date / Tanggal Laporan</p>
          <p className="text-sm font-black text-slate-900">{todayDate}</p>
          <button onClick={() => window.print()} className="mt-2 px-4 py-1.5 rounded-md bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 transition shadow-sm print:hidden">
            🖨️ PRINT / EXPORT PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm text-white print:border-2 print:border-slate-900 print:text-slate-900 print:bg-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider print:text-slate-600">Safe Man-Hours / Jam Kerja Aman</p>
          <div className="mt-2"><span className="text-4xl font-black font-mono tracking-tight">{kpiData.safeManHours.toLocaleString()}</span><span className="text-xs font-bold text-slate-400 ml-2 print:text-slate-600">Hours</span></div>
          <p className="text-[11px] text-emerald-400 font-bold mt-2 pt-2 border-t border-slate-700 print:text-emerald-700 print:border-slate-300">✓ {kpiData.ltiFreeDays} Days without Lost Time Injury (LTI)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:border-2 print:border-slate-900">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CAPA Closure Rate / Tingkat Penyelesaian</p>
          <div className="mt-2"><span className="text-4xl font-black font-mono tracking-tight text-slate-900">{closureRate}%</span></div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden"><div className={`h-full rounded-full ${closureRate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${closureRate}%` }}></div></div>
          <p className="text-[11px] text-slate-600 font-bold mt-2 pt-2 border-t border-slate-100">{kpiData.closedCapa} closed out of {kpiData.totalCapa} total findings</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:border-2 print:border-slate-900">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit Readiness / Kesiapan Audit</p>
          <div className="mt-2"><span className="text-4xl font-black font-mono tracking-tight text-slate-900">{kpiData.complianceScore}%</span></div>
          <p className="text-[11px] text-slate-600 font-bold mt-3 pt-2 border-t border-slate-100 flex justify-between"><span>ISO 9001/14001/45001</span><span className="text-emerald-600 font-black">ON TRACK</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-2 print:border-slate-900">
        <div className="p-5 border-b border-slate-100 bg-slate-50 print:bg-white print:border-b-2 print:border-slate-900">
          <h2 className="text-sm font-black text-slate-900 uppercase">Attention Required / Perhatian Khusus</h2>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">High-risk items requiring Director&apos;s awareness (ISO Clause 9.3.2).</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg border border-red-200 bg-red-50 print:border-red-500 print:bg-white">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black shrink-0 print:border print:border-red-500">!</div>
            <div>
              <h3 className="text-xs font-black text-red-900 uppercase">1 High-Risk CAPA Overdue</h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed"><strong>EN:</strong> Safety Locking Pin on Racking Bay 4 is detached. Target date missed.<br/><strong>ID:</strong> Pengunci Rak Bay 4 lepas. Melewati batas waktu perbaikan.</p>
              <p className="text-[10px] font-bold text-slate-500 mt-2">PIC: Agus Santoso | Area: Gudang Packaging Blok B</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg border border-amber-200 bg-amber-50 print:border-amber-500 print:bg-white">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black shrink-0 print:border print:border-amber-500">↻</div>
            <div>
              <h3 className="text-xs font-black text-amber-900 uppercase">Lisence Renewal Pending</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed"><strong>EN:</strong> Overhead Crane Operator License (SIO) expires in &lt; 30 days.<br/><strong>ID:</strong> SIO Operator Crane akan kadaluarsa dalam waktu &lt; 30 hari.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden print:grid grid-cols-2 gap-8 pt-12 mt-12 border-t-2 border-slate-900">
        <div className="text-center"><p className="text-[10px] font-bold text-slate-600 uppercase mb-16">Prepared By (HSE Manager):</p><div className="w-48 mx-auto border-b-2 border-slate-900"></div><p className="text-xs font-bold mt-2 uppercase">Lintang Satrio</p></div>
        <div className="text-center"><p className="text-[10px] font-bold text-slate-600 uppercase mb-16">Acknowledged By (Director):</p><div className="w-48 mx-auto border-b-2 border-slate-900"></div><p className="text-xs font-bold mt-2 uppercase">Board of Directors</p></div>
      </div>
    </div>
  )
}
