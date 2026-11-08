"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

export default function LiftingPlanPage() {
  const formId = useId()
  const [activeTab, setActiveTab] = useState<'crane' | 'forklift'>('crane')
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    // Mengambil tanggal hari ini (YYYY-MM-DD) untuk validasi SIO/SILO
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // ==========================================
  // STATE CRANE (RIGGING & SLING TENSION)
  // ==========================================
  const [loadWeight, setLoadWeight] = useState<number>(2000)
  const [numSlings, setNumSlings] = useState<number>(2)
  const [slingAngleDeg, setSlingAngleDeg] = useState<number>(60) 
  const [slingSwl, setSlingSwl] = useState<number>(1500)
  
  // Detail Rigging
  const [slingType, setSlingType] = useState<string>('Webbing Sling')
  const [shackleType, setShackleType] = useState<string>('Bow (Omega) Shackle')
  const [hitchType, setHitchType] = useState<'Straight' | 'Choker' | 'Basket'>('Straight')
  
  // Legalitas
  const [sioCrane, setSioCrane] = useState<string>('')
  const [siloCrane, setSiloCrane] = useState<string>('')

  // Kalkulasi Fisika & Safety Crane
  const safeSlingAngle = slingAngleDeg > 0 ? slingAngleDeg : 1;
  const angleRad = (safeSlingAngle * Math.PI) / 180;
  
  // Modifier Hitch (Metode Ikat) terhadap kapasitas
  const hitchModifier = hitchType === 'Choker' ? 0.8 : (hitchType === 'Basket' ? 2.0 : 1.0);
  const effectiveSlingSwl = slingSwl * hitchModifier;
  
  const tensionPerSling = loadWeight / (numSlings * Math.sin(angleRad));
  const isCraneOverload = tensionPerSling > effectiveSlingSwl;
  const isAngleDangerous = slingAngleDeg < 45; 
  
  const isSioCraneValid = sioCrane !== '' && sioCrane >= todayDate;
  const isSiloCraneValid = siloCrane !== '' && siloCrane >= todayDate;
  const craneInputInvalid = loadWeight <= 0 || slingSwl <= 0;
  
  const isCraneSafe = !isCraneOverload && !isAngleDangerous && !craneInputInvalid && isSioCraneValid && isSiloCraneValid;


  // ==========================================
  // STATE FORKLIFT (COG & EXTENSION)
  // ==========================================
  const [fkCapacity, setFkCapacity] = useState<number>(3000)
  const [fkStdLoadCenter, setFkStdLoadCenter] = useState<number>(500)
  const [fkLoadWeight, setFkLoadWeight] = useState<number>(2500) 
  const [loadLength, setLoadLength] = useState<number>(1400) 
  
  // Ekstensi & Dimensi
  const [baseForkLength, setBaseForkLength] = useState<number>(1220)
  const [forkExtension, setForkExtension] = useState<number>(0) // 0 jika tidak ada
  
  // Legalitas
  const [sioForklift, setSioForklift] = useState<string>('')
  const [siloForklift, setSiloForklift] = useState<string>('')

  // Kalkulasi Fisika Forklift
  const actualLoadCenter = loadLength / 2;
  const effectiveForkLength = baseForkLength + forkExtension;
  
  // Rumus De-rating
  const newSafeCapacity = actualLoadCenter > fkStdLoadCenter 
    ? (fkCapacity * fkStdLoadCenter) / actualLoadCenter 
    : fkCapacity;
  
  const isFkOverload = fkLoadWeight > newSafeCapacity;
  const isFkTipping = actualLoadCenter > 1500; 
  const isLoadUnsupported = loadLength > effectiveForkLength * 1.5; // Barang menonjol lebih dari 50% garpu

  const isSioFkValid = sioForklift !== '' && sioForklift >= todayDate;
  const isSiloFkValid = siloForklift !== '' && siloForklift >= todayDate;
  const fkInputInvalid = fkCapacity <= 0 || fkLoadWeight <= 0 || loadLength <= 0;
  
  const isFkSafe = !isFkOverload && !isFkTipping && !isLoadUnsupported && !fkInputInvalid && isSioFkValid && isSiloFkValid;


  // ==========================================
  // KOMPONEN RENDER 3D ISOMETRIC
  // ==========================================
  const Box3D = ({ x, y, w, h, depth, frontColor, topColor, sideColor }: any) => {
    return (
      <g>
        {/* Atas */}
        <polygon points={`${x},${y} ${x + w},${y} ${x + w + depth},${y - depth} ${x + depth},${y - depth}`} fill={topColor} />
        {/* Samping Kanan */}
        <polygon points={`${x + w},${y} ${x + w + depth},${y - depth} ${x + w + depth},${y + h - depth} ${x + w},${y + h}`} fill={sideColor} />
        {/* Depan */}
        <rect x={x} y={y} width={w} height={h} fill={frontColor} />
      </g>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Fungsional (Sembunyikan saat dicetak) */}
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
          Sistem izin kerja (PTW) angkat berat terintegrasi. Menghitung tegangan sling komprehensif (Crane) dan ekstensi titik berat (Forklift) beserta verifikasi kelayakan alat dan operator.
        </p>

        <div className="flex gap-2 mt-6">
          <button onClick={() => setActiveTab('crane')} className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all ${activeTab === 'crane' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            🏗️ Overhead Crane / Hoist
          </button>
          <button onClick={() => setActiveTab('forklift')} className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all ${activeTab === 'forklift' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            🚜 Forklift (CoG Extension)
          </button>
        </div>
      </div>

      {/* Header Dokumen Cetak */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Lifting Plan Permit</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">FORMULIR PERSETUJUAN PENGANGKATAN BERBAHAYA (PTW)</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Kategori Alat:</span>
            <span className="text-sm font-black text-slate-900 uppercase">{activeTab === 'crane' ? 'CRANE / HOIST' : 'FORKLIFT EXTENSION'}</span>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* TAB 1: CRANE RIGGING                      */}
      {/* ========================================= */}
      {activeTab === 'crane' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          <div className="lg:col-span-4 space-y-5 print:hidden">
            
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">1. Parameter Rigging</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Berat Beban Total (kg)</label>
                  <input type="number" step="100" min="0" value={loadWeight} onChange={(e) => setLoadWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Sling</label>
                    <select value={slingType} onChange={(e) => setSlingType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option>Webbing Sling</option>
                      <option>Wire Rope</option>
                      <option>Chain Block</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Shackle</label>
                    <select value={shackleType} onChange={(e) => setShackleType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option>Bow (Omega)</option>
                      <option>D-Type</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Kapasitas Base Sling (kg)</label>
                    <input type="number" step="100" min="0" value={slingSwl} onChange={(e) => setSlingSwl(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metode Ikat (Hitch)</label>
                    <select value={hitchType} onChange={(e) => setHitchType(e.target.value as any)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option value="Straight">Straight (1.0x)</option>
                      <option value="Choker">Choker (0.8x)</option>
                      <option value="Basket">Basket (2.0x)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jml Sling/Kaki</label>
                    <input type="number" min="2" max="4" value={numSlings} onChange={(e) => setNumSlings(parseInt(e.target.value) || 2)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Sudut Kemiringan (°)</label>
                    <input type="number" min="10" max="90" value={slingAngleDeg} onChange={(e) => setSlingAngleDeg(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">2. Kepatuhan &amp; Legalitas</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                    <span>Masa Berlaku SILO Crane</span>
                    {!isSiloCraneValid && <span className="text-red-500 uppercase">Invalid/Expired</span>}
                  </label>
                  <input type="date" value={siloCrane} onChange={(e) => setSiloCrane(e.target.value)} className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs font-bold focus:outline-none transition ${!isSiloCraneValid && siloCrane ? 'border-red-400 text-red-700' : 'border-slate-200 text-slate-900'}`} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                    <span>Masa Berlaku SIO Operator/Rigger</span>
                    {!isSioCraneValid && <span className="text-red-500 uppercase">Invalid/Expired</span>}
                  </label>
                  <input type="date" value={sioCrane} onChange={(e) => setSioCrane(e.target.value)} className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs font-bold focus:outline-none transition ${!isSioCraneValid && sioCrane ? 'border-red-400 text-red-700' : 'border-slate-200 text-slate-900'}`} />
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8 space-y-6 print:col-span-12">
            {!isCraneSafe && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 print:border-red-500 print:bg-white">
                <h3 className="text-sm font-black text-red-700 uppercase flex items-center gap-2 mb-2">⚠️ PENGANGKATAN DITOLAK</h3>
                <ul className="text-xs font-bold text-red-600 pl-6 list-disc">
                  {!isSioCraneValid && <li><strong>LEGAL FAIL:</strong> SIO Operator belum diisi atau sudah kadaluarsa.</li>}
                  {!isSiloCraneValid && <li><strong>LEGAL FAIL:</strong> SILO Alat belum diisi atau sudah kadaluarsa.</li>}
                  {isCraneOverload && <li><strong>OVERLOAD:</strong> Tegangan sling aktual ({tensionPerSling.toFixed(1)} kg) melampaui SWL Efektif ({effectiveSlingSwl} kg).</li>}
                  {isAngleDangerous && <li><strong>SUDUT KRITIS:</strong> Sudut {slingAngleDeg}° melipatgandakan gaya tarik, risiko sling putus sangat tinggi.</li>}
                </ul>
              </div>
            )}

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 print:bg-white print:border-slate-300 print:text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">ISOMETRIC 3D</span>
                  <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">CRANE RIGGING DYNAMICS</span>
                </div>
                <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${isCraneSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                  {isCraneSafe ? '✓ GO / AMAN' : '⛔ NO GO'}
                </span>
              </div>

              {/* RENDER KANVAS 3D CRANE */}
              <div className="relative aspect-video w-full bg-[#0b1121] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0b1121 100%)' }}>
                <svg viewBox="0 0 600 350" className="w-full h-full" role="img" aria-label="Visualisasi 3D Skema Crane">
                  <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <line key={`g-${i}`} x1="0" y1={320 + (i * -12.5)} x2="600" y2={320 + (i * -12.5)} />
                    ))}
                  </g>

                  {/* Hook / Kail */}
                  <path d="M 290 30 Q 300 10 310 30 T 310 60 Q 300 80 290 60" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="300" cy="70" r="10" fill="#cbd5e1" />
                  
                  {(() => {
                    const topX = 300;
                    const topY = 70;
                    const boxW = 220;
                    const boxH = 100;
                    const depth = 60;
                    const groundY = 320;
                    const loadY = groundY - boxH - 20; 
                    const slingLen = (boxW / 2) / Math.cos(angleRad);
                    const actualSlingY = topY + (slingLen * Math.sin(angleRad)); 
                    const offsetY = loadY - actualSlingY;
                    const renderTopY = topY + offsetY;

                    return (
                      <g>
                        {/* Tali Sling Belakang (3D Depth) */}
                        <line x1={topX} y1={renderTopY} x2={topX - (boxW/2) + depth + 10} y2={loadY - depth} stroke={isCraneOverload ? "#991b1b" : "#a16207"} strokeWidth="2" strokeDasharray="4,4" />
                        <line x1={topX} y1={renderTopY} x2={topX + (boxW/2) + depth - 10} y2={loadY - depth} stroke={isCraneOverload ? "#991b1b" : "#a16207"} strokeWidth="2" strokeDasharray="4,4" />

                        {/* Beban Kotak 3D Isometric */}
                        <Box3D x={topX - (boxW/2)} y={loadY} w={boxW} h={boxH} depth={depth} frontColor="#2563eb" topColor="#60a5fa" sideColor="#1d4ed8" />
                        
                        {/* Simbol CoG di wajah depan */}
                        <circle cx={topX} cy={loadY + (boxH/2)} r="15" fill="#1e3a8a" />
                        <circle cx={topX} cy={loadY + (boxH/2)} r="10" fill="#f8fafc" />
                        <path d={`M ${topX-5} ${loadY+(boxH/2)} L ${topX+5} ${loadY+(boxH/2)} M ${topX} ${loadY+(boxH/2)-5} L ${topX} ${loadY+(boxH/2)+5}`} stroke="#000" strokeWidth="2" />
                        
                        <text x={topX} y={loadY + (boxH/2) + 35} fill="#f8fafc" fontSize="14" fontWeight="black" textAnchor="middle">{loadWeight.toLocaleString()} KG</text>
                        
                        {/* Tali Sling Depan */}
                        <line x1={topX} y1={renderTopY} x2={topX - (boxW/2) + 10} y2={loadY} stroke={isCraneOverload ? "#ef4444" : "#eab308"} strokeWidth="4" />
                        <line x1={topX} y1={renderTopY} x2={topX + (boxW/2) - 10} y2={loadY} stroke={isCraneOverload ? "#ef4444" : "#eab308"} strokeWidth="4" />
                        <circle cx={topX} cy={renderTopY} r="8" fill="#cbd5e1" />

                        {/* Anotasi Sudut */}
                        <line x1={topX - (boxW/2) - 20} y1={loadY} x2={topX + (boxW/2) + 20} y2={loadY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                        <text x={topX + 80} y={loadY - 15} fill="#cbd5e1" fontSize="12" fontWeight="bold">∠ {slingAngleDeg}°</text>
                      </g>
                    )
                  })()}
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 print:grid-cols-4">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Rigging Config</span>
                  <span className="text-xs font-black text-white font-mono uppercase print:text-slate-900">{slingType}<br/>{shackleType}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Effective SWL ({hitchType})</span>
                  <span className="text-xl font-black text-emerald-400 font-mono print:text-slate-900">{effectiveSlingSwl.toLocaleString()} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Tension per Kaki</span>
                  <span className={`text-xl font-black font-mono ${isCraneOverload ? 'text-red-500' : 'text-amber-400'} print:text-slate-900`}>{tensionPerSling.toFixed(1)} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Status Alat &amp; Operator</span>
                  <span className={`text-xs font-black font-mono uppercase ${(isSioCraneValid && isSiloCraneValid) ? 'text-emerald-400' : 'text-red-500'} print:text-slate-900`}>
                    {(isSioCraneValid && isSiloCraneValid) ? 'VALID / APPROVED' : 'UNAUTHORIZED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: FORKLIFT EXTENSION                 */}
      {/* ========================================= */}
      {activeTab === 'forklift' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          <div className="lg:col-span-4 space-y-5 print:hidden">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">1. Spesifikasi Unit Forklift</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Capacity (kg)</label>
                    <input type="number" step="500" min="0" value={fkCapacity} onChange={(e) => setFkCapacity(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Std Load Center (mm)</label>
                    <select value={fkStdLoadCenter} onChange={(e) => setFkStdLoadCenter(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option value={500}>500 mm</option>
                      <option value={600}>600 mm</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Garpu Asli (mm)</label>
                    <select value={baseForkLength} onChange={(e) => setBaseForkLength(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option value={1070}>1070 mm</option>
                      <option value={1220}>1220 mm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Garpu Extension (mm)</label>
                    <select value={forkExtension} onChange={(e) => setForkExtension(parseInt(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                      <option value={0}>Tidak Pakai</option>
                      <option value={1500}>1500 mm</option>
                      <option value={1800}>1800 mm</option>
                      <option value={2000}>2000 mm</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">2. Dimensi Muatan (Pallet Ekstra)</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Berat Aktual (kg)</label>
                    <input type="number" step="100" min="0" value={fkLoadWeight} onChange={(e) => setFkLoadWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Panjang Barang (mm)</label>
                    <input type="number" step="100" min="100" value={loadLength} onChange={(e) => setLoadLength(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">3. Kepatuhan &amp; Legalitas</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                    <span>Masa Berlaku SILO Forklift</span>
                    {!isSiloFkValid && <span className="text-red-500 uppercase">Invalid/Expired</span>}
                  </label>
                  <input type="date" value={siloForklift} onChange={(e) => setSiloForklift(e.target.value)} className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs font-bold focus:outline-none transition ${!isSiloFkValid && siloForklift ? 'border-red-400 text-red-700' : 'border-slate-200 text-slate-900'}`} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                    <span>Masa Berlaku SIO Operator Forklift</span>
                    {!isSioFkValid && <span className="text-red-500 uppercase">Invalid/Expired</span>}
                  </label>
                  <input type="date" value={sioForklift} onChange={(e) => setSioForklift(e.target.value)} className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs font-bold focus:outline-none transition ${!isSioFkValid && sioForklift ? 'border-red-400 text-red-700' : 'border-slate-200 text-slate-900'}`} />
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8 space-y-6 print:col-span-12">
            {!isFkSafe && (
               <div className="bg-red-50 border border-red-200 rounded-xl p-4 print:border-red-500 print:bg-white">
                 <h3 className="text-sm font-black text-red-700 uppercase flex items-center gap-2 mb-2">⚠️ PENGANGKATAN DITOLAK</h3>
                 <ul className="text-xs font-bold text-red-600 pl-6 list-disc">
                   {!isSioFkValid && <li><strong>LEGAL FAIL:</strong> SIO Operator Forklift kadaluarsa/belum diisi.</li>}
                   {!isSiloFkValid && <li><strong>LEGAL FAIL:</strong> SILO Unit Forklift kadaluarsa/belum diisi.</li>}
                   {isFkOverload && <li><strong>OVERLOAD:</strong> Berat aktual ({fkLoadWeight} kg) melampaui Torsi (De-rating Capacity {newSafeCapacity.toFixed(0)} kg).</li>}
                   {isFkTipping && <li><strong>TIPPING HAZARD:</strong> Titik berat sangat jauh, alat akan njomplang/terguling.</li>}
                   {isLoadUnsupported && <li><strong>UNSUPPORTED LOAD:</strong> Barang terlalu panjang, lebih dari 50% muatan menggantung di luar garpu/extension.</li>}
                 </ul>
               </div>
            )}

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 print:bg-white print:border-slate-300 print:text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono print:border print:border-slate-400">ISOMETRIC 3D</span>
                  <span className="text-xs font-bold text-slate-400 uppercase print:text-slate-600">FORKLIFT COG DYNAMICS</span>
                </div>
                <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase border ${isFkSafe ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-300' : 'bg-red-900/30 text-red-400 border-red-500/30 print:bg-red-50 print:text-red-700 print:border-red-300'}`}>
                  {isFkSafe ? '✓ GO / AMAN' : '⛔ NO GO'}
                </span>
              </div>

              {/* RENDER KANVAS 3D FORKLIFT */}
              <div className="relative aspect-video w-full bg-[#0b1121] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden py-4 print:bg-white print:border-slate-300" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0b1121 100%)' }}>
                <svg viewBox="0 0 700 400" className="w-full h-full" role="img" aria-label="Visualisasi 3D Skema Forklift">
                  
                  <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <line key={`fk-${i}`} x1="0" y1={360 + (i * -15)} x2="700" y2={360 + (i * -15)} />
                    ))}
                  </g>

                  {/* Body Forklift Simplifikasi */}
                  <rect x="50" y="180" width="180" height="130" fill="#94a3b8" rx="10" />
                  <rect x="130" y="110" width="100" height="70" fill="#64748b" rx="8" />
                  <rect x="230" y="100" width="15" height="210" fill="#475569" /> 
                  <circle cx="90" cy="310" r="30" fill="#1e293b" /> 
                  <circle cx="200" cy="310" r="35" fill="#1e293b" /> 
                  
                  {(() => {
                    const startX = 255;
                    // Skala visual panjang garpu
                    const visFkLen = (baseForkLength / 1000) * 80; 
                    const visExtLen = forkExtension > 0 ? (forkExtension / 1000) * 80 : 0;
                    
                    // Skala Beban
                    const visLoadLen = (loadLength / 1000) * 80;
                    const visLimit = Math.min(visLoadLen, 400); 
                    
                    const boxY = 190;
                    const boxH = 110;
                    const actualCoGx = startX + (visLimit / 2);
                    const isError = isFkOverload || isFkTipping || isLoadUnsupported;

                    return (
                      <g>
                        {/* Garpu Bawaan */}
                        <path d={`M 245 300 L ${startX + visFkLen} 300 L ${startX + visFkLen} 290 L 255 290 L 255 100 L 245 100 Z`} fill="#64748b" />
                        
                        {/* Extension (Jika Dipakai, Gambar Selubung Kuning) */}
                        {forkExtension > 0 && (
                          <polygon points={`255,290 ${startX + visExtLen},290 ${startX + visExtLen + 10},298 ${startX + visExtLen},302 245,302`} fill="#eab308" opacity="0.9" />
                        )}

                        {/* Kotak Beban (3D Render) */}
                        <Box3D x={startX} y={boxY} w={visLimit} h={boxH} depth={35} frontColor={isError ? "#ef4444" : "#f97316"} topColor={isError ? "#f87171" : "#fdba74"} sideColor={isError ? "#b91c1c" : "#c2410c"} />
                        
                        {/* Target CoG */}
                        <circle cx={actualCoGx} cy={boxY + (boxH/2)} r="15" fill="#fff" />
                        <circle cx={actualCoGx} cy={boxY + (boxH/2)} r="10" fill="#000" />
                        <path d={`M ${actualCoGx-5} ${boxY+(boxH/2)} L ${actualCoGx+5} ${boxY+(boxH/2)} M ${actualCoGx} ${boxY+(boxH/2)-5} L ${actualCoGx} ${boxY+(boxH/2)+5}`} stroke="#fff" strokeWidth="2" />
                        <text x={actualCoGx} y={boxY + (boxH/2) + 35} fill="#fff" fontSize="14" fontWeight="black" textAnchor="middle">{fkLoadWeight.toLocaleString()} KG</text>

                        {/* Anotasi Dimensi Load Center */}
                        <line x1={startX} y1={330} x2={actualCoGx} y2={330} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                        <polygon points={`${actualCoGx},330 ${actualCoGx-8},325 ${actualCoGx-8},335`} fill="#cbd5e1" />
                        <text x={startX + ((actualCoGx - startX) / 2)} y={350} fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">CoG (D): {actualLoadCenter.toFixed(0)} mm</text>
                      </g>
                    )
                  })()}
                  
                  <line x1="20" y1="345" x2="680" y2="345" stroke="#334155" strokeWidth="3" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 print:grid-cols-4">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Fork Ext Config</span>
                  <span className="text-xs font-black text-white font-mono uppercase print:text-slate-900">{forkExtension > 0 ? `${forkExtension} mm Ext` : 'Original Fork'}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">De-rating Capacity (Torsi)</span>
                  <span className={`text-xl font-black font-mono ${isFkOverload ? 'text-red-500' : 'text-emerald-400'} print:text-slate-900`}>{newSafeCapacity.toFixed(0)} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Berat Barang Aktual</span>
                  <span className="text-xl font-black text-white font-mono print:text-slate-900">{fkLoadWeight.toLocaleString()} <span className="text-xs">kg</span></span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold mb-0.5 print:text-slate-500">Legalitas SIO/SILO</span>
                  <span className={`text-xs font-black font-mono uppercase ${(isSioFkValid && isSiloFkValid) ? 'text-emerald-400' : 'text-red-500'} print:text-slate-900`}>
                    {(isSioFkValid && isSiloFkValid) ? 'VALID / APPROVED' : 'UNAUTHORIZED'}
                  </span>
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
          <p className="text-xs mt-2">Nama &amp; Tanda Tangan</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-600 mb-12">Diperiksa Oleh (HSE/Safety):</p>
          <div className="w-40 mx-auto border-b border-slate-400"></div>
          <p className="text-xs mt-2">Nama &amp; Tanda Tangan</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-600 mb-12">Disetujui Oleh (Site Manager):</p>
          <div className="w-40 mx-auto border-b border-slate-400"></div>
          <p className="text-xs mt-2">Nama &amp; Tanda Tangan</p>
        </div>
      </div>

      {/* Action Tombol Cetak */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden mt-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Validasi &amp; Cetak Permit</h3>
          <p className="text-xs text-slate-600 mt-0.5">Pastikan semua indikator berwarna hijau sebelum mencetak Permit to Work (PTW).</p>
        </div>
        <button
          onClick={() => window.print()}
          disabled={(activeTab === 'crane' && !isCraneSafe) || (activeTab === 'forklift' && !isFkSafe)}
          className={`px-5 py-2.5 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${((activeTab === 'crane' && isCraneSafe) || (activeTab === 'forklift' && isFkSafe)) ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
        >
          {((activeTab === 'crane' && isCraneSafe) || (activeTab === 'forklift' && isFkSafe)) ? '🖨️ Cetak Permit PTW' : '⛔ Selesaikan Error / Legalitas'}
        </button>
      </div>

    </div>
  )
}
