"use client"

import { useState, useId, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface SafetyCheck {
  id: string
  labelId: string
  labelEn: string
  isChecked: boolean
}

export default function LiftingPlanPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  // Parameters
  const [location, setLocation] = useState('Area Proyek Ekstensi Gudang C')
  const [liftingSupervisor, setLiftingSupervisor] = useState('Agus Santoso')
  const [craneOperator, setCraneOperator] = useState('Budi Prakoso')
  const [craneType, setCraneType] = useState('Mobile Crane 25T (Tadano)')

  // Load Calculation (Tons)
  const [loadWeight, setLoadWeight] = useState<number | ''>(12)
  const [craneCapacity, setCraneCapacity] = useState<number | ''>(25)

  // Pre-Lift Safety Checklist
  const [checklist, setChecklist] = useState<SafetyCheck[]>([
    { id: 'chk-1', labelId: 'Cuaca cerah & kecepatan angin aman (< 10 m/s).', labelEn: 'Clear weather & safe wind speed (< 10 m/s).', isChecked: false },
    { id: 'chk-2', labelId: 'Kondisi tanah stabil & landasan outrigger kuat.', labelEn: 'Ground is stable & outrigger pads are secure.', isChecked: false },
    { id: 'chk-3', labelId: 'Alat bantu angkat (Sling, Shackle, Webbing) lulus inspeksi.', labelEn: 'Rigging gears (Slings, Shackles) inspected and valid.', isChecked: false },
    { id: 'chk-4', labelId: 'Barikade terpasang & area pengangkatan steril.', labelEn: 'Barricades installed & lifting zone cleared.', isChecked: false },
    { id: 'chk-5', labelId: 'Komunikasi (Radio/Hand Signal) berfungsi dan disepakati.', labelEn: 'Communication (Radio/Hand Signal) established.', isChecked: false }
  ])

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, isChecked: !c.isChecked } : c))
  }

  // Lifting Logic Engine
  const liftingData = useMemo(() => {
    const weight = Number(loadWeight) || 0
    const capacity = Number(craneCapacity) || 0
    const ratio = capacity > 0 ? (weight / capacity) * 100 : 0
    
    const isAllChecked = checklist.every(c => c.isChecked)
    const isOverload = ratio > 100 || capacity === 0
    const isCritical = ratio > 80 && ratio <= 100
    const isReadyToPrint = weight > 0 && capacity > 0 && !isOverload && isAllChecked && liftingSupervisor && craneOperator

    return { ratio, isAllChecked, isOverload, isCritical, isReadyToPrint }
  }, [loadWeight, craneCapacity, checklist, liftingSupervisor, craneOperator])

  const dict = {
    ID: {
      breadcrumb: "Kalkulator Teknis",
      title: "Lifting & Rigging Plan",
      subtitle: "Perencanaan pengangkatan aman, kalkulasi Load Ratio, dan penerbitan Permit to Lift untuk operasi Crane.",
      btn_print: "Cetak Izin Lifting",
      
      p1_title: "1. Parameter Operasi Pengangkatan",
      p1_loc: "Lokasi Pengangkatan",
      p1_spv: "Lifting Supervisor",
      p1_opr: "Operator Crane",
      p1_crane: "Tipe & ID Crane",
      
      p2_title: "2. Kalkulasi Beban (Ton)",
      p2_weight: "Total Berat Beban (Load Weight)",
      p2_cap: "Kapasitas Aman Crane (Radius Aktif)",
      
      p3_title: "3. Pre-Lift Safety Checklist",
      
      stat_overload: "OVERLOAD (TIDAK AMAN)",
      stat_critical: "CRITICAL LIFT (RISIKO TINGGI)",
      stat_safe: "STANDARD LIFT (AMAN)",
      ratio_lbl: "Rasio Kapasitas",

      print_doc_type: "IZIN KERJA PENGANGKATAN (PERMIT TO LIFT) • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      print_warn: "DILARANG MELINTAS ATAU BERDIRI DI BAWAH BEBAN GANTUNG (SUSPENDED LOAD).",
      sign_spv: "Lifting Supervisor:",
      sign_opr: "Crane Operator:",
      sign_hse: "Mengetahui (HSE Dept):"
    },
    EN: {
      breadcrumb: "Technical Calculators",
      title: "Lifting & Rigging Plan",
      subtitle: "Safe lifting plan, Load Ratio calculation, and Permit to Lift issuance for Crane operations.",
      btn_print: "Print Lifting Permit",
      
      p1_title: "1. Lifting Operation Parameters",
      p1_loc: "Lifting Location",
      p1_spv: "Lifting Supervisor",
      p1_opr: "Crane Operator",
      p1_crane: "Crane Type & ID",
      
      p2_title: "2. Load Calculation (Tons)",
      p2_weight: "Total Load Weight",
      p2_cap: "Safe Crane Capacity (At Active Radius)",
      
      p3_title: "3. Pre-Lift Safety Checklist",
      
      stat_overload: "OVERLOAD (UNSAFE)",
      stat_critical: "CRITICAL LIFT (HIGH RISK)",
      stat_safe: "STANDARD LIFT (SAFE)",
      ratio_lbl: "Capacity Ratio",

      print_doc_type: "PERMIT TO LIFT DOCUMENT • SYSPEX HSE",
      print_reg: "Registration No:",
      print_warn: "STRICTLY PROHIBITED FROM WALKING OR STANDING UNDER SUSPENDED LOADS.",
      sign_spv: "Lifting Supervisor:",
      sign_opr: "Crane Operator:",
      sign_hse: "Acknowledged By (HSE Dept):"
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
            disabled={!liftingData.isReadyToPrint}
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
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">Permit To Lift</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">PTL-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* KIRI: INPUT PARAMETER & CHECKLIST */}
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
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-crane`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_crane}</label>
                <input id={`${formId}-crane`} type="text" value={craneType} onChange={(e) => setCraneType(e.target.value)} placeholder="e.g. Tadano 25T (CR-01)" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor={`${formId}-spv`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_spv}</label>
                <input id={`${formId}-spv`} type="text" value={liftingSupervisor} onChange={(e) => setLiftingSupervisor(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor={`${formId}-opr`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p1_opr}</label>
                <input id={`${formId}-opr`} type="text" value={craneOperator} onChange={(e) => setCraneOperator(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 transition-colors">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
              {t.p2_title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-weight`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p2_weight}</label>
                <div className="relative">
                  <input id={`${formId}-weight`} type="number" min="0" step="0.1" value={loadWeight} onChange={(e) => setLoadWeight(e.target.value ? parseFloat(e.target.value) : '')} className="w-full px-3 py-2 pr-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  <span className="absolute right-3 top-3 text-xs font-black text-slate-400">TON</span>
                </div>
              </div>
              <div>
                <label htmlFor={`${formId}-cap`} className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.p2_cap}</label>
                <div className="relative">
                  <input id={`${formId}-cap`} type="number" min="0" step="0.1" value={craneCapacity} onChange={(e) => setCraneCapacity(e.target.value ? parseFloat(e.target.value) : '')} className="w-full px-3 py-2 pr-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  <span className="absolute right-3 top-3 text-xs font-black text-slate-400">TON</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 transition-colors">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
              {t.p3_title}
            </h2>
            <div className="space-y-2">
              {checklist.map(c => (
                <div 
                  key={c.id} onClick={() => toggleCheck(c.id)}
                  className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                    c.isChecked 
                      ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-500 text-teal-900 dark:text-teal-400' 
                      : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-[2px] border-2 flex items-center justify-center transition-colors ${
                    c.isChecked ? 'bg-teal-500 border-teal-500' : 'bg-transparent border-slate-400 dark:border-slate-600'
                  }`}>
                    {c.isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-snug">
                    {lang === 'ID' ? c.labelId : c.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* KANAN: OUTPUT STATUS & DOKUMEN CETAK */}
        <div className="lg:col-span-5 print:block print:col-span-12 w-full">
          <div className="bg-white dark:bg-[#0b0f19] rounded-md p-6 border-2 border-slate-200 dark:border-slate-800 print:border-black print:bg-transparent print:p-6 transition-colors">
            
            <div className="mb-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800 print:border-black">
              <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
                <div>
                  <p className="text-[9px] text-slate-400 print:text-black mb-1">Location:</p>
                  <p className="leading-snug">{location}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 print:text-black mb-1">Crane:</p>
                  <p className="leading-snug">{craneType}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 print:text-black mb-1">Supervisor:</p>
                  <p>{liftingSupervisor}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 print:text-black mb-1">Operator:</p>
                  <p>{craneOperator}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-[4px] print:border-black print:rounded-none text-center">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p2_weight}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white print:text-black">{loadWeight || 0} <span className="text-sm">T</span></p>
              </div>
              <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-[4px] print:border-black print:rounded-none text-center">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p2_cap}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white print:text-black">{craneCapacity || 0} <span className="text-sm">T</span></p>
              </div>
            </div>

            <div className={`p-6 border-2 rounded-[4px] print:rounded-none text-center mb-6 transition-colors ${
              liftingData.isOverload 
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-400 print:border-black print:text-black' 
                : liftingData.isCritical
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-700 dark:text-amber-500 print:border-black print:text-black'
                : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-500 print:border-black print:text-black'
            }`}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-2">{t.ratio_lbl}</p>
              <p className="text-5xl font-black">{liftingData.ratio.toFixed(1)}<span className="text-2xl">%</span></p>
              <div className="w-1/2 mx-auto border-b-2 my-3 border-current opacity-30"></div>
              <h3 className="text-sm font-black uppercase tracking-widest">
                {liftingData.isOverload ? t.stat_overload : liftingData.isCritical ? t.stat_critical : t.stat_safe}
              </h3>
            </div>

            <div className="hidden print:block mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">{t.p3_title}</h3>
              <div className="space-y-2 text-[10px] font-bold text-black uppercase tracking-wider">
                {checklist.map(c => (
                  <div key={c.id} className="flex gap-3 items-start border-b border-gray-300 pb-1">
                    <span className="font-black">[ X ]</span>
                    <span>{lang === 'ID' ? c.labelId : c.labelEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KHUSUS CETAK: PERINGATAN & TTD */}
            <div className="hidden print:block mt-8">
              <div className="border-t-2 border-b-2 border-black py-2 mb-8 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-black">{t.print_warn}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center text-[9px] font-black uppercase tracking-widest text-black">
                <div>
                  <p className="mb-12">{t.sign_spv}</p>
                  <div className="w-full mx-auto border-b-2 border-black"></div>
                  <p className="mt-1">{liftingSupervisor}</p>
                </div>
                <div>
                  <p className="mb-12">{t.sign_opr}</p>
                  <div className="w-full mx-auto border-b-2 border-black"></div>
                  <p className="mt-1">{craneOperator}</p>
                </div>
                <div className="bg-gray-100 p-2 border-2 border-black -mt-2">
                  <p className="mb-10 pt-2">{t.sign_hse}</p>
                  <div className="w-full mx-auto border-b-2 border-black"></div>
                  <p className="mt-1">Syspex HSE Dept</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
