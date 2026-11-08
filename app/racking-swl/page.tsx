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

  const safeBeamRated = beamRatedSwl > 0 ? beamRatedSwl : 1
  const safeUprightCap = uprightFrameCapacity > 0 ? uprightFrameCapacity : 1
  const isInputInvalid = beamRatedSwl <= 0 || uprightFrameCapacity <= 0 || palletWeight < 0

  const totalLoadPerLevel = palletWeight * palletsPerLevel
  const totalBayLoad = totalLoadPerLevel * numberOfLevels
  
  const beamUtilization = (totalLoadPerLevel / safeBeamRated) * 100
  const uprightUtilization = (totalBayLoad / safeUprightCap) * 100
  
  const maxDeflectionMm = beamLength / 200
  const estimatedDeflectionMm = (totalLoadPerLevel / safeBeamRated) * maxDeflectionMm

  const isBeamOverload = beamUtilization > 100
  const isUprightOverload = uprightUtilization > 100
  const isDeflectionFail = estimatedDeflectionMm > maxDeflectionMm
  const overallSafe = !isBeamOverload && !isUprightOverload && !isDeflectionFail && !isInputInvalid

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Kalkulator Racking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kalkulator SWL Racking Gudang
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Validasi batas aman beban dengan *blueprint* skematik 2D. Batas input sistem mengacu pada standar fisik industri (Max 8 tingkat).
        </p>
      </div>

      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Safety Load Notice Plate</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">SISTEM RACKING GUDANG &bull; INSPEKSI K3</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Diterbitkan oleh:</span>
            <span className="text-sm font-black text-slate-900">SYSPEX MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-5 print:hidden">
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              1. Muatan Barang (Pallet Load)
            </h2>
            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-palletWt`} className="block text-[11px] font-bold text-slate-600 mb-1">Berat 1 Pallet (kg)</label> <input id={`${formId}-palletWt`} type="number" step="50" min="0" value={palletWeight} onChange={(e) => setPalletWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-palletsPerLvl`} className="block text-[11px] font-bold text-slate-600 mb-1">Pallet / Tingkat</label> <select id={`${formId}-palletsPerLvl`} value={palletsPerLevel} onChange={(e) => setPalletsPerLevel(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 transition">
                    <option value={1}>1 Pallet</option>
                    <option value={2}>2 Pallet</option>
                    <option value={3}>3 Pallet</option>
                    <option value={4}>4 Pallet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-levels`} className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Level</label> <input id={`${formId}-levels`} type="number" min="1" max="8" value={numberOfLevels} onChange={(e) => setNumberOfLevels(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500 transition" />
                </div>
              </div>
              <div className="p-3 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">Beban per Tingkat</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 font-mono">{totalLoadPerLevel.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-600 ml-1">kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              2. Spesifikasi Profil Racking
            </h2>
            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-beamLength`} className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Balok (Span - mm)</label> <input id={`${formId}-beamLength`} type="number" step="50" min="1000" max="4000" value={beamLength} onChange={(e) => setBeamLength(parseFloat(e.target.value) || 1000)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-beamSwl`} className="block text-[11px] font-bold text-slate-600 mb-1">Rated SWL Beam (kg)</label> <input id={`${formId}-beamSwl`} type="number" step="100" min="1" value={beamRatedSwl} onChange={(e) => setBeamRatedSwl(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500 transition" />
                </div>
                <div>
                  <label htmlFor={`${formId}-uprightCap`} className="block text-[11px] font-bold text-slate-600 mb-1">Kapasitas Upright (kg)</label> <input id={`${formId}-uprightCap`} type="number" step="500" min="1" value={uprightFrameCapacity} onChange={(e) => setUprightFrameCapacity(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 print:col-span-12">
          
          {!overallSafe && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2 print:border-red-500 print:bg-white">
              <h3 className="text-sm font-black text-red-700 uppercase tracking-tight flex items-center gap-2">
                <span>⚠️</span> <span>PERINGATAN KRITIS: STRUKTUR TIDAK AMAN</span>
              </h3>
              <ul className="text-xs font-bold text-red-600 space-y-1 pl-6 list-disc">
                {isInputInvalid && <li>Data spesifikasi kapasitas tidak valid (Nol atau Negatif).</li>}
                {isBeamOverload && <li><strong>BEAM OVERLOAD:</strong> Beban per tingkat ({totalLoadPerLevel.toLocaleString()} kg) melampaui kapasitas balok ({beamRatedSwl.toLocaleString()} kg).</li>}
                {isUprightOverload && <li><strong>UPRIGHT OVERLOAD:</strong> Total beban 1 bay ({totalBayLoad.toLocaleString()} kg) melampaui kapasitas tiang ({uprightFrameCapacity.toLocaleString()} kg).</li>}
                {isDeflectionFail && <li><strong>DEFLECTION FAIL:</strong> Estimasi lendutan balok melebihi batas L/200.</li>}
              </ul>
            </div>
          )}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white space-y-4 print:bg-white print:border-slate-300 print:text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded tracking-wide font-mono print:bg-slate-100 print:text-slate-800 print:border print:border-slate-400">BLUEPRINT 2D</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-600">SYSPEX RACKING</span>
              </div>
              <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${overallSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                {overallSafe ? '✓ STATUS: AMAN' : '⚠️ STATUS: OVERLOAD'}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-[#0f172a] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300">
              <svg viewBox="0 0 600 320" className="w-full h-full text-slate-300 font-sans select-none print:text-slate-600" role="img" aria-label="Visualisasi 2D Racking Gudang Syspex">
                
                <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                {/* Ground */}
                <line x1="50" y1="280" x2="550" y2="280" stroke="currentColor" strokeOpacity="0.5" strokeWidth="3" />

                {/* Uprights (Tiang 2D) */}
                <rect x="100" y="50" width="16" height="230" fill="#2563eb" rx="1" />
                <rect x="280" y="50" width="16" height="230" fill="#2563eb" rx="1" />
                <rect x="460" y="50" width="16" height="230" fill="#2563eb" rx="1" />

                {/* Bracing Belakang 2D */}
                {[0, 1, 2, 3].map((idx) => {
                  const y = 280 - (idx * 55);
                  return (
                    <g key={idx}>
                      <line x1="116" y1={y} x2="280" y2={y - 45} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="296" y1={y} x2="460" y2={y - 45} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                    </g>
                  );
                })}

                {/* Beams & Pallets (2D Datar) */}
                {(() => {
                  const visualLevels = Math.min(numberOfLevels, 8);
                  const liftHeight = 220 / (visualLevels + 1);
                  
                  return Array.from({ length: visualLevels }).map((_, idx) => {
                    const yPos = 280 - ((idx + 1) * liftHeight);
                    const beamColor = isBeamOverload ? "#ef4444" : "#f97316"; 
                    
                    return (
                      <g key={idx}>
                        {/* Pallet 2D (Digambar sebelum balok agar duduk di atas/belakangnya jika tumpang tindih) */}
                        {palletsPerLevel >= 1 && <rect x="126" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 2 && <rect x="126 + (164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 3 && <rect x="126 + 2*(164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 4 && <rect x="126 + 3*(164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}

                        {/* Pallet Bay Kanan */}
                        {palletsPerLevel >= 1 && <rect x="306" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 2 && <rect x="306 + (164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 3 && <rect x="306 + 2*(164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}
                        {palletsPerLevel >= 4 && <rect x="306 + 3*(164/palletsPerLevel)" y={yPos - 30} width={164/palletsPerLevel - 10} height="30" fill="#8b5cf6" rx="2" />}

                        {/* Balok 2D */}
                        <rect x="116" y={yPos} width="164" height="10" fill={beamColor} rx="1" />
                        <rect x="296" y={yPos} width="164" height="10" fill={beamColor} rx="1" />
                      </g>
                    );
                  });
                })()}

                {numberOfLevels > 8 && (
                  <text x="300" y="30" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">
                    + {numberOfLevels - 8} Levels tidak ditampilkan (Max 8)
                  </text>
                )}

                {/* Anotasi Dimensi */}
                <line x1="116" y1="295" x2="280" y2="295" stroke="currentColor" opacity="0.5" strokeWidth="1" />
                <polygon points="116,295 121,292 121,298" fill="currentColor" opacity="0.5" />
                <polygon points="280,295 275,292 275,298" fill="currentColor" opacity="0.5" />
                <text x="198" y="308" fill="currentColor" opacity="0.7" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Span: {beamLength} mm</text>

                <line x1="296" y1="295" x2="460" y2="295" stroke="currentColor" opacity="0.5" strokeWidth="1" />
                <polygon points="296,295 301,292 301,298" fill="currentColor" opacity="0.5" />
                <polygon points="460,295 455,292 455,298" fill="currentColor" opacity="0.5" />
                <text x="378" y="308" fill="currentColor" opacity="0.7" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Span: {beamLength} mm</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4 mt-4">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Max Beban/Level</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{beamRatedSwl.toLocaleString()} <span className="text-[10px]">kg</span></span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Max Beban/Bay</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{uprightFrameCapacity.toLocaleString()} <span className="text-[10px]">kg</span></span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Batas Lendutan (EN)</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{maxDeflectionMm.toFixed(1)} <span className="text-[10px]">mm</span></span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Total Berat Aktual/Bay</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{totalBayLoad.toLocaleString()} <span className="text-[10px]">kg</span></span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Validasi Selesai</h3>
              <p className="text-xs text-slate-600 mt-0.5">Tekan tombol cetak untuk mencetak Blueprint 2D Skematik.</p>
            </div>
            <button
              onClick={() => window.print()}
              disabled={!overallSafe}
              className={`px-4 py-2 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${overallSafe ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              {overallSafe ? '🖨️ Cetak Notice Plate' : '⛔ Selesaikan Error'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
