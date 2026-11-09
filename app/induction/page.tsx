"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function SafetyInductionPage() {
  const [visitorName, setVisitorName] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('Meeting / Office')
  const [hostName, setHostName] = useState('')
  
  // Status Video
  const [isVideoWatched, setIsVideoWatched] = useState(false)

  // Persetujuan Golden Rules Universal (Office & Warehouse)
  const [agreements, setAgreements] = useState({
    access: false,
    emergency: false,
    escort: false,
  })

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isFormComplete = visitorName !== '' && company !== '' && hostName !== '' && 
    isVideoWatched && agreements.access && agreements.emergency && agreements.escort

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-[1400px] mx-auto">
      
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Security & Access</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Digital Safety Induction</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Video K3 Interaktif, registrasi tamu terpusat, & penerbitan ID Card akses.</p>
          </div>
          <button 
            onClick={() => window.print()} 
            disabled={!isFormComplete}
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 ${isFormComplete ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK VISITOR PASS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Kiri: Video & Golden Rules - Sembunyikan saat cetak */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          
          {/* Modul Video Induksi */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Video Induksi Syspex (Wajib Tonton)
              </h2>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Durasi: 03:45</span>
            </div>
            
            {/* Placeholder Video Player */}
            <div className="w-full aspect-video bg-black relative flex items-center justify-center border-b border-slate-800 group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <button className="w-16 h-16 bg-white/20 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform group-hover:scale-110">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div>
                  <p className="text-white font-bold tracking-widest uppercase text-sm">Syspex Corporate Safety Video</p>
                  <p className="text-slate-400 text-xs mt-1">[ Ruang Untuk Embed YouTube / File MP4 ]</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-800/50">
              <label className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" checked={isVideoWatched} onChange={(e) => setIsVideoWatched(e.target.checked)} className="w-6 h-6 accent-emerald-500 rounded cursor-pointer" />
                <div>
                  <p className="text-sm font-black text-white group-hover:text-emerald-400 transition uppercase tracking-wide">Saya telah menonton dan memahami materi video</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Saya memahami prosedur evakuasi, titik kumpul, dan bahaya umum di Syspex.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Golden Rules Universal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Syarat & Ketentuan Akses Fasilitas</h2>
            
            <div className="space-y-4">
              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <input type="checkbox" checked={agreements.access} onChange={() => toggleAgreement('access')} className="mt-1 w-5 h-5 accent-slate-900 rounded" />
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition">1. Kepatuhan Area Terbatas (Zoning)</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Saya mengerti bahwa Badge Akses saya menentukan area mana yang boleh saya masuki. Memasuki area Gudang MHE / Produksi tanpa APD dan izin khusus adalah pelanggaran berat.</p>
                </div>
              </label>
              
              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <input type="checkbox" checked={agreements.escort} onChange={() => toggleAgreement('escort')} className="mt-1 w-5 h-5 accent-slate-900 rounded" />
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition">2. Aturan Pendampingan (Escort Rule)</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Sebagai tamu, saya tidak diizinkan berkeliaran sendiri (unattended). Saya harus selalu didampingi oleh Karyawan Syspex (Host) selama berada di dalam fasilitas.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <input type="checkbox" checked={agreements.emergency} onChange={() => toggleAgreement('emergency')} className="mt-1 w-5 h-5 accent-slate-900 rounded" />
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition">3. Kedaruratan & Pelaporan Insiden</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Jika mendengar alarm, saya akan meninggalkan gedung melalui jalur evakuasi menuju Assembly Point. Saya juga wajib melaporkan cedera sekecil apa pun kepada Host saya.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Data Pengunjung & Output - Sembunyikan saat cetak */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-6">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3 mb-1">Data Pengunjung (KTP)</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Sesuai ID/KTP..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Perusahaan / Instansi</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tujuan Area (Zoning)</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                <option value="Meeting / Office">🏢 Zona Biru: Office & Meeting</option>
                <option value="Warehouse / MHE Area">🚜 Zona Kuning: Gudang & MHE (Butuh Rompi)</option>
                <option value="Machine Installation">🛠️ Zona Merah: Servis/Instalasi Mesin (Kontraktor)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Karyawan yang Dituju (Host)</label>
              <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Siapa yang ditemui?" />
            </div>

            <div className={`mt-6 p-4 rounded-xl border-2 text-center transition-all duration-300 ${isFormComplete ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-[11px] font-black uppercase tracking-widest ${isFormComplete ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isFormComplete ? '✓ DATA LENGKAP - SIAP CETAK' : '⚠ TAMPILKAN VIDEO & LENGKAPI DATA'}
              </p>
            </div>
          </div>
        </div>

        {/* DOKUMEN CETAK UTAMA (ID Card CR80 Format) - Hanya tampil saat window.print() */}
        <div className="hidden print:flex w-full justify-center items-center pt-8">
          
          <div className="w-[212px] h-[338px] border-2 border-black rounded-xl flex flex-col bg-white overflow-hidden relative text-black">
            
            <div className={`h-16 pt-3 px-3 text-center flex flex-col items-center justify-center border-b-2 border-black ${purpose.includes('Office') ? 'bg-blue-600 text-white' : purpose.includes('Warehouse') ? 'bg-amber-400 text-black' : 'bg-red-600 text-white'}`}>
              <div className="w-8 h-1.5 bg-black/20 rounded-full mb-1"></div>
              <h1 className="text-sm font-black uppercase tracking-widest leading-none">VISITOR</h1>
              <p className="text-[7px] font-bold uppercase tracking-widest mt-1">Syspex Kemasindo</p>
            </div>

            <div className="flex-1 p-3 flex flex-col items-center text-center">
              <div className="w-full mt-2 mb-4">
                <p className="text-[8px] font-bold uppercase text-gray-500 mb-0.5">Name / Nama:</p>
                <p className="text-sm font-black uppercase leading-tight">{visitorName || 'GUEST NAME'}</p>
              </div>

              <div className="w-full mb-4">
                <p className="text-[8px] font-bold uppercase text-gray-500 mb-0.5">Company / Asal:</p>
                <p className="text-[11px] font-bold uppercase leading-tight">{company || 'COMPANY NAME'}</p>
              </div>

              <div className="w-full border-t border-dashed border-gray-400 pt-3">
                <p className="text-[8px] font-bold uppercase text-gray-500 mb-0.5">Host / Pendamping:</p>
                <p className="text-[10px] font-bold uppercase leading-tight">{hostName || 'HOST NAME'}</p>
              </div>
            </div>

            <div className={`h-10 px-2 flex items-center justify-center text-center border-t-2 border-black ${purpose.includes('Office') ? 'bg-blue-100' : purpose.includes('Warehouse') ? 'bg-amber-100' : 'bg-red-100'}`}>
              <p className="text-[8px] font-black uppercase tracking-wider">
                {purpose === 'Meeting / Office' ? 'RESTRICTED TO OFFICE ONLY' : 'MUST WEAR HI-VIS VEST'}
              </p>
            </div>
            
          </div>
          
        </div>

      </div>
    </div>
  )
}
