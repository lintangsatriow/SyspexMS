"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

type CheckStatus = 'PASS' | 'FAIL' | 'NA'
type EquipmentCategory = 'FORKLIFT' | 'SCISSOR_LIFT' | 'HAND_PALLET'

interface InspectionItem {
  id: string
  category: 'Visual' | 'Fungsional'
  isCritical: boolean
  label: string
}

export default function ForkliftInspectionPage() {
  const { lang } = useLanguage()

  const [equipmentType, setEquipmentType] = useState<EquipmentCategory>('FORKLIFT')
  const [equipmentId, setEquipmentId] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [hourMeter, setHourMeter] = useState('')
  const [notes, setNotes] = useState('')
  
  // Refactor state: Hanya menyimpan status, bukan seluruh objek checklist
  const [checks, setChecks] = useState<Record<string, CheckStatus>>({})

  useEffect(() => {
    // Reset checks saat tipe alat diganti
    setChecks({})
    if (equipmentType === 'HAND_PALLET') setHourMeter('')
  }, [equipmentType])

  const handleCheck = (id: string, status: CheckStatus) => {
    setChecks(prev => ({ ...prev, [id]: status }))
  }

  // Kamus Global & Database Checklist Dwibahasa
  const dict = {
    ID: {
      breadcrumb: "Peralatan Berat",
      title: "MHE Pre-Op Checklist",
      subtitle: "Inspeksi dinamis untuk Forklift, Scissor Lift, dan Hand Pallet.",
      btn_print: "Cetak Dokumen / Tag",
      cat_label: "Kategori Alat",
      id_label: "ID Alat (No. Unit)",
      op_label: "Nama Operator",
      hm_label: "Hour Meter Akhir",
      panel_id: "Identitas Operasional",
      panel_check: "Parameter Inspeksi",
      notes_label: "Catatan Temuan (Remarks)",
      crit_note: "CRIT: Item Keselamatan Kritis",
      
      opt_forklift: "FORKLIFT / REACH TRUCK",
      opt_scissor: "SCISSOR / BOOM LIFT",
      opt_hand: "HAND PALLET MANUAL",

      status_pending_title: "Pending Verifikasi",
      status_pending_desc: "Lengkapi identitas dan seluruh parameter inspeksi.",
      status_safe_title: "SAFE TO OPERATE",
      status_safe_desc: "Alat terverifikasi dan layak operasi.",
      status_fail_title: "DO NOT OPERATE",
      status_fail_desc: "Kritikal fail terdeteksi. Cetak Danger Tag (LOTO).",
      fail_summary: "Kerusakan Komponen:",

      checklists: {
        FORKLIFT: [
          { id: 'f-v1', category: 'Visual', label: 'Kondisi Garpu (Forks) & Pin', isCritical: true },
          { id: 'f-v2', category: 'Visual', label: 'Tiang (Mast) & Rantai Pengangkat', isCritical: true },
          { id: 'f-v3', category: 'Visual', label: 'Roda & Tekanan Ban', isCritical: false },
          { id: 'f-v4', category: 'Visual', label: 'Kebocoran Oli / Fluida', isCritical: true },
          { id: 'f-v5', category: 'Visual', label: 'Kondisi Body & FOHG (Atap)', isCritical: false },
          { id: 'f-f1', category: 'Fungsional', label: 'Rem Kaki & Rem Parkir', isCritical: true },
          { id: 'f-f2', category: 'Fungsional', label: 'Sistem Kemudi (Steering)', isCritical: true },
          { id: 'f-f3', category: 'Fungsional', label: 'Tuas Hidrolik (Naik/Turun/Tilt)', isCritical: true },
          { id: 'f-f4', category: 'Fungsional', label: 'Klakson & Alarm Mundur', isCritical: true },
          { id: 'f-f5', category: 'Fungsional', label: 'Lampu Rotari & Lampu Kerja', isCritical: false },
        ] as InspectionItem[],
        SCISSOR_LIFT: [
          { id: 's-v1', category: 'Visual', label: 'Platform, Pagar & Pintu', isCritical: true },
          { id: 's-v2', category: 'Visual', label: 'Mekanisme Scissor & Pin', isCritical: true },
          { id: 's-v3', category: 'Visual', label: 'Roda & Pothole Protection', isCritical: true },
          { id: 's-v4', category: 'Visual', label: 'Kebocoran Fluida Hidrolik', isCritical: true },
          { id: 's-f1', category: 'Fungsional', label: 'Kontrol Kemudi & Rem', isCritical: true },
          { id: 's-f2', category: 'Fungsional', label: 'Fungsi Naik/Turun Platform', isCritical: true },
          { id: 's-f3', category: 'Fungsional', label: 'Katup Penurun Darurat (Emergency)', isCritical: true },
          { id: 's-f4', category: 'Fungsional', label: 'Alarm Gerak & Klakson', isCritical: true },
        ] as InspectionItem[],
        HAND_PALLET: [
          { id: 'h-v1', category: 'Visual', label: 'Kondisi Garpu & Frame Utama', isCritical: true },
          { id: 'h-v2', category: 'Visual', label: 'Roda Depan & Belakang (Rollers)', isCritical: true },
          { id: 'h-v3', category: 'Visual', label: 'Kebocoran Oli Hidrolik', isCritical: true },
          { id: 'h-f1', category: 'Fungsional', label: 'Sistem Handle / Kemudi', isCritical: true },
          { id: 'h-f2', category: 'Fungsional', label: 'Fungsi Pompa Naik (Lifting)', isCritical: true },
          { id: 'h-f3', category: 'Fungsional', label: 'Fungsi Tuas Turun (Lowering)', isCritical: true },
        ] as InspectionItem[]
      }
    },
    EN: {
      breadcrumb: "Heavy Equipment",
      title: "MHE Pre-Op Checklist",
      subtitle: "Dynamic inspection logs for Forklifts, Scissor Lifts, and Hand Pallets.",
      btn_print: "Print Record / Tag",
      cat_label: "Equipment Category",
      id_label: "Equipment ID (Unit No.)",
      op_label: "Operator Name",
      hm_label: "Final Hour Meter",
      panel_id: "Operational Identity",
      panel_check: "Inspection Parameters",
      notes_label: "Remarks / Faults",
      crit_note: "CRIT: Critical Safety Item",
      
      opt_forklift: "FORKLIFT / REACH TRUCK",
      opt_scissor: "SCISSOR / BOOM LIFT",
      opt_hand: "MANUAL HAND PALLET",

      status_pending_title: "Pending Verification",
      status_pending_desc: "Complete identity fields and all inspection parameters.",
      status_safe_title: "SAFE TO OPERATE",
      status_safe_desc: "Equipment verified and cleared for operation.",
      status_fail_title: "DO NOT OPERATE",
      status_fail_desc: "Critical failure detected. Print LOTO Danger Tag.",
      fail_summary: "Component Faults:",

      checklists: {
        FORKLIFT: [
          { id: 'f-v1', category: 'Visual', label: 'Forks & Pins Condition', isCritical: true },
          { id: 'f-v2', category: 'Visual', label: 'Mast & Lifting Chains', isCritical: true },
          { id: 'f-v3', category: 'Visual', label: 'Wheels & Tire Pressure', isCritical: false },
          { id: 'f-v4', category: 'Visual', label: 'Fluid Leaks (Oil/Hydraulic)', isCritical: true },
          { id: 'f-v5', category: 'Visual', label: 'Body & FOHG Condition', isCritical: false },
          { id: 'f-f1', category: 'Fungsional', label: 'Foot & Parking Brakes', isCritical: true },
          { id: 'f-f2', category: 'Fungsional', label: 'Steering System', isCritical: true },
          { id: 'f-f3', category: 'Fungsional', label: 'Hydraulic Controls (Lift/Tilt)', isCritical: true },
          { id: 'f-f4', category: 'Fungsional', label: 'Horn & Reverse Alarm', isCritical: true },
          { id: 'f-f5', category: 'Fungsional', label: 'Working & Rotary Lights', isCritical: false },
        ],
        SCISSOR_LIFT: [
          { id: 's-v1', category: 'Visual', label: 'Platform, Guardrails & Gate', isCritical: true },
          { id: 's-v2', category: 'Visual', label: 'Scissor Mechanism & Pins', isCritical: true },
          { id: 's-v3', category: 'Visual', label: 'Wheels & Pothole Protection', isCritical: true },
          { id: 's-v4', category: 'Visual', label: 'Hydraulic Fluid Leaks', isCritical: true },
          { id: 's-f1', category: 'Fungsional', label: 'Brake & Drive Controls', isCritical: true },
          { id: 's-f2', category: 'Fungsional', label: 'Platform Lift/Lower Functions', isCritical: true },
          { id: 's-f3', category: 'Fungsional', label: 'Emergency Lowering Valve', isCritical: true },
          { id: 's-f4', category: 'Fungsional', label: 'Motion Alarm & Horn', isCritical: true },
        ],
        HAND_PALLET: [
          { id: 'h-v1', category: 'Visual', label: 'Forks & Main Frame Condition', isCritical: true },
          { id: 'h-v2', category: 'Visual', label: 'Front & Rear Rollers', isCritical: true },
          { id: 'h-v3', category: 'Visual', label: 'Hydraulic Leaks', isCritical: true },
          { id: 'h-f1', category: 'Fungsional', label: 'Handle & Steering System', isCritical: true },
          { id: 'h-f2', category: 'Fungsional', label: 'Lifting Pump Function', isCritical: true },
          { id: 'h-f3', category: 'Fungsional', label: 'Lowering Release Lever', isCritical: true },
        ]
      }
    }
  }

  const t = dict[lang]
  const currentChecklist = t.checklists[equipmentType]

  // Evaluasi Logika Keselamatan (Otomatis menyesuaikan dengan checklist aktif)
  const evaluation = useMemo(() => {
    const isComplete = currentChecklist.every(item => checks[item.id] !== undefined)
    const failedItems = currentChecklist.filter(item => checks[item.id] === 'FAIL')
    const hasCriticalFail = failedItems.some(item => item.isCritical)
    
    return {
      isComplete,
      failedItems,
      hasCriticalFail,
      isSafeToOperate: isComplete && !hasCriticalFail
    }
  }, [checks, currentChecklist])

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <button 
            onClick={() => window.print()} 
            disabled={!evaluation.isComplete || equipmentId === ''}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded transition shadow-sm border ${
              evaluation.isComplete && equipmentId !== '' 
                ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL INPUT (KIRI) */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{t.panel_id}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.cat_label}</label>
                <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value as EquipmentCategory)} className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-800 rounded text-xs font-bold focus:outline-none focus:border-teal-500 transition">
                  <option value="FORKLIFT">{t.opt_forklift}</option>
                  <option value="SCISSOR_LIFT">{t.opt_scissor}</option>
                  <option value="HAND_PALLET">{t.opt_hand}</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.id_label}</label>
                <input type="text" required value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold uppercase focus:outline-none focus:border-slate-900" placeholder="e.g. FL-01" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.op_label}</label>
                <input type="text" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:border-slate-900" placeholder="Name..." />
              </div>
              {equipmentType !== 'HAND_PALLET' && (
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.hm_label}</label>
                  <input type="number" value={hourMeter} onChange={(e) => setHourMeter(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:border-slate-900" placeholder="HRS..." />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.panel_check} - {equipmentType.replace('_', ' ')}</h2>
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">{t.crit_note}</span>
            </div>

            <div className="space-y-6 pt-2">
              {['Visual', 'Fungsional'].map(category => {
                const items = currentChecklist.filter(item => item.category === category)
                if (items.length === 0) return null
                
                return (
                  <div key={category} className="space-y-1">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded">{category} Checks</h3>
                    <div className="space-y-1 pt-1">
                      {items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-2.5 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition gap-3">
                          <div className="flex items-center gap-2">
                            {item.isCritical ? (
                              <span className="px-1.5 py-0.5 text-[8px] font-black bg-rose-100 text-rose-600 rounded">CRIT</span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[8px] font-black text-slate-300 opacity-0">CRIT</span>
                            )}
                            <span className="text-xs font-bold text-slate-800">{item.label}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => handleCheck(item.id, 'PASS')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded border transition ${checks[item.id] === 'PASS' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-600 hover:text-emerald-600'}`}>PASS</button>
                            <button onClick={() => handleCheck(item.id, 'FAIL')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded border transition ${checks[item.id] === 'FAIL' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-200 hover:border-rose-600 hover:text-rose-600'}`}>FAIL</button>
                            <button onClick={() => handleCheck(item.id, 'NA')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded border transition ${checks[item.id] === 'NA' ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-600 hover:text-slate-600'}`}>N/A</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.notes_label}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:border-slate-900 resize-none" placeholder="..." />
            </div>
          </div>
        </div>

        {/* PANEL OUTPUT STATUS (KANAN) */}
        <div className="lg:col-span-5 print:col-span-12 w-full">
          <div className="print:hidden space-y-4 sticky top-6">
            
            <div className={`p-6 rounded-xl border flex flex-col justify-center items-center text-center transition-colors min-h-[200px] ${
              !evaluation.isComplete || equipmentId === '' 
                ? 'bg-slate-50 border-slate-200 text-slate-500' 
                : evaluation.isSafeToOperate 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                  : 'bg-rose-950 border-rose-600 text-white'
            }`}>
              {!evaluation.isComplete || equipmentId === '' ? (
                <>
                  <h3 className="text-xl font-black uppercase tracking-tight">{t.status_pending_title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2">{t.status_pending_desc}</p>
                </>
              ) : evaluation.isSafeToOperate ? (
                <>
                  <h3 className="text-2xl font-black uppercase tracking-widest">{t.status_safe_title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-80">{t.status_safe_desc}</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-rose-500">{t.status_fail_title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-rose-200">{t.status_fail_desc}</p>
                </>
              )}
            </div>
            
            {evaluation.failedItems.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-rose-200">
                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 border-b border-rose-100 pb-2">{t.fail_summary}</h4>
                <ul className="text-[11px] font-bold text-slate-700 space-y-1.5 mt-2">
                  {evaluation.failedItems.map(item => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.label}</span>
                      {item.isCritical && <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-1.5 rounded uppercase">Crit</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* DOKUMEN CETAK UTAMA (PRINT VIEW) */}
          <div className="hidden print:block w-full">
            {evaluation.isComplete && !evaluation.isSafeToOperate ? (
              
              /* PRINT: DANGER TAG */
              <div className="w-[380px] border-[8px] border-black mx-auto flex flex-col h-[580px] text-center bg-white relative overflow-hidden">
                <div className="h-6 w-full bg-[repeating-linear-gradient(45deg,#000000,#000000_10px,#ffffff_10px,#ffffff_20px)] border-b-4 border-black"></div>
                <div className="bg-black text-white py-6 px-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase mb-2">DANGER</h1>
                  <h2 className="text-xl font-bold uppercase tracking-widest">DO NOT OPERATE</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col text-black">
                  <p className="text-xs font-black uppercase tracking-widest mb-1">Equipment ID ({equipmentType.replace('_', ' ')}):</p>
                  <p className="text-4xl font-black mb-6 border-b-4 border-black pb-2">{equipmentId.toUpperCase()}</p>
                  
                  <div className="text-left mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Damaged Components:</p>
                    <ul className="list-disc pl-4 text-xs font-black space-y-1">
                      {evaluation.failedItems.map(item => (
                        <li key={item.id}>{item.label} {item.isCritical && "(CRITICAL)"}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t-4 border-black text-left text-[10px] font-black uppercase tracking-widest space-y-2">
                    <p>Tagged By: {operatorName || '....................'}</p>
                    <p>Date: {new Date().toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-GB')}</p>
                    <p className="text-center text-[9px] pt-4">Syspex Management System</p>
                  </div>
                </div>
              </div>

            ) : (

              /* PRINT: SAFE LOG RECORD */
              <div className="border-4 border-black p-8 w-full max-w-[800px] mx-auto text-black">
                <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
                  <div>
                    <h1 className="text-xl font-black uppercase tracking-widest">MHE Daily Inspection Log</h1>
                    <h2 className="text-[10px] font-black uppercase tracking-widest mt-1">PT. Syspex Kemasindo - {equipmentType.replace('_', ' ')}</h2>
                  </div>
                  <div className="text-right text-[10px] font-black uppercase tracking-widest border-2 border-black p-2 bg-slate-100">
                    <p className="text-xl font-black">{equipmentId.toUpperCase()}</p>
                    <p className="mt-1">STATUS: SAFE TO OPERATE</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-[10px] font-black uppercase tracking-widest mb-6 border-b-2 border-black pb-4">
                  <p>Date: {new Date().toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-GB')}</p>
                  <p>Operator: {operatorName || '....................'}</p>
                  <p>Hour Meter: {equipmentType === 'HAND_PALLET' ? 'N/A' : (hourMeter || '....................')}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  {['Visual', 'Fungsional'].map(category => {
                    const items = currentChecklist.filter(item => item.category === category)
                    if(items.length === 0) return null
                    return (
                      <div key={category}>
                        <h3 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black mb-2">{category} Checks</h3>
                        <ul className="text-[10px] font-bold space-y-2">
                          {items.map(item => (
                            <li key={item.id} className="flex justify-between border-b border-dashed border-slate-400 pb-1">
                              <span>{item.label}</span>
                              <span className="font-black uppercase">{checks[item.id]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest border-2 border-black p-3 mb-8 min-h-[60px]">
                  <p className="mb-1 border-b border-black pb-1 inline-block">Remarks:</p>
                  <p className="font-bold normal-case mt-1">{notes || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-12 text-center text-[10px] font-black uppercase tracking-widest">
                  <div>
                    <p className="mb-12">Inspected By (Operator)</p>
                    <div className="border-b-2 border-black w-3/4 mx-auto mb-1"></div>
                    <p>{operatorName || 'Name & Signature'}</p>
                  </div>
                  <div>
                    <p className="mb-12">Acknowledged By (Supervisor)</p>
                    <div className="border-b-2 border-black w-3/4 mx-auto mb-1"></div>
                    <p>Name & Signature</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
