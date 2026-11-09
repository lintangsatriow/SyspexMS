"use client"

import { useState } from 'react'
import Link from 'next/link'

interface SafetyTopic {
  id: string
  category: 'MHE & Warehouse' | 'Racking & Height' | 'Machine & Maintenance' | 'Health & General'
  title: string
  duration: string
  hazardTarget: string
  keyPoints: string[]
  mandatoryActions: string[]
  discussionQuestion: string
}

const TOPICS_LIBRARY: SafetyTopic[] = [
  {
    id: 'mhe-blindspot',
    category: 'MHE & Warehouse',
    title: 'Blind Spot & Hak Pejalan Kaki di Jalur Forklift',
    duration: '3 - 5 Menit',
    hazardTarget: 'Tertabrak Forklift / Terjepit di Tikungan Lorong Racking',
    keyPoints: [
      'Titik buta operator forklift bertambah drastis saat membawa beban tinggi di garpu depan.',
      'Suara bising gudang packaging sering membuat klakson tidak terdengar jika operator tidak memperlambat laju.',
      'Jalur pedestrian dengan garis kuning bukan pelindung fisik, operator dan pejalan kaki wajib melakukan eye-contact.'
    ],
    mandatoryActions: [
      'Bunyikan klakson 2x pendek sebelum melewati blind corner atau pintu loading dock.',
      'Pejalan kaki dilarang menggunakan earphone / bermain handphone saat melintasi jalur operasional MHE.',
      'Kecepatan forklift maksimal 10 km/jam di dalam ruangan dan 5 km/jam saat manuver di lorong sempit.'
    ],
    discussionQuestion: 'Siapa yang pernah hampir bersenggolan dengan forklift di tikungan loading minggu ini? Apa penyebabnya?'
  },
  {
    id: 'racking-swl',
    category: 'Racking & Height',
    title: 'Batas Beban Rak (SWL) & Larangan Memanjat Frame Racking',
    duration: '5 Menit',
    hazardTarget: 'Racking Runtuh (Collapse) & Jatuh dari Ketinggian',
    keyPoints: [
      'Setiap level beam racking memiliki Safe Working Load (SWL) terukur. Menumpuk palet over-capacity melemahkan struktur upright.',
      'Memanjat tiang rangka racking tanpa scaffolding atau platform resmi adalah tindakan berbahaya fatal (Unsafe Act).',
      'Pin pengunci beam (Safety Lock Pin) yang hilang membuat balok bisa terangkat garpu forklift tanpa sengaja.'
    ],
    mandatoryActions: [
      'Periksa apakah stiker SWL terpasang jelas di setiap ujung lorong racking.',
      'Gunakan tangga platform atau scissor lift resmi untuk mengambil barang yang tersangkut di level atas.',
      'Laporkan segera jika melihat profil tiang racking bengkok akibat tertabrak forklift.'
    ],
    discussionQuestion: 'Apakah di area kerja Anda ada lock pin beam yang lepas atau tiang racking yang penyok?'
  },
  {
    id: 'wah-scaffold',
    category: 'Racking & Height',
    title: 'Pemasangan Lanyard Harness Saat Rakit Scaffolding',
    duration: '5 Menit',
    hazardTarget: 'Jatuh dari Ketinggian > 1.8 Meter saat Perakitan ASRS',
    keyPoints: [
      'Full body harness tidak berguna jika hook lanyard tidak dicantolkan ke struktur kaku di atas pinggang.',
      'Scaffolding yang belum dipasang Tag Hijau (Safe) dilarang digunakan untuk bekerja.',
      'Alat perkakas kecil yang jatuh dari scaffolding bisa melukai rekan kerja di bawah jika tidak ada toe-board atau barikade.'
    ],
    mandatoryActions: [
      'Terapkan sistem 100% Tie-off (salah satu hook lanyard ganda harus selalu terkait saat berpindah posisi).',
      'Pasang tali pengikat (tool lanyard) pada obeng/kunci pas agar tidak terlepas ke lantai bawah.',
      'Pastikan fisik fit: jika pusing, tensi tinggi, atau ada riwayat vertigo, segera lapor dan jangan memanjat.'
    ],
    discussionQuestion: 'Sudahkah harness Anda diperiksa kondisinya pagi ini? Apakah web stitching-nya ada yang robek?'
  },
  {
    id: 'loto-service',
    category: 'Machine & Maintenance',
    title: 'Isolasi Energi (LOTO) Sebelum Servis Mesin Strapping / Wrapping',
    duration: '4 Menit',
    hazardTarget: 'Tersengat Listrik / Terjepit Komponen Bergerak Otomatis',
    keyPoints: [
      'Mematikan tombol saklar OFF bukan berarti mesin sudah aman; masih ada sisa energi listrik kondensator atau tekanan angin pneumatik.',
      'Teknisi lain atau operator bisa menyalakan mesin secara tidak sengaja jika gembok dan tag LOTO tidak dipasang.',
      'Servis hanya boleh dilakukan setelah Zero Energy State diverifikasi.'
    ],
    mandatoryActions: [
      'Kunci sumber daya utama dengan padlock pribadi dan pasang Danger Tag bertuliskan nama Anda.',
      'Kuras tabung kompresor atau buang sisa tekanan hidrolik sebelum membuka cover pelindung mesin.',
      'Lakukan uji start untuk memastikan mesin benar-benar mati total sebelum tangan masuk ke area bahaya.'
    ],
    discussionQuestion: 'Apakah ada mesin packaging yang safety sensor interlock-nya di-bypass saat ini?'
  },
  {
    id: 'b3-spill',
    category: 'Machine & Maintenance',
    title: 'Tanggap Tumpahan Oli Hidrolik & Penanganan Kain Majun B3',
    duration: '4 Menit',
    hazardTarget: 'Lantai Licin, Kebakaran, dan Pencemaran Lingkungan (ISO 14001)',
    keyPoints: [
      'Tetesan oli kecil dari selang forklift yang bocor adalah pemicu selip roda forklift dan kecelakaan terpeleset.',
      'Kain majun yang terkena oli dilarang dibuang ke tempat sampah domestik karena termasuk limbah B3 mudah terbakar.'
    ],
    mandatoryActions: [
      'Gunakan serbuk gergaji / spill kit untuk membendung tumpahan oli, jangan disiram air ke saluran got.',
      'Buang majun bekas dan sarung tangan terkontaminasi ke drum khusus berlabel Limbah B3 (B110d).',
      'Segera parkirkan forklift yang bocor dan laporkan ke tim maintenance bengkel.'
    ],
    discussionQuestion: 'Di mana lokasi kotak Spill Kit terdekat dari area kerja Anda sekarang?'
  },
  {
    id: 'ergonomi-lifting',
    category: 'Health & General',
    title: 'Teknik Angkat-Angkut Manual (Manual Handling) Tanpa Cedera Pinggang',
    duration: '3 Menit',
    hazardTarget: 'Cedera Otot Tulang Belakang (HNP / Low Back Pain)',
    keyPoints: [
      'Mengangkat beban berat dengan posisi punggung membungkuk memberikan tekanan 5x lipat pada bantalan tulang belakang.',
      'Batas berat angkat aman untuk satu orang adalah maksimal 20–25 kg dalam kondisi ideal.'
    ],
    mandatoryActions: [
      'Tekuk lutut (jongkok) dan gunakan kekuatan otot paha untuk mengangkat, jaga punggung tetap tegak.',
      'Posisikan barang sedekat mungkin dengan dada sebelum melangkah.',
      'Minta bantuan rekan kerja (team lifting) atau gunakan hand pallet untuk beban di atas 25 kg.'
    ],
    discussionQuestion: 'Barang apa di area Anda yang sering diangkat sendirian padahal beratnya melebihi 25 kg?'
  }
]

export default function SafetyTalkPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [activeTopic, setActiveTopic] = useState<SafetyTopic>(TOPICS_LIBRARY[0])
  const [presenterName, setPresenterName] = useState('Lintang Satrio')
  const [shiftLocation, setShiftLocation] = useState('Gudang Utama & Workshop Syspex')

  const filteredTopics = selectedCategory === 'ALL'
    ? TOPICS_LIBRARY
    : TOPICS_LIBRARY.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header Web */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">K3 & Operasional</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Katalog Materi Daily Safety Talk</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Panduan materi briefing 5 menit harian yang spesifik untuk aktivitas operasional Syspex.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK MATERI BRIEFING INI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
        
        {/* Kolom Kiri: Pemilihan Topik */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Kategori Pekerjaan</label>
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'MHE & Warehouse', 'Racking & Height', 'Machine & Maintenance', 'Health & General'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat === 'ALL' ? 'Semua Topik' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTopics.map(topic => (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${activeTopic.id === topic.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'}`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${activeTopic.id === topic.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {topic.category}
                  </span>
                  <span className={`text-[10px] font-bold ${activeTopic.id === topic.id ? 'text-amber-300' : 'text-slate-500'}`}>
                    ⏱ {topic.duration}
                  </span>
                </div>
                <h3 className="text-sm font-black mt-1 leading-snug">{topic.title}</h3>
                <p className={`text-[11px] mt-1.5 line-clamp-1 ${activeTopic.id === topic.id ? 'text-slate-400' : 'text-slate-500'}`}>
                  Target: {topic.hazardTarget}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Lembar Contekan Pembicara (Speaker Guide) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded">
                  {activeTopic.category}
                </span>
                <span className="text-xs font-bold text-slate-500">Estimasi Durasi: {activeTopic.duration}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {activeTopic.title}
              </h2>
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <span>⚠️ Fokus Bahaya:</span>
                <span>{activeTopic.hazardTarget}</span>
              </div>
            </div>

            {/* Poin Bahasan */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                1. Fakta & Poin Kunci yang Perlu Disampaikan
              </h3>
              <ul className="space-y-2.5">
                {activeTopic.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    <span className="font-bold text-slate-900 mr-1.5">{idx + 1}.</span> {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aturan Wajib */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                2. Instruksi Wajib Hari Ini (Action Rules)
              </h3>
              <ul className="space-y-2">
                {activeTopic.mandatoryActions.map((action, idx) => (
                  <li key={idx} className="text-xs font-bold text-emerald-950 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-700 font-black">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pertanyaan Pemantik Diskusi */}
            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                3. Pertanyaan Diskusi Dua Arah (Tanyakan ke Tim):
              </p>
              <p className="text-sm font-bold leading-snug">
                &ldquo;{activeTopic.discussionQuestion}&rdquo;
              </p>
              <p className="text-[10px] text-slate-400 italic">
                *Tujuan: Memancing tim berbicara mengenai kondisi riil di lantai kerja hari ini, bukan sekadar mendengarkan satu arah.
              </p>
            </div>

            {/* Metadata Pembawa Briefing */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pembawa Materi (Leader)</label>
                <input 
                  type="text" 
                  value={presenterName} 
                  onChange={(e) => setPresenterName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lokasi Shift</label>
                <input 
                  type="text" 
                  value={shiftLocation} 
                  onChange={(e) => setShiftLocation(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* LEMBAR CETAK DOKUMEN MATERI SAFETY TALK (PRINT ONLY) */}
      {/* ================================================== */}
      <div className="hidden print:block w-full text-black">
        <div className="border-2 border-black p-6 w-full max-w-[850px] mx-auto">
          
          <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">LEMBAR PANDUAN DAILY SAFETY TALK (TBM)</h1>
              <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - Standard K3 Operasional</p>
            </div>
            <div className="text-right border border-black p-2 text-[9px] font-bold uppercase">
              <p>Kategori: {activeTopic.category}</p>
              <p>Durasi: {activeTopic.duration}</p>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-black uppercase mb-1">{activeTopic.title}</h2>
            <p className="text-xs font-bold text-gray-700 uppercase border-b border-black pb-2">
              Fokus Potensi Bahaya: {activeTopic.hazardTarget}
            </p>
          </div>

          <div className="space-y-4 text-xs mb-6">
            <div>
              <p className="font-black uppercase mb-1">A. Poin Kunci yang Wajib Disampaikan Pengawas:</p>
              <ul className="list-decimal pl-5 space-y-1">
                {activeTopic.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-black uppercase mb-1">B. Instruksi Kerja Aman Hari Ini (Mandatory Actions):</p>
              <ul className="list-disc pl-5 space-y-1 font-bold">
                {activeTopic.mandatoryActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            <div className="border border-black p-3 bg-gray-50">
              <p className="font-black uppercase mb-1">C. Pertanyaan Refleksi Tim Lapangan:</p>
              <p className="italic">&ldquo;{activeTopic.discussionQuestion}&rdquo;</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs font-bold border-t-2 border-black pt-4">
            <div>
              <p><span className="text-gray-600 uppercase">Pimpinan Briefing:</span> {presenterName}</p>
              <p className="mt-1"><span className="text-gray-600 uppercase">Lokasi Area:</span> {shiftLocation}</p>
            </div>
            <div className="text-right">
              <p><span className="text-gray-600 uppercase">Tanggal Briefing:</span> {new Date().toLocaleDateString('id-ID')}</p>
              <p className="mt-8 border-t border-black w-48 ml-auto text-center pt-1">Tanda Tangan Pengawas</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
