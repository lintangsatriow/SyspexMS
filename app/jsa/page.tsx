"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'

interface JsaStep {
  id: string
  stepDescription: string
  hazards: string
  consequences: string
  riskLevel: 'Ekstrem' | 'Tinggi' | 'Sedang' | 'Rendah'
  controlMeasures: string
  pic: string
}

const TEMPLATE_STEPS: Record<string, JsaStep[]> = {
  'Instalasi Racking': [
    {
      id: '1',
      stepDescription: 'Bongkar muat komponen upright frame dan beam dari truk kontainer',
      hazards: 'Material racking terguling, jepitan saat unstrapping bundle',
      consequences: 'Fraktur kaki/tangan, luka memar berat',
      riskLevel: 'Tinggi',
      controlMeasures: 'Bongkar muat pakai forklift berkapasitas sesuai, pasang barikade 5m, pakai sarung tangan impact & safety shoes',
      pic: 'Supervisor Logistik'
    },
    {
      id: '2',
      stepDescription: 'Pemasangan upright frame dan pengikatan bracing diagonal',
      hazards: 'Tiang tegak belum terikat roboh mendadak, terpukul palu',
      consequences: 'Tertimpa rangka baja berat',
      riskLevel: 'Ekstrem',
      controlMeasures: 'Tahan frame dengan temporary support (tali guyline/pipa penopang), pastikan baut bracing terkunci sebelum melepas penopang',
      pic: 'Lead Rigger'
    },
    {
      id: '3',
      stepDescription: 'Pengeboran lantai beton dan pemasangan angkur baseplate (dynabolt)',
      hazards: 'Debu silika beton terhirup, kabel bor lecet/tersengat listrik, getaran rotary hammer',
      consequences: 'Gangguan pernapasan, sengatan listrik fatal',
      riskLevel: 'Sedang',
      controlMeasures: 'Inspeksi grounding alat bor, wajib masker respirator N95 & kacamata goggle anti debu',
      pic: 'Teknisi Mekanikal'
    }
  ],
  'Maintenance Mesin Packaging': [
    {
      id: '1',
      stepDescription: 'Pembersihan sisa plastik strapping/stretch film pada area turn-table & roller gear',
      hazards: 'Mesin berputar tiba-tiba, tangan terjepit di pinch-point',
      consequences: 'Amputasi jari/tangan',
      riskLevel: 'Ekstrem',
      controlMeasures: 'Terapkan prosedur LOTO (putus sumber listrik & pasang gembok pada isolator utama), uji coba zero energy verification',
      pic: 'Teknisi Listrik'
    },
    {
      id: '2',
      stepDescription: 'Pelepasan belt konveyor dan pelumasan bearing',
      hazards: 'Tumpahan oli/grease ke lantai, pegas tensioner lepas',
      consequences: 'Tergelincir, hantaman pegas mekanis',
      riskLevel: 'Sedang',
      controlMeasures: 'Sediakan spill kit di area kerja, gunakan kunci pass pas ukuran presisi, pakai sarung tangan nitrile tahan kimia',
      pic: 'Teknisi Mekanikal'
    }
  ]
}

export default function JsaPage() {
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  const [jobTitle, setJobTitle] = useState<string>('Pemasangan Selective Pallet Racking Gudang Blok B')
  const [department, setDepartment] = useState<string>('Engineering & Installation')
  const [location, setLocation] = useState<string>('Syspex Distribution Center')
  const [supervisor, setSupervisor] = useState<string>('Agus Santoso')
  const [hseOfficer, setHseOfficer] = useState<string>('Lintang Satrio')
  
  const [steps, setSteps] = useState<JsaStep[]>(TEMPLATE_STEPS['Instalasi Racking'])

  // Input Tambah Step Manual
  const [newStep, setNewStep] = useState<string>('')
  const [newHazard, setNewHazard] = useState<string>('')
  const [newConsequence, setNewConsequence] = useState<string>('')
  const [newRisk, setNewRisk] = useState<'Ekstrem' | 'Tinggi' | 'Sedang' | 'Rendah'>('Tinggi')
  const [newControl, setNewControl] = useState<string>('')
  const [newPic, setNewPic] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStep.trim() || !newHazard.trim()) return

    const item: JsaStep = {
      id: Math.random().toString(36).substring(2, 7),
      stepDescription: newStep,
      hazards: newHazard,
      consequences: newConsequence || '-',
      riskLevel: newRisk,
      controlMeasures: newControl,
      pic: newPic || supervisor
    }
    setSteps([...steps, item])
    setNewStep('')
    setNewHazard('')
    setNewConsequence('')
    setNewControl('')
    setNewPic('')
  }

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const handleLoadTemplate = (templateKey: string) => {
    if (TEMPLATE_STEPS[templateKey]) {
      setSteps(TEMPLATE_STEPS[templateKey])
      setJobTitle(templateKey === 'Instalasi Racking' 
        ? 'Pemasangan Selective Pallet Racking Gudang Blok B' 
        : 'Overhaul Mesin Strapping & Stretch Wrapper Line 1')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Interaktif */}
      <div className="border-b border-slate-300 pb-5 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub Modul Utama</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Job Safety Analysis</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Job Safety Analysis (JSA) Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Matriks mitigasi tahapan kerja teknis, identifikasi bahaya, dan hierarki pengendalian risiko sebelum pekerjaan berisiko dimulai.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={steps.length === 0}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition shadow-sm self-start sm:self-auto cursor-pointer disabled:opacity-50"
          >
            🖨️ Cetak Matriks JSA Resmi
          </button>
        </div>

        {/* Pemilih Template Cepat */}
        <div className="flex items-center gap-2 mt-4 text-xs font-bold">
          <span className="text-slate-500 text-[11px] uppercase tracking-wider">Muat Template Cepat:</span>
          <button 
            onClick={() => handleLoadTemplate('Instalasi Racking')}
            className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
          >
            Instalasi Racking
          </button>
          <button 
            onClick={() => handleLoadTemplate('Maintenance Mesin Packaging')}
            className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
          >
            Maintenance Mesin Packaging
          </button>
        </div>
      </div>

      {/* Header Khusus Print Output */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Job Safety Analysis (JSA)</h1>
            <p className="text-xs text-slate-600 font-bold mt-1">DOKUMEN RESMI ANALISIS KESELAMATAN PEKERJAAN &bull; SYSPEX HSE</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Nomor Registrasi:</span>
            <span className="text-sm font-black text-slate-900 font-mono">JSA-SYSPEX-{todayDate.replace(/-/g, '')}-01</span>
          </div>
        </div>
      </div>

      {/* Informasi Umum Pekerjaan */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:p-0 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 print:border-slate-900">
          1. Parameter Aktivitas Pekerjaan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pekerjaan / Proyek</label>
            <input 
              type="text" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:border-none print:bg-transparent print:p-0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lokasi / Area</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:border-none print:bg-transparent print:p-0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departemen Pelaksana</label>
            <input 
              type="text" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 focus:outline-none print:border-none print:bg-transparent print:p-0"
            />
          </div>
        </div>
      </div>

      {/* Form Tambah Langkah Kerja (Hanya di Layar) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 print:hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          2. Tambah Tahapan Pekerjaan &amp; Mitigasi
        </h2>
        <form onSubmit={handleAddStep} className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Tahapan Kerja (Step)</label>
            <input
              type="text"
              placeholder="Contoh: Mengangkat balok dengan crane..."
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Potensi Bahaya Teridentifikasi</label>
            <input
              type="text"
              placeholder="Contoh: Sling tergores sudut tajam..."
              value={newHazard}
              onChange={(e) => setNewHazard(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Level Risiko</label>
            <select
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
            >
              <option value="Rendah">Rendah (Low)</option>
              <option value="Sedang">Sedang (Medium)</option>
              <option value="Tinggi">Tinggi (High)</option>
              <option value="Ekstrem">Ekstrem (Extreme)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">PIC Lapangan</label>
            <input
              type="text"
              placeholder="PIC..."
              value={newPic}
              onChange={(e) => setNewPic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Tindakan Pengendalian (Hierarki Kontrol)</label>
            <input
              type="text"
              placeholder="Contoh: Gunakan corner protector pada sling, pasang barikade radius ayun..."
              value={newControl}
              onChange={(e) => setNewControl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!newStep.trim() || !newHazard.trim()}
              className="w-full py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition"
            >
              + Simpan Tahap
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Matriks JSA (Tampil Penuh di Layar & Cetak) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm print:border-none print:p-0 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2 print:border-slate-900">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            3. Lembar Matriks Analisis Keselamatan Kerja
          </h2>
          <span className="text-[10px] font-bold text-slate-500 print:hidden font-mono">
            {steps.length} Tahapan Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded print:border-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 print:bg-slate-200 print:border-slate-900">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center font-bold">No</th>
                <th className="py-2.5 px-3 font-bold w-1/4">Urutan Tahapan Pekerjaan</th>
                <th className="py-2.5 px-3 font-bold w-1/4">Bahaya &amp; Dampak Risiko</th>
                <th className="py-2.5 px-3 font-bold text-center w-24">Tingkat Risiko</th>
                <th className="py-2.5 px-3 font-bold">Pengendalian Risiko (Mitigasi)</th>
                <th className="py-2.5 px-3 font-bold w-24">PIC</th>
                <th className="py-2.5 px-3 font-bold text-center w-14 print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 print:divide-slate-300">
              {steps.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50/70 print:hover:bg-transparent">
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 leading-snug">{st.stepDescription}</td>
                  <td className="py-3 px-3 text-slate-700 leading-relaxed">
                    <p className="font-semibold text-red-700">{st.hazards}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dampak: {st.consequences}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                      st.riskLevel === 'Ekstrem' ? 'bg-red-100 text-red-800 border border-red-300' :
                      st.riskLevel === 'Tinggi' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      st.riskLevel === 'Sedang' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {st.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 leading-relaxed font-medium">
                    {st.controlMeasures}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700">{st.pic}</td>
                  <td className="py-3 px-3 text-center print:hidden">
                    <button 
                      onClick={() => handleDeleteStep(st.id)} 
                      className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 text-[10px]"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Lembar Tanda Tangan Cetak */}
        <div className="hidden print:grid grid-cols-3 gap-6 pt-10 mt-8 border-t-2 border-slate-900">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Disusun Oleh (Supervisor Teknis):</p>
            <div className="w-40 mx-auto border-b border-slate-400"></div>
            <p className="text-xs font-bold mt-1 uppercase">{supervisor}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Ditinjau &amp; Disetujui (HSE Officer):</p>
            <div className="w-40 mx-auto border-b border-slate-400"></div>
            <p className="text-xs font-bold mt-1 uppercase">{hseOfficer}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-12">Disetujui Oleh (Project Manager):</p>
            <div className="w-40 mx-auto border-b border-slate-400"></div>
            <p className="text-xs font-bold mt-1 uppercase">Tanda Tangan &amp; Nama</p>
          </div>
        </div>

      </div>

    </div>
  )
}
