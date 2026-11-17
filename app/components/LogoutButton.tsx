"use client"

import { signOut } from 'firebase/auth'
import { auth } from './lib/firebase' // Sesuaikan path jika posisinya berbeda

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. Hapus sesi di server Firebase
      await signOut(auth)
      // 2. Hapus cookie lokal
      document.cookie = "syspex_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      // 3. Kembali ke login
      window.location.href = '/login'
    } catch (error) {
      console.error("Gagal logout:", error)
    }
  }

  return (
    <button 
      onClick={handleLogout} 
      className="w-full px-3 py-2 bg-rose-950/40 text-rose-500 border border-rose-800 hover:bg-rose-900 hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
    >
      LOGOUT
    </button>
  )
}
