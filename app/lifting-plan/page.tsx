"use client"

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useLanguage } from '../LanguageContext'

type EquipmentType = 'CRANE' | 'FORKLIFT' | 'CHAIN_BLOCK'
type GateStatus = 'SAFE' | 'CRITICAL' | 'OVERLOAD'

interface LiftingPlanRecord {
  id: string
  projectName: string
  customerName: string
  location: string
  equipmentType: EquipmentType
  equipmentSpec: string
  date: string
  engineerName: string
  // Load & CoG
  netWeightKg: number
  riggingWeightKg: number
  grossLoadKg: number
  loadLengthMm: number
  cogDistanceMm: number
  // Crane / Chain Block Rigging
  slingLegs: number
  slingAngleDeg: number
  slingSwlKg: number
  craneRatedCapKg: number
  workingRadiusM: number
  // Forklift Specific
  forkliftRatedCapKg: number
  ratedLoadCenterMm: number
  useForkExtension: boolean
  baseForkLengthMm: number
  extensionLengthMm: number
  // Calculated Results
  slingTensionPerLegKg: number
  effectiveCapacityKg: number
  utilizationPct: number
  gateStatus: GateStatus
  createdAt: number
}

export default function LiftingPlanPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)

  // DB States
  const [plans, setPlans] = useState<LiftingPlanRecord[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  const [dbError, setDbError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [printPlan, setPrintPlan] = useState<LiftingPlanRecord | null>(null)

  // Project & Equipment Metadata
  const [projectName, setProjectName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [location, setLocation] = useState('')
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('FORKLIFT')
  const [equipmentSpec, setEquipmentSpec] = useState('')
  const [date, setDate] = useState('')
  const [engineerName, setEngineerName] = useState('')

  // Load & CoG Inputs
  const [netWeightKg, setNetWeightKg] = useState<number>(1200)
  const [riggingWeightKg, setRiggingWeightKg] = useState<number>(50)
  const [loadLengthMm, setLoadLengthMm] = useState<number>(1600)
  const [cogDistanceMm, setCogDistanceMm] = useState<number>(800)

  // Crane / Chain Block Inputs
  const [slingLegs, setSlingLegs] = useState<number>(2)
  const [slingAngleDeg, setSlingAngleDeg] = useState<number>(60)
  const [slingSwlKg, setSlingSwlKg] = useState<number>(2000)
  const [craneRatedCapKg, setCraneRatedCapKg] = useState<number>(5000)
  const [workingRadiusM, setWorkingRadiusM] = useState<number>(6)

  // Forklift Specific Inputs
  const [forkliftRatedCapKg, setForkliftRatedCapKg] = useState<number>(3000)
  const [ratedLoadCenterMm, setRatedLoadCenterMm] = useState<number>(500)
  const [useForkExtension, setUseForkExtension] = useState<boolean>(false)
  const [baseForkLengthMm, setBaseForkLengthMm] = useState<number>(1200)
  const [extensionLengthMm, setExtensionLengthMm] = useState<number>(1800)

  useEffect(() => {
    setMounted(true)
    setDate(new Date().toISOString().split('T')[0])

    const q = query(collection(db, 'lifting_plans'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPlans(snap.docs.map((d) => d.data() as LiftingPlanRecord))
        setLoadingDb(false)
        setDbError('')
      },
      (err) => {
        console.error(err)
        setLoadingDb(false)
        setDbError(
          lang === 'ID'
            ? 'Gagal terhubung ke Firestore. Pastikan Anda login sebagai Admin.'
            : 'Failed to connect to Firestore. Ensure you are logged in as Admin.'
        )
      }
    )

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPrintPlan(null)
    }
    const handleAfterPrint = () => setPrintPlan(null)

    window.addEventListener('keydown', handleEsc)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      unsub()
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [lang])

  // Auto-update CoG default to half of load length when length changes
  const handleLengthChange = (val: number) => {
    setLoadLengthMm(val)
    if (val > 0) {
      setCogDistanceMm(Math.round(val / 2))
    }
  }

  // =========================================================================
  // ENGINEERING CALCULATIONS
  // =========================================================================
  const grossLoadKg = Math.max(0, netWeightKg) + Math.max(0, riggingWeightKg)

  // 1. Sling Tension Calculation (Crane & Chain Block)
  // Standard HSE rule: max 2 active load-bearing legs for 2, 3, or 4-leg bridles
  const activeLegs = slingLegs === 1 ? 1 : 2
  const angleRad = (slingAngleDeg * Math.PI) / 180
  const angleFactor = slingAngleDeg === 90 ? 1 : 1 / Math.sin(angleRad)
  const slingTensionPerLegKg =
    equipmentType === 'FORKLIFT'
      ? 0
      : Math.round((grossLoadKg / activeLegs) * angleFactor)

  const slingUtilPct =
    equipmentType === 'FORKLIFT' || slingSwlKg <= 0
      ? 0
      : (slingTensionPerLegKg / slingSwlKg) * 100

  // 2. Effective Equipment Capacity (with Forklift CoG Derating)
  let effectiveCapacityKg = 0
  if (equipmentType === 'FORKLIFT') {
    const safeRatedCap = Math.max(0, forkliftRatedCapKg)
    const safeRatedLc = Math.max(100, ratedLoadCenterMm)
    const actualCog = Math.max(safeRatedLc, cogDistanceMm)
    // Derated capacity formula: RatedCap * (RatedLoadCenter / ActualCoG)
    effectiveCapacityKg = Math.round(safeRatedCap * (safeRatedLc / actualCog))
  } else {
    effectiveCapacityKg = Math.max(0, craneRatedCapKg)
  }

  const equipUtilPct =
    effectiveCapacityKg > 0 ? (grossLoadKg / effectiveCapacityKg) * 100 : 100

  // Fork Extension Safety Rule: Extension length must not exceed 1.5x base fork length
  const forkExtensionInvalid =
    equipmentType === 'FORKLIFT' &&
    useForkExtension &&
    baseForkLengthMm > 0 &&
    extensionLengthMm > baseForkLengthMm * 1.5

  const maxUtilPct = Math.round(Math.max(equipUtilPct, slingUtilPct))

  let gateStatus: GateStatus = 'SAFE'
  if (maxUtilPct > 95 || forkExtensionInvalid || effectiveCapacityKg <= 0) {
    gateStatus = 'OVERLOAD'
  } else if (maxUtilPct > 80) {
    gateStatus = 'CRITICAL'
  }

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim() || !customerName.trim() || submitting) return
    setSubmitting(true)

    try {
      const docId = `LP-${Date.now().toString().slice(-6)}`
      const payload: LiftingPlanRecord = {
        id: docId,
        projectName: projectName.trim(),
        customerName: customerName.trim(),
        location: location.trim() || '-',
        equipmentType,
        equipmentSpec: equipmentSpec.trim() || '-',
        date,
        engineerName: engineerName.trim() || '-',
        netWeightKg,
        riggingWeightKg,
        grossLoadKg,
        loadLengthMm,
        cogDistanceMm,
        slingLegs,
        slingAngleDeg,
        slingSwlKg,
        craneRatedCapKg,
        workingRadiusM,
        forkliftRatedCapKg,
        ratedLoadCenterMm,
        useForkExtension,
        baseForkLengthMm,
        extensionLengthMm,
        slingTensionPerLegKg,
        effectiveCapacityKg,
        utilizationPct: maxUtilPct,
        gateStatus,
        createdAt: Date.now()
      }

      await setDoc(doc(db, 'lifting_plans', docId), payload)
      setProjectName('')
      setCustomerName('')
      setLocation('')
    } catch (err) {
      console.error(err)
      setDbError(
        lang === 'ID'
          ? 'Gagal menyimpan Lifting Plan ke Firestore.'
          : 'Failed to save Lifting Plan to Firestore.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm(lang === 'ID' ? 'Hapus dokumen Lifting Plan ini?' : 'Delete this Lifting Plan?')) return
    try {
      await deleteDoc(doc(db, 'lifting_plans', id))
    } catch (err) {
      console.error(err)
    }
  }

  const triggerPrint = (rec: LiftingPlanRecord) => {
    setPrintPlan(rec)
    setTimeout(() => {
      window.print()
    }, 300)
  }

  const t = {
    ID: {
      hub: 'HUB',
      bc: 'KONTROL PEKERJAAN',
      title: 'KALKULATOR & RENCANA LIFTING',
      subtitle: 'Perhitungan rekayasa beban, titik berat (CoG), derating forklift, dan tegangan sling untuk instalasi di customer.',
      sec_meta: '1. Informasi Pekerjaan & Customer',
      f_proj: 'Nama Mesin / Pekerjaan *',
      f_cust: 'Nama Customer *',
      f_loc: 'Area / Lokasi Instalasi',
      f_date: 'Tanggal Rencana',
      f_eng: 'Syspex Technical PIC',
      f_equip: 'Metode / Alat Angkat Utama',
      f_spec: 'Model / Kapasitas Alat',
      opt_forklift: 'FORKLIFT (STANDAR / GARPU TAMBAHAN)',
      opt_crane: 'MOBILE CRANE / TRUCK MOUNTED CRANE',
      opt_chain: 'CHAIN BLOCK / HOIST',

      sec_load: '2. Data Beban & Center of Gravity (CoG)',
      f_net: 'Berat Bersih Barang / Mesin (kg)',
      f_rig: 'Berat Alat Bantu / Rigging (kg)',
      f_len: 'Panjang Total Barang (mm)',
      f_cog: 'Jarak Titik Berat / CoG dari Tumit Garpu (mm)',
      cog_hint: 'Default otomatis 1/2 panjang barang. Ubah manual jika posisi mesin berat sebelah.',

      sec_rig: '3. Parameter Teknis Alat Angkat',
      f_fl_cap: 'Kapasitas Tertera Forklift (kg)',
      f_fl_lc: 'Standar Load Center Forklift (mm)',
      f_fl_ext: 'Gunakan Garpu Tambahan (Fork Extension)',
      f_fl_base: 'Panjang Garpu Asli (mm)',
      f_fl_ext_len: 'Panjang Garpu Tambahan (mm)',
      ext_warn: 'BAHAYA: Panjang garpu tambahan melebihi 1.5x panjang garpu asli (tidak stabil).',

      f_cr_cap: 'Kapasitas Crane pada Radius Kerja (kg)',
      f_cr_rad: 'Radius Kerja / Jangkauan Boom (meter)',
      f_sl_legs: 'Jumlah Kaki Sling',
      f_sl_ang: 'Sudut Sling (terhadap horizontal)',
      f_sl_swl: 'SWL per 1 Kaki Sling (kg)',

      res_title: 'HASIL VERIFIKASI REKAYASA (GO / NO-GO)',
      res_gross: 'TOTAL GROSS LOAD',
      res_eff_cap: 'KAPASITAS AKTUAL ALAT',
      res_tension: 'TEGANGAN PER KAKI SLING',
      res_util: 'UTILISASI MAKSIMAL',
      btn_save: submitting ? 'MENYIMPAN...' : 'SIMPAN KE REGISTER LIFTING PLAN',

      reg_title: 'Arsip Lifting Plan Tersimpan',
      reg_empty: 'Belum ada dokumen Lifting Plan tersimpan.',
      th_id: 'NO. DOKUMEN',
      th_cust: 'CUSTOMER & MESIN',
      th_equip: 'ALAT ANGKAT',
      th_calc: 'BEBAN / KAPASITAS',
      th_status: 'STATUS',
      th_act: 'AKSI',

      print_header: 'DOKUMEN RENCANA PENGANGKATAN (LIFTING PLAN) • SYSPEX ENGINEERING & HSE',
      print_check_title: 'VERIFIKASI KESELAMATAN PRA-PENGANGKATAN (PRE-LIFT CHECKLIST)',
      checks: [
        'Permukaan lantai / tanah rata, keras, dan mampu menahan beban total alat beserta muatan.',
        'Outrigger Crane terpasang penuh dengan alas bantalan (outrigger pad) atau jalur Forklift bebas hambatan.',
        'Sertifikat Riksa Uji (SILO) alat angkat dan Lisensi Operator (SIO) masih berlaku.',
        'Area radius ayunan beban (swing zone) telah dipasang barikade dan bebas dari personel.',
        'Titik berat (CoG) telah teridentifikasi dan beban terikat / bertumpu seimbang sebelum diangkat penuh.'
      ],
      sign_tech: 'Disusun Oleh (Syspex Technical)',
      sign_hse: 'Diverifikasi (Syspex HSE)',
      sign_cust: 'Disetujui (Customer PIC)'
    },
    EN: {
      hub: 'HUB',
      bc: 'WORK CONTROL',
      title: 'LIFTING & RIGGING PLAN CALCULATOR',
      subtitle: 'Engineering load calculation, Center of Gravity (CoG), forklift derating, and sling tension for customer site installations.',
      sec_meta: '1. Project & Customer Information',
      f_proj: 'Machine / Job Title *',
      f_cust: 'Customer Name *',
      f_loc: 'Installation Area / Site',
      f_date: 'Planned Date',
      f_eng: 'Syspex Technical PIC',
      f_equip: 'Primary Lifting Method',
      f_spec: 'Equipment Model / Spec',
      opt_forklift: 'FORKLIFT (STANDARD / FORK EXTENSION)',
      opt_crane: 'MOBILE CRANE / TRUCK MOUNTED CRANE',
      opt_chain: 'CHAIN BLOCK / HOIST',

      sec_load: '2. Load & Center of Gravity (CoG) Data',
      f_net: 'Net Machine / Cargo Weight (kg)',
      f_rig: 'Rigging / Spreader Gear Weight (kg)',
      f_len: 'Total Load Length (mm)',
      f_cog: 'CoG Distance from Fork Heel (mm)',
      cog_hint: 'Auto-defaults to half of load length. Adjust manually for asymmetric heavy-end machinery.',

      sec_rig: '3. Lifting Equipment Technical Parameters',
      f_fl_cap: 'Forklift Rated Capacity (kg)',
      f_fl_lc: 'Forklift Rated Load Center (mm)',
      f_fl_ext: 'Use Fork Extension (Long Load)',
      f_fl_base: 'Base Fork Length (mm)',
      f_fl_ext_len: 'Extension Length (mm)',
      ext_warn: 'HAZARD: Fork extension exceeds 1.5x base fork length (tipping hazard).',

      f_cr_cap: 'Crane Capacity at Working Radius (kg)',
      f_cr_rad: 'Working Radius (meters)',
      f_sl_legs: 'Number of Sling Legs',
      f_sl_ang: 'Sling Angle (from horizontal)',
      f_sl_swl: 'SWL per Single Sling Leg (kg)',

      res_title: 'ENGINEERING VERIFICATION (GO / NO-GO)',
      res_gross: 'TOTAL GROSS LOAD',
      res_eff_cap: 'EFFECTIVE CAPACITY',
      res_tension: 'TENSION PER SLING LEG',
      res_util: 'PEAK UTILIZATION',
      btn_save: submitting ? 'SAVING...' : 'SAVE TO LIFTING PLAN REGISTER',

      reg_title: 'Saved Lifting Plans Register',
      reg_empty: 'No saved Lifting Plans found.',
      th_id: 'DOC NO.',
      th_cust: 'CUSTOMER & MACHINE',
      th_equip: 'EQUIPMENT',
      th_calc: 'LOAD / CAPACITY',
      th_status: 'STATUS',
      th_act: 'ACTION',

      print_header: 'OFFICIAL LIFTING & RIGGING PLAN • SYSPEX ENGINEERING & HSE',
      print_check_title: 'MANDATORY PRE-LIFT SAFETY VERIFICATION CHECKLIST',
      checks: [
        'Ground / floor surface is level, firm, and capable of supporting total equipment and gross load.',
        'Crane outriggers are fully deployed with pads or Forklift travel path is clear of obstructions.',
        'Equipment inspection certificate (SILO) and Operator License (SIO) are valid.',
        'Swing radius / lifting zone is barricaded and clear of unauthorized personnel.',
        'Center of Gravity (CoG) is verified and load is balanced during initial test lift.'
      ],
      sign_tech: 'Prepared By (Syspex Technical)',
      sign_hse: 'Verified By (Syspex HSE)',
      sign_cust: 'Approved By (Customer PIC)'
    }
  }[lang]

  if (!mounted) return null

  // =========================================================================
  // CUSTOMER-READY PRINT VIEW
  // =========================================================================
  if (printPlan) {
    return (
      <div className="bg-white text-black p-8 min-h-screen">
        <div className="border-4 border-black mb-6">
          <div className="border-b-4 border-black p-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">LIFTING &amp; RIGGING PLAN</h1>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1">{t.print_header}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono">{printPlan.id}</span>
              <p className="text-xs font-black uppercase mt-1">GATE: {printPlan.gateStatus} ({printPlan.utilizationPct}%)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x-4 divide-black border-b-4 border-black text-xs">
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_cust}</span>
              <p className="font-black uppercase text-sm mt-0.5">{printPlan.customerName}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_proj}</span>
              <p className="font-black uppercase text-sm mt-0.5">{printPlan.projectName}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x-4 divide-black text-xs">
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_loc}</span>
              <p className="font-bold uppercase mt-0.5">{printPlan.location}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_date}</span>
              <p className="font-bold font-mono mt-0.5">{printPlan.date}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_equip}</span>
              <p className="font-bold uppercase mt-0.5">{printPlan.equipmentType}</p>
            </div>
            <div className="p-3">
              <span className="block text-[9px] font-black uppercase text-slate-600">{t.f_eng}</span>
              <p className="font-bold uppercase mt-0.5">{printPlan.engineerName}</p>
            </div>
          </div>
        </div>

        {/* ENGINEERING SUMMARY TABLE */}
        <table className="w-full border-4 border-black text-left text-xs mb-6">
          <thead className="bg-slate-200 border-b-4 border-black font-black uppercase">
            <tr>
              <th className="p-3 border-r-2 border-black">PARAMETER</th>
              <th className="p-3 border-r-2 border-black">VALUE</th>
              <th className="p-3 border-r-2 border-black">EQUIPMENT / RIGGING PARAMETER</th>
              <th className="p-3">VALUE</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black font-bold">
            <tr>
              <td className="p-3 border-r-2 border-black">Net Machine Weight</td>
              <td className="p-3 border-r-2 border-black font-mono">{printPlan.netWeightKg.toLocaleString()} kg</td>
              <td className="p-3 border-r-2 border-black">Equipment Spec / Model</td>
              <td className="p-3 uppercase">{printPlan.equipmentSpec}</td>
            </tr>
            <tr>
              <td className="p-3 border-r-2 border-black">Rigging / Gear Weight</td>
              <td className="p-3 border-r-2 border-black font-mono">{printPlan.riggingWeightKg.toLocaleString()} kg</td>
              <td className="p-3 border-r-2 border-black">Effective Derated Capacity</td>
              <td className="p-3 font-mono font-black">{printPlan.effectiveCapacityKg.toLocaleString()} kg</td>
            </tr>
            <tr>
              <td className="p-3 border-r-2 border-black font-black">TOTAL GROSS LOAD</td>
              <td className="p-3 border-r-2 border-black font-mono font-black">{printPlan.grossLoadKg.toLocaleString()} kg</td>
              <td className="p-3 border-r-2 border-black">
                {printPlan.equipmentType === 'FORKLIFT' ? 'Actual CoG / Rated Load Center' : 'Sling Tension / SWL per Leg'}
              </td>
              <td className="p-3 font-mono">
                {printPlan.equipmentType === 'FORKLIFT'
                  ? `${printPlan.cogDistanceMm} mm / ${printPlan.ratedLoadCenterMm} mm`
                  : `${printPlan.slingTensionPerLegKg.toLocaleString()} kg / ${printPlan.slingSwlKg.toLocaleString()} kg (${printPlan.slingAngleDeg} deg)`}
              </td>
            </tr>
          </tbody>
        </table>

        {/* PRE-LIFT CHECKLIST */}
        <div className="border-4 border-black p-4 mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-2">
            {t.print_check_title}
          </h2>
          <div className="space-y-2 text-xs font-bold">
            {t.checks.map((chk, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="inline-block w-4 h-4 border-2 border-black shrink-0 mt-0.5"></span>
                <span>{chk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-3 gap-6 text-center text-[10px] font-black uppercase tracking-widest">
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[120px]">
            <p>{t.sign_tech}</p>
            <div>
              <div className="border-b-2 border-black mt-12"></div>
              <p className="mt-1.5">{printPlan.engineerName}</p>
            </div>
          </div>
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[120px]">
            <p>{t.sign_hse}</p>
            <div>
              <div className="border-b-2 border-black mt-12"></div>
              <p className="mt-1.5">SYSPEX HSE DEPT</p>
            </div>
          </div>
          <div className="border-2 border-black p-4 flex flex-col justify-between min-h-[120px] bg-slate-100">
            <p>{t.sign_cust}</p>
            <div>
              <div className="border-b-2 border-black mt-12"></div>
              <p className="mt-1.5">{printPlan.customerName}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 w-full max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">{t.hub}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.bc}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          {t.title}
        </h1>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5">
          {t.subtitle}
        </p>
      </div>

      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-[4px] print:hidden">
          {dbError}
        </div>
      )}

      {/* CALCULATOR & LIVE VERIFICATION PANEL */}
      <form onSubmit={handleSavePlan} className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        
        {/* KOLOM KIRI & TENGAH: INPUT PARAMETER */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. INFORMASI PEKERJAAN */}
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.sec_meta}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-proj`} className="block text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-1.5">{t.f_proj}</label>
                <input id={`${formId}-proj`} required type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Instalasi Mesin Strapping Line 2" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor={`${formId}-cust`} className="block text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-1.5">{t.f_cust}</label>
                <input id={`${formId}-cust`} required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. PT. Contoh Industri" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor={`${formId}-loc`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_loc}</label>
                <input id={`${formId}-loc`} type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Loading Dock / Area Produksi" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-date`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_date}</label>
                  <input id={`${formId}-date`} type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
                </div>
                <div>
                  <label htmlFor={`${formId}-eng`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_eng}</label>
                  <input id={`${formId}-eng`} type="text" value={engineerName} onChange={e => setEngineerName(e.target.value)} placeholder="Nama Teknisi" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
                </div>
              </div>
              <div>
                <label htmlFor={`${formId}-equip`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_equip}</label>
                <select id={`${formId}-equip`} value={equipmentType} onChange={e => setEquipmentType(e.target.value as EquipmentType)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="FORKLIFT">{t.opt_forklift}</option>
                  <option value="CRANE">{t.opt_crane}</option>
                  <option value="CHAIN_BLOCK">{t.opt_chain}</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-spec`} className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{t.f_spec}</label>
                <input id={`${formId}-spec`} type="text" value={equipmentSpec} onChange={e => setEquipmentSpec(e.target.value)} placeholder="e.g. Toyota 3 Ton Diesel / Tadano 25T" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-[4px] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
            </div>
          </div>

          {/* 2. DATA BEBAN & CENTER OF GRAVITY (CoG) */}
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.sec_load}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-net`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_net}</label>
                <input id={`${formId}-net`} type="number" min={0} value={netWeightKg} onChange={e => setNetWeightKg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor={`${formId}-rig`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_rig}</label>
                <input id={`${formId}-rig`} type="number" min={0} value={riggingWeightKg} onChange={e => setRiggingWeightKg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor={`${formId}-len`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_len}</label>
                <input id={`${formId}-len`} type="number" min={100} value={loadLengthMm} onChange={e => handleLengthChange(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor={`${formId}-cog`} className="block text-[9px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1.5">{t.f_cog}</label>
                <input id={`${formId}-cog`} type="number" min={100} value={cogDistanceMm} onChange={e => setCogDistanceMm(Number(e.target.value))} className="w-full px-3 py-2.5 bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
                <p className="text-[10px] text-slate-500 mt-1">{t.cog_hint}</p>
              </div>
            </div>
          </div>

          {/* 3. PARAMETER TEKNIS ALAT ANGKAT (DINAMIS SESUAI PILIHAN) */}
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t.sec_rig}
            </h2>

            {equipmentType === 'FORKLIFT' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-flcap`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_fl_cap}</label>
                    <input id={`${formId}-flcap`} type="number" min={100} value={forkliftRatedCapKg} onChange={e => setForkliftRatedCapKg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-fllc`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_fl_lc}</label>
                    <select id={`${formId}-fllc`} value={ratedLoadCenterMm} onChange={e => setRatedLoadCenterMm(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                      <option value={500}>500 mm (Standar 1 - 4 Ton)</option>
                      <option value={600}>600 mm (Standar 5 - 10 Ton)</option>
                      <option value={900}>900 mm (Heavy Forklift)</option>
                    </select>
                  </div>
                </div>

                <label htmlFor={`${formId}-ext-check`} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[4px] cursor-pointer">
                  <input id={`${formId}-ext-check`} type="checkbox" checked={useForkExtension} onChange={e => setUseForkExtension(e.target.checked)} className="w-4 h-4 accent-teal-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t.f_fl_ext}</span>
                </label>

                {useForkExtension && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label htmlFor={`${formId}-basefork`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_fl_base}</label>
                      <input id={`${formId}-basefork`} type="number" min={500} value={baseForkLengthMm} onChange={e => setBaseForkLengthMm(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-extfork`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_fl_ext_len}</label>
                      <input id={`${formId}-extfork`} type="number" min={500} value={extensionLengthMm} onChange={e => setExtensionLengthMm(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white" />
                    </div>
                    {forkExtensionInvalid && (
                      <div className="sm:col-span-2 p-3 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-700 dark:text-rose-300 text-xs font-black rounded-[4px]">
                        {t.ext_warn}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${formId}-crcap`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_cr_cap}</label>
                  <input id={`${formId}-crcap`} type="number" min={100} value={craneRatedCapKg} onChange={e => setCraneRatedCapKg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white" />
                </div>
                {equipmentType === 'CRANE' && (
                  <div>
                    <label htmlFor={`${formId}-crrad`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_cr_rad}</label>
                    <input id={`${formId}-crrad`} type="number" min={1} step="0.5" value={workingRadiusM} onChange={e => setWorkingRadiusM(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white" />
                  </div>
                )}
                <div>
                  <label htmlFor={`${formId}-sllegs`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_sl_legs}</label>
                  <select id={`${formId}-sllegs`} value={slingLegs} onChange={e => setSlingLegs(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white">
                    <option value={1}>1 Leg (Vertical)</option>
                    <option value={2}>2 Legs Bridle</option>
                    <option value={4}>4 Legs Bridle (Max 2 Active)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-slang`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_sl_ang}</label>
                  <select id={`${formId}-slang`} value={slingAngleDeg} onChange={e => setSlingAngleDeg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white">
                    <option value={90}>90 deg (Factor 1.00)</option>
                    <option value={60}>60 deg (Factor 1.15 - Optimal)</option>
                    <option value={45}>45 deg (Factor 1.41 - Caution)</option>
                    <option value={30}>30 deg (Factor 2.00 - High Stress)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${formId}-slswl`} className="block text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1.5">{t.f_sl_swl}</label>
                  <input id={`${formId}-slswl`} type="number" min={100} value={slingSwlKg} onChange={e => setSlingSwlKg(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-xs font-mono font-black text-slate-900 dark:text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: LIVE ENGINEERING DASHBOARD */}
        <div className="space-y-4">
          <div className={`p-6 rounded-[4px] border-2 space-y-5 sticky top-6 ${
            gateStatus === 'OVERLOAD'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-600'
              : gateStatus === 'CRITICAL'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500'
              : 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-600'
          }`}>
            <div className="border-b border-slate-300 dark:border-slate-700 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.res_title}
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className={`text-2xl font-black uppercase tracking-tight ${
                  gateStatus === 'OVERLOAD'
                    ? 'text-rose-700 dark:text-rose-400'
                    : gateStatus === 'CRITICAL'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
                }`}>
                  {gateStatus === 'OVERLOAD' ? 'NO-GO / OVERLOAD' : gateStatus === 'CRITICAL' ? 'CRITICAL (81-95%)' : 'APPROVED / SAFE'}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {maxUtilPct}%
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">{t.res_gross}</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{grossLoadKg.toLocaleString()} kg</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">{t.res_eff_cap}</span>
                <span className="font-mono font-black text-sm text-teal-700 dark:text-teal-400">{effectiveCapacityKg.toLocaleString()} kg</span>
              </div>

              {equipmentType === 'FORKLIFT' ? (
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-600 dark:text-slate-400">CoG vs LOAD CENTER</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">{cogDistanceMm} / {ratedLoadCenterMm} mm</span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{t.res_tension}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">{slingTensionPerLegKg.toLocaleString()} / {slingSwlKg.toLocaleString()} kg</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!projectName.trim() || !customerName.trim() || submitting}
              className="w-full py-3.5 min-h-[44px] bg-slate-900 dark:bg-slate-100 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-slate-900 dark:hover:text-white text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-colors disabled:opacity-40"
            >
              {t.btn_save}
            </button>
          </div>
        </div>
      </form>

      {/* REGISTER ARSIP LIFTING PLAN */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden print:hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {t.reg_title} ({plans.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">{t.th_id}</th>
                <th className="py-3 px-4">{t.th_cust}</th>
                <th className="py-3 px-4">{t.th_equip}</th>
                <th className="py-3 px-4">{t.th_calc}</th>
                <th className="py-3 px-4 text-center">{t.th_status}</th>
                <th className="py-3 px-4 text-center">{t.th_act}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
              {loadingDb ? (
                <tr><td colSpan={6} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-teal-600">LOADING...</td></tr>
              ) : plans.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{t.reg_empty}</td></tr>
              ) : (
                plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-mono text-[10px] font-black text-slate-500">
                      {p.id} <br /> <span className="text-slate-800 dark:text-slate-300">{p.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-black uppercase">{p.customerName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{p.projectName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-black uppercase">{p.equipmentType}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{p.equipmentSpec}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] font-bold">
                      {p.grossLoadKg.toLocaleString()} kg / {p.effectiveCapacityKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-[2px] ${
                        p.gateStatus === 'OVERLOAD'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                          : p.gateStatus === 'CRITICAL'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}>
                        {p.gateStatus} ({p.utilizationPct}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1.5">
                        <button type="button" onClick={() => triggerPrint(p)} className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors">
                          PRINT
                        </button>
                        <button type="button" onClick={() => handleDeletePlan(p.id)} aria-label="Hapus Lifting Plan" className="px-2 py-1.5 text-[9px] font-black text-slate-400 hover:text-rose-600 rounded-[2px]">
                          [X]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
