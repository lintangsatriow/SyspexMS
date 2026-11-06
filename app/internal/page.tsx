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
  const [activeTab, setActiveTab] = useState<'overview' | 'manhours' | 'embed'>('overview')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Data Rujukan KPI Spreadsheet HSE
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bersih & Logo Resmi Syspex */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3">
            {/* Logo Resmi Syspex dari Folder Public */}
            <div className="flex items-center">
              <img
                src="/Syspex%20Logo%20(Trademark)%20black.png"
                alt="Syspex Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            {/* Judul Dashboard & Subteks */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                HSE Performance &amp; Operations Command Center
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pusat kendali metrik K3, audit kepatuhan lapangan, dan mitigasi temuan bahaya (CAPA).
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              <span>Buka Google Sheet</span>
              <span>&rarr;</span>
            </a>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Halaman Publik
            </Link>
          </div>

        </div>
      </div>

      {/* 4 Kartu Metrik KPI Korporat */}
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
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Nihil Kasus Kecelakaan Berat</span>
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
            <div className="bg-slate-900 h-full rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Navigasi Tab Minimalis Monokrom */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview &amp; CAPA
        </button>
        <button
          onClick={() => setActiveTab('manhours')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'manhours' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rekap Man-Hours
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'embed' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Live Google Sheet
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CAPA */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600">Daftar temuan bahaya aktif operasional dan status mitigasi (CAPA):</span>
            
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
                        item.riskLevel === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                        item.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
                        'bg-slate-100 text-slate-700 border border-slate-200'
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
                        item.status === 'Closed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        item.status === 'On Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
                        'bg-red-50 text-red-700 border border-red-200'
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

      {/* TAB 2: REKAP MAN-HOURS BULANAN */}
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
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {row.manHours} Jam
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE GOOGLE SHEET */}
      {activeTab === 'embed' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Lembar Kerja Google Sheets Terintegrasi:</span>
            <a 
              href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 font-bold hover:underline"
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
