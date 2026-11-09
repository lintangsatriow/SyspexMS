"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'

type ScaffoldType = 'FRAME' | 'TUBULAR'
type TagStatus = 'GREEN' | 'RED' | 'YELLOW'
type LoadCapacity = 'Light (75 kg/m²)' | 'Medium (150 kg/m²)' | 'Heavy (200 kg/m²)'

export default function ScaffoldingPage() {
  // Parameter Dimensi & Spesifikasi
  const [scaffoldType, setScaffoldType] = useState<ScaffoldType>('FRAME')
  const [length, setLength] = useState<number>(10) // meter
  const [width, setWidth] = useState<number>(1.2) // meter (Standar 1 bay)
  const [height, setHeight] = useState<number>(5) // meter
  const [loadCapacity, setLoadCapacity] = useState<LoadCapacity>('Medium (150 kg/m²)')
  
  // Data Inspeksi (Scafftag)
  const [tagStatus, setTagStatus] = useState<TagStatus>('RED')
  const [inspectorName, setInspectorName] = useState('')
  const [buildDate, setBuildDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('Area Instalasi ASRS - Line 1')

  // Kalkulasi Bill of Quantities (BoQ)
  const boq = useMemo(() => {
    // Standar dimensi Main Frame T-170: Tinggi 1.7m, Panjang Brace 1.8m
    const bayLength = 1.8 
    const tierHeight = 1.7 

    const bays = Math.ceil(length / bayLength)
    const tiers = Math.ceil(height / tierHeight)

    if (scaffoldType === 'FRAME') {
      const frames = (bays + 1) * tiers * 2
      const crossBraces = bays * tiers * 2
      const jointPins = (bays + 1) * (tiers > 0 ? tiers - 1 : 0) * 4
      const jackBases = (bays + 1) * 2
      const uHeads = (bays + 1) * 2
      const catwalks = bays * 2 // Asumsi 2 papan per bay di level kerja teratas
      const stairs = tiers

      return [
        { item: 'Main Frame T-170', qty: frames, unit: 'Pcs' },
        { item: 'Cross Brace 220', qty: crossBraces, unit: 'Pcs' },
        { item: 'Joint Pin', qty: jointPins, unit: 'Pcs' },
        { item: 'Jack Base (60cm)', qty: jackBases, unit: 'Pcs' },
        { item: 'U-Head Jack', qty: uHeads, unit: 'Pcs' },
        { item: 'Catwalk / Steel Plank', qty: catwalks, unit: 'Pcs' },
        { item: 'Aluminum Stairs', qty: stairs, unit: 'Set' },
        { item: 'Safety Net', qty: Math.ceil((length * height) / 10), unit: 'Roll' }
      ]
    } else {
      // Perkiraan kasar untuk Tubular (Pipa BS1139 & Clamp)
      const verticalPipes = (bays + 1) * 2
      const horizontalLedgers = (bays + 1) * tiers * 2
      const horizontalTransoms = (bays + 1) * tiers * 2
      const totalPipes = verticalPipes + horizontalLedgers + horizontalTransoms
      const swivelClamps = totalPipes * 2
      const fixedClamps = totalPipes * 3
      
      return [
        { item: 'Galvanized Pipe (6m)', qty: Math.ceil(totalPipes / 2), unit: 'Btg' },
        { item: 'Galvanized Pipe (3m)', qty: Math.ceil(totalPipes / 2), unit: 'Btg' },
        { item: 'Swivel Clamp', qty: swivelClamps, unit: 'Pcs' },
        { item: 'Fixed Clamp (Right Angle)', qty: fixedClamps, unit: 'Pcs' },
        { item: 'Base Plate', qty: (bays + 1) * 2, unit: 'Pcs' },
        { item: 'Steel Plank', qty: bays * 2, unit: 'Pcs' },
      ]
    }
  }, [length, height, width, scaffoldType])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Structure & Access</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Scaffolding BoQ & Scafftag</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Estimasi material perancah ASRS dan penerbitan Tag Inspeksi K3.</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK MANIFEST & TAG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Input Dimensi & Inspeksi (Web View) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Dimensi & Tipe Struktur</h2>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Scaffolding</label>
              <select value={scaffoldType} onChange={(e) => setScaffoldType(e.target.value as ScaffoldType)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                <option value="FRAME">Main Frame (T-170 Standar)</option>
                <option value="TUBULAR">Tubular (Pipa BS1139 & Clamp)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Panjang (m)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tinggi (m)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lebar (m)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kapasitas Beban Kerja (SWL)</label>
              <select value={loadCapacity} onChange={(e) => setLoadCapacity(e.target.value as LoadCapacity)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                <option value="Light (75 kg/m²)">Light Duty (75 kg/m²) - Inspeksi Visual</option>
                <option value="Medium (150 kg/m²)">Medium Duty (150 kg/m²) - Teknisi Mesin</option>
                <option value="Heavy (200 kg/m²)">Heavy Duty (200 kg/m²) - Material Berat</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Status Inspeksi (Scafftag)</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setTagStatus('RED')} className={`p-3 rounded-lg border-2 text-xs font-black uppercase tracking-wider transition ${tagStatus === 'RED' ? 'bg-red-600 text-white border-red-700' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}>
                UNSAFE (MERAH)
              </button>
              <button onClick={() => setTagStatus('GREEN')} className={`p-3 rounded-lg border-2 text-xs font-black uppercase tracking-wider transition ${tagStatus === 'GREEN' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
                SAFE (HIJAU)
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inspektur Scaffolder</label>
              <input type="text" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} placeholder="Nama Supervisor..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal Didirikan</label>
                <input type="date" value={buildDate} onChange={(e) => setBuildDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Area / Lokasi</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Hasil BoQ (Web View) */}
        <div className="lg:col-span-7 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-900 uppercase">Estimasi Material (BoQ)</h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200 px-2 py-1 rounded">Volume: {(length * width * height).toFixed(1)} m³</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Komponen Struktur</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Kuantitas</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Satuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boq.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-xs font-bold text-slate-800">{item.item}</td>
                      <td className="p-4 text-sm font-black text-slate-900 text-right">{item.qty}</td>
                      <td className="p-4 text-xs font-medium text-slate-500">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-amber-50 border-t border-amber-100 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Note: Estimasi ini menambah waste/buffer sekitar 5%. Pastikan ketersediaan di gudang.
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* DOKUMEN CETAK UTAMA (Hanya tampil saat window.print) */}
        {/* ================================================== */}
        <div className="hidden print:flex print:flex-row print:justify-between w-full text-black gap-8">
          
          {/* BAGIAN 1: SCAFFTAG (Dipasang di akses perancah) */}
          <div className={`w-[250px] shrink-0 border-4 border-black h-[550px] flex flex-col relative overflow-hidden ${tagStatus === 'GREEN' ? 'bg-white' : 'bg-white'}`}>
            
            {/* Header Tag */}
            <div className={`text-center py-4 border-b-4 border-black ${tagStatus === 'GREEN' ? 'bg-emerald-500' : 'bg-red-600'}`}>
              {/* Lubang gantung simulasi */}
              <div className="w-5 h-5 bg-white rounded-full mx-auto mb-3 border-2 border-black"></div>
              
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">
                {tagStatus === 'GREEN' ? 'SAFE' : 'DANGER'}
              </h1>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                {tagStatus === 'GREEN' ? 'FOR USE' : 'DO NOT USE'}
              </h2>
            </div>

            {/* Body Tag - Kondisi AMAN */}
            {tagStatus === 'GREEN' ? (
              <div className="flex-1 p-4 flex flex-col text-xs font-bold">
                <p className="text-center text-[10px] uppercase mb-4 border-b-2 border-black pb-2">This scaffold is safe for use</p>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Location:</p>
                    <p className="border-b-2 border-black pb-1 uppercase">{location}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Built Date:</p>
                    <p className="border-b-2 border-black pb-1">{buildDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Duty / SWL:</p>
                    <p className="border-b-2 border-black pb-1 uppercase">{loadCapacity}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Inspected By:</p>
                    <p className="border-b-2 border-black h-8 pt-2 uppercase">{inspectorName}</p>
                  </div>
                </div>

                <div className="border-2 border-black p-2 text-center mt-auto">
                  <p className="text-[11px] font-black uppercase">Syspex Kemasindo</p>
                  <p className="text-[8px] uppercase">HSE Management System</p>
                </div>
              </div>
            ) : (
              /* Body Tag - Kondisi BAHAYA / BELUM SELESAI */
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-black mb-4">!</span>
                <p className="text-lg font-black uppercase tracking-widest border-b-2 border-t-2 border-black py-2 mb-4">
                  SCAFFOLD INCOMPLETE<br/>OR DEFECTIVE
                </p>
                <p className="text-xs font-bold uppercase">Only Authorized Scaffolders May Alter or Access</p>
                <div className="mt-auto w-full text-left text-xs font-bold space-y-4">
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Location:</p>
                    <p className="border-b-2 border-black pb-1 uppercase">{location}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-gray-500">Tagged By:</p>
                    <p className="border-b-2 border-black h-6 uppercase">{inspectorName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BAGIAN 2: BOQ MANIFEST (Diserahkan ke Gudang Logistik) */}
          <div className="flex-1 border-2 border-black p-6 flex flex-col h-[550px]">
            <div className="border-b-2 border-black pb-4 mb-4">
              <h1 className="text-2xl font-black uppercase tracking-widest">Scaffolding Material Manifest</h1>
              <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - ASRS Installation Ops</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold mb-4">
              <div>
                <p><span className="text-gray-500">Structure Type:</span> {scaffoldType}</p>
                <p><span className="text-gray-500">Dimension:</span> {length}m (L) x {width}m (W) x {height}m (H)</p>
              </div>
              <div>
                <p><span className="text-gray-500">Location:</span> {location}</p>
                <p><span className="text-gray-500">Load Capacity:</span> {loadCapacity}</p>
              </div>
            </div>

            <table className="w-full border-collapse border-2 border-black text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-2 border-black p-2 text-left w-[60%]">Description</th>
                  <th className="border-2 border-black p-2 text-center w-[20%]">Quantity</th>
                  <th className="border-2 border-black p-2 text-center w-[20%]">Unit</th>
                </tr>
              </thead>
              <tbody>
                {boq.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-2 border-black p-2 font-bold">{item.item}</td>
                    <td className="border-2 border-black p-2 text-center font-black">{item.qty}</td>
                    <td className="border-2 border-black p-2 text-center">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-auto grid grid-cols-2 gap-8 text-center text-xs font-bold pt-4">
              <div>
                <p className="uppercase mb-12 text-gray-500">Requested By (Supervisor)</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p>{inspectorName || 'Name & Sign'}</p>
              </div>
              <div>
                <p className="uppercase mb-12 text-gray-500">Issued By (Warehouse)</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p>Logistics Admin</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
