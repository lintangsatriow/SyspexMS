"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

export default function HazardReportPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)

  const [reporterName, setReporterName] = useState<string>('')
  const [department, setDepartment] = useState<string>('Warehouse & Logistics')
  const [category, setCategory] = useState<'Kondisi Tidak Aman' | 'Tindakan Tidak Aman' | 'Near Miss (Nyaris Celaka)'>('Kondisi Tidak Aman')
  const [location, setLocation] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [immediateAction, setImmediateAction] = useState<string>('')
  const [riskSeverity, setRiskSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim() || !description.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Hazard Hunting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Laporan Bahaya &amp; Near Miss (Hazard Hunting)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Pelaporan proaktif kondisi berbahaya, perilaku tidak aman, atau insiden nyaris celaka untuk segera ditindaklanjuti tim HSE dan Supervisor.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 bg-emerald-50 border border-emerald-300 rounded-2xl text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-black">
            ✓
          </div>
          <h2 className="text-xl font-black text-emerald-950">Laporan Bahaya Berhasil Diteruskan!</h2>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Terima kasih atas kepedulian Anda terhadap keselamatan kerja. Temuan ini telah dicatat ke dalam antrean CAPA dan tim HSE Syspex akan melakukan verifikasi di lokasi.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false)
                setDescription('')
                setImmediateAction('')
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
            >
              + Buat Laporan Baru
            </button>
            <Link
              href="/internal"
              className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-lg hover:bg-emerald-100 transition"
            >
              Lihat di Dashboard CAPA &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pelapor (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Boleh dikosongkan jika anonim" 
                  value={reporterName} 
                  onChange={(e) => setReporterName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departemen / Divisi</label>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option>Warehouse &amp; Logistics</option>
                  <option>Packaging Assembly</option>
                  <option>Field Service Technician</option>
                  <option>Office / Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori Laporan</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as any)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option>Kondisi Tidak Aman (Unsafe Condition)</option>
                  <option>Tindakan Tidak Aman (Unsafe Action)</option>
                  <option>Near Miss (Nyaris Celaka)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tingkat Keparahan Potensial</label>
                <select 
                  value={riskSeverity} 
                  onChange={(e) => setRiskSeverity(e.target.value as any)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option value="Low">Rendah (P3K / Luka Ringan)</option>
                  <option value="Medium">Sedang (Perawatan Medis / Kerusakan Alat)</option>
                  <option value="High">Tinggi (Fatal / Patah Tulang / Api)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lokasi Persis Temuan *</label>
              <input 
                type="text" 
                required
                placeholder="Contoh: Lorong Racking 3A atau Depan Panel Listrik Wrapping 1" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Uraian Temuan Bahaya *</label>
              <textarea 
                rows={3} 
                required
                placeholder="Ceritakan apa yang Anda lihat, komponen apa yang rusak, atau situasi apa yang membahayakan..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tindakan Cepat yang Sudah Diambil</label>
              <input 
                type="text" 
                placeholder="Contoh: Menyingkirkan genangan oli / memasang barricade tape sementara..." 
                value={immediateAction} 
                onChange={(e) => setImmediateAction(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition shadow-sm mt-4 text-xs cursor-pointer"
            >
              Kirim Laporan Bahaya ke HSE
            </button>
          </form>
        </div>
      )}

    </div>
  )
}
