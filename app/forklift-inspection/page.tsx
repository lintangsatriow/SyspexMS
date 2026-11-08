"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

interface CheckItem {
  id: string
  label: string
  critical: boolean
  pass: boolean
}

export default function ForkliftInspectionPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  const [unitCode, setUnitCode] = useState<string>('FL-01 (Toyota 3.0T)')
  const [operatorName, setOperatorName] = useState<string>('Dedi Kurniawan')
  const [hourMeter, setHourMeter] = useState<number>(4182)
  const [shift, setShift] = useState<string>('Shift 1')

  const [items, setItems] = useState<CheckItem[]>([
    { id: '1', label: 'Level Oli Mesin & Cairan Pendingin (Coolant)', critical: false, pass: true },
    { id: '2', label: 'Kondisi Ban (Solid/Pneumatic) & Baut Roda Kencang', critical: true, pass: true },
    { id: '3', label: 'Fungsi Rem Kaki (Foot Brake) & Rem Parkir (Handbrake)', critical: true, pass: true },
    { id: '4', label: 'Sistem Hidrolik (Lift, Tilt, Side-Shift) Tanpa Kebocoran', critical: true, pass: true },
    { id: '5', label: 'Rantai Garpu & Pelat Garpu (Fork Tines) Tanpa Retak/Bengkok', critical: true, pass: true },
    { id: '6', label: 'Klakson, Lampu Sorot Depan & Beacon/Strobe Light Berfungsi', critical: true, pass: true },
    { id: '7', label: 'Alarm Mundur (Backup Beeper) Bersuara Jelas', critical: true, pass: true },
    { id: '8', label: 'Seatbelt Pengemudi & Overhead Guard Kokoh Tanpa Deformasi', critical: true, pass: true },
    { id: '9', label: 'Tabung APAR di Unit Masih Terisi (Jarum Hijau & Pin Segel Utuh)', critical: false, pass: true }
  ])

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const toggleItem = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, pass: !it.pass } : it))
  }

  // Unit otomatis ditolak jika ada komponen critical yang gagal (pass = false)
  const hasCriticalFail = items.some(it => it.critical && !it.pass)
  const totalFails = items.filter(it => !it.pass).length
  const isUnitOperational = !hasCriticalFail && totalFails <= 1

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Forklift Inspection</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pemeriksaan Harian Forklift (Pre-Use Checklist)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Formulir inspeksi pra-operasional sebelum shift kerja dimulai. Mencegah kegagalan rem, kebocoran hidrolik, dan kecelakaan fatal logistik.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition shadow-sm self-start sm:self-auto cursor-pointer"
          >
            🖨️ Cetak Kartu Inspeksi
          </button>
        </div>
      </div>

      {/* Header Hasil Cetak */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Daily Forklift Inspection Sheet</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">LOGBOOK PEMERIKSAAN KELAYAKAN ALAT ANGKAT &bull; SYSPEX HSE</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Unit:</span>
            <span className="text-sm font-black text-slate-900 font-mono">{unitCode}</span>
          </div>
        </div>
      </div>

      {/* Banner Status Kelayakan Unit */}
      <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isUnitOperational 
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
          : 'bg-red-50 border-red-300 text-red-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
            isUnitOperational ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {isUnitOperational ? '✓' : '!'}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Status Operasional Unit</span>
            <h2 className="text-lg font-black tracking-tight">
              {isUnitOperational ? 'LAYAK OPERASI (SAFE TO OPERATE)' : 'DILARANG OPERASI (OUT OF SERVICE / TAG-OUT)'}
            </h2>
          </div>
        </div>
        <div className="text-left sm:text-right text-xs">
          <span className="font-bold block">
            {isUnitOperational 
              ? 'Seluruh item keselamatan kritis terpenuhi' 
              : 'Ditemukan kerusakan pada komponen kritis! Cabut kunci unit.'}
          </span>
          <span className="text-[11px] opacity-75">Terkoreksi otomatis sesuai standar OSHA 1910.178</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Data Unit & Operator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 print:border-none print:p-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 print:border-slate-900">
              Parameter Unit &amp; Shift
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Unit Forklift</label>
                <select 
                  value={unitCode} 
                  onChange={(e) => setUnitCode(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:hidden"
                >
                  <option>FL-01 (Toyota 3.0T Diesel)</option>
                  <option>FL-02 (Nichiyu 2.5T Electric Reach)</option>
                  <option>FL-03 (Komatsu 3.5T Gas)</option>
                </select>
                <div className="hidden print:block font-bold">{unitCode}</div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Operator Bertugas</label>
                <input 
                  type="text" 
                  value={operatorName} 
                  onChange={(e) => setOperatorName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:border-none print:bg-transparent print:p-0"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hour Meter (HM)</label>
                  <input 
                    type="number" 
                    value={hourMeter} 
                    onChange={(e) => setHourMeter(parseFloat(e.target.value) || 0)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold font-mono text-slate-900 focus:outline-none print:border-none print:bg-transparent print:p-0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Shift</label>
                  <select 
                    value={shift} 
                    onChange={(e) => setShift(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:hidden"
                  >
                    <option>Shift 1</option>
                    <option>Shift 2</option>
                  </select>
                  <div className="hidden print:block font-bold">{shift}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: 9 Checklist Lapangan */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 print:border-none print:p-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 print:border-slate-900">
              Daftar Pemeriksaan Komponen Fisik &amp; Mekanikal
            </h3>
            
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div 
                  key={it.id} 
                  onClick={() => toggleItem(it.id)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                    it.pass 
                      ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' 
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400 font-bold">{idx + 1}.</span>
                    <div>
                      <span className="text-xs font-bold block">{it.label}</span>
                      {it.critical && (
                        <span className="text-[9px] font-bold uppercase text-red-600 bg-red-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          Critical Safety
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                      it.pass 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {it.pass ? 'NORMAL' : 'RUSAK / BOCOR'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pengesahan Tanda Tangan Cetak */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-10 mt-8 border-t-2 border-slate-900">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Operator Pemeriksa:</p>
                <div className="w-40 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">{operatorName}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Supervisor Gudang / HSE:</p>
                <div className="w-40 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">Tanda Tangan &amp; Nama</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
