"use client"

import { useState, useId, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface BoQItem {
  id: string
  code: string
  name: string
  qty: number
  unit: string
  remarks: string
}

export default function ScaffoldingBoqPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  // Project Parameters
  const [jobLocation, setJobLocation] = useState('Area Produksi Line 3')
  const [requestor, setRequestor] = useState('Budi Prakoso')
  
  // Dimensions (Meters)
  const [length, setLength] = useState<number>(6)
  const [width, setWidth] = useState<number>(2)
  const [height, setHeight] = useState<number>(4)

  // Standard Scaffolding Constraints (Tubular BS 1139)
  const BAY_LENGTH = 2.0 // Jarak antar tiang memanjang (m)
  const TRANSOM_WIDTH = 1.2 // Lebar standar (m)
  const LIFT_HEIGHT = 2.0 // Jarak tinggi antar level (m)
  const BOARD_AREA = 0.8 // Perkiraan area per papan scaffold (m2)

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // Kalkulasi Algoritma Scaffolding (BoQ Generator)
  const boqData = useMemo(() => {
    const l = Number(length) || 0
    const w = Number(width) || 0
    const h = Number(height) || 0

    if (l === 0 || w === 0 || h === 0) return []

    // Estimasi Kebutuhan Tiang (Standards)
    const standardBays = Math.ceil(l / BAY_LENGTH)
    const widthBays = Math.ceil(w / TRANSOM_WIDTH)
    const standardsCount = (standardBays + 1) * (widthBays + 1)

    // Estimasi Ledger (Memanjang) & Transom (Melintang)
    const liftCount = Math.ceil(h / LIFT_HEIGHT)
    const ledgersCount = standardBays * (liftCount + 1) * (widthBays + 1)
    const transomsCount = widthBays * (liftCount + 1) * (standardBays + 1)

    // Komponen Lainnya
    const basePlates = standardsCount
    const swivelCouplers = standardsCount * liftCount * 2 // Estimasi bracing
    const rightAngleCouplers = (ledgersCount + transomsCount) * 2
    const boardsCount = Math.ceil((l * w) / BOARD_AREA) * liftCount // Full boarded semua level
    const toeBoards = (standardBays * 2 + widthBays * 2) * liftCount

    const items: BoQItem[] = [
      { id: '1', code: 'ST-01', name: lang === 'ID' ? 'Pipa Standard (Tiang Vertikal) 4m' : 'Standard Tube (Vertical) 4m', qty: standardsCount, unit: 'Pcs', remarks: 'BS 1139 / EN 74' },
      { id: '2', code: 'LD-01', name: lang === 'ID' ? 'Pipa Ledger (Memanjang) 6m' : 'Ledger Tube (Horizontal) 6m', qty: ledgersCount, unit: 'Pcs', remarks: 'BS 1139 / EN 74' },
      { id: '3', code: 'TR-01', name: lang === 'ID' ? 'Pipa Transom (Melintang) 2m' : 'Transom Tube (Cross) 2m', qty: transomsCount, unit: 'Pcs', remarks: 'BS 1139 / EN 74' },
      { id: '4', code: 'BP-01', name: lang === 'ID' ? 'Base Plate & Sole Board' : 'Base Plate & Sole Board', qty: basePlates, unit: 'Set', remarks: 'Menopang tiang di tanah' },
      { id: '5', code: 'RC-01', name: lang === 'ID' ? 'Klem Sudut Siku (Right Angle Coupler)' : 'Right Angle (Double) Coupler', qty: rightAngleCouplers, unit: 'Pcs', remarks: 'Sambungan 90 Derajat' },
      { id: '6', code: 'SC-01', name: lang === 'ID' ? 'Klem Putar (Swivel Coupler)' : 'Swivel Coupler', qty: swivelCouplers, unit: 'Pcs', remarks: 'Sambungan Bracing Diagonal' },
      { id: '7', code: 'SB-01', name: lang === 'ID' ? 'Papan Scaffold (Metal Plank)' : 'Metal Scaffold Plank', qty: boardsCount, unit: 'Pcs', remarks: 'Min. Lebar 200mm' },
      { id: '8', code: 'TB-01', name: lang === 'ID' ? 'Toe Board (Papan Kaki)' : 'Toe Board', qty: toeBoards, unit: 'Pcs', remarks: 'Pelindung material jatuh' },
    ]

    return items
  }, [length, width, height, lang])

  const dict = {
    ID: {
      breadcrumb: "Kalkulator Teknis",
      title: "Scaffolding BoQ",
      subtitle: "Kalkulasi otomatis material scaffolding (Bill of Quantities) berbasis standar BS-1139 untuk struktur tubular independent.",
      btn_print: "Cetak Dokumen BoQ",
      
      p1_title: "1. Parameter Dimensi Struktur (Meter)",
      p1_loc: "Lokasi Pemasangan",
      p1_req: "Nama Peminta (Requestor)",
      p1_l: "Panjang Struktur (L)",
      p1_w: "Lebar Struktur (W)",
      p1_h: "Tinggi Maksimal (H)",
      
      p2_title: "2. Bill of Quantities (Kebutuhan Material)",
      th_no: "No",
      th_code: "Kode",
      th_item: "Komponen / Item",
      th_qty: "Qty",
      th_unit: "Unit",
      th_remark: "Spesifikasi / Remarks",

      print_doc_type: "DOKUMEN MATERIAL ESTIMASI (SCAFFOLDING) • SYSPEX ENG",
      print_reg: "Nomor Registrasi:",
      sign_req: "Diminta Oleh (Requestor):",
      sign_eng: "Dihitung Oleh (Scaffolding Inspector):",
      sign_mgr: "Disetujui Oleh (HSE / Project Mgr):",
    },
    EN: {
      breadcrumb: "Technical Calculators",
      title: "Scaffolding BoQ",
      subtitle: "Automated material takeoff (Bill of Quantities) based on BS-1139 standards for independent tied tubular scaffolding.",
      btn_print: "Print BoQ Document",
      
      p1_title: "1. Structure Dimension Parameters (Meters)",
      p1_loc: "Installation Location",
      p1_req: "Requestor Name",
      p1_l: "Structure Length (L)",
      p1_w: "Structure Width (W)",
      p1_h: "Maximum Height (H)",
      
      p2_title: "2. Bill of Quantities",
      th_no: "No",
      th_code: "Code",
      th_item: "Component / Item",
      th_qty: "Qty",
      th_unit: "Unit",
      th_remark: "Specification / Remarks",

      print_doc_type: "OFFICIAL MATERIAL ESTIMATION (SCAFFOLDING) • SYSPEX ENG",
      print_reg: "Registration No:",
      sign_req: "Requested By:",
      sign_eng: "Calculated By (Scaffolding Inspector):",
      sign_mgr: "Approved By (HSE / Project Mgr):",
    }
  }

  const t = dict[lang]

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={boqData.length === 0}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50 shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Scaffolding BoQ</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">BOQ-SCF-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* 1. PARAMETER DIMENSI */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 print:border-black print:text-black">
          {t.p1_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_loc}</label>
            <input id={`${formId}-loc`} type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div className="md:col-span-3">
            <label htmlFor={`${formId}-req`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_req}</label>
            <input id={`${formId}-req`} type="text" value={requestor} onChange={(e) => setRequestor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          
          {/* Inputs Angka */}
          <div className="md:col-span-1 border-t border-slate-100 pt-4 print:border-none print:pt-2">
            <label htmlFor={`${formId}-l`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_l}</label>
            <div className="relative">
              <input id={`${formId}-l`} type="number" min="0" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-black text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
              <span className="absolute right-3 top-2 text-xs font-black text-slate-400 print:hidden">m</span>
            </div>
          </div>
          <div className="md:col-span-1 border-t border-slate-100 pt-4 print:border-none print:pt-2">
            <label htmlFor={`${formId}-w`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_w}</label>
            <div className="relative">
              <input id={`${formId}-w`} type="number" min="0" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-black text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
              <span className="absolute right-3 top-2 text-xs font-black text-slate-400 print:hidden">m</span>
            </div>
          </div>
          <div className="md:col-span-1 border-t border-slate-100 pt-4 print:border-none print:pt-2">
            <label htmlFor={`${formId}-h`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_h}</label>
            <div className="relative">
              <input id={`${formId}-h`} type="number" min="0" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-black text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
              <span className="absolute right-3 top-2 text-xs font-black text-slate-400 print:hidden">m</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MATRIKS BoQ */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 print:border-black print:text-black">
          {t.p2_title}
        </h2>

        {boqData.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded print:hidden">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Masukkan dimensi (L, W, H) untuk memuat kalkulasi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-slate-200 print:border-black rounded-[4px] print:rounded-none">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b-2 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 print:bg-white print:border-black print:text-black">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">{t.th_no}</th>
                  <th className="py-3 px-3 w-24 border-l-2 border-slate-200 print:border-black">{t.th_code}</th>
                  <th className="py-3 px-3 w-1/3 border-l-2 border-slate-200 print:border-black">{t.th_item}</th>
                  <th className="py-3 px-3 w-20 text-center border-l-2 border-slate-200 print:border-black">{t.th_qty}</th>
                  <th className="py-3 px-3 w-20 text-center border-l-2 border-slate-200 print:border-black">{t.th_unit}</th>
                  <th className="py-3 px-3 border-l-2 border-slate-200 print:border-black">{t.th_remark}</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 text-slate-900 print:divide-black">
                {boqData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 print:hover:bg-white">
                    <td className="py-3 px-3 text-center font-black text-slate-400 print:text-black">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-500 border-l-2 border-slate-100 print:border-black print:text-black print:text-[10px]">
                      {item.code}
                    </td>
                    <td className="py-3 px-3 font-black uppercase tracking-wider border-l-2 border-slate-100 print:border-black print:text-[10px]">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-center text-sm font-black text-teal-700 bg-teal-50 border-l-2 border-slate-100 print:border-black print:bg-transparent print:text-black">
                      {item.qty}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[10px] uppercase border-l-2 border-slate-100 print:border-black">
                      {item.unit}
                    </td>
                    <td className="py-3 px-3 font-medium text-[10px] leading-relaxed border-l-2 border-slate-100 print:border-black">
                      {item.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="hidden print:grid grid-cols-3 gap-6 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_req}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">{requestor}</p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-slate-100">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_eng}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Syspex Engineering Dept.</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_mgr}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">Project Manager</p>
          </div>
        </div>

      </div>
    </div>
  )
}
