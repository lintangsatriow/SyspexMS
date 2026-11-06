'use client';

import Link from 'next/link';

export default function PublicPortal() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Bio Link */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          ✨ Portal Alat Bantu Praktisi K3 Indonesia
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AllAbout<span className="text-emerald-600">HSE</span> Toolkit
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Kumpulan kalkulator standar, materi briefing harian, dan referensi
          dokumen K3 siap pakai untuk HSE Officer, Supervisor, dan Mahasiswa.
        </p>
      </div>

      {/* Grid Alat Publik yang Relate untuk Semua Orang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tool 1: Kalkulator K3 */}
        <Link
          href="/calculator"
          className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-105 transition">
              🧮
            </div>
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
              Kalkulator Statistik K3 (HSE Metrics)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hitung otomatis Man-Hours, LTIFR, TRIR (OSHA 200k), DART Rate, dan
              Severity Rate sesuai standar Kemenaker & ILO tanpa rumus manual.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Buka Kalkulator Online</span>
            <span>→</span>
          </div>
        </Link>

        {/* Tool 2: Safety Talk / TBM */}
        <Link
          href="/safety-talk"
          className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500/50 transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-105 transition">
              📢
            </div>
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
              Daily Safety Talk / TBM Topics
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Koleksi bahan briefing keselamatan kerja 5 menit siap baca di
              lapangan (ruang terbatas, blind spot, bahaya listrik, cuaca
              ekstrem).
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Lihat Topik Briefing</span>
            <span>→</span>
          </div>
        </Link>

        {/* Tool 3: Format Template K3 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between opacity-85">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              📂
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Pustaka Template Dokumen
              </h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Segera
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format baku Job Safety Analysis (JSA), format HIRADC/IBPR, dan
              form inspeksi siap unduh format Word/Excel.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400">
            Tahap Pengumpulan Template
          </div>
        </div>

        {/* Tool 4: Matriks Regulasi K3 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between opacity-85">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Pencarian Regulasi & UU K3
              </h2>
              <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                Segera
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ringkasan regulasi Kemenaker, PP 50/2012, dan standar teknis
              keselamatan kerja yang dapat dicari per kata kunci.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400">
            Dalam Proses Penyusunan
          </div>
        </div>
      </div>

      {/* Footer Link Rahasia ke Workspace Internal Anda */}
      <div className="text-center pt-8 border-t border-slate-200">
        <Link
          href="/internal"
          className="text-xs text-slate-400 hover:text-slate-600 transition"
        >
          🔒 Akses Workspace Internal Pribadi
        </Link>
      </div>
    </div>
  );
}
