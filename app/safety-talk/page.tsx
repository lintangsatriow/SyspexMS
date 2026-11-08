"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

interface Attendee {
  id: string
  name: string
  department: string
}

export default function SafetyTalkPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  // State Formulir Briefing
  const [topic, setTopic] = useState<string>('')
  const [supervisor, setSupervisor] = useState<string>('')
  const [shift, setShift] = useState<string>('Shift 1 (Pagi)')
  const [location, setLocation] = useState<string>('')

  // State Absensi Pekerja
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [newName, setNewName] = useState<string>('')
  const [newDept, setNewDept] = useState<string>('Engineering')

  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const newAttendee: Attendee = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      department: newDept
    }
    setAttendees([...attendees, newAttendee])
    setNewName('')
  }

  const handleRemoveAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id))
  }

  // Validasi tombol simpan/cetak
  const isFormValid = topic.trim() !== '' && supervisor.trim() !== '' && location.trim() !== '' && attendees.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Fungsional (Sembunyikan saat dicetak) */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Safety Talk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Daily Safety Talk &amp; Absensi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Catatan pelaksanaan Toolbox Meeting (TBM) harian. Isi materi briefing dan daftar hadir pekerja sebelum memulai shift kerja.
        </p>
      </div>

      {/* Header Cetak (Formulir Resmi) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Daily Safety Talk Record</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">FORMULIR TOOLBOX MEETING K3</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Diterbitkan oleh:</span>
            <span className="text-sm font-black text-slate-900">SYSPEX MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Detail Pelaksanaan */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 mb-4 print:border-slate-400">1. Detail Pelaksanaan</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal</label>
                  <input type="date" value={todayDate} onChange={(e) => setTodayDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 print:bg-transparent print:border-none print:px-0 print:text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Shift Kerja</label>
                  <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 print:hidden">
                    <option>Shift 1 (Pagi)</option>
                    <option>Shift 2 (Sore)</option>
                    <option>Shift 3 (Malam)</option>
                  </select>
                  <div className="hidden print:block text-sm font-bold">{shift}</div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Lokasi Area Kerja</label>
                <input type="text" placeholder="Misal: Gudang Blok A / Area Fabrikasi" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 print:hidden" />
                <div className="hidden print:block text-sm font-bold border-b border-slate-300 pb-1 min-h-[24px]">{location}</div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Topik Bahasan Utama</label>
                <textarea rows={3} placeholder="Misal: Prosedur pengangkatan aman, penggunaan APD wajib, titik kumpul evakuasi..." value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 resize-none print:hidden" />
                <div className="hidden print:block text-sm font-bold whitespace-pre-wrap border-b border-slate-300 pb-1 min-h-[48px]">{topic}</div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Supervisor / Pembawa Materi</label>
                <input type="text" placeholder="Nama lengkap..." value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500 print:hidden" />
                <div className="hidden print:block text-sm font-bold border-b border-slate-300 pb-1 min-h-[24px]">{supervisor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Absensi Pekerja */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4 print:border-slate-400">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Daftar Hadir Pekerja</h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded print:hidden">Total: {attendees.length} Orang</span>
            </div>

            {/* Form Tambah Pekerja (Sembunyikan saat dicetak) */}
            <form onSubmit={handleAddAttendee} className="flex gap-2 mb-4 print:hidden">
              <input type="text" placeholder="Nama Pekerja" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500" />
              <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:border-slate-500">
                <option>Engineering</option>
                <option>Warehouse</option>
                <option>Contractor</option>
                <option>Operator</option>
              </select>
              <button type="submit" disabled={!newName.trim()} className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition">
                + Tambah
              </button>
            </form>

            {/* Tabel Absensi */}
            <div className="overflow-x-auto border border-slate-200 rounded-md print:border-slate-400">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 print:bg-slate-200 print:border-slate-400">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center font-bold">No</th>
                    <th className="py-2 px-3 font-bold">Nama Lengkap</th>
                    <th className="py-2 px-3 font-bold">Departemen</th>
                    <th className="py-2 px-3 text-center font-bold print:hidden">Aksi</th>
                    <th className="hidden print:table-cell py-2 px-3 text-center font-bold w-32">Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 print:divide-slate-300">
                  {attendees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">Belum ada pekerja yang ditambahkan.</td>
                    </tr>
                  ) : (
                    attendees.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-slate-50 print:hover:bg-white">
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{att.name}</td>
                        <td className="py-2 px-3 text-slate-600">{att.department}</td>
                        <td className="py-2 px-3 text-center print:hidden">
                          <button onClick={() => handleRemoveAttendee(att.id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 rounded text-[10px]">Hapus</button>
                        </td>
                        <td className="hidden print:table-cell py-2 px-3"></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>

      {/* Action Footer (Sembunyikan saat dicetak) */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex justify-between items-center gap-4 print:hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Validasi Dokumen</h3>
          <p className="text-xs text-slate-600 mt-0.5">Pastikan topik, lokasi, supervisor, dan minimal 1 pekerja telah diisi sebelum dicetak.</p>
        </div>
        <button
          onClick={() => window.print()}
          disabled={!isFormValid}
          className={`px-5 py-2.5 rounded-md text-xs font-bold transition whitespace-nowrap shadow-sm ${isFormValid ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
        >
          {isFormValid ? '🖨️ Cetak Form Tanda Tangan' : '⛔ Lengkapi Data'}
        </button>
      </div>

    </div>
  )
}
