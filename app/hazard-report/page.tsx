"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// FAIL-SAFE: Mencegah error "Invalid supabaseUrl" saat Vercel Build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://teizyhspjjhwvnwrgmxj.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaXp5aHNwampod3Zud3JnbXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTQ0ODIsImV4cCI6MjEwOTQzMDQ4Mn0.HgzYCrftZLyWELHjNFZyGJzLCH9DlYCKh5tRfOvlu_A'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function HazardReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [reportedBy, setReportedBy] = useState('')
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const [riskLevel, setRiskLevel] = useState('Low')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { error } = await supabase
        .from('hazard_reports')
        .insert([{ reported_by: reportedBy, area: area, description: description, risk_level: riskLevel }])

      if (error) throw error

      setSuccessMsg('Laporan Bahaya berhasil dikirim dan tersimpan di database!')
      setReportedBy('')
      setArea('')
      setDescription('')
      setRiskLevel('Low')
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal mengirim laporan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-2xl mx-auto">
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">HSE Ops</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hazard Hunting Form</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Laporkan kondisi tidak aman atau tindakan tidak aman.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <span className="text-emerald-600 font-black text-lg">✓</span>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">Berhasil!</h3>
            <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pelapor (Sesuai ID)</label>
          <input type="text" required value={reportedBy} onChange={(e) => setReportedBy(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi / Area Bahaya</label>
          <input type="text" required value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tingkat Risiko</label>
          <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
            <option value="Low">Rendah (Low)</option>
            <option value="Medium">Sedang (Medium)</option>
            <option value="High">Tinggi (High)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Temuan</label>
          <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold resize-none" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-lg mt-4 disabled:opacity-50">
          {isSubmitting ? 'Memproses...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  )
}
