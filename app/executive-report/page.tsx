```tsx
"use client"

import { useState, useEffect, useId, useMemo, useRef } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { useLanguage } from '../LanguageContext'

interface HseRecord {
  id: string
  year: number
  month: number
  department: string
  headcount: number
  lti: number
  spills: number
  manDays: number
  manHours: number
  recordableIncidents: number
  hazardReports: number
}

interface TargetConfig {
  trirMax: number
  ltiMax: number
  defaultHeadcount: number
  workingDaysPerMonth: number
  hoursPerDay: number
}

interface LiveHazardSummary {
  id: string
  status: 'OPEN' | 'ON_PROGRESS' | 'CLOSED'
}

interface LiveSioSummary {
  id: string
  expiryDate: string
}

type PeriodFilter = 'YTD' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
type YearFilter = number | 'ALL'
type InfoModalType = 'HOURS' | 'AVG_PERSONNEL' | 'DAILY_INTENSITY' | 'TRIR' | null
type EditableField = 'headcount' | 'manDays' | 'manHours' | 'lti' | 'spills' | 'recordableIncidents' | 'hazardReports'

interface HoverTooltip {
  x: number
  y: number
  title: string
  value: string
  statusColor: string
}

const DEPARTMENTS = [
  'Commercial', 'DS', 'Finance & Accounting', 'HRGA', 
  'Management', 'Operation', 'TAS', 'Technical', 'General'
]

const DEFAULT_TARGETS: TargetConfig = {
  trirMax: 1.0,
  ltiMax: 0,
  defaultHeadcount: 106,
  workingDaysPerMonth: 22,
  hoursPerDay: 9
}

const parseExcelDate = (rawVal: unknown): { year: number; month: number } | null => {
  if (rawVal === null || rawVal === undefined || rawVal === '') return null
  if (typeof rawVal === 'number' && rawVal > 20000 && rawVal < 90000) {
    const parsed = XLSX.SSF.parse_date_code(rawVal)
    if (parsed && parsed.y && parsed.m) return { year: parsed.y, month: parsed.m }
  }
  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return { year: rawVal.getFullYear(), month: rawVal.getMonth() + 1 }
  }
  const str = String(rawVal).trim()
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (isoMatch) return { year: Number(isoMatch[1]), month: Number(isoMatch[2]) }
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/)
  if (dmyMatch) return { year: Number(dmyMatch[3]), month: Number(dmyMatch[2]) }
  return null
}

const TrendLineChart = ({ 
  title, data, cautionTargets, criticalTargets, labels, unit, decimals = 0, limitMode = 'NONE', isMultiYear, onOpenInfo, lang
}: { 
  title: string; data: number[]; cautionTargets?: number[]; criticalTargets?: number[]; labels: string[]; unit: string; decimals?: number; limitMode?: 'NONE' | 'TWO_TIER' | 'SINGLE_MAX'; isMultiYear?: boolean; onOpenInfo: () => void; lang: 'ID' | 'EN'
}) => {
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null)

  const formatVal = (val: number) => {
    if (decimals > 0) return val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    return Math.round(val).toLocaleString('en-US')
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black transition-colors">
        <div className="flex justify-between items-center border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
        </div>
        <div className="h-44 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-800">
          NO DATA FOR SELECTED PERIOD
        </div>
      </div>
    )
  }

  const hasTwoTier = limitMode === 'TWO_TIER' && cautionTargets && criticalTargets && cautionTargets.length === data.length && criticalTargets.length === data.length
  const hasSingleMax = limitMode === 'SINGLE_MAX' && criticalTargets && criticalTargets.length === data.length

  const padX = 44, padY = 36, width = 1000, height = 250
  const plotWidth = width - padX * 2, plotHeight = height - padY * 2
  const maxCandidate = hasTwoTier || hasSingleMax ? Math.max(...data, ...(criticalTargets || [])) : Math.max(...data)
  const maxValue = maxCandidate > 0 ? maxCandidate * 1.18 : 1

  const mapY = (val: number) => padY + plotHeight - (val / maxValue) * plotHeight
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : plotWidth / 2
  const getX = (i: number) => (data.length > 1 ? padX + i * stepX : padX + stepX)

  const points = data.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ')
  const criticalPoints = (hasTwoTier || hasSingleMax) && criticalTargets ? criticalTargets.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ') : ''
  const cautionPoints = hasTwoTier && cautionTargets ? cautionTargets.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ') : ''

  const bufferZonePolygon = hasTwoTier && cautionTargets && criticalTargets && data.length > 1
    ? [
        ...criticalTargets.map((val, i) => `${getX(i)},${mapY(val)}`),
        ...[...cautionTargets].reverse().map((val, revI) => `${getX(cautionTargets.length - 1 - revI)},${mapY(val)}`)
      ].join(' ')
    : ''

  const avgCaution = hasTwoTier && cautionTargets ? cautionTargets.reduce((a, b) => a + b, 0) / cautionTargets.length : 0
  const avgCritical = (hasTwoTier || hasSingleMax) && criticalTargets ? criticalTargets.reduce((a, b) => a + b, 0) / criticalTargets.length : 0
  const avgActual = data.reduce((a, b) => a + b, 0) / data.length

  const criticalLimitText = lang === 'ID' ? 'BATAS KRITIS (OVER LIMIT)' : 'CRITICAL LIMIT (OVER LIMIT)'
  const cautionLimitText = lang === 'ID' ? 'BATAS WASPADA (EARLY WARNING)' : 'EARLY WARNING THRESHOLD'
  const bufferZoneText = lang === 'ID' ? 'ZONA WASPADA (ANTISIPASI LEMBUR)' : 'CAUTION BUFFER ZONE'

  return (
    <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
      <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
          <button type="button" onClick={onOpenInfo} aria-label="Panduan Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <div className="text-right">
          {hasTwoTier ? (
            <>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">WARN / CRITICAL</span>
              <span className="text-[10px] font-black font-mono">
                <span className="text-orange-600 dark:text-orange-400">{formatVal(avgCaution)}</span>
                <span className="text-slate-400"> / </span>
                <span className="text-rose-600 dark:text-rose-400">{formatVal(avgCritical)} {unit}</span>
              </span>
            </>
          ) : hasSingleMax ? (
            <>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">MAX TARGET</span>
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 font-mono">
                &lt; {formatVal(avgCritical)} {unit}
              </span>
            </>
          ) : (
            <>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">MONTHLY AVG</span>
              <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 font-mono">
                {formatVal(avgActual)} {unit}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="w-full overflow-hidden relative" onMouseLeave={() => setTooltip(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible mt-4" aria-label={`Line chart for ${title}`}>
          {hasTwoTier && cautionTargets && criticalTargets && (
            <>
              {data.length > 1 ? (
                <polygon
                  points={bufferZonePolygon}
                  className="fill-orange-50 dark:fill-orange-950/25 print:fill-gray-100 cursor-crosshair transition-opacity hover:opacity-80"
                  onMouseEnter={() => setTooltip({ x: width / 2, y: (mapY(avgCritical) + mapY(avgCaution)) / 2, title: bufferZoneText, value: `${formatVal(avgCaution)} - ${formatVal(avgCritical)} ${unit}`, statusColor: 'text-orange-600 dark:text-orange-400' })}
                />
              ) : (
                <rect x={padX} y={mapY(criticalTargets[0])} width={plotWidth} height={Math.max(0, mapY(cautionTargets[0]) - mapY(criticalTargets[0]))} className="fill-orange-50 dark:fill-orange-950/25 print:fill-gray-100" />
              )}
              {data.length > 1 ? (
                <g className="cursor-pointer" onMouseEnter={() => setTooltip({ x: width / 2, y: mapY(avgCaution), title: cautionLimitText, value: `${formatVal(avgCaution)} ${unit}`, statusColor: 'text-orange-600 dark:text-orange-400' })}>
                  <polyline points={cautionPoints} fill="none" stroke="transparent" strokeWidth="14" />
                  <polyline points={cautionPoints} fill="none" className="stroke-orange-500 print:stroke-black" strokeWidth="2" strokeDasharray="4,4" />
                </g>
              ) : (
                <line x1={padX} y1={mapY(cautionTargets[0])} x2={width-padX} y2={mapY(cautionTargets[0])} className="stroke-orange-500 print:stroke-black" strokeWidth="2" strokeDasharray="4,4" />
              )}
            </>
          )}

          {(hasTwoTier || hasSingleMax) && criticalTargets && (
            data.length > 1 ? (
              <g className="cursor-pointer" onMouseEnter={() => setTooltip({ x: width / 2, y: mapY(avgCritical), title: criticalLimitText, value: `MAX ${formatVal(avgCritical)} ${unit}`, statusColor: 'text-rose-600 dark:text-rose-400' })}>
                <polyline points={criticalPoints} fill="none" stroke="transparent" strokeWidth="14" />
                <polyline points={criticalPoints} fill="none" className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
              </g>
            ) : (
              <line x1={padX} y1={mapY(criticalTargets[0])} x2={width-padX} y2={mapY(criticalTargets[0])} className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
            )
          )}

          {data.length > 1 && (
            <polyline points={points} fill="none" className="stroke-teal-700 dark:stroke-teal-400 print:stroke-black pointer-events-none" strokeWidth="2.5" />
          )}

          {data.map((val, i) => {
            const cx = getX(i)
            const cy = mapY(val)
            let pointClass = "fill-teal-600 dark:fill-teal-400 print:fill-black"
            let statusColor = "text-teal-700 dark:text-teal-400"
            let statusTag = " (SAFE)"

            if (hasTwoTier && cautionTargets && criticalTargets) {
              if (val > criticalTargets[i]) { pointClass = "fill-rose-600 print:fill-gray-600"; statusColor = "text-rose-600 dark:text-rose-400"; statusTag = " (OVER LIMIT)" }
              else if (val >= cautionTargets[i]) { pointClass = "fill-orange-500 print:fill-gray-400"; statusColor = "text-orange-600 dark:text-orange-400"; statusTag = " (CAUTION)" }
            } else if (hasSingleMax && criticalTargets) {
              if (val > criticalTargets[i]) { pointClass = "fill-rose-600 print:fill-gray-600"; statusColor = "text-rose-600 dark:text-rose-400"; statusTag = " (OFF TRACK)" }
              else { statusTag = " (ON TRACK)" }
            }

            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setTooltip({ x: cx, y: cy, title: `${labels[i]}${statusTag}`, value: `${formatVal(val)} ${unit}`, statusColor })}>
                <circle cx={cx} cy={cy} r="14" fill="transparent" />
                <circle cx={cx} cy={cy} r={isMultiYear ? "4.5" : "6"} className={`${pointClass} stroke-white dark:stroke-[#0b0f19] print:stroke-white transition-transform duration-150 hover:scale-150`} strokeWidth="2" />
              </g>
            )
          })}
        </svg>

        {tooltip && (
          <div className="absolute z-20 pointer-events-none bg-slate-900 dark:bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-[2px] shadow-md -translate-x-1/2 -translate-y-full -mt-3 transition-all duration-75" style={{ left: `${Math.min(Math.max((tooltip.x / width) * 100, 15), 85)}%`, top: `${Math.max((tooltip.y / height) * 100, 18)}%` }}>
            <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{tooltip.title}</span>
            <span className={`block text-xs font-black font-mono whitespace-nowrap ${tooltip.statusColor}`}>{tooltip.value}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-2" style={{ paddingLeft: `${(padX/width)*100}%`, paddingRight: `${(padX/width)*100}%` }}>
          {labels.map((lbl, i) => {
            const showLabel = !isMultiYear || labels.length <= 14 || i % 3 === 0 || i === labels.length - 1
            return <span key={i} className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest text-center w-12 -ml-6">{showLabel ? lbl : ''}</span>
          })}
        </div>
      </div>
    </div>
  )
}

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)

  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<YearFilter>('ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('YTD')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL')

  const [records, setRecords] = useState<HseRecord[]>([])
  const [liveHazards, setLiveHazards] = useState<LiveHazardSummary[]>([])
  const [liveSioRecords, setLiveSioRecords] = useState<LiveSioSummary[]>([])
  const [targets, setTargets] = useState<TargetConfig>(DEFAULT_TARGETS)
  const [showTargetConfig, setShowTargetConfig] = useState(false)
  const [importStatus, setImportStatus] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null)

  const [tableYearTab, setTableYearTab] = useState<number>(currentYear)
  
  const [inputYear, setInputYear] = useState<number>(currentYear)
  const [inputMonth, setInputMonth] = useState<number>(new Date().getMonth() + 1)
  const [inputDept, setInputDept] = useState<string>('Technical')
  const [inputHeadcount, setInputHeadcount] = useState<number | ''>('')
  const [inputManDays, setInputManDays] = useState<number | ''>('')
  const [inputManHours, setInputManHours] = useState<number | ''>('')
  const [inputLti, setInputLti] = useState<number | ''>(0)
  const [inputSpills, setInputSpills] = useState<number | ''>(0)
  const [inputIncidents, setInputIncidents] = useState<number | ''>(0)
  const [inputHazards, setInputHazards] = useState<number | ''>(0)

  const [editingCell, setEditingCell] = useState<{ id: string; field: EditableField } | null>(null)
  const [cellDraftValue, setCellDraftValue] = useState<string>('')
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType>(null)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem('syspex_hse_db_v3')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    } else {
      const initial: HseRecord[] = [
        { id: '24-1-Technical', year: 2024, month: 1, department: 'Technical', headcount: 65, manDays: 1200, manHours: 10800, lti: 0, spills: 0, recordableIncidents: 0, hazardReports: 2 },
        { id: '24-1-Operation', year: 2024, month: 1, department: 'Operation', headcount: 35, manDays: 750, manHours: 6750, lti: 0, spills: 0, recordableIncidents: 0, hazardReports: 1 }
      ]
      setRecords(initial)
    }

    const savedTargets = localStorage.getItem('syspex_hse_targets')
    if (savedTargets) setTargets({ ...DEFAULT_TARGETS, ...JSON.parse(savedTargets) })

    // Live Sync dengan Modul Hazard Report & SIO/SILO Tracker
    const syncOperationalModules = () => {
      const savedHazards = localStorage.getItem('syspex_hazard_db')
      if (savedHazards) {
        setLiveHazards(JSON.parse(savedHazards))
      }
      const savedSio = localStorage.getItem('syspex_sio_db')
      if (savedSio) {
        setLiveSioRecords(JSON.parse(savedSio))
      }
    }
    syncOperationalModules()
    window.addEventListener('storage', syncOperationalModules)
    window.addEventListener('syspex_hse_sync', syncOperationalModules)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveInfoModal(null)
        setShowTargetConfig(false)
        setEditingCell(null)
      }
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('storage', syncOperationalModules)
      window.removeEventListener('syspex_hse_sync', syncOperationalModules)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const saveRecords = (newRecords: HseRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('syspex_hse_db_v3', JSON.stringify(newRecords))
  }

  const updateTargetField = (field: keyof TargetConfig, value: number) => {
    const updated = { ...targets, [field]: value }
    setTargets(updated)
    localStorage.setItem('syspex_hse_targets', JSON.stringify(updated))
  }

  const handleExcelFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const monthlyDeptAgg = new Map<string, {
        year: number; month: number; department: string; employees: Set<string>; manDays: number; manHours: number
      }>()

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
        let headerRowIdx = -1, colNameIdx = -1, colDateIdx = -1, colHoursIdx = -1, colDeptIdx = -1

        for (let i = 0; i < Math.min(rows.length, 25); i++) {
          const row = rows[i]
          if (!Array.isArray(row)) continue
          const normalized = row.map(c => String(c).trim().toLowerCase())
          
          const nIdx = normalized.findIndex(c => c.includes('nama') || c === 'employee name')
          const dIdx = normalized.findIndex(c => c.includes('tanggal') || c.includes('date'))
          const hIdx = normalized.findIndex(c => c.includes('durasi') || c.includes('working hours'))
          const deptIdx = normalized.findIndex(c => c.includes('departemen') || c === 'dept' || c === 'department')

          if (nIdx !== -1 && dIdx !== -1 && hIdx !== -1) {
            headerRowIdx = i; colNameIdx = nIdx; colDateIdx = dIdx; colHoursIdx = hIdx; colDeptIdx = deptIdx; break
          }
        }
        if (headerRowIdx === -1) return

        for (let r = headerRowIdx + 1; r < rows.length; r++) {
          const row = rows[r]
          if (!Array.isArray(row)) continue
          const empName = String(row[colNameIdx] ?? '').trim()
          if (!empName || empName.toLowerCase().includes('total')) continue
          
          const hoursRaw = row[colHoursIdx]
          const hours = typeof hoursRaw === 'number' ? hoursRaw : parseFloat(String(hoursRaw).replace(',', '.'))
          if (isNaN(hours) || hours <= 0) continue

          const parsedDate = parseExcelDate(row[colDateIdx])
          if (!parsedDate || parsedDate.year < 2000) continue

          let dept = colDeptIdx !== -1 ? String(row[colDeptIdx]).trim() : 'General'
          if (!dept) dept = 'General'

          const key = `${parsedDate.year}-${parsedDate.month}-${dept}`
          if (!monthlyDeptAgg.has(key)) {
            monthlyDeptAgg.set(key, { year: parsedDate.year, month: parsedDate.month, department: dept, employees: new Set<string>(), manDays: 0, manHours: 0 })
          }

          const bucket = monthlyDeptAgg.get(key)!
          bucket.employees.add(empName.toLowerCase())
          bucket.manDays += 1
          bucket.manHours += hours
        }
      })

      if (monthlyDeptAgg.size === 0) throw new Error('Data format error')

      const mergedMap = new Map<string, HseRecord>()
      records.forEach(r => mergedMap.set(`${r.year}-${r.month}-${r.department}`, r))

      let latestYear = currentYear
      monthlyDeptAgg.forEach((agg, key) => {
        const prev = mergedMap.get(key)
        if (agg.year > latestYear) latestYear = agg.year
        mergedMap.set(key, {
          id: prev?.id || key, year: agg.year, month: agg.month, department: agg.department,
          headcount: agg.employees.size, manDays: agg.manDays, manHours: Math.round(agg.manHours),
          lti: prev?.lti ?? 0, spills: prev?.spills ?? 0, recordableIncidents: prev?.recordableIncidents ?? 0, hazardReports: prev?.hazardReports ?? 0
        })
      })

      saveRecords(Array.from(mergedMap.values()))
      setTableYearTab(latestYear)
      setImportStatus({ type: 'SUCCESS', text: `BERHASIL IMPORT ${monthlyDeptAgg.size} BLOK DATA DEPARTEMEN DARI "${file.name}".` })
    } catch {
      setImportStatus({ type: 'ERROR', text: 'Gagal import file. Pastikan format tabel memiliki kolom Nama, Tanggal, Durasi, dan Departemen.' })
    } finally { e.target.value = '' }
  }

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputManHours === '' || inputManDays === '' || inputHeadcount === '') return
    const id = `${inputYear}-${inputMonth}-${inputDept}`
    const existingIdx = records.findIndex(r => r.id === id)
    const newRecord: HseRecord = {
      id, year: inputYear, month: inputMonth, department: inputDept,
      headcount: Number(inputHeadcount), lti: Number(inputLti || 0), spills: Number(inputSpills || 0),
      manDays: Number(inputManDays), manHours: Number(inputManHours),
      recordableIncidents: Number(inputIncidents || 0), hazardReports: Number(inputHazards || 0)
    }
    const updated = [...records]
    if (existingIdx >= 0) updated[existingIdx] = newRecord; else updated.push(newRecord)
    saveRecords(updated)
    setTableYearTab(inputYear)
    setInputHeadcount(''); setInputManDays(''); setInputManHours(''); setInputLti(0); setInputSpills(0); setInputIncidents(0); setInputHazards(0)
  }

  const startCellEdit = (record: HseRecord, field: EditableField) => {
    setEditingCell({ id: record.id, field })
    setCellDraftValue(String(record[field] ?? 0))
  }
  const commitCellEdit = () => {
    if (!editingCell) return
    const parsed = Number(cellDraftValue)
    const cleanValue = isNaN(parsed) || parsed < 0 ? 0 : parsed
    saveRecords(records.map(r => r.id === editingCell.id ? { ...r, [editingCell.field]: cleanValue } : r))
    setEditingCell(null)
  }
  const handleDeleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
    if (editingCell?.id === id) setEditingCell(null)
  }

  const processedRecords = useMemo(() => {
    if (selectedDeptFilter !== 'ALL') return records.filter(r => r.department === selectedDeptFilter)
    
    const map = new Map<string, HseRecord>()
    records.forEach(r => {
      const key = `${r.year}-${r.month}`
      if (!map.has(key)) map.set(key, { ...r, department: 'ALL DEPT', id: key })
      else {
        const cur = map.get(key)!
        cur.headcount += r.headcount
        cur.manDays += r.manDays
        cur.manHours += r.manHours
        cur.lti += r.lti
        cur.spills += r.spills
        cur.recordableIncidents += r.recordableIncidents
        cur.hazardReports += r.hazardReports
      }
    })
    return Array.from(map.values())
  }, [records, selectedDeptFilter])

  const availableYears = useMemo(() => {
    const s = new Set<number>([currentYear]); records.forEach(r => s.add(r.year))
    return Array.from(s).sort((a, b) => a - b)
  }, [records, currentYear])

  const filteredData = useMemo(() => {
    let filtered = selectedYear === 'ALL' ? [...processedRecords] : processedRecords.filter(r => r.year === selectedYear)
    if (selectedYear !== 'ALL') {
      if (selectedPeriod === 'Q1') filtered = filtered.filter(r => r.month >= 1 && r.month <= 3)
      if (selectedPeriod === 'Q2') filtered = filtered.filter(r => r.month >= 4 && r.month <= 6)
      if (selectedPeriod === 'Q3') filtered = filtered.filter(r => r.month >= 7 && r.month <= 9)
      if (selectedPeriod === 'Q4') filtered = filtered.filter(r => r.month >= 10 && r.month <= 12)
    }
    const sorted = filtered.sort((a, b) => a.year - b.year || a.month - b.month)

    const totalLti = sorted.reduce((s, r) => s + r.lti, 0)
    const totalSpills = sorted.reduce((s, r) => s + r.spills, 0)
    const totalManDays = sorted.reduce((s, r) => s + r.manDays, 0)
    const totalManHours = sorted.reduce((s, r) => s + r.manHours, 0)
    const totalIncidents = sorted.reduce((s, r) => s + r.recordableIncidents, 0)
    const trirNum = totalManHours > 0 ? ((totalIncidents * 200000) / totalManHours) : 0
    
    const chartLabels = sorted.map(r => {
      const mStr = new Date(2000, r.month - 1).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase()
      return selectedYear === 'ALL' ? `${mStr} '${r.year.toString().slice(-2)}` : mStr
    })
    
    const chartManHours = sorted.map(r => r.manHours)
    const cautionManHoursTargets = sorted.map(r => Math.round(r.headcount * targets.hoursPerDay * targets.workingDaysPerMonth))
    const criticalManHoursTargets = sorted.map(r => Math.round(r.headcount * targets.hoursPerDay * targets.workingDaysPerMonth * 1.1))

    const chartAvgHoursPerPerson = sorted.map(r => r.headcount > 0 ? Number((r.manHours / r.headcount).toFixed(1)) : 0)
    const cautionAvgPersonTargets = sorted.map(() => Number((targets.hoursPerDay * targets.workingDaysPerMonth).toFixed(1)))
    const criticalAvgPersonTargets = sorted.map(() => Number((targets.hoursPerDay * targets.workingDaysPerMonth * 1.1).toFixed(1)))

    const chartDailyIntensity = sorted.map(r => r.manDays > 0 ? Number((r.manHours / r.manDays).toFixed(2)) : 0)
    const cautionDailyTargets = sorted.map(() => Number(targets.hoursPerDay.toFixed(2)))
    const criticalDailyTargets = sorted.map(() => Number((targets.hoursPerDay * 1.1).toFixed(2)))

    const chartMonthlyTrir = sorted.map(r => r.manHours > 0 ? Number(((r.recordableIncidents * 200000) / r.manHours).toFixed(2)) : 0)
    const maxTrirTargets = sorted.map(() => targets.trirMax)

    return { 
      totalLti, totalSpills, totalManDays, totalManHours, trir: trirNum.toFixed(2), trirNum, chartLabels, 
      chartManHours, cautionManHoursTargets, criticalManHoursTargets,
      chartAvgHoursPerPerson, cautionAvgPersonTargets, criticalAvgPersonTargets,
      chartDailyIntensity, cautionDailyTargets, criticalDailyTargets,
      chartMonthlyTrir, maxTrirTargets, periodFatigueCeiling: criticalManHoursTargets.reduce((a, b) => a + b, 0)
    }
  }, [processedRecords, selectedYear, selectedPeriod, targets, lang])

  // Kalkulasi Live Leading Indicators (Hazard Report & SIO/SILO)
  const activeOpenHazards = liveHazards.filter(h => h.status === 'OPEN' || h.status === 'ON_PROGRESS').length
  const closedHazardsCount = liveHazards.filter(h => h.status === 'CLOSED').length
  const liveCapaRate = liveHazards.length > 0 ? Math.round((closedHazardsCount / liveHazards.length) * 100) : 100

  const validSioCount = liveSioRecords.filter(s => {
    const exp = new Date(s.expiryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return !isNaN(exp.getTime()) && exp.getTime() >= today.getTime()
  }).length
  const liveSioValidity = liveSioRecords.length > 0 ? Math.round((validSioCount / liveSioRecords.length) * 100) : 100

  const tableYearRecords = useMemo(() => records.filter(r => r.year === tableYearTab && (selectedDeptFilter === 'ALL' || r.department === selectedDeptFilter)).sort((a, b) => a.month - b.month), [records, tableYearTab, selectedDeptFilter])
  const periodLabel = selectedYear === 'ALL' ? `2024 – ${Math.max(...availableYears)}` : `${selectedPeriod} ${selectedYear}`
  
  const t = lang === 'ID' 
    ? { title: "HSE Performance Dashboard", btn_import: "Import Excel HR (.xlsx)", btn_target: "Parameter Rumus", btn_print: "Cetak Laporan" } 
    : { title: "HSE Performance Dashboard", btn_import: "Import HR Excel (.xlsx)", btn_target: "Formula Params", btn_print: "Print Report" }
  
  if (!mounted) return null 

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelFileUpload} className="hidden" aria-label="Upload HR Excel file" />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link><span>/</span><span className="text-slate-900 dark:text-slate-100">DASHBOARD</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5">
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" /></svg>
              {t.btn_import}
            </button>

            <button 
              type="button" 
              onClick={() => setShowTargetConfig(!showTargetConfig)} 
              className={`px-3 py-1.5 border rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors ${showTargetConfig ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-teal-600'}`}
            >
              {t.btn_target}
            </button>

            <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px]">
              <label htmlFor={`${formId}-fdept`} className="text-[9px] font-black uppercase text-slate-500 mr-2">Dept:</label>
              <select id={`${formId}-fdept`} value={selectedDeptFilter} onChange={e => setSelectedDeptFilter(e.target.value)} className="bg-transparent text-[10px] font-black text-teal-700 dark:text-teal-400 focus:outline-none">
                <option value="ALL">SEMUA DEPARTEMEN</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px]">
              <div className={`flex items-center gap-2 px-2 ${selectedYear !== 'ALL' ? 'border-r border-slate-300 dark:border-slate-700' : ''}`}>
                <label htmlFor={`${formId}-fyear`} className="text-[9px] font-black uppercase text-slate-500">Year:</label>
                <select id={`${formId}-fyear`} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none">
                  <option value="ALL">ALL YEARS</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {selectedYear !== 'ALL' && (
                <div className="flex items-center gap-2 px-2">
                  <label htmlFor={`${formId}-fperiod`} className="text-[9px] font-black uppercase text-slate-500">Period:</label>
                  <select id={`${formId}-fperiod`} value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none">
                    <option value="YTD">YTD</option><option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option><option value="Q4">Q4</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL PARAMETER RUMUS */}
        {showTargetConfig && (
          <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-900 border-2 border-teal-600/50 rounded-[4px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                PARAMETER KALKULASI EARLY WARNING (100%) & FATIGUE LIMIT (+10%)
              </span>
              <button type="button" onClick={() => setShowTargetConfig(false)} className="text-[9px] font-black uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white">
                [X]
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label htmlFor={`${formId}-t-trir`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">MAX TRIR</label>
                <input id={`${formId}-t-trir`} type="number" step="0.1" value={targets.trirMax} onChange={e => updateTargetField('trirMax', Number(e.target.value))} className="w-full px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]" />
              </div>
              <div>
                <label htmlFor={`${formId}-t-lti`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">MAX LTI</label>
                <input id={`${formId}-t-lti`} type="number" min="0" value={targets.ltiMax} onChange={e => updateTargetField('ltiMax', Number(e.target.value))} className="w-full px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]" />
              </div>
              <div>
                <label htmlFor={`${formId}-t-wdays`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">HARI KERJA / BULAN</label>
                <input id={`${formId}-t-wdays`} type="number" min="1" max="31" value={targets.workingDaysPerMonth} onChange={e => updateTargetField('workingDaysPerMonth', Number(e.target.value))} className="w-full px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]" />
              </div>
              <div>
                <label htmlFor={`${formId}-t-whrs`} className="block text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">JAM KERJA / HARI</label>
                <input id={`${formId}-t-whrs`} type="number" min="1" max="24" value={targets.hoursPerDay} onChange={e => updateTargetField('hoursPerDay', Number(e.target.value))} className="w-full px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]" />
              </div>
              <div>
                <label htmlFor={`${formId}-t-defhc`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">DEFAULT HC (JIKA 0)</label>
                <input id={`${formId}-t-defhc`} type="number" min="1" value={targets.defaultHeadcount} onChange={e => updateTargetField('defaultHeadcount', Number(e.target.value))} className="w-full px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px]" />
              </div>
            </div>
          </div>
        )}

        {importStatus && (
          <div className={`mb-4 p-3 border-2 rounded-[4px] flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest ${importStatus.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
            <span>{importStatus.text}</span>
            <button type="button" onClick={() => setImportStatus(null)}>[X]</button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-1">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
              Menampilkan Metrik Kinerja Untuk: <span className="text-teal-600 dark:text-teal-400">{selectedDeptFilter === 'ALL' ? 'SELURUH PERUSAHAAN (AGGREGATE)' : `TIM ${selectedDeptFilter.toUpperCase()}`}</span>
            </p>
          </div>
          <button type="button" onClick={() => window.print()} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm shrink-0">
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">LAPORAN KINERJA K3L • {selectedDeptFilter}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">Periode Laporan:</span>
            <span className="text-sm font-black text-black uppercase">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* LAGGING INDICATORS */}
      <div>
        <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            Lagging Indicators (Historical & Exposure Data)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
          <div className={`p-5 rounded-[4px] border-2 print:border-black transition-colors ${filteredData.trirNum > targets.trirMax ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">TRIR (Total Recordable Incident Rate)</p>
            <div className="flex items-end gap-2"><span className={`text-3xl xl:text-4xl font-black font-mono ${filteredData.trirNum > targets.trirMax ? 'text-rose-600 dark:text-rose-500' : 'text-slate-900 dark:text-white'}`}>{filteredData.trir}</span><span className="text-[9px] font-bold text-slate-400 mb-1">/ 200K HRS</span></div>
          </div>
          <div className={`p-5 rounded-[4px] border-2 print:border-black transition-colors ${filteredData.totalLti > targets.ltiMax ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'}`}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Lost Time Injury (LTI)</p>
            <div className="flex items-end gap-2"><span className={`text-3xl xl:text-4xl font-black font-mono ${filteredData.totalLti > targets.ltiMax ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>{filteredData.totalLti}</span><span className="text-[9px] font-bold text-slate-400 mb-1">CASES</span></div>
          </div>
          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Active Man-Days</p>
            <div className="flex items-end gap-2"><span className="text-3xl xl:text-4xl font-black font-mono text-slate-900 dark:text-white">{filteredData.totalManDays.toLocaleString('en-US')}</span><span className="text-[9px] font-bold text-slate-400 mb-1">DAYS</span></div>
          </div>
          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Man-Hours</p>
            <div className="flex items-end gap-2"><span className="text-3xl xl:text-4xl font-black font-mono text-slate-900 dark:text-white">{filteredData.totalManHours.toLocaleString('en-US')}</span><span className="text-[9px] font-bold text-slate-400 mb-1">HOURS</span></div>
          </div>
        </div>
      </div>

      {/* LEADING INDICATORS (LIVE SYNC DARI MODUL HAZARD REPORT & SIO/SILO) */}
      <div className="mt-6">
        <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            Leading Indicators (Live Field Sync)
          </h2>
          <Link href="/hazard-report" className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest hover:underline print:hidden">
            Buka Register Temuan &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
          <Link href="/hazard-report" className={`p-5 rounded-[4px] border-2 print:border-black transition-colors block ${activeOpenHazards > 0 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:border-amber-500' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 hover:border-teal-600'}`}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Open & On-Progress Hazards</p>
            <div className="flex items-end gap-2">
              <span className={`text-3xl xl:text-4xl font-black font-mono ${activeOpenHazards > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{activeOpenHazards}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">ACTIVE CASES</span>
            </div>
          </Link>

          <Link href="/hazard-report" className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 hover:border-teal-600 p-5 rounded-[4px] print:border-black transition-colors block">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">CAPA Closure Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl xl:text-4xl font-black font-mono text-teal-600 dark:text-teal-400">{liveCapaRate}%</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">({closedHazardsCount}/{liveHazards.length} CLOSED)</span>
            </div>
          </Link>

          <Link href="/sio-silo" className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 hover:border-teal-600 p-5 rounded-[4px] print:border-black transition-colors block">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">SIO / SILO Validity</p>
            <div className="flex items-end gap-2">
              <span className={`text-3xl xl:text-4xl font-black font-mono ${liveSioValidity < 100 ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`}>{liveSioValidity}%</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">({validSioCount}/{liveSioRecords.length} VALID)</span>
            </div>
          </Link>

          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] opacity-60 print:border-black">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">TBM Compliance (Coming Soon)</p>
            <span className="text-3xl font-black font-mono text-slate-400">-%</span>
          </div>
        </div>
      </div>

      {/* 4 GRAFIK TREN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TrendLineChart title={`1. Total Jam Kerja Bulanan (${selectedDeptFilter})`} data={filteredData.chartManHours} cautionTargets={filteredData.cautionManHoursTargets} criticalTargets={filteredData.criticalManHoursTargets} labels={filteredData.chartLabels} unit="HRS" decimals={0} limitMode="TWO_TIER" isMultiYear={selectedYear === 'ALL'} onOpenInfo={() => setActiveInfoModal('HOURS')} lang={lang} />
        <TrendLineChart title={`2. Rata-Rata Jam per Personel (${selectedDeptFilter})`} data={filteredData.chartAvgHoursPerPerson} cautionTargets={filteredData.cautionAvgPersonTargets} criticalTargets={filteredData.criticalAvgPersonTargets} labels={filteredData.chartLabels} unit="HRS / PERSON" decimals={1} limitMode="TWO_TIER" isMultiYear={selectedYear === 'ALL'} onOpenInfo={() => setActiveInfoModal('AVG_PERSONNEL')} lang={lang} />
        <TrendLineChart title={`3. Intensitas Harian (${selectedDeptFilter})`} data={filteredData.chartDailyIntensity} cautionTargets={filteredData.cautionDailyTargets} criticalTargets={filteredData.criticalDailyTargets} labels={filteredData.chartLabels} unit="HRS / DAY" decimals={2} limitMode="TWO_TIER" isMultiYear={selectedYear === 'ALL'} onOpenInfo={() => setActiveInfoModal('DAILY_INTENSITY')} lang={lang} />
        <TrendLineChart title={`4. Rasio Insiden / TRIR (${selectedDeptFilter})`} data={filteredData.chartMonthlyTrir} criticalTargets={filteredData.maxTrirTargets} labels={filteredData.chartLabels} unit="TRIR" decimals={2} limitMode="SINGLE_MAX" isMultiYear={selectedYear === 'ALL'} onOpenInfo={() => setActiveInfoModal('TRIR')} lang={lang} />
      </div>

      {/* PRINT SIGNATURES */}
      <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black text-black">
        <div className="text-center border-2 border-black p-4">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">Dianalisa Oleh (HSE Supervisor):</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">HSE Supervisor</p>
        </div>
        <div className="text-center border-2 border-black p-4 bg-gray-100">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">Diketahui Oleh (Director):</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">Director</p>
        </div>
      </div>

      {/* INPUT DATABASE & TABEL (RAW DATA) */}
      <div className="mt-12 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] p-5 print:hidden">
        <p className="text-[9px] font-black mb-4 text-slate-700 dark:text-slate-300 uppercase">Input & Log Histori Mentah</p>
        <form onSubmit={handleAddNewRecord} className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-11 gap-3 items-end">
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Tahun</label><input type="number" value={inputYear} onChange={e=>setInputYear(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Bulan</label><input type="number" value={inputMonth} min={1} max={12} onChange={e=>setInputMonth(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div className="col-span-2"><label className="block text-[8px] font-black text-teal-600 uppercase mb-1">Departemen</label><select value={inputDept} onChange={e=>setInputDept(e.target.value)} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]">{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">H-Count</label><input type="number" value={inputHeadcount} onChange={e=>setInputHeadcount(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">M-Days</label><input type="number" value={inputManDays} onChange={e=>setInputManDays(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">M-Hours</label><input type="number" value={inputManHours} onChange={e=>setInputManHours(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">LTI</label><input type="number" value={inputLti} onChange={e=>setInputLti(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Incidents</label><input type="number" value={inputIncidents} onChange={e=>setInputIncidents(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Hazards</label><input type="number" value={inputHazards} onChange={e=>setInputHazards(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border rounded-[2px]" /></div>
          <div><button type="submit" disabled={inputManHours==='' || inputManDays==='' || inputHeadcount===''} className="w-full py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-[9px] font-black uppercase rounded-[2px] h-[30px] disabled:opacity-50">Save</button></div>
        </form>

        <div className="mt-6 flex gap-1.5 border-b border-slate-300 dark:border-slate-700 pb-2">
          {availableYears.map(yr => (
            <button type="button" key={yr} onClick={() => { setTableYearTab(yr); setEditingCell(null) }} className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-[2px] border ${tableYearTab === yr ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border-slate-300'}`}>{yr}</button>
          ))}
        </div>

        <div className="mt-3 border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-2 px-3 w-16">BLN</th>
                <th className="py-2 px-3">DEPT</th>
                <th className="py-2 px-3">H-COUNT</th>
                <th className="py-2 px-3">M-DAYS</th>
                <th className="py-2 px-3">M-HOURS</th>
                <th className="py-2 px-3">LTI</th>
                <th className="py-2 px-3">SPILLS</th>
                <th className="py-2 px-3">INCIDENTS</th>
                <th className="py-2 px-3">HAZARDS</th>
                <th className="py-2 px-3 text-center">DEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {tableYearRecords.map(r => {
                const renderCell = (field: EditableField, val: number) => {
                  const isEditing = editingCell?.id === r.id && editingCell?.field === field
                  if (isEditing) return <input type="number" autoFocus value={cellDraftValue} onChange={e => setCellDraftValue(e.target.value)} onBlur={commitCellEdit} onKeyDown={e => e.key === 'Enter' && commitCellEdit()} className="w-16 px-1 py-0.5 text-[10px] font-mono border-2 border-teal-500 rounded-[2px]" />
                  return <button type="button" onClick={() => startCellEdit(r, field)} className="text-left font-mono px-1 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-[2px]">{val.toLocaleString('en-US')}</button>
                }
                return (
                  <tr key={r.id} className="hover:bg-white/60 dark:hover:bg-slate-950/60">
                    <td className="py-2 px-3 font-black">{r.month}</td>
                    <td className="py-1.5 px-3 font-black text-teal-700 dark:text-teal-400">{r.department}</td>
                    <td className="py-1.5 px-3">{renderCell('headcount', r.headcount)}</td>
                    <td className="py-1.5 px-3">{renderCell('manDays', r.manDays)}</td>
                    <td className="py-1.5 px-3">{renderCell('manHours', r.manHours)}</td>
                    <td className="py-1.5 px-3">{renderCell('lti', r.lti)}</td>
                    <td className="py-1.5 px-3">{renderCell('spills', r.spills)}</td>
                    <td className="py-1.5 px-3 text-rose-600">{renderCell('recordableIncidents', r.recordableIncidents)}</td>
                    <td className="py-1.5 px-3">{renderCell('hazardReports', r.hazardReports)}</td>
                    <td className="py-1.5 px-3 text-center"><button type="button" aria-label="Hapus Baris" onClick={() => handleDeleteRecord(r.id)} className="text-slate-400 hover:text-rose-600">[X]</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* INFO MODAL */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden" onClick={() => setActiveInfoModal(null)}>
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-[4px] max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-700 dark:text-teal-500">PANDUAN METRIK</h3>
              <button type="button" onClick={() => setActiveInfoModal(null)} aria-label="Tutup Panduan" className="text-slate-400 hover:text-rose-500">[X]</button>
            </div>
            <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              <p>Grafik menampilkan data spesifik berdasarkan Departemen yang dipilih. Garis peringatan otomatis dihitung menggunakan jumlah orang nyata di departemen tersebut.</p>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border rounded-[2px] font-mono"><p className="text-[11px] text-slate-900 dark:text-white">Early Warning = Headcount x Jam/Hari x Hari Kerja</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
