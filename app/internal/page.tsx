"use client"

import { useState, useEffect } from 'react'
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
  headcount: string
  manDays: string
  manHours: string
}

export default function InternalDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'manhours' | 'embed'>('overview')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  
  // Simulasi UI States (R-27)
  const [uiState, setUiState] = useState<'loading' | 'error' | 'empty' | 'success'>('success')

  // Temuan #1: Menggunakan placeholder jujur untuk data yang belum terhubung
  const kpiData = {
    safeManHours: '[REAL DATA]',
    totalManDays: '[REAL DATA]',
    zeroLtiDays: '[REAL DATA]',
    activeHazards: '[REAL DATA]',
    capaClosureRate: '[REAL DATA]',
  }

  // Data disimulasikan kosong jika state 'empty'
  const actionItems: HazardActionItem[] = uiState === 'success' ? [
    {
      id: '[REAL DATA]',
      location: '[REAL DATA]',
      category: 'Machinery',
      action: '[REAL DATA]',
      pic: '[REAL DATA]',
      deadline: '[REAL DATA]',
      status: 'New',
      riskLevel: 'High'
    }
  ] : []

  const monthlyHours: MonthlyData[] = uiState === 'success' ? [
    { month: '[REAL DATA]', headcount: '[REAL DATA]', manDays: '[REAL DATA]', manHours: '[REAL DATA]' }
  ] : []

  const filteredItems = statusFilter === 'All' 
    ? actionItems 
    : actionItems.filter(item => item.status === statusFilter)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dev Toggle untuk menguji R-27 (UI States) */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex gap-2 items-center text-xs">
        <strong className="text-slate-600">Test UI States (R-27):</strong>
        <button onClick={() => setUiState('loading')} className={`px-2 py-1 rounded ${uiState === 'loading' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>Loading</button>
        <button onClick={() => setUiState('error')} className={`px-2 py-1 rounded ${uiState === 'error' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>Error</button>
        <button onClick={() => setUiState('empty')} className={`px-2 py-1 rounded ${uiState === 'empty' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>Empty</button>
        <button onClick={() => setUiState('success')} className={`px-2 py-1 rounded ${uiState === 'success' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>Data Terisi</button>
      </div>

      {/* Corporate Header - Syspex Indonesia */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <img
                src="/Syspex%20Logo%20(Trademark)%20black.png"
                alt="Syspex Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                HSE Performance &amp; Operations Command Center
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pusat kendali metrik K3, audit kepatuhan lapangan, dan mitigasi temuan bahaya (CAPA).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Temuan #5: Menghapus panah dekoratif */}
            <a
              href="https://docs.google.com/spreadsheets/d/1DwxuMly4ADF4wEA8Hr8v0V_GoF3cfQeSg93gC3pVHxs/edit?gid=83670053#gid=83670053"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              Buka Google Sheet
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

      {/* 4 Kartu Metrik KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {uiState === 'loading' ? (
          <div className="col-span-full p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
            Mengambil data metrik...
          </div>
        ) : uiState === 'error' ? (
          <div className="col-span-full p-8 text-center text-sm text-red-600 bg-red-50 rounded-2xl border border-red-200">
            Gagal memuat data metrik. Periksa koneksi ke Google Sheets.
          </div>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Safe Man-Hours</span>
              <div className="text-2xl font-extrabold font-mono text-slate-900 truncate">{kpiData.safeManHours}</div>
              <span className="text-xs text-slate-500 mt-1 block">Total Man-Days: {kpiData.totalManDays}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Zero LTI Milestone</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 truncate">{kpiData.zeroLtiDays}</div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">Nihil Kasus Kecelakaan Berat</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Active Hazards</span>
              <div className="text-2xl font-extrabold font-mono text-amber-600 truncate">{kpiData.activeHazards}</div>
              <span className="text-xs text-amber-700 font-medium mt-1 block">Temuan Aktif</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">CAPA Closure Rate</span>
              <div className="text-2xl font-extrabold font-mono text-slate-900 truncate">{kpiData.capaClosureRate}</div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Overview &amp; CAPA
        </button>
        <button
          onClick={() => setActiveTab('manhours')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'manhours' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Rekap Man-Hours
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
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${statusFilter === status ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
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
                {uiState === 'loading' && (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-500">Memuat data temuan...</td></tr>
                )}
                {uiState === 'error' && (
                  <tr><td colSpan={6} className="py-8 text-center text-red-600">Gagal memuat data. Silakan coba lagi.</td></tr>
                )}
                {(uiState === 'empty' || (uiState === 'success' && filteredItems.length === 0)) && (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-500">Tidak ada temuan bahaya yang tercatat.</td></tr>
                )}
                {uiState === 'success' && filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3.5 px-4"><strong className="text-slate-900 block text-xs">{item.location}</strong></td>
                    <td className="py-3.5 px-4">{item.action}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.pic}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{item.deadline}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
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
                {uiState === 'loading' && <tr><td colSpan={4} className="py-8 text-center text-slate-500">Memuat rekap...</td></tr>}
                {uiState === 'error' && <tr><td colSpan={4} className="py-8 text-center text-red-600">Gagal memuat rekap.</td></tr>}
                {uiState === 'empty' && <tr><td colSpan={4} className="py-8 text-center text-slate-500">Belum ada rekap jam kerja.</td></tr>}
                {uiState === 'success' && monthlyHours.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.month}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{row.headcount}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.manDays}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">{row.manHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
