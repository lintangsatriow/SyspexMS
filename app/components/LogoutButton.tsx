"use client"

export default function LogoutButton() {
  const handleLogout = () => {
    document.cookie = "syspex_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    window.location.href = '/login'
  }

  return (
    <button 
      onClick={handleLogout} 
      className="w-full px-3 py-2 bg-rose-950/40 text-rose-500 border border-rose-800 hover:bg-rose-900 hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
    >
      LOGOUT SYSTEM
    </button>
  )
}
