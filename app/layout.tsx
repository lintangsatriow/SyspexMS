import { cookies } from 'next/headers'
import LogoutButton from './components/LogoutButton'
import './globals.css'
import ClientSidebarLayout from './components/ClientSidebarLayout' // Anda perlu memindahkan SidebarLayout ke komponen terpisah, lihat penjelasan di bawah

export const metadata = {
  title: 'Syspex Management System',
  description: 'Industrial HSE Management System for Syspex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Cek tiket otentikasi dari server
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.has('syspex_auth')

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon-syspex.png?v=3" type="image/png" />
      </head>
      <body className="bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans antialiased selection:bg-teal-500 selection:text-white overflow-x-hidden">
        {/* Jika belum login (misal sedang di halaman /login), render children polos tanpa Sidebar */}
        {!isLoggedIn ? (
          <main className="w-full flex-1">
            {children}
          </main>
        ) : (
          /* Jika sudah login, bungkus dengan Sidebar dan Provider lengkap */
          <ClientSidebarLayout>
            {children}
          </ClientSidebarLayout>
        )}
      </body>
    </html>
  )
}
