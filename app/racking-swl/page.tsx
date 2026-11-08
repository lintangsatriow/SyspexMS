"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function RackingSwlPage() {
  const formId = useId()

  const [palletWeight, setPalletWeight] = useState<number>(1000)
  const [palletsPerLevel, setPalletsPerLevel] = useState<number>(2)
  const [numberOfLevels, setNumberOfLevels] = useState<number>(4)

  const [beamLength, setBeamLength] = useState<number>(2700)
  const [beamRatedSwl, setBeamRatedSwl] = useState<number>(2500)
  const [uprightFrameCapacity, setUprightFrameCapacity] = useState<number>(12000)

  const [safetyFactor, setSafetyFactor] = useState<number>(1.5)

  const totalLoadPerLevel = palletWeight * palletsPerLevel
  const totalBayLoad = totalLoadPerLevel * numberOfLevels
  const validBeamRated = beamRatedSwl > 0 ? beamRatedSwl : 1
  const beamUtilization = (totalLoadPerLevel / validBeamRated) * 100
  const validUprightCap = uprightFrameCapacity > 0 ? uprightFrameCapacity : 1
  const uprightUtilization = (totalBayLoad / validUprightCap) * 100
  const maxDeflectionMm = beamLength / 200
  const estimatedDeflectionMm = (totalLoadPerLevel / validBeamRated) * maxDeflectionMm
  const overallSafe = beamUtilization <= 100 && uprightUtilization <= 100

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Engineering &amp; Fabrikasi</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          Industrial Storage Rack Calculator &bull; EN 15512 / RMI
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kalkulator SWL Racking Gudang &amp; Pallet Rack
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Alat hitung cepat Safe Working Load (SWL) balok (beam), beban bay kolom (upright), batas lendutan (L/200), serta generator blueprint identifikasi beban resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>1. Muatan Barang (Pallet Load)</span>
              <span className="text-[10px] text-slate-400 font-mono">Beban Kerja</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-palletWt`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Berat 1 Unit Pallet + Muatan (kg)
                </label>
                <input
                  id={`${formId}-palletWt`}
                  type="number"
                  step="50"
                  min="50"
                  value={palletWeight}
                  onChange={(e) => setPalletWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-palletsPerLvl`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pallet / Tingkat (Beam)
                  </label>
                  <select
                    id={`${formId}-palletsPerLvl`}
                    value={palletsPerLevel}
                    onChange={(e) => setPalletsPerLevel(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value={1}>1 Pallet</option>
                    <option value={2}>2 Pallet (Standar 2.7m)</option>
                    <option value={3}>3 Pallet (3.6m - 3.9m)</option>
                    <option value={4}>4 Pallet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-levels`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jumlah Beam Level
                  </label>
                  <input
                    id={`${formId}-levels`}
                    type="number"
                    min="1"
                    max="10"
                    value={numberOfLevels}
                    onChange={(e) => setNumberOfLevels(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">Beban per Tingkat (UDL)</span>
                  <span className="text-[10px] text-blue-800/80">{palletsPerLevel} Pallet &times; {palletWeight} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-950 font-mono">{totalLoadPerLevel.toLocaleString()}</span>
                  <span className="text-xs font-bold text-blue-900 ml-1">kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>2. Spesifikasi Profil Racking</span>
              <span className="text-[10px] text-slate-400 font-mono">Structural Limits</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-beamLength`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Panjang Balok Bersih (mm)
                </label>
                <input
                  id={`${formId}-beamLength`}
                  type="number"
                  step="50"
                  min="1000"
                  value={beamLength}
                  onChange={(e) => setBeamLength(parseFloat(e.target.value) || 1000)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-beamSwl`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Rated SWL Beam / Level (kg)
                  </label>
                  <input
                    id={`${formId}-beamSwl`}
                    type="number"
                    step="100"
                    min="500"
                    value={beamRatedSwl}
                    onChange={(e) => setBeamRatedSwl(parseFloat(e.target.value) || 500)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-uprightCap`} className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kapasitas Upright (kg)
                  </label>
                  <input
                    id={`${formId}-uprightCap`}
                    type="number"
                    step="500"
                    min="1000"
                    value={uprightFrameCapacity}
                    onChange={(e) => setUprightFrameCapacity(parseFloat(e.target.value) || 1000)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded tracking-wide font-mono">BLUEPRINT</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynamic 2D Wireframe &bull; SYSPEX RACKING</span>
              </div>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                overallSafe ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {overallSafe ? '✓ AMAN (PASSED)' : '⚠️ Kritis (OVERLOAD)'}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden py-4">
              {/* Di sini perbaikan untuk Screen Reader / Aksesibilitas SVG */}
              <svg 
                viewBox="0 0 600 320" 
                className="w-full h-full text-slate-300 font-sans select-none"
                role="img"
                aria-label="Visualisasi 2D Blueprint Desain Racking Gudang Syspex"
              >
                <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff03" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                <line x1="50" y1="280" x2="550" y2="280" stroke="#334155" strokeWidth="3" />

                <rect x="100" y="50" width="16" height="230" fill="#2563eb" rx="2" />
                <rect x="99" y="48" width="18" height="5" fill="#1d4ed8" />
                <rect x="280" y="50" width="16" height="230" fill="#2563eb" rx="2" />
                <rect x="279" y="48" width="18" height="5" fill="#1d4ed8" />
                <rect x="460" y="50" width="16" height="230" fill="#2563eb" rx="2" />
                <rect x="459" y="48" width="18" height="5" fill="#1d4ed8" />

                {[0, 1, 2, 3].map((idx) => {
                  const y = 280 - (idx * 55);
                  return (
                    <g key={idx}>
                      <line x1="116" y1={y} x2="280" y2={y - 45} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="296" y1={y} x2="460" y2={y - 45} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                    </g>
                  );
                })}

                {Array.from({ length: Math.min(numberOfLevels, 4) }).map((_, idx) => {
                  const yPos = 270 - (idx * 50);
                  return (
                    <g key={idx}>
                      <rect x="116" y={yPos} width="164" height="8" fill="#f97316" rx="1" />
                      <rect x="296" y={yPos} width="164" height="8" fill="#f97316" rx="1" />
                      {palletsPerLevel >= 1 && <rect x="126" y={yPos - 25} width="60" height="25" fill="#78350f" rx="2" opacity="0.85" />}
                      {palletsPerLevel >= 2 && <rect x="206" y={yPos - 25} width="60" height="25" fill="#78350f" rx="2" opacity="0.85" />}
                      {palletsPerLevel >= 1 && <rect x="306" y={yPos - 25} width="60" height="25" fill="#78350f" rx="2" opacity="0.85" />}
                      {palletsPerLevel >= 2 && <rect x="386" y={yPos - 25} width="60" height="25" fill="#78350f" rx="2" opacity="0.85" />}
                    </g>
                  );
                })}

                <text x="280" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" className="uppercase font-mono">Upright Height: {numberOfLevels * 1.5}m</text>
                
                <line x1="116" y1="295" x2="280" y2="295" stroke="#475569" strokeWidth="1" />
                <polygon points="116,295 121,292 121,298" fill="#475569" />
                <polygon points="280,295 275,292 275,298" fill="#475569" />
                <text x="198" y="308" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Span: {beamLength} mm</text>

                <line x1="296" y1="295" x2="460" y2="295" stroke="#475569" strokeWidth="1" />
                <polygon points="296,295 301,292 301,298" fill="#475569" />
                <polygon points="460,295 455,292 455,298" fill="#475569" />
                <text x="378" y="308" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Span: {beamLength} mm</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Lendutan Maksimum EN</span>
                <span className="text-sm font-black text-white font-mono">{maxDeflectionMm.toFixed(1)} mm</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Lendutan Estimasi</span>
                <span className={`text-sm font-black font-mono ${estimatedDeflectionMm > maxDeflectionMm ? 'text-red-400' : 'text-emerald-400'}`}>
                  {estimatedDeflectionMm.toFixed(1)} mm
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Total Beban (Bay)</span>
                <span className="text-sm font-black text-white font-mono">{totalBayLoad.toLocaleString()} kg</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Safety Load Notice Plate</h3>
              <p className="text-xs text-slate-500 mt-1">Gunakan hasil kalkulasi ini untuk melengkapi form verifikasi izin K3, cetak pelat beban.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition whitespace-nowrap shadow-xs"
            >
              🖨️ Cetak JSA &amp; Tag
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
