"use client"

import { useState } from 'react'
import Link from 'next/link'

interface Attendee {
  id: string
  name: string
  department: string
  attended: boolean
}

export default function SafetyTalkPage() {
  const [topic, setTopic] = useState('Pencegahan Titik Buta (Blind Spot) saat Operasi Forklift')
  const [speaker, setSpeaker] = useState('Lintang Satrio')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('Area Loading Dock / Warehouse Utama')
  const [briefSummary, setBriefSummary] = useState(
    'Membahas aturan klakson di setiap tikungan blind spot, kecepatan maksimal forklift 10 km/jam di dalam ruangan, dan kewajiban rompi reflektif bagi pejalan kaki.'
  )

  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'Budi Santoso', department: 'Logistics / Forklift', attended: true },
    { id: '2', name: 'Ahmad Faisal', department: 'Logistics / Forklift', attended: true },
    { id: '3', name: 'Rudi Hermawan', department: 'ASRS Maintenance', attended: true },
    { id: '4', name: 'Siti Aminah', department: 'Warehouse Admin', attended: true },
    { id: '5', name: 'Deni Setiawan', department: 'Contractor / Racking', attended: false },
  ])

  const [newAttendeeName, setNewAttendeeName] = useState('')
  const [newAttendeeDept, setNewAttendeeDept] = useState('Warehouse')

  const toggleAttendance = (id: string) => {
    setAttendees(prev =>
      prev.map(item => item.id === id ? { ...item, attended: !item.attended } : item)
    )
  }

  const addAttendee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAttendeeName) return
    const newPerson: Attendee = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAttendeeName,
      department: newAttendeeDept,
      attended: true
    }
    setAttendees([...attendees, newPerson])
    setNewAttendeeName('')
  }

  const totalAttendees = attendees.filter(a => a.attended).length

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header Web */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">K3 & Operasional</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Daily Safety Talk / TBM</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Pencatatan briefing keselamatan harian, materi bahaya, dan daftar hadir tim.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK DAFTAR HADIR TBM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sisi Kiri: Data Briefing & Topik */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3">Detail Pelaksanaan TBM</h2>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Topik Briefing Harian</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pimpinan Briefing (Speaker)</label>
                <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-900" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi Briefing</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-slate-900" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Poin Utama / Kesepakatan Safety</label>
              <textarea rows={4} value={briefSummary} onChange={(e) => setBriefSummary(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-slate-900 resize-none" />
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Daftar Hadir Tim */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 uppercase">Presensi Peserta ({totalAttendees} Hadir)</h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                Wajib Dihadiri Seluruh Tim Shift
              </span>
            </div>

            {/* Input Tambah Peserta */}
            <form onSubmit={addAttendee} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nama karyawan / teknisi..." 
                value={newAttendeeName} 
                onChange={(e) => setNewAttendeeName(e.target.value)} 
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
              <input 
                type="text" 
                placeholder="Dept / Posisi" 
                value={newAttendeeDept} 
                onChange={(e) => setNewAttendeeDept(e.target.value)} 
                className="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg uppercase">
                + Hadir
              </button>
            </form>

            {/* List Peserta */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {attendees.map((person, idx) => (
                <div key={person.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400">{idx + 1}.</span>
                    <div>
                      <p className="text-xs font-black text-slate-900">{person.name}</p>
                      <p className="text-[10px] text-slate-500">{person.department}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleAttendance(person.id)}
                    className={`px-3 py-1 rounded text-[10px] font-black uppercase transition ${person.attended ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {person.attended ? 'HADIR' : 'ABSEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* DOKUMEN CETAK UTAMA (BERITA ACARA TBM / SAFETY TALK) */}
        {/* ================================================== */}
        <div className="hidden print:block w-full text-black">
          <div className="border-2 border-black p-6 w-full max-w-[850px] mx-auto">
            
            <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">FORMULIR TOOLBOX MEETING (TBM)</h1>
                <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - Sistem Manajemen K3 (SMK3)</p>
              </div>
              <div className="text-right border border-black p-2 text-[10px] font-bold uppercase">
                <p>Dokumen No: SYS-HSE-FRM-TBM</p>
                <p>Tanggal: {new Date(date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold border border-black p-3 mb-6 bg-gray-50">
              <div>
                <p><span className="text-gray-500 uppercase">Topik Bahasan:</span> {topic}</p>
                <p className="mt-1"><span className="text-gray-500 uppercase">Pimpinan Briefing:</span> {speaker}</p>
              </div>
              <div>
                <p><span className="text-gray-500 uppercase">Lokasi Briefing:</span> {location}</p>
                <p className="mt-1"><span className="text-gray-500 uppercase">Jumlah Peserta Hadir:</span> {totalAttendees} Orang</p>
              </div>
            </div>

            <div className="border border-black p-3 mb-6 text-xs">
              <p className="font-black uppercase mb-1">Rangkuman Materi & Komitmen Keselamatan:</p>
              <p className="text-justify font-medium leading-relaxed">{briefSummary}</p>
            </div>

            <h3 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-2">Daftar Hadir & Tanda Tangan Peserta</h3>
            <table className="w-full border-collapse border border-black text-xs mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-center w-[8%]">No</th>
                  <th className="border border-black p-2 text-left w-[40%]">Nama Lengkap</th>
                  <th className="border border-black p-2 text-left w-[32%]">Departemen / Peran</th>
                  <th className="border border-black p-2 text-center w-[20%]">Tanda Tangan</th>
                </tr>
              </thead>
              <tbody>
                {attendees.filter(a => a.attended).map((person, idx) => (
                  <tr key={person.id} className="h-8">
                    <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-black p-2 font-bold">{person.name}</td>
                    <td className="border border-black p-2">{person.department}</td>
                    <td className="border border-black p-2 text-center font-mono text-[9px] text-gray-400">Paraf</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-12 text-center text-xs font-bold border-t-2 border-black pt-4">
              <div>
                <p className="uppercase mb-12">Pimpinan Briefing / Supervisor</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p>{speaker}</p>
              </div>
              <div>
                <p className="uppercase mb-12">Mengetahui (HSE Dept)</p>
                <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                <p>HSE Officer / Manager</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
