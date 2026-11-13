import { cookies } from 'next/headers'
import './globals.css'
import ClientSidebarLayout from './components/ClientSidebarLayout'
import { ThemeProvider } from './ThemeContext'
import { LanguageProvider } from './LanguageContext'

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
        
        {/* PROVIDER HARUS BERADA DI ROOT AGAR REACT TIDAK CRASH */}
        <ThemeProvider>
          <LanguageProvider>
            
            {!isLoggedIn ? (
              <main className="w-full flex-1 min-h-screen flex flex-col">
                {children}
              </main>
            ) : (
              <ClientSidebarLayout>
                {children}
              </ClientSidebarLayout>
            )}

          </LanguageProvider>
        </ThemeProvider>

      </body>
    </html>
  )
}
