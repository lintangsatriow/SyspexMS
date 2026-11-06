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
  const [activeTab, setActiveTab] = useState<'overview' | 'capa' | 'manhours' | 'embed'>('overview')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Data diambil dari Spreadsheet HSE Performance Dashboard
  const kpiData = {
    safeManHours: '177,530',
    totalManDays: '32,661',
    zeroLtiDays: '365 Hari',
    activeHazards: 3,
    capaClosureRate: '40.0%',
    weeklySafetyTalk: '100%'
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
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header & Internal Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-[10px] font-bold uppercase tracking-wider mb-2">
            🔒 Private Workspace &bull; Internal HSE Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            HSE Performance Command Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Monitoring metrik K3 real-time, man-hours statistik, dan status mitigasi CAPA operasional lapangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <span>📊</span>
            <span>Buka Google Sheet</span>
          </a>
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-semibold transition"
          >
            Ke Beranda
          </Link>
        </div>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Safe Man-Hours
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900">
              {kpiData.safeManHours}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Jam</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Total Man-Days: <strong>{kpiData.totalManDays}</strong>
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Zero LTI Milestone
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              {kpiData.zeroLtiDays}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            ✓ Nihil Kecelakaan Berat
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Active Hazards
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
              {kpiData.activeHazards}
            </span>
            <span className="text-xs font-semibold text-zinc-500">Temuan</span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            2 New &bull; 1 On Progress
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            CAPA Closure Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900">
              {kpiData.capaClosureRate}
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Navigasi Tab Modul */}
      <div className="flex items-center gap-2 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold transition border-b-2 px-1 ${
            activeTab === 'overview'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Action Items &bull; Active CAPA
        </button>
        <button
          onClick={() => setActiveTab('manhours')}
          className={`pb-3 text-xs font-bold transition border-b-2 px-1 ${
            activeTab === 'manhours'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Monthly Man-Hours Trend
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`pb-3 text-xs font-bold transition border-b-2 px-1 ${
            activeTab === 'embed'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Live Google Sheet Viewer
        </button>
      </div>

      {/* Tab Content 1: Action Items / Active Hazards */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              Menampilkan daftar temuan bahaya aktif dan tindakan perbaikan (CAPA) yang membutuhkan tindak lanjut pengawas:
            </div>
            
            {/* Filter Status */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {['All', 'New', 'On Progress', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                    statusFilter === status
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Hazard ID</th>
                    <th className="py-3 px-4">Lokasi &amp; Kategori</th>
                    <th className="py-3 px-4">Tindakan Perbaikan (CAPA)</th>
                    <th className="py-3 px-4">PIC</th>
                    <th className="py-3 px-4">Target Selesai</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 whitespace-nowrap">
                        {item.id}
                        <span className={`block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded w-max mt-0.5 ${
                          item.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' :
                          item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          Risk: {item.riskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <strong className="text-zinc-900 block">{item.location}</strong>
                        <span className="text-[11px] text-zinc-400">{item.category}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="leading-relaxed line-clamp-2">{item.action}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-900 whitespace-nowrap">
                        {item.pic}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500 whitespace-nowrap">
                        {item.deadline}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Closed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          item.status === 'On Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
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
        </div>
      )}

      {/* Tab Content 2: Monthly Man-Hours */}
      {activeTab === 'manhours' && (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
              Riwayat Akumulasi Jam Kerja Karyawan (Man-Hours 2026)
            </span>
            <span className="text-[11px] text-zinc-400">Total 10 Bulan Tercatat</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bulan</th>
                  <th className="py-3 px-4">Headcount (Pekerja)</th>
                  <th className="py-3 px-4">Total Man-Days</th>
                  <th className="py-3 px-4 text-right">Total Man-Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {monthlyHours.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/70 transition">
                    <td className="py-3 px-4 font-bold text-zinc-900">{row.month}</td>
                    <td className="py-3 px-4 font-mono">{row.headcount} Orang</td>
                    <td className="py-3 px-4 font-mono">{row.manDays}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{row.manHours} Jam</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Embed Google Sheet Langsung */}
      {activeTab === 'embed' && (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Pratinjau Lembar Kerja Google Sheets Terintegrasi:</span>
            <a 
              href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Buka di Tab Baru &rarr;
            </a>
          </div>
          <div className="w-full h-[600px] border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
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
