"use client"

import { useState, useId, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface JsaStep {
  id: string
  stepDescription: string
  hazards: string
  consequences: string
  riskLevel: 'Ekstrem' | 'Tinggi' | 'Sedang' | 'Rendah'
  controlMeasures: string
  pic: string
}

export default function JsaPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [todayDate, setTodayDate] = useState<string>('')
  
  const [jobTitle, setJobTitle] = useState<string>('Pemasangan Selective Pallet Racking Gudang Blok B')
  const [department, setDepartment] = useState<string>('Engineering & Installation')
  const [location, setLocation] = useState<string>('Syspex Distribution Center')
  const [supervisor, setSupervisor] = useState<string>('Agus Santoso')
  const [hseOfficer, setHseOfficer] = useState<string>('Lintang Satrio')

  // Kamus Dwibahasa & Database Template
  const dict = {
    ID: {
      breadcrumb: "Keselamatan Lapangan",
      title: "JSA Generator",
      subtitle: "Matriks mitigasi tahapan kerja, identifikasi bahaya, dan hierarki pengendalian risiko sebelum pekerjaan dimulai.",
      btn_print: "Cetak Matriks JSA Resmi",
      btn_load_1: "Instalasi Racking",
      btn_load_2: "Maintenance Packaging",
      lbl_load: "Muat Template:",
      
      p1_title: "1. Parameter Aktivitas Pekerjaan",
      p1_job: "Nama Pekerjaan / Proyek",
      p1_loc: "Lokasi / Area",
      p1_dept: "Departemen Pelaksana",
      
      p2_title: "2. Tambah Tahapan Pekerjaan & Mitigasi",
      p2_step: "Tahapan Kerja (Step)",
      p2_hazard: "Potensi Bahaya Teridentifikasi",
      p2_risk: "Level Risiko",
      p2_pic: "PIC Lapangan",
      p2_control: "Tindakan Pengendalian (Hierarki Kontrol)",
      btn_add: "+ Simpan Tahap",
      
      p3_title: "3. Matriks Analisis Keselamatan Kerja",
      th_no: "No",
      th_step: "Urutan Tahapan Pekerjaan",
      th_hazard: "Bahaya & Dampak Risiko",
      th_risk: "Tingkat Risiko",
      th_control: "Pengendalian Risiko (Mitigasi)",
      th_pic: "PIC",
      th_action: "Aksi",
      btn_delete: "Hapus",

      print_doc_type: "DOKUMEN RESMI ANALISIS KESELAMATAN PEKERJAAN • SYSPEX HSE",
      print_reg: "Nomor Registrasi:",
      sign_spv: "Disusun Oleh (Supervisor):",
      sign_hse: "Ditinjau & Disetujui (HSE Officer):",
      sign_pm: "Disetujui Oleh (Project Manager):",
      sign_name: "Tanda Tangan & Nama",
      
      templates: {
        'Instalasi Racking': [
          {
            id: '1', stepDescription: 'Bongkar muat komponen upright frame dan beam dari kontainer',
            hazards: 'Material racking terguling, jepitan saat unstrapping bundle', consequences: 'Fraktur kaki/tangan, memar berat',
            riskLevel: 'Tinggi', controlMeasures: 'Gunakan forklift kapasitas sesuai, pasang barikade 5m, wajib sarung tangan impact', pic: 'Spv Logistik'
          },
          {
            id: '2', stepDescription: 'Pemasangan upright frame & bracing diagonal',
            hazards: 'Tiang roboh mendadak, hantaman palu', consequences: 'Tertimpa rangka baja berat',
            riskLevel: 'Ekstrem', controlMeasures: 'Tahan frame dengan support sementara, pastikan baut terkunci sebelum melepas penopang', pic: 'Lead Rigger'
          },
          {
            id: '3', stepDescription: 'Pengeboran lantai & pemasangan angkur',
            hazards: 'Debu silika terhirup, sengatan listrik, getaran', consequences: 'Gangguan pernapasan, cedera fatal',
            riskLevel: 'Sedang', controlMeasures: 'Inspeksi grounding alat bor, wajib masker N95 & safety goggle', pic: 'Teknisi'
          }
        ] as JsaStep[],
        'Maintenance Mesin Packaging': [
          {
            id: '1', stepDescription: 'Pembersihan sisa strapping pada turn-table',
            hazards: 'Mesin berputar tiba-tiba, terjepit pinch-point', consequences: 'Amputasi jari/tangan',
            riskLevel: 'Ekstrem', controlMeasures: 'Terapkan prosedur LOTO (isolasi energi & gembok), uji zero energy', pic: 'Teknisi Listrik'
          },
          {
            id: '2', stepDescription: 'Pelepasan belt konveyor & pelumasan',
            hazards: 'Tumpahan oli, pegas tensioner lepas', consequences: 'Tergelincir, hantaman benda keras',
            riskLevel: 'Sedang', controlMeasures: 'Sediakan spill kit, gunakan sarung tangan nitrile tahan kimia', pic: 'Mekanik'
          }
        ] as JsaStep[]
      }
    },
    EN: {
      breadcrumb: "Field Safety",
      title: "JSA Generator",
      subtitle: "Job hazard analysis, mitigation matrices, and risk control hierarchies required before high-risk tasks.",
      btn_print: "Print Official JSA Matrix",
      btn_load_1: "Racking Installation",
      btn_load_2: "Packaging Maintenance",
      lbl_load: "Load Template:",
      
      p1_title: "1. Operational Parameters",
      p1_job: "Job / Project Name",
      p1_loc: "Location / Area",
      p1_dept: "Executing Department",
      
      p2_title: "2. Add Job Steps & Mitigation",
      p2_step: "Task Sequence (Step)",
      p2_hazard: "Identified Hazard Potential",
      p2_risk: "Risk Level",
      p2_pic: "Field PIC",
      p2_control: "Control Measures (Hierarchy of Controls)",
      btn_add: "+ Save Step",
      
      p3_title: "3. Job Safety Analysis Matrix",
      th_no: "No",
      th_step: "Task Sequence",
      th_hazard: "Hazards & Consequences",
      th_risk: "Risk Lvl",
      th_control: "Risk Control (Mitigation)",
      th_pic: "PIC",
      th_action: "Action",
      btn_delete: "Del",

      print_doc_type: "OFFICIAL JOB SAFETY ANALYSIS DOCUMENT • SYSPEX HSE",
      print_reg: "Registration No:",
      sign_spv: "Prepared By (Supervisor):",
      sign_hse: "Reviewed & Approved (HSE):",
      sign_pm: "Authorized By (Project Mgr):",
      sign_name: "Signature & Name",
      
      templates: {
        'Instalasi Racking': [
          {
            id: '1', stepDescription: 'Unload upright frames and beams from container',
            hazards: 'Racking material tipping, pinching during unstrapping', consequences: 'Bone fractures, severe contusions',
            riskLevel: 'Tinggi', controlMeasures: 'Use rated forklift, install 5m barricade, impact gloves mandatory', pic: 'Logistics Spv'
          },
          {
            id: '2', stepDescription: 'Install upright frames & diagonal bracing',
            hazards: 'Unsecured frame collapse, hammer impacts', consequences: 'Crushed by heavy steel structure',
            riskLevel: 'Ekstrem', controlMeasures: 'Brace frame with temporary supports, ensure bolts are locked before releasing support', pic: 'Lead Rigger'
          },
          {
            id: '3', stepDescription: 'Floor drilling & anchor installation',
            hazards: 'Silica dust inhalation, electric shock, vibration', consequences: 'Respiratory issues, fatal electrocution',
            riskLevel: 'Sedang', controlMeasures: 'Inspect drill grounding, N95 respirator & safety goggles mandatory', pic: 'Technician'
          }
        ],
        'Maintenance Mesin Packaging': [
          {
            id: '1', stepDescription: 'Clear strapping debris from turn-table',
            hazards: 'Unexpected machine rotation, pinch-points', consequences: 'Finger/hand amputation',
            riskLevel: 'Ekstrem', controlMeasures: 'Apply LOTO procedure (energy isolation & padlock), zero energy verification test', pic: 'Electrician'
          },
          {
            id: '2', stepDescription: 'Conveyor belt removal & lubrication',
            hazards: 'Oil spills, tensioner spring release', consequences: 'Slips/falls, mechanical impacts',
            riskLevel: 'Sedang', controlMeasures: 'Deploy spill kit in work area, wear chemical-resistant nitrile gloves', pic: 'Mechanic'
          }
        ]
      }
    }
  }

  const t = dict[lang]
  const [steps, setSteps] = useState<JsaStep[]>(t.templates['Instalasi Racking'])

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
    setNewStep(''); setNewHazard(''); setNewConsequence(''); setNewControl(''); setNewPic('')
  }

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const handleLoadTemplate = (templateKey: 'Instalasi Racking' | 'Maintenance Mesin Packaging') => {
    setSteps(t.templates[templateKey])
    setJobTitle(templateKey === 'Instalasi Racking' 
      ? (lang === 'ID' ? 'Pemasangan Selective Pallet Racking' : 'Selective Pallet Racking Installation') 
      : (lang === 'ID' ? 'Overhaul Mesin Strapping Line 1' : 'Strapping Machine Overhaul Line 1'))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={steps.length === 0}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm disabled:opacity-50"
          >
            {t.btn_print}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mr-2">{t.lbl_load}</span>
          <button onClick={() => handleLoadTemplate('Instalasi Racking')} className="px-3 py-1.5 rounded-[4px] bg-slate-100 border border-slate-200 hover:border-slate-900 text-[9px] font-black text-slate-700 uppercase tracking-wider transition">
            {t.btn_load_1}
          </button>
          <button onClick={() => handleLoadTemplate('Maintenance Mesin Packaging')} className="px-3 py-1.5 rounded-[4px] bg-slate-100 border border-slate-200 hover:border-slate-900 text-[9px] font-black text-slate-700 uppercase tracking-wider transition">
            {t.btn_load_2}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Job Safety Analysis</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">JSA-{todayDate.replace(/-/g, '')}-01</span>
          </div>
        </div>
      </div>

      {/* 1. PARAMETER AKTIVITAS */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 print:border-black print:text-black">
          {t.p1_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${formId}-job`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_job}</label>
            <input id={`${formId}-job`} type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_loc}</label>
            <input id={`${formId}-loc`} type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
          <div>
            <label htmlFor={`${formId}-dept`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 print:text-black">{t.p1_dept}</label>
            <input id={`${formId}-dept`} type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 print:border-b-2 print:border-black print:bg-transparent print:p-0 print:rounded-none" />
          </div>
        </div>
      </div>

      {/* 2. TAMBAH TAHAPAN (HIDE ON PRINT) */}
      <div className="bg-slate-900 rounded-md p-6 border border-slate-800 space-y-4 print:hidden">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-slate-800 pb-2">
          {t.p2_title}
        </h2>
        <form onSubmit={handleAddStep} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-step`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_step}</label>
            <input id={`${formId}-step`} type="text" placeholder="..." value={newStep} onChange={(e) => setNewStep(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${formId}-hazard`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_hazard}</label>
            <input id={`${formId}-hazard`} type="text" placeholder="..." value={newHazard} onChange={(e) => setNewHazard(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor={`${formId}-risk`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_risk}</label>
            <select id={`${formId}-risk`} value={newRisk} onChange={(e) => setNewRisk(e.target.value as any)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500">
              <option value="Rendah">Rendah (Low)</option>
              <option value="Sedang">Sedang (Med)</option>
              <option value="Tinggi">Tinggi (High)</option>
              <option value="Ekstrem">Ekstrem (Ext)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${formId}-pic`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_pic}</label>
            <input id={`${formId}-pic`} type="text" placeholder="PIC..." value={newPic} onChange={(e) => setNewPic(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="md:col-span-5">
            <label htmlFor={`${formId}-ctrl`} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.p2_control}</label>
            <input id={`${formId}-ctrl`} type="text" placeholder="..." value={newControl} onChange={(e) => setNewControl(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs font-bold text-white focus:outline-none focus:border-teal-500" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={!newStep.trim() || !newHazard.trim()} className="w-full py-2 bg-teal-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 disabled:opacity-40 transition">
              {t.btn_add}
            </button>
          </div>
        </form>
      </div>

      {/* 3. MATRIKS JSA */}
      <div className="bg-white rounded-md p-6 border border-slate-200 print:border-none print:p-0 space-y-4">
        <div className="flex justify-between items-end border-b border-slate-200 pb-2 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 print:text-black">
            {t.p3_title}
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:hidden">
            TOTAL: {steps.length}
          </span>
        </div>

        <div className="overflow-x-auto border-2 border-slate-200 print:border-black rounded-[4px] print:rounded-none">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b-2 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 print:bg-white print:border-black print:text-black">
              <tr>
                <th className="py-3 px-3 w-10 text-center">{t.th_no}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 print:border-black">{t.th_step}</th>
                <th className="py-3 px-3 w-1/4 border-l-2 border-slate-200 print:border-black">{t.th_hazard}</th>
                <th className="py-3 px-3 text-center w-24 border-l-2 border-slate-200 print:border-black">{t.th_risk}</th>
                <th className="py-3 px-3 border-l-2 border-slate-200 print:border-black">{t.th_control}</th>
                <th className="py-3 px-3 w-24 border-l-2 border-slate-200 print:border-black">{t.th_pic}</th>
                <th className="py-3 px-3 text-center w-16 border-l-2 border-slate-200 print:hidden">{t.th_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-slate-900 print:divide-black">
              {steps.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50 print:hover:bg-white">
                  <td className="py-3 px-3 text-center font-black text-slate-400 print:text-black">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold leading-relaxed border-l-2 border-slate-100 print:border-black print:text-[10px]">{st.stepDescription}</td>
                  <td className="py-3 px-3 leading-relaxed border-l-2 border-slate-100 print:border-black print:text-[10px]">
                    <p className="font-black text-rose-700 print:text-black">{st.hazards}</p>
                    <p className="text-[10px] font-bold text-slate-500 print:text-black mt-1 uppercase tracking-wider">{st.consequences}</p>
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:border-black">
                    <span className={`px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase tracking-widest inline-block print:border print:border-black print:bg-transparent print:text-black ${
                      st.riskLevel === 'Ekstrem' ? 'bg-rose-100 text-rose-800' :
                      st.riskLevel === 'Tinggi' ? 'bg-amber-100 text-amber-800' :
                      st.riskLevel === 'Sedang' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {st.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold leading-relaxed border-l-2 border-slate-100 print:border-black print:text-[10px]">
                    {st.controlMeasures}
                  </td>
                  <td className="py-3 px-3 font-black text-[10px] uppercase border-l-2 border-slate-100 print:border-black">
                    {st.pic}
                  </td>
                  <td className="py-3 px-3 text-center border-l-2 border-slate-100 print:hidden">
                    <button onClick={() => handleDeleteStep(st.id)} className="text-slate-400 hover:text-rose-600 font-black px-1.5 py-0.5 text-[9px] uppercase tracking-widest border border-transparent hover:border-rose-200 rounded transition">
                      {t.btn_delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN DOKUMEN CETAK */}
        <div className="hidden print:grid grid-cols-3 gap-6 pt-12 mt-12 border-t-4 border-black">
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_spv}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">{supervisor}</p>
          </div>
          <div className="text-center border-2 border-black p-4">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_hse}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">{hseOfficer}</p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-slate-100">
            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-16">{t.sign_pm}</p>
            <div className="w-3/4 mx-auto border-b-2 border-black"></div>
            <p className="text-[10px] font-black mt-2 uppercase">{t.sign_name}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
