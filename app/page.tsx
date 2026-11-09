import Link from 'next/link'

export default function SyspexHubPage() {
  const modules = [
    { href: '/racking-swl', code: 'R', category: 'Engineering Tool', title: 'SWL Racking Calculator', desc: 'Validasi kapasitas balok, tiang upright, lendutan L/200, & Load Notice Plate.' },
    { href: '/lifting-plan', code: 'L', category: 'Rigging & Equipment', title: 'Lifting Plan & CoG', desc: 'Tegangan sling crane, center of gravity (CoG), dan izin pengangkatan.' },
    { href: '/scaffolding', code: 'S', category: 'Structure & Access', title: 'Scaffolding Design', desc: 'Estimasi material Main Frame T-170, pipa support, dan penerbitan Scafftag.' },
    { href: '/internal', code: 'D', category: 'Operational Dashboard', title: 'KPI & CAPA Dashboard', desc: 'Pantauan Safe Man-Hours, status temuan bahaya, dan log izin kerja.' },
    { href: '/executive-report', code: 'ER', category: 'Management Review', title: 'Executive Report (Dir)', desc: 'Laporan ringkasan tingkat tinggi (EN/ID) untuk Direktur terkait risiko K3.' },
    { href: '/ai-assistant', code: 'AI', category: 'Artificial Intelligence', title: 'HSE Copilot Assistant', desc: 'Konsultasi regulasi K3, penyusunan JSA, dan analisis data instan.' },
    { href: '/document-control', code: 'DC', category: 'ISO Compliance', title: 'Document Control', desc: 'Pengendalian informasi terdokumentasi (SOP, Kebijakan) sesuai Klausul 7.5.' },
    { href: '/env-log', code: 'EV', category: 'ISO 14001', title: 'B3 Waste & Env Log', desc: 'Pelacakan neraca limbah B3, manifest transporter, dan aspek lingkungan.' },
    { href: '/jsa', code: 'J', category: 'Safety Management', title: 'Job Safety Analysis', desc: 'Matriks mitigasi tahapan kerja, analisis risiko 5x5, & lembar persetujuan.' },
    { href: '/safety-talk', code: 'T', category: 'Daily HSE Operations', title: 'Daily Safety Talk (TBM)', desc: 'Pustaka materi briefing 5 menit operasional dan absensi pekerja.' },
    { href: '/induction', code: 'I', category: 'Security & Visitor', title: 'Safety Induction', desc: 'Registrasi orientasi K3 untuk tamu/vendor dan penerbitan Visitor Pass.' },
    { href: '/forklift-inspection', code: 'F', category: 'Heavy Equipment', title: 'Forklift Inspection', desc: 'Pemeriksaan pra-operasi harian dengan sistem penandaan Tag-Out.' },
    { href: '/loto', code: 'O', category: 'Machinery Maintenance', title: 'LOTO Permit & Tag', desc: 'Penerbitan kartu isolasi energi berbahaya untuk servis mesin.' },
    { href: '/hazard-report', code: 'H', category: 'Employee Participation', title: 'Hazard Hunting', desc: 'Pelaporan kondisi tidak aman dari HP untuk ditindaklanjuti tim HSE.' },
    { href: '/sio-silo', code: 'C', category: 'Compliance & Audit', title: 'SIO & SILO Tracker', desc: 'Basis data masa berlaku lisensi operator & sertifikat kelaikan alat.' }
  ]

  return (
    <div className="relative min-h-[85vh] w-full bg-slate-50 selection:bg-slate-900 selection:text-white pb-20">
      
      {/* Background Ornaments (Memecah kesan kaku template) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-200/50 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-slate-300/30 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 space-y-12">
        
        {/* Header Section (Lebih elegan dan berwibawa) */}
        <div className="max-w-3xl pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            System Live & Secured
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
            Engineering & HSE <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
              Operations Center.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
            Portal operasional terpadu untuk kalkulasi teknis struktur, validasi pengangkatan alat berat, dan manajemen kepatuhan K3L tingkat lanjut.
          </p>
        </div>

        {/* Grid Modules (Bento-style Cards, Glassmorphism, Premium Hover) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <Link 
              key={m.href} 
              href={m.href} 
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/60 backdrop-blur-lg border border-slate-200/60 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 overflow-hidden"
            >
              {/* Efek Garis Dekoratif saat Hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-colors duration-300 shadow-sm ${m.code === 'ER' ? 'bg-slate-900 text-white group-hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-800 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900'}`}>
                    {m.code}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100/80 px-2.5 py-1 rounded-full group-hover:bg-slate-100 transition-colors">
                    {m.category}
                  </span>
                </div>
                
                <h2 className="text-base font-black text-slate-900 tracking-tight group-hover:text-slate-800 transition-colors mb-2">
                  {m.title}
                </h2>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  {m.desc}
                </p>
              </div>

              {/* Tanda Panah Interaktif */}
              <div className="mt-6 flex items-center text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
                Buka Modul 
                <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
