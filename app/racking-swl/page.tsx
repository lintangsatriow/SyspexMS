"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function RackingSWLPage() {
  const [beamLength, setBeamLength] = useState<number>(2700) // Standard 2.7m
  const [palletsPerLevel, setPalletsPerLevel] = useState<number>(2)
  const [weightPerPallet, setWeightPerPallet] = useState<number>(1000)
  const [numberOfLevels, setNumberOfLevels] = useState<number>(4) // Exclude ground
  const [measuredDeflection, setMeasuredDeflection] = useState<number>(0)

  // Kalkulasi
  const totalLoadPerLevel = palletsPerLevel * weightPerPallet
  const maxBayLoad = totalLoadPerLevel * numberOfLevels
  const maxAllowableDeflection = beamLength / 200 // Batas L/200
  const isDeflectionSafe = measuredDeflection <= maxAllowableDeflection

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Engineering Tool</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Racking SWL Calculator</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Validasi kapasitas beban rak dan cetak Load Notice Plate standar K3.</p>
          </div>
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK PLAT BEBAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Input - Sembunyikan saat cetak */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Parameter Racking</h2>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Panjang Beam (mm)</label>
              <input type="number" value={beamLength} onChange={(e) => setBeamLength(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Palet / Level</label>
                <input type="number" value={palletsPerLevel} onChange={(e) => setPalletsPerLevel(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Berat / Palet (kg)</label>
                <input type="number" value={weightPerPallet} onChange={(e) => setWeightPerPallet(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah Level (Susunan Atas)</label>
              <input type="number" value={numberOfLevels} onChange={(e) => setNumberOfLevels(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cek Aktual Lendutan (mm)</label>
              <input type="number" value={measuredDeflection} onChange={(e) => setMeasuredDeflection(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500" placeholder="Hasil ukur fisik..." />
              
              <div className={`mt-3 p-3 rounded-lg border flex items-start gap-2 ${isDeflectionSafe ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`text-lg font-black leading-none ${isDeflectionSafe ? 'text-emerald-600' : 'text-red-600'}`}>{isDeflectionSafe ? '✓' : '⚠️'}</span>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDeflectionSafe ? 'text-emerald-800' : 'text-red-800'}`}>
                    Batas Lendutan L/200: {maxAllowableDeflection.toFixed(1)} mm
                  </p>
                  <p className={`text-xs mt-0.5 ${isDeflectionSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isDeflectionSafe ? 'Struktur aman dari deformasi.' : 'OVERLOAD! Lendutan melebihi batas aman struktural.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area - Load Notice Plate (Ini yang akan di-print) */}
        <div className="lg:col-span-8 print:col-span-12">
          <div className="bg-white border-4 border-yellow-400 p-8 shadow-lg w-full max-w-2xl mx-auto print:border-4 print:border-black print:shadow-none print:w-full print:max-w-full">
            
            {/* Header Plate */}
            <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Load Notice</h2>
                <p className="text-sm font-bold text-black uppercase tracking-widest mt-1">Safe Working Load Specifications</p>
              </div>
              <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center">
                <span className="text-3xl font-black text-black">!</span>
              </div>
            </div>

            {/* Visual Warning & Instructions */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border-2 border-black p-3 text-center">
                <p className="text-[10px] font-black uppercase">Do Not Alter Structure</p>
              </div>
              <div className="border-2 border-black p-3 text-center bg-yellow-400 print:bg-gray-200">
                <p className="text-[10px] font-black uppercase">Report Any Damage</p>
              </div>
              <div className="border-2 border-black p-3 text-center">
                <p className="text-[10px] font-black uppercase">Do Not Climb Racking</p>
              </div>
            </div>

            {/* Load Specifications */}
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b-2 border-black pb-2">
                <span className="text-sm font-bold uppercase tracking-wider">Max Load per Pallet</span>
                <span className="text-3xl font-black">{weightPerPallet.toLocaleString()} <span className="text-lg">KG</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b-2 border-black pb-2">
                <div>
                  <span className="block text-sm font-bold uppercase tracking-wider">Max Load per Level (UDL)</span>
                  <span className="text-[10px] font-bold">Uniformly Distributed Load • {palletsPerLevel} Pallets</span>
                </div>
                <span className="text-4xl font-black text-black">{totalLoadPerLevel.toLocaleString()} <span className="text-xl">KG</span></span>
              </div>

              <div className="flex justify-between items-end border-b-4 border-black pb-2 bg-yellow-100 print:bg-gray-100 p-2">
                <div>
                  <span className="block text-sm font-bold uppercase tracking-wider">Total Max Bay Load</span>
                  <span className="text-[10px] font-bold text-red-600 print:text-black">DO NOT EXCEED THIS LIMIT</span>
                </div>
                <span className="text-5xl font-black text-red-600 print:text-black">{maxBayLoad.toLocaleString()} <span className="text-2xl">KG</span></span>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center text-[10px] font-bold uppercase">
              <p>Beam Length: {beamLength} mm</p>
              <p>Clearance: L/200</p>
              <p>Insp. Date: {new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <p className="text-center text-[9px] mt-4 font-bold uppercase">Property of Syspex HSE Management System</p>
          </div>
        </div>

      </div>
    </div>
  )
}
