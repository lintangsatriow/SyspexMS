"use client"

import { useState, useId } from 'react'

export default function LiftingPlanPage() {
  const formId = useId()

  // 1. Data Beban (Load Parameters)
  const [netLoad, setNetLoad] = useState<number>(18.5)
  const [contingencyFactor, setContingencyFactor] = useState<number>(1.1)
  const [riggingWeight, setRiggingWeight] = useState<number>(1.2)

  // 2. Geometri CoG & Sling
  const [spanL, setSpanL] = useState<number>(6.0)
  const [distAtoCoG, setDistAtoCoG] = useState<number>(2.4)
  const [slingAngle, setSlingAngle] = useState<number>(60)

  // 3. Kapasitas Crane
  const [craneCapacity, setCraneCapacity] = useState<number>(35.0)

  // 4. Data Lapangan & Form Ringkas
  const [unitTag, setUnitTag] = useState<string>('EX-330 / Excavator Arm')
  const [craneOperator, setCraneOperator] = useState<string>('Suryanto')
  const [riggerName, setRiggerName] = useState<string>('Ahmad Fauzi')
  const [workingRadius, setWorkingRadius] = useState<number>(12.0)
  const [boomLength, setBoomLength] = useState<number>(24.5)

  // 5. Checklist Keselamatan
  const [checks, setChecks] = useState({
    barricade: true,
    outriggerPads: true,
    windSpeed: true,
    taglineReady: true,
  })

  // Perhitungan Matematis
  const validSpan = spanL > 0 ? spanL : 0.1
  const clampedD1 = Math.min(Math.max(distAtoCoG, 0), validSpan)
  
  // Total Gross Load = (Net Load * Faktor) + Rigging
  const totalGrossLoad = (netLoad * contingencyFactor) + riggingWeight

  // Beban Statis per Titik Angkat (Ton)
  const loadA = totalGrossLoad * ((validSpan - clampedD1) / validSpan)
  const loadB = totalGrossLoad * (clampedD1 / validSpan)

  // Tegangan / Tension Sling Aktual (Ton) = Beban Titik / sin(sudut dalam radian)
  const angleRad = (slingAngle * Math.PI) / 180
  const sinAngle = Math.sin(angleRad) > 0 ? Math.sin(angleRad) : 0.01
  const tensionA = loadA / sinAngle
  const tensionB = loadB / sinAngle

  // Utilisasi Kapasitas Crane
  const validCapacity = craneCapacity > 0 ? craneCapacity : 0.1
  const utilization = (totalGrossLoad / validCapacity) * 100

  // Status Kategori Pengangkatan
  let statusBadge = {
    label: 'PENGANGKATAN STANDAR (SAFE LIFT)',
    color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    description: 'Kapasitas aman di bawah batas risiko kritis. Pengangkatan dapat dilanjutkan sesuai SOP rutin.'
  }

  if (utilization >= 75 && utilization <= 85) {
    statusBadge = {
      label: 'PENGANGKATAN TERKONTROL (MODERATE RISK)',
      color: 'bg-amber-500/15 border-amber-500/30 text-amber-900',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-800',
      description: 'Mendekati zona kritis. Memerlukan pengawasan langsung dari Pengawas Lifting / Safety Officer.'
    }
  } else if (utilization > 85) {
    statusBadge = {
      label: 'CRITICAL LIFT WARNING (> 85%)',
      color: 'bg-rose-500/15 border-rose-500/30 text-rose-950',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-700',
      description: 'Beban di atas batas aman operasional standar! Wajib persetujuan khusus Rigging Engineer & JSA ditinjau ulang.'
    }
  }

  // Posisi Visual CoG (%)
  const cogPositionPercent = (clampedD1 / validSpan) * 100

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Halaman */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
          Kalkulasi Lapangan Rigging &amp; Crane
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Lifting Plan &amp; Center of Gravity (CoG) Desk
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
          Alat hitung cepat distribusi beban 2 titik angkat, tegangan sling aktual, dan verifikasi kapasitas batas aman crane saat aktivitas bongkar muat alat berat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Form Parameter Beban & Geometri */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: Input Beban */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center justify-between border-b border-zinc-100 pb-2">
              <span>1. Data Parameter Beban</span>
              <span className="text-[10px] text-zinc-400 font-mono">Gross Load Formula</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={`${formId}-netLoad`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Berat Bersih Beban / Net Load (Ton)
                </label>
                <input
                  id={`${formId}-netLoad`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={netLoad}
                  onChange={(e) => setNetLoad(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-contingency`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Faktor Dinamis (Safety)
                  </label>
                  <select
                    id={`${formId}-contingency`}
                    value={contingencyFactor}
                    onChange={(e) => setContingencyFactor(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value={1.0}>1.00 (Tanpa Tambahan)</option>
                    <option value={1.05}>1.05 (+5% Dinamis)</option>
                    <option value={1.1}>1.10 (+10% Standar)</option>
                    <option value={1.2}>1.20 (+20% Angin/Rigid)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`${formId}-rigging`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Rigging + Hook (Ton)
                  </label>
                  <input
                    id={`${formId}-rigging`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={riggingWeight}
                    onChange={(e) => setRiggingWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Total Output Beban Kotor */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Total Gross Load</span>
                  <span className="text-[10px] text-amber-800/80">(Net &times; Factor) + Rigging</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-950 font-mono">{totalGrossLoad.toFixed(2)}</span>
                  <span className="text-xs font-bold text-amber-900 ml-1">Ton</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Geometri CoG & Sling */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center justify-between border-b border-zinc-100 pb-2">
              <span>2. Geometri Titik Angkat &amp; CoG</span>
              <span className="text-[10px] text-zinc-400 font-mono">2-Point Rigging</span>
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-span`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Jarak Titik L (meter)
                  </label>
                  <input
                    id={`${formId}-span`}
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={spanL}
                    onChange={(e) => setSpanL(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor={`${formId}-distA`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                    Jarak A ke CoG / d1 (m)
                  </label>
                  <input
                    id={`${formId}-distA`}
                    type="number"
                    step="0.1"
                    min="0"
                    max={spanL}
                    value={distAtoCoG}
                    onChange={(e) => setDistAtoCoG(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-angle`} className="block text-[11px] font-semibold text-zinc-600 mb-1 flex items-center justify-between">
                  <span>Sudut Sling Horizontal: {slingAngle}&deg;</span>
                  <span className="text-[10px] text-zinc-400">Rekomendasi &ge; 60&deg;</span>
                </label>
                <input
                  id={`${formId}-angle`}
                  type="range"
                  min="30"
                  max="90"
                  value={slingAngle}
                  onChange={(e) => setSlingAngle(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card: Kapasitas Crane */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center justify-between border-b border-zinc-100 pb-2">
              <span>3. Data Tabel Crane (Load Chart)</span>
              <span className="text-[10px] text-zinc-400 font-mono">Rated Capacity</span>
            </h2>

            <div>
              <label htmlFor={`${formId}-craneCap`} className="block text-[11px] font-semibold text-zinc-600 mb-1">
                Kapasitas Izin Crane di Radius Rencana (Ton)
              </label>
              <input
                id={`${formId}-craneCap`}
                type="number"
                step="0.5"
                min="0.5"
                value={craneCapacity}
                onChange={(e) => setCraneCapacity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-amber-500 transition"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Sesuaikan nilai ini persis dengan tabel kapasitas angkat di manual kabin crane operator.
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Hasil Kalkulasi, Diagram CoG & Ringkasan Dokumen */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card: Diagram Visual Center of Gravity (CoG) */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                Visualisasi Distribusi Beban &amp; Posisi CoG
              </span>
              <span className="text-xs font-mono font-semibold text-zinc-500">
                Bentang Span: {validSpan.toFixed(1)} m
              </span>
            </div>

            {/* Skema Balok Beban */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-4">
              <div className="relative pt-6 pb-4">
                {/* Garis Beban */}
                <div className="h-3 w-full bg-zinc-300 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-amber-500/70"
                    style={{ width: `${cogPositionPercent}%` }}
                  />
                </div>

                {/* Titik A */}
                <div className="absolute left-0 top-0 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-zinc-900 text-[9px] font-bold text-white flex items-center justify-center">
                    A
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5">0.0m</span>
                </div>

                {/* Titik CoG */}
                <div 
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-200"
                  style={{ left: `${cogPositionPercent}%` }}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-zinc-950 font-bold">
                    &bull;
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shadow-xs mt-1">
                    CoG ({clampedD1.toFixed(1)}m)
                  </span>
                </div>

                {/* Titik B */}
                <div className="absolute right-0 top-0 translate-x-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-zinc-900 text-[9px] font-bold text-white flex items-center justify-center">
                    B
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5">{validSpan.toFixed(1)}m</span>
                </div>
              </div>
            </div>

            {/* Grid Beban & Tension Sling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">Sling Leg A</span>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                    d1 = {clampedD1.toFixed(1)} m
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-zinc-500 flex justify-between">
                    <span>Beban Vertikal Statis:</span>
                    <strong className="font-mono text-zinc-900">{loadA.toFixed(2)} Ton</strong>
                  </div>
                  <div className="text-[11px] text-zinc-800 flex justify-between border-t border-zinc-100 pt-1">
                    <span className="font-semibold text-amber-900">Tegangan Sling Aktual:</span>
                    <strong className="font-mono text-sm font-extrabold text-amber-600">{tensionA.toFixed(2)} Ton</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">Sling Leg B</span>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                    d2 = {(validSpan - clampedD1).toFixed(1)} m
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-zinc-500 flex justify-between">
                    <span>Beban Vertikal Statis:</span>
                    <strong className="font-mono text-zinc-900">{loadB.toFixed(2)} Ton</strong>
                  </div>
                  <div className="text-[11px] text-zinc-800 flex justify-between border-t border-zinc-100 pt-1">
                    <span className="font-semibold text-amber-900">Tegangan Sling Aktual:</span>
                    <strong className="font-mono text-sm font-extrabold text-amber-600">{tensionB.toFixed(2)} Ton</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Evaluasi Crane & Utilisasi Kritis */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Verifikasi Utilisasi Crane
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-zinc-500">Gross Load vs Kapasitas Terpasang:</span>
                <span className="text-2xl font-black font-mono text-zinc-900">
                  {utilization.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar Utilisasi */}
              <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${statusBadge.barColor}`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
              {statusBadge.description}
            </p>
          </div>

          {/* Card: Lembar Ringkasan Lapangan & Checklist */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-zinc-100 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                  Kartu Izin Verifikasi Pengangkatan
                </h3>
                <span className="text-[10px] text-zinc-400">Ringkasan Validasi Sebelum Mengangkat</span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
              >
                Cetak / Simpan PDF
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label htmlFor={`${formId}-unitTag`} className="block text-[10px] text-zinc-400 font-semibold uppercase">Unit / Beban</label>
                <input
                  id={`${formId}-unitTag`}
                  type="text"
                  value={unitTag}
                  onChange={(e) => setUnitTag(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-operator`} className="block text-[10px] text-zinc-400 font-semibold uppercase">Operator Crane</label>
                <input
                  id={`${formId}-operator`}
                  type="text"
                  value={craneOperator}
                  onChange={(e) => setCraneOperator(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-rigger`} className="block text-[10px] text-zinc-400 font-semibold uppercase">Rigger in Charge</label>
                <input
                  id={`${formId}-rigger`}
                  type="text"
                  value={riggerName}
                  onChange={(e) => setRiggerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-radius`} className="block text-[10px] text-zinc-400 font-semibold uppercase">Radius Kerja</label>
                <input
                  id={`${formId}-radius`}
                  type="number"
                  step="0.5"
                  value={workingRadius}
                  onChange={(e) => setWorkingRadius(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 mt-1 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-boom`} className="block text-[10px] text-zinc-400 font-semibold uppercase">Panjang Boom (m)</label>
                <input
                  id={`${formId}-boom`}
                  type="number"
                  step="0.5"
                  value={boomLength}
                  onChange={(e) => setBoomLength(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 mt-1 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <span className="block text-[10px] text-zinc-400 font-semibold uppercase">WLL Sling Min.</span>
                <div className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-amber-400 font-mono font-bold mt-1">
                  &gt; {Math.max(tensionA, tensionB).toFixed(2)} Ton
                </div>
              </div>
            </div>

            {/* Checklist Pre-Lift */}
            <div className="space-y-2 border-t border-zinc-800 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Pemeriksaan Fisik Kritis Pra-Pengangkatan:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={checks.barricade}
                    onChange={(e) => setChecks({...checks, barricade: e.target.checked})}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>Area radius putar (swing) dibarikade</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={checks.outriggerPads}
                    onChange={(e) => setChecks({...checks, outriggerPads: e.target.checked})}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>Outrigger jack terpasang bantalan alas (pads)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={checks.windSpeed}
                    onChange={(e) => setChecks({...checks, windSpeed: e.target.checked})}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>Kecepatan angin aman (&lt; 20 knots)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={checks.taglineReady}
                    onChange={(e) => setChecks({...checks, taglineReady: e.target.checked})}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>Tali pemandu (tagline) terpasang di 2 sisi</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
