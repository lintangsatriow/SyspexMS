"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function HazardReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [reportedBy, setReportedBy] = useState('')
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const [riskLevel, setRiskLevel] = useState('Low')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulasi loading 1 detik, lalu sukses (tanpa nyambung database dulu)
    setTimeout(() => {
      setSuccessMsg('Mode Aman: Laporan berhasil disimulasikan. (Koneksi database sedang diistirahatkan sementara).')
      setReportedBy('')
      setArea('')
      setDescription('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-2xl mx-auto">
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">HSE Ops</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hazard Hunting Form</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Laporkan kondisi tidak aman atau tindakan tidak aman. (Saat ini dalam Mode Visual).</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <span className="text-emerald-600 font-black text-lg">✓</span>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">Terkirim!</h3>
            <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
          </div>
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
