"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LicenseItem {
  id: string
  category: 'SIO Operator' | 'SILO Alat/Mesin'
  nameOrUnit: string
  regNumber: string
  issueDate: string
  expiryDate: string
  authority: string
}

export default function SioSiloTrackerPage() {
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const [licenses] = useState<LicenseItem[]>([
    {
      id: 'LIC-01',
      category: 'SIO Operator',
      nameOrUnit: 'Dedi Kurniawan (Forklift Kelas II)',
      regNumber: 'SIO-KEMNAKER-2024-8841',
      issueDate: '2024-03-10',
      expiryDate: '2029-03-10',
      authority: 'Kemnaker RI'
    },
    {
      id: 'LIC-02',
      category: 'SIO Operator',
      nameOrUnit: 'Joko Widodo (Overhead Crane Kelas I)',
      regNumber: 'SIO-KEMNAKER-2023-1192',
      issueDate: '2023-11-15',
      expiryDate: '2026-11-20', // Segera Expired (< 30 Hari dari tanggal saat ini di 2026)
      authority: 'Disnaker Provinsi'
    },
    {
      id: 'LIC-03',
      category: 'SILO Alat/Mesin',
      nameOrUnit: 'Unit Forklift 3.0T (FL-01 Toyota)',
      regNumber: 'SILO-ALAT-2025-042',
      issueDate: '2025-01-12',
      expiryDate: '2027-01-12',
      authority: 'PJK3 Uji Riksa'
    },
    {
      id: 'LIC-04',
      category: 'SILO Alat/Mesin',
      nameOrUnit: 'Overhead Crane 5 Ton Assembly Bay',
      regNumber: 'SILO-CRANE-2023-019',
      issueDate: '2023-08-01',
      expiryDate: '2025-08-01', // Sudah Expired
      authority: 'Disnaker Provinsi'
    },
    {
      id: 'LIC-05',
      category: 'SILO Alat/Mesin',
      nameOrUnit: 'Tangki Bejana Tekan Kompresor 500L',
      regNumber: 'SILO-BT-2024-118',
      issueDate: '2024-06-10',
      expiryDate: '2028-06-10',
      authority: 'PJK3 Uji Riksa'
    }
  ])

  const getStatusBadge = (expiryDate: string) => {
    if (!todayDate) return null
    const exp = new Date(expiryDate).getTime()
    const now = new Date(todayDate).getTime()
    const daysDiff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

    if (daysDiff < 0) {
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-300">
          KADALUARSA (EXPIRED)
        </span>
      )
    } else if (daysDiff <= 30) {
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
          PERPANJANG Segera ({daysDiff} Hari)
        </span>
      )
    } else {
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-300">
          AKTIF &bull; VALID
        </span>
      )
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Kepatuhan SIO &amp; SILO</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tracker Legalitas SIO Operator &amp; SILO Alat
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Basis data pemantauan masa berlaku lisensi operator angkat-angkut dan sertifikat kelaikan mesin pabrik untuk menjamin kepatuhan audit regulasi K3.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition shadow-sm self-start sm:self-auto cursor-pointer"
          >
            🖨️ Cetak Matriks Legalitas
          </button>
        </div>
      </div>

      {/* Tabel Legalitas */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-3 font-bold">Kategori &amp; Unit/Nama</th>
                <th className="py-3 px-3 font-bold">Nomor Registrasi / Sertifikat</th>
                <th className="py-3 px-3 font-bold">Penerbit</th>
                <th className="py-3 px-3 font-bold">Tanggal Terbit</th>
                <th className="py-3 px-3 font-bold">Masa Berlaku</th>
                <th className="py-3 px-3 font-bold text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{lic.nameOrUnit}</span>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">{lic.category}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{lic.regNumber}</td>
                  <td className="py-3 px-3 text-slate-600">{lic.authority}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{lic.issueDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{lic.expiryDate}</td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(lic.expiryDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
