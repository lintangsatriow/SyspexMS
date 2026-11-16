import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. IZINKAN AKSES PUBLIK (TANPA LOGIN ADMIN)
  // Rute ini bisa diakses langsung oleh seluruh karyawan/tamu via QR Code di lapangan
  const publicPaths = [
    '/login',
    '/hazard-report',
    '/induction'
  ]

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // 2. PROTEKSI HALAMAN ADMIN & EKSEKUTIF
  // Memeriksa cookie autentikasi 'syspex_auth'
  const authCookie = request.cookies.get('syspex_auth')

  if (!authCookie || !authCookie.value) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Konfigurasi agar aset gambar, logo, dan file sistem Next.js tidak ikut terblokir
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
