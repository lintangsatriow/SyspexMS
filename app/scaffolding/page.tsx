"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'

type ScaffoldType = 'FRAME' | 'TUBULAR'
type TagStatus = 'GREEN' | 'RED'
type LoadCapacity = 'Light (75 kg/m²)' | 'Medium (150 kg/m²)' | 'Heavy (200 kg/m²)'

export default function ScaffoldingPage() {
  const [scaffoldType, setScaffoldType] = useState<ScaffoldType>('FRAME')
  const [length, setLength] = useState<number>(10)
  const [width, setWidth] = useState<number>(1.2)
  const [height, setHeight] = useState<number>(5)
  const [loadCapacity, setLoadCapacity] = useState<LoadCapacity>('Medium (150 kg/m²)')
  
  const [tagStatus, setTagStatus] = useState<TagStatus>('RED')
  const [inspectorName, setInspectorName] = useState('')
  const [buildDate, setBuildDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('Area Instalasi ASRS - Line 1')

  // Konfirmasi Safety & Kesehatan (Wajib sebelum cetak)
  const [safetyChecked, setSafetyChecked] = useState(false)
  const [healthChecked, setHealthChecked] = useState(false)

  // Kalkulasi Komponen Desain
  const components = useMemo(() => {
    const bayLength = 1.8 
    const tierHeight = 1.7 

    const bays = Math.ceil(length / bayLength)
    const tiers = Math.ceil(height / tierHeight)

    if (scaffoldType === 'FRAME') {
      return [
        { item: 'Main Frame T-170', qty: (bays + 1) * tiers * 2, unit: 'Pcs' },
        { item: 'Cross Brace 220', qty: bays * tiers * 2, unit: 'Pcs' },
        { item: 'Joint Pin', qty: (bays + 1) * (tiers > 0 ? tiers - 1 : 0) * 4, unit: 'Pcs' },
        { item: 'Jack Base / Adjustable Base', qty: (bays + 1) * 2, unit: 'Pcs' },
        { item: 'U-Head Jack', qty: (bays + 1) * 2, unit: 'Pcs' },
        { item: 'Catwalk / Steel Plank (Platform)', qty: bays * 2, unit: 'Pcs' },
        { item: 'Aluminum Stairs / Tangga', qty: tiers, unit: 'Set' },
        { item: 'Safety Net / Jaring', qty: Math.ceil((length * height) / 10), unit: 'Roll' }
      ]
    } else {
      const verticalPipes = (bays + 1) * 2
      const horizontalLedgers = (bays + 1) * tiers * 2
      const totalPipes = verticalPipes + horizontalLedgers * 2
      return [
        { item: 'Galvanized Pipe (6m) - Vertikal', qty: Math.ceil(totalPipes / 2), unit: 'Btg' },
        { item: 'Galvanized Pipe (3m) - Horizontal', qty: Math.ceil(totalPipes / 2), unit: 'Btg' },
        { item: 'Swivel Clamp', qty: totalPipes * 2, unit: 'Pcs' },
        { item: 'Fixed Clamp (Right Angle)', qty: totalPipes * 3, unit: 'Pcs' },
        { item: 'Base Plate', qty: (bays + 1) * 2, unit: 'Pcs' },
        { item: 'Steel Plank / Papan Kerja', qty: bays * 2, unit: 'Pcs' },
      ]
    }
  }, [length, height, width, scaffoldType])

  const isFormComplete = inspectorName !== '' && safetyChecked && healthChecked

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Structure & Access</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Scaffold Design & Erection Plan</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Panduan perakitan perancah, Scafftag, dan izin kerja di ketinggian (WAH).</p>
          </div>
          <button 
            onClick={() => window.print()} 
            disabled={!isFormComplete}
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 ${isFormComplete ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK ERECTION PLAN & TAG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Input Desain & Inspeksi */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">1. Desain Struktur Racking / ASRS</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Scaffolding</label>
                <select value={scaffoldType} onChange={(e) => setScaffoldType(e.target.value as ScaffoldType)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                  <option value="FRAME">Main Frame (Standar Racking)</option>
                  <option value="TUBULAR">Tubular (Pipa BS1139 & Clamp)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Panjang (m)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tinggi Target (m)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kapasitas Beban Kerja (SWL)</label>
                <select value={loadCapacity} onChange={(e) => setLoadCapacity(e.target.value as LoadCapacity)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                  <option value="Light (75 kg/m²)">Light Duty - Hanya Orang & Alat Ringan</option>
                  <option value="Medium (150 kg/m²)">Medium Duty - Orang & Komponen Mesin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">2. Status & Scafftag</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setTagStatus('RED')} className={`p-3 rounded-lg border-2 text-xs font-black uppercase tracking-wider transition ${tagStatus === 'RED' ? 'bg-red-600 text-white border-red-700' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}>
                UNSAFE (MERAH)
              </button>
              <button onClick={() => setTagStatus('GREEN')} className={`p-3 rounded-lg border-2 text-xs font-black uppercase tracking-wider transition ${tagStatus === 'GREEN' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
                SAFE (HIJAU)
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Inspector / Supervisor</label>
              <input type="text" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} placeholder="Nama yang bertanggung jawab..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tgl Perakitan</label>
                <input type="date" value={buildDate} onChange={(e) => setBuildDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Area Instalasi</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Panduan Perakitan & Warning K3 */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          
          {/* Komponen Desain */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-900 uppercase">3. Total Komponen Perakitan</h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200 px-2 py-1 rounded">Dimensi: L:{length}m x H:{height}m</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-100">
                  {components.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-2 text-xs font-bold text-slate-700">{item.item}</td>
                      <td className="py-2 text-sm font-black text-slate-900 text-right">{item.qty} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WARNING K3 & KESEHATAN (Sangat Tegas) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden p-5 text-white">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-4">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-red-400">Mandatory Rules: Working at Height</h2>
                <p className="text-[11px] text-slate-400">Pekerjaan di atas 1.8 meter memiliki risiko jatuh fatal.</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* APD Check */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Peralatan Pelindung Diri (APD) Wajib:</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-2">✓ Full Body Harness (Double Lanyard)</div>
                  <div className="flex items-center gap-2">✓ Helm Safety dengan Chinstrap</div>
                  <div className="flex items-center gap-2">✓ Sepatu Safety (Anti-Slip)</div>
                  <div className="flex items-center gap-2">✓ Sarung Tangan Kerja</div>
                </div>
              </div>

              {/* Health Check */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3">Deklarasi Fit to Work (Kesehatan Kesehatan):</p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={safetyChecked} onChange={(e) => setSafetyChecked(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-500 rounded" />
                    <span className="text-xs font-medium group-hover:text-emerald-400 transition">Teknisi telah dicek tekanan darahnya (Tensi Normal) dan menyatakan diri TIDAK memiliki riwayat Acrophobia (takut ketinggian) atau Vertigo.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={healthChecked} onChange={(e) => setHealthChecked(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-500 rounded" />
                    <span className="text-xs font-medium group-hover:text-emerald-400 transition">Teknisi sedang dalam kondisi prima (unfit / mengantuk / dalam pengaruh obat dilarang keras memanjat perancah).</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================== */}
        {/* DOKUMEN CETAK UTAMA (Panduan Teknisi Lapangan) */}
        {/* ================================================== */}
        <div className="hidden print:flex print:flex-row print:justify-between w-full text-black gap-8">
          
          {/* SISI KIRI: SCAFFTAG (Potong dan Gantung di Tangga Naik) */}
          <div className={`w-[250px] shrink-0 border-4 border-black h-[550px] flex flex-col relative overflow-hidden bg-white`}>
            
            <div className={`text-center py-4 border-b-4 border-black ${tagStatus === 'GREEN' ? 'bg-emerald-500' : 'bg-red-600'} text-white !print:text-black`}>
              <div className="w-5 h-5 bg-white rounded-full mx-auto mb-3 border-2 border-black"></div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">
                {tagStatus === 'GREEN' ? 'SAFE' : 'DANGER'}
              </h1>
              <h2 className="text-sm font-bold uppercase tracking-widest">
                {tagStatus === 'GREEN' ? 'FOR USE' : 'DO NOT USE'}
              </h2>
            </div>

            {tagStatus === 'GREEN' ? (
              <div className="flex-1 p-4 flex flex-col text-xs font-bold">
                <p className="text-center text-[10px] uppercase mb-4 border-b-2 border-black pb-2">This scaffold is safe for use</p>
                <div className="space-y-4 flex-1">
                  <div><p className="text-[9px] uppercase text-gray-500">Location:</p><p className="border-b-2 border-black pb-1 uppercase">{location}</p></div>
                  <div><p className="text-[9px] uppercase text-gray-500">Built Date:</p><p className="border-b-2 border-black pb-1">{buildDate}</p></div>
                  <div><p className="text-[9px] uppercase text-gray-500">Duty / SWL:</p><p className="border-b-2 border-black pb-1 uppercase">{loadCapacity}</p></div>
                  <div><p className="text-[9px] uppercase text-gray-500">Inspected By:</p><p className="border-b-2 border-black h-8 pt-2 uppercase">{inspectorName}</p></div>
                </div>
                <div className="border-2 border-black p-2 text-center mt-auto">
                  <p className="text-[11px] font-black uppercase">Syspex Kemasindo</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-black mb-4">!</span>
                <p className="text-lg font-black uppercase tracking-widest border-b-2 border-t-2 border-black py-2 mb-4">
                  SCAFFOLD INCOMPLETE<br/>OR DEFECTIVE
                </p>
                <div className="mt-auto w-full text-left text-xs font-bold space-y-4">
                  <div><p className="text-[9px] uppercase text-gray-500">Location:</p><p className="border-b-2 border-black pb-1 uppercase">{location}</p></div>
                  <div><p className="text-[9px] uppercase text-gray-500">Tagged By:</p><p className="border-b-2 border-black h-6 uppercase">{inspectorName}</p></div>
                </div>
              </div>
            )}
          </div>

          {/* SISI KANAN: ERECTION PLAN & SAFETY CHECKLIST (Panduan Teknisi Lapangan) */}
          <div className="flex-1 border-2 border-black p-6 flex flex-col h-[550px]">
            <div className="border-b-2 border-black pb-4 mb-4">
              <h1 className="text-2xl font-black uppercase tracking-widest">Erection Plan & Safety Checklist</h1>
              <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - ASRS/Racking Installation</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold mb-4 bg-gray-100 p-2 border border-black">
              <div>
                <p><span className="text-gray-600 uppercase">Structure Type:</span> {scaffoldType}</p>
                <p><span className="text-gray-600 uppercase">Dimension target:</span> {length}m (L) x {width}m (W) x {height}m (H)</p>
              </div>
              <div>
                <p><span className="text-gray-600 uppercase">Location:</span> {location}</p>
              </div>
            </div>

            <h3 className="text-xs font-black uppercase border-b-2 border-black mb-2 pb-1">Assembly Components Required</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
              {components.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[10px] font-bold border-b border-dashed border-gray-400 pb-1">
                  <span>{item.item}</span>
                  <span className="font-black">{item.qty} {item.unit}</span>
                </div>
              ))}
            </div>

            {/* Bagian Peringatan Safety (Dicetak Besar) */}
            <h3 className="text-xs font-black uppercase border-b-2 border-black mb-2 pb-1 mt-auto">Working at Height (WAH) Clearance</h3>
            
            <div className="grid grid-cols-2 gap-4 text-[10px] mb-4">
              <div className="border border-black p-2">
                <p className="font-black uppercase mb-1 underline">Mandatory PPE:</p>
                <ul className="list-disc pl-3 space-y-0.5">
                  <li>Full Body Harness + Double Lanyard</li>
                  <li>Safety Helmet with Chinstrap (Tali Dagu)</li>
                  <li>Safety Shoes (Anti-Slip) & Gloves</li>
                  <li className="font-black">Lanyard MUST BE HOOKED to strong structure above shoulder!</li>
                </ul>
              </div>
              <div className="border border-black p-2 bg-gray-100">
                <p className="font-black uppercase mb-1 underline">Health / Fit to Work:</p>
                <ul className="list-disc pl-3 space-y-0.5 font-bold">
                  <li>Normal Blood Pressure (Tensi Normal).</li>
                  <li>No Acrophobia (Takut ketinggian).</li>
                  <li>No Vertigo / Dizziness (Sakit kepala).</li>
                  <li className="font-black text-red-600 !print:text-black uppercase">Unfit workers are strictly prohibited from climbing!</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-[10px] font-bold border-t-2 border-black pt-4">
              <div>
                <p className="uppercase mb-8">Lead Technician / Scaffolder</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p>Sign & Name</p>
              </div>
              <div>
                <p className="uppercase mb-8">Cleared By (HSE/Supervisor)</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p className="uppercase">{inspectorName}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
