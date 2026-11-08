"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

export default function LotoPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  const [machineName, setMachineName] = useState<string>('Automatic Stretch Wrapper Line 2')
  const [technician, setTechnician] = useState<string>('Budi Prasetyo')
  const [lockNumber, setLockNumber] = useState<string>('LOCK-SYS-04')
  const [workScope, setWorkScope] = useState<string>('Penggantian rantai drive turn-table & bearing motor')

  // Status Isolasi Sumber Energi
  const [isoElectric, setIsoElectric] = useState<boolean>(true)
  const [isoPneumatic, setIsoPneumatic] = useState<boolean>(true)
  const [isoHydraulic, setIsoHydraulic] = useState<boolean>(false)
  const [zeroEnergyVerified, setZeroEnergyVerified] = useState<boolean>(true)

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const isLotoValid = zeroEnergyVerified && (isoElectric || isoPneumatic || isoHydraulic) && technician.trim() !== ''

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Lockout Tagout (LOTO)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Lockout / Tagout (LOTO) Permit &amp; Tag
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Penerbitan izin isolasi energi berbahaya pada mesin strapping, wrapper, dan konveyor sebelum perbaikan atau overhaul mekanikal.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!isLotoValid}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition shadow-sm self-start sm:self-auto cursor-pointer disabled:opacity-40"
          >
            🖨️ Cetak Kartu LOTO (Danger Tag)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* Kolom Kiri: Form Input Data Isolasi (Sembunyi saat cetak) */}
        <div className="lg:col-span-6 space-y-4 print:hidden">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              1. Detail Mesin &amp; Teknisi
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Mesin / Unit Diisolasi</label>
                <input 
                  type="text" 
                  value={machineName} 
                  onChange={(e) => setMachineName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Teknisi Pelaksana</label>
                  <input 
                    type="text" 
                    value={technician} 
                    onChange={(e) => setTechnician(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Gembok (Lock ID)</label>
                  <input 
                    type="text" 
                    value={lockNumber} 
                    onChange={(e) => setLockNumber(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ruang Lingkup Perbaikan</label>
                <textarea 
                  rows={2}
                  value={workScope} 
                  onChange={(e) => setWorkScope(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              2. Sumber Energi yang Diisolasi
            </h2>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                <span className="font-bold text-slate-800">⚡ Energi Listrik (Main Breaker / Disconnect Switch)</span>
                <input type="checkbox" checked={isoElectric} onChange={(e) => setIsoElectric(e.target.checked)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                <span className="font-bold text-slate-800">💨 Energi Angin / Pneumatik (Air Shut-off Valve)</span>
                <input type="checkbox" checked={isoPneumatic} onChange={(e) => setIsoPneumatic(e.target.checked)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                <span className="font-bold text-slate-800">🛢️ Energi Hidrolik (Hydraulic Pressure Line)</span>
                <input type="checkbox" checked={isoHydraulic} onChange={(e) => setIsoHydraulic(e.target.checked)} className="h-4 w-4" />
              </label>
              <label className="flex items-start gap-2.5 p-3 bg-red-50 rounded border border-red-200 cursor-pointer mt-3">
                <input type="checkbox" checked={zeroEnergyVerified} onChange={(e) => setZeroEnergyVerified(e.target.checked)} className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="font-black text-red-700 block">Verifikasi Nol Energi (Zero Energy Test)</span>
                  <span className="text-[11px] text-red-600 block mt-0.5">Saya telah menekan tombol start mesin dan membuang sisa tekanan angin; mesin terbukti mati total sebelum diservis.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tampilan Kartu DANGER TAG (Bisa dicetak langsung) */}
        <div className="lg:col-span-6 print:w-full print:max-w-xl print:mx-auto">
          <div className="bg-white border-4 border-red-600 rounded-xl overflow-hidden shadow-md">
            
            {/* Header Tag Merah */}
            <div className="bg-red-600 text-white p-4 text-center border-b-4 border-red-700">
              <span className="text-3xl font-black tracking-widest block font-mono">DANGER</span>
              <span className="text-sm font-black tracking-wider uppercase block mt-0.5">DO NOT OPERATE / JANGAN DIHIDUPKAN</span>
              <span className="text-[10px] font-bold opacity-80 block tracking-widest mt-1">LOTO EQUIPMENT ISOLATION TAG</span>
            </div>

            {/* Badan Tag */}
            <div className="p-6 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Peralatan Sedang Diservis:</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{machineName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Teknisi Bertanggung Jawab:</span>
                  <span className="text-sm font-black text-slate-900 block">{technician}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Lockout ID / Gembok:</span>
                  <span className="text-sm font-black font-mono text-red-600 block">{lockNumber}</span>
                </div>
              </div>

              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Energi Terisolasi:</span>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {isoElectric && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">Listrik</span>}
                  {isoPneumatic && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">Pneumatik</span>}
                  {isoHydraulic && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">Hidrolik</span>}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Pekerjaan:</span>
                <p className="text-slate-800 font-bold mt-0.5">{workScope}</p>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-slate-300 text-center">
                <p className="text-[10px] text-red-600 font-bold italic mb-6">
                  Hanya teknisi yang namanya tertera pada tag ini yang berwenang melepas gembok LOTO!
                </p>
                <div className="w-48 mx-auto border-b border-slate-400 mb-1"></div>
                <span className="text-xs font-bold uppercase">{technician} &bull; {todayDate}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
