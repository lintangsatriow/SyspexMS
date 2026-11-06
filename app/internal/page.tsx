"use client"

import { useState } from 'react'
import Link from 'next/link'

interface HazardActionItem {
  id: string
  location: string
  category: string
  action: string
  pic: string
  deadline: string
  status: 'New' | 'On Progress' | 'Closed'
  riskLevel: 'Low' | 'Medium' | 'High'
}

interface MonthlyData {
  month: string
  headcount: number
  manDays: string
  manHours: string
}

export default function InternalDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'racking' | 'lifting' | 'safetytalk' | 'manhours' | 'embed'>('overview')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // --- State: Racking SWL Calculator ---
  const [palletWeight, setPalletWeight] = useState<number>(1000)
  const [palletsPerLevel, setPalletsPerLevel] = useState<number>(2)
  const [numberOfLevels, setNumberOfLevels] = useState<number>(4)
  const [beamLength, setBeamLength] = useState<number>(2700)
  const [beamRatedSwl, setBeamRatedSwl] = useState<number>(2500)
  const [uprightFrameCapacity, setUprightFrameCapacity] = useState<number>(12000)
  const [safetyFactor, setSafetyFactor] = useState<number>(1.5)

  const totalLoadPerLevel = palletWeight * palletsPerLevel
  const totalBayLoad = totalLoadPerLevel * numberOfLevels
  const beamUtilization = (totalLoadPerLevel / (beamRatedSwl || 1)) * 100
  const uprightUtilization = (totalBayLoad / (uprightFrameCapacity || 1)) * 100
  const maxDeflectionMm = beamLength / 200

  // --- State: Lifting Plan & CoG Calculator ---
  const [netLoad, setNetLoad] = useState<number>(18.5)
  const [contingencyFactor, setContingencyFactor] = useState<number>(1.1)
  const [riggingWeight, setRiggingWeight] = useState<number>(1.2)
  const [spanL, setSpanL] = useState<number>(6.0)
  const [distAtoCoG, setDistAtoCoG] = useState<number>(2.4)
  const [slingAngle, setSlingAngle] = useState<number>(60)
  const [craneCapacity, setCraneCapacity] = useState<number>(35.0)

  const validSpan = spanL > 0 ? spanL : 0.1
  const clampedD1 = Math.min(Math.max(distAtoCoG, 0), validSpan)
  const totalGrossLoad = (netLoad * contingencyFactor) + riggingWeight
  const loadA = totalGrossLoad * ((validSpan - clampedD1) / validSpan)
  const loadB = totalGrossLoad * (clampedD1 / validSpan)
  const angleRad = (slingAngle * Math.PI) / 180
  const sinAngle = Math.sin(angleRad) > 0 ? Math.sin(angleRad) : 0.01
  const tensionA = loadA / sinAngle
  const tensionB = loadB / sinAngle
  const craneUtilization = (totalGrossLoad / (craneCapacity || 1)) * 100

  // --- Data Rujukan KPI Spreadsheet HSE ---
  const kpiData = {
    safeManHours: '177,530',
    totalManDays: '32,661',
    zeroLtiDays: '365 Hari',
    activeHazards: 3,
    capaClosureRate: '40.0%',
  }

  const actionItems: HazardActionItem[] = [
    {
      id: 'HZ-003',
      location: 'Workshop C',
      category: 'Machinery',
      action: 'Kencangkan baut cover mesin gerinda & pasang lock washer',
      pic: 'John D.',
      deadline: '10 Nov 2026',
      status: 'New',
      riskLevel: 'High'
    },
    {
      id: 'HZ-004',
      location: 'Loading Dock',
      category: 'Housekeeping',
      action: 'Bersihkan ceceran oli & sediakan spill kit tambahan',
      pic: 'Agus S.',
      deadline: '08 Nov 2026',
      status: 'On Progress',
      riskLevel: 'Medium'
    },
    {
      id: 'HZ-005',
      location: 'Office Lt 2',
      category: 'Ergonomics',
      action: 'Pasang cable ducting pelindung instalasi lantai',
      pic: 'Sarah M.',
      deadline: '09 Nov 2026',
      status: 'New',
      riskLevel: 'Low'
    },
    {
      id: 'HZ-001',
      location: 'Warehouse A',
      category: 'Housekeeping',
      action: 'Rapikan palet keluar dari koridor darurat ke rak simpan',
      pic: 'John D.',
      deadline: '05 Okt 2026',
      status: 'Closed',
      riskLevel: 'Medium'
    },
    {
      id: 'HZ-002',
      location: 'Warehouse B',
      category: 'PPE',
      action: 'Teguran tertulis & briefing disiplin mandatory helm',
      pic: 'Sarah M.',
      deadline: '12 Okt 2026',
      status: 'Closed',
      riskLevel: 'High'
    }
  ]

  const monthlyHours: MonthlyData[] = [
    { month: 'Oktober 2026', headcount: 123, manDays: '3,701', manHours: '22,215.15' },
    { month: 'September 2026', headcount: 117, manDays: '3,411', manHours: '21,036.89' },
    { month: 'Agustus 2026', headcount: 113, manDays: '3,462', manHours: '18,125.41' },
    { month: 'Juli 2026', headcount: 111, manDays: '3,374', manHours: '20,976.98' },
    { month: 'Juni 2026', headcount: 107, manDays: '3,224', manHours: '16,812.79' },
    { month: 'Mei 2026', headcount: 108, manDays: '3,311', manHours: '15,726.17' }
  ]

  const filteredItems = statusFilter === 'All' 
    ? actionItems 
    : actionItems.filter(item => item.status === statusFilter)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 -m-4 sm:-m-6 p-4 sm:p-8 space-y-6">
      
      {/* Header Utama Workspace */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            🔒 Private Workspace &bull; AllAboutHSE Internal Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated HSE &amp; Engineering Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring performa K3, kalkulator operasional fabrikasi racking, lifting plan, dan briefing harian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <span>📊</span>
            <span>Buka Google Sheet</span>
          </a>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Portal Publik
          </Link>
        </div>
      </div>

      {/* 4 Kartu Ringkasan KPI K3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Safe Man-Hours</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">{kpiData.safeManHours}</span>
            <span className="text-xs font-bold text-emerald-600">Jam</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Total Man-Days: {kpiData.totalManDays}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Zero LTI Milestone</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">{kpiData.zeroLtiDays}</span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">✓ Nihil Kasus Kecelakaan Berat</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Active Hazards</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">{kpiData.activeHazards}</span>
            <span className="text-xs font-bold text-slate-500">Temuan</span>
          </div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">2 New &bull; 1 On Progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">CAPA Closure Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">{kpiData.capaClosureRate}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 border border-slate-200/60">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Navigasi Tab Internal Hub */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          📌 Overview &amp; CAPA
        </button>
        <button
          onClick={() => setActiveTab('racking')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'racking' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>📦</span>
          <span>SWL Racking</span>
        </button>
        <button
          onClick={() => setActiveTab('lifting')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'lifting' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>🏗️</span>
          <span>Lifting Plan &amp; CoG</span>
        </button>
        <button
          onClick={() => setActiveTab('safetytalk')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'safetytalk' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>📢</span>
          <span>Safety Talk Briefing</span>
        </button>
        <button
          onClick={() => setActiveTab('manhours')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'manhours' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          🕒 Rekap Man-Hours
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'embed' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          📑 Live Google Sheet
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CAPA */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600">Daftar tindak lanjut perbaikan temuan bahaya aktif:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'New', 'On Progress', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    statusFilter === status ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Hazard ID</th>
                  <th className="py-3 px-4">Lokasi &amp; Kategori</th>
                  <th className="py-3 px-4">Tindakan Perbaikan (CAPA)</th>
                  <th className="py-3 px-4">PIC</th>
                  <th className="py-3 px-4">Target Selesai</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.id}
                      <span className={`block text-[9px] font-bold uppercase px-2 py-0.5 rounded w-max mt-1 ${
                        item.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                        item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Risk: {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <strong className="text-slate-900 block text-xs">{item.location}</strong>
                      <span className="text-[11px] text-slate-500">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm sm:max-w-md">
                      <p className="leading-relaxed text-slate-700">{item.action}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{item.pic}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{item.deadline}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === 'Closed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'On Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FITUR INTERNAL SWL RACKING */}
      {activeTab === 'racking' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Engineering Check: Safe Working Load (SWL) Racking</h2>
              <p className="text-xs text-slate-500">Verifikasi beban balok beam dan kolom tegak upright sesuai standar EN 15512 / RMI.</p>
            </div>
            <Link
              href="/racking-swl"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Buka Halaman Cetak Pelat Beban</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berat per Pallet (kg)</label>
                  <input
                    type="number"
                    value={palletWeight}
                    onChange={(e) => setPalletWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pallet per Tingkat</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={palletsPerLevel}
                    onChange={(e) => setPalletsPerLevel(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jumlah Beam Level</label>
                  <input
                    type="number"
                    value={numberOfLevels}
                    onChange={(e) => setNumberOfLevels(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Panjang Beam (mm)</label>
                  <input
                    type="number"
                    value={beamLength}
                    onChange={(e) => setBeamLength(parseFloat(e.target.value) || 1000)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rated SWL Beam (kg)</label>
                  <input
                    type="number"
                    value={beamRatedSwl}
                    onChange={(e) => setBeamRatedSwl(parseFloat(e.target.value) || 500)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kapasitas Upright Frame (kg)</label>
                  <input
                    type="number"
                    value={uprightFrameCapacity}
                    onChange={(e) => setUprightFrameCapacity(parseFloat(e.target.value) || 1000)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-2">
                Hasil Kalkulasi Racking Internal
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Beban per Tingkat (UDL)</span>
                  <span className="text-xl font-black font-mono text-slate-900">{totalLoadPerLevel.toLocaleString()} kg</span>
                  <span className={`block text-[10px] font-bold mt-1 ${beamUtilization > 100 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Utilisasi: {beamUtilization.toFixed(1)}% {beamUtilization > 100 ? '(OVERLOAD)' : '(Aman)'}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Beban 1 Bay</span>
                  <span className="text-xl font-black font-mono text-slate-900">{totalBayLoad.toLocaleString()} kg</span>
                  <span className={`block text-[10px] font-bold mt-1 ${uprightUtilization > 100 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Utilisasi: {uprightUtilization.toFixed(1)}% {uprightUtilization > 100 ? '(OVERLOAD)' : '(Aman)'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Batas Lendutan Balok (L / 200):</span>
                  <strong className="font-mono text-slate-900">{maxDeflectionMm.toFixed(1)} mm</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Design Safety Factor:</span>
                  <strong className="font-mono text-emerald-700">{safetyFactor} : 1</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FITUR INTERNAL LIFTING PLAN & COG */}
      {activeTab === 'lifting' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Critical Lifting &amp; CoG Verification</h2>
              <p className="text-xs text-slate-500">Kalkulasi pembagian beban 2 sling leg dan batas utilisasi kapasitas crane.</p>
            </div>
            <Link
              href="/lifting-plan"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Buka Formulir Lapangan Lengkap</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Net Load (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={netLoad}
                    onChange={(e) => setNetLoad(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rigging + Hook (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={riggingWeight}
                    onChange={(e) => setRiggingWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Span L (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={spanL}
                    onChange={(e) => setSpanL(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jarak A ke CoG (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distAtoCoG}
                    onChange={(e) => setDistAtoCoG(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sudut Sling (&deg;)</label>
                  <input
                    type="number"
                    min="30"
                    max="90"
                    value={slingAngle}
                    onChange={(e) => setSlingAngle(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kapasitas Crane di Radius Kerja (Ton)</label>
                <input
                  type="number"
                  step="0.5"
                  value={craneCapacity}
                  onChange={(e) => setCraneCapacity(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-2">
                Output Pengangkatan Kritis
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tegangan Sling Leg A</span>
                  <span className="text-xl font-black font-mono text-amber-700">{tensionA.toFixed(2)} Ton</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Beban Statis: {loadA.toFixed(2)} Ton</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tegangan Sling Leg B</span>
                  <span className="text-xl font-black font-mono text-amber-700">{tensionB.toFixed(2)} Ton</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Beban Statis: {loadB.toFixed(2)} Ton</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">Utilisasi Kapasitas Crane:</span>
                  <span className="text-lg font-black font-mono text-slate-900">{craneUtilization.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full ${craneUtilization > 85 ? 'bg-red-500' : craneUtilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(craneUtilization, 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Total Gross Load: <strong>{totalGrossLoad.toFixed(2)} Ton</strong> dari kapasitas <strong>{craneCapacity} Ton</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FITUR INTERNAL SAFETY TALK BRIEFING */}
      {activeTab === 'safetytalk' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Materi Toolbox Meeting (TBM) Mandor &amp; Supervisor</h2>
              <p className="text-xs text-slate-500">Bahan briefing 5 menit berbasis critical hazards sebelum shift kerja dimulai.</p>
            </div>
            <Link
              href="/safety-talk"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Buka Modul TBM Lengkap</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Ketinggian</span>
              <h3 className="text-xs font-bold text-slate-900">Bekerja di Ketinggian &amp; Full Body Harness</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Inspeksi 100% pre-use harness, 100% tie-off dengan double lanyard, dan verifikasi titik angkur 22 kN.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Alat Berat</span>
              <h3 className="text-xs font-bold text-slate-900">Mitigasi Blind Spot Truk &amp; Forklift</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Kontak mata langsung sebelum mendekat, rompi Hi-Vis wajib terpasang rapi, dan spotter saat manuver mundur.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Kelistrikan</span>
              <h3 className="text-xs font-bold text-slate-900">Disiplin Isolasi Energi Bahaya (LOTO)</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Satu pekerja satu gembok, lakukan pelepasan sisa energi dan verifikasi Zero Energy State sebelum maintenance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REKAP MAN-HOURS BULANAN */}
      {activeTab === 'manhours' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Akumulasi Jam Kerja Karyawan (Man-Hours 2026)
            </span>
            <span className="text-xs text-slate-500 font-medium">10 Bulan Tercatat</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bulan</th>
                  <th className="py-3 px-4">Headcount (Pekerja)</th>
                  <th className="py-3 px-4">Total Man-Days</th>
                  <th className="py-3 px-4 text-right">Total Man-Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {monthlyHours.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.month}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{row.headcount} Orang</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.manDays}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      {row.manHours} Jam
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: EMBED GOOGLE SHEET LANGSUNG */}
      {activeTab === 'embed' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Lembar Kerja Google Sheets Terintegrasi:</span>
            <a 
              href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline"
            >
              Buka di Tab Baru &rarr;
            </a>
          </div>
          <div className="w-full h-[650px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
            <iframe
              src="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/preview"
              width="100%"
              height="100%"
              className="border-0"
              title="Google Sheet HSE Dashboard"
            />
          </div>
        </div>
      )}

    </div>
  )
}
