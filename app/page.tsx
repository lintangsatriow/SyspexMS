import Link from 'next/link'

export default function SyspexHubPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Fungsional (R-05) */}
      <div className="border-b border-slate-300 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Engineering &amp; HSE Operations Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Pusat akses modul kalkulasi beban teknis, desain struktur fabrikasi sementara, dan pemantauan keselamatan kerja khusus tim internal Syspex.
        </p>
      </div>

      {/* Grid Menu Modul (Seragam, Fungsional, Tanpa Elemen Dekoratif) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Modul 1: SWL Racking */}
        <Link href="/racking-swl" className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold">R</div>
              <h2 className="text-sm font-bold text-slate-900">Kalkulator SWL Racking</h2>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Validasi batas aman beban balok (beam), upright frame, dan batas lendutan (deflection) L/200.
            </p>
          </div>
        </Link>

        {/* Modul 2: Lifting Plan */}
        <Link href="/lifting-plan" className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold">L</div>
              <h2 className="text-sm font-bold text-slate-900">Lifting Plan &amp; CoG</h2>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Perhitungan Center of Gravity (CoG) Forklift dan tegangan sling Crane untuk pengangkatan kritis material.
            </p>
          </div>
        </Link>

        {/* Modul 3: Desain Scaffolding */}
        <Link href="/scaffolding" className="block p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold">S</div>
              <h2 className="text-sm font-bold text-slate-900">Desain Scaffolding (BoQ)</h2>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Estimasi material Main Frame dan verifikasi standar batas bentang perancah kerja fabrikasi.
            </p>
          </div>
        </Link>

        {/* Modul 4: Dashboard KPI (Highlighted) */}
        <Link href="/internal" className="block p-5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition flex flex-col justify-between h-full shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-bold">D</div>
              <h2 className="text-sm font-bold text-white">Dashboard KPI &amp; CAPA</h2>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pusat pantauan metrik jam kerja aman (Man-Hours) dan pelacakan status mitigasi temuan bahaya lapangan.
            </p>
          </div>
        </Link>

        {/* ========================================= */}
        {/* FITUR DALAM PENGEMBANGAN (R-26 Compliance) */}
        {/* ========================================= */}

        {/* Modul 5 (TODO): Daily Safety Talk */}
        <div className="block p-5 rounded-xl bg-slate-50 border border-slate-200 border-dashed flex flex-col justify-between h-full opacity-60">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-200 text-slate-500 flex items-center justify-center font-bold">T</div>
              <h2 className="text-sm font-bold text-slate-700">Daily Safety Talk</h2>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pencatatan absensi briefing harian dan repositori materi Toolbox Meeting.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-wider bg-slate-200 w-fit px-2 py-0.5 rounded">Dalam Pengembangan</span>
        </div>

        {/* Modul 6 (TODO): Safety Induction */}
        <div className="block p-5 rounded-xl bg-slate-50 border border-slate-200 border-dashed flex flex-col justify-between h-full opacity-60">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-200 text-slate-500 flex items-center justify-center font-bold">I</div>
              <h2 className="text-sm font-bold text-slate-700">Safety Induction</h2>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Registrasi orientasi K3 untuk tamu, kontraktor, dan karyawan baru.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-wider bg-slate-200 w-fit px-2 py-0.5 rounded">Dalam Pengembangan</span>
        </div>

      </div>
    </div>
  )
}
