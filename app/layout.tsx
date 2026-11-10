import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Syspex HSE Portal',
  description: 'Integrated HSE Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* min-h-screen dan flex-col memastikan tinggi web sama dengan monitor */}
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        
        {/* HEADER / NAVBAR */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black text-teal-600 tracking-tighter">SYSPEX</span>
            </Link>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Management System</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-teal-600">HSE & Compliance Portal</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <Link href="/" className="hover:text-teal-600 transition">Main Hub</Link>
            <Link href="/executive-report" className="hover:text-teal-600 transition">KPI Dashboard</Link>
            <Link href="#" className="hover:text-teal-600 transition">Management & ISO ▾</Link>
            <Link href="#" className="hover:text-teal-600 transition">Technical & Calculators ▾</Link>
            <Link href="#" className="hover:text-teal-600 transition">HSE & Operations ▾</Link>
          </nav>

          <div>
            <Link href="/ai-assistant" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> AI Copilot
            </Link>
          </div>
        </header>

        {/* MAIN CONTAINER: flex-1 akan mengambil seluruh sisa ruang tengah yang kosong */}
        <main className="flex-1 flex flex-col justify-center w-full max-w-[1400px] mx-auto p-4 sm:p-6">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-white border-t border-slate-200 py-4 text-center">
          <p className="text-[11px] font-semibold text-slate-500">
            © 2026 Syspex — Integrated HSE Management System (ISO 9001 / 14001 / 45001 & SMK3)
          </p>
        </footer>

      </body>
    </html>
  )
}
