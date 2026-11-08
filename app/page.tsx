import Link from 'next/link'

export default function SyspexHubPage() {
  const modules = [
    {
      href: '/racking-swl',
      code: 'R',
      category: 'Engineering Tool',
      title: 'Kalkulator SWL Racking',
      desc: 'Validasi kapasitas balok (beam), tiang upright, lendutan L/200, dan cetak Load Notice Plate resmi.'
    },
    {
      href: '/lifting-plan',
      code: 'L',
      category: 'Rigging & Equipment',
      title: 'Lifting Plan & CoG',
      desc: 'Tegangan sling crane, center of gravity (CoG), ekstensi garpu forklift, dan izin pengangkatan (PTW).'
    },
    {
      href: '/scaffolding',
      code: 'S',
      category: 'Structure & Access',
      title: 'Desain Scaffolding (BoQ)',
      desc: 'Estimasi material Main Frame T-170, tangga akses vertikal, pipa support pengaku, dan penerbitan Scafftag.'
    },
    {
      href: '/internal',
      code: 'D',
      category: 'Executive Overview',
      title: 'Dashboard KPI & CAPA',
      desc: 'Pantauan jam kerja aman (Safe Man-Hours), status temuan bahaya (CAPA), dan log izin kerja harian.'
    },
    {
      href: '/jsa',
      code: 'J',
      category: 'Safety Management',
      title: 'Job Safety Analysis (JSA)',
      desc: 'Matriks mitigasi tahapan kerja teknis, analisis risiko 5x5, dan lembar persetujuan izin kerja berisiko.'
    },
    {
      href: '/safety-talk',
      code: 'T',
      category: 'Daily HSE Operations',
      title: 'Daily Safety Talk (TBM)',
      desc: 'Pustaka materi briefing 5 menit (mesin wrapping/strapping, forklift, racking) dan absensi pekerja.'
    },
    {
      href: '/induction',
      code: 'I',
      category: 'Security & Visitor',
      title: 'Safety Induction Tamu',
      desc: 'Registrasi orientasi K3 untuk tamu/vendor, persetujuan tata tertib pabrik, dan penerbitan Visitor Pass.'
    },
    {
      href: '/forklift-inspection',
      code: 'F',
      category: 'Heavy Equipment',
      title: 'Inspeksi Harian Forklift',
      desc: 'Pemeriksaan pra-operasi rem, kemudi, hidrolik, dan rantai garpu dengan sistem penandaan otomatis Tag-Out.'
    },
    {
      href: '/loto',
      code: 'O',
      category: 'Machinery Maintenance',
      title: 'LOTO Permit & Danger Tag',
      desc: 'Penerbitan kartu isolasi energi berbahaya (listrik, pneumatik) untuk servis mesin packaging/strapping.'
    },
    {
      href: '/hazard-report',
      code: 'H',
      category: 'Employee Participation',
      title: 'Hazard Hunting / Near Miss',
      desc: 'Pelaporan cepat kondisi tidak aman atau insiden nyaris celaka dari HP untuk ditindaklanjuti tim HSE.'
    },
    {
      href: '/sio-silo',
      code: 'C',
      category: 'Compliance & Audit',
      title: 'Tracker SIO & SILO',
      desc: 'Basis data pemantauan masa berlaku lisensi operator dan sertifikat kelaikan mesin/alat berat.'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Elegan & Minimalis */}
      <div className="border-b border-slate-200 pb-6">
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

      {/* Grid Kartu Tanpa Footer / Tombol Teks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all duration-200 flex flex-col justify-start"
          >
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
          </Link>
        ))}
      </div>

    </div>
  )
}
