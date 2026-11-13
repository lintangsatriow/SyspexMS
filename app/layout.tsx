import { cookies } from 'next/headers'
import LogoutButton from './components/LogoutButton'
import './globals.css' // Sesuaikan dengan file CSS Anda

export const metadata = {
  title: 'SYSPEX.MS',
  description: 'Internal Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Cek tiket otentikasi langsung dari server
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.has('syspex_auth')

  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased">
        
        {/* NAVIGASI GLOBAL (Hanya muncul jika sudah login) */}
        {isLoggedIn && (
          <header className="flex justify-between items-center p-4 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 print:hidden transition-colors">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-700 dark:text-teal-500">
              <div className="w-2 h-2 bg-teal-500 rounded-sm"></div>
              SYSPEX.MS
            </div>
            
            <LogoutButton />
          </header>
        )}

        {/* Konten Halaman (Login, Dashboard, dll) akan dimuat di sini */}
        <main className={isLoggedIn ? "p-4 sm:p-6" : ""}>
          {children}
        </main>

      </body>
    </html>
  )
}
