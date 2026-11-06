import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AllAboutHSE Portal & Engineering Toolkit',
  description: 'Sistem Terpadu Manajemen K3, Racking SWL, dan Perencanaan Operasional.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col`}>
        
        {/* Top Navbar Modern & Luas (Tanpa Sidebar Sempit) */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            
            {/* Logo Brand Minimalis */}
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center tracking-wider">
                HSE
              </span>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-none">
                  AllAbout<span className="text-emerald-600">HSE</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  Workspace
                </span>
              </div>
            </Link>

            {/* Menu Navigasi Atas Lengkap */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/internal" 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Dashboard K3
              </Link>
              <Link 
                href="/racking-swl" 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                SWL Racking
              </Link>
              <Link 
                href="/lifting-plan" 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Lifting Plan
              </Link>
              <Link 
                href="/safety-talk" 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Safety Talk
              </Link>
              <Link 
                href="/induction" 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Induksi Tamu
              </Link>
            </nav>

          </div>
        </header>

        {/* Konten Halaman Full-Width */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </body>
    </html>
  )
}
