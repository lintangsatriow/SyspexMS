"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

interface SafetyTopic {
  id: string
  category: 'Warehouse & Logistics' | 'Packaging & Machinery' | 'Installation & High Risk'
  title: string
  hazard: string
  keyPoints: string[]
  ppeRequired: string
}

const TOPIC_LIBRARY: SafetyTopic[] = [
  {
    id: 'TOPIC-01',
    category: 'Packaging & Machinery',
    title: 'Pinch Point & Titik Jepit Mesin Wrapping/Strapping',
    hazard: 'Risiko anggota tubuh (tangan/jari) terjepit roller mesin strapping semi/otomatis, stretch wrapper turn-table, dan konveyor.',
    keyPoints: [
      'Pastikan pelindung fisik (machine guarding) selalu terpasang sebelum tombol Start ditekan.',
      'Dilarang mengenakan sarung tangan longgar, perhiasan, atau pakaian longgar di dekat roller berputar.',
      'Wajib terapkan LOTO (Lockout/Tagout) saat membersihkan sisa plastik/strapping band di area mekanikal.',
      'Ketahui posisi persis tombol Emergency Stop (E-Stop) sebelum mengoperasikan unit.'
    ],
    ppeRequired: 'Kacamata Safety, Sepatu Safety, Sarung Tangan Presisi (Non-Loose)'
  },
  {
    id: 'TOPIC-02',
    category: 'Warehouse & Logistics',
    title: 'Interaksi Pejalan Kaki & Forklift (Blind Spot Management)',
    hazard: 'Tertabrak atau terjepit pergerakan forklift di lorong racking dan area bongkar muat logistik.',
    keyPoints: [
      'Terapkan aturan kontak mata (Eye Contact Rule) 3 meter sebelum melintasi jalur forklift.',
      'Pejalan kaki wajib berjalan di dalam garis pedestrian line (marka kuning/hijau).',
      'Operator forklift wajib membunyikan klakson saat melintasi persimpangan dan blind spot.',
      'Dilarang berdiri atau berjalan di bawah garpu forklift yang sedang terangkat muatan.'
    ],
    ppeRequired: 'Rompi Reflektif (High-Vis), Sepatu Safety Toe Cap'
  },
  {
    id: 'TOPIC-03',
    category: 'Installation & High Risk',
    title: 'Stabilitas Pemasangan Balok Racking & Penguncian Safety Pin',
    hazard: 'Balok racking terlepas atau ambruk akibat kelalaian pemasangan pin pengaman dan ketidaksejajaran tiang upright.',
    keyPoints: [
      'Setiap konektor balok (beam connector) wajib langsung dipasang Safety Locking Pin di kedua ujungnya.',
      'Gunakan palu karet saat mengetuk konektor ke slot upright; jangan gunakan palu besi tanpa pelindung.',
      'Verifikasi kerataan waterpass tiang upright sebelum memasang angkur baseplate ke lantai beton.',
      'Area di bawah instalasi rak wajib di-barikade; dilarang ada aktivitas lalu lalang pihak luar.'
    ],
    ppeRequired: 'Helm Keselamatan dengan Chinstrap, Sepatu Safety, Sarung Tangan Grip'
  },
  {
    id: 'TOPIC-04',
    category: 'Packaging & Machinery',
    title: 'Penanganan Manual (Manual Handling) Roll Plastik & Material Berat',
    hazard: 'Cedera tulang belakang (musculoskeletal disorders) saat mengangkat roll stretch film atau gulungan tali strapping.',
    keyPoints: [
      'Batas angkat individu maksimum adalah 20 kg (25 kg untuk kondisi prima).',
      'Tekuk lutut dan jaga punggung tetap lurus; angkat beban menggunakan kekuatan otot kaki, bukan pinggang.',
      'Posisikan roll material sedekat mungkin dengan dada saat memindahkan.',
      'Gunakan troli angkut atau minta bantuan rekan kerja (team lift) untuk bobot melebihi batas regulasi.'
    ],
    ppeRequired: 'Sepatu Safety, Sarung Tangan Kerja, Back Support (Opsional)'
  },
  {
    id: 'TOPIC-05',
    category: 'Installation & High Risk',
    title: 'Bekerja di Ketinggian & Inspeksi Scaffolding Frame',
    hazard: 'Jatuh dari ketinggian saat perakitan rak tingkat atas atau inspeksi struktur tinggi.',
    keyPoints: [
      'Wajib menggunakan Full Body Harness dengan double lanyard 100% tie-off di atas ketinggian 1.8 meter.',
      'Periksa Scafftag pada main frame scaffolding: warna HIJAU (Aman Digunakan), warna MERAH (Dilarang Digunakan).',
      'Pastikan catwalk terpasang penuh dan terikat; jangan gunakan papan kayu lapuk sebagai pijakan.',
      'Amankan perkakas tangan dengan lanyard alat (tool lanyard) agar tidak jatuh menimpa pekerja di bawah.'
    ],
    ppeRequired: 'Full Body Harness, Helm K3 (Chinstrap kencang), Sepatu Safety'
  }
]

interface Attendee {
  id: string
  name: string
  department: string
}

export default function SafetyTalkPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  // State Filter Kategori Pustaka
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // State Formulir Aktif
  const [activeTopicTitle, setActiveTopicTitle] = useState<string>(TOPIC_LIBRARY[0].title)
  const [activeHazard, setActiveHazard] = useState<string>(TOPIC_LIBRARY[0].hazard)
  const [activePoints, setActivePoints] = useState<string[]>(TOPIC_LIBRARY[0].keyPoints)
  const [activePpe, setActivePpe] = useState<string>(TOPIC_LIBRARY[0].ppeRequired)

  const [supervisor, setSupervisor] = useState<string>('')
  const [shift, setShift] = useState<string>('Shift 1 (Pagi)')
  const [location, setLocation] = useState<string>('Area Perakitan & Gudang Syspex')

  // State Daftar Hadir
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'Agus Santoso', department: 'Packaging Assembly' },
    { id: '2', name: 'Budi Prasetyo', department: 'Field Service Technician' }
  ])
  const [newName, setNewName] = useState<string>('')
  const [newDept, setNewDept] = useState<string>('Packaging Assembly')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleSelectTopic = (topic: SafetyTopic) => {
    setActiveTopicTitle(topic.title)
    setActiveHazard(topic.hazard)
    setActivePoints(topic.keyPoints)
    setActivePpe(topic.ppeRequired)
  }

  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAttendees([...attendees, {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      department: newDept
    }])
    setNewName('')
  }

  const handleRemoveAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id))
  }

  const filteredTopics = selectedCategory === 'All' 
    ? TOPIC_LIBRARY 
    : TOPIC_LIBRARY.filter(t => t.category === selectedCategory)

  const isFormValid = activeTopicTitle.trim() !== '' && supervisor.trim() !== '' && location.trim() !== '' && attendees.length > 0

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman (Sembunyikan saat cetak) */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Daily Safety Talk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pustaka Materi &amp; Absensi Safety Talk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Koleksi materi Toolbox Meeting (TBM) 5 menit spesifik industri Syspex: mesin packaging/strapping, logistik, pengangkatan, dan instalasi rak.
        </p>
      </div>

      {/* Header Cetak Resmi */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Daily Toolbox Talk Record</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">BUKTI PELAKSANAAN BRIEFING KESELAMATAN KERJA HARIAN</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Diterbitkan oleh:</span>
            <span className="text-sm font-black text-slate-900">SYSPEX MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: REPOSITORI MATERI K3 (Sembunyikan saat dicetak) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Pilih Materi Hari Ini</h2>
              <span className="text-[10px] font-mono text-slate-400">Database Lapangan</span>
            </div>

            {/* Filter Kategori */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Packaging & Machinery', 'Warehouse & Logistics', 'Installation & High Risk'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat === 'All' ? 'Semua' : cat}
                </button>
              ))}
            </div>

            {/* Daftar Pustaka Kartu Materi */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition ${activeTopicTitle === topic.title ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800'}`}
                >
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider mb-1 opacity-70">
                    <span>{topic.category}</span>
                    <span>{topic.id}</span>
                  </div>
                  <h3 className="text-xs font-bold leading-snug">{topic.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORMULIR PELAKSANAAN & ABSENSI (Dicetak) */}
        <div className="lg:col-span-7 space-y-5 print:col-span-12 print:w-full">
          
          {/* Card Rincian Briefing */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:p-0 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 print:border-slate-900">
              2. Ringkasan Briefing &amp; Instruksi Bahaya
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:grid-cols-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Tanggal</label>
                <input type="date" value={todayDate} onChange={(e) => setTodayDate(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none print:border-none print:bg-transparent print:p-0" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Shift</label>
                <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none print:hidden">
                  <option>Shift 1 (Pagi)</option>
                  <option>Shift 2 (Sore)</option>
                  <option>Shift 3 (Malam)</option>
                </select>
                <div className="hidden print:block text-xs font-bold">{shift}</div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Area / Lokasi</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none print:border-none print:bg-transparent print:p-0" />
              </div>
            </div>

            {/* Isi Bahasan Topik */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 print:bg-white print:border-slate-400">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Topik Bahasan</span>
                <h3 className="text-sm font-black text-slate-900 leading-snug">{activeTopicTitle}</h3>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Potensi Bahaya Teridentifikasi</span>
                <p className="text-xs text-slate-700 italic">{activeHazard}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Tindakan Pencegahan Kritis (Instruksi Kerja)</span>
                <ul className="text-xs text-slate-800 space-y-1 pl-5 list-disc font-medium">
                  {activePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">APD Mandatory</span>
                <span className="text-xs font-bold text-slate-900">{activePpe}</span>
              </div>
            </div>

            <div className="print:pt-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nama Supervisor / Pemimpin Briefing</label>
              <input type="text" placeholder="Nama Supervisor / HSE Officer..." value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none print:border-none print:bg-transparent print:p-0" />
            </div>
          </div>

          {/* Card Daftar Hadir Pekerja */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:p-0 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 print:border-slate-900">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Verifikasi Kehadiran Pekerja
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded print:hidden">
                Total: {attendees.length} Orang
              </span>
            </div>

            {/* Input Tambah Peserta */}
            <form onSubmit={handleAddAttendee} className="flex gap-2 print:hidden">
              <input type="text" placeholder="Nama Pekerja..." value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none" />
              <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none">
                <option>Packaging Assembly</option>
                <option>Field Service Technician</option>
                <option>Warehouse &amp; Logistics</option>
                <option>Contractor / Helper</option>
              </select>
              <button type="submit" disabled={!newName.trim()} className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition">
                + Tambah
              </button>
            </form>

            {/* Tabel Daftar Hadir */}
            <div className="overflow-x-auto border border-slate-200 rounded print:border-slate-400">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 print:bg-slate-200 print:border-slate-400">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center font-bold">No</th>
                    <th className="py-2 px-3 font-bold">Nama Lengkap</th>
                    <th className="py-2 px-3 font-bold">Departemen</th>
                    <th className="py-2 px-3 text-center font-bold print:hidden w-16">Aksi</th>
                    <th className="hidden print:table-cell py-2 px-3 text-center font-bold w-36">Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 print:divide-slate-300">
                  {attendees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">Belum ada pekerja terdaftar.</td>
                    </tr>
                  ) : (
                    attendees.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-slate-50 print:hover:bg-white">
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{att.name}</td>
                        <td className="py-2 px-3 text-slate-600">{att.department}</td>
                        <td className="py-2 px-3 text-center print:hidden">
                          <button onClick={() => handleRemoveAttendee(att.id)} className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 bg-red-50 rounded text-[10px]">
                            Hapus
                          </button>
                        </td>
                        <td className="hidden print:table-cell py-2 px-3"></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Kolom Pengesahan Tanda Tangan Cetak */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-12">Disampaikan Oleh (Supervisor / HSE):</p>
                <div className="w-48 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">{supervisor || 'Nama Supervisor'}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-12">Mengetahui (Site / Operations Manager):</p>
                <div className="w-48 mx-auto border-b border-slate-400"></div>
                <p className="text-xs font-bold mt-1 uppercase">Tanda Tangan &amp; Nama</p>
              </div>
            </div>

          </div>

          {/* Tombol Cetak Dokumen */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Siap Dilaksanakan</h3>
              <p className="text-xs text-slate-600 mt-0.5">Cetak lembar briefing ini untuk dibacakan dan ditandatangani saat apel pagi.</p>
            </div>
            <button
              onClick={() => window.print()}
              disabled={!isFormValid}
              className={`px-5 py-2.5 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${isFormValid ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              {isFormValid ? '🖨️ Cetak Lembar Briefing' : '⛔ Isi Supervisor & Pekerja'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
