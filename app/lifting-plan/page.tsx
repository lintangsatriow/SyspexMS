"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function LiftingPlanPage() {
  // Input Parameters
  const [loadWeight, setLoadWeight] = useState<number>(5000)
  const [riggingWeight, setRiggingWeight] = useState<number>(150)
  const [craneCapacity, setCraneCapacity] = useState<number>(10000)
  
  const [slingCount, setSlingCount] = useState<number>(4)
  // Aturan Rigging: Jika pakai 4 kaki (legs), beban aktual seringnya hanya ditahan oleh 2 atau 3 kaki secara seimbang.
  const [effectiveSlings, setEffectiveSlings] = useState<number>(2) 
  const [slingAngle, setSlingAngle] = useState<number>(60) // Sudut dari horizontal
  const [slingSWL, setSlingSWL] = useState<number>(4000) // Kapasitas 1 sling

  // Kalkulasi Fisika Rigging
  const totalGrossWeight = loadWeight + riggingWeight
  
  // Menghitung Tegangan Sling (Sling Tension) menggunakan Trigonometri
  // Rumus: Tension = (Total Berat / Jumlah Sling Efektif) / Sin(Sudut)
  const angleInRadians = slingAngle * (Math.PI / 180)
  const slingFactor = 1 / Math.sin(angleInRadians)
  const tensionPerSling = (totalGrossWeight / effectiveSlings) * slingFactor

  const craneUtilization = (totalGrossWeight / craneCapacity) * 100

  // Validasi K3
  const isSlingSafe = tensionPerSling <= slingSWL
  const isCraneSafe = craneUtilization <= 80
  const isCriticalLift = craneUtilization > 80 && craneUtilization <= 100
  const isOverload = craneUtilization > 100

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Engineering Tool</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Lifting Plan & Rigging Math</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Kalkulasi tegangan sling, utilisasi crane, & cetak form Permit to Work (PTW).</p>
          </div>
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK LIFTING PLAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Input - Sembunyikan saat cetak */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Parameter Beban & Crane</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Berat Beban (kg)</label>
                <input type="number" value={loadWeight} onChange={(e) => setLoadWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Berat Rigging (kg)</label>
                <input type="number" value={riggingWeight} onChange={(e) => setRiggingWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Kapasitas Crane (kg)</label>
              <input type="number" value={craneCapacity} onChange={(e) => setCraneCapacity(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Parameter Sling & Sudut</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah Kaki (Legs)</label>
                <select value={slingCount} onChange={(e) => setSlingCount(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500">
                  <option value="1">1 Kaki</option>
                  <option value="2">2 Kaki</option>
                  <option value="3">3 Kaki</option>
                  <option value="4">4 Kaki</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Efektif Menahan</label>
                <select value={effectiveSlings} onChange={(e) => setEffectiveSlings(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500">
                  <option value="1">1 Kaki</option>
                  <option value="2">2 Kaki</option>
                  <option value="3">3 Kaki</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sudut Horizontal</label>
                <select value={slingAngle} onChange={(e) => setSlingAngle(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500">
                  <option value="90">90° (Tegak lurus)</option>
                  <option value="60">60° (Standar aman)</option>
                  <option value="45">45° (Batas medium)</option>
                  <option value="30">30° (Bahaya - Ekstrem)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SWL per Sling (kg)</label>
                <input type="number" value={slingSWL} onChange={(e) => setSlingSWL(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed border-t border-slate-100 pt-2">
              Note: Jika sudut 30°, tegangan sling (Tension) akan sama dengan total berat beban. Makin kecil sudut, makin besar tegangan!
            </p>
          </div>
        </div>

        {/* Output Area - Lifting Permit Form (Dokumen Cetak) */}
        <div className="lg:col-span-8 print:col-span-12">
          <div className="bg-white border border-slate-300 p-8 shadow-sm w-full print:border-none print:shadow-none print:p-0">
            
            {/* Kop Surat */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lifting Plan & Permit</h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">HSE Management System - Syspex</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Doc Date: {new Date().toLocaleDateString('en-GB')}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Permit No: LFP-{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Box 1: Load Details */}
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">1. Load Configuration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-600">Load Weight (Nett)</span><span className="font-bold">{loadWeight.toLocaleString()} kg</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-600">Rigging Gear Weight</span><span className="font-bold">+{riggingWeight.toLocaleString()} kg</span></div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200"><span className="font-bold">Total Gross Weight</span><span className="font-black text-slate-900">{totalGrossWeight.toLocaleString()} kg</span></div>
                </div>
              </div>

              {/* Box 2: Rigging Tension Analysis */}
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">2. Sling Tension Math</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-600">Config / Load Bearing</span><span className="font-bold">{slingCount} Legs / {effectiveSlings} Effective</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-600">Sling Angle (Horizontal)</span><span className="font-bold">{slingAngle}°</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-600">Sling Factor (1/Sin α)</span><span className="font-bold">{slingFactor.toFixed(2)}</span></div>
                  
                  <div className={`flex justify-between items-center text-sm pt-2 border-t border-slate-200 ${isSlingSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                    <span className="font-bold">Calculated Tension / Sling</span>
                    <span className="font-black">{tensionPerSling.toLocaleString(undefined, {maximumFractionDigits: 0})} kg</span>
                  </div>
                  
                  <div className={`text-[10px] font-bold p-2 rounded flex gap-2 ${isSlingSafe ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                    {isSlingSafe ? '✓ AMAN: Tegangan di bawah SWL Sling ('+slingSWL+' kg)' : '⚠️ OVERLOAD: Tegangan Sling melebihi SWL. Ubah sudut atau ganti sling!'}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Crane Utilization */}
            <div className="mt-8">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">3. Crane Utilization Check</h3>
              <div className="bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Max Capacity vs Gross Weight</p>
                  <p className="text-sm font-bold text-slate-900">{craneCapacity.toLocaleString()} kg / {totalGrossWeight.toLocaleString()} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Utilization Rate</p>
                  <p className={`text-2xl font-black ${isOverload ? 'text-red-600' : isCriticalLift ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {craneUtilization.toFixed(1)}%
                  </p>
                </div>
              </div>
              {isCriticalLift && (
                <p className="text-[10px] font-bold text-amber-700 bg-amber-50 p-2 border border-amber-200 mt-2">
                  CRITICAL LIFT: Utilisasi di atas 80%. Wajib diawasi langsung oleh Lifting Supervisor.
                </p>
              )}
              {isOverload && (
                <p className="text-[10px] font-bold text-red-700 bg-red-50 p-2 border border-red-200 mt-2">
                  FATAL ERROR: Utilisasi melebih 100%. Pengangkatan DILARANG KERAS.
                </p>
              )}
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t-2 border-slate-900 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Rigger / Slinger</p>
                <div className="h-16 border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
                <p className="text-[9px] font-bold uppercase text-slate-400">Name & Date</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Crane Operator</p>
                <div className="h-16 border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
                <p className="text-[9px] font-bold uppercase text-slate-400">Name & Date</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Lifting Supervisor (HSE)</p>
                <div className="h-16 border-b border-slate-900 w-3/4 mx-auto mb-2"></div>
                <p className="text-[9px] font-bold uppercase text-slate-400">Approved By</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
