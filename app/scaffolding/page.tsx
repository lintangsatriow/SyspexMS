"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function ScaffoldingCalculatorPage() {
  const formId = useId()

  // Input Dimensi (Meter)
  const [length, setLength] = useState<number>(10) // Panjang total
  const [height, setHeight] = useState<number>(6)  // Tinggi total
  const [width, setWidth] = useState<number>(1.2)  // Lebar standar 1.2m
  
  // Standar Beban (Duty Class - EN 12811-1)
  const [dutyClass, setDutyClass] = useState<'Light' | 'Medium' | 'Heavy'>('Medium')
  const [deckLevels, setDeckLevels] = useState<number>(1) // Berapa tingkat yang dipasang papan kerja

  // Logic Engineering & Estimasi BoQ
  const liftHeight = 2.0 // Standar tinggi per tingkat (lift) adalah 2 meter

  // Penentuan kapasitas dan jarak bentang (Bay Length) berdasarkan Kelas Beban
  let maxBayLength = 2.4
  let loadCapacity = 150 // kg/m2
  if (dutyClass === 'Medium') {
    maxBayLength = 2.1
    loadCapacity = 200
  } else if (dutyClass === 'Heavy') {
    maxBayLength = 1.8
    loadCapacity = 300
  }

  // Kalkulasi Geometri
  const totalBays = Math.ceil(length / maxBayLength)
  const actualBayLength = length / totalBays
  const totalLifts = Math.ceil(height / liftHeight)

  // Estimasi Kebutuhan Material (Tube & Fitting Scaffold)
  const qtyStandards = (totalBays + 1) * 2 // Tiang vertikal (depan belakang)
  const qtyLedgers = totalBays * (totalLifts + 1) * 2 // Pipa horizontal memanjang
  const qtyTransoms = (totalBays + 1) * (totalLifts + 1) // Pipa horizontal melintang
  const qtyBasePlates = qtyStandards // Pelat dasar penyangga tiang
  const qtyBracing = totalBays * totalLifts // Estimasi pipa bracing diagonal
  
  // Papan Scaffolding (asumsi lebar papan 225mm / 0.225m)
  const boardsPerBay = Math.ceil(width / 0.225)
  const qtyBoards = totalBays * boardsPerBay * deckLevels

  // Couplers / Clamp
  const qtyRightAngleCouplers = (qtyLedgers + qtyTransoms) * 2 // Asumsi klem mati
  const qtySwivelCouplers = qtyBracing * 2 // Klem hidup untuk bracing

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Engineering &amp; Fabrikasi</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          Tube &amp; Fitting Scaffold Calculator &bull; EN-12811
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perancangan Standar Scaffolding
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Kalkulator otomasi Bill of Quantities (BoQ) material pipa, clamp, dan papan kerja berdasarkan dimensi serta regulasi kelas beban (*Duty Class*) K3.
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
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Panjang Total (Length - m)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tinggi (Height - m)</label>
                  <input
                    type="number"
                    min="2"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lebar (Width - m)</label>
                  <input
                    type="number"
                    min="0.6"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 1.2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
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
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kategori Beban Kerja</label>
                <select
                  value={dutyClass}
                  onChange={(e) => setDutyClass(e.target.value as 'Light' | 'Medium' | 'Heavy')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="Light">Light Duty (Pengecatan/Inspeksi - 150 kg/m²)</option>
                  <option value="Medium">Medium Duty (Konstruksi Umum - 200 kg/m²)</option>
                  <option value="Heavy">Heavy Duty (Fabrikasi/Masonry - 300 kg/m²)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tingkat Berpapan (Working Decks)</label>
                <input
                  type="number"
                  min="1"
                  max={totalLifts}
                  value={deckLevels}
                  onChange={(e) => setDeckLevels(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Berapa tingkat yang akan dipasang lantai pijakan penuh.</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT & ESTIMASI */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card Verifikasi Standar Teknis */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Verifikasi Standar Geometri
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Sesuai Standar EN-12811
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Safe Working Load</span>
                <span className="text-lg font-black text-blue-700 font-mono">{loadCapacity}</span>
                <span className="text-[10px] text-slate-500 font-bold ml-1">kg/m²</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Max Bay Length</span>
                <span className="text-lg font-black text-slate-900 font-mono">{maxBayLength.toFixed(1)}</span>
                <span className="text-[10px] text-slate-500 font-bold ml-1">Meter</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Jumlah Bay</span>
                <span className="text-lg font-black text-slate-900 font-mono">{totalBays}</span>
                <span className="text-[10px] text-slate-500 font-bold ml-1">Bays</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Jumlah Lift</span>
                <span className="text-lg font-black text-slate-900 font-mono">{totalLifts}</span>
                <span className="text-[10px] text-slate-500 font-bold ml-1">Tingkat</span>
              </div>
            </div>
          </div>

          {/* Card Estimasi Material (BoQ) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Bill of Quantities (Estimasi Material Pipa &amp; Klem)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Standards (Tiang Vertikal)</strong>
                    <span className="text-[10px] text-slate-500">Pipa penyangga utama</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyStandards} <span className="text-[10px] text-slate-400">Batang</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Ledgers (Horizontal Memanjang)</strong>
                    <span className="text-[10px] text-slate-500">Mengikat antar tiang panjang</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyLedgers} <span className="text-[10px] text-slate-400">Batang</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Transoms (Horizontal Lebar)</strong>
                    <span className="text-[10px] text-slate-500">Penyangga papan pijakan</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyTransoms} <span className="text-[10px] text-slate-400">Batang</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Diagonal Bracing</strong>
                    <span className="text-[10px] text-slate-500">Pengaku struktur (Sway/Cross)</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyBracing} <span className="text-[10px] text-slate-400">Batang</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Base Plates / Jack Base</strong>
                    <span className="text-[10px] text-slate-500">Pelat tumpuan lantai</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyBasePlates} <span className="text-[10px] text-slate-400">Pcs</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Scaffold Boards (Metal Plank)</strong>
                    <span className="text-[10px] text-slate-500">Total untuk {deckLevels} lantai kerja</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyBoards} <span className="text-[10px] text-slate-400">Lembar</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Right-Angle Coupler (Klem Mati)</strong>
                    <span className="text-[10px] text-slate-500">Ikatan 90 derajat</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtyRightAngleCouplers} <span className="text-[10px] text-slate-400">Pcs</span></span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div>
                    <strong className="text-xs text-slate-900 block">Swivel Coupler (Klem Hidup)</strong>
                    <span className="text-[10px] text-slate-500">Ikatan rotasi untuk bracing</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-900">{qtySwivelCouplers} <span className="text-[10px] text-slate-400">Pcs</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Sistem Tagging Hijau (Scafftag) */}
          <div className="bg-emerald-500 p-1.5 rounded-2xl shadow-md">
            <div className="bg-white rounded-xl p-5 border border-emerald-600 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner border border-emerald-200">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-700 tracking-tight uppercase">Safe For Use (Green Tag)</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 uppercase tracking-wider">
                    Desain Kategori: {dutyClass} Duty &bull; Max Beban: {loadCapacity} KG/m²
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition whitespace-nowrap"
              >
                🖨️ Cetak Form Inspeksi
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
