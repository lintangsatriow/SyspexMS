"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LicenseItem {
  id: string
  category: 'KOMPETENSI' | 'SIO' | 'SILO'
  holderName: string
  spec: string
  regNo: string
  issueDate: string
  expiryDate: string
}

const INITIAL_FALLBACK: LicenseItem[] = [
  {
    id: 'lic-1',
    category: 'KOMPETENSI',
    holderName: 'Budi Santoso',
    spec: 'Ahli K3 Umum',
    regNo: 'SKP',
    issueDate: '2024-05-10',
    expiryDate: '2027-05-10'
  },
  {
    id: 'lic-2',
    category: 'SIO',
    holderName: 'Adi Dwi Sandi',
    spec: 'Operator Forklift',
    regNo: 'KEMENAKER',
    issueDate: '2021-05-15',
    expiryDate: '2026-05-15'
  }
]

export default function SioSiloTrackerPage() {
  const [items, setItems] = useState<LicenseItem[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formCategory, setFormCategory] = useState<'KOMPETENSI' | 'SIO' | 'SILO'>('KOMPETENSI')
  const [formHolder, setFormHolder] = useState('')
  const [formSpec, setFormSpec] = useState('')
  const [formRegType, setFormRegType] = useState('SKP')
  const [formIssueDate, setFormIssueDate] = useState('')
  const [formExpiryDate, setFormExpiryDate] = useState('')

  // AUTO-RECOVERY: Memeriksa semua kemungkinan kunci localStorage
  useEffect(() => {
    const candidateKeys = [
      'syspex_license_data',
      'syspex_licenses',
      'licenses',
      'sio_silo_data',
      'syspex_sio_data',
      'syspex_sio_silo'
    ]

    let foundData: LicenseItem[] | null = null

    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            foundData = parsed.map((item: any, idx: number) => ({
              id: item.id || `lic-recov-${idx}`,
              category: item.category || item.type || 'KOMPETENSI',
              holderName: item.holderName || item.name || item.holder || 'Tanpa Nama',
              spec: item.spec || item.specification || item.bidang || '-',
              regNo: item.regNo || item.jenis || item.noReg || item.regNumber || 'KEMENAKER',
              issueDate: item.issueDate || item.tglTerbit || '2024-01-01',
              expiryDate: item.expiryDate || item.tglExpired || item.expiredDate || '2026-12-31'
            }))
            // Sinkronkan ke kunci utama
            localStorage.setItem('syspex_license_data', JSON.stringify(foundData))
            break
          }
        } catch (e) {
          console.error('Failed reading key:', key, e)
        }
      }
    }

    if (foundData && foundData.length > 0) {
      setItems(foundData)
    } else {
      setItems(INITIAL_FALLBACK)
    }
  }, [])

  // Simpan Data
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formHolder || !formExpiryDate) {
      alert('Nama pemegang izin dan Tanggal Berakhir wajib diisi.')
      return
    }

    const newItem: LicenseItem = {
      id: `lic-${Date.now()}`,
      category: formCategory,
      holderName: formHolder,
      spec: formSpec || (formCategory === 'KOMPETENSI' ? 'Ahli K3' : formCategory === 'SIO' ? 'Operator MHE' : 'Unit Riksa Uji'),
      regNo: formRegType,
      issueDate: formIssueDate || new Date().toISOString().split('T')[0],
      expiryDate: formExpiryDate
    }

    const updated = [newItem, ...items]
    setItems(updated)
    localStorage.setItem('syspex_license_data', JSON.stringify(updated))

    setFormHolder('')
    setFormSpec('')
    setFormRegType('SKP')
    setFormIssueDate('')
    setFormExpiryDate('')
    setIsModalOpen(false)
  }

  // Hapus Data
  const handleDeleteItem = (id: string) => {
    if (confirm('Hapus sertifikasi ini dari tracker?')) {
      const updated = items.filter(it => it.id !== id)
      setItems(updated)
      localStorage.setItem('syspex_license_data', JSON.stringify(updated))
    }
  }

  // Kalkulasi Status
  const getStatus = (expiryDateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const exp = new Date(expiryDateStr)
    exp.setHours(0, 0, 0, 0)

    const diffTime = exp.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { 
        code: 'EXPIRED' as const, 
        color: 'bg-rose-100 text-rose-800 border-rose-300', 
        text: `EXPIRED (${Math.abs(diffDays)} HARI LEWAT)` 
      }
    } else if (diffDays <= 60) {
      return { 
        code: 'EXPIRING_SOON' as const, 
        color: 'bg-amber-100 text-amber-800 border-amber-300', 
        text: `PERLU PERPANJANGAN (${diffDays} HARI LAGI)` 
      }
    } else {
      return { 
        code: 'ACTIVE' as const, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300', 
        text: 'AMAN (> 60 HARI)' 
      }
    }
  }

  const totalCount = items.length
  const expiredCount = items.filter(it => getStatus(it.expiryDate).code === 'EXPIRED').length
  const expiringSoonCount = items.filter(it => getStatus(it.expiryDate).code === 'EXPIRING_SOON').length
  const activeCount = items.filter(it => getStatus(it.expiryDate).code === 'ACTIVE').length

  const filteredItems = items.filter(it => {
    const itemStatus = getStatus(it.expiryDate).code
    const matchStatus = filterStatus === 'ALL' || itemStatus === filterStatus
    const matchCat = filterCategory === 'ALL' || it.category === filterCategory
    const matchSearch = it.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        it.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        it.regNo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchStatus && matchCat && matchSearch
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Kepatuhan & Audit Legal</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Competency & License Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Database Manajemen Lisensi Alat & Kompetensi Karyawan Syspex.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              + Tambah Data
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2 uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Cetak Renewal
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Interaktif */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <div 
          onClick={() => setFilterStatus('ALL')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:scale-[1.02] ${
            filterStatus === 'ALL' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2' 
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-wider ${filterStatus === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
            Total Lisensi & SKP
          </p>
          <p className="text-3xl font-black mt-2">{totalCount}</p>
          <span className={`text-[10px] font-bold mt-1 block ${filterStatus === 'ALL' ? 'text-teal-400' : 'text-slate-400'}`}>
            {filterStatus === 'ALL' ? '● Menampilkan Semua' : 'Klik untuk tampilkan semua'}
          </span>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:scale-[1.02] ${
            filterStatus === 'ACTIVE' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500 ring-offset-2' 
              : 'bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-wider ${filterStatus === 'ACTIVE' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Aman (&gt; 60 Hari)
          </p>
          <p className={`text-3xl font-black mt-2 ${filterStatus === 'ACTIVE' ? 'text-white' : 'text-emerald-600'}`}>{activeCount}</p>
          <span className={`text-[10px] font-bold mt-1 block ${filterStatus === 'ACTIVE' ? 'text-emerald-100' : 'text-emerald-600'}`}>
            {filterStatus === 'ACTIVE' ? '● Filter Aktif (Klik Reset)' : 'Klik untuk filter data ini'}
          </span>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'EXPIRING_SOON' ? 'ALL' : 'EXPIRING_SOON')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:scale-[1.02] ${
            filterStatus === 'EXPIRING_SOON' 
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400 ring-offset-2' 
              : 'bg-amber-50/60 border-amber-200 text-amber-950 hover:bg-amber-100/70'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-wider ${filterStatus === 'EXPIRING_SOON' ? 'text-amber-100' : 'text-amber-700'}`}>
            Perlu Perpanjangan (≤ 60 Hari)
          </p>
          <p className={`text-3xl font-black mt-2 ${filterStatus === 'EXPIRING_SOON' ? 'text-white' : 'text-amber-600'}`}>{expiringSoonCount}</p>
          <span className={`text-[10px] font-bold mt-1 block ${filterStatus === 'EXPIRING_SOON' ? 'text-amber-100' : 'text-amber-600'}`}>
            {filterStatus === 'EXPIRING_SOON' ? '● Filter Aktif (Klik Reset)' : '👉 Klik untuk lihat data'}
          </span>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'EXPIRED' ? 'ALL' : 'EXPIRED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:scale-[1.02] ${
            filterStatus === 'EXPIRED' 
              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500 ring-offset-2' 
              : 'bg-rose-50/60 border-rose-200 text-rose-950 hover:bg-rose-100/70'
          }`}
        >
          <p className={`text-[10px] font-black uppercase tracking-wider ${filterStatus === 'EXPIRED' ? 'text-rose-100' : 'text-rose-700'}`}>
            Kadaluarsa (Expired)
          </p>
          <p className={`text-3xl font-black mt-2 ${filterStatus === 'EXPIRED' ? 'text-white' : 'text-rose-600'}`}>{expiredCount}</p>
          <span className={`text-[10px] font-bold mt-1 block ${filterStatus === 'EXPIRED' ? 'text-rose-100' : 'text-rose-600'}`}>
            {filterStatus === 'EXPIRED' ? '● Filter Aktif (Klik Reset)' : '👉 Klik untuk lihat data'}
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
            {['ALL', 'KOMPETENSI', 'SIO', 'SILO'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-black rounded-lg transition ${
                  filterCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Semua Data' : cat}
              </button>
            ))}
          </div>

          {filterStatus !== 'ALL' && (
            <button
              onClick={() => setFilterStatus('ALL')}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black rounded-xl transition flex items-center gap-1 shrink-0"
            >
              <span>✕</span> Reset Filter Kartu
            </button>
          )}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama karyawan / alat..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold shadow-sm focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tipe Dokumen</th>
                <th className="py-3 px-4">Nama Holder / ID Alat</th>
                <th className="py-3 px-4">Kategori / Jenis Sertifikasi</th>
                <th className="py-3 px-4">Masa Berlaku (Expired)</th>
                <th className="py-3 px-4 text-center">Status Kepatuhan</th>
                <th className="py-3 px-4 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    Tidak ada data lisensi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const status = getStatus(item.expiryDate)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-black">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{item.holderName}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{item.spec}</p>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {item.regNo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-slate-900">{item.expiryDate}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Terbit: {item.issueDate}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center print:hidden">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1.5 font-bold rounded-lg hover:bg-rose-50"
                          title="Hapus lisensi ini"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Data */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Tambah Data Lisensi</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 mt-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Kategori Sertifikasi</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="KOMPETENSI">KOMPETENSI (Ahli K3, P3K, Damkar)</option>
                    <option value="SIO">SIO (Operator Forklift / Alat Berat)</option>
                    <option value="SILO">SILO (Riksa Uji Unit / Pesawat Angkat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Spesifikasi / Bidang</label>
                  <input
                    type="text"
                    value={formSpec}
                    onChange={(e) => setFormSpec(e.target.value)}
                    placeholder="Contoh: Operator Forklift / Ahli K3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-500 mb-1">Nama Lengkap Karyawan / Pemegang Izin</label>
                <input
                  type="text"
                  required
                  value={formHolder}
                  onChange={(e) => setFormHolder(e.target.value)}
                  placeholder="Nama karyawan atau ID unit alat"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-500 mb-1">Jenis Sertifikasi</label>
                <select
                  value={formRegType}
                  onChange={(e) => setFormRegType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-black text-slate-800"
                >
                  <option value="SKP">SKP (Surat Keputusan Penunjukan)</option>
                  <option value="KEMENAKER">KEMENAKER (Lisensi Resmi K3 Kemenaker)</option>
                  <option value="BNSP">BNSP (Badan Nasional Sertifikasi Profesi)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Tanggal Terbit / Pembinaan</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={(e) => setFormIssueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Tanggal Berakhir (Expired)</label>
                  <input
                    type="date"
                    required
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase rounded-lg transition shadow-sm"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
