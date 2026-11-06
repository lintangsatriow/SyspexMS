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
            {/* Logo Resmi Syspex (Vektor Presisi Sesuai Berkas Trademark) */}
            <div className="flex items-center">
              <svg 
                viewBox="0 0 680 145" 
                className="h-10 sm:h-12 w-auto max-w-[280px] sm:max-w-[340px]" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ikon Persegi S Hexagon / Interlock - Toska #00A99D */}
                <g fill="#00A99D">
                  <path d="M12.5 0C5.6 0 0 5.6 0 12.5V85.2C0 88.5 1.3 91.7 3.7 94L66.7 141.4C70.6 144.3 75.4 145 79.8 143.5L88 140.6V117.8L35.2 78.1C32.8 76.3 31.4 73.5 31.4 70.5V23.5H78.3V46.9H101.8V12.5C101.8 5.6 96.2 0 89.3 0H12.5Z" />
                  <path d="M89.3 144.8C96.2 144.8 101.8 139.2 101.8 132.3V59.6C101.8 56.3 100.5 53.1 98.1 50.8L35.1 3.4C31.2 0.5 26.4 -0.2 22 1.3L13.8 4.2V27L66.6 66.7C69 68.5 70.4 71.3 70.4 74.3V121.3H23.5V97.9H0V132.3C0 139.2 5.6 144.8 12.5 144.8H89.3Z" />
                </g>

                {/* Tipografi Huruf 'SYSPEX' - Hitam Pekat #1F1B1E */}
                <g fill="#1F1B1E">
                  {/* S */}
                  <path d="M141.6 44.8C141.6 30.6 153.2 19 167.4 19H226.3C240.5 19 252.1 30.6 252.1 44.8V64.6H170.8V74.4H222.9C239 74.4 252.1 87.5 252.1 103.6V118.8C252.1 133 240.5 144.6 226.3 144.6H167.4C153.2 144.6 141.6 133 141.6 118.8V98.8H222.9V89.2H170.8C154.7 89.2 141.6 76.1 141.6 60V44.8ZM170.8 49.6H222.9V44.8C222.9 42.9 221.4 41.4 219.5 41.4H174.2C172.3 41.4 170.8 42.9 170.8 44.8V49.6ZM222.9 114H170.8V118.8C170.8 120.7 172.3 122.2 174.2 122.2H219.5C221.4 122.2 222.9 120.7 222.9 118.8V114Z" />
                  {/* Y */}
                  <path d="M266.3 19H295.5V72.4L332.9 19H363.3L314.1 85.2V144.6H284.9V85.2L266.3 19Z" />
                  {/* S */}
                  <path d="M377.2 44.8C377.2 30.6 388.8 19 403 19H461.9C476.1 19 487.7 30.6 487.7 44.8V64.6H406.4V74.4H458.5C474.6 74.4 487.7 87.5 487.7 103.6V118.8C487.7 133 476.1 144.6 461.9 144.6H403C388.8 144.6 377.2 133 377.2 118.8V98.8H458.5V89.2H406.4C390.3 89.2 377.2 76.1 377.2 60V44.8ZM406.4 49.6H458.5V44.8C458.5 42.9 457 41.4 455.1 41.4H409.8C407.9 41.4 406.4 42.9 406.4 44.8V49.6ZM458.5 114H406.4V118.8C406.4 120.7 407.9 122.2 409.8 122.2H455.1C457 122.2 458.5 120.7 458.5 118.8V114Z" />
                  {/* P */}
                  <path d="M502 19H561C575.2 19 586.8 30.6 586.8 44.8V79.6C586.8 93.8 575.2 105.4 561 105.4H531.2V144.6H502V19ZM531.2 83H557.6C559.5 83 561 81.5 561 79.6V44.8C561 42.9 559.5 41.4 557.6 41.4H531.2V83Z" />
                  {/* E */}
                  <path d="M601 19H678.8V41.4H630.2V68.2H668.6V90.6H630.2V122.2H678.8V144.6H601V19Z" />
                  {/* X */}
                  <path d="M691.5 19H720.8L752.6 67.5L784.4 19H813.7L767.3 81.8L815.1 144.6H785.8L752.6 96.1L719.4 144.6H690.1L737.9 81.8L691.5 19Z" />
                </g>

                {/* Simbol Trademark Registered ® - Toska #00A99D */}
                <g fill="#00A99D">
                  <path d="M830.5 4C821.9 4 815 10.9 815 19.5C815 28.1 821.9 35 830.5 35C839.1 35 846 28.1 846 19.5C846 10.9 839.1 4 830.5 4ZM830.5 32.2C823.5 32.2 817.8 26.5 817.8 19.5C817.8 12.5 823.5 6.8 830.5 6.8C837.5 6.8 843.2 12.5 843.2 19.5C843.2 26.5 837.5 32.2 830.5 32.2ZM825.2 11.2H831.6C834.4 11.2 836.5 12.6 836.5 15.2C836.5 16.9 835.3 18.2 833.6 18.7L836.8 26.8H833.6L830.7 19.5H827.8V26.8H825.2V11.2ZM827.8 17.3H831.3C832.6 17.3 833.8 16.6 833.8 15.3C833.8 13.9 832.6 13.3 831.3 13.3H827.8V17.3Z" />
                </g>
              </svg>
            </div>

            {/* Judul Dashboard & Subteks Ringkas */}
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
