"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Language = 'ID' | 'EN'

interface HSEMetrics {
  period: string
  safeHours: number
  safeDays: number
  ltiCount: number
  nearMissCount: number
  hazardReported: number
  hazardClosed: number
  totalMheChecked: number
  mheLotoCount: number
  totalLicenses: number
  validLicenses: number
  rackingAuditScore: number
  b3DisposalCompliant: number
  managerRecommendation: string
}

const DEFAULT_METRICS: HSEMetrics = {
  period: '2026-Q4',
  safeHours: 1420800,
  safeDays: 412,
  ltiCount: 0,
  nearMissCount: 14,
  hazardReported: 38,
  hazardClosed: 35,
  totalMheChecked: 12,
  mheLotoCount: 1,
  totalLicenses: 24,
  validLicenses: 23,
  rackingAuditScore: 91.0,
  b3DisposalCompliant: 100,
  managerRecommendation: 'Fokus peremajaan pelindung kolom racking di jalur putar lorong C dan simulasi berkala evakuasi perakitan ASRS.'
}

export default function ExecutiveKPIReportPage() {
  const [lang, setLang] = useState<Language>('ID')
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'BOARD_REPORT'>('DASHBOARD')
  const [showInputPanel, setShowInputPanel] = useState(false)

  const [metrics, setMetrics] = useState<HSEMetrics>(DEFAULT_METRICS)
  const [formData, setFormData] = useState<HSEMetrics>(DEFAULT_METRICS)

  useEffect(() => {
    const saved = localStorage.getItem('syspex_hse_metrics')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMetrics(parsed)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to parse local metrics', e)
      }
    }
  }, [])

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault()
    setMetrics(formData)
    localStorage.setItem('syspex_hse_metrics', JSON.stringify(formData))
    setShowInputPanel(false)
  }

  const handleResetDefault = () => {
    setMetrics(DEFAULT_METRICS)
    setFormData(DEFAULT_METRICS)
    localStorage.removeItem('syspex_hse_metrics')
    setShowInputPanel(false)
  }

  const capaRate = metrics.hazardReported > 0 
    ? Math.round((metrics.hazardClosed / metrics.hazardReported) * 100) 
    : 100
  const mheRate = metrics.totalMheChecked > 0 
    ? Math.round(((metrics.totalMheChecked - metrics.mheLotoCount) / metrics.totalMheChecked) * 100) 
    : 100
  const licRate = metrics.totalLicenses > 0 
    ? Math.round((metrics.validLicenses / metrics.totalLicenses) * 100) 
    : 100

  const overallHseIndex = Math.round(
    (capaRate * 0.3) + 
    (mheRate * 0.3) + 
    (licRate * 0.2) + 
    (metrics.rackingAuditScore * 0.2)
  )

  const dict = {
    ID: {
      tagline: 'Kinerja K3L & Kepatuhan Operasional',
      badge: 'ISO 45001 / 14001 / 9001',
      tab_dash: 'Dashboard',
      tab_report: 'Board Report',
      btn_print: 'Cetak Dokumen',
      btn_input: 'Update Data',
      score_title: 'HSE Health Index',
      score_desc: 'Kalkulasi otomatis basis kepatuhan MHE, audit racking, lisensi, dan resolusi CAPA.',
      sec_core: 'Metrik Utama',
      sec_ops: 'Kepatuhan Operasional',
      sec_legal: 'Kepatuhan Regulasi',
      mhe_title: 'Inspeksi Armada MHE',
      racking_title: 'Integritas Racking & ASRS',
      legal_title: 'Validitas SIO & SILO',
      env_title: 'Kontrol Limbah B3',
      sign_hse: 'HSE Manager',
      sign_dir: 'Operational Director'
    },
    EN: {
      tagline: 'HSE Performance & Operational Compliance',
      badge: 'ISO 45001 / 14001 / 9001',
      tab_dash: 'Dashboard',
      tab_report: 'Board Report',
      btn_print: 'Print Document',
      btn_input: 'Update Data',
      score_title: 'HSE Health Index',
      score_desc: 'Auto-calculated based on MHE pre-op, racking audit, statutory licenses, and CAPA.',
      sec_core: 'Core Metrics',
      sec_ops: 'Operational Compliance',
      sec_legal: 'Statutory Compliance',
      mhe_title: 'MHE Pre-Op Inspection',
      racking_title: 'Racking & ASRS Integrity',
      legal_title: 'SIO & SILO Validity',
      env_title: 'Hazmat (B3) Control',
      sign_hse: 'HSE Manager',
      sign_dir: 'Operational Director'
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Top Header Panel */}
      <div className="border-b border-slate-200 pb-4 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">KPI Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white uppercase tracking-widest">
                {metrics.period}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{t.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowInputPanel(!showInputPanel)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-lg transition border border-slate-300 uppercase tracking-wider"
            >
              {t.btn_input}
            </button>

            <div className="flex bg-slate-200 p-1 rounded-lg border border-slate-300">
              <button 
                onClick={() => setLang('ID')} 
                className={`px-3 py-1 text-xs font-black rounded transition ${lang === 'ID' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('EN')} 
                className={`px-3 py-1 text-xs font-black rounded transition ${lang === 'EN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                EN
              </button>
            </div>

            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition shadow-sm uppercase tracking-wider"
            >
              {t.btn_print}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition ${activeTab === 'DASHBOARD' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {t.tab_dash}
          </button>
          <button
            onClick={() => setActiveTab('BOARD_REPORT')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition ${activeTab === 'BOARD_REPORT' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {t.tab_report}
          </button>
        </div>
      </div>

      {/* INPUT PANEL */}
      {showInputPanel && (
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-xl print:hidden space-y-5 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-teal-400">Data Entry Panel</h2>
            </div>
            <button onClick={() => setShowInputPanel(false)} className="text-slate-400 hover:text-white font-black text-xs uppercase tracking-wider">
              Tutup
            </button>
          </div>

          <form onSubmit={handleSaveMetrics} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Periode</label>
                <input type="text" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Safe Hours</label>
                <input type="number" value={formData.safeHours} onChange={(e) => setFormData({ ...formData, safeHours: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Safe Days</label>
                <input type="number" value={formData.safeDays} onChange={(e) => setFormData({ ...formData, safeDays: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">LTI Count</label>
                <input type="number" value={formData.ltiCount} onChange={(e) => setFormData({ ...formData, ltiCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Hazard Reported</label>
                <input type="number" value={formData.hazardReported} onChange={(e) => setFormData({ ...formData, hazardReported: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Hazard Closed</label>
                <input type="number" value={formData.hazardClosed} onChange={(e) => setFormData({ ...formData, hazardClosed: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Near-Miss</label>
                <input type="number" value={formData.nearMissCount} onChange={(e) => setFormData({ ...formData, nearMissCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Audit Racking (%)</label>
                <input type="number" step="0.1" value={formData.rackingAuditScore} onChange={(e) => setFormData({ ...formData, rackingAuditScore: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">MHE Checked</label>
                <input type="number" value={formData.totalMheChecked} onChange={(e) => setFormData({ ...formData, totalMheChecked: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">MHE LOTO</label>
                <input type="number" value={formData.mheLotoCount} onChange={(e) => setFormData({ ...formData, mheLotoCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Total License</label>
                <input type="number" value={formData.totalLicenses} onChange={(e) => setFormData({ ...formData, totalLicenses: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Valid License</label>
                <input type="number" value={formData.validLicenses} onChange={(e) => setFormData({ ...formData, validLicenses: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white focus:border-teal-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">HSE Recommendation</label>
              <textarea rows={2} value={formData.managerRecommendation} onChange={(e) => setFormData({ ...formData, managerRecommendation: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-medium text-white focus:border-teal-500 outline-none resize-none" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleResetDefault} className="px-4 py-2 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded hover:bg-slate-700 transition">Reset</button>
              <button type="submit" className="px-6 py-2 bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded hover:bg-teal-400 transition">Save Data</button>
            </div>
          </form>
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6 print:hidden">
          
          <div className="bg-slate-950 text-white p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-950/50 text-teal-400 text-[9px] font-black uppercase tracking-widest border border-teal-900">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                {t.badge}
              </div>
              <h2 className="text-3xl font-black tracking-tight">{t.score_title}</h2>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">{t.score_desc}</p>
            </div>

            <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 p-5 rounded-xl self-stretch md:self-auto justify-between min-w-[300px]">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Score</p>
                <p className="text-5xl font-black text-teal-400 tracking-tighter">
                  {overallHseIndex}<span className="text-xl text-slate-600">/100</span>
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-white mt-1">
                  {overallHseIndex >= 90 ? 'EXCELLENCE' : overallHseIndex >= 80 ? 'SATISFACTORY' : 'ACTION REQUIRED'}
                </p>
              </div>
              <div className="text-right border-l border-slate-800 pl-6">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Zero Harm</p>
                <p className="text-3xl font-black text-white">{metrics.safeDays} <span className="text-sm font-bold text-slate-500">D</span></p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{metrics.safeHours.toLocaleString()} HRS</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.sec_core}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Lost Time Injury</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{metrics.ltiCount}</p>
                <span className={`text-[9px] font-black uppercase tracking-wider mt-2 block ${metrics.ltiCount === 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                  {metrics.ltiCount === 0 ? 'ZERO ACCIDENT' : 'INCIDENT RECORDED'}
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Near-Miss</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{metrics.nearMissCount}</p>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-2 block">PROACTIVE LOG</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hazard Reported</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{metrics.hazardReported}</p>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-2 block">{metrics.hazardClosed} CLOSED</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CAPA Rate</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{capaRate}%</p>
                <span className="text-[9px] font-black text-teal-600 uppercase tracking-wider mt-2 block">
                  {capaRate >= 85 ? 'TARGET MET' : 'NEEDS ATTENTION'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.sec_ops}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.mhe_title}</h4>
                  </div>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                    {mheRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div className="bg-slate-900 h-full rounded-full" style={{ width: `${mheRate}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div><p className="text-slate-400 font-bold uppercase">Checked</p><p className="font-black text-slate-900">{metrics.totalMheChecked} Unit</p></div>
                  <div><p className="text-slate-400 font-bold uppercase">LOTO</p><p className="font-black text-slate-900">{metrics.mheLotoCount} Unit</p></div>
                  <div><p className="text-slate-400 font-bold uppercase">Active</p><p className="font-black text-slate-900">{metrics.totalMheChecked - metrics.mheLotoCount} Unit</p></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.racking_title}</h4>
                  </div>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                    {metrics.rackingAuditScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div className="bg-slate-900 h-full rounded-full" style={{ width: `${metrics.rackingAuditScore}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div><p className="text-slate-400 font-bold uppercase">Structure</p><p className="font-black text-slate-900">SWL Verified</p></div>
                  <div><p className="text-slate-400 font-bold uppercase">Tie-Off</p><p className="font-black text-slate-900">100% Req</p></div>
                  <div><p className="text-slate-400 font-bold uppercase">Scaffold</p><p className="font-black text-slate-900">Green Tag</p></div>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.legal_title}</h4>
              <p className="text-3xl font-black text-slate-900 my-1">{licRate}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                {metrics.validLicenses} / {metrics.totalLicenses} Valid
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.env_title}</h4>
              <p className="text-3xl font-black text-slate-900 my-1">{metrics.b3DisposalCompliant}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">ISO 14001 Compliant</p>
            </div>
            <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Recommendation</p>
                <p className="text-xs font-bold leading-relaxed mt-2 text-slate-900">
                  {metrics.managerRecommendation}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* BOARD REPORT TAB (Print) */}
      <div className={`${activeTab === 'BOARD_REPORT' ? 'block' : 'hidden'} print:block w-full text-black bg-white`}>
        <div className="border-4 border-black p-8 w-full max-w-[850px] mx-auto space-y-6">
          
          <div className="flex justify-between items-start border-b-4 border-black pb-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex Logo" className="h-8 w-auto object-contain" />
              <div className="border-l-2 border-black pl-3">
                <h1 className="text-xl font-black uppercase tracking-tight text-black">EXECUTIVE HSE REPORT</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-black">PT. Syspex Kemasindo</p>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold uppercase tracking-wider">
              <p>Doc Ref: SYS-HSE-{metrics.period}</p>
              <p>Period: {metrics.period}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-0 text-center border-2 border-black">
            <div className="p-3 border-r-2 border-black">
              <p className="text-[9px] font-black uppercase tracking-widest text-black">LTI</p>
              <p className="text-3xl font-black">{metrics.ltiCount}</p>
            </div>
            <div className="p-3 border-r-2 border-black">
              <p className="text-[9px] font-black uppercase tracking-widest text-black">Safe Hours</p>
              <p className="text-2xl font-black pt-1">{metrics.safeHours.toLocaleString()}</p>
            </div>
            <div className="p-3 border-r-2 border-black">
              <p className="text-[9px] font-black uppercase tracking-widest text-black">Health Index</p>
              <p className="text-3xl font-black">{overallHseIndex}%</p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-black">CAPA</p>
              <p className="text-3xl font-black">{capaRate}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-2">
              1. Operational Compliance
            </h3>
            <table className="w-full border-collapse border-2 border-black text-xs">
              <thead className="font-black uppercase text-[10px] border-b-2 border-black">
                <tr>
                  <th className="border-r-2 border-black p-2 text-left">Scope</th>
                  <th className="border-r-2 border-black p-2 text-center w-[20%]">Status</th>
                  <th className="p-2 text-left w-[50%]">Notes</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium">
                <tr className="border-b border-black">
                  <td className="border-r-2 border-black p-2 font-black">Forklift & MHE</td>
                  <td className="border-r-2 border-black p-2 text-center font-black">{mheRate}%</td>
                  <td className="p-2">{metrics.totalMheChecked} units checked. {metrics.mheLotoCount} units in LOTO.</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r-2 border-black p-2 font-black">Racking & ASRS</td>
                  <td className="border-r-2 border-black p-2 text-center font-black">{metrics.rackingAuditScore}%</td>
                  <td className="p-2">SWL verified. 100% tie-off enforced.</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r-2 border-black p-2 font-black">Statutory (Kemenaker)</td>
                  <td className="border-r-2 border-black p-2 text-center font-black">{licRate}%</td>
                  <td className="p-2">{metrics.validLicenses} of {metrics.totalLicenses} licenses active.</td>
                </tr>
                <tr>
                  <td className="border-r-2 border-black p-2 font-black">Hazmat (ISO 14001)</td>
                  <td className="border-r-2 border-black p-2 text-center font-black">{metrics.b3DisposalCompliant}%</td>
                  <td className="p-2">Disposal meets manifest requirements.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-2 border-black p-4 space-y-2 text-xs">
            <h3 className="font-black uppercase tracking-widest text-black">2. Executive Summary</h3>
            <p className="font-medium text-justify">
              Period {metrics.period} maintained Zero Accident status with {metrics.safeHours.toLocaleString()} safe man-hours. Hazard Hunting recorded {metrics.hazardReported} findings with {capaRate}% CAPA resolution.
            </p>
            <p className="font-black uppercase mt-2 pt-2 border-t border-black">
              Recommendation: {metrics.managerRecommendation}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs font-black uppercase tracking-widest border-t-2 border-black">
            <div>
              <div className="border-b-2 border-black w-3/4 mx-auto mb-2"></div>
              <p>HSE Manager</p>
            </div>
            <div>
              <div className="border-b-2 border-black w-3/4 mx-auto mb-2"></div>
              <p>Operational Director</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
