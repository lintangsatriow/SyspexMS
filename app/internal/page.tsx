"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Data KPI HSE Keseluruhan (Metrik Global)
  const kpiData = {
    safeManHours: 342850,
    ltiFreeDays: 418,
    activePermits: 12,
    auditScore: 92,
    totalCapa: 24,
    closedCapa: 20
  }
  const capaRate = Math.round((kpiData.closedCapa / kpiData.totalCapa) * 100)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://teizyhspjjhwvnwrgmxj.supabase.co'
        // GANTI TEKS DI BAWAH INI DENGAN API KEY PANJANG ANDA
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaXp5aHNwampod3Zud3JnbXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTQ0ODIsImV4cCI6MjEwOTQzMDQ4Mn0.HgzYCrftZLyWELHjNFZyGJzLCH9DlYCKh5tRfOvlu_A'
        
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Hanya mengambil 5 laporan bahaya terbaru untuk widget dashboard
        const { data, error } = await supabase
          .from('hazard_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setReports(data || [])
      } catch (error: any) {
        setErrorMsg('Gagal memuat data Hazard Supabase: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">HSE Performance Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Tinjauan komprehensif metrik K3L dan log laporan bahaya real-time.</p>
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm">
          ↻ Refresh Data
        </button>
      </div>

      {/* Bagian 1: Global HSE KPI (Top Level) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm text-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safe Man-Hours</p>
          <div className="mt-2 text-3xl font-black font-mono tracking-tight">{kpiData.safeManHours.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-400 font-bold mt-2 pt-2 border-t border-slate-700">✓ {kpiData.ltiFreeDays} Days LTI Free</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Work Permits</p>
          <div className="mt-2 text-3xl font-black font-mono tracking-tight text-slate-900">{kpiData.activePermits}</div>
          <p className="text-[10px] text-slate-500 font-bold mt-2 pt-2 border-t border-slate-100">PTW, LOTO, Hot Work</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CAPA Closure Rate</p>
          <div className="mt-2 text-3xl font-black font-mono tracking-tight text-slate-900">{capaRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${capaRate}%` }}></div></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit Readiness</p>
          <div className="mt-2 text-3xl font-black font-mono tracking-tight text-slate-900">{kpiData.auditScore}%</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-2 pt-2 border-t border-slate-100">ISO 9001, 14001, 45001</p>
        </div>
      </div>

      {/* Bagian 2: Widget Supabase - Real-time Hazard Hunting */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase">Recent Hazard Reports</h2>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">5 laporan terbaru dari lapangan (Live dari Supabase)</p>
          </div>
          <Link href="/hazard-report" className="text-[10px] font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider px-3 py-1.5 bg-slate-200 rounded-md transition">
            + Buat Laporan
          </Link>
        </div>
        
        {errorMsg && <div className="p-4 bg-red-50 text-xs font-bold text-red-700 border-b border-red-100">⚠️ {errorMsg}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Area</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pelapor</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risiko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-bold">Memuat data live...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-bold">Belum ada data laporan.</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-xs font-mono text-slate-600">{new Date(report.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 text-xs font-bold text-slate-800">{report.area}</td>
                    <td className="p-4 text-xs text-slate-600 max-w-xs truncate" title={report.description}>{report.description}</td>
                    <td className="p-4 text-xs text-slate-600">{report.reported_by}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${report.risk_level === 'High' ? 'bg-red-100 text-red-700' : report.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {report.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
