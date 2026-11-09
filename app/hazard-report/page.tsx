"use client"

import { useState } from 'react'
import Link from 'next/link'

type HazardCategory = 'UNSAFE_CONDITION' | 'UNSAFE_ACT' | 'NEAR_MISS'
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type StatusType = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

interface HazardItem {
  id: string
  reportNo: string
  date: string
  reporterName: string
  department: string
  location: string
  category: HazardCategory
  riskLevel: RiskLevel
  description: string
  immediateAction: string
  pic: string
  status: StatusType
  photoUrl?: string
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
      category: 'UNSAFE_CONDITION',
      riskLevel: 'HIGH',
      description: 'Tiang upright racking penyok parah akibat benturan forklift. Potensi keruntuhan struktur balok jika menahan beban maksimum palet.',
      immediateAction: 'Area sekitar dipasang garis barikade pembatas dan palet di atasnya diturunkan sementara.',
      pic: 'Engineering Team',
      status: 'OPEN',
      photoUrl: ''
    },
    {
      id: '2',
      reportNo: 'HZD-2026-002',
      date: '2026-10-25',
      reporterName: 'Lintang Satrio',
      department: 'HSE Dept',
      location: 'Workshop Mesin Packaging',
      category: 'UNSAFE_ACT',
      riskLevel: 'MEDIUM',
      description: 'Teknisi menyervis bagian rantai konveyor motor tanpa mengisolasi daya listrik & tidak memasang gembok LOTO pada panel sumber daya.',
      immediateAction: 'Operasi dihentikan di tempat dan teknisi diwajibkan memasang Padlock LOTO sebelum lanjut bekerja.',
      pic: 'Maintenance Spv',
      status: 'CLOSED',
      photoUrl: ''
    },
    {
      id: '3',
      reportNo: 'HZD-2026-003',
      date: '2026-11-02',
      reporterName: 'Ahmad Faisal',
      department: 'Warehouse',
      location: 'Turunan Loading Dock 2',
      category: 'NEAR_MISS',
      riskLevel: 'HIGH',
      description: 'Palet karton miring hampir terlempar mengenai staf checker saat forklift melakukan pengereman darurat di jalan turunan dock yang basah.',
      immediateAction: 'Jalur turunan dock dikeringkan dengan serbuk penyerap dan kecepatan forklift dibatasi maksimum 5 km/jam.',
      pic: 'Warehouse Spv',
      status: 'CLOSED',
      photoUrl: ''
    }
  ])

  // State Form Input
  const [reporterName, setReporterName] = useState('')
  const [department, setDepartment] = useState('Warehouse')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState<HazardCategory>('UNSAFE_CONDITION')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MEDIUM')
  const [description, setDescription] = useState('')
  const [immediateAction, setImmediateAction] = useState('')
  const [pic, setPic] = useState('')
  const [capturedPhoto, setCapturedPhoto] = useState<string>('')

  // Handle Capture / Upload Foto dari Kamera / Galeri
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
      category,
      riskLevel,
      description,
      immediateAction: immediateAction || 'Menunggu verifikasi dan tindakan korektif tim HSE.',
      pic: pic || 'HSE Dept',
      status: 'OPEN',
      photoUrl: capturedPhoto
    }

    setReports([newReport, ...reports])
    setReporterName('')
    setLocation('')
    setDescription('')
    setImmediateAction('')
    setPic('')
    setCapturedPhoto('')
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

  const getCategoryLabel = (cat: HazardCategory) => {
    switch (cat) {
      case 'UNSAFE_CONDITION': return 'Kondisi Berbahaya (Unsafe Condition)'
      case 'UNSAFE_ACT': return 'Tindakan Berbahaya (Unsafe Act)'
      case 'NEAR_MISS': return 'Hampir Celaka (Near-Miss)'
    }
  }

  const getCategoryBadgeClass = (cat: HazardCategory) => {
    switch (cat) {
      case 'UNSAFE_CONDITION': return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'UNSAFE_ACT': return 'bg-red-100 text-red-900 border-red-300'
      case 'NEAR_MISS': return 'bg-purple-100 text-purple-900 border-purple-300'
    }
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
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Pelaporan Unsafe Act, Unsafe Condition, dan Near-Miss lengkap dengan bukti visual foto.</p>
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
        
        {/* Kolom Kiri: Formulir Pelaporan Lapangan */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              Laporkan Temuan Bahaya Baru
            </h2>

            <form onSubmit={handleAddReport} className="space-y-4">
              
              {/* Dropdown Kategori Bahaya */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Kategori Temuan (Wajib)
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as HazardCategory)} 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900"
                >
                  <option value="UNSAFE_CONDITION">⚠️ Kondisi Berbahaya (Unsafe Condition)</option>
                  <option value="UNSAFE_ACT">🚫 Tindakan Berbahaya (Unsafe Act)</option>
                  <option value="NEAR_MISS">⚡ Hampir Celaka (Near-Miss)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {category === 'UNSAFE_CONDITION' && 'Contoh: Racking penyok, lantai licin oli, kabel terkelupas, tangga patah.'}
                  {category === 'UNSAFE_ACT' && 'Contoh: Tidak memakai helm/harness di ketinggian, main HP di jalur forklift.'}
                  {category === 'NEAR_MISS' && 'Contoh: Muatan hampir jatuh menimpa orang, forklift hampir menabrak penyeberang.'}
                </p>
              </div>

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
                    <option value="Logistics">Logistics / Forklift</option>
                    <option value="Engineering">Engineering / ASRS</option>
                    <option value="Packaging Service">Packaging Service</option>
                    <option value="Office / GA">Office / GA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi Detail</label>
                  <input 
                    type="text" 
                    required 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Contoh: Racking Blok B-04" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                  />
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

              {/* FITUR CAPTURE / UPLOAD FOTO TEMUAN */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bukti Foto Temuan (Kamera / File)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 rounded-lg transition text-xs font-bold text-slate-700">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{capturedPhoto ? 'Ganti Foto' : 'Ambil Foto / Upload'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handlePhotoCapture} 
                      className="hidden" 
                    />
                  </label>
                  {capturedPhoto && (
                    <button 
                      type="button" 
                      onClick={() => setCapturedPhoto('')}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                {/* Pratinjau Foto */}
                {capturedPhoto && (
                  <div className="mt-2 relative w-full h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={capturedPhoto} 
                      alt="Pratinjau Temuan" 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-1 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Foto Terlampir
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Lengkap Temuan</label>
                <textarea 
                  rows={3} 
                  required 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Jelaskan kondisi bahaya yang terlihat atau kronologi hampir celaka..." 
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Penanggung Jawab Perbaikan (PIC)</label>
                <input 
                  type="text" 
                  value={pic} 
                  onChange={(e) => setPic(e.target.value)} 
                  placeholder="Contoh: Spv Warehouse / Tim Maintenance" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-900" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg transition shadow-sm mt-2"
              >
                + Simpan Laporan Temuan
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Temuan, Foto, & Status Penutupan */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Temuan Lapangan</p>
              <p className="text-xl font-black text-slate-900">{reports.length} Kasus</p>
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

          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-400 transition">
                
                {/* Header Card */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-slate-800">{report.reportNo}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-700">{report.location}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Pelapor: <span className="font-bold text-slate-600">{report.reporterName}</span> ({report.department}) — {report.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${report.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : report.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                      {report.riskLevel}
                    </span>
                    <button 
                      onClick={() => toggleStatus(report.id)} 
                      title="Klik untuk mengubah status tindakan"
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full transition border ${report.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : report.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-red-50 text-red-700 border-red-300'}`}
                    >
                      {report.status} ↻
                    </button>
                  </div>
                </div>

                {/* Badge Kategori Bahaya */}
                <div>
                  <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${getCategoryBadgeClass(report.category)}`}>
                    {getCategoryLabel(report.category)}
                  </span>
                </div>

                {/* Konten & Foto */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed w-full">
                    <p className="font-bold text-slate-900 mb-1">Deskripsi Bahaya:</p>
                    <p>{report.description}</p>
                  </div>

                  {report.photoUrl && (
                    <div className="w-full sm:w-28 h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img 
                        src={report.photoUrl} 
                        alt="Bukti Temuan" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Footer Card */}
                <div className="text-[11px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-slate-600 pt-2 border-t border-slate-100">
                  <p><span className="font-bold text-slate-800">Tindakan Langsung:</span> {report.immediateAction}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">PIC: {report.pic}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* FORMAT CETAK DOKUMEN RESMI LOG TEMUAN K3 (PRINT) */}
      {/* ================================================== */}
      <div className="hidden print:block w-full text-black">
        <div className="border-2 border-black p-6 w-full max-w-[850px] mx-auto">
          
          <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">LOG LAPORAN TEMUAN K3L (CAPA)</h1>
              <p className="text-[10px] font-bold uppercase text-gray-600">PT. Syspex Kemasindo - Sistem Manajemen K3 ISO 45001 & ISO 14001</p>
            </div>
            <div className="text-right border border-black p-2 text-[9px] font-bold uppercase">
              <p>Dokumen No: SYS-HSE-FRM-HAZ</p>
              <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-[10px] mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black p-2 text-center w-[10%]">No Lap.</th>
                <th className="border border-black p-2 text-left w-[18%]">Lokasi & Pelapor</th>
                <th className="border border-black p-2 text-left w-[18%]">Kategori Temuan</th>
                <th className="border border-black p-2 text-left w-[26%]">Deskripsi Kondisi</th>
                <th className="border border-black p-2 text-left w-[18%]">Tindakan Korektif</th>
                <th className="border border-black p-2 text-center w-[10%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="border border-black p-2 text-center font-mono font-bold">{item.reportNo}</td>
                  <td className="border border-black p-2">
                    <p className="font-bold">{item.location}</p>
                    <p className="text-[8px] text-gray-600">{item.reporterName} ({item.department})</p>
                  </td>
                  <td className="border border-black p-2 font-bold leading-tight">
                    {getCategoryLabel(item.category)}
                    <p className="text-[8px] font-normal text-gray-600 mt-0.5">Risiko: {item.riskLevel}</p>
                  </td>
                  <td className="border border-black p-2 leading-snug">
                    <p>{item.description}</p>
                    {item.photoUrl && <p className="text-[8px] font-bold italic mt-1 text-gray-500">[Foto Bukti Terlampir di Sistem]</p>}
                  </td>
                  <td className="border border-black p-2 leading-snug">
                    <p>{item.immediateAction}</p>
                    <p className="text-[8px] font-bold text-gray-600 mt-0.5">PIC: {item.pic}</p>
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
