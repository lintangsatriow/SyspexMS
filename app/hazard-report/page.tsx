"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// KONEKSI LANGSUNG: Mencegah error "Module not found"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HazardReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // State Form
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
      // Mengirim data langsung ke tabel Supabase
      const { error } = await supabase
        .from('hazard_reports')
        .insert([
          { 
            reported_by: reportedBy, 
            area: area, 
            description: description, 
            risk_level: riskLevel 
          }
        ])

      if (error) throw error

      setSuccessMsg('Laporan Bahaya berhasil dikirim dan tersimpan di database!')
      // Kosongkan form setelah sukses
      setReportedBy('')
      setArea('')
      setDescription('')
      setRiskLevel('Low')
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal mengirim laporan. Pastikan koneksi internet stabil.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">HSE Ops</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hazard Hunting Form</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Laporkan kondisi tidak aman (Unsafe Condition) atau tindakan tidak aman (Unsafe Act) yang Anda temukan di lapangan. Data akan langsung terkirim ke tim HSE.
        </p>
      </div>

      {/* Pesan Sukses / Error */}
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

      {/* Formulir Input */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pelapor (Sesuai ID)</label>
          <input 
            type="text" 
            required 
            value={reportedBy} 
            onChange={(e) => setReportedBy(e.target.value)}
            placeholder="Maks: Budi Santoso"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi / Area Bahaya</label>
          <input 
            type="text" 
            required 
            value={area} 
            onChange={(e) => setArea(e.target.value)}
            placeholder="Contoh: Gudang Packaging Blok C"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tingkat Risiko</label>
          <select 
            value={riskLevel} 
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition appearance-none"
          >
            <option value="Low">Rendah (Low) - Risiko cedera ringan</option>
            <option value="Medium">Sedang (Medium) - Butuh tindakan minggu ini</option>
            <option value="High">Tinggi (High) - Potensi fatalitas, hentikan pekerjaan!</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Temuan</label>
          <textarea 
            required 
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan secara spesifik bahaya apa yang Anda lihat..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim ke Database...' : 'Kirim Laporan Bahaya'}
        </button>

      </form>
    </div>
  )
}
