"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    // Simulasi loading mekanikal singkat
    setTimeout(() => {
      // GANTI USERNAME DAN PASSWORD DI SINI
      if (username === 'admin' && password === 'syspex2026') {
        // Tanamkan tiket otentikasi (berlaku 1 hari)
        document.cookie = "syspex_auth=true; path=/; max-age=86400"
        router.push('/')
      } else {
        setError(true)
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-teal-500/30 font-sans">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-800 p-8 rounded-[4px] shadow-2xl relative overflow-hidden">
        
        {/* Aksen Garis Atas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-700 to-cyan-600"></div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-teal-500 animate-pulse"></div>
            <h1 className="text-xs font-black uppercase tracking-widest text-teal-500">SYSPEX.MS</h1>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Access</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Identification</label>
            <input 
              type="text" 
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 text-white text-xs font-mono px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-teal-600 transition-colors"
              placeholder="Username"
            />
          </div>
          
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 text-white text-xs font-mono px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-teal-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-rose-950/50 border border-rose-800 text-rose-500 text-[9px] font-black uppercase tracking-widest p-2 rounded-[2px] text-center">
              ACCESS DENIED. INVALID CREDENTIALS.
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-[2px] transition-colors mt-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'AUTHENTICATING...' : 'ENGAGE LOGIN'}
          </button>
        </form>
        
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
          <span>SECURE CONNECTION</span>
          <span>v2.0.4</span>
        </div>
      </div>
    </div>
  )
}
