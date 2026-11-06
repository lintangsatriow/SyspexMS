"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function LiftingPlanPage() {
  // Pilihan Jenis Pesawat Angkat dan Angkut (PAA)
  const [equipmentType, setEquipmentType] = useState<'Crane' | 'Forklift'>('Forklift')

  // ==========================================
  // STATE & LOGIC: CRANE (SLING & RIGGING)
  // ==========================================
  const [netLoad, setNetLoad] = useState<number>(5.0)
  const [contingencyFactor, setContingencyFactor] = useState<number>(1.1)
  const [riggingWeight, setRiggingWeight] = useState<number>(0.5)
  const [spanL, setSpanL] = useState<number>(6.0)
  const [distAtoCoG, setDistAtoCoG] = useState<number>(2.4)
  const [slingAngle, setSlingAngle] = useState<number>(60)
  const [craneCapacity, setCraneCapacity] = useState<number>(15.0)

  const validSpan = spanL > 0 ? spanL : 0.1
  const clampedD1 = Math.min(Math.max(distAtoCoG, 0), validSpan)
  const totalGrossLoad = (netLoad * contingencyFactor) + riggingWeight
  const loadA = totalGrossLoad * ((validSpan - clampedD1) / validSpan)
  const loadB = totalGrossLoad * (clampedD1 / validSpan)
  const angleRad = (slingAngle * Math.PI) / 180
  const sinAngle = Math.sin(angleRad) > 0 ? Math.sin(angleRad) : 0.01
  const tensionA = loadA / sinAngle
  const tensionB = loadB / sinAngle
  const craneUtilization = (totalGrossLoad / (craneCapacity || 1)) * 100

  // ==========================================
  // STATE & LOGIC: FORKLIFT (LOAD CENTER DERATING)
  // ==========================================
  const [flLoadWeight, setFlLoadWeight] = useState<number>(2.5) // Ton (Berat beban)
  const [flRatedCapacity, setFlRatedCapacity] = useState<number>(3.0) // Ton (Kapasitas Forklift di Nameplate)
  const [flRatedLoadCenter, setFlRatedLoadCenter] = useState<number>(500) // mm (Standar Load Center Forklift)
  const [flActualLoadCenter, setFlActualLoadCenter] = useState<number>(600) // mm (Jarak titik berat aktual)

  // Rumus Praktis Derating Forklift K3: Jika aktual load center melebihi standar pabrik, kapasitas aman menurun.
  const isLoadCenterExtended = flActualLoadCenter > flRatedLoadCenter
  const effectiveSafeCapacity = isLoadCenterExtended 
    ? flRatedCapacity * (flRatedLoadCenter / flActualLoadCenter)
    : flRatedCapacity

  const flUtilization = (flLoadWeight / (effectiveSafeCapacity || 1)) * 100
  const isFlSafe = flUtilization <= 100

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Engineering &amp; Operasional</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          Lifting Plan &bull; Pesawat Angkat &amp; Angkut (PAA)
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Perencanaan Pengangkatan Kritis (Lifting Plan)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Kalkulator K3 untuk memverifikasi batas aman pengangkatan material fabrikasi. Pilih alat angkat (Forklift atau Crane) untuk melihat parameter yang relevan.
        </p>
      </div>

      {/* Tabs / Pemilih Alat Angkat */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setEquipmentType('Forklift')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            equipmentType === 'Forklift' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>🚛</span>
          <span>Forklift (Load Center)</span>
        </button>
        <button
          onClick={() => setEquipmentType('Crane')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            equipmentType === 'Crane' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>🏗️</span>
          <span>Crane (Sling &amp; CoG)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: INPUT DATA */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
              <span>{equipmentType === 'Forklift' ? 'Parameter Beban Forklift' : 'Parameter Beban Crane'}</span>
            </h2>

            {/* INPUT FORKLIFT */}
            {equipmentType === 'Forklift' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berat Beban Aktual (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={flLoadWeight}
                    onChange={(e) => setFlLoadWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Berat total bundel racking atau material yang diangkat.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kapasitas Forklift (Ton)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={flRatedCapacity}
                      onChange={(e) => setFlRatedCapacity(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Standar Load Center (mm)</label>
                    <input
                      type="number"
                      step="100"
                      min="500"
                      value={flRatedLoadCenter}
                      onChange={(e) => setFlRatedLoadCenter(parseFloat(e.target.value) || 500)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jarak Titik Berat Beban Aktual (mm)</label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    value={flActualLoadCenter}
                    onChange={(e) => setFlActualLoadCenter(parseFloat(e.target.value) || 500)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Diukur dari pangkal garpu (backrest) ke titik tengah dimensi beban terpanjang.</span>
                </div>
              </div>
            )}

            {/* INPUT CRANE */}
            {equipmentType === 'Crane' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Net Load (Ton)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={netLoad}
                      onChange={(e) => setNetLoad(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rigging Weight (Ton)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={riggingWeight}
                      onChange={(e) => setRiggingWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Span L (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={spanL}
                      onChange={(e) => setSpanL(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">A ke CoG (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={distAtoCoG}
                      onChange={(e) => setDistAtoCoG(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sling Ang (&deg;)</label>
                    <input
                      type="number"
                      min="30"
                      max="90"
                      value={slingAngle}
                      onChange={(e) => setSlingAngle(parseInt(e.target.value) || 60)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kapasitas Crane di Radius Kerja (Ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={craneCapacity}
                    onChange={(e) => setCraneCapacity(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT & VERIFIKASI K3 */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Verifikasi Standar Operasional K3
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                (equipmentType === 'Forklift' ? isFlSafe : craneUtilization <= 100)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {(equipmentType === 'Forklift' ? isFlSafe : craneUtilization <= 100) ? '✓ SAFE TO LIFT' : '⚠️ UNSAFE (OVERLOAD)'}
              </span>
            </div>

            {/* OUTPUT FORKLIFT */}
            {equipmentType === 'Forklift' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kapasitas Aman (Derated)</span>
                    <div className="text-2xl font-black font-mono text-slate-900">{effectiveSafeCapacity.toFixed(2)} <span className="text-xs">Ton</span></div>
                    {isLoadCenterExtended && (
                      <span className="text-[10px] font-bold text-amber-600 block mt-1">
                        ⚠️ Derated by {((1 - (flRatedLoadCenter/flActualLoadCenter)) * 100).toFixed(1)}% (Load Center Jauh)
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Berat Beban Total</span>
                    <div className="text-2xl font-black font-mono text-slate-900">{flLoadWeight.toFixed(2)} <span className="text-xs">Ton</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Utilisasi Kapasitas Forklift:</span>
                    <span className={`text-xl font-black font-mono ${flUtilization > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                      {flUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${flUtilization > 100 ? 'bg-red-500' : flUtilization > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(flUtilization, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                    Mengangkat profil racking yang panjang akan memindahkan titik beban (*load center*) ke depan. Pastikan garpu masuk sepenuhnya, dan pertahankan posisi tiang (*mast*) miring ke belakang (*tilt back*) saat memindahkan material.
                  </p>
                </div>
              </div>
            )}

            {/* OUTPUT CRANE */}
            {equipmentType === 'Crane' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Tegangan Sling Leg A</span>
                    <span className="text-xl font-black font-mono text-amber-700">{tensionA.toFixed(2)} Ton</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-1">Tegangan Sling Leg B</span>
                    <span className="text-xl font-black font-mono text-amber-700">{tensionB.toFixed(2)} Ton</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Utilisasi Kapasitas Crane:</span>
                    <span className="text-lg font-black font-mono text-slate-900">{craneUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${craneUtilization > 85 ? 'bg-red-500' : craneUtilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(craneUtilization, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    Total Gross Load (Termasuk Rigging &amp; Safety Factor): <strong>{totalGrossLoad.toFixed(2)} Ton</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Tombol Cetak / JSA Attachment */}
          <div className="flex justify-end">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
            >
              <span>🖨️</span>
              <span>Cetak Hasil Verifikasi (Lampiran JSA / Permit)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
