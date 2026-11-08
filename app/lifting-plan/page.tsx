"use client"

import { useState, useId } from 'react'
import Link from 'next/link'

export default function LiftingPlanPage() {
  const formId = useId()
  const [activeTab, setActiveTab] = useState<'crane' | 'forklift'>('crane')

  // --- STATE CRANE (SLING TENSION) ---
  const [loadWeight, setLoadWeight] = useState<number>(2000)
  const [numSlings, setNumSlings] = useState<number>(2)
  const [slingAngleDeg, setSlingAngleDeg] = useState<number>(60) // Sudut terhadap horizontal
  const [slingSwl, setSlingSwl] = useState<number>(1500)

  // Kalkulasi Crane
  const safeSlingAngle = slingAngleDeg > 0 ? slingAngleDeg : 1;
  const angleRad = (safeSlingAngle * Math.PI) / 180;
  // Tegangan per sling = Berat / (Jumlah Sling * Sin(Sudut))
  const tensionPerSling = loadWeight / (numSlings * Math.sin(angleRad));
  const isCraneOverload = tensionPerSling > slingSwl;
  const isAngleDangerous = slingAngleDeg < 45; // Bahaya tegangan tinggi jika sudut terlalu datar
  const craneInputInvalid = loadWeight < 0 || slingSwl <= 0;
  const isCraneSafe = !isCraneOverload && !isAngleDangerous && !craneInputInvalid;

  // --- STATE FORKLIFT (CoG DE-RATING) ---
  const [fkCapacity, setFkCapacity] = useState<number>(3000) // Kapasitas pelat bawaan (kg)
  const [fkStdLoadCenter, setFkStdLoadCenter] = useState<number>(500) // Biasanya 500mm (Standar Jepang)
  const [fkLoadWeight, setFkLoadWeight] = useState<number>(2500) // Berat barang aktual (kg)
  const [loadLength, setLoadLength] = useState<number>(1400) // Panjang barang (mm)

  // Kalkulasi Forklift
  const actualLoadCenter = loadLength / 2;
  // Rumus De-rating Kapasitas: (Kapasitas Asli x Load Center Standar) / Load Center Aktual
  const newSafeCapacity = actualLoadCenter > fkStdLoadCenter 
    ? (fkCapacity * fkStdLoadCenter) / actualLoadCenter 
    : fkCapacity;
  
  const isFkOverload = fkLoadWeight > newSafeCapacity;
  const isFkTipping = actualLoadCenter > 1200; // Bahaya terguling (tipping) ekstrem
  const fkInputInvalid = fkCapacity <= 0 || fkStdLoadCenter <= 0 || fkLoadWeight < 0 || loadLength <= 0;
  const isFkSafe = !isFkOverload && !isFkTipping && !fkInputInvalid;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Interaktif (Sembunyikan saat dicetak) */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Lifting Plan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lifting Plan &amp; CoG Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Kalkulator tegangan sling (Crane) dan penyusutan kapasitas angkat akibat pergeseran titik berat (Forklift). Cetak halaman ini sebagai dokumen kelengkapan Izin Kerja Berbahaya (PTW).
        </p>

        {/* Tab Navigasi Modul */}
        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => setActiveTab('crane')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'crane' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            🏗️ Overhead Crane / Hoist
          </button>
          <button 
            onClick={() => setActiveTab('forklift')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'forklift' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            🚜 Forklift (CoG Extension)
          </button>
        </div>
      </div>

      {/* Header Dokumen Cetak (Hanya Muncul di Kertas/PDF) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Lifting Plan Permit</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">FORMULIR PERSETUJUAN PENGANGKATAN BERBAHAYA (PTW)</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Kategori Alat:</span>
            <span className="text-sm font-black text-slate-900 uppercase">{activeTab === 'crane' ? 'CRANE / HOIST' : 'FORKLIFT'}</span>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* KONTEN TAB: CRANE (SLING TENSION)           */}
      {/* ========================================= */}
      {activeTab === 'crane' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          <div className="lg:col-span-4 space-y-5 print:hidden">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">1. Parameter Beban</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Berat Beban Total (kg)</label>
                  <input type="number" step="100" min="0" value={loadWeight} onChange={(e) => setLoadWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">2. Konfigurasi Rigging (Sling)</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Sling (Titik)</label>
                    <select value={numSlings} onChange={(e) => setNumSlings(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option value={2}>2 Titik</option>
                      <option value={3}>3 Titik</option>
                      <option value={4}>4 Titik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Kapasitas 1 Sling (SWL kg)</label>
                    <input type="number" step="100" min="0" value={slingSwl} onChange={(e) => setSlingSwl(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sudut Sling Horizontal (Derajat)</label>
                  <input type="number" min="10" max="90" value={slingAngleDeg} onChange={(e) => setSlingAngleDeg(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  <span className="text-[10px] text-slate-400 mt-1 block">Idealnya 60°. Di bawah 45° sangat berbahaya.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 print:col-span-12">
            
            {!isCraneSafe && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 print:border-red-500 print:bg-white">
                <h3 className="text-sm font-black text-red-700 uppercase flex items-center gap-2 mb-2">⚠️ PENGANGKATAN DITOLAK</h3>
                <ul className="text-xs font-bold text-red-600 pl-6 list-disc">
                  {isCraneOverload && <li><strong>SLING OVERLOAD:</strong> Tegangan aktual ({tensionPerSling.toFixed(1)} kg) melampaui SWL Webbing/Sling ({slingSwl} kg).</li>}
                  {isAngleDangerous && <li><strong>SUDUT KRITIS:</strong> Sudut {slingAngleDeg}° terlalu datar, melipatgandakan gaya tarik vertikal (Risiko putus sling tinggi).</li>}
                </ul>
              </div>
            )}

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 print:bg-white print:border-slate-300 print:text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">SCHEMATIC</span>
                  <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">CRANE RIGGING 2D</span>
                </div>
                <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${isCraneSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                  {isCraneSafe ? '✓ GO / AMAN' : '⛔ NO GO'}
                </span>
              </div>

              {/* RENDER KANVAS CRANE */}
              <div className="relative aspect-video w-full bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300">
                <svg viewBox="0 0 600 350" className="w-full h-full" role="img" aria-label="Visualisasi Skema Crane">
                  {/* Hook / Kail */}
                  <path d="M 290 30 Q 300 10 310 30 T 310 60 Q 300 80 290 60" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="300" cy="70" r="10" fill="#94a3b8" />
                  
                  {/* Trigonometri Sling */}
                  {(() => {
                    const topX = 300;
                    const topY = 70;
                    const boxW = 200;
                    const boxH = 100;
                    const groundY = 320;
                    const loadY = groundY - boxH; // 220
                    const slingLen = (boxW / 2) / Math.cos(angleRad);
                    const actualSlingY = topY + (slingLen * Math.sin(angleRad)); // Ketinggian ujung sling
                    
                    // Menyesuaikan posisi gambar (Hook naik/turun)
                    const offsetY = loadY - actualSlingY;
                    const renderTopY = topY + offsetY;

                    return (
                      <g>
                        {/* Sling (Kiri & Kanan) */}
                        <line x1={topX} y1={renderTopY} x2={topX - (boxW/2) + 20} y2={loadY} stroke={isCraneOverload ? "#ef4444" : "#eab308"} strokeWidth="4" />
                        <line x1={topX} y1={renderTopY} x2={topX + (boxW/2) - 20} y2={loadY} stroke={isCraneOverload ? "#ef4444" : "#eab308"} strokeWidth="4" />
                        <circle cx={topX} cy={renderTopY} r="8" fill="#cbd5e1" />
                        
                        {/* Beban Kotak */}
                        <rect x={topX - (boxW/2)} y={loadY} width={boxW} height={boxH} fill="#3b82f6" rx="4" />
                        <circle cx={topX} cy={loadY + (boxH/2)} r="15" fill="#1e3a8a" />
                        <circle cx={topX} cy={loadY + (boxH/2)} r="10" fill="#f8fafc" />
                        <path d={`M ${topX-5} ${loadY+(boxH/2)} L ${topX+5} ${loadY+(boxH/2)} M ${topX} ${loadY+(boxH/2)-5} L ${topX} ${loadY+(boxH/2)+5}`} stroke="#000" strokeWidth="2" />
                        <text x={topX} y={loadY + (boxH/2) + 35} fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">CoG</text>
                        <text x={topX} y={loadY + (boxH/2) - 25} fill="#f8fafc" fontSize="14" fontWeight="black" textAnchor="middle">{loadWeight} KG</text>
                        
                        {/* Garis Sudut */}
                        <line x1={topX - (boxW/2)} y1={loadY} x2={topX + (boxW/2)} y2={loadY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                        <text x={topX + 50} y={loadY - 20} fill="#94a3b8" fontSize="12" fontWeight="bold">∠ {slingAngleDeg}°</text>
                      </g>
                    )
                  })()}
                  {/* Tanah */}
                  <line x1="50" y1="320" x2="550" y2="320" stroke="#334155" strokeWidth="3" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 print:grid-cols-2">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Beban per Sling (Tension)</span>
                  <span className={`text-xl font-black font-mono ${isCraneOverload ? 'text-red-500' : 'text-emerald-400'} print:text-slate-900`}>{tensionPerSling.toFixed(1)} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Kapasitas Maksimal Sling</span>
                  <span className="text-xl font-black text-white font-mono print:text-slate-900">{slingSwl.toLocaleString()} <span className="text-xs">kg</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* KONTEN TAB: FORKLIFT (COG DE-RATING)        */}
      {/* ========================================= */}
      {activeTab === 'forklift' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          <div className="lg:col-span-4 space-y-5 print:hidden">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">1. Spesifikasi Forklift</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kapasitas Tertera di Pelat (kg)</label>
                  <input type="number" step="500" min="0" value={fkCapacity} onChange={(e) => setFkCapacity(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Load Center Standar Alat (mm)</label>
                  <select value={fkStdLoadCenter} onChange={(e) => setFkStdLoadCenter(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                    <option value={500}>500 mm (Mayoritas Asia/Jepang)</option>
                    <option value={600}>600 mm (Eropa/AS Besar)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">2. Dimensi & Beban Produk</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Berat Beban Aktual (kg)</label>
                  <input type="number" step="100" min="0" value={fkLoadWeight} onChange={(e) => setFkLoadWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Beban/Pallet (mm)</label>
                  <input type="number" step="100" min="100" value={loadLength} onChange={(e) => setLoadLength(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  <span className="text-[10px] text-slate-400 mt-1 block">Titik berat aktual (CoG) = {actualLoadCenter.toFixed(0)} mm.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 print:col-span-12">
            
            {!isFkSafe && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 print:border-red-500 print:bg-white">
                <h3 className="text-sm font-black text-red-700 uppercase flex items-center gap-2 mb-2">⚠️ PENGANGKATAN DITOLAK</h3>
                <ul className="text-xs font-bold text-red-600 pl-6 list-disc">
                  {isFkOverload && <li><strong>FORKLIFT OVERLOAD:</strong> Berat aktual ({fkLoadWeight} kg) melampaui De-rating Capacity ({newSafeCapacity.toFixed(0)} kg) karena barang terlalu panjang.</li>}
                  {isFkTipping && <li><strong>BAHAYA TERGULING (TIPPING):</strong> Titik berat terlalu jauh dari pangkal garpu (ekstrem), keseimbangan hilang.</li>}
                </ul>
              </div>
            )}

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 print:bg-white print:border-slate-300 print:text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">SCHEMATIC</span>
                  <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">FORKLIFT COG 2D</span>
                </div>
                <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${isFkSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                  {isFkSafe ? '✓ GO / AMAN' : '⛔ NO GO'}
                </span>
              </div>

              {/* RENDER KANVAS FORKLIFT */}
              <div className="relative aspect-video w-full bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300">
                <svg viewBox="0 0 600 350" className="w-full h-full" role="img" aria-label="Visualisasi Skema Forklift">
                  {/* Body Forklift Simplifikasi */}
                  <rect x="50" y="150" width="180" height="130" fill="#cbd5e1" rx="10" />
                  <rect x="130" y="80" width="100" height="70" fill="#94a3b8" rx="8" />
                  <rect x="230" y="70" width="15" height="210" fill="#475569" /> {/* Tiang Mast */}
                  
                  <circle cx="90" cy="280" r="30" fill="#1e293b" /> {/* Roda Belakang */}
                  <circle cx="200" cy="280" r="35" fill="#1e293b" /> {/* Roda Depan (Fulcrum/Poros putar) */}
                  
                  {/* Garpu (Forks) */}
                  <path d="M 245 270 L 450 270 L 450 260 L 255 260 L 255 70 L 245 70 Z" fill="#64748b" />
                  
                  {/* Beban Box */}
                  {(() => {
                    // Proporsi visual: kita asumsikan 1000mm = 100px.
                    const visLength = (loadLength / 1000) * 100;
                    const visLimit = Math.min(visLength, 300); // Cegah jebol layar
                    const startX = 255;
                    const boxY = 160;
                    const boxH = 100;
                    const actualCoGx = startX + (visLimit / 2);

                    return (
                      <g>
                        {/* Kotak Beban */}
                        <rect x={startX} y={boxY} width={visLimit} height={boxH} fill={isFkOverload ? "#ef4444" : "#f97316"} rx="4" />
                        
                        {/* Target/Poros CoG */}
                        <circle cx={actualCoGx} cy={boxY + (boxH/2)} r="15" fill="#fff" />
                        <circle cx={actualCoGx} cy={boxY + (boxH/2)} r="10" fill="#000" />
                        <path d={`M ${actualCoGx-5} ${boxY+(boxH/2)} L ${actualCoGx+5} ${boxY+(boxH/2)} M ${actualCoGx} ${boxY+(boxH/2)-5} L ${actualCoGx} ${boxY+(boxH/2)+5}`} stroke="#fff" strokeWidth="2" />
                        
                        {/* Teks Dimensi */}
                        <line x1={startX} y1={boxY - 15} x2={startX + visLimit} y2={boxY - 15} stroke="#94a3b8" strokeWidth="1" />
                        <text x={actualCoGx} y={boxY - 25} fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">Panjang: {loadLength} mm</text>
                        
                        {/* Jarak Load Center (Dari pangkal garpu ke CoG) */}
                        <line x1={startX} y1={290} x2={actualCoGx} y2={290} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                        <polygon points={`${actualCoGx},290 ${actualCoGx-8},285 ${actualCoGx-8},295`} fill="#cbd5e1" />
                        <text x={startX + ((actualCoGx - startX) / 2)} y={310} fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">CoG (D): {actualLoadCenter.toFixed(0)} mm</text>
                        
                        <text x={actualCoGx} y={boxY + (boxH/2) + 35} fill="#fff" fontSize="14" fontWeight="black" textAnchor="middle">{fkLoadWeight} KG</text>
                      </g>
                    )
                  })()}
                  
                  <line x1="20" y1="315" x2="580" y2="315" stroke="#334155" strokeWidth="3" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 print:grid-cols-2">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Kapasitas Baru (Setelah De-rating)</span>
                  <span className={`text-xl font-black font-mono ${isFkOverload ? 'text-red-500' : 'text-emerald-400'} print:text-slate-900`}>{newSafeCapacity.toFixed(0)} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Berat Aktual Barang</span>
                  <span className="text-xl font-black text-white font-mono print:text-slate-900">{fkLoadWeight.toLocaleString()} <span className="text-xs">kg</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* FOOTER PERSETUJUAN (KHUSUS CETAK)         */}
      {/* ========================================= */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-12 border-t-2 border-slate-900 mt-12">
        <div className="text-center">
          <p className="text-xs font-bold text-slate-600 mb-12">Dipersiapkan Oleh (Rigger/Operator):</p>
          <div className="w-40 mx-auto border-b border-slate-400"></div>
          <p className="text-xs mt-2">Nama / Tanggal</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-600 mb-12">Diperiksa Oleh (HSE/Safety):</p>
          <div className="w-40 mx-auto border-b border-slate-400"></div>
          <p className="text-xs mt-2">Nama / Tanggal</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-600 mb-12">Disetujui Oleh (Site Manager):</p>
          <div className="w-40 mx-auto border-b border-slate-400"></div>
          <p className="text-xs mt-2">Nama / Tanggal</p>
        </div>
      </div>

      {/* Action Tombol Cetak (Layar Saja) */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Cetak Dokumen PTW</h3>
          <p className="text-xs text-slate-600 mt-0.5">Permit to Work (PTW) wajib dicetak, ditandatangani, dan dilampirkan pada JSA.</p>
        </div>
        <button
          onClick={() => window.print()}
          disabled={(activeTab === 'crane' && !isCraneSafe) || (activeTab === 'forklift' && !isFkSafe)}
          className={`px-4 py-2 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${((activeTab === 'crane' && isCraneSafe) || (activeTab === 'forklift' && isFkSafe)) ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
        >
          {((activeTab === 'crane' && isCraneSafe) || (activeTab === 'forklift' && isFkSafe)) ? '🖨️ Cetak Permit PTW' : '⛔ Tidak Dapat Dicetak (Overload)'}
        </button>
      </div>

    </div>
  )
}
