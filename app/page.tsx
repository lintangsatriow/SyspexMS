"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Validasi kredensial ke server Firebase
      await signInWithEmailAndPassword(auth, email, password)
      
      // 2. Set cookie lokal agar middleware Next.js mengizinkan akses ke dalam aplikasi
      document.cookie = "syspex_auth=true; path=/; max-age=86400"
      
      // 3. Arahkan ke Dasbor Utama
      router.push('/')
    } catch (err) {
      console.error(err)
      setError('Email atau sandi salah, atau akun belum didaftarkan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] p-4 animate-in fade-in duration-300">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">SYSPEX HSE</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase mt-1">Admin Login</h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase tracking-widest rounded-[2px] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-widest">Email Admin</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              placeholder="admin@syspex.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-widest">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 mt-2 bg-teal-700 hover:bg-teal-600 text-white rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? 'MEMVERIFIKASI...' : 'MASUK'}
          </button>
        </form>
      </div>
    </div>
  )
}
