"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

export default function ScaffoldingPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // 1. Dimensi Target Area Kerja
  const [length, setLength] = useState<number>(10)
  const [height, setHeight] = useState<number>(5.1)
  
  // Standar Main Frame Indonesia (T-170)
  const frameHeight = 1.7
  const frameWidth = 1.219
  const bayLength = 1.83 
  
  // 2. Operasional Pekerja & Akses
  const [deckLevels, setDeckLevels] = useState<number>(1)
  const [workersOnDeck, setWorkersOnDeck] = useState<number>(2)
  const [ladderPosition, setLadderPosition] = useState<'left' | 'right' | 'none'>('left')
  const [hasOutriggerPipes, setHasOutriggerPipes] = useState<boolean>(true)
  const [inspectorName, setInspectorName] = useState<string>('')

  // Kalkulasi Geometri
  const totalBays = Math.max(1, Math.ceil(length / bayLength))
  const totalLifts = Math.max(1, Math.ceil(height / frameHeight))
  const actualHeight = totalLifts * frameHeight
  const actualLength = totalBays * bayLength

  // Kapasitas Beban Platform (Medium Duty: 225 kg/m2)
  const bayPlatformCapacity = 500
  const estimatedLoadPerWorker = 100
  const totalLiveLoadKg = workersOnDeck * estimatedLoadPerWorker
  const maxSafeWorkers = totalBays * 2
  const isPlatformOverload = workersOnDeck > maxSafeWorkers

  // Rasio Stabilitas & Kebutuhan Pipa Support
  const heightRatio = actualHeight / frameWidth
  const needsWallTie = heightRatio > 3.0

  // Perhitungan BoQ Material
  const qtyMainFrames = (totalBays + 1) * totalLifts * 2
  const qtyCrossBraces = totalBays * totalLifts * 2
  const qtyJointPins = (totalBays + 1) * (totalLifts > 1 ? totalLifts - 1 : 0) * 2
  const qtyJackBases = (totalBays + 1) * 2
  const qtyCatwalks = totalBays * 2 * deckLevels
  const qtyLadders = ladderPosition !== 'none' ? totalLifts : 0
  
  const qtySupportPipes = (needsWallTie || hasOutriggerPipes) ? Math.ceil((totalBays + 1) * 2) : 0
  const qtySwivelClamps = qtySupportPipes * 2

  const isInputValid = length > 0 && height > 0 && deckLevels > 0 && workersOnDeck >= 0

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Desain Scaffolding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perancangan Scaffolding Frame (BoQ, Tangga &amp; Pipa Support)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Kalkulator Bill of Quantities (BoQ) material Main Frame T-170, validasi beban pekerja, verifikasi pipa support pengaku (outrigger/wall-tie), dan penerbitan Scafftag.
        </p>
      </div>

      {/* Header Dokumen Cetak */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Scaffolding Plan &amp; Safety Verification</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">LEMBAR PERHITUNGAN TEKNIS &amp; VERIFIKASI K3 LAPANGAN</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Diterbitkan oleh:</span>
            <span className="text-sm font-black text-slate-900">SYSPEX MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Input Parameter Teknis */}
        <div className="lg:col-span-4 space-y-5 print:hidden">
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              1. Dimensi Target Area Kerja
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-len`} className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Bentang (m)</label>
                <input
                  id={`${formId}-len`}
                  type="number"
                  min="1"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-h`} className="block text-[11px] font-bold text-slate-600 mb-1">Tinggi Target (m)</label>
                  <input
                    id={`${formId}-h`}
                    type="number"
                    min="1"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Lebar Frame</label>
                  <input
                    disabled
                    type="text"
                    value={`${frameWidth} m`}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              2. Beban Pekerja &amp; Pipa Support
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-workers`} className="block text-[11px] font-bold text-slate-600 mb-1">Rencana Pekerja di Atas</label>
                  <input
                    id={`${formId}-workers`}
                    type="number"
                    min="0"
                    max="10"
                    value={workersOnDeck}
                    onChange={(e) => setWorkersOnDeck(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Maks aman: {maxSafeWorkers} orang</span>
                </div>
                <div>
                  <label htmlFor={`${formId}-deck`} className="block text-[11px] font-bold text-slate-600 mb-1">Lantai Catwalk</label>
                  <input
                    id={`${formId}-deck`}
                    type="number"
                    min="1"
                    max={totalLifts}
                    value={deckLevels}
                    onChange={(e) => setDeckLevels(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Posisi Tangga Akses</label>
                <select
                  value={ladderPosition}
                  onChange={(e) => setLadderPosition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500"
                >
                  <option value="left">Bay Ujung Kiri (Standard)</option>
                  <option value="right">Bay Ujung Kanan</option>
                  <option value="none">Tidak Pasang (Hanya Catwalk)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOutriggerPipes}
                    onChange={(e) => setHasOutriggerPipes(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Pasang Pipa Support / Outrigger</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Pipa galvanis 1.5 inch miring 45 sampai 60 derajat di kedua sisi bawah untuk memperlebar tapak stabilitas.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Petugas Inspeksi K3</label>
                <input
                  type="text"
                  placeholder="Nama Scaffolder / HSE..."
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Skematik 2D & Rekap BoQ */}
        <div className="lg:col-span-8 space-y-6 print:col-span-12">
          
          {isPlatformOverload && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 print:border-slate-900 print:bg-white">
              <h3 className="text-xs font-black text-red-700 uppercase flex items-center gap-2 mb-1 print:text-slate-900">
                <span>[!]</span> <span>PERINGATAN: JUMLAH PEKERJA MELEBIHI REKOMENDASI AMAN</span>
              </h3>
              <p className="text-xs text-red-600 print:text-slate-700">
                Rencana {workersOnDeck} pekerja di atas platform melampaui batas aman ({maxSafeWorkers} orang untuk bentang {totalBays} bay). Kurangi personel aktif.
              </p>
            </div>
          )}

          {needsWallTie && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 print:border-slate-900 print:bg-white">
              <h3 className="text-xs font-black text-amber-900 uppercase flex items-center gap-2 mb-1 print:text-slate-900">
                <span>[!]</span> <span>WAJIB PIPA SUPPORT / WALL-TIE (RASIO {heightRatio.toFixed(1)}:1)</span>
              </h3>
              <p className="text-xs text-amber-800 print:text-slate-700">
                Rasio tinggi terhadap lebar dasar melebihi batas bebas 3:1. Wajib dipasang pipa pengikat (wall-tie) ke struktur permanen setiap jarak vertikal 4 meter atau gunakan outrigger pipa galvanis.
              </p>
            </div>
          )}

          {/* Blueprint Skematik 2D */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white space-y-4 print:bg-white print:border-slate-300 print:text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">SCHEMATIC 2D</span>
                <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">STRUCTURE &amp; SUPPORT SYSTEM</span>
              </div>
              <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${
                !isPlatformOverload 
                  ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' 
                  : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'
              }`}>
                {!isPlatformOverload ? 'STATUS: AMAN' : 'STATUS: OVERLOAD'}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-[#0f172a] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300">
              <svg viewBox="0 0 640 330" className="w-full h-full text-slate-300 font-sans select-none print:text-slate-600" role="img" aria-label="Visualisasi 2D Blueprint Scaffolding Frame dengan Tangga dan Pipa Support">
                <line x1="30" y1="280" x2="610" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

                {(() => {
                  const visualBays = Math.min(totalBays, 6)
                  const visualLifts = Math.min(totalLifts, 4)
                  const bayWidth = 380 / visualBays
                  const liftHeightSVG = 200 / visualLifts
                  const startX = 130
                  const elements = []

                  const ladderBayIndex = ladderPosition === 'left' ? 0 : (ladderPosition === 'right' ? visualBays - 1 : -1)

                  if (hasOutriggerPipes || needsWallTie) {
                    const outriggerSpan = 45
                    const outriggerTopLiftY = 276 - (Math.min(2, visualLifts) * liftHeightSVG)
                    
                    elements.push(
                      <g key="outrigger-left">
                        <line x1={startX - outriggerSpan} y1="276" x2={startX} y2={outriggerTopLiftY} stroke="#eab308" strokeWidth="2.5" />
                        <rect x={startX - outriggerSpan - 4} y="276" width="8" height="4" fill="#94a3b8" />
                        <circle cx={startX} cy={outriggerTopLiftY} r="3" fill="#ca8a04" />
                        <text x={startX - (outriggerSpan / 2)} y="268" fill="#eab308" fontSize="8" fontWeight="bold">Outrigger</text>
                      </g>
                    )
                    
                    const rightEnd = startX + visualBays * bayWidth
                    elements.push(
                      <g key="outrigger-right">
                        <line x1={rightEnd + outriggerSpan} y1="276" x2={rightEnd} y2={outriggerTopLiftY} stroke="#eab308" strokeWidth="2.5" />
                        <rect x={rightEnd + outriggerSpan - 4} y="276" width="8" height="4" fill="#94a3b8" />
                        <circle cx={rightEnd} cy={outriggerTopLiftY} r="3" fill="#ca8a04" />
                        <text x={rightEnd + (outriggerSpan / 2)} y="268" fill="#eab308" fontSize="8" fontWeight="bold" textAnchor="middle">Outrigger</text>
                      </g>
                    )
                  }

                  for (let i = 0; i <= visualBays; i++) {
                    const x = startX + i * bayWidth
                    elements.push(<rect key={`bp-${i}`} x={x - 6} y="276" width="12" height="4" fill="#94a3b8" rx="1" />)
                  }

                  for (let y = 0; y < visualLifts; y++) {
                    const yBottom = 276 - (y * liftHeightSVG)
                    const yTop = 276 - ((y + 1) * liftHeightSVG)

                    for (let x = 0; x < visualBays; x++) {
                      const xLeft = startX + x * bayWidth
                      const xRight = startX + (x + 1) * bayWidth

                      if (x === ladderBayIndex) {
                        const isEvenLift = y % 2 === 0
                        const ladderStartX = isEvenLift ? xLeft + 8 : xRight - 8
                        const ladderEndX = isEvenLift ? xRight - 8 : xLeft + 8

                        elements.push(
                          <g key={`ladder-${y}-${x}`}>
                            <line x1={ladderStartX} y1={yBottom} x2={ladderEndX} y2={yTop} stroke="#38bdf8" strokeWidth="2.5" />
                            <line x1={ladderStartX} y1={yBottom - 10} x2={ladderEndX} y2={yTop - 10} stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
                            {[0.25, 0.5, 0.75].map((t, idx) => {
                              const stepX = ladderStartX + (ladderEndX - ladderStartX) * t
                              const stepY = yBottom + (yTop - yBottom) * t
                              return (
                                <line key={`st-${idx}`} x1={stepX - 4} y1={stepY} x2={stepX + 4} y2={stepY} stroke="#bae6fd" strokeWidth="2" />
                              )
                            })}
                          </g>
                        )
                      } else {
                        elements.push(
                          <g key={`cb-${y}-${x}`}>
                            <line x1={xLeft} y1={yBottom - 6} x2={xRight} y2={yTop + 6} stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1={xRight} y1={yBottom - 6} x2={xLeft} y2={yTop + 6} stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={xLeft + bayWidth / 2} cy={yBottom - liftHeightSVG / 2} r="2" fill="#cbd5e1" />
                          </g>
                        )
                      }

                      if (y < deckLevels || x === ladderBayIndex) {
                        elements.push(
                          <rect key={`cw-${y}-${x}`} x={xLeft} y={yTop} width={bayWidth} height="5" fill="#475569" rx="1" />
                        )
                      }

                      if (y === Math.min(deckLevels - 1, visualLifts - 1) && x < workersOnDeck) {
                        const workerX = xLeft + (bayWidth / 2)
                        const workerY = yTop - 14
                        elements.push(
                          <g key={`worker-${x}`}>
                            <circle cx={workerX} cy={workerY} r="4" fill="#eab308" />
                            <rect x={workerX - 4} y={workerY + 4} width="8" height="10" fill="#22c55e" rx="1" />
                            <line x1={workerX - 2} y1={workerY + 6} x2={workerX + 2} y2={workerY + 6} stroke="#ffffff" strokeWidth="1" />
                          </g>
                        )
                      }
                    }

                    for (let x = 0; x <= visualBays; x++) {
                      const posX = startX + x * bayWidth
                      elements.push(
                        <g key={`mf-${y}-${x}`}>
                          <line x1={posX} y1={yBottom} x2={posX} y2={yTop} stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
                          {y < visualLifts - 1 && (
                            <line x1={posX} y1={yTop} x2={posX} y2={yTop - 4} stroke="#3b82f6" strokeWidth="2" />
                          )}
                        </g>
                      )
                    }
                  }

                  return elements
                })()}

                <rect x="120" y="225" width="10" height="16" fill="#10b981" rx="1" />
                <text x="125" y="236" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">OK</text>

                <text x="320" y="25" fill="currentColor" opacity="0.8" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">
                  Tinggi: {actualHeight.toFixed(1)}m | Beban Pekerja: {workersOnDeck} Org (~{totalLiveLoadKg} kg) | Support: {(hasOutriggerPipes || needsWallTie) ? 'PIPA AKTIF' : 'STANDAR'}
                </text>
                
                <line x1="130" y1="300" x2="510" y2="300" stroke="currentColor" opacity="0.4" strokeWidth="1" />
                <polygon points="130,300 135,297 135,303" fill="currentColor" opacity="0.4" />
                <polygon points="510,300 505,297 505,303" fill="currentColor" opacity="0.4" />
                <text x="320" y="312" fill="currentColor" opacity="0.8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">
                  Bentang: {actualLength.toFixed(1)} m ({totalBays} Bays x 1.83m)
                </text>
              </svg>
            </div>

            {/* Rekap Teknis Beban & Pipa Support */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:grid-cols-4 text-center mt-4">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Rencana Pekerja</span>
                <span className={`text-sm font-black font-mono ${isPlatformOverload ? 'text-red-500' : 'text-white'} print:text-slate-900`}>
                  {workersOnDeck} <span className="text-[10px]">Orang</span>
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Estimasi Beban Hidup</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{totalLiveLoadKg} <span className="text-[10px]">kg</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Pipa Support (Galvanis 1.5 in)</span>
                <span className="text-sm font-black text-amber-400 font-mono print:text-slate-900">{qtySupportPipes} <span className="text-[10px]">Btg</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Swivel Clamp 1.5 in</span>
                <span className="text-sm font-black text-amber-400 font-mono print:text-slate-900">{qtySwivelClamps} <span className="text-[10px]">Pcs</span></span>
              </div>
            </div>

            {/* BoQ Lengkap Komponen Frame */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 print:grid-cols-5 text-center pt-2 border-t border-slate-800 print:border-slate-200">
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold print:text-slate-500">Main Frame T-170</span>
                <span className="text-xs font-bold text-orange-400 font-mono print:text-slate-900">{qtyMainFrames} Pcs</span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold print:text-slate-500">Cross Brace 2.2m</span>
                <span className="text-xs font-bold text-white font-mono print:text-slate-900">{qtyCrossBraces} Pcs</span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold print:text-slate-500">Catwalk Papan</span>
                <span className="text-xs font-bold text-white font-mono print:text-slate-900">{qtyCatwalks} Lbr</span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold print:text-slate-500">Tangga Akses</span>
                <span className="text-xs font-bold text-sky-400 font-mono print:text-slate-900">{qtyLadders} Unit</span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold print:text-slate-500">Jack Base Dasar</span>
                <span className="text-xs font-bold text-white font-mono print:text-slate-900">{qtyJackBases} Pcs</span>
              </div>
            </div>
          </div>

          {/* Form Scafftag Lapangan */}
          <div className="hidden print:block border-2 border-slate-900 p-5 mt-6 rounded">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">SCAFFTAG OPERASIONAL</span>
                <span className="text-xl font-black text-slate-900">GREEN TAG (SAFE FOR USE)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block">Tanggal Inspeksi: {todayDate}</span>
                <span className="text-xs text-slate-600 block">Batas Maks Pekerja: {workersOnDeck} Orang | Beban Maks: {totalBays * bayPlatformCapacity} kg</span>
              </div>
            </div>

            <div className="text-xs space-y-1 mb-6 text-slate-700">
              <p>- <strong>Kondisi Pipa Support / Wall-Tie:</strong> {(hasOutriggerPipes || needsWallTie) ? 'Terpasang dan Terkunci Swivel Clamp' : 'Tidak Dipersyaratkan'}</p>
              <p>- <strong>Akses Vertikal:</strong> {ladderPosition === 'none' ? 'Tangga Eksternal' : `Tangga Internal (Bay ${ladderPosition.toUpperCase()})`}</p>
              <p>- <strong>Kewajiban APD:</strong> Full Body Harness 100 persen Tie-Off di atas 1.8m, Helm K3 dengan chinstrap kencang.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-2">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Inspektur Perancah / HSE:</p>
                <div className="w-48 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">{inspectorName || 'Nama Petugas'}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Supervisor Pemasangan:</p>
                <div className="w-48 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">Tanda Tangan &amp; Nama</p>
              </div>
            </div>
          </div>

          {/* Tombol Cetak Dokumen */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cetak Dokumen &amp; Tag</h3>
              <p className="text-xs text-slate-600 mt-0.5">Cetak lembar verifikasi BoQ dan form Scafftag untuk ditempel di lokasi perancah.</p>
            </div>
            <button
              onClick={() => window.print()}
              disabled={!isInputValid || isPlatformOverload}
              className={`px-5 py-2.5 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${
                (isInputValid && !isPlatformOverload) 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {(isInputValid && !isPlatformOverload) ? 'Cetak BoQ &amp; Scafftag' : 'Selesaikan Batas Beban'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
