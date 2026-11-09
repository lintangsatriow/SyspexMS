"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function SafetyInductionPage() {
  const [visitorName, setVisitorName] = useState('')
  const [company, setCompany] = useState('')
  const [purpose, setPurpose] = useState('Meeting / Kunjungan Biasa')
  const [hostName, setHostName] = useState('')
  
  // Persetujuan Golden Rules Syspex
  const [agreements, setAgreements] = useState({
    ppe: false,
    pedestrian: false,
    speed: false,
    emergency: false,
  })

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isFormComplete = visitorName !== '' && company !== '' && hostName !== '' && 
    agreements.ppe && agreements.pedestrian && agreements.speed && agreements.emergency

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      
      {/* Header - Sembunyikan saat cetak */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Security & Access</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Visitor Safety Induction</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Registrasi tamu, briefing K3 area gudang, & penerbitan ID Card akses.</p>
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
        
        {/* Panel Input Interaktif - Sembunyikan saat cetak */}
        <div className="lg:col-span-8 space-y-6 print:hidden">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-5">
            <h2 className="col-span-2 text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3 mb-1">Data Pengunjung</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition" placeholder="Sesuai KTP..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asal Perusahaan / Instansi</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tujuan Area / Kunjungan</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition">
                <option value="Meeting / Office">Meeting (Area Kantor Biasa)</option>
                <option value="Warehouse / MHE Area">Gudang (Area Forklift / MHE)</option>
                <option value="Machine Installation">Instalasi / Servis Mesin (Kontraktor)</option>
                <option value="Facility Audit">Audit Fasilitas</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Host (Orang Syspex)</label>
              <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition" placeholder="Siapa yang ditemui?" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm text-white space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-2">
              <span className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-xl">⚠️</span>
              <div>
                <h2 className="text-base font-black uppercase tracking-wide">Warehouse Golden Rules</h2>
                <p className="text-xs text-slate-400 mt-0.5">Tamu WAJIB menyetujui aturan ini sebelum masuk ke fasilitas Syspex.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={agreements.ppe} onChange={() => toggleAgreement('ppe')} className="mt-1 w-5 h-5 accent-emerald-500 rounded" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">1. Penggunaan APD (Safety Shoes & Vest)</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Saya berjanji akan menggunakan Sepatu Keselamatan dan Rompi Visibilitas Tinggi selama berada di area gudang aktif atau area instalasi.</p>
                </div>
              </label>
              
              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={agreements.pedestrian} onChange={() => toggleAgreement('pedestrian')} className="mt-1 w-5 h-5 accent-emerald-500 rounded" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">2. Jalur Pejalan Kaki (Pedestrian Way)</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Saya hanya akan berjalan di area garis kuning/hijau yang ditentukan dan selalu memberikan Hak Jalan Utama kepada Forklift (MHE).</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={agreements.speed} onChange={() => toggleAgreement('speed')} className="mt-1 w-5 h-5 accent-emerald-500 rounded" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">3. Blind Spot & Jarak Aman</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Saya tidak akan berdiri di belakang forklift yang sedang menyala dan akan menjaga jarak minimal 3 meter dari area pengangkatan alat berat.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition">
                <input type="checkbox" checked={agreements.emergency} onChange={() => toggleAgreement('emergency')} className="mt-1 w-5 h-5 accent-emerald-500 rounded" />
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">4. Tanggap Darurat & Evakuasi</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Jika alarm berbunyi, saya akan mengikuti Host (petugas pendamping) menuju Titik Kumpul (Muster Point) terdekat dengan tenang.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Bantuan / Status */}
        <div className="lg:col-span-4 print:hidden space-y-6">
          <div className={`p-6 rounded-2xl border-2 shadow-sm text-center transition-all duration-500 ${isFormComplete ? 'bg-emerald-50 border-emerald-400 translate-y-0 opacity-100' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isFormComplete ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className={`text-lg font-black uppercase tracking-widest ${isFormComplete ? 'text-emerald-800' : 'text-slate-400'}`}>
              {isFormComplete ? 'INDUKSI SELESAI' : 'TUNGGU PERSETUJUAN'}
            </h3>
            <p className={`text-xs mt-2 font-medium ${isFormComplete ? 'text-emerald-600' : 'text-slate-500'}`}>
              {isFormComplete ? 'Tamu telah menyetujui K3L Syspex. Silakan klik Cetak ID Card dan serahkan rompi.' : 'Lengkapi data tamu dan centang ke-4 poin Golden Rules untuk mencetak kartu.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <h4 className="text-xs font-black text-slate-900 uppercase mb-2">Instruksi Security:</h4>
            <ul className="text-[11px] text-slate-600 space-y-2 list-decimal pl-4 font-medium">
              <li>Minta tamu membaca Golden Rules.</li>
              <li>Tahan KTP/Identitas asli tamu.</li>
              <li>Cetak dan berikan Safety Pass ini.</li>
              <li>Berikan Helm & Rompi (jika ke Gudang).</li>
              <li>Telepon Host untuk menjemput di Lobby.</li>
            </ul>
          </div>
        </div>

        {/* DOKUMEN CETAK UTAMA (Hanya tampil saat window.print()) */}
        {/* Menggunakan format ukuran ID Card standard: CR80 (54mm x 86mm / 2.13" x 3.38") */}
        <div className="hidden print:flex w-full justify-center items-center pt-8">
          
          {/* Card Container (Potrait ID Card format) */}
          {/* Lebar ~ 54mm, Tinggi ~ 86mm di layar (dikonversi ke Tailwind px) */}
          <div className="w-[212px] h-[338px] border-2 border-black rounded-xl flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.1)] relative text-black">
            
            {/* Header (Top) */}
            <div className={`h-16 pt-3 px-3 text-center flex flex-col items-center justify-center border-b-2 border-black ${purpose.includes('Office') ? 'bg-blue-600 text-white' : purpose.includes('Warehouse') ? 'bg-amber-400 text-black' : 'bg-red-600 text-white'}`}>
              <div className="w-8 h-1.5 bg-black/20 rounded-full mb-1"></div> {/* Mockup lubang lanyard */}
              <h1 className="text-sm font-black uppercase tracking-widest leading-none">VISITOR</h1>
              <p className="text-[7px] font-bold uppercase tracking-widest mt-1">Syspex Kemasindo</p>
            </div>

            {/* Body (Middle) */}
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

            {/* Footer (Bottom) */}
            <div className={`h-10 px-2 flex items-center justify-center text-center border-t-2 border-black ${purpose.includes('Office') ? 'bg-blue-100' : purpose.includes('Warehouse') ? 'bg-amber-100' : 'bg-red-100'}`}>
              <p className="text-[8px] font-black uppercase tracking-wider">
                {purpose === 'Meeting / Office' ? 'RESTRICTED TO OFFICE ONLY' : 'MUST WEAR HI-VIS VEST'}
              </p>
            </div>
            
          </div>
          
          {/* Instruksi Print untuk Security */}
          <div className="ml-8 text-[10px] font-bold text-gray-500 uppercase mt-auto mb-4 border-l-2 border-gray-300 pl-4 py-2">
            <p>Cut along the black border</p>
            <p>Insert into visitor ID pouch</p>
          </div>

        </div>

      </div>
    </div>
  )
}
