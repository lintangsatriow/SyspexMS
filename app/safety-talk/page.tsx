"use client"

import { useState } from 'react'

interface SafetyTopic {
  id: string
  title: string
  category: 'Ketinggian' | 'Alat Berat' | 'Kesehatan Kerja' | 'Kelistrikan' | 'Ergonomi'
  readTime: string
  coreHazard: string
  talkingPoints: string[]
  discussionQuestion: string
}

const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'tbm-01',
    title: 'Bekerja Aman di Ketinggian & Inspeksi Full Body Harness',
    category: 'Ketinggian',
    readTime: '4 Menit',
    coreHazard: 'Jatuh dari ketinggian lebih dari 1.8 meter akibat kegagalan titik angkur atau harness tidak terikat benar.',
    talkingPoints: [
      'Lakukan inspeksi 100% pre-use harness: pastikan webbing tidak terkoyak, jahitan tidak putus, dan D-Ring tidak retak atau bengkok.',
      'Terapkan prinsip 100% tie-off dengan double lanyard. Satu hook harus selalu terpasang saat berpindah posisi.',
      'Pastikan titik angkur mampu menahan beban minimal 22 kN (5.000 lbs) dan berada di atas posisi kepala (overhead tie-off) untuk meminimalkan jarak jatuh bebas (free fall distance).',
      'Periksa tanggal kadaluarsa dan tag inspeksi berkala pada harness sebelum naik ke area kerja.'
    ],
    discussionQuestion: 'Apakah ada titik angkur di area kerja shift ini yang meragukan atau belum diinspeksi tim scaffolding?'
  },
  {
    id: 'tbm-02',
    title: 'Mitigasi Titik Buta (Blind Spot) Operasi Alat Berat & Truk',
    category: 'Alat Berat',
    readTime: '5 Menit',
    coreHazard: 'Tertabrak atau terlindas alat berat akibat pejalan kaki berada di luar sudut pandang operator.',
    talkingPoints: [
      'Jangan pernah berada di area radius swing alat berat atau di jalur lintasan manuver tanpa izin operator.',
      'Terapkan kontak visual (eye contact) langsung dengan operator sebelum mendekati unit, tunggu hingga unit berhenti penuh dan attachment diturunkan ke tanah.',
      'Wajib mengenakan rompi reflektif berspesifikasi tinggi (Hi-Vis class 2/3) yang bersih agar terlihat jelas di area berdebu maupun minim cahaya.',
      'Gunakan bantuan spotter / rigger resmi bersertifikat saat manuver mundur atau masuk ke gang sempit.'
    ],
    discussionQuestion: 'Di titik mana saja jalur pejalan kaki dan lintasan dump truck saling berpotongan di area kerja Anda hari ini?'
  },
  {
    id: 'tbm-03',
    title: 'Pencegahan Dehidrasi & Heat Stress di Cuaca Ekstrem',
    category: 'Kesehatan Kerja',
    readTime: '3 Menit',
    coreHazard: 'Heat exhaustion hingga heat stroke yang menyebabkan pingsan mendadak saat beroperasi.',
    talkingPoints: [
      'Minum air minimal 1 gelas (250 ml) setiap 20–30 menit, jangan menunggu sampai merasa haus.',
      'Kenali gejala awal heat exhaustion: pusing, keringat berlebih, kram otot, mual, dan detak jantung meningkat.',
      'Gunakan area istirahat berteduh (shelter) saat break terjadwal dan manfaatkan asupan elektrolit jika pekerjaan berintensitas tinggi.',
      'Terapkan buddy system: segera laporkan ke pengawas jika rekan kerja terlihat bingung, lemas, atau bicaranya mulai melantur.'
    ],
    discussionQuestion: 'Kapan terakhir kali Anda atau rekan kerja mengalami kram panas, dan apakah persediaan air minum di pos kerja Anda mencukupi?'
  },
  {
    id: 'tbm-04',
    title: 'Disiplin Isolasi Energi Bahaya (Lockout / Tagout - LOTO)',
    category: 'Kelistrikan',
    readTime: '4 Menit',
    coreHazard: 'Pelepasan energi listrik atau mekanikal tak terduga saat pekerjaan perbaikan/maintenance berlangsung.',
    talkingPoints: [
      'Satu pekerja, satu gembok, satu kunci (One person, one lock, one key). Dilarang menitipkan kunci LOTO kepada siapa pun.',
      'Lakukan tahapan baku LOTO: Identifikasi sumber energi → Beritahu pihak terdampak → Matikan unit → Isolasi sumber → Pasang Padlock & Tag Out → Rilis energi sisa.',
      'Wajib lakukan verifikasi energi nol (Zero Energy State Verification) dengan menekan tombol start lokal atau uji tegangan sebelum menyentuh komponen.',
      'Tag LOTO harus diisi lengkap: nama pelaksana, departemen, tanggal pemasangan, dan nomor izin kerja (PTW) terkait.'
    ],
    discussionQuestion: 'Sudahkah semua orang yang terlibat dalam pekerjaan overhaul memegang kunci gembok LOTO pribadinya masing-masing?'
  }
]

export default function SafetyTalkPage() {
  const [selectedTopic, setSelectedTopic] = useState<SafetyTopic>(SAFETY_TOPICS[0])
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [attendeeCount, setAttendeeCount] = useState<number>(15)
  const [conductorName, setConductorName] = useState<string>('')
  const [locationName, setLocationName] = useState<string>('')
  const [isLogged, setIsLogged] = useState<boolean>(false)

  const categories = ['Semua', 'Ketinggian', 'Alat Berat', 'Kesehatan Kerja', 'Kelistrikan']

  const filteredTopics = selectedCategory === 'Semua' 
    ? SAFETY_TOPICS 
    : SAFETY_TOPICS.filter(t => t.category === selectedCategory)

  const handleLogMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (!conductorName || !locationName) return
    setIsLogged(true)
    setTimeout(() => setIsLogged(false), 4000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[10px] font-semibold uppercase tracking-wider mb-2">
          Briefing Operasional Harian
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Toolbox Meeting (TBM) Desk
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Kumpulan panduan safety briefing 5 menit berbasis bahaya kritis, siap dibaca langsung dari smartphone di lapangan.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-zinc-100 shadow-sm'
                : 'bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Topic Catalog & Focused Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Topic List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1">
            Pilih Modul Pembahasan ({filteredTopics.length})
          </div>

          <div className="space-y-2.5">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopic.id === topic.id
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-800 text-white shadow-md'
                      : 'bg-white border-zinc-200/80 hover:border-zinc-300 text-zinc-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected 
                        ? 'bg-zinc-800 text-amber-400 border border-zinc-700/60' 
                        : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {topic.category}
                    </span>
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      ⏱️ {topic.readTime}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {topic.title}
                  </h3>

                  <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {topic.coreHazard}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Active Topic Reader & Execution Log */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Briefing Sheet */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            
            <div className="border-b border-zinc-100 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  {selectedTopic.category}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Estimasi Paparan: {selectedTopic.readTime}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight leading-snug">
                {selectedTopic.title}
              </h2>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 text-rose-950 text-xs space-y-1">
              <span className="font-bold text-[11px] uppercase tracking-wide text-rose-700 flex items-center gap-1.5">
                ⚠️ Potensi Bahaya Utama (Critical Hazard):
              </span>
              <p className="leading-relaxed text-rose-900/90">{selectedTopic.coreHazard}</p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                Poin Pengarahan Mandor / Supervisor:
              </span>
              <ol className="space-y-3">
                {selectedTopic.talkingPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-700 leading-relaxed items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-[10px] flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-500/20 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1">
                💬 Pertanyaan Refleksi Tim (Uji Pemahaman):
              </span>
              <p className="text-xs font-semibold text-emerald-950 leading-relaxed italic">
                &ldquo;{selectedTopic.discussionQuestion}&rdquo;
              </p>
            </div>

          </div>

          {/* Quick Record Verification Form */}
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-zinc-100 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Log Pelaksanaan Briefing Lapangan
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                TBM Form
              </span>
            </div>

            <form onSubmit={handleLogMeeting} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Nama Pemateri
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi H."
                  value={conductorName}
                  onChange={(e) => setConductorName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Lokasi / Pos
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Area B"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Peserta
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition tabular-nums"
                />
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>Catat Pelaksanaan TBM Pagi Ini</span>
                </button>
              </div>
            </form>

            {isLogged && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center animate-in fade-in">
                ✓ Catatan TBM berhasil direkam untuk topik: <strong>{selectedTopic.title}</strong>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
