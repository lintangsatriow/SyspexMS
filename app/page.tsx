import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto px-4 pt-6">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
            HSE
          </span>
          <span className="font-extrabold text-zinc-900 tracking-tight text-lg">
            AllAbout<span className="text-emerald-600">HSE</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-zinc-600">
          <Link href="/safety-talk" className="hover:text-zinc-900 transition">
            Safety Talk
          </Link>
          <Link href="/lifting-plan" className="hover:text-zinc-900 transition">
            Lifting Plan
          </Link>
          <Link href="/racking-swl" className="hover:text-zinc-900 transition text-amber-600 font-bold">
            Racking SWL
          </Link>
          <Link 
            href="/internal" 
            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition shadow-sm text-xs"
          >
            🔒 Internal Hub
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
          Portal Alat Bantu Praktisi K3 Indonesia
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
          AllAbout<span className="text-emerald-600">HSE</span> Toolkit
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          Kumpulan kalkulator standar, materi briefing harian, referensi engineering racking, dan dokumen K3 siap pakai untuk HSE Officer, Rigger, dan Tim Fabrikasi.
        </p>
      </div>

      {/* Grid Menu Modul (4 Kartu Lengkap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        
        {/* Modul 1: SWL Racking Gudang (Baru) */}
        <Link 
          href="/racking-swl"
          className="group block p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-amber-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg mb-3">
              📦
            </div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-amber-600 transition">
              Kalkulator SWL Racking
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Hitung beban balok beam, bay upright load, lendutan L/200, dan cetak pelat kapasitas resmi customer.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-4">
            Buka Kalkulator Racking &rarr;
          </span>
        </Link>

        {/* Modul 2: Lifting Plan */}
        <Link 
          href="/lifting-plan"
          className="group block p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-amber-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg mb-3">
              🏗️
            </div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-amber-600 transition">
              Lifting Plan &amp; CoG
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Distribusi beban 2 titik angkat, tegangan sling aktual, dan verifikasi batas aman kapasitas crane.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-4">
            Buka Kalkulator CoG &rarr;
          </span>
        </Link>

        {/* Modul 3: Safety Talk */}
        <Link 
          href="/safety-talk"
          className="group block p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-emerald-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg mb-3">
              📢
            </div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition">
              Daily Safety Talk
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Koleksi bahan briefing keselamatan kerja 5 menit dan pencatatan absensi briefing lapangan digital.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
            Buka Modul TBM &rarr;
          </span>
        </Link>

        {/* Modul 4: Statistik K3 */}
        <Link 
          href="/calculator"
          className="group block p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-emerald-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg mb-3">
              🧮
            </div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition">
              Statistik K3
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Kalkulator Man-Hours, LTIFR, TRIR, dan Severity Rate sesuai standar Kemenaker &amp; OSHA.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
            Buka Kalkulator &rarr;
          </span>
        </Link>

      </div>
    </div>
  )
}
