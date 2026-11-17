"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface TbmTopic {
  id: string
  category: 'HEIGHT' | 'LIFTING' | 'MHE' | 'ELECTRICAL' | 'MANUAL' | 'GENERAL'
  duration: string
  title: { ID: string; EN: string }
  objective: { ID: string; EN: string }
  keyPoints: { ID: string[]; EN: string[] }
  discussionQuestion: { ID: string; EN: string }
}

const TBM_LIBRARY: TbmTopic[] = [
  {
    id: 'TBM-01',
    category: 'HEIGHT',
    duration: '5 MIN',
    title: {
      ID: '100% Tie-Off & Pemeriksaan Full Body Harness',
      EN: '100% Tie-Off & Full Body Harness Inspection'
    },
    objective: {
      ID: 'Memastikan pekerja memahami titik kait yang aman dan kondisi harness sebelum naik ke ketinggian > 1,8 meter.',
      EN: 'Ensure workers verify safe anchor points and harness integrity before working above 1.8 meters.'
    },
    keyPoints: {
      ID: [
        'Periksa webbing, D-ring, dan buckle dari sobekan, karat, atau jahitan terputus sebelum dipakai.',
        'Kaitkan double lanyard pada anchor point di atas bahu (overhead) untuk meminimalkan jarak jatuh bebas.',
        'Dilarang mengaitkan hook pada pipa kecil, kabel tray, atau bagian scaffolding yang belum ber-tag hijau.'
      ],
      EN: [
        'Inspect webbing, D-rings, and buckles for cuts, rust, or broken stitching prior to donning.',
        'Anchor double lanyards overhead above shoulder level to minimize free-fall distance.',
        'Never hook onto small pipes, cable trays, or untagged scaffolding components.'
      ]
    },
    discussionQuestion: {
      ID: 'Di mana titik anchor terdekat yang sudah terverifikasi kuat di area kerja kita hari ini?',
      EN: 'Where is the nearest verified structural anchor point in our work zone today?'
    }
  },
  {
    id: 'TBM-02',
    category: 'MHE',
    duration: '5 MIN',
    title: {
      ID: 'Zona Buta (Blind Spot) & Jarak Aman Pejalan Kaki dengan Forklift',
      EN: 'Blind Spots & Pedestrian Safe Distance Around Forklifts'
    },
    objective: {
      ID: 'Mencegah tabrakan antara unit forklift/MHE dengan pekerja gudang maupun area bongkar muat.',
      EN: 'Prevent collisions between moving forklifts/MHE and pedestrians in warehouse or loading bays.'
    },
    keyPoints: {
      ID: [
        'Selalu gunakan jalur hijau pejalan kaki (pedestrian walkway) dan hindari memotong jalur lintas forklift.',
        'Lakukan kontak mata (eye contact) dengan operator sebelum melintas di depan atau belakang unit.',
        'Operator wajib membunyikan klakson di setiap persimpangan, tikungan, dan saat mundur.'
      ],
      EN: [
        'Always stay within designated green pedestrian walkways and never cut across forklift lanes.',
        'Establish clear eye contact with the operator before crossing near the front or rear of the unit.',
        'Operators must sound the horn at every intersection, blind corner, and before reversing.'
      ]
    },
    discussionQuestion: {
      ID: 'Titik persimpangan mana di area kita hari ini yang jarak pandangnya paling tertutup tumpukan barang?',
      EN: 'Which intersection in our area today has the most obstructed visibility due to stacked goods?'
    }
  },
  {
    id: 'TBM-03',
    category: 'LIFTING',
    duration: '5 MIN',
    title: {
      ID: 'Larangan Berada di Bawah Beban Tergantung & Penggunaan Tagline',
      EN: 'No-Go Zone Under Suspended Loads & Proper Tagline Use'
    },
    objective: {
      ID: 'Menghilangkan risiko tertimpa atau terjepit material saat proses pengangkatan dengan crane atau hoist.',
      EN: 'Eliminate crush and struck-by hazards during crane or hoist lifting operations.'
    },
    keyPoints: {
      ID: [
        'Pasang barikade area ayunan beban (swing radius) sebelum beban diangkat dari lantai.',
        'Gunakan tali pemandu (tagline) untuk mengendalikan arah beban—dilarang menahan beban langsung dengan tangan.',
        'Pastikan safety latch pada hook tertutup sempurna dan sling tidak terpuntir atau terjepit sudut tajam.'
      ],
      EN: [
        'Barricade the entire swing radius zone before lifting any load off the ground.',
        'Use non-conductive taglines to guide loads—never push or stabilize suspended loads by hand.',
        'Verify the hook safety latch is fully closed and slings are protected from sharp edges.'
      ]
    },
    discussionQuestion: {
      ID: 'Siapa yang bertugas sebagai Signalman/Rigger tunggal untuk memberi aba-aba pada pengangkatan hari ini?',
      EN: 'Who is designated as the sole Signalman/Rigger for today’s lifting operation?'
    }
  },
  {
    id: 'TBM-04',
    category: 'ELECTRICAL',
    duration: '5 MIN',
    title: {
      ID: 'Isolasi Energi Berbahaya (LOTO) & Try-Out Sebelum Perbaikan',
      EN: 'Hazardous Energy Isolation (LOTO) & Zero-Energy Verification'
    },
    objective: {
      ID: 'Memastikan mesin atau panel listrik tidak menyala secara tidak sengaja saat teknisi sedang bekerja.',
      EN: 'Ensure machinery or electrical panels cannot be energized accidentally during maintenance.'
    },
    keyPoints: {
      ID: [
        'Matikan sumber utama, pasang gembok (Padlock) pribadi, dan gantungkan Tagout berisi nama serta waktu isolasi.',
        'Wajib lakukan langkah TRY-OUT (tekan tombol start / ukur tegangan dengan tester) untuk memastikan energi benar-benar nol.',
        'Satu gembok hanya untuk satu pekerja—dilarang melepas gembok milik rekan kerja lain.'
      ],
      EN: [
        'Shut down the main power source, apply a personal padlock, and attach a completed Tagout label.',
        'Always perform a TRY-OUT test (press start / verify with multimeter) to confirm a zero-energy state.',
        'One lock per worker—never remove another technician’s lock under any circumstances.'
      ]
    },
    discussionQuestion: {
      ID: 'Selain listrik utama, apakah ada energi tersimpan (tekanan angin, pegas, atau gravitasi) pada mesin yang akan dikerjakan?',
      EN: 'Besides main electrical power, is there any stored energy (pneumatic, spring, or gravity) on the equipment?'
    }
  },
  {
    id: 'TBM-05',
    category: 'MANUAL',
    duration: '5 MIN',
    title: {
      ID: 'Teknik Angkat Manual Aman & Pencegahan Titik Jepit (Pinch Point)',
      EN: 'Safe Manual Handling & Pinch Point Prevention'
    },
    objective: {
      ID: 'Mencegah cedera punggung bawah (LBP) dan cedera jari terjepit saat memindahkan material secara manual.',
      EN: 'Prevent lower back injuries and crushed fingers when handling materials manually.'
    },
    keyPoints: {
      ID: [
        'Gunakan troli, hand pallet, atau bantu angkat berdua (team lift) untuk beban di atas 20 kg atau bentuk yang panjang.',
        'Tekuk lutut, jaga punggung tetap lurus, dan dekatkan beban ke pusat tubuh saat mengangkat.',
        'Pegang sisi samping material—hindari meletakkan jari di bagian bawah atau celah pertemuan dua benda keras.'
      ],
      EN: [
        'Use trolleys, pallet jacks, or a two-person team lift for loads over 20 kg or awkward shapes.',
        'Bend your knees, keep your back straight, and hold the load close to your core when lifting.',
        'Grip the sides of materials—keep fingers clear of bottom edges and pinch points between hard surfaces.'
      ]
    },
    discussionQuestion: {
      ID: 'Alat bantu angkut apa yang sudah kita siapkan di dekat area kerja agar tidak perlu memanggul beban jauh?',
      EN: 'What mechanical handling aids have we staged nearby to avoid carrying heavy loads manually?'
    }
  },
  {
    id: 'TBM-06',
    category: 'GENERAL',
    duration: '5 MIN',
    title: {
      ID: 'Housekeeping 5R & Kebersihan Jalur Evakuasi / APAR',
      EN: '5S Housekeeping & Clear Access to Exits and Fire Extinguishers'
    },
    objective: {
      ID: 'Mencegah insiden terpeleset/tersandung (Slips, Trips, Falls) serta menjaga kesiapan tanggap darurat.',
      EN: 'Prevent slips, trips, and falls while maintaining unobstructed emergency response access.'
    },
    keyPoints: {
      ID: [
        'Gulung atau gantung kabel ekstensi dan selang angin agar tidak melintang di jalur jalan pekerja.',
        'Segera bersihkan ceceran oli, air, atau plastik pembungkus di lantai kerja sebelum ditinggalkan.',
        'Pastikan area di depan APAR, Hydrant, dan pintu darurat bebas hambatan minimal radius 1 meter.'
      ],
      EN: [
        'Route or elevate extension cords and air hoses off main walkways to prevent trip hazards.',
        'Clean up oil spills, water, or loose shrink-wrap immediately rather than leaving them for later.',
        'Keep at least 1 meter of clear space in front of all fire extinguishers, hydrants, and emergency exits.'
      ]
    },
    discussionQuestion: {
      ID: 'Potensi tersandung atau tumpahan apa yang perlu langsung kita rapikan sebelum mulai pekerjaan utama?',
      EN: 'What trip hazards or spills in our zone should we clear right now before starting work?'
    }
  }
]

export default function ToolboxTalkLibraryPage() {
  const { lang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('ALL')
  const [activeTopic, setActiveTopic] = useState<TbmTopic | null>(null)

  useEffect(() => {
    setMounted(true)
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTopic(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const t = {
    ID: {
      hub: 'HUB',
      bc: 'K3L & OPERASIONAL',
      title: 'PERPUSTAKAAN TOOLBOX TALK (TBM)',
      subtitle: 'Kumpulan referensi materi briefing keselamatan 5 menit siap pakai untuk supervisor dan tim lapangan.',
      search_ph: 'Cari topik materi, bahaya, atau kata kunci...',
      cat_all: 'SEMUA TOPIK',
      cat_height: 'KETINGGIAN',
      cat_mhe: 'FORKLIFT / MHE',
      cat_lifting: 'LIFTING',
      cat_electrical: 'LISTRIK & LOTO',
      cat_manual: 'MANUAL HANDLING',
      cat_general: 'UMUM & 5R',
      btn_read: 'BUKA MATERI BRIEFING',
      modal_obj: 'TUJUAN BRIEFING',
      modal_points: 'POIN KUNCI YANG WAJIB DISAMPAIKAN',
      modal_ask: 'PERTANYAAN DISKUSI UNTUK TIM',
      btn_print: 'CETAK LEMBAR TBM',
      btn_close: 'TUTUP'
    },
    EN: {
      hub: 'HUB',
      bc: 'HSE & OPERATIONS',
      title: 'TOOLBOX TALK (TBM) LIBRARY',
      subtitle: 'Ready-to-use 5-minute safety briefing references for supervisors and field teams.',
      search_ph: 'Search topic, hazard, or keyword...',
      cat_all: 'ALL TOPICS',
      cat_height: 'WORK AT HEIGHT',
      cat_mhe: 'FORKLIFT / MHE',
      cat_lifting: 'LIFTING',
      cat_electrical: 'ELECTRICAL & LOTO',
      cat_manual: 'MANUAL HANDLING',
      cat_general: 'GENERAL & 5S',
      btn_read: 'OPEN BRIEFING SHEET',
      modal_obj: 'BRIEFING OBJECTIVE',
      modal_points: 'KEY SAFETY POINTS TO COVER',
      modal_ask: 'TEAM DISCUSSION PROMPT',
      btn_print: 'PRINT TBM SHEET',
      btn_close: 'CLOSE'
    }
  }[lang]

  const categories = [
    { key: 'ALL', label: t.cat_all },
    { key: 'HEIGHT', label: t.cat_height },
    { key: 'MHE', label: t.cat_mhe },
    { key: 'LIFTING', label: t.cat_lifting },
    { key: 'ELECTRICAL', label: t.cat_electrical },
    { key: 'MANUAL', label: t.cat_manual },
    { key: 'GENERAL', label: t.cat_general }
  ]

  const filteredTopics = TBM_LIBRARY.filter(item => {
    const matchCat = selectedCat === 'ALL' || item.category === selectedCat
    const q = search.toLowerCase().trim()
    const matchSearch =
      !q ||
      item.title[lang].toLowerCase().includes(q) ||
      item.objective[lang].toLowerCase().includes(q) ||
      item.keyPoints[lang].some(p => p.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  if (!mounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 w-full max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">{t.hub}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.bc}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          {t.title}
        </h1>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5">
          {t.subtitle}
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-3 print:hidden">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.search_ph}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
        />

        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCat(cat.key)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-[2px] border transition-colors ${
                selectedCat === cat.key
                  ? 'bg-teal-700 border-teal-700 text-white'
                  : 'bg-white dark:bg-[#0b0f19] border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* KATALOG KARTU MATERI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 rounded-[4px] p-5 flex flex-col justify-between gap-5 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[9px] font-black font-mono uppercase tracking-widest">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-[2px]">
                  {topic.id} • {topic.category}
                </span>
                <span className="text-teal-700 dark:text-teal-400">{topic.duration}</span>
              </div>

              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-snug">
                {topic.title[lang]}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {topic.objective[lang]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTopic(topic)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-teal-700 dark:hover:bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
            >
              {t.btn_read}
            </button>
          </div>
        ))}
      </div>

      {/* MODAL BACA & CETAK MATERI TBM */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:static print:bg-white print:p-0">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0b0f19] border-2 border-slate-900 dark:border-slate-700 rounded-[4px] p-6 sm:p-8 space-y-6 shadow-2xl print:border-4 print:border-black print:shadow-none print:max-w-full">
            <div className="flex items-start justify-between gap-4 border-b-2 border-slate-200 dark:border-slate-800 pb-4 print:border-black">
              <div>
                <span className="text-[10px] font-black font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 print:text-black">
                  {activeTopic.id} • {activeTopic.category} ({activeTopic.duration})
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase mt-1 print:text-black">
                  {activeTopic.title[lang]}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTopic(null)}
                className="px-2.5 py-1 text-xs font-black text-slate-500 hover:text-rose-600 border border-slate-300 dark:border-slate-700 rounded-[2px] print:hidden"
              >
                [X]
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 print:text-black">
                {t.modal_obj}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed print:text-black">
                {activeTopic.objective[lang]}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 print:text-black">
                {t.modal_points}
              </h3>
              <ul className="space-y-2.5">
                {activeTopic.keyPoints[lang].map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-[2px] text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 print:bg-white print:border-black print:text-black"
                  >
                    <span className="font-mono font-black text-teal-700 dark:text-teal-400 print:text-black">
                      0{i + 1}.
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-[2px] print:bg-slate-100 print:border-black">
              <span className="block text-[9px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-1 print:text-black">
                {t.modal_ask}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white print:text-black">
                “{activeTopic.discussionQuestion[lang]}”
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
              >
                {t.btn_print}
              </button>
              <button
                type="button"
                onClick={() => setActiveTopic(null)}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-[2px] transition-colors"
              >
                {t.btn_close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
