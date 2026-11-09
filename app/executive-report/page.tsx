"use client"

import { useState } from 'react'
import Link from 'next/link'

type Language = 'ID' | 'EN'

export default function ExecutiveKPIReportPage() {
  const [lang, setLang] = useState<Language>('ID')
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q3')
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'BOARD_REPORT'>('DASHBOARD')

  // Data Metrik Operasional Syspex
  const kpiData = {
    safeHours: '1,420,800',
    safeDays: 412,
    ltiCount: 0,
    nearMissCount: 14,
    hazardReported: 38,
    hazardClosed: 35,
    capaRate: 92.1,
    mhePreOpCompliance: 96.5,
    sioSiloValidity: 94.2,
    trainingHoursPerEmployee: 4.8,
    b3DisposalCompliant: 100,
    rackingAuditScore: 91.0
  }

  const dict = {
    ID: {
      tagline: 'Ringkasan Kinerja K3L & Kepatuhan Operasional Terpadu',
      badge: 'Sistem Manajemen ISO 45001 / 14001 / 9001',
      tab_dash: 'Live Dashboard Operasional',
      tab_report: 'Pratinjau Laporan Direksi (Cetak)',
      btn_print: 'Cetak Laporan Direksi',
      score_title: 'Indeks Kesehatan K3 Syspex',
      score_desc: 'Berdasarkan kepatuhan MHE, audit racking, validitas legal, dan penutupan CAPA.',
      sec_core: 'Metrik Utama (Zero Harm Target)',
      sec_ops: 'Kepatuhan Lapangan Spesifik Syspex',
      sec_legal: 'Kepatuhan Regulasi & Sertifikasi Kemenaker',
      sec_strategic: 'Tindakan Strategis Manajemen',
      mhe_title: 'Inspeksi & Operasi Forklift / MHE',
      racking_title: 'Keselamatan Racking & Proyek Ketinggian',
      legal_title: 'Validitas SIO, SILO & SKP',
      env_title: 'Pengelolaan Limbah B3 & Lingkungan',
      sign_hse: 'HSE Manager Syspex',
      sign_dir: 'Operational Director'
    },
    EN: {
      tagline: 'Integrated HSE Performance & Operational Compliance Summary',
      badge: 'ISO 45001 / 14001 / 9001 Management System',
      tab_dash: 'Live Operational Dashboard',
      tab_report: 'Board Executive Summary (Print)',
      btn_print: 'Print Board Report',
      score_title: 'Syspex HSE Health Index',
      score_desc: 'Based on MHE safety, racking audit, statutory validity, and CAPA resolution.',
      sec_core: 'Core Safety Metrics (Zero Harm Target)',
      sec_ops: 'Syspex Operational Specific Compliance',
      sec_legal: 'Statutory & Kemenaker Compliance',
      sec_strategic: 'Management Strategic Actions',
      mhe_title: 'Forklift & MHE Operation / Pre-Op',
      racking_title: 'Racking Installation & Working at Height',
      legal_title: 'SIO, SILO & Competency Validity',
      env_title: 'Hazmat (B3) & Environmental Control',
      sign_hse: 'HSE Manager Syspex',
      sign_dir: 'Operational Director'
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Top Header Panel */}
      <div className="border-b border-slate-200 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Executive Suite</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">HSE KPI & Executive Report</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200 uppercase">
                {selectedPeriod}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button 
                onClick={() => setLang('ID')} 
                className={`px-3 py-1.5 text-xs font-black rounded transition ${lang === 'ID' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('EN')} 
                className={`px-3 py-1.5 text-xs font-black rounded transition ${lang === 'EN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                EN
              </button>
            </div>

            {/* Period Selector */}
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm focus:outline-none"
            >
              <option value="2026-Q3">Q3 2026 (Juli - Sept)</option>
              <option value="2026-Q4">Q4 2026 (Okt - Des)</option>
              <option value="2026-YTD">YTD 2026 (Tahunan)</option>
            </select>

            {/* Print Trigger */}
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              {t.btn_print}
            </button>
          </div>
        </div>

        {/* Tab Navigasi Mode */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${activeTab === 'DASHBOARD' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {t.tab_dash}
          </button>
          <button
            onClick={() => setActiveTab('BOARD_REPORT')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${activeTab === 'BOARD_REPORT' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {t.tab_report}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. TAMPILAN DASHBOARD INTERAKTIF (WEB MODE) */}
      {/* ========================================================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6 print:hidden">
          
          {/* Hero Banner: Index Kesehatan K3 Syspex */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-widest border border-teal-500/30">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                {t.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{t.score_title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{t.score_desc}</p>
            </div>

            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-sm self-stretch md:self-auto justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Overall Score</p>
                <p className="text-4xl sm:text-5xl font-black text-teal-400 tracking-tight">94.8<span className="text-lg text-slate-400">/100</span></p>
                <p className="text-[10px] font-bold text-emerald-400 mt-1">Grade A (Excellence Compliance)</p>
              </div>
              <div className="text-right border-l border-white/10 pl-6">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Zero Harm Record</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{kpiData.safeDays} <span className="text-xs font-normal text-slate-400">Hari</span></p>
                <p className="text-[10px] font-mono text-slate-400">{kpiData.safeHours} Safe Man-Hours</p>
              </div>
            </div>
          </div>

          {/* Section: Core Safety Metrics */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span>
              {t.sec_core}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Lost Time Injury (LTI)</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{kpiData.ltiCount}</p>
                <span className="text-[10px] font-bold text-emerald-600 mt-1 block">✓ Target Zero Tercapai</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Near-Miss Lapangan</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{kpiData.nearMissCount}</p>
                <span className="text-[10px] font-bold text-amber-600 mt-1 block">Pelaporan Aktif Proaktif</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Hazard Hunter Lapor</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{kpiData.hazardReported}</p>
                <span className="text-[10px] font-bold text-slate-500 mt-1 block">{kpiData.hazardClosed} Temuan Selesai Ditutup</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Tingkat Penutupan CAPA</p>
                <p className="text-3xl font-black text-teal-600 mt-2">{kpiData.capaRate}%</p>
                <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Target Min. 85% Terlampaui</span>
              </div>
            </div>
          </div>

          {/* Section: Operational Specific Compliance (Syspex Scope) */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              {t.sec_ops}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Forklift & MHE */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{t.mhe_title}</h4>
                    <p className="text-[11px] text-slate-500">Kepatuhan inspeksi sebelum operasi harian seluruh armada forklift & reach truck.</p>
                  </div>
                  <span className="text-lg font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                    {kpiData.mhePreOpCompliance}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${kpiData.mhePreOpCompliance}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Total Unit</p>
                    <p className="font-black text-slate-800 text-xs">12 Unit</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">LOTO Aktif</p>
                    <p className="font-black text-amber-700 text-xs">1 Unit (FL-03)</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">SIO Driver</p>
                    <p className="font-black text-emerald-700 text-xs">100% Valid</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Racking & ASRS */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{t.racking_title}</h4>
                    <p className="text-[11px] text-slate-500">Integritas beban balok SWL, safety pin upright, dan izin kerja ketinggian.</p>
                  </div>
                  <span className="text-lg font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                    {kpiData.rackingAuditScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${kpiData.rackingAuditScore}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Pallet SWL Safe</p>
                    <p className="font-black text-slate-800 text-xs">98.5%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Harness Tie-Off</p>
                    <p className="font-black text-emerald-700 text-xs">100% Wajib</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Scaffold Green Tag</p>
                    <p className="font-black text-indigo-700 text-xs">8/8 Tag Aktif</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: Statutory & Strategic Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-800">{t.legal_title}</h4>
              <p className="text-3xl font-black text-slate-900">{kpiData.sioSiloValidity}%</p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Seluruh lisensi Kemenaker, SKP Ahli K3 Umum, sertifikasi Petugas P3K, dan SILO MHE dalam pengawasan sistem reminder terintegrasi.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-800">{t.env_title}</h4>
              <p className="text-3xl font-black text-emerald-600">{kpiData.b3DisposalCompliant}%</p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Penyimpanan oli hidrolik bekas, kain majun terkontaminasi, dan limbah kemasan drum B3 memenuhi regulasi manifes festronik ISO 14001.
              </p>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Rekomendasi HSE Manager</p>
                <p className="text-xs font-medium leading-relaxed mt-2 text-slate-200">
                  &ldquo;Fokus kuartal ini: Peremajaan pelindung kolom racking di jalur putar lorong C dan simulasi evakuasi darurat perakitan ASRS.&rdquo;
                </p>
              </div>
              <p className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">Syspex Kemasindo HSE Dept.</p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DOKUMEN CETAK RESMI DIREKSI (PRINTABLE BOARD REPORT) */}
      {/* ========================================================= */}
      <div className={`${activeTab === 'BOARD_REPORT' ? 'block' : 'hidden'} print:block w-full text-black bg-white`}>
        <div className="border-4 border-slate-900 p-8 w-full max-w-[850px] mx-auto space-y-6">
          
          {/* Header Board Report */}
          <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider">
                SX
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">EXECUTIVE HSE BOARD REPORT</h1>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">PT. Syspex Kemasindo — Q3/Q4 Performance Review</p>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono">
              <p className="font-bold uppercase">Doc Ref: SYS-HSE-EXEC-2026</p>
              <p>Period: {selectedPeriod}</p>
              <p>Date: {new Date().toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-GB')}</p>
            </div>
          </div>

          {/* Executive Overview Highlight */}
          <div className="grid grid-cols-4 gap-3 text-center border-2 border-slate-900 p-3 bg-slate-50">
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">Lost Time Injury</p>
              <p className="text-2xl font-black">{kpiData.ltiCount}</p>
              <span className="text-[8px] font-bold uppercase text-emerald-700">Zero Accident</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">Safe Man-Hours</p>
              <p className="text-2xl font-black">{kpiData.safeHours}</p>
              <span className="text-[8px] font-bold uppercase text-slate-600">{kpiData.safeDays} Days Record</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">HSE Health Index</p>
              <p className="text-2xl font-black text-teal-800">94.8%</p>
              <span className="text-[8px] font-bold uppercase text-emerald-700">Grade A Compliant</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">CAPA Resolution</p>
              <p className="text-2xl font-black">{kpiData.capaRate}%</p>
              <span className="text-[8px] font-bold uppercase text-slate-600">{kpiData.hazardClosed}/{kpiData.hazardReported} Resolved</span>
            </div>
          </div>

          {/* Table: Operational Area Review */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider border-b-2 border-slate-900 pb-1 mb-2">
              1. Area Kepatuhan Operasional Inti (Syspex Operations)
            </h3>
            <table className="w-full border-collapse border border-slate-900 text-xs">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr>
                  <th className="border border-slate-900 p-2 text-left">Lingkup Operasional</th>
                  <th className="border border-slate-900 p-2 text-center w-[20%]">Status Kepatuhan</th>
                  <th className="border border-slate-900 p-2 text-left w-[50%]">Catatan Audit & Mitigasi Risiko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-[11px]">
                <tr>
                  <td className="border border-slate-900 p-2 font-bold">Armada Forklift & MHE</td>
                  <td className="border border-slate-900 p-2 text-center font-black text-emerald-800">96.5% Compliant</td>
                  <td className="border border-slate-900 p-2">Pre-operation checklist 100% digital. 1 unit forklift dikarantina LOTO untuk perbaikan rem hidrolik.</td>
                </tr>
                <tr>
                  <td className="border border-slate-900 p-2 font-bold">Racking & Instalasi ASRS</td>
                  <td className="border border-slate-900 p-2 text-center font-black text-emerald-800">91.0% Compliant</td>
                  <td className="border border-slate-900 p-2">Integritas balok SWL diverifikasi. Penggantian 2 unit upright guard yang penyok akibat manuver material.</td>
                </tr>
                <tr>
                  <td className="border border-slate-900 p-2 font-bold">Kepatuhan Legal Kemenaker</td>
                  <td className="border border-slate-900 p-2 text-center font-black text-emerald-800">94.2% Valid</td>
                  <td className="border border-slate-900 p-2">Seluruh operator bersertifikat SIO aktif. 1 lisensi SILO alat dalam proses perpanjangan riksa uji PJK3.</td>
                </tr>
                <tr>
                  <td className="border border-slate-900 p-2 font-bold">Manajemen Limbah B3 (14001)</td>
                  <td className="border border-slate-900 p-2 text-center font-black text-emerald-800">100% On-Track</td>
                  <td className="border border-slate-900 p-2">Limbah oli hidrolik dan majun tercatat di neraca manifest resmi pihak ketiga berizin KLHK.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Strategic Narrative */}
          <div className="border border-slate-900 p-4 bg-slate-50 space-y-2 text-xs">
            <h3 className="font-black uppercase tracking-wider text-slate-900">2. Pernyataan & Tindakan Strategis Manajemen</h3>
            <p className="leading-relaxed text-justify text-slate-800">
              Operasional PT. Syspex Kemasindo selama periode {selectedPeriod} berhasil mempertahankan status **Zero Accident** dengan pencapaian {kpiData.safeHours} jam kerja aman. Sistem pelaporan Hazard Hunting mencatatkan partisipasi proaktif lapangan dengan tingkat penutupan temuan sebesar {kpiData.capaRate}%. Tidak ada sanksi atau surat peringatan dari otoritas ketenagakerjaan maupun pengawas lingkungan.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs font-bold border-t-2 border-slate-900">
            <div>
              <p className="uppercase text-slate-500 mb-14">{t.sign_hse}</p>
              <div className="border-b-2 border-slate-900 w-3/4 mx-auto mb-1"></div>
              <p className="text-slate-900 font-black">HSE Manager</p>
            </div>
            <div>
              <p className="uppercase text-slate-500 mb-14">{t.sign_dir}</p>
              <div className="border-b-2 border-slate-900 w-3/4 mx-auto mb-1"></div>
              <p className="text-slate-900 font-black">Operational Director</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
