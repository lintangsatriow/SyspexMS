"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function RackingSwlPage() {
  const formId = useId()

  // 1. Spesifikasi Pallet & Beban Produk
  const [palletWeight, setPalletWeight] = useState<number>(1000) // kg per pallet
  const [palletsPerLevel, setPalletsPerLevel] = useState<number>(2) // pallet per level
  const [numberOfLevels, setNumberOfLevels] = useState<number>(4) // jumlah tingkat balok (beam levels)

  // 2. Geometri Beam & Upright
  const [beamLength, setBeamLength] = useState<number>(2700) // mm (panjang balok bersih)
  const [beamRatedSwl, setBeamRatedSwl] = useState<number>(2500) // kg (kapasitas teruji manufaktur per pasang beam)
  const [uprightFrameCapacity, setUprightFrameCapacity] = useState<number>(12000) // kg (kapasitas total rangka upright)

  // 3. Faktor Keamanan & Material
  const [safetyFactor, setSafetyFactor] = useState<number>(1.5) // Standard safety factor 1.5 - 1.65 (EN/RMI)

  // Perhitungan
  // Total beban per level balok (Uniformly Distributed Load / UDL)
  const totalLoadPerLevel = palletWeight * palletsPerLevel

  // Beban total per 1 Bay Racking
  const totalBayLoad = totalLoadPerLevel * numberOfLevels

  // Utilisasi Kapasitas Balok (Beam Capacity Utilization)
  const validBeamRated = beamRatedSwl > 0 ? beamRatedSwl : 1
  const beamUtilization = (totalLoadPerLevel / validBeamRated) * 100

  // Utilisasi Rangka Tegak (Upright Utilization)
  const validUprightCap = uprightFrameCapacity > 0 ? uprightFrameCapacity : 1
  const uprightUtilization = (totalBayLoad / validUprightCap) * 100

  // Batas Defleksi Lenturan Maksimum Standar EN 15512 (L / 200)
  const maxDeflectionMm = beamLength / 200

  // Estimasi lenturan aktual linier kasar berbasis rasio beban terhadap kapasitas
  const estimatedDeflectionMm = (totalLoadPerLevel / validBeamRated) * maxDeflectionMm

  // Status Keamanan Beam
  const isBeamSafe = beamUtilization <= 100
  const isUprightSafe = uprightUtilization <= 100
  const overallSafe = isBeamSafe && isUprightSafe

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <Link href="/" className="hover:text-zinc-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-zinc-800 font-semibold">Engineering &amp; Fabrikasi</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
          Industrial Storage Rack Calculator &bull; EN 15512 / RMI
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          Kalkulator SWL Racking Gudang &amp; Pallet Rack
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl leading-relaxed">
          Alat hitung cepat Safe Working Load (SWL) balok (*beam*), beban bay kolom (*upright*), batas lendutan (*deflection* $L/200$), serta generator pelat identifikasi beban resmi (*Load Notice Plate*).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Input Parameter Teknis */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Muatan Pallet */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex justify-between items-center">
              <span>1. Muatan Barang (Pallet Load)</span>
              <span className="text-[10px] text-zinc-400 font-mono">Beban Kerja</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-palletWt`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Berat 1 Unit Pallet + Muatan (kg)
                </label>
                <input
                  id={`${formId}-palletWt`}
                  type="number"
                  step="50"
                  min="50"
                  value={palletWeight}
                  onChange={(e) => setPalletWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-palletsPerLvl`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Pallet / Tingkat (Beam)
                  </label>
                  <select
                    id={`${formId}-palletsPerLvl`}
                    value={palletsPerLevel}
                    onChange={(e) => setPalletsPerLevel(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value={1}>1 Pallet</option>
                    <option value={2}>2 Pallet (Standar 2.7m)</option>
                    <option value={3}>3 Pallet (3.6m - 3.9m)</option>
                    <option value={4}>4 Pallet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`${formId}-levels`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Jumlah Beam Level
                  </label>
                  <input
                    id={`${formId}-levels`}
                    type="number"
                    min="1"
                    max="10"
                    value={numberOfLevels}
                    onChange={(e) => setNumberOfLevels(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Total UDL per Tingkat */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Beban per Tingkat (UDL)</span>
                  <span className="text-[10px] text-amber-800/80">{palletsPerLevel} Pallet &times; {palletWeight} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-950 font-mono">{totalLoadPerLevel.toLocaleString()}</span>
                  <span className="text-xs font-bold text-amber-900 ml-1">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Profil & Kapasitas Manufaktur Racking */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex justify-between items-center">
              <span>2. Spesifikasi Profil Racking</span>
              <span className="text-[10px] text-zinc-400 font-mono">Structural Limits</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-beamLength`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Panjang Balok Bersih / Clear Span (mm)
                </label>
                <input
                  id={`${formId}-beamLength`}
                  type="number"
                  step="50"
                  min="1000"
                  value={beamLength}
                  onChange={(e) => setBeamLength(parseFloat(e.target.value) || 1000)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">Umumnya 2700 mm untuk 2 unit pallet lebar 1200 mm.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-beamSwl`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Rated SWL Beam / Level (kg)
                  </label>
                  <input
                    id={`${formId}-beamSwl`}
                    type="number"
                    step="100"
                    min="500"
                    value={beamRatedSwl}
                    onChange={(e) => setBeamRatedSwl(parseFloat(e.target.value) || 500)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor={`${formId}-uprightCap`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Kapasitas Upright Frame (kg)
                  </label>
                  <input
                    id={`${formId}-uprightCap`}
                    type="number"
                    step="500"
                    min="1000"
                    value={uprightFrameCapacity}
                    onChange={(e) => setUprightFrameCapacity(parseFloat(e.target.value) || 1000)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-safetyFactor`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Design Safety Factor RMI / EN
                </label>
                <select
                  id={`${formId}-safetyFactor`}
                  value={safetyFactor}
                  onChange={(e) => setSafetyFactor(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                >
                  <option value={1.5}>1.50 (Standar Industri EN 15512)</option>
                  <option value={1.65}>1.65 (RMI Heavy Duty Standard)</option>
                  <option value={1.8}>1.80 (High Risk / Seismic Zone)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Verifikasi Struktural & Load Notice Plate */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card Verifikasi Status Beban */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Status Verifikasi Keamanan Racking
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                overallSafe
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {overallSafe ? '✓ VERIFIKASI AMAN (PASSED)' : '⚠️ OVERLOAD DETECTED (FAILED)'}
              </span>
            </div>

            {/* Grid 2 Evaluasi: Beam vs Upright */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1: Beam Level */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-zinc-800">Beban Balok (Beam Level)</span>
                  <span className="text-xs font-mono font-bold text-zinc-900">{beamUtilization.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      beamUtilization > 100 ? 'bg-rose-500' : beamUtilization > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(beamUtilization, 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Beban Aktual:</span>
                    <strong className="font-mono text-zinc-900">{totalLoadPerLevel.toLocaleString()} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Batas Izin SWL:</span>
                    <strong className="font-mono text-zinc-900">{beamRatedSwl.toLocaleString()} kg</strong>
                  </div>
                </div>
              </div>

              {/* Box 2: Total Kolom Bay */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-zinc-800">Beban Kolom Bay (Upright)</span>
                  <span className="text-xs font-mono font-bold text-zinc-900">{uprightUtilization.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      uprightUtilization > 100 ? 'bg-rose-500' : uprightUtilization > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(uprightUtilization, 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Beban Bay:</span>
                    <strong className="font-mono text-zinc-900">{totalBayLoad.toLocaleString()} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Kapasitas Upright:</span>
                    <strong className="font-mono text-zinc-900">{uprightFrameCapacity.toLocaleString()} kg</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Cek Lendutan / Deflection Check Sesuai Standar EN 15512 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  📐 Batas Lendutan Balok (Deflection Limit L/200):
                </span>
                <span className="font-mono font-bold text-slate-900">{maxDeflectionMm.toFixed(1)} mm</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Di bawah beban merata maksimal ({beamRatedSwl.toLocaleString()} kg), lendutan tengah balok tidak boleh melebihi <strong>{maxDeflectionMm.toFixed(1)} mm</strong> (panjang {beamLength} mm / 200). Lendutan estimasi saat ini: ~<strong>{estimatedDeflectionMm.toFixed(1)} mm</strong>.
              </p>
            </div>
          </div>

          {/* Card: Official Load Notice Plate (Pelat Kapasitas Racking K3) */}
          <div className="bg-amber-400 p-1.5 rounded-2xl shadow-md">
            <div className="bg-zinc-950 rounded-xl p-6 text-zinc-100 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center">
                    SWL
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                      SAFETY LOAD NOTICE PLATE
                    </h3>
                    <p className="text-[10px] text-zinc-400">Pemberitahuan Resmi Beban Maksimum Racking (EN 15635)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold transition self-start sm:self-auto border border-zinc-700"
                >
                  🖨️ Cetak Pelat Beban
                </button>
              </div>

              {/* Data Tabel Pelat */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Max per Pallet</span>
                  <span className="text-base font-black font-mono text-white">{palletWeight.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-400 block">kg</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Max / Beam Level</span>
                  <span className="text-base font-black font-mono text-white">{beamRatedSwl.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-400 block">kg UDL</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Max / Racking Bay</span>
                  <span className="text-base font-black font-mono text-white">{uprightFrameCapacity.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-400 block">kg Total</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Safety Factor</span>
                  <span className="text-base font-black font-mono text-emerald-400">{safetyFactor} : 1</span>
                  <span className="text-[10px] text-zinc-400 block">Standard</span>
                </div>
              </div>

              {/* Peringatan K3 Racking */}
              <div className="border-t border-zinc-800 pt-3 space-y-1.5 text-[10px] text-zinc-400">
                <strong className="text-amber-400 uppercase tracking-wider block">Ketentuan Keselamatan Operasional:</strong>
                <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                  <li>Dilarang melebihi batas beban tertera pada pelat ini dalam kondisi apa pun.</li>
                  <li>Beban harus selalu disebar merata (Uniformly Distributed Load) di atas kedua balok.</li>
                  <li>Setiap benturan forklift pada tiang upright wajib segera dilaporkan ke Tim K3 &amp; Racking Engineer untuk inspeksi struktural.</li>
                  <li>Perubahan konfigurasi jarak tingkat beam wajib melalui persetujuan tertulis pabrikan racking.</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
