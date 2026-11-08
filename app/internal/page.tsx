"use client"

import { useState } from 'react'
import Link from 'next/link'

interface CapaItem {
  id: string
  area: string
  finding: string
  riskLevel: 'High' | 'Medium' | 'Low'
  pic: string
  targetDate: string
  status: 'Open' | 'In Progress' | 'Closed'
}

interface ActivePtw {
  id: string
  type: string
  area: string
  operator: string
  validUntil: string
  status: 'Active' | 'Review'
}

export default function InternalDashboardPage() {
  // Metrik KPI K3 Akumulatif
  const [safeManHours] = useState<number>(342850)
  const [daysWithoutLti] = useState<number>(418)
  const [openFindingsCount] = useState<number>(3)
  const [activePtwCount] = useState<number>(2)

  // Data Tabel CAPA (Temuan Bahaya Lapangan)
  const [capaList, setCapaList] = useState<CapaItem[]>([
    {
      id: 'CAPA-2026-081',
      area: 'Gudang Packaging Blok B',
      finding: 'Safety Locking Pin pada balok racking bay 4 terlepas setelah aktivitas forklift.',
      riskLevel: 'High',
      pic: 'Agus Santoso',
      targetDate: '2026-11-09',
      status: 'Open'
    },
    {
      id: 'CAPA-2026-082',
      area: 'Fabrikasi & Assembly',
      finding: 'Kabel power mesin strapping otomatis terkelupas di dekat jalur lalu lintas pekerja.',
      riskLevel: 'High',
      pic: 'Rudi Hartono',
      targetDate: '2026-11-08',
      status: 'In Progress'
    },
    {
      id: 'CAPA-2026-083',
      area: 'Loading Dock 2',
      finding: 'Marka pedestrian line (jalur pejalan kaki) pudar tertutup debu forklift.',
      riskLevel: 'Low',
      pic: 'Hendra Setiawan',
      targetDate: '2026-11-12',
      status: 'In Progress'
    },
    {
      id: 'CAPA-2026-080',
      area: 'Area Scaffolding Luar',
      finding: 'Papan catwalk tingkat 2 bergeser; pengikat kawat bendrat belum dipasang.',
      riskLevel: 'Medium',
      pic: 'Budi Prasetyo',
      targetDate: '2026-11-06',
      status: 'Closed'
    }
  ])

  // Data Logbook PTW Aktif Hari Ini
  const [ptwList] = useState<ActivePtw[]>([
    {
      id: 'PTW-CR-014',
      type: 'Lifting Plan (Overhead Crane)',
      area: 'Assembly Bay 1',
      operator: 'Joko Widodo (SIO Valid)',
      validUntil: '17:00 WIB',
      status: 'Active'
    },
    {
      id: 'PTW-FK-028',
      type: 'Forklift Extension (Pallet Panjang)',
      area: 'Logistics Warehouse',
      operator: 'Dedi Kurniawan (SIO Valid)',
      validUntil: '16:30 WIB',
      status: 'Active'
    }
  ])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Fungsional Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Dashboard Eksekutif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard KPI &amp; Operasional HSE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Pemantauan langsung metrik jam kerja selamat (Lagging), mitigasi temuan lapangan (CAPA), serta status izin kerja berbahaya aktif di fasilitas Syspex.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/safety-talk"
            className="px-3.5 py-2 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
          >
            + Briefing Baru
          </Link>
          <Link
            href="/induction"
            className="px-3.5 py-2 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm"
          >
            + Tamu / Vendor
          </Link>
        </div>
      </div>

      {/* Grid 4 Kartu KPI Utama (Scorecard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Safe Man-Hours */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Jam Kerja Aman (YTD)</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black uppercase">Zero LTI</span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {safeManHours.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">Jam</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
            Akumulasi aman seluruh kru &amp; teknisi lapangan.
          </p>
        </div>

        {/* Metric 2: Zero Accident Streak */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Hari Tanpa Kecelakaan</span>
            <span className="text-slate-400 font-mono text-xs">Target: 500</span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {daysWithoutLti}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">Hari Berturut-turut</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(daysWithoutLti / 500) * 100}%` }}></div>
          </div>
        </div>

        {/* Metric 3: Temuan Bahaya (CAPA) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Temuan Terbuka (CAPA)</span>
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-black uppercase">Perlu Tindakan</span>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-600 font-mono tracking-tight">
              {openFindingsCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">Item Terbuka / Proses</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
            2 item prioritas tinggi (*Pinch Point &amp; Racking*).
          </p>
        </div>

        {/* Metric 4: Izin Kerja Aktif */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Izin Kerja Berbahaya (PTW)</span>
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-black uppercase">Live Shift</span>
          </div>
          <div>
            <span className="text-3xl font-black text-blue-600 font-mono tracking-tight">
              {activePtwCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-bold">Pengangkatan Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
            Seluruh SIO operator &amp; SILO unit telah terverifikasi.
          </p>
        </div>

      </div>

      {/* Baris Kedua: Monitoring Modul Teknis & PTW Aktif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri (8 Col): Tabel CAPA (Pelacakan Bahaya) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Pelacakan Tindakan Perbaikan (CAPA Log)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Catatan temuan inspeksi lapangan, tingkat keparahan, dan target perbaikan.</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                Total: {capaList.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">ID &amp; Area</th>
                    <th className="py-2.5 px-3 font-bold">Deskripsi Temuan Bahaya</th>
                    <th className="py-2.5 px-3 font-bold text-center">Risiko</th>
                    <th className="py-2.5 px-3 font-bold">PIC &amp; Batas Waktu</th>
                    <th className="py-2.5 px-3 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {capaList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                        <span className="text-[10px] text-slate-500 block">{item.area}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs leading-relaxed text-slate-800">
                        {item.finding}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          item.riskLevel === 'High' ? 'bg-red-50 text-red-600 border border-red-200' :
                          item.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{item.pic}</span>
                        <span className="text-[10px] font-mono text-slate-500 block">{item.targetDate}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          item.status === 'Open' ? 'bg-red-100 text-red-700' :
                          item.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
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

        {/* Kolom Kanan (4 Col): Izin Kerja Berbahaya (PTW) & Health Check */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Panel Live PTW */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live Izin Angkat (PTW)
              </h2>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-3">
              {ptwList.map((ptw) => (
                <div key={ptw.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono font-bold text-slate-600">{ptw.id}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">{ptw.status}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{ptw.type}</h3>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>Lokasi: <span className="font-bold text-slate-700">{ptw.area}</span></p>
                    <p>Operator: <span className="font-bold text-slate-700">{ptw.operator}</span></p>
                    <p>Berlaku Sampai: <span className="font-mono font-bold text-slate-800">{ptw.validUntil}</span></p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/lifting-plan"
              className="block w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center rounded text-xs font-bold transition mt-2"
            >
              Buka Modul Lifting Plan &rarr;
            </Link>
          </div>

          {/* Panel Audit Status Modul Teknis */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              Status Verifikasi Modul Teknis
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Racking SWL Engine</span>
                <span className="text-emerald-400 font-bold font-mono">EN 15620 (L/200)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lifting Plan &amp; CoG</span>
                <span className="text-emerald-400 font-bold font-mono">ASME B30.9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Scaffolding Stability</span>
                <span className="text-emerald-400 font-bold font-mono">Permenaker 01/80</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Induction Pass Registry</span>
                <span className="text-emerald-400 font-bold font-mono">Live Sync</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
