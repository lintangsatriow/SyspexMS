"use client"

import { useState } from 'react'
import Link from 'next/link'

interface WasteItem {
  id: string
  wasteCode: string
  wasteName: string
  source: string
  dateIn: string
  qtyIn: number
  dateOut: string | null
  qtyOut: number | null
  balance: number
  manifestNo: string | null
  transporter: string | null
}

export default function EnvLogPage() {
  const [wasteLog] = useState<WasteItem[]>([
    {
      id: 'B3-2026-001',
      wasteCode: 'B105d',
      wasteName: 'Oli Bekas / Used Oil',
      source: 'Maintenance Forklift',
      dateIn: '2026-10-15',
      qtyIn: 50,
      dateOut: '2026-11-01',
      qtyOut: 50,
      balance: 0,
      manifestNo: 'KLHK-MNF-88219',
      transporter: 'PT Prasadha Pamunah'
    },
    {
      id: 'B3-2026-002',
      wasteCode: 'B323-1',
      wasteName: 'Majun Terkontaminasi / Contaminated Rags',
      source: 'Packaging Assembly',
      dateIn: '2026-11-02',
      qtyIn: 15,
      dateOut: null,
      qtyOut: null,
      balance: 15,
      manifestNo: null,
      transporter: null
    },
    {
      id: 'B3-2026-003',
      wasteCode: 'A102d',
      wasteName: 'Aki Bekas / Used Batteries',
      source: 'Logistics Equipment',
      dateIn: '2026-11-05',
      qtyIn: 30,
      dateOut: null,
      qtyOut: null,
      balance: 30,
      manifestNo: null,
      transporter: null
    }
  ])

  const totalBalance = wasteLog.reduce((sum, item) => sum + item.balance, 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header (Bilingual) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">ISO 14001</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hazardous Waste Log (Neraca Limbah B3)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
            <span className="block text-slate-500">EN: Official tracking of hazardous waste generation, storage, and disposal (ISO 14001 Clause 8.1).</span>
            <span className="block mt-0.5">ID: Pelacakan resmi timbulan, penyimpanan, dan pembuangan limbah B3.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm">
            + Input Log B3
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current TPS B3 Balance (Saldo Saat Ini)</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${totalBalance > 100 ? 'text-red-600' : 'text-slate-900'}`}>{totalBalance}</span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Storage Limit (Batas Simpan)</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">180</span>
            <span className="text-xs font-bold text-slate-500">Days / Hari</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest Manifest (Manifest Terakhir)</p>
          <div className="mt-1">
            <span className="text-lg font-black text-emerald-600 font-mono tracking-tight">KLHK-MNF-88219</span>
          </div>
        </div>
      </div>

      {/* Waste Tracking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-bold">Waste Code & Name</th>
                <th className="py-3 px-4 font-bold">Source (Sumber)</th>
                <th className="py-3 px-4 font-bold text-center">IN (Masuk)</th>
                <th className="py-3 px-4 font-bold text-center">OUT (Keluar)</th>
                <th className="py-3 px-4 font-bold text-center">Balance (Saldo)</th>
                <th className="py-3 px-4 font-bold">Transporter & Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {wasteLog.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-red-600 block">{item.wasteCode}</span>
                    <span className="font-bold text-slate-900 block">{item.wasteName}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{item.source}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="block font-bold text-slate-900">{item.qtyIn} kg</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.dateIn}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.qtyOut ? (
                      <>
                        <span className="block font-bold text-slate-900">{item.qtyOut} kg</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.dateOut}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-[11px] font-black ${item.balance > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {item.balance} kg
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.manifestNo ? (
                      <>
                        <span className="font-mono font-bold text-slate-900 block">{item.manifestNo}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{item.transporter}</span>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">Stored at TPS</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
