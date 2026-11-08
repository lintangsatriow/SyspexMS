import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Syspex Management System',
  description: 'Internal Operations Hub for Syspex Engineering and HSE Teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
        
        {/* Topbar Internal Enterprise */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 print:hidden transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo & Identitas Sistem */}
            <Link href="/" className="flex items-center gap-3.5 hover:opacity-85 transition group shrink-0">
              <img 
                src="/Syspex%20Logo%20(Trademark)%20black.png" 
                alt="Syspex" 
                className="h-7 w-auto object-contain" 
              />
              <div className="h-6 w-px bg-slate-200 group-hover:bg-slate-300 transition"></div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black tracking-tight text-slate-900 leading-none">
                  MANAGEMENT SYSTEM
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  INTERNAL PORTAL
                </span>
              </div>
            </Link>

            {/* Navigasi Dropdown Elegan */}
            <nav className="flex items-center gap-2">
              <Link 
                href="/" 
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Hub Utama
              </Link>
              <Link 
                href="/internal" 
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Dashboard KPI
              </Link>

              {/* Garis Pemisah */}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>

              {/* Dropdown 1: Kalkulator Teknik */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">
                  <span>Kalkulator Teknik</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engineering Tools</div>
                  <Link href="/racking-swl" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">R</span>
                    <span>SWL Racking Gudang</span>
                  </Link>
                  <Link href="/lifting-plan" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">L</span>
                    <span>Lifting Plan &amp; CoG</span>
                  </Link>
                  <Link href="/scaffolding" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">S</span>
                    <span>Desain Scaffolding Frame</span>
                  </Link>
                </div>
              </div>

              {/* Dropdown 2: K3 & Lapangan */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">
                  <span>K3 &amp; Operasional</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">HSE Operations</div>
                  <Link href="/safety-talk" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">T</span>
                    <span>Daily Safety Talk (TBM)</span>
                  </Link>
                  <Link href="/induction" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">I</span>
                    <span>Safety Induction Tamu</span>
                  </Link>
                </div>
              </div>

            </nav>

          </div>
        </header>

        {/* Konten Utama */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

      </body>
    </html>
  )
}
