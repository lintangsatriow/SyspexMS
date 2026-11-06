import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-16">
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
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-zinc-600">
          <Link href="/calculator" className="hover:text-zinc-900 transition">
            Statistik K3
          </Link>
          <Link href="/safety-talk" className="hover:text-zinc-900 transition">
            Safety Talk
          </Link>
          <Link 
            href="/lifting-plan" 
            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition shadow-sm"
          >
            Lifting Plan
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
          Kumpulan kalkulator standar, materi briefing harian, dan referensi dokumen K3 siap pakai untuk HSE Officer, Rigger, Supervisor, dan Manajemen Lapangan.
        </p>
      </div>

      {/* Grid Menu Modul */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1: Safety Talk */}
        <Link 
          href="/safety-talk"
          className="group block p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-emerald-500 hover:shadow-md transition duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg mb-4">
            📢
          </div>
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition">
            Daily Safety Talk / TBM
          </h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Koleksi panduan briefing keselamatan 5 menit di lapangan berbasis critical hazard beserta form log absensi digital.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
            Buka Modul TBM &rarr;
          </span>
        </Link>

        {/* Card 2: Lifting Plan & CoG (Baru) */}
        <Link 
          href="/lifting-plan"
          className="group block p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-amber-500 hover:shadow-md transition duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg mb-4">
            🏗️
          </div>
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-amber-600 transition">
            Lifting Plan &amp; CoG Calculator
          </h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Hitung distribusi beban 2 titik, tegangan sling aktual, posisi CoG, dan verifikasi batas aman kapasitas crane.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-4">
            Buka Kalkulator CoG &rarr;
          </span>
        </Link>

        {/* Card 3: Statistik K3 */}
        <Link 
          href="/calculator"
          className="group block p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-emerald-500 hover:shadow-md transition duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg mb-4">
            🧮
          </div>
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition">
            Kalkulator Statistik K3
          </h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Hitung otomatis Man-Hours, LTIFR, TRIR (OSHA 200k), DART Rate, dan Severity Rate sesuai standar Kemenaker &amp; ILO.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
            Buka Kalkulator Online &rarr;
          </span>
        </Link>
      </div>
    </div>
  )
}
