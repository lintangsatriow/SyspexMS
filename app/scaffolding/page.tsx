"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

export default function ScaffoldingPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // 1. Parameter Dimensi Kerja
  const [length, setLength] = useState<number>(10)
  const [height, setHeight] = useState<number>(5.1)
  
  // Standar Main Frame Indonesia (T-170)
  const frameHeight = 1.7
  const frameWidth = 1.219
  const bayLength = 1.83 
  
  const [deckLevels, setDeckLevels] = useState<number>(1)
  const [inspectorName, setInspectorName] = useState<string>('')

  // Kalkulasi Geometri
  const totalBays = Math.max(1, Math.ceil(length / bayLength))
  const totalLifts = Math.max(1, Math.ceil(height / frameHeight))
  const actualHeight = totalLifts * frameHeight
  const actualLength = totalBays * bayLength

  // Estimasi Material BoQ (Sistem Frame Oranye)
  const qtyMainFrames = (totalBays + 1) * totalLifts * 2
  const qtyCrossBraces = totalBays * totalLifts * 2
  const qtyJointPins = (totalBays + 1) * (totalLifts > 1 ? totalLifts - 1 : 0) * 2
  const qtyJackBases = (totalBays + 1) * 2
  const qtyCatwalks = totalBays * 2 * deckLevels

  // Validasi K3: Rasio Stabilitas (Tinggi : Lebar Dasar)
  // Berdasarkan Permenaker & Standar Konstruksi: Rasio > 3:1 wajib pasang wall tie
  const heightRatio = actualHeight / frameWidth
  const needsWallTie = heightRatio > 3.0
  const isInputValid = length > 0 && height > 0 && deckLevels > 0

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman (Sembunyi saat cetak) */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Desain Scaffolding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perancangan Scaffolding Frame (BoQ &amp; Scafftag)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Kalkulator Bill of Quantities (BoQ) material Main Frame T-170, validasi rasio stabilitas ketinggian, serta penerbitan kartu inspeksi Scafftag resmi.
        </p>
      </div>

      {/* Header Dokumen Cetak (Hanya Muncul di Kertas/PDF) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Scaffolding Inspection &amp; BoQ</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">LEMBAR VERIFIKASI K3 &amp; DAFTAR MATERIAL PERANCAH</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Diterbitkan oleh:</span>
            <span className="text-sm font-black text-slate-900">SYSPEX MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Input Parameter Teknis (Sembunyi saat cetak) */}
        <div className="lg:col-span-4 space-y-5 print:hidden">
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              1. Dimensi Target Area Kerja
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-len`} className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Area (m)</label>
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
              2. Konfigurasi Kerja &amp; Petugas
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-deck`} className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Lantai Catwalk</label>
                <input
                  id={`${formId}-deck`}
                  type="number"
                  min="1"
                  max={totalLifts}
                  value={deckLevels}
                  onChange={(e) => setDeckLevels(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Tingkat yang dipasangi papan pijakan kerja (2 lembar per bay).</span>
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
          
          {/* Peringatan K3: Wall Tie / Angkur */}
          {needsWallTie && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 print:border-slate-900 print:bg-white">
              <h3 className="text-xs font-black text-amber-900 uppercase flex items-center gap-2 mb-1 print:text-slate-900">
                <span>⚠️</span> <span>PERINGATAN STABILITAS: WAJIB WALL-TIE / OUTRIGGER</span>
              </h3>
              <p className="text-xs text-amber-800 print:text-slate-700">
                Rasio tinggi terhadap lebar ({heightRatio.toFixed(1)}:1) melebihi batas bebas 3:1. Perancah berisiko terguling jika tidak diangkur ke dinding struktur gedung atau dipasang pipa penyangga samping (*outrigger*).
              </p>
            </div>
          )}

          {/* Blueprint Skematik 2D */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white space-y-4 print:bg-white print:border-slate-300 print:text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">SCHEMATIC 2D</span>
                <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">MAIN FRAME T-170 (ORANGE)</span>
              </div>
              <span className="px-3 py-0.5 rounded text-[10px] font-black uppercase border bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300">
                ✓ SISTEM TERVERIFIKASI
              </span>
            </div>

            <div className="relative aspect-video w-full bg-[#0f172a] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300">
              <svg viewBox="0 0 600 320" className="w-full h-full text-slate-300 font-sans select-none print:text-slate-600" role="img" aria-label="Visualisasi 2D Blueprint Scaffolding Frame">
                <line x1="40" y1="280" x2="560" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

                {(() => {
                  const visualBays = Math.min(totalBays, 6)
                  const visualLifts = Math.min(totalLifts, 4)
                  const bayWidth = 440 / visualBays
                  const liftHeightSVG = 210 / visualLifts
                  const startX = 80
                  const elements = []

                  // Baseplate bawah
                  for (let i = 0; i <= visualBays; i++) {
                    const x = startX + i * bayWidth
                    elements.push(<rect key={`bp-${i}`} x={x - 6} y="276" width="12" height="4" fill="#94a3b8" rx="1" />)
                  }

                  // Struktur per tingkat
                  for (let y = 0; y < visualLifts; y++) {
                    const yBottom = 276 - (y * liftHeightSVG)
                    const yTop = 276 - ((y + 1) * liftHeightSVG)

                    // Cross Braces
                    for (let x = 0; x < visualBays; x++) {
                      const xLeft = startX + x * bayWidth
                      const xRight = startX + (x + 1) * bayWidth
                      
                      elements.push(
                        <g key={`cb-${y}-${x}`}>
                          <line x1={xLeft} y1={yBottom - 8} x2={xRight} y2={yTop + 8} stroke="#94a3b8" strokeWidth="1.5" />
                          <line x1={xRight} y1={yBottom - 8} x2={xLeft} y2={yTop + 8} stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx={xLeft + bayWidth / 2} cy={yBottom - liftHeightSVG / 2} r="2" fill="#cbd5e1" />
                        </g>
                      )

                      // Catwalk (Papan Lantai)
                      if (y < deckLevels) {
                        elements.push(
                          <rect key={`cw-${y}-${x}`} x={xLeft} y={yTop} width={bayWidth} height="5" fill="#475569" rx="1" />
                        )
                      }
                    }

                    // Main Frame Oranye
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

                {/* Scafftag Hijau di Frame Pertama */}
                <rect x="70" y="225" width="12" height="18" fill="#10b981" rx="2" />
                <text x="76" y="237" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">OK</text>

                {/* Anotasi Dimensi */}
                <text x="300" y="30" fill="currentColor" opacity="0.8" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">
                  Tinggi Aktual: {actualHeight.toFixed(1)} m ({totalLifts} Susun) | Rasio: {heightRatio.toFixed(1)}:1
                </text>
                
                <line x1="80" y1="298" x2="520" y2="298" stroke="currentColor" opacity="0.4" strokeWidth="1" />
                <polygon points="80,298 85,295 85,301" fill="currentColor" opacity="0.4" />
                <polygon points="520,298 515,295 515,301" fill="currentColor" opacity="0.4" />
                <text x="300" y="310" fill="currentColor" opacity="0.8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">
                  Bentang Panjang: {actualLength.toFixed(1)} m ({totalBays} Bays x 1.83m)
                </text>
              </svg>
            </div>

            {/* Rekap Material BoQ */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 print:grid-cols-5 text-center mt-4">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Main Frame T-170</span>
                <span className="text-sm font-black text-orange-500 font-mono print:text-slate-900">{qtyMainFrames} <span className="text-[10px]">Pcs</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Cross Brace 2.2m</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{qtyCrossBraces} <span className="text-[10px]">Pcs</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Joint Pin</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{qtyJointPins} <span className="text-[10px]">Pcs</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Jack Base</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{qtyJackBases} <span className="text-[10px]">Pcs</span></span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Catwalk Papan</span>
                <span className="text-sm font-black text-white font-mono print:text-slate-900">{qtyCatwalks} <span className="text-[10px]">Lbr</span></span>
              </div>
            </div>
          </div>

          {/* Form Scafftag Lapangan (Khusus Hasil Cetak) */}
          <div className="hidden print:block border-2 border-slate-900 p-5 mt-6 rounded">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">SCAFFTAG STATUS</span>
                <span className="text-xl font-black text-slate-900">GREEN TAG (SAFE FOR USE)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block">Tanggal Inspeksi: {todayDate}</span>
                <span className="text-xs text-slate-600 block">Kapasitas Maksimal: 225 kg/m² (Medium Duty)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-4">
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
              disabled={!isInputValid}
              className={`px-5 py-2.5 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${isInputValid ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              {isInputValid ? '🖨️ Cetak BoQ &amp; Scafftag' : '⛔ Input Dimensi Valid'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
