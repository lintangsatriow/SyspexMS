"use client"

import { useState } from 'react'
import Link from 'next/link'

type HazardType = 'UNSAFE_CONDITION' | 'UNSAFE_ACT' | 'NEAR_MISS'
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type StatusType = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

interface HazardItem {
  id: string
  reportNo: string
  date: string
  reporterName: string
  department: string
  location: string
  type: HazardType
  riskLevel: RiskLevel
  description: string
  immediateAction: string
  pic: string
  status: StatusType
}

export default function HazardReportPage() {
  const [reports, setReports] = useState<HazardItem[]>([
    {
      id: '1',
      reportNo: 'HZD-2026-001',
      date: '2026-10-18',
      reporterName: 'Budi Santoso',
      department: 'Logistics',
      location: 'Lorong Racking Blok C',
      type: 'UNSAFE_CONDITION',
      riskLevel: 'HIGH',
      description: 'Tiang upright racking penyok parah terkena benturan garpu forklift. Berisiko runtuh jika palet bermuatan penuh ditaruh di level atas.',
      immediateAction: 'Area bawah balok dikosongkan dan dipasang barikade garis dilarang melintas.',
      pic: 'Engineering Team',
      status: 'OPEN'
    },
    {
      id: '2',
      reportNo: 'HZD-2026-002',
      date: '2026-10-25',
      reporterName: 'Lintang Satrio',
      department: 'HSE Dept',
      location: 'Area Servis Mesin Strapping',
      type: 'UNSAFE_ACT',
      riskLevel: 'MEDIUM',
      description: 'Teknisi memperbaiki sensor penggerak rantai tanpa memasang gembok pengunci LOTO pada panel sakelar utama.',
      immediateAction: 'Pekerjaan dihentikan seketika dan teknisi diwajibkan memasang Padlock LOTO sebelum melanjutkan.',
      pic: 'Maintenance Spv',
      status: 'CLOSED'
    },
    {
      id: '3',
      reportNo: 'HZD-2026-003',
      date: '2026-11-02',
      reporterName: 'Ahmad Faisal',
      department: 'Warehouse',
      location: 'Loading Dock 2',
      type: 'NEAR_MISS',
      riskLevel: 'HIGH',
      description: 'Palet tumpukan karton miring dan hampir menimpa checker saat forklift mengerem mendadak di jalan menurun dock.',
      immediateAction: 'Tumpukan distretch-film ulang lebih rapat dan jalur dock dibersihkan dari genangan air.',
      pic: 'Warehouse Spv',
      status: 'CLOSED'
    }
  ])

  // State Formulir Tambah Temuan
  const [reporterName, setReporterName] = useState('')
  const [department, setDepartment] = useState('Warehouse')
  const [location, setLocation] = useState('')
  const [type, setType] = useState<HazardType>('UNSAFE_CONDITION')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MEDIUM')
  const [description, setDescription] = useState('')
  const [immediateAction, setImmediateAction] = useState('')
  const [pic, setPic] = useState('')

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reporterName || !location || !description) return

    const newReport: HazardItem = {
      id: Math.random().toString(36).substr(2, 9),
      reportNo: `HZD-2026-${String(reports.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      reporterName,
      department,
      location,
      type,
      riskLevel,
      description,
      immediateAction: immediateAction || 'Menunggu tindakan korektif dari penanggung jawab.',
      pic: pic || 'HSE Dept',
      status: 'OPEN'
    }

    setReports([newReport, ...reports])
    setReporterName('')
    setLocation('')
    setDescription('')
    setImmediateAction('')
    setPic('')
  }

  const toggleStatus = (id: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== id) return r
        const nextStatus: StatusType = r.status === 'OPEN' ? 'IN_PROGRESS' : r.status === 'IN_PROGRESS' ? 'CLOSED' : 'OPEN'
        return { ...r, status: nextStatus }
      })
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Header Web */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">K3 & Operasional</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hazard & Near-Miss Hunting</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Pelaporan kondisi/perilaku bahaya lapangan dan pemantauan tindakan perbaikan (CAPA).</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            CETAK LOG TEMUAN K3
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
        
        {/* Kolom Kiri: Formulir Pelaporan Cepat */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              Laporkan Temuan Bahaya Baru
            </h2>

            <form onSubmit={handleAddReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Pelapor</label>
                  <input 
                    type="text" 
                    required 
                    value={reporterName} 
                    onChange={(e) => setReporterName(e.target.value)} 
                    placeholder="Nama Anda..." 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Departemen</label>
                  <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900"
                  >
                    <option value="Warehouse">Warehouse</option>
                    <option value="Logistics">Logistics / MHE</option>
                    <option value="Engineering">Engineering / ASRS</option>
                    <option value="Packaging Servis">Packaging Servis</option>
                    <option value="Office">Office / GA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi Detail Kejadian</label>
                <input 
                  type="text" 
                  required 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Contoh: Racking Blok B-04 / Bengkel Forklift" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori Bahaya</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as HazardType)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900"
                  >
                    <option value="UNSAFE_CONDITION">Kondisi Bahaya (KTA)</option>
                    <option value="UNSAFE_ACT">Perilaku Bahaya (TTA)</option>
                    <option value="NEAR_MISS">Hampir Celaka (Near-Miss)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tingkat Risiko</label>
                  <select 
                    value={riskLevel} 
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900"
                  >
                    <option value="LOW">Rendah (Low)</option>
                    <option value="MEDIUM">Sedang (Medium)</option>
                    <option value="HIGH">Tinggi (High / Fatal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Lengkap Temuan Bahaya</label>
                <textarea 
                  rows={3} 
                  required 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Jelaskan apa yang Anda lihat, komponen apa yang rusak, atau tindakan berbahaya apa yang dilakukan..." 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-900 resize-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tindakan Langsung di Tempat (Immediate Action)</label>
                <input 
                  type="text" 
                  value={immediateAction} 
                  onChange={(e) => setImmediateAction(e.target.value)} 
                  placeholder="Contoh: Barikade dipasang / Pekerjaan langsung dihentikan" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PIC / Penanggung Jawab Perbaikan</label>
                <input 
                  type="text" 
                  value={pic} 
                  onChange={(e) => setPic(e.target.value)} 
                  placeholder="Contoh: Supervisor Gudang / Tim Maintenance" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg transition shadow-sm mt-2"
              >
                + Kirim Laporan Temuan
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Temuan & Status Monitoring */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Laporan Aktif</p>
              <p className="text-xl font-black text-slate-900">{reports.length} Temuan</p>
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {reports.filter(r => r.status === 'OPEN').length} Open
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                {reports.filter(r => r.status === 'IN_PROGRESS').length} Progress
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                {reports.filter(r => r.status === 'CLOSED').length} Closed
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-400 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">{report.reportNo}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-700">{report.location}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Oleh: {report.reporterName} ({report.department}) — {report.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${report.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : report.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                      {report.riskLevel} RISK
                    </span>
                    <button 
                      onClick={() => toggleStatus(report.id)} 
                      title="Klik untuk ubah status"
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full transition border ${report.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : report.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-red-50 text-red-700 border-red-300'}`}
                    >
                      {report.status} ↻
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900 mb-1">Deskripsi Kondisi:</p>
                  <p>{report.description}</p>
                </div>

                <div className="text-[11px] flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
                  <p><span className="font-bold text-slate-800">Tindakan Langsung:</span> {report.immediateAction}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">PIC: {report.pic}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* FORMAT CETAK DOKUMEN LAPORAN HAZARD HUNTING (PRINT) */}
      {/* ================================================== */}
      <div className="hidden print:block w-full text-black">
        <div className="border-2 border-black p-6 w-full max-w-[850px] mx-auto">
          
          <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">LOG TEMUAN BAHAYA & NEAR-MISS (CAPA)</h1>
              <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - Sistem Manajemen K3 ISO 45001</p>
            </div>
            <div className="text-right border border-black p-2 text-[9px] font-bold uppercase">
              <p>Dokumen No: SYS-HSE-FRM-HAZ</p>
              <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-[11px] mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black p-2 text-center w-[12%]">No Laporan</th>
                <th className="border border-black p-2 text-left w-[20%]">Lokasi & Pelapor</th>
                <th className="border border-black p-2 text-left w-[36%]">Deskripsi Bahaya</th>
                <th className="border border-black p-2 text-left w-[20%]">Tindakan Korektif (CAPA)</th>
                <th className="border border-black p-2 text-center w-[12%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item) => (
                <tr key={item.id}>
                  <td className="border border-black p-2 text-center font-mono font-bold">{item.reportNo}</td>
                  <td className="border border-black p-2">
                    <p className="font-bold">{item.location}</p>
                    <p className="text-[9px] text-gray-600">{item.reporterName} ({item.department})</p>
                  </td>
                  <td className="border border-black p-2 leading-snug">
                    <p>{item.description}</p>
                    <p className="text-[9px] font-bold text-gray-500 mt-0.5">Kategori: {item.type} | Risiko: {item.riskLevel}</p>
                  </td>
                  <td className="border border-black p-2 leading-snug">
                    <p>{item.immediateAction}</p>
                    <p className="text-[9px] font-bold text-gray-500 mt-0.5">PIC: {item.pic}</p>
                  </td>
                  <td className="border border-black p-2 text-center font-black uppercase">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8 text-xs font-bold border-t-2 border-black pt-4">
            <div>
              <p className="uppercase mb-12">Petugas Inspeksi Lapangan</p>
              <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
              <p>HSE Officer</p>
            </div>
            <div>
              <p className="uppercase mb-12">Mengetahui (Pimpinan Area / Manajer Operasional)</p>
              <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
              <p>Operation Manager</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
