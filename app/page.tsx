import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-16 pt-4">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
          Portal Alat Bantu Praktisi K3 Indonesia
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
          AllAbout<span className="text-emerald-600">HSE</span> Toolkit
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Kumpulan kalkulator standar, materi briefing harian, referensi engineering fabrikasi, dan dokumen K3 siap pakai untuk HSE Officer, Rigger, dan Tim Teknis Syspex.
        </p>
      </div>

      {/* Grid Menu Modul */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        
        {/* Modul 1: SWL Racking */}
        <Link href="/racking-swl" className="group block p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition duration-200 flex flex-col justify-between h-full">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">Kalkulator SWL Racking</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Hitung beban balok beam, bay upright load, lendutan L/200, dan cetak pelat kapasitas resmi customer.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-5">Buka Kalkulator &rarr;</span>
        </Link>

        {/* Modul 2: Lifting Plan */}
        <Link href="/lifting-plan" className="group block p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition duration-200 flex flex-col justify-between h-full">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">🏗️</div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">Lifting Plan &amp; CoG</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Distribusi beban 2 titik angkat, tegangan sling aktual, dan verifikasi batas aman kapasitas crane.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-5">Buka Kalkulator CoG &rarr;</span>
        </Link>

        {/* Modul 3: Desain Scaffolding */}
        <Link href="/scaffolding" className="group block p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between h-full">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4">🪜</div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">Desain Scaffolding (BoQ)</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Kalkulasi otomatis material perancah (pipa, klem, papan) dan verifikasi standar batas bentang EN-12811.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-5">Buka Kalkulator &rarr;</span>
        </Link>

        {/* // TODO: Bangun modul Safety Talk */}
        {/* Modul 4: Safety Talk (DISABLED) */}
        <div className="block p-6 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col justify-between h-full opacity-70 cursor-not-allowed">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center text-2xl mb-4 grayscale">📢</div>
            <h3 className="text-lg font-bold text-slate-700">Daily Safety Talk</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Koleksi bahan briefing keselamatan kerja 5 menit dan pencatatan absensi briefing lapangan digital.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 mt-5 uppercase tracking-wider bg-slate-200 w-fit px-2 py-1 rounded">Coming Soon</span>
        </div>

        {/* // TODO: Bangun modul Induksi Tamu */}
        {/* Modul 5: Induksi Tamu (DISABLED) */}
        <div className="block p-6 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col justify-between h-full opacity-70 cursor-not-allowed">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center text-2xl mb-4 grayscale">🪪</div>
            <h3 className="text-lg font-bold text-slate-700">Safety Induction</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Registrasi pengenalan bahaya kerja lokasi, pemahaman APD, dan penerbitan visitor pass tamu/vendor.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 mt-5 uppercase tracking-wider bg-slate-200 w-fit px-2 py-1 rounded">Coming Soon</span>
        </div>

        {/* // TODO: Bangun modul Statistik K3 */}
        {/* Modul 6: Statistik K3 (DISABLED) */}
        <div className="block p-6 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col justify-between h-full opacity-70 cursor-not-allowed">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center text-2xl mb-4 grayscale">🧮</div>
            <h3 className="text-lg font-bold text-slate-700">Statistik K3</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Kalkulator metrik insiden (Man-Hours, LTIFR, TRIR, Severity Rate) sesuai standar Kemenaker &amp; OSHA.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 mt-5 uppercase tracking-wider bg-slate-200 w-fit px-2 py-1 rounded">Coming Soon</span>
        </div>

      </div>
    </div>
  )
}
