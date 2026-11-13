import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Mengecek apakah browser user memiliki cookie 'syspex_auth'
  const hasAuth = request.cookies.has('syspex_auth')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Jika belum login dan mencoba membuka halaman selain /login -> Lempar ke /login
  if (!hasAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login tapi mencoba membuka /login lagi -> Kembalikan ke HUB (/)
  if (hasAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Tentukan rute mana saja yang dijaga (semua rute kecuali aset statis/gambar)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
