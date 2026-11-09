"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'

type LicenseType = 'SIO' | 'SILO'

interface LicenseRecord {
  id: string
  type: LicenseType
  holderName: string 
  category: string 
  licenseNo: string
  issueDate: string
  expiryDate: string
}

export default function SioSiloTrackerPage() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [filterType, setFilterType] = useState<'ALL' | 'SIO' | 'SILO'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const [licenses] = useState<LicenseRecord[]>([
    { id: '1', type: 'SIO', holderName: 'Budi Santoso', category: 'Forklift Kelas II', licenseNo: 'KEMENAKER/SIO/001', issueDate: '2021-05-10', expiryDate: '2028-05-10' },
    { id: '2', type: 'SIO', holderName: 'Ahmad Faisal', category: 'Forklift Kelas I', licenseNo: 'KEMENAKER/SIO/042', issueDate: '2021-12-01', expiryDate: '2026-12-15' }, 
    { id: '3', type: 'SILO', holderName: 'FL-01 (Toyota 3.0T)', category: 'Pusat K3 MHE', licenseNo: '566/SILO-MHE/23', issueDate: '2022-01-15', expiryDate: '2026-10-01' }, 
    { id: '4', type: 'SILO', holderName: 'FL-02 (Komatsu 2.5T)', category: 'Pusat K3 MHE', licenseNo: '566/SILO-MHE/24', issueDate: '2022-08-20', expiryDate: '2028-08-20' },
    { id: '5', type: 'SIO', holderName: 'Rudi Hermawan', category: 'Reach Truck', licenseNo: 'KEMENAKER/SIO/088', issueDate: '2021-11-10', expiryDate: '2026-11-20' }, 
    { id: '6', type: 'SILO', holderName: 'RCH-01 (Reach Truck)', category: 'Pusat K3 MHE', licenseNo: '566/SILO-MHE/29', issueDate: '2023-02-10', expiryDate: '2028-02-10' },
    { id: '7', type: 'SIO', holderName: 'Siti Aminah', category: 'Scissor Lift', licenseNo: 'KEMENAKER/SIO/102', issueDate: '2019-10-05', expiryDate: '2026-09-05' }, 
  ])

  const processedLicenses = useMemo(() => {
    const today = new Date()
    return licenses.map(lic => {
      const expDate = new Date(lic.expiryDate)
      const diffTime = expDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let status: 'ACTIVE' | 'WARNING' | 'EXPIRED' = 'ACTIVE'
      if (diffDays < 0) status = 'EXPIRED'
      else if (diffDays <= 60) status = 'WARNING'

      return { ...lic, diffDays, status }
    })
  }, [licenses])

  const filteredLicenses = useMemo(() => {
    return processedLicenses.filter(lic => {
      const matchType = filterType === 'ALL' || lic.type === filterType
      const matchSearch = lic.holderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lic.licenseNo.toLowerCase().includes(searchQuery.toLowerCase())
      return matchType && matchSearch
    }).sort((a, b) => a.diffDays - b.diffDays)
  }, [processedLicenses, filterType, searchQuery])

  const metrics = {
    total: processedLicenses.length,
    expired: processedLicenses.filter(l => l.status === 'EXPIRED').length,
    warning: processedLicenses.filter(l => l.status === 'WARNING').length,
    safe: processedLicenses.filter(l => l.status === 'ACTIVE').length,
  }

  const needsRenewal = metrics.expired > 0 || metrics.warning > 0

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse text-sm">Sinkronisasi Database Lisensi...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Kepatuhan & Audit Legal</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SIO & SILO Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Pemantauan masa berlaku lisensi operator (SIO) dan kelaikan alat berat (SILO).</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK LAPORAN RENEWAL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-12 space-y-6 print:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Lisensi Terdaftar</p>
              <div className="text-4xl font-black text-slate-900">{metrics.total}</div>
            </div>
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Aman (&gt; 60 Hari)</p>
              <div className="text-4xl font-black text-emerald-600">{metrics.safe}</div>
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-7xl opacity-10">⚠️</div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Perlu Perpanjangan (≤ 60 Hari)</p>
              <div className="text-4xl font-black text-amber-600">{metrics.warning}</div>
            </div>
            <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-7xl opacity-10">🚨</div>
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-2">KADALUARSA (EXPIRED)</p>
              <div className="text-4xl font-black text-red-600">{metrics.expired}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex gap-2">
              {(['ALL', 'SIO', 'SILO'] as const).map(type => (
                <button 
                  key={type} 
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition ${filterType === type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {type === 'ALL' ? 'Semua Data' : type}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Cari nama atau nomor lisensi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-9 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-500 transition"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Holder / ID Alat</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori / No. Lisensi</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Masa Berlaku (Expired)</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sisa Waktu</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Status Kepatuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLicenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm font-bold text-slate-500">Tidak ada data yang cocok.</td>
                    </tr>
                  ) : (
                    filteredLicenses.map((lic) => (
                      <tr key={lic.id} className="hover:bg-slate-50 transition group">
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${lic.type === 'SIO' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {lic.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-black text-slate-900">{lic.holderName}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-slate-700">{lic.category}</p>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">{lic.licenseNo}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-slate-700">{new Date(lic.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </td>
                        <td className="p-4">
                          <p className={`text-xs font-black ${lic.status === 'EXPIRED' ? 'text-red-600' : lic.status === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {lic.diffDays < 0 ? `${Math.abs(lic.diffDays)} hari lewat` : `${lic.diffDays} hari lagi`}
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          {lic.status === 'EXPIRED' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-200 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> EXPIRED (ILEGAL)</span>}
                          {lic.status === 'WARNING' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> RENEW SEGERA</span>}
                          {lic.status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">✓ AMAN</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="hidden print:block w-full text-black">
          <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">License Renewal Request Report</h1>
              <h2 className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">PT. Syspex Kemasindo - SIO & SILO Audit</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase">Report Generated:</p>
              <p className="text-sm font-black">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          <div className="border-2 border-black p-4 mb-8 bg-gray-50 flex gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Status Kepatuhan Kritis</p>
              <p className="text-3xl font-black">{metrics.expired} <span className="text-sm font-bold uppercase">Expired</span></p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Segera Berakhir (≤ 60 Hari)</p>
              <p className="text-3xl font-black">{metrics.warning} <span className="text-sm font-bold uppercase">Warning</span></p>
            </div>
            <div className="ml-auto flex flex-col justify-center">
              <p className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-1">Tindakan Diperlukan:</p>
              <p className="text-[10px] font-bold w-64 leading-tight">Data di bawah ini memerlukan pengajuan anggaran perpanjangan ke HRD/Kemenaker segera untuk mencegah penghentian operasi alat berat.</p>
            </div>
          </div>

          <h3 className="text-sm font-black uppercase border-b-2 border-black mb-3 pb-1">Daftar Lisensi Memerlukan Perpanjangan (Renewal Required)</h3>
          <table className="w-full border-collapse border-2 border-black text-xs mb-12">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-2 border-black p-2 text-center w-[5%]">No</th>
                <th className="border-2 border-black p-2 text-center w-[10%]">Tipe</th>
                <th className="border-2 border-black p-2 text-left w-[30%]">Nama Operator / ID Alat</th>
                <th className="border-2 border-black p-2 text-left w-[25%]">Kategori & No. Lisensi</th>
                <th className="border-2 border-black p-2 text-center w-[15%]">Tgl Expired</th>
                <th className="border-2 border-black p-2 text-center w-[15%]">Sisa Waktu</th>
              </tr>
            </thead>
            <tbody>
              {processedLicenses
                .filter(lic => lic.status !== 'ACTIVE')
                .sort((a, b) => a.diffDays - b.diffDays)
                .map((lic, idx) => (
                <tr key={lic.id}>
                  <td className="border-2 border-black p-2 text-center font-bold">{idx + 1}</td>
                  <td className="border-2 border-black p-2 text-center font-black">{lic.type}</td>
                  <td className="border-2 border-black p-2 font-bold">{lic.holderName}</td>
                  <td className="border-2 border-black p-2">
                    {lic.category}<br/>
                    <span className="font-mono text-[10px]">{lic.licenseNo}</span>
                  </td>
                  <td className="border-2 border-black p-2 text-center">{new Date(lic.expiryDate).toLocaleDateString('en-GB')}</td>
                  <td className="border-2 border-black p-2 text-center font-black uppercase">
                    {lic.diffDays < 0 ? `${Math.abs(lic.diffDays)} hr Lewat` : `${lic.diffDays} hr Lagi`}
                  </td>
                </tr>
              ))}
              {!needsRenewal && (
                <tr>
                  <td colSpan={6} className="border-2 border-black p-4 text-center font-bold uppercase">
                    Kepatuhan 100%. Tidak ada lisensi yang perlu diperpanjang saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="grid grid-cols-3 gap-8 text-center text-xs font-bold">
            <div>
              <p className="uppercase mb-12">Prepared By (HSE Admin)</p>
              <div className="border-b-2 border-black w-3/4 mx-auto mb-1"></div>
              <p>Name & Signature</p>
            </div>
            <div>
              <p className="uppercase mb-12">Reviewed By (HSE Manager)</p>
              <div className="border-b-2 border-black w-3/4 mx-auto mb-1"></div>
              <p>Name & Signature</p>
            </div>
            <div>
              <p className="uppercase mb-12">Approved By (HR/GA Manager)</p>
              <div className="border-b-2 border-black w-3/4 mx-auto mb-1"></div>
              <p>For Budgeting / Renewal</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
