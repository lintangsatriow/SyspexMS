"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function ScaffoldingPage() {
  const formId = useId()

  // Input Dimensi Area Kerja
  const [length, setLength] = useState<number>(10) // Panjang area (m)
  const [height, setHeight] = useState<number>(5)  // Tinggi target (m)
  
  // Standar Scaffolding Frame Indonesia (Warna Oranye)
  // Frame T-170 (Tinggi 1.7m, Lebar 1.219m)
  const frameHeight = 1.7
  const frameWidth = 1.219
  // Cross Brace / Silang (Bentang standar 1.83m)
  const bayLength = 1.83 
  
  const [deckLevels, setDeckLevels] = useState<number>(1) // Jumlah lantai papan pijakan (catwalk)

  // Kalkulasi Geometri (Pembulatan ke atas untuk keamanan cover area)
  const totalBays = Math.ceil(length / bayLength)
  const totalLifts = Math.ceil(height / frameHeight)

  // Estimasi Material BoQ (Sistem Frame)
  // 1 Bay butuh 2 set frame. 2 Bay butuh 3 set, dst.
  const qtyMainFrames = (totalBays + 1) * totalLifts
  const qtyCrossBraces = totalBays * totalLifts * 2 // Depan belakang
  const qtyJointPins = (totalBays + 1) * (totalLifts > 1 ? totalLifts - 1 : 0) * 2
  const qtyJackBases = (totalBays + 1) * 2 // Kaki penyangga bawah
  const qtyUHeads = (totalBays + 1) * 2 // Penyangga balok atas (opsional, tapi dihitung)
  
  // Catwalk (Papan Metal). Standar lebar catwalk 50cm, butuh 2 untuk cover 1.2m
  const catwalksPerBay = 2
  const qtyCatwalks = totalBays * catwalksPerBay * deckLevels
  const qtyArmLocks = qtyMainFrames // Pengaman tambahan

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Engineering &amp; Operasional</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          Main Frame Scaffolding &bull; Standar Konstruksi Lokal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perancangan Scaffolding Frame (BoQ &amp; Visual)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Kalkulator otomatisasi Bill of Quantities (BoQ) material perancah sistem Frame (warna oranye) khas proyek Indonesia. Menghitung kebutuhan Main Frame T-170, Cross Brace, dan Joint Pin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: INPUT PARAMETER */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>1. Dimensi Target Area (Meter)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-len`} className="block text-[11px] font-semibold text-slate-600 mb-1">Panjang Area (Length - m)</label>
                <input
                  id={`${formId}-len`}
                  type="number"
                  min="1"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-h`} className="block text-[11px] font-semibold text-slate-600 mb-1">Tinggi Target (m)</label>
                  <input
                    id={`${formId}-h`}
                    type="number"
                    min="1"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Lebar Frame (Fixed)</label>
                  <input
                    disabled
                    type="text"
                    value={`${frameWidth} m`}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>2. Konfigurasi Lantai Kerja</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-deck`} className="block text-[11px] font-semibold text-slate-600 mb-1">Jumlah Lantai Ber-Catwalk</label>
                <input
                  id={`${formId}-deck`}
                  type="number"
                  min="1"
                  max={totalLifts}
                  value={deckLevels}
                  onChange={(e) => setDeckLevels(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Berapa tingkat yang akan dipasangi papan pijakan (Asiba/Catwalk).</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW & BLUEPRINT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card Blueprint Render Canvas Scaffolding */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black bg-orange-600 text-white px-2 py-0.5 rounded tracking-wide font-mono">BLUEPRINT</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynamic 2D Wireframe &bull; MAIN FRAME</span>
              </div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ✓ Aman (PASSED)
              </span>
            </div>

            {/* Sketsa Render Canvas 2D Live (Sistem Main Frame Oranye) */}
            <div className="relative aspect-video w-full bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden py-4">
              <svg viewBox="0 0 600 320" className="w-full h-full text-slate-300 font-sans select-none">
                {/* Garis Grid Latar Belakang */}
                <defs>
                  <pattern id="grid-pattern-scaff" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff03" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern-scaff)" />

                {/* Ground Line */}
                <line x1="40" y1="280" x2="560" y2="280" stroke="#334155" strokeWidth="3" />

                {/* Skala Dinamis (Agar muat di canvas) */}
                {(() => {
                  // Membatasi visualisasi maksimal 5 bay untuk estetika canvas
                  const visualBays = Math.min(totalBays, 5); 
                  const visualLifts = Math.min(totalLifts, 4);
                  
                  const bayWidth = 400 / visualBays;
                  const liftHeightSVG = 220 / visualLifts;
                  const startX = 100;

                  const elements = [];

                  // Jack Base Bawah
                  for (let i = 0; i <= visualBays; i++) {
                    const x = startX + i * bayWidth;
                    elements.push(<rect key={`base-${i}`} x={x - 8} y="275" width="16" height="5" fill="#94a3b8" rx="1" />);
                    elements.push(<rect key={`base-p-${i}`} x={x - 2} y="270" width="4" height="5" fill="#cbd5e1" />);
                  }

                  // Looping Tiap Tingkat (Lift)
                  for (let y = 0; y < visualLifts; y++) {
                    const yBottom = 270 - (y * liftHeightSVG);
                    const yTop = 270 - ((y + 1) * liftHeightSVG);

                    // Cross Brace (Silang X antara frame)
                    for (let x = 0; x < visualBays; x++) {
                      const xLeft = startX + x * bayWidth;
                      const xRight = startX + (x + 1) * bayWidth;
                      
                      // Garis silang X warna silver
                      elements.push(
                        <g key={`brace-${y}-${x}`}>
                          <line x1={xLeft} y1={yBottom - 10} x2={xRight} y2={yTop + 10} stroke="#94a3b8" strokeWidth="1.5" />
                          <line x1={xRight} y1={yBottom - 10} x2={xLeft} y2={yTop + 10} stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx={xLeft + bayWidth/2} cy={yBottom - liftHeightSVG/2} r="2" fill="#cbd5e1" />
                        </g>
                      );
                      
                      // Catwalk (Papan Pijakan) - Digambar di bagian atas tiap Lift sesuai input deckLevels
                      if (y < deckLevels) {
                        elements.push(
                          <rect key={`catwalk-${y}-${x}`} x={xLeft} y={yTop} width={bayWidth} height="4" fill="#64748b" opacity="0.8" />
                        );
                      }
                    }

                    // Main Frame (T-170 Warna Oranye)
                    for (let x = 0; x <= visualBays; x++) {
                      const posX = startX + x * bayWidth;
                      elements.push(
                        <g key={`frame-${y}-${x}`}>
                          {/* Tiang Vertikal Frame */}
                          <line x1={posX} y1={yBottom} x2={posX} y2={yTop} stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                          {/* Joint Pin (Sambungan Antar Frame) - kecuali top lift */}
                          {y < visualLifts - 1 && (
                            <line x1={posX} y1={yTop} x2={posX} y2={yTop - 5} stroke="#3b82f6" strokeWidth="2" />
                          )}
                        </g>
                      );
                    }
                  }

                  return elements;
                })()}

                {/* Indikator Jika Bay > 5 */}
                {totalBays > 5 && (
                  <text x="530" y="150" fill="#f97316" fontSize="24" fontWeight="bold" textAnchor="middle">...</text>
                )}

                {/* Tagaman K3 (Scafftag Hijau) pada tiang pertama */}
                <rect x="90" y="215" width="14" height="20" fill="#10b981" rx="2" />
                <text x="97" y="228" fill="#ffffff" fontSize="7" fontWeight="black" textAnchor="middle">OK</text>

                {/* Dimensi Label */}
                <text x="300" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" className="uppercase font-mono">Tinggi Aktual: {(totalLifts * frameHeight).toFixed(1)}m ({totalLifts} Susun Frame)</text>
                
                {/* Garis Ukur Panjang */}
                <line x1="100" y1="295" x2="500" y2="295" stroke="#475569" strokeWidth="1" />
                <polygon points="100,295 105,292 105,298" fill="#475569" />
                <polygon points="500,295 495,292 495,298" fill="#475569" />
                <text x="300" y="308" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Bentang Total: {(totalBays * bayLength).toFixed(1)} Meter ({totalBays} Bays x 1.83m)</text>
              </svg>
            </div>

            {/* Rekap Material BoQ Lokal (T-170) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Main Frame T-170</span>
                <span className="text-sm font-black text-orange-500 font-mono">{qtyMainFrames} <span className="text-[10px] text-slate-400">Set</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Cross Brace 2.2m</span>
                <span className="text-sm font-black text-white font-mono">{qtyCrossBraces} <span className="text-[10px] text-slate-400">Pcs</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Joint Pin</span>
                <span className="text-sm font-black text-white font-mono">{qtyJointPins} <span className="text-[10px] text-slate-400">Pcs</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Catwalk / Asiba</span>
                <span className="text-sm font-black text-white font-mono">{qtyCatwalks} <span className="text-[10px] text-slate-400">Lbr</span></span>
              </div>
            </div>
          </div>

          {/* Form Inspeksi & Checklist Material */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Print BoQ &amp; Scafftag</h3>
              <p className="text-xs text-slate-500 mt-1">Cetak estimasi jumlah material untuk gudang fabrikasi dan form verifikasi pemasangan (Scafftag).</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition whitespace-nowrap shadow-xs"
            >
              🖨️ Cetak JSA &amp; Material
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
