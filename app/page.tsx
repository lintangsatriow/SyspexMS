import Link from 'next/link'

export default function SyspexHubPage() {
  const modules = [
    {
      href: '/racking-swl',
      code: 'R',
      category: 'Engineering Tool',
      title: 'Kalkulator SWL Racking',
      desc: 'Validasi kapasitas aman balok (beam), tiang upright, lendutan defleksi L/200, dan cetak Safety Load Notice Plate.',
      tag: 'Kalkulator Aktif'
    },
    {
      href: '/lifting-plan',
      code: 'L',
      category: 'Rigging & Equipment',
      title: 'Lifting Plan & CoG',
      desc: 'Perhitungan tegangan sling crane, center of gravity (CoG), ekstensi garpu forklift, dan izin kerja berisiko tinggi (PTW).',
      tag: 'Izin Kerja Aktif'
    },
    {
      href: '/scaffolding',
      code: 'S',
      category: 'Structure & Access',
      title: 'Desain Scaffolding (BoQ)',
      desc: 'Estimasi material Main Frame T-170, validasi tangga akses vertikal, pipa pengaku outrigger, dan penerbitan Scafftag.',
      tag: 'BoQ & Tag Aktif'
    },
    {
      href: '/internal',
      code: 'D',
      category: 'Executive Overview',
      title: 'Dashboard KPI & CAPA',
      desc: 'Pantauan jam kerja aman (Safe Man-Hours), status penutupan temuan bahaya (CAPA), dan log izin kerja shift aktif.',
      tag: 'Monitoring Live'
    },
    {
      href: '/safety-talk',
      code: 'T',
      category: 'Daily HSE Operations',
      title: 'Daily Safety Talk (TBM)',
      desc: 'Pustaka materi briefing 5 menit (mesin strapping/wrapping, blindspot forklift, racking) dan absensi pekerja.',
      tag: 'Siap Digunakan'
    },
    {
      href: '/induction',
      code: 'I',
      category: 'Security & Visitor',
      title: 'Safety Induction Tamu',
      desc: 'Registrasi orientasi K3 untuk tamu/kontraktor, persetujuan tata tertib pabrik, dan penerbitan Visitor Pass digital.',
      tag: 'Siap Digunakan'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Elegan & Bersih */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
            Syspex Internal Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineering &amp; HSE Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Portal operasional terpadu kalkulasi teknis struktur, validasi pengangkatan alat berat, dan kepatuhan K3 internal.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Semua Modul Siap Digunakan
          </span>
        </div>
      </div>

      {/* Grid 6 Modul Seragam & Rapi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors duration-200">
                  {m.code}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {m.category}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 transition">
                {m.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {m.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {m.tag}
              </span>
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 flex items-center gap-1 transition">
                <span>Buka</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
