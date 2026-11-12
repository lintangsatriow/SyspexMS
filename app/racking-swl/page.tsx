"use client"

import { useState, useId, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

export default function RackingSwlPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Racking Parameters
  const [location, setLocation] = useState('Gudang Bahan Baku - Lorong A')
  const [beamLength, setBeamLength] = useState<number>(2700) // mm
  const [beamProfile, setBeamProfile] = useState<'100x50' | '120x50' | '140x50'>('100x50')
  const [levels, setLevels] = useState<number>(4) // Number of beam levels
  const [inspector, setInspector] = useState('Agus Santoso')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // SWL (Safe Working Load) Algorithm
  const swlData = useMemo(() => {
    // Kapasitas aman per pasang beam (kg) berdasarkan profil dan panjang
    let capacityPerLevel = 0
    if (beamLength <= 2700) {
      if (beamProfile === '100x50') capacityPerLevel = 2000
      if (beamProfile === '120x50') capacityPerLevel = 3000
      if (beamProfile === '140x50') capacityPerLevel = 4000
    } else if (beamLength <= 3300) {
      if (beamProfile === '100x50') capacityPerLevel = 1500
      if (beamProfile === '120x50') capacityPerLevel = 2400
      if (beamProfile === '140x50') capacityPerLevel = 3200
    } else {
      if (beamProfile === '100x50') capacityPerLevel = 1000
      if (beamProfile === '120x50') capacityPerLevel = 1800
      if (beamProfile === '140x50') capacityPerLevel = 2500
    }

    const totalBayLoad = capacityPerLevel * levels
    const maxFrameCapacity = 12000 // Asumsi kapasitas maksimal tiang (Upright Frame) adalah 12 Ton
    const isOverload = totalBayLoad > maxFrameCapacity

    // Estimasi palet (asumsi standar EUR pallet 1200x800, max 1000kg/pallet)
    const palletsPerLevel = beamLength >= 3300 ? 3 : 2
    const maxWeightPerPallet = Math.floor(capacityPerLevel / palletsPerLevel)

    return {
      capacityPerLevel,
      totalBayLoad,
      maxFrameCapacity,
      isOverload,
      palletsPerLevel,
      maxWeightPerPallet
    }
  }, [beamLength, beamProfile, levels])

  const dict = {
    ID: {
      breadcrumb: "Kalkulator Teknis",
      title: "Racking SWL Calculator",
      subtitle: "Kalkulasi Safe Working Load (Beban Kerja Aman) untuk Selective Pallet Racking guna mencegah kegagalan struktur.",
      btn_print: "Cetak Label Kapasitas",
      
      p1_title: "1. Parameter Sistem Racking",
      p1_loc: "Lokasi / ID Rak",
      p1_beam: "Panjang Balok (Beam Length)",
      p1_prof: "Profil Balok (Beam Box)",
      p1_lvl: "Jumlah Tingkat (Levels)",
      p1_ins: "Nama Inspektur",
      
      p2_title: "2. Limitasi Kapasitas Beban",
      swl_level: "SWL Per Tingkat (Level)",
      swl_pallet: "Maks. Beban Per Palet",
      swl_bay: "Total Beban Per Bay",
      swl_frame: "Kapasitas Maks. Frame",
      
      stat_safe: "STRUKTUR AMAN",
      stat_danger: "OVERLOAD (BAHAYA)",
      warn_desc: "Total beban melampaui kapasitas tiang utama. Kurangi jumlah tingkat atau beban per palet.",

      print_doc_type: "LABEL KAPASITAS BEBAN RAK (SWL) • SYSPEX ENG",
      print_reg: "Nomor Registrasi:",
      print_warn: "DILARANG MELEBIHI BATAS BEBAN YANG DITETAPKAN PADA LABEL INI.",
      sign_eng: "Dihitung Oleh (Engineer):",
      sign_mgr: "Mengetahui (Warehouse Mgr):"
    },
    EN: {
      breadcrumb: "Technical Calculators",
      title: "Racking SWL Calculator",
      subtitle: "Safe Working Load calculation for Selective Pallet Racking to prevent structural failure.",
      btn_print: "Print Capacity Label",
      
      p1_title: "1. Racking System Parameters",
      p1_loc: "Location / Rack ID",
      p1_beam: "Beam Length",
      p1_prof: "Beam Profile (Box Box)",
      p1_lvl: "Number of Levels",
      p1_ins: "Inspector Name",
      
      p2_title: "2. Load Capacity Limitations",
      swl_level: "SWL Per Level",
      swl_pallet: "Max Load Per Pallet",
      swl_bay: "Total Bay Load",
      swl_frame: "Max Frame Capacity",
      
      stat_safe: "STRUCTURE SAFE",
      stat_danger: "OVERLOAD (DANGER)",
      warn_desc: "Total load exceeds main frame capacity. Reduce number of levels or weight per pallet.",

      print_doc_type: "RACK LOAD CAPACITY LABEL (SWL) • SYSPEX ENG",
      print_reg: "Registration No:",
      print_warn: "DO NOT EXCEED THE MAXIMUM LOAD LIMITS SPECIFIED ON THIS LABEL.",
      sign_eng: "Calculated By (Engineer):",
      sign_mgr: "Acknowledged By (Warehouse Mgr):"
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={swlData.isOverload}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">RACKING SWL</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">SWL-RCK-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* PANEL KIRI: INPUT PARAMETER */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 transition-colors">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
              {t.p1_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_loc}</label>
                <input id={`${formId}-loc`} type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500" />
              </div>
              
              <div>
                <label htmlFor={`${formId}-beam`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_beam}</label>
                <div className="relative">
                  <select id={`${formId}-beam`} value={beamLength} onChange={(e) => setBeamLength(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500">
                    <option value={2700}>2700 mm (2 Pallets)</option>
                    <option value={3300}>3300 mm (3 Pallets)</option>
                    <option value={3600}>3600 mm (3 Pallets)</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={`${formId}-prof`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_prof}</label>
                <select id={`${formId}-prof`} value={beamProfile} onChange={(e) => setBeamProfile(e.target.value as any)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500">
                  <option value="100x50">100x50 mm (Light-Med)</option>
                  <option value="120x50">120x50 mm (Medium)</option>
                  <option value="140x50">140x50 mm (Heavy)</option>
                </select>
              </div>

              <div>
                <label htmlFor={`${formId}-lvl`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_lvl}</label>
                <input id={`${formId}-lvl`} type="number" min="1" max="8" value={levels} onChange={(e) => setLevels(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor={`${formId}-ins`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_ins}</label>
                <input id={`${formId}-ins`} type="text" value={inspector} onChange={(e) => setInspector(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL KANAN & OUTPUT CETAK */}
        <div className="lg:col-span-5 print:block print:col-span-12 w-full">
          <div className="bg-white dark:bg-[#0b0f19] rounded-md p-6 border-2 border-slate-200 dark:border-slate-800 print:border-black print:bg-transparent print:p-6 transition-colors">
            
            <div className="mb-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800 print:border-black text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_loc}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white uppercase print:text-black">{location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] print:bg-transparent print:border-black print:rounded-none text-center">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.swl_level}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white print:text-black">{swlData.capacityPerLevel} <span className="text-xs">KG</span></p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px] print:bg-transparent print:border-black print:rounded-none text-center">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.swl_pallet}</p>
                <p className="text-2xl font-black text-teal-600 dark:text-teal-400 print:text-black">{swlData.maxWeightPerPallet} <span className="text-xs">KG</span></p>
                <p className="text-[9px] font-bold text-slate-400 print:text-black mt-1">(Max {swlData.palletsPerLevel} Pallets/Lvl)</p>
              </div>
            </div>

            <div className={`p-4 border-2 rounded-[4px] print:rounded-none text-center mb-6 transition-colors ${
              swlData.isOverload 
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-400 print:border-black print:text-black' 
                : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-500 print:border-black print:text-black'
            }`}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1">{t.swl_bay}</p>
              <p className="text-3xl font-black">{swlData.totalBayLoad} <span className="text-sm">KG</span></p>
              <div className="w-1/2 mx-auto border-b-2 my-2 border-current opacity-30"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                {t.swl_frame}: {swlData.maxFrameCapacity} KG
              </p>
            </div>

            {swlData.isOverload ? (
              <div className="text-center p-3 bg-rose-600 text-white rounded-[4px] print:border-4 print:border-black print:bg-white print:text-black print:rounded-none">
                <h3 className="text-sm font-black uppercase tracking-widest">{t.stat_danger}</h3>
                <p className="text-[10px] font-bold mt-1 print:hidden">{t.warn_desc}</p>
              </div>
            ) : (
              <div className="text-center p-3 bg-emerald-600 text-white rounded-[4px] print:border-4 print:border-black print:bg-white print:text-black print:rounded-none print:hidden">
                <h3 className="text-sm font-black uppercase tracking-widest">{t.stat_safe}</h3>
              </div>
            )}

            {/* KHUSUS CETAK: PERINGATAN & TTD */}
            <div className="hidden print:block mt-8">
              <div className="border-t-2 border-b-2 border-black py-2 mb-8 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-black">{t.print_warn}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 text-center text-[10px] font-black uppercase tracking-widest text-black">
                <div>
                  <p className="mb-12">{t.sign_eng}</p>
                  <div className="w-3/4 mx-auto border-b-2 border-black"></div>
                  <p className="mt-1">{inspector}</p>
                </div>
                <div>
                  <p className="mb-12">{t.sign_mgr}</p>
                  <div className="w-3/4 mx-auto border-b-2 border-black"></div>
                  <p className="mt-1">Nama & Tanda Tangan</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
