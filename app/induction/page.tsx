"use client"

import { useState } from 'react'

export default function InductionPage() {
  const [guestName, setGuestName] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [hostName, setHostName] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName || !vendorName) return
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setGuestName('')
      setVendorName('')
      setPurpose('')
      setHostName('')
    }, 4000)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Safety Induction &amp; Visitor Pass
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registrasi pengenalan bahaya kerja lokasi, verifikasi pemahaman APD, dan pencatatan tamu/kontraktor.
        </p>
      </div>

      {/* Form Input Terang & Grafis Bersih */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-3xl space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Formulir Izin Masuk Fasilitas / Pabrik
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Lengkap Tamu / Pekerja
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian Pratama"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Instansi / Perusahaan Vendor
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: PT Syspex"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Keperluan Kunjungan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Visit Workshop &amp; Inspeksi Racking"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pendamping / PIC Internal
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Satrio W."
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800 transition"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Materi induksi K3, ketentuan APD wajib, dan jalur evakuasi telah dipaparkan.</span>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition whitespace-nowrap ml-3"
            >
              Terbitkan Pas Masuk
            </button>
          </div>
        </form>

        {isSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-bold">
            ✓ Pas Masuk berhasil diterbitkan untuk {guestName} ({vendorName}).
          </div>
        )}
      </div>

    </div>
  )
}
