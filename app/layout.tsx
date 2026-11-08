import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Syspex Management System | HSE & Engineering',
  description: 'Internal Operations Hub for Syspex Engineering and HSE Teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased">
        
        {/* Topbar Internal Enterprise (Navigasi Global) */}
        <header className="bg-white border-b border-slate-300 sticky top-0 z-50 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo & Identitas Sistem */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group shrink-0">
              <img 
                src="/Syspex%20Logo%20(Trademark)%20black.png" 
                alt="Syspex" 
                className="h-7 w-auto object-contain" 
              />
              <div className="h-6 w-px bg-slate-300 group-hover:bg-slate-400 transition"></div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black tracking-tight text-slate-900 leading-none">
                  MANAGEMENT SYSTEM
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Internal Hub
                </span>
              </div>
            </Link>

            {/* Navigasi Utama (Berisi Semua Modul Aktif) */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
              <Link href="/" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Hub Utama
              </Link>
              <Link href="/internal" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Dashboard
              </Link>
              
              {/* Garis Pemisah (Divider) */}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              
              <Link href="/racking-swl" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Racking
              </Link>
              <Link href="/lifting-plan" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Lifting Plan
              </Link>
              <Link href="/scaffolding" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Scaffolding
              </Link>
              
              {/* Garis Pemisah (Divider) */}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              
              <Link href="/safety-talk" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Safety Talk
              </Link>
              <Link href="/induction" className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap">
                Induction
              </Link>
            </nav>

          </div>
        </header>

        {/* Area Konten Utama */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

      </body>
    </html>
  )
}
