"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'

type CheckStatus = 'PASS' | 'FAIL' | 'NA' | null

interface InspectionItem {
  id: string
  category: 'Visual' | 'Fungsional'
  label: string
  isCritical: boolean
  status: CheckStatus
}

export default function ForkliftInspectionPage() {
  // Metadata Inspeksi
  const [operatorName, setOperatorName] = useState('')
  const [forkliftId, setForkliftId] = useState('FL-01')
  const [hourMeter, setHourMeter] = useState('')
  
  // Daftar Checklist Standar K3 MHE
  const [checklist, setChecklist] = useState<InspectionItem[]>([
    { id: 'v1', category: 'Visual', label: 'Kondisi Garpu (Forks) & Pin', isCritical: true, status: null },
    { id: 'v2', category: 'Visual', label: 'Tiang (Mast) & Rantai Pengangkat', isCritical: true, status: null },
    { id: 'v3', category: 'Visual', label: 'Roda & Tekanan Ban (Tires)', isCritical: false, status: null },
    { id: 'v4', category: 'Visual', label: 'Kebocoran Oli / Fluida (Bawah Mesin)', isCritical: true, status: null },
    { id: 'v5', category: 'Visual', label: 'Kondisi Body & Pelindung Atap (FOHG)', isCritical: false, status: null },
    { id: 'f1', category: 'Fungsional', label: 'Fungsi Rem Kaki & Rem Tangan (Brakes)', isCritical: true, status: null },
    { id: 'f2', category: 'Fungsional', label: 'Sistem Kemudi (Steering)', isCritical: true, status: null },
    { id: 'f3', category: 'Fungsional', label: 'Tuas Hidrolik (Naik/Turun/Tilt)', isCritical: true, status: null },
    { id: 'f4', category: 'Fungsional', label: 'Klakson & Alarm Mundur', isCritical: true, status: null },
    { id: 'f5', category: 'Fungsional', label: 'Lampu Rotari & Lampu Kerja', isCritical: false, status: null },
  ])

  const [notes, setNotes] = useState('')

  const handleCheck = (id: string, status: CheckStatus) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, status } : item))
  }

  // Evaluasi Keselamatan
  const evaluation = useMemo(() => {
    const isComplete = checklist.every(item => item.status !== null)
    const failedItems = checklist.filter(item => item.status === 'FAIL')
    const hasCriticalFail = failedItems.some(item => item.isCritical)
    
    return {
      isComplete,
      failedItems,
      hasCriticalFail,
      isSafeToOperate: isComplete && !hasCriticalFail
    }
  }, [checklist])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Peralatan Berat</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">MHE Pre-Operation Checklist</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Inspeksi harian forklift dengan sistem deteksi item kritis & Auto-Tagging.</p>
          </div>
          <button 
            onClick={() => window.print()} 
            disabled={!evaluation.isComplete}
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 ${evaluation.isComplete ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK HASIL / TAG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Input Interaktif - Sembunyikan saat cetak */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID Forklift</label>
              <select value={forkliftId} onChange={(e) => setForkliftId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                <option value="FL-01">FL-01 (Toyota 3.0T)</option>
                <option value="FL-02">FL-02 (Komatsu 2.5T)</option>
                <option value="RCH-01">RCH-01 (Reach Truck)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Operator</label>
              <input type="text" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Sesuai SIO..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hour Meter</label>
              <input type="number" value={hourMeter} onChange={(e) => setHourMeter(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Jam awal..." />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 uppercase">Item Inspeksi</h2>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                Tanda ⚠️ adalah item kritis (Keselamatan)
              </span>
            </div>

            <div className="space-y-4">
              {['Visual', 'Fungsional'].map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="text-[11px] font-black text-slate-700 uppercase bg-slate-50 p-2 rounded">{category} Check</h3>
                  {checklist.filter(item => item.category === category).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded border-b border-slate-100 last:border-0 transition">
                      <div className="flex items-center gap-2">
                        {item.isCritical && <span className="text-amber-500 text-xs" title="Item Kritis">⚠️</span>}
                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleCheck(item.id, 'PASS')} className={`px-3 py-1 text-[10px] font-black rounded border transition ${item.status === 'PASS' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-500 hover:bg-emerald-50'}`}>PASS</button>
                        <button onClick={() => handleCheck(item.id, 'FAIL')} className={`px-3 py-1 text-[10px] font-black rounded border transition ${item.status === 'FAIL' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-slate-500 hover:bg-red-50'}`}>FAIL</button>
                        <button onClick={() => handleCheck(item.id, 'NA')} className={`px-3 py-1 text-[10px] font-black rounded border transition ${item.status === 'NA' ? 'bg-slate-500 text-white border-slate-600' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>N/A</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Tambahan / Detail Kerusakan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium resize-none" placeholder="Isi jika ada temuan (FAIL)..." />
            </div>
          </div>
        </div>

        {/* Panel Output & Tampilan Cetak (Print View) */}
        <div className="lg:col-span-5 print:col-span-12 w-full">
          
          {/* Status Monitor (Web View) - Sembunyikan saat cetak */}
          <div className="print:hidden space-y-4 sticky top-6">
            <div className={`p-6 rounded-2xl border-2 shadow-sm text-center ${!evaluation.isComplete ? 'bg-slate-50 border-slate-200' : evaluation.isSafeToOperate ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-500'}`}>
              {!evaluation.isComplete ? (
                <>
                  <div className="text-4xl mb-2">📋</div>
                  <h3 className="text-lg font-black text-slate-700 uppercase">Inspeksi Belum Selesai</h3>
                  <p className="text-xs text-slate-500 mt-1">Selesaikan seluruh checklist untuk melihat hasil.</p>
                </>
              ) : evaluation.isSafeToOperate ? (
                <>
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-black text-emerald-700 uppercase tracking-widest">SAFE TO OPERATE</h3>
                  <p className="text-xs text-emerald-600 mt-1 font-bold">Forklift layak digunakan operasional.</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2 animate-bounce">🚨</div>
                  <h3 className="text-xl font-black text-red-700 uppercase tracking-widest">DO NOT OPERATE</h3>
                  <p className="text-xs text-red-600 mt-2 font-bold bg-red-100 p-2 rounded mx-4">
                    Terdapat temuan kritis pada alat. Segera cetak Tag dan hubungi tim Maintenance.
                  </p>
                </>
              )}
            </div>
            
            {evaluation.failedItems.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-red-200">
                <h4 className="text-xs font-black text-red-700 uppercase mb-2">Ringkasan Kerusakan:</h4>
                <ul className="list-disc pl-4 text-xs text-slate-600 font-medium space-y-1">
                  {evaluation.failedItems.map(item => (
                    <li key={item.id}>{item.label} {item.isCritical && <span className="font-bold text-red-500">(KRITIS)</span>}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* DOKUMEN CETAK UTAMA (Hanya tampil saat window.print()) */}
          <div className="hidden print:block w-full">
            
            {/* Cabang Logika Cetak: Aman vs Rusak */}
            {evaluation.isComplete && !evaluation.isSafeToOperate ? (
              
              /* PRINT LAYOUT: DANGER TAG (Bentuk Vertikal memanjang) */
              <div className="w-[400px] border-4 border-black mx-auto p-0 flex flex-col min-h-[600px] text-center">
                <div className="bg-black text-white py-6 px-4">
                  <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">DANGER</h1>
                  <h2 className="text-2xl font-bold uppercase tracking-widest">Do Not Operate</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-24 h-24 rounded-full border-4 border-black mx-auto flex items-center justify-center mb-6">
                    <span className="text-6xl font-black text-black">!</span>
                  </div>
                  <p className="text-sm font-black uppercase mb-1">Equipment ID:</p>
                  <p className="text-3xl font-black mb-6">{forkliftId}</p>
                  
                  <div className="border-t-2 border-b-2 border-black py-4 mb-6 text-left">
                    <p className="text-xs font-bold uppercase mb-2">Reason / Failed Critical Items:</p>
                    <ul className="list-disc pl-4 text-xs font-bold space-y-1">
                      {evaluation.failedItems.map(item => (
                        <li key={item.id}>{item.label}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-4 flex justify-between text-[10px] font-bold uppercase text-left">
                    <div>
                      <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                      <p>Tagged By: {operatorName || '....................'}</p>
                    </div>
                    <div>
                      <p>Syspex MHE Maintenance</p>
                    </div>
                  </div>
                </div>
              </div>

            ) : (

              /* PRINT LAYOUT: SAFE LOG RECORD (A4 Horizontal/Vertical) */
              <div className="border-2 border-black p-6 w-full max-w-[800px] mx-auto">
                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest">MHE Daily Inspection Log</h1>
                    <h2 className="text-xs font-bold text-gray-600 uppercase mt-1">PT. SYSPEX KEMASINDO</h2>
                  </div>
                  <div className="text-right text-[10px] font-bold uppercase border border-black p-2 bg-gray-100">
                    <p className="text-lg font-black">{forkliftId}</p>
                    <p>Status: SAFE TO OPERATE</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs font-bold mb-6 border-b border-black pb-4">
                  <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                  <p>Operator: {operatorName || '....................'}</p>
                  <p>Hour Meter: {hourMeter || '....................'}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  {['Visual', 'Fungsional'].map(category => (
                    <div key={category}>
                      <h3 className="text-xs font-black uppercase border-b border-black mb-2">{category} Checks</h3>
                      <ul className="text-[10px] space-y-2">
                        {checklist.filter(item => item.category === category).map(item => (
                          <li key={item.id} className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                            <span>{item.label}</span>
                            <span className="font-black">{item.status}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] border border-black p-2 mb-8 min-h-[60px]">
                  <p className="font-bold uppercase mb-1">Remarks:</p>
                  <p>{notes || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-12 text-center text-xs font-bold">
                  <div>
                    <p className="uppercase mb-12">Inspected By (Operator)</p>
                    <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                    <p>{operatorName || 'Name & Signature'}</p>
                  </div>
                  <div>
                    <p className="uppercase mb-12">Acknowledged By (Supervisor)</p>
                    <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
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
