"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function LotoPermitPage() {
  // Data Pekerjaan
  const [equipmentId, setEquipmentId] = useState('CVY-Line-01')
  const [location, setLocation] = useState('Packaging Area')
  const [authorizedPerson, setAuthorizedPerson] = useState('')
  const [lockNumber, setLockNumber] = useState('')
  const [reason, setReason] = useState('Preventive Maintenance Motor Drive')

  // Sumber Energi
  const [energies, setEnergies] = useState({
    electrical: true,
    pneumatic: false,
    hydraulic: false,
    mechanical: false,
    thermal: false,
  })

  // Verifikasi Zero Energy
  const [verified, setVerified] = useState({
    shutdown: false,
    isolated: false,
    locked: false,
    tested: false, // Try-out / Zero Energy verified
  })

  const toggleEnergy = (key: keyof typeof energies) => {
    setEnergies(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleVerification = (key: keyof typeof verified) => {
    setVerified(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isFormComplete = authorizedPerson !== '' && lockNumber !== '' && verified.shutdown && verified.isolated && verified.locked && verified.tested

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Maintenance & Machinery</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">LOTO Permit & Isolation Tag</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Formulir Lockout/Tagout untuk servis mesin dan cetak Danger Tag.</p>
          </div>
          <button 
            onClick={() => window.print()} 
            disabled={!isFormComplete}
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 ${isFormComplete ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK PERMIT & TAG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Input Interaktif - Sembunyikan saat cetak */}
        <div className="lg:col-span-8 space-y-6 print:hidden">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-4">
            <h2 className="col-span-2 text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3 mb-1">Informasi Mesin & Personel</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID Mesin / Peralatan</label>
              <input type="text" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi Mesin</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Authorized Person (Nama Teknisi)</label>
              <input type="text" value={authorizedPerson} onChange={(e) => setAuthorizedPerson(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Nama teknisi pemegang kunci..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nomor Gembok (Padlock ID)</label>
              <input type="text" value={lockNumber} onChange={(e) => setLockNumber(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Contoh: L-012" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alasan Isolasi / Pekerjaan</label>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Identifikasi Sumber Energi</h2>
            <p className="text-xs text-slate-500 mb-3">Pilih semua jenis energi yang terhubung ke mesin ini dan harus diisolasi:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'electrical', label: '⚡ Listrik (Electrical)' },
                { key: 'pneumatic', label: '💨 Pneumatik (Angin)' },
                { key: 'hydraulic', label: '🗜️ Hidrolik (Cairan)' },
                { key: 'mechanical', label: '⚙️ Mekanis (Pegas/Gravitasi)' },
                { key: 'thermal', label: '🔥 Termal (Panas/Uap)' },
              ].map(energy => (
                <button
                  key={energy.key}
                  onClick={() => toggleEnergy(energy.key as keyof typeof energies)}
                  className={`p-3 border rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${energies[energy.key as keyof typeof energies] ? 'bg-red-50 border-red-300 text-red-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  {energy.label}
                  {energies[energy.key as keyof typeof energies] && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm text-white space-y-4">
            <h2 className="text-sm font-black uppercase border-b border-slate-700 pb-3">Langkah Verifikasi (Zero Energy State)</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={verified.shutdown} onChange={() => toggleVerification('shutdown')} className="mt-1 w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">1. Shutdown Mesin</p>
                  <p className="text-xs text-slate-400">Mesin telah dimatikan sesuai prosedur standar penghentian alat.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={verified.isolated} onChange={() => toggleVerification('isolated')} className="mt-1 w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">2. Isolasi Sumber Energi</p>
                  <p className="text-xs text-slate-400">Semua sumber energi utama (breaker listrik, valve angin/cairan) telah dimatikan/diputus.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={verified.locked} onChange={() => toggleVerification('locked')} className="mt-1 w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">3. Pasang Gembok & Tag (LOTO)</p>
                  <p className="text-xs text-slate-400">Padlock dan Danger Tag telah terpasang pada titik isolasi secara aman.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={verified.tested} onChange={() => toggleVerification('tested')} className="mt-1 w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-red-400 group-hover:text-red-300 transition">4. Verifikasi (Try-Out) - KRITIS!</p>
                  <p className="text-xs text-slate-400">Telah dicoba menekan tombol START mesin. Mesin TIDAK menyala (Zero Energy State).</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Bantuan / Status */}
        <div className="lg:col-span-4 print:hidden space-y-6">
          <div className={`p-6 rounded-2xl border-2 shadow-sm text-center transition-colors duration-500 ${isFormComplete ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isFormComplete ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className={`text-lg font-black uppercase tracking-widest ${isFormComplete ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isFormComplete ? 'ISOLASI AMAN' : 'LOTO BELUM LENGKAP'}
            </h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {isFormComplete ? 'Semua tahapan LOTO terverifikasi. Anda siap mencetak Tag & Permit.' : 'Mohon isi nama, nomor gembok, dan centang ke-4 langkah verifikasi Zero Energy.'}
            </p>
          </div>
        </div>

        {/* DOKUMEN CETAK UTAMA (Hanya tampil saat window.print()) */}
        <div className="hidden print:flex print:flex-row print:gap-8 w-full">
          
          {/* BAGIAN 1: LOTO TAG (DANGER TAG) */}
          <div className="w-[300px] border-[6px] border-red-600 flex flex-col h-[600px] shrink-0 bg-white relative overflow-hidden">
            {/* Striped Border Effect (Top/Bottom) */}
            <div className="h-6 w-full bg-[repeating-linear-gradient(45deg,#dc2626,#dc2626_10px,#ffffff_10px,#ffffff_20px)] border-b-4 border-black"></div>
            
            <div className="bg-red-600 text-white text-center py-6 border-b-4 border-black">
              {/* Hole punch simulation */}
              <div className="w-4 h-4 bg-white rounded-full mx-auto mb-4 border-2 border-black"></div>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-1">DANGER</h1>
            </div>
            
            <div className="text-center p-4 bg-black text-white border-b-4 border-red-600">
              <h2 className="text-2xl font-black uppercase tracking-widest">DO NOT<br/>OPERATE</h2>
            </div>
            
            <div className="flex-1 p-4 flex flex-col text-black">
              <p className="text-xs font-black uppercase text-center mb-6">This lock/tag may only be removed by:</p>
              
              <div className="space-y-4 text-xs font-bold">
                <div>
                  <p className="uppercase text-[9px] text-gray-500">Name:</p>
                  <p className="text-lg uppercase border-b-2 border-black">{authorizedPerson}</p>
                </div>
                <div>
                  <p className="uppercase text-[9px] text-gray-500">Lock No:</p>
                  <p className="text-lg uppercase border-b-2 border-black">{lockNumber}</p>
                </div>
                <div>
                  <p className="uppercase text-[9px] text-gray-500">Date:</p>
                  <p className="text-lg uppercase border-b-2 border-black">{new Date().toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <p className="uppercase text-[9px] text-gray-500">Reason:</p>
                  <p className="text-sm uppercase border-b-2 border-black h-12 pt-1">{reason}</p>
                </div>
              </div>

              <div className="mt-auto text-center">
                <p className="text-[10px] font-black uppercase border-t-2 border-black pt-2">Syspex HSE System</p>
              </div>
            </div>

            <div className="h-6 w-full bg-[repeating-linear-gradient(-45deg,#dc2626,#dc2626_10px,#ffffff_10px,#ffffff_20px)] border-t-4 border-black"></div>
          </div>

          {/* BAGIAN 2: LEMBAR LOTO PERMIT (A4) */}
          <div className="flex-1 border-2 border-black p-8 relative h-[600px] flex flex-col text-black">
            
            <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Energy Isolation Permit</h1>
                <h2 className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">LOTO Certificate - PT. Syspex Kemasindo</h2>
              </div>
              <div className="text-right border border-black p-2 bg-gray-100">
                <p className="text-[10px] font-bold uppercase">Permit No.</p>
                <p className="text-xl font-black">LTO-{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-bold">
              <div className="border border-black p-3 space-y-2">
                <p><span className="uppercase text-gray-600">Equipment:</span> {equipmentId}</p>
                <p><span className="uppercase text-gray-600">Location:</span> {location}</p>
                <p><span className="uppercase text-gray-600">Work Desc:</span> {reason}</p>
              </div>
              <div className="border border-black p-3 space-y-2 bg-gray-50">
                <p className="uppercase text-gray-600 border-b border-gray-300 pb-1 mb-1">Energy Sources Isolated:</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(energies).map(([key, isChecked]) => isChecked && (
                    <span key={key} className="uppercase">• {key}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-black uppercase border-b-2 border-black mb-3 pb-1">Zero Energy Verification Check</h3>
              <ul className="text-xs font-bold space-y-3">
                <li className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>1. Machine Shutdown Completed</span> <span>✅ VERIFIED</span></li>
                <li className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>2. All Energy Sources Isolated/Disconnected</span> <span>✅ VERIFIED</span></li>
                <li className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>3. Personal Lock & Danger Tag Applied (Lock #{lockNumber})</span> <span>✅ VERIFIED</span></li>
                <li className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>4. TRY-OUT: Start button pressed, machine did not start.</span> <span className="bg-black text-white px-2 rounded">✅ ZERO ENERGY</span></li>
              </ul>
            </div>

            {/* Area Tanda Tangan */}
            <div className="mt-auto grid grid-cols-2 gap-12 text-center text-xs font-bold">
              <div>
                <p className="uppercase mb-16">Authorized Person (Technician)</p>
                <div className="border-b-2 border-black w-full mb-2"></div>
                <p className="uppercase text-lg">{authorizedPerson}</p>
                <p className="text-[10px] text-gray-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
              </div>
              <div>
                <p className="uppercase mb-16">Verified By (HSE / Supervisor)</p>
                <div className="border-b-2 border-black w-full mb-2"></div>
                <p className="uppercase text-lg text-gray-400">Signature</p>
                <p className="text-[10px] text-gray-500">Date: ........................</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
