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

  // ==========================================
  // 3D ISOMETRIC / OBLIQUE RENDER ENGINE (SVG)
  // ==========================================
  const renderDepthX = 25; 
  const renderDepthY = -25; 
  const visualLevels = Math.min(numberOfLevels, 8); 
  const bayWidth = 220;
  const colX = [80, 80 + bayWidth, 80 + bayWidth * 2]; 
  const groundY = 320;
  const topY = 60;
  const liftHeight = (groundY - topY) / (visualLevels + 1);

  const Box3D = ({ x, y, w, h, depth, frontColor, topColor, sideColor }: any) => {
    const dx = depth;
    const dy = -depth;
    return (
      <g>
        {/* Wajah Atas */}
        <polygon points={`${x},${y} ${x + w},${y} ${x + w + dx},${y + dy} ${x + dx},${y + dy}`} fill={topColor} />
        {/* Wajah Samping (Kanan) */}
        <polygon points={`${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`} fill={sideColor} />
        {/* Wajah Depan */}
        <rect x={x} y={y} width={w} height={h} fill={frontColor} />
      </g>
    )
  }

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
          Validasi batas aman beban dengan *blueprint* rendering 2.5D Isometric. Batas input sistem mengacu pada standar fisik industri (Max 8 tingkat).
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
                <label htmlFor={`${formId}-palletWt`} className="block text-[11px] font-bold text-slate-600 mb-1">Berat 1 Pallet (kg)</label>
                <input id={`${formId}-palletWt`} type="number" step="50" min="0" value={palletWeight} onChange={(e) => setPalletWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-palletsPerLvl`} className="block text-[11px] font-bold text-slate-600 mb-1">Pallet / Tingkat</label>
                  <select id={`${formId}-palletsPerLvl`} value={palletsPerLevel} onChange={(e) => setPalletsPerLevel(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition">
                    <option value={1}>1 Pallet</option>
                    <option value={2}>2 Pallet</option>
                    <option value={3}>3 Pallet</option>
                    <option value={4}>4 Pallet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-levels`} className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Level</label>
                  <input id={`${formId}-levels`} type="number" min="1" max="8" value={numberOfLevels} onChange={(e) => setNumberOfLevels(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition" />
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
                <label htmlFor={`${formId}-beamLength`} className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Balok (Span - mm)</label>
                <input id={`${formId}-beamLength`} type="number" step="50" min="1000" max="4000" value={beamLength} onChange={(e) => setBeamLength(parseFloat(e.target.value) || 1000)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-beamSwl`} className="block text-[11px] font-bold text-slate-600 mb-1">Rated SWL Beam (kg)</label>
                  <input id={`${formId}-beamSwl`} type="number" step="100" min="1" value={beamRatedSwl} onChange={(e) => setBeamRatedSwl(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition" />
                </div>
                <div>
                  <label htmlFor={`${formId}-uprightCap`} className="block text-[11px] font-bold text-slate-600 mb-1">Kapasitas Upright (kg)</label>
                  <input id={`${formId}-uprightCap`} type="number" step="500" min="1" value={uprightFrameCapacity} onChange={(e) => setUprightFrameCapacity(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition" />
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
                <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded tracking-wide font-mono print:bg-slate-100 print:text-slate-800 print:border print:border-slate-400">ISOMETRIC CAD</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-600">SYSPEX RACKING 3D</span>
              </div>
              <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${overallSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                {overallSafe ? '✓ STATUS: AMAN' : '⚠️ STATUS: OVERLOAD'}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-[#0b1121] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0b1121 100%)' }}>
              <svg viewBox="0 0 700 400" className="w-full h-full text-slate-300 font-sans select-none print:text-slate-600" role="img" aria-label="Visualisasi 3D Isometric Racking Gudang Syspex">
                
                <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <line key={`hx-${i}`} x1="0" y1={groundY + (i * renderDepthY/2)} x2="700" y2={groundY + (i * renderDepthY/2)} />
                  ))}
                </g>

                {/* LAYER 1: Tiang Belakang, Bracing, Baseplate, & Sisi Kanan Tiang */}
                {colX.map((x, i) => (
                  <g key={`upright-back-${i}`}>
                    <rect x={x + renderDepthX} y={topY + renderDepthY} width="14" height={groundY - topY} fill="#1e3a8a" />
                    
                    <line x1={x + 14} y1={groundY} x2={x + renderDepthX} y2={groundY - 50 + renderDepthY} stroke="#1d4ed8" strokeWidth="3" />
                    <line x1={x + renderDepthX} y1={groundY - 50 + renderDepthY} x2={x + 14} y2={groundY - 100} stroke="#1d4ed8" strokeWidth="3" />
                    <line x1={x + 14} y1={groundY - 100} x2={x + renderDepthX} y2={groundY - 150 + renderDepthY} stroke="#1d4ed8" strokeWidth="3" />
                    <line x1={x + renderDepthX} y1={groundY - 150 + renderDepthY} x2={x + 14} y2={groundY - 200} stroke="#1d4ed8" strokeWidth="3" />
                    
                    <polygon points={`${x-4},${groundY} ${x+18},${groundY} ${x+18+renderDepthX},${groundY+renderDepthY} ${x-4+renderDepthX},${groundY+renderDepthY}`} fill="#64748b" />
                    
                    {/* Sisi kedalaman tiang digambar duluan agar balok bisa duduk di depannya */}
                    <polygon points={`${x+14},${topY} ${x+14+renderDepthX},${topY+renderDepthY} ${x+14+renderDepthX},${groundY+renderDepthY} ${x+14},${groundY}`} fill="#2563eb" />
                  </g>
                ))}

                {/* LAYER 2: Balok dan Palet (Dari Lantai Bawah ke Atas) */}
                {Array.from({ length: visualLevels }).map((_, idx) => {
                  const levelNum = visualLevels - idx;
                  const y = groundY - (levelNum * liftHeight);
                  const isError = isBeamOverload;
                  
                  const pFront = "#8b5cf6";
                  const pTop = "#a78bfa";
                  const pSide = "#7c3aed";
                  
                  const bFront = isError ? "#ef4444" : "#f97316";
                  const bTop = isError ? "#f87171" : "#fdba74";
                  
                  const drawLevel = (startX: number) => {
                    const palletW = (bayWidth - 20) / Math.max(palletsPerLevel, 1) - 10;
                    const pHeight = 35;
                    
                    return (
                      <g key={`bay-${startX}-${levelNum}`}>
                        {/* 1. Balok (Atas dan Depan) */}
                        <polygon points={`${startX+14},${y} ${startX+bayWidth},${y} ${startX+bayWidth+renderDepthX},${y+renderDepthY} ${startX+14+renderDepthX},${y+renderDepthY}`} fill={bTop} />
                        <rect x={startX+14} y={y} width={bayWidth-14} height="12" fill={bFront} rx="1" />
                        
                        {/* 2. Palet (Digambar SETELAH balok agar posisinya di atas, tidak tertimpa) */}
                        {palletsPerLevel > 0 && Array.from({ length: palletsPerLevel }).map((_, pIdx) => {
                          const px = startX + 14 + 10 + (pIdx * (palletW + 10));
                          const py = y - pHeight;
                          return (
                            <Box3D key={pIdx} x={px} y={py} w={palletW} h={pHeight} depth={15} frontColor={pFront} topColor={pTop} sideColor={pSide} />
                          )
                        })}
                      </g>
                    )
                  }

                  return (
                    <g key={`level-${levelNum}`}>
                      {drawLevel(colX[0])}
                      {drawLevel(colX[1])}
                    </g>
                  );
                })}

                {/* LAYER 3: Sisi Depan Tiang (Digambar paling akhir agar menutupi ujung balok yang tersambung) */}
                {colX.map((x, i) => (
                  <rect key={`upright-front-${i}`} x={x} y={topY} width="14" height={groundY - topY} fill="#3b82f6" rx="1" />
                ))}

                {numberOfLevels > 8 && (
                  <text x="350" y="40" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono bg-slate-900">
                    + {numberOfLevels - 8} Levels tidak divisualisasikan (Max Display 8)
                  </text>
                )}

                <line x1={colX[0]+7} y1={groundY+15} x2={colX[1]+7} y2={groundY+15} stroke="currentColor" opacity="0.4" />
                <text x={(colX[0]+colX[1])/2} y={groundY+28} fill="currentColor" opacity="0.7" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">SPAN: {beamLength} mm</text>
                <line x1={colX[1]+7} y1={groundY+15} x2={colX[2]+7} y2={groundY+15} stroke="currentColor" opacity="0.4" />
                <text x={(colX[1]+colX[2])/2} y={groundY+28} fill="currentColor" opacity="0.7" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">SPAN: {beamLength} mm</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
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
              <p className="text-xs text-slate-600 mt-0.5">Tekan tombol cetak untuk mencetak Blueprint Isometric.</p>
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
