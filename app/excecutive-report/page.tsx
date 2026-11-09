"use client"

import { useState } from 'react'
import Link from 'next/link'

type Language = 'ID' | 'EN'

export default function ExecutiveReportPage() {
  const [lang, setLang] = useState<Language>('ID')
  const [reportMonth, setReportMonth] = useState('2026-10')

  // Dictionary Bilingual
  const dict = {
    ID: {
      title: 'Laporan Eksekutif K3L',
      subtitle: 'Ringkasan performa Keselamatan, Kesehatan Kerja, dan Lingkungan (K3L) bulanan.',
      btn_print: 'CETAK LAPORAN',
      month: 'Bulan Laporan',
      manHours: 'Jam Kerja Aman (Tanpa LTI)',
      lti: 'Insiden Hilang Waktu (LTI)',
      trir: 'Total Recordable Incident Rate',
      capa: 'Penyelesaian CAPA',
      lagging: 'Indikator Tertinggal (Lagging)',
      leading: 'Indikator Mendahului (Leading)',
      training: 'Kepatuhan Pelatihan K3',
      inspection: 'Inspeksi & Patroli Selesai',
      env: 'Kepatuhan Lingkungan',
      waste: 'Limbah B3 Terkelola',
      energy: 'Efisiensi Energi',
      conclusion: 'Kesimpulan Eksekutif',
      conclusionText: 'Kinerja K3L bulan ini menunjukkan tren positif dengan pencapaian Zero Accident. Penutupan temuan inspeksi (CAPA) berada di angka 92%, melampaui target minimum 85%. Namun, diperlukan peningkatan pengawasan pada pemakaian APD di area ASRS.',
      signPrepared: 'Dibuat Oleh (HSE Manager)',
      signApproved: 'Disetujui Oleh (Direktur)',
    },
    EN: {
      title: 'HSE Executive Report',
      subtitle: 'Monthly Health, Safety, and Environment (HSE) performance summary.',
      btn_print: 'PRINT REPORT',
      month: 'Reporting Month',
      manHours: 'Safe Man-Hours (Zero LTI)',
      lti: 'Lost Time Injuries (LTI)',
      trir: 'Total Recordable Incident Rate',
      capa: 'CAPA Closure Rate',
      lagging: 'Lagging Indicators',
      leading: 'Leading Indicators',
      training: 'HSE Training Compliance',
      inspection: 'Inspections & Patrols Completed',
      env: 'Environmental Compliance',
      waste: 'HazMat Waste Managed',
      energy: 'Energy Efficiency',
      conclusion: 'Executive Conclusion',
      conclusionText: 'HSE performance this month shows a positive trend with Zero Accidents achieved. CAPA closure rate stands at 92%, exceeding the minimum target of 85%. However, heightened supervision on PPE compliance in the ASRS area is required.',
      signPrepared: 'Prepared By (HSE Manager)',
      signApproved: 'Approved By (Director)',
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header Panel - Web Only */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Management System</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button onClick={() => setLang('ID')} className={`px-3 py-1.5 text-xs font-black rounded transition ${lang === 'ID' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>ID</button>
              <button onClick={() => setLang('EN')} className={`px-3 py-1.5 text-xs font-black rounded transition ${lang === 'EN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>EN</button>
            </div>
            
            <input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold shadow-sm" />
            
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              {t.btn_print}
            </button>
          </div>
        </div>
      </div>

      {/* Konten Dashboard (Mirip dengan Print Layout, namun dengan styling Web Modern) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:bg-transparent">
        
        {/* Print Header (Visible in print, styled in Web) */}
        <div className="p-6 border-b border-slate-200 print:border-b-4 print:border-black flex justify-between items-center bg-slate-50 print:bg-transparent">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 print:bg-black text-white flex items-center justify-center font-black text-xs tracking-widest rounded-xl print:rounded-none">
              SYSPEX
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-slate-900">{t.title}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syspex Kemasindo HSE Dept.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase">{t.month}</p>
            <p className="text-lg font-black text-slate-900 border-b-2 border-slate-900 print:border-black">{new Date(reportMonth + '-01').toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-GB', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Section: Lagging Indicators (Hasil / Insiden) */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 print:text-black border-l-4 border-emerald-500 print:border-black pl-3 mb-4">{t.lagging}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-emerald-50 print:bg-transparent print:border-2 print:border-black text-center">
                <p className="text-[10px] font-bold text-slate-500 print:text-black uppercase tracking-wider mb-2">{t.manHours}</p>
                <p className="text-4xl font-black text-emerald-700 print:text-black">1,254,400</p>
                <p className="text-[10px] font-bold text-emerald-600 print:text-gray-600 mt-2">Target: 2,000,000</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent print:border-2 print:border-black text-center">
                <p className="text-[10px] font-bold text-slate-500 print:text-black uppercase tracking-wider mb-2">{t.lti}</p>
                <p className="text-4xl font-black text-slate-900">0</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2">Zero Accident Maintained</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent print:border-2 print:border-black text-center">
                <p className="text-[10px] font-bold text-slate-500 print:text-black uppercase tracking-wider mb-2">{t.trir}</p>
                <p className="text-4xl font-black text-slate-900">0.0</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2">Below Industry Avg (1.2)</p>
              </div>
            </div>
          </div>

          {/* Section: Leading Indicators (Upaya Pencegahan) */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 print:text-black border-l-4 border-blue-500 print:border-black pl-3 mb-4">{t.leading}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-100 print:border-b print:border-dashed print:border-gray-400 print:rounded-none">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-700 print:text-black uppercase">{t.capa}</p>
                    <p className="text-lg font-black text-slate-900">92%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden print:border print:border-black">
                    <div className="bg-blue-500 h-full print:bg-black" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">45 / 49 Open Issues Closed</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 print:border-b print:border-dashed print:border-gray-400 print:rounded-none">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-700 print:text-black uppercase">{t.training}</p>
                    <p className="text-lg font-black text-slate-900">95%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden print:border print:border-black">
                    <div className="bg-indigo-500 h-full print:bg-black" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">114 / 120 Staff Trained</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-100 print:border-b print:border-dashed print:border-gray-400 print:rounded-none">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-700 print:text-black uppercase">{t.inspection}</p>
                    <p className="text-lg font-black text-slate-900">100%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden print:border print:border-black">
                    <div className="bg-emerald-500 h-full print:bg-black" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">12 / 12 Scheduled Audits Done</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent print:border print:border-black">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{t.waste}</p>
                    <p className="text-xl font-black">1.2 <span className="text-[10px] font-bold text-slate-500">Ton</span></p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent print:border print:border-black">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{t.energy}</p>
                    <p className="text-xl font-black">-5<span className="text-[10px] font-bold text-emerald-600">%</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: Kesimpulan / Executive Summary */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 print:text-black border-l-4 border-amber-500 print:border-black pl-3 mb-4">{t.conclusion}</h3>
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl print:bg-transparent print:border-2 print:border-black">
              <p className="text-sm font-medium leading-relaxed text-slate-800 print:text-black">
                "{t.conclusionText}"
              </p>
            </div>
          </div>

          {/* Signatures (Visible largely on Print, but shown on web for context) */}
          <div className="grid grid-cols-2 gap-12 pt-12 mt-8 border-t-2 border-slate-100 print:border-black print:mt-16 text-center text-xs font-bold text-slate-900 print:text-black">
            <div>
              <p className="uppercase text-slate-500 print:text-gray-600 mb-16">{t.signPrepared}</p>
              <div className="border-b-2 border-slate-400 print:border-black w-3/4 mx-auto mb-2"></div>
              <p>Lintang Satrio</p>
            </div>
            <div>
              <p className="uppercase text-slate-500 print:text-gray-600 mb-16">{t.signApproved}</p>
              <div className="border-b-2 border-slate-400 print:border-black w-3/4 mx-auto mb-2"></div>
              <p>Top Management</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
