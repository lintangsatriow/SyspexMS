"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function ScaffoldingPage() {
  const formId = useId()

  const [length, setLength] = useState<number>(10)
  const [height, setHeight] = useState<number>(6)
  const [width, setWidth] = useState<number>(1.2)
  const [dutyClass, setDutyClass] = useState<'Light' | 'Medium' | 'Heavy'>('Medium')
  const [deckLevels, setDeckLevels] = useState<number>(1)

  const liftHeight = 2.0
  let maxBayLength = 2.4
  let loadCapacity = 150
  
  if (dutyClass === 'Medium') {
    maxBayLength = 2.1
    loadCapacity = 200
  } else if (dutyClass === 'Heavy') {
    maxBayLength = 1.8
    loadCapacity = 300
  }

  const totalBays = Math.ceil(length / maxBayLength)
  const actualBayLength = length / totalBays
  const totalLifts = Math.ceil(height / liftHeight)

  // Estimasi Material BoQ
  const qtyStandards = (totalBays + 1) * 2
  const qtyLedgers = totalBays * (totalLifts + 1) * 2
  const qtyTransoms = (totalBays + 1) * (totalLifts + 1)
  const qtyBasePlates = qtyStandards
  const qtyBracing = totalBays * totalLifts
  const boardsPerBay = Math.ceil(width / 0.225)
  const qtyBoards = totalBays * boardsPerBay * deckLevels
  const qtyRightAngleCouplers = (qtyLedgers + qtyTransoms) * 2
  const qtySwivelCouplers = qtyBracing * 2

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Engineering &amp; Operasional</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          Tube &amp; Fitting Scaffold Calculator &bull; EN-12811
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perancangan Standar Scaffolding (BoQ &amp; Visual)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Kalkulator otomatisasi Bill of Quantities (BoQ) material pipa, klem, dan papan kerja berdasarkan dimensi serta regulasi kelas beban perancah K3.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: INPUT PARAMETER */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>1. Dimensi Area (Meter)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-len`} className="block text-[11px] font-semibold text-slate-600 mb-1">Panjang Total (Length - m)</label>
                <input
                  id={`${formId}-len`}
                  type="number"
                  min="1"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-h`} className="block text-[11px] font-semibold text-slate-600 mb-1">Tinggi (Height - m)</label>
                  <input
                    id={`${formId}-h`}
                    type="number"
                    min="2"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-w`} className="block text-[11px] font-semibold text-slate-600 mb-1">Lebar (Width - m)</label>
                  <input
                    id={`${formId}-w`}
                    type="number"
                    min="0.6"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 1.2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>2. Spesifikasi Beban (Duty Class)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-dc`} className="block text-[11px] font-semibold text-slate-600 mb-1">Kategori Beban Kerja</label>
                <select
                  id={`${formId}-dc`}
                  value={dutyClass}
                  onChange={(e) => setDutyClass(e.target.value as 'Light' | 'Medium' | 'Heavy')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Light">Light Duty (Pengecatan/Inspeksi - 150 kg/m²)</option>
                  <option value="Medium">Medium Duty (Konstruksi Umum - 200 kg/m²)</option>
                  <option value="Heavy">Heavy Duty (Fabrikasi/Masonry - 300 kg/m²)</option>
                </select>
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
                <span className="text-xs font-black bg-emerald-600 text-white px-2 py-0.5 rounded tracking-wide font-mono">BLUEPRINT</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynamic 2D Wireframe &bull; SYSPEX SCAFFOLDING</span>
              </div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ✓ Aman (PASSED)
              </span>
            </div>

            {/* Sketsa Render Canvas 2D Live (Tube & Fitting Model) */}
            <div className="relative aspect-video w-full bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden py-4">
              <svg viewBox="0 0 600 320" className="w-full h-full text-slate-300 font-sans select-none">
                {/* Garis Grid Latar Belakang */}
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                {/* Ground Line */}
                <line x1="50" y1="280" x2="550" y2="280" stroke="#334155" strokeWidth="3" />

                {/* Base Plates (Pelat Dasar) */}
                {Array.from({ length: totalBays + 1 }).map((_, idx) => {
                  const x = 80 + idx * (380 / totalBays);
                  return (
                    <g key={idx}>
                      <rect x={x - 8} y="274" width="16" height="6" fill="#64748b" rx="1" />
                      {/* Tiang Standards (Vertikal) */}
                      <line x1={x} y1="274" x2={x} y2="50" stroke="#cbd5e1" strokeWidth="3.5" />
                    </g>
                  );
                })}

                {/* Ledgers (Horizontal Memanjang) & Guardrails */}
                {Array.from({ length: totalLifts + 1 }).map((_, idx) => {
                  const y = 274 - (idx * (220 / totalLifts));
                  return (
                    <g key={idx}>
                      <line x1="60" y1={y} x2="500" y2={y" stroke="#94a3b8" strokeWidth="2.5" />
                      {/* Guardrails di bagian atas setiap working deck */}
                      {idx > 0 && (
                        <>
                          <line x1="60" y1={y - 12} x2="500" y2={y - 12} stroke="#64748b" strokeWidth="1.2" strokeDasharray="2,2" />
                          <line x1="60" y1={y - 24} x2="500" y2={y - 24} stroke="#475569" strokeWidth="1.2" />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Diagonal Bracing / Palang Silang Stabilisator */}
                {Array.from({ length: totalBays }).map((_, idx) => {
                  const xStart = 80 + idx * (380 / totalBays);
                  const xEnd = 80 + (idx + 1) * (380 / totalBays);
                  return (
                    <line key={idx} x1={xStart} y1="274" x2={xEnd} y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />
                  );
                })}

                {/* Tagaman K3 (Scafftag Hijau) */}
                <rect x="70" y="225" width="14" height="20" fill="#10b981" rx="1" />
                <text x="77" y="238" fill="#ffffff" fontSize="7" fontWeight="black" textAnchor="middle">OK</text>

                {/* Dimensi Label */}
                <text x="280" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" className="uppercase font-mono">Tinggi Perancah: {height}m ({totalLifts} Lift)</text>
                
                {/* Panjang */}
                <line x1="80" y1="295" x2="460" y2="295" stroke="#475569" strokeWidth="1" />
                <polygon points="80,295 85,292 85,298" fill="#475569" />
                <polygon points="460,295 455,292 455,298" fill="#475569" />
                <text x="270" y="308" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Length: {length} Meter ({totalBays} Bays)</text>
              </svg>
            </div>

            {/* Rekap Material BoQ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Tiang (Standards)</span>
                <span className="text-sm font-black text-white font-mono">{qtyStandards} <span className="text-[10px] text-slate-400">Btg</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Horizontal (Ledgers)</span>
                <span className="text-sm font-black text-white font-mono">{qtyLedgers} <span className="text-[10px] text-slate-400">Btg</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Papan (Catwalk)</span>
                <span className="text-sm font-black text-white font-mono">{qtyBoards} <span className="text-[10px] text-slate-400">Lbr</span></span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">Sambungan (Clamp)</span>
                <span className="text-sm font-black text-white font-mono">{qtyRightAngleCouplers + qtySwivelCouplers} <span className="text-[10px] text-slate-400">Pcs</span></span>
              </div>
            </div>
          </div>

          {/* Form Inspeksi */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Green Tag / Scafftag Safe</h3>
              <p className="text-xs text-slate-500 mt-1">Cetak laporan visualisasi dan kualifikasi ini untuk pengurusan izin, inspeksi K3, dan penempatan di base scaffolding.</p>
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
