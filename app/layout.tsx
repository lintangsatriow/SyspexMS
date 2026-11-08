"use client"

import './globals.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<'calc' | 'hse' | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('syspex_session')
    if (session === 'active') setIsAuthenticated(true)
    setIsCheckingAuth(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'syspex123') {
      localStorage.setItem('syspex_session', 'active')
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Username atau kata sandi tidak valid.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('syspex_session')
    setIsAuthenticated(false)
    setMobileMenuOpen(false)
  }

  const toggleAccordion = (menu: 'calc' | 'hse') => setOpenAccordion(openAccordion === menu ? null : menu)
  const closeMenu = () => { setMobileMenuOpen(false); setOpenAccordion(null) }

  if (isCheckingAuth) return <html lang="id"><body className="bg-slate-50 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div></body></html>

  if (!isAuthenticated) return (
    <html lang="id">
      <body className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased selection:bg-slate-900 selection:text-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 pb-6 border-b border-slate-100 text-center">
            <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-8 mx-auto object-contain mb-4" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Internal Access Only</h1>
            <p className="text-xs text-slate-500 mt-1">Silakan masuk untuk mengakses Management System.</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg text-center">{loginError}</div>}
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition" placeholder="ID Karyawan / admin..." /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 focus:bg-white transition" placeholder="••••••••" /></div>
            <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition shadow-md mt-2">Log In securely</button>
            <p className="text-[10px] text-slate-400 text-center mt-4">Area terbatas. Segala aktivitas di dalam sistem ini terekam untuk keperluan audit operasional Syspex.</p>
          </form>
        </div>
      </body>
    </html>
  )

  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 print:hidden transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 sm:gap-3.5 hover:opacity-85 transition group shrink-0">
              <img src="/Syspex%20Logo%20(Trademark)%20black.png" alt="Syspex" className="h-6 sm:h-7 w-auto object-contain" />
              <div className="h-5 sm:h-6 w-px bg-slate-200 group-hover:bg-slate-300 transition"></div>
              <span className="text-xs sm:text-[13px] font-black tracking-tight text-slate-900 leading-none">MANAGEMENT SYSTEM</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              <Link href="/" className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">Hub Utama</Link>
              <Link href="/internal" className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">Dashboard KPI</Link>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>

              {/* Kalkulator Teknis */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">
                  <span>Kalkulator &amp; Teknis</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engineering Tools</div>
                  <Link href="/racking-swl" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">R</span><span>SWL Racking Gudang</span></Link>
                  <Link href="/lifting-plan" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">L</span><span>Lifting Plan &amp; CoG</span></Link>
                  <Link href="/scaffolding" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">S</span><span>Desain Scaffolding</span></Link>
                  <Link href="/forklift-inspection" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition border-t border-slate-100 mt-1 pt-2"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">F</span><span>Inspeksi Harian Forklift</span></Link>
                  <Link href="/loto" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">O</span><span>LOTO Permit &amp; Tag</span></Link>
                </div>
              </div>

              {/* K3 & Operasional */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition">
                  <span>K3 &amp; Operasional</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">HSE &amp; Compliance</div>
                  <Link href="/ai-assistant" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition bg-emerald-50/50"><span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px]">AI</span><span>HSE Copilot (AI)</span></Link>
                  <Link href="/document-control" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">DC</span><span>Master Document Control</span></Link>
                  <Link href="/env-log" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">EV</span><span>B3 Waste &amp; Env Log</span></Link>
                  <Link href="/jsa" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition border-t border-slate-100 mt-1 pt-2"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">J</span><span>Job Safety Analysis (JSA)</span></Link>
                  <Link href="/safety-talk" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">T</span><span>Daily Safety Talk (TBM)</span></Link>
                  <Link href="/induction" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">I</span><span>Safety Induction Tamu</span></Link>
                  <Link href="/hazard-report" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition border-t border-slate-100 mt-1 pt-2"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">H</span><span>Hazard Hunting / Near Miss</span></Link>
                  <Link href="/sio-silo" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px]">C</span><span>Tracker SIO &amp; SILO</span></Link>
                </div>
              </div>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition">Log Out</button>
            </nav>

            <div className="flex md:hidden items-center gap-3">
              <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">LOGOUT</button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
              </button>
            </div>
          </div>

          {/* Drawer HP */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top-2 shadow-xl max-h-[80vh] overflow-y-auto">
              <Link href="/" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50">Hub Utama</Link>
              <Link href="/internal" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50">Dashboard KPI</Link>

              <div className="border-t border-slate-100 pt-2">
                <button onClick={() => toggleAccordion('calc')} className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
                  <span className="uppercase tracking-wider text-[11px] text-slate-400">Kalkulator &amp; Teknis</span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openAccordion === 'calc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openAccordion === 'calc' && (
                  <div className="pl-3 pr-1 py-1 space-y-1">
                    <Link href="/racking-swl" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">SWL Racking</Link>
                    <Link href="/lifting-plan" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Lifting Plan &amp; CoG</Link>
                    <Link href="/scaffolding" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Desain Scaffolding</Link>
                    <Link href="/forklift-inspection" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Inspeksi Forklift</Link>
                    <Link href="/loto" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">LOTO Permit</Link>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-2">
                <button onClick={() => toggleAccordion('hse')} className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
                  <span className="uppercase tracking-wider text-[11px] text-slate-400">K3 &amp; Operasional</span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openAccordion === 'hse' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openAccordion === 'hse' && (
                  <div className="pl-3 pr-1 py-1 space-y-1">
                    <Link href="/ai-assistant" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded">HSE Copilot (AI)</Link>
                    <Link href="/document-control" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Document Control</Link>
                    <Link href="/env-log" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">B3 Waste &amp; Env Log</Link>
                    <Link href="/jsa" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">JSA Generator</Link>
                    <Link href="/safety-talk" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Daily Safety Talk</Link>
                    <Link href="/induction" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Safety Induction</Link>
                    <Link href="/hazard-report" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Hazard Hunting</Link>
                    <Link href="/sio-silo" onClick={closeMenu} className="block px-3 py-2 text-xs font-semibold text-slate-700">Tracker SIO &amp; SILO</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      </body>
    </html>
  )
}
