"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // KONEKSI ANTI-ERROR
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://teizyhspjjhwvnwrgmxj.supabase.co'
        
        // GANTI TEKS DI BAWAH INI DENGAN API KEY PANJANG ANDA
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaXp5aHNwampod3Zud3JnbXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTQ0ODIsImV4cCI6MjEwOTQzMDQ4Mn0.HgzYCrftZLyWELHjNFZyGJzLCH9DlYCKh5tRfOvlu_A'
        
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Menarik data dari tabel hazard_reports
        const { data, error } = await supabase
          .from('hazard_reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setReports(data || [])
      } catch (error: any) {
        setErrorMsg('Gagal memuat data: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Kalkulasi KPI
  const totalReports = reports.length
  const openReports = reports.filter(r => r.status === 'Open').length
  const highRiskOpen = reports.filter(r => r.risk_level === 'High' && r.status === 'Open').length

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">HSE Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Pemantauan Laporan Bahaya (Hazard Hunting) Real-time.</p>
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition">
          ↻ Refresh Data
        </button>
      </div>

      {/* Pesan Error Jika Ada */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Laporan Masuk</p>
          <div className="mt-2 text-4xl font-black font-mono tracking-tight text-slate-900">
            {isLoading ? '...' : totalReports}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Terbuka (Open)</p>
          <div className="mt-2 text-4xl font-black font-mono tracking-tight text-amber-600">
            {isLoading ? '...' : openReports}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm bg-red-50/50">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Risiko Tinggi (Belum Selesai)</p>
          <div className="mt-2 text-4xl font-black font-mono tracking-tight text-red-700">
            {isLoading ? '...' : highRiskOpen}
          </div>
        </div>
      </div>

      {/* Tabel Data Real-time */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-black text-slate-900 uppercase">Log Temuan Bahaya Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Area</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pelapor</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risiko</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-bold">Memuat data dari Supabase...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-bold">Belum ada data laporan.</td></tr>
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
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${report.status === 'Open' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {report.status}
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
