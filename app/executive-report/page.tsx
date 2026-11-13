"use client"

import { useState, useEffect, useId, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface HseRecord {
  id: string
  year: number
  month: number
  headcount?: number
  lti: number
  spills: number
  manDays?: number
  manHours: number
  recordableIncidents: number
  hazardReports: number
  capaClosure?: number
  tbmCompliance?: number
  auditScore?: number
}

interface TargetConfig {
  trirMax: number
  ltiMax: number
  defaultHeadcount: number
  workingDaysPerMonth: number
  hoursPerDay: number
}

type PeriodFilter = 'YTD' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
type YearFilter = number | 'ALL'
type InfoModalType = 'HOURS' | 'DAYS' | null
type EditableField = 'headcount' | 'manDays' | 'manHours' | 'lti' | 'spills' | 'recordableIncidents' | 'hazardReports'

interface HoverTooltip {
  x: number
  y: number
  title: string
  value: string
  statusColor: string
}

const DEFAULT_TARGETS: TargetConfig = {
  trirMax: 1.0,
  ltiMax: 0,
  defaultHeadcount: 110,
  workingDaysPerMonth: 22,
  hoursPerDay: 8
}

const TrendLineChart = ({ 
  title, 
  data, 
  minTargets, 
  maxTargets, 
  labels, 
  unit,
  showBounds = false,
  isMultiYear,
  onOpenInfo,
  lang
}: { 
  title: string
  data: number[]
  minTargets?: number[]
  maxTargets?: number[]
  labels: string[]
  unit: string
  showBounds?: boolean
  isMultiYear?: boolean
  onOpenInfo: () => void
  lang: 'ID' | 'EN'
}) => {
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null)

  const formatExact = (val: number) => Math.round(val).toLocaleString('en-US')

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black transition-colors">
        <div className="flex justify-between items-center border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
          <button onClick={onOpenInfo} aria-label="Panduan Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <div className="h-48 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-800">
          NO DATA FOR SELECTED PERIOD
        </div>
      </div>
    )
  }

  const hasBounds = showBounds && minTargets && maxTargets && minTargets.length === data.length && maxTargets.length === data.length

  const padX = 48
  const padY = 40
  const width = 1000
  const height = 270
  const plotWidth = width - padX * 2
  const plotHeight = height - padY * 2

  const maxValue = hasBounds 
    ? Math.max(...data, ...maxTargets) * 1.15 
    : Math.max(...data) * 1.15

  const mapY = (val: number) => padY + plotHeight - (val / (maxValue || 1)) * plotHeight
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : plotWidth / 2
  const getX = (i: number) => (data.length > 1 ? padX + i * stepX : padX + stepX)

  const points = data.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ')
  const upperPoints = hasBounds ? maxTargets.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ') : ''
  const lowerPoints = hasBounds ? minTargets.map((val, i) => `${getX(i)},${mapY(val)}`).join(' ') : ''

  const safeZonePolygon = hasBounds && data.length > 1
    ? [
        ...maxTargets.map((val, i) => `${getX(i)},${mapY(val)}`),
        ...[...minTargets].reverse().map((val, revI) => {
          const origI = minTargets.length - 1 - revI
          return `${getX(origI)},${mapY(val)}`
        })
      ].join(' ')
    : ''

  const avgMin = hasBounds ? minTargets.reduce((a, b) => a + b, 0) / minTargets.length : 0
  const avgMax = hasBounds ? maxTargets.reduce((a, b) => a + b, 0) / maxTargets.length : 0
  const avgActual = data.reduce((a, b) => a + b, 0) / data.length

  const upperLimitText = lang === 'ID' ? 'BATAS ATAS: FATIGUE & OVERTIME (+10%)' : 'UPPER LIMIT: FATIGUE RISK (+10%)'
  const lowerLimitText = lang === 'ID' ? 'BATAS BAWAH: LOW EXPOSURE / DOWNTIME (-10%)' : 'LOWER LIMIT: LOW EXPOSURE (-10%)'
  const safeZoneText = lang === 'ID' ? 'ZONA NORMAL EKSPLORASI KERJA (±10%)' : 'NORMAL EXPOSURE ZONE (±10%)'

  return (
    <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black print:bg-transparent transition-colors">
      <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
          <button onClick={onOpenInfo} aria-label="Panduan Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <div className="text-right">
          {hasBounds ? (
            <>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">NORMAL RANGE / MO</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 font-mono">
                {formatExact(avgMin)} - {formatExact(avgMax)} {unit}
              </span>
            </>
          ) : (
            <>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">MONTHLY AVERAGE</span>
              <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 font-mono">
                {formatExact(avgActual)} {unit} / MO
              </span>
            </>
          )}
        </div>
      </div>

      {/* LEGENDA KONTEKSTUAL */}
      <div className="flex flex-wrap gap-4 mb-3 text-[8px] font-black uppercase tracking-widest">
        {hasBounds ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-rose-600"></span>
              <span className="text-rose-600 dark:text-rose-400">FATIGUE LIMIT (+10% HC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-orange-500"></span>
              <span className="text-orange-600 dark:text-orange-400">LOW EXPOSURE (-10% HC)</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-teal-600"></span>
            <span className="text-slate-500 dark:text-slate-400">WORKFORCE PRESENCE BASELINE (NO LIMIT)</span>
          </div>
        )}
      </div>
      
      <div className="w-full overflow-hidden relative" onMouseLeave={() => setTooltip(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {hasBounds && (
            <>
              {/* Zona Normal */}
              {data.length > 1 ? (
                <polygon
                  points={safeZonePolygon}
                  className="fill-emerald-50 dark:fill-emerald-950/30 print:fill-gray-100 cursor-crosshair transition-opacity hover:opacity-80"
                  onMouseEnter={() => setTooltip({
                    x: width / 2,
                    y: (mapY(avgMax) + mapY(avgMin)) / 2,
                    title: safeZoneText,
                    value: `AVG ${formatExact(avgMin)} - ${formatExact(avgMax)} ${unit}`,
                    statusColor: 'text-emerald-600 dark:text-emerald-400'
                  })}
                />
              ) : (
                <rect
                  x={padX}
                  y={mapY(maxTargets[0])}
                  width={plotWidth}
                  height={Math.max(0, mapY(minTargets[0]) - mapY(maxTargets[0]))}
                  className="fill-emerald-50 dark:fill-emerald-950/30 print:fill-gray-100"
                />
              )}
              
              {/* Garis Batas Atas (MERAH - Fatigue Risk) */}
              {data.length > 1 ? (
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: width / 2,
                    y: mapY(avgMax),
                    title: upperLimitText,
                    value: `AVG MAX ${formatExact(avgMax)} ${unit}`,
                    statusColor: 'text-rose-600 dark:text-rose-400'
                  })}
                >
                  <polyline points={upperPoints} fill="none" stroke="transparent" strokeWidth="14" />
                  <polyline points={upperPoints} fill="none" className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
                </g>
              ) : (
                <line x1={padX} y1={mapY(maxTargets[0])} x2={width-padX} y2={mapY(maxTargets[0])} className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
              )}

              {/* Garis Batas Bawah (ORANYE - Low Exposure / Downtime) */}
              {data.length > 1 ? (
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: width / 2,
                    y: mapY(avgMin),
                    title: lowerLimitText,
                    value: `AVG MIN ${formatExact(avgMin)} ${unit}`,
                    statusColor: 'text-orange-600 dark:text-orange-400'
                  })}
                >
                  <polyline points={lowerPoints} fill="none" stroke="transparent" strokeWidth="14" />
                  <polyline points={lowerPoints} fill="none" className="stroke-orange-500 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
                </g>
              ) : (
                <line x1={padX} y1={mapY(minTargets[0])} x2={width-padX} y2={mapY(minTargets[0])} className="stroke-orange-500 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
              )}
            </>
          )}

          {/* Garis Tren Aktual */}
          {data.length > 1 && (
            <polyline 
              points={points} 
              fill="none" 
              className={`${hasBounds ? 'stroke-slate-800 dark:stroke-slate-200' : 'stroke-teal-700 dark:stroke-teal-400'} print:stroke-black pointer-events-none`} 
              strokeWidth="2.5" 
            />
          )}

          {/* Titik Data Bulanan */}
          {data.map((val, i) => {
            const cx = getX(i)
            const cy = mapY(val)

            if (!hasBounds) {
              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: cx,
                    y: cy,
                    title: labels[i],
                    value: `${formatExact(val)} ${unit}`,
                    statusColor: 'text-teal-700 dark:text-teal-400'
                  })}
                >
                  <circle cx={cx} cy={cy} r="14" fill="transparent" />
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isMultiYear ? "4.5" : "6"} 
                    className="fill-teal-700 dark:fill-teal-400 stroke-white dark:stroke-[#0b0f19] print:fill-black print:stroke-white transition-transform duration-150 hover:scale-150" 
                    strokeWidth="2" 
                  />
                </g>
              )
            }

            const curMin = minTargets[i]
            const curMax = maxTargets[i]
            const isOver = val > curMax
            const isUnder = val < curMin
            
            const pointClass = isOver 
              ? "fill-rose-600 print:fill-gray-600" 
              : isUnder 
              ? "fill-orange-500 print:fill-gray-400" 
              : "fill-emerald-500 print:fill-black"

            const statusColor = isOver 
              ? "text-rose-600 dark:text-rose-400" 
              : isUnder 
              ? "text-orange-600 dark:text-orange-400" 
              : "text-emerald-600 dark:text-emerald-400"

            const statusTag = isOver ? ' (FATIGUE RISK)' : isUnder ? ' (LOW EXPOSURE)' : ' (NORMAL)'

            return (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({
                  x: cx,
                  y: cy,
                  title: `${labels[i]}${statusTag}`,
                  value: `${formatExact(val)} ${unit} [NORMAL: ${formatExact(curMin)}-${formatExact(curMax)}]`,
                  statusColor
                })}
              >
                <circle cx={cx} cy={cy} r="14" fill="transparent" />
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isMultiYear ? "4.5" : "6"} 
                  className={`${pointClass} stroke-white dark:stroke-[#0b0f19] print:stroke-white transition-transform duration-150 hover:scale-150`} 
                  strokeWidth="2" 
                />
              </g>
            )
          })}
        </svg>

        {tooltip && (
          <div 
            className="absolute z-20 pointer-events-none bg-slate-900 dark:bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-[2px] shadow-md -translate-x-1/2 -translate-y-full -mt-3 transition-all duration-75"
            style={{ 
              left: `${Math.min(Math.max((tooltip.x / width) * 100, 15), 85)}%`, 
              top: `${Math.max((tooltip.y / height) * 100, 18)}%` 
            }}
          >
            <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
              {tooltip.title}
            </span>
            <span className={`block text-xs font-black font-mono whitespace-nowrap ${tooltip.statusColor}`}>
              {tooltip.value}
            </span>
          </div>
        )}
        
        <div className="flex justify-between mt-2" style={{ paddingLeft: `${(padX/width)*100}%`, paddingRight: `${(padX/width)*100}%` }}>
          {labels.map((lbl, i) => {
            const showLabel = !isMultiYear || labels.length <= 14 || i % 3 === 0 || i === labels.length - 1
            return (
              <span key={i} className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest text-center w-12 -ml-6">
                {showLabel ? lbl : ''}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const formId = useId()
  const [mounted, setMounted] = useState(false)

  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<YearFilter>('ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('YTD')

  const [records, setRecords] = useState<HseRecord[]>([])
  const [targets, setTargets] = useState<TargetConfig>(DEFAULT_TARGETS)
  const [showTargetConfig, setShowTargetConfig] = useState(false)

  const [tableYearTab, setTableYearTab] = useState<number>(currentYear)
  
  // State Form Tambah Baru
  const [inputYear, setInputYear] = useState<number>(currentYear)
  const [inputMonth, setInputMonth] = useState<number>(new Date().getMonth() + 1)
  const [inputHeadcount, setInputHeadcount] = useState<number | ''>('')
  const [inputManDays, setInputManDays] = useState<number | ''>('')
  const [inputManHours, setInputManHours] = useState<number | ''>('')
  const [inputLti, setInputLti] = useState<number | ''>(0)
  const [inputSpills, setInputSpills] = useState<number | ''>(0)
  const [inputIncidents, setInputIncidents] = useState<number | ''>(0)
  const [inputHazards, setInputHazards] = useState<number | ''>(0)

  // State Click-to-Edit Sel Langsung
  const [editingCell, setEditingCell] = useState<{ id: string; field: EditableField } | null>(null)
  const [cellDraftValue, setCellDraftValue] = useState<string>('')

  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType>(null)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem('syspex_hse_db')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    }
    const savedTargets = localStorage.getItem('syspex_hse_targets')
    if (savedTargets) {
      setTargets({ ...DEFAULT_TARGETS, ...JSON.parse(savedTargets) })
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveInfoModal(null)
        setShowTargetConfig(false)
        setEditingCell(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const saveRecords = (newRecords: HseRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('syspex_hse_db', JSON.stringify(newRecords))
  }

  const updateTargetField = (field: keyof TargetConfig, value: number) => {
    const updated = { ...targets, [field]: value }
    setTargets(updated)
    localStorage.setItem('syspex_hse_targets', JSON.stringify(updated))
  }

  const getMonthFullName = (monthNum: number) => {
    return new Date(2000, monthNum - 1)
      .toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'long' })
      .toUpperCase()
  }

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputManHours === '' || inputManDays === '' || inputHeadcount === '') return

    const newRecord: HseRecord = {
      id: Math.random().toString(36).substring(2, 9),
      year: inputYear,
      month: inputMonth,
      headcount: Number(inputHeadcount),
      lti: inputLti === '' ? 0 : Number(inputLti),
      spills: inputSpills === '' ? 0 : Number(inputSpills),
      manDays: Number(inputManDays),
      manHours: Number(inputManHours),
      recordableIncidents: inputIncidents === '' ? 0 : Number(inputIncidents),
      hazardReports: inputHazards === '' ? 0 : Number(inputHazards)
    }

    const existingIdx = records.findIndex(r => r.year === inputYear && r.month === inputMonth)
    const updatedRecords = [...records]
    
    if (existingIdx >= 0) {
      newRecord.id = updatedRecords[existingIdx].id
      updatedRecords[existingIdx] = newRecord
    } else {
      updatedRecords.push(newRecord)
    }
    saveRecords(updatedRecords)
    setTableYearTab(inputYear)
    
    setInputHeadcount('')
    setInputManDays('')
    setInputManHours('')
    setInputLti(0)
    setInputSpills(0)
    setInputIncidents(0)
    setInputHazards(0)
  }

  // Mulai edit sel langsung saat diklik
  const startCellEdit = (record: HseRecord, field: EditableField) => {
    const currentVal = field === 'headcount'
      ? (record.headcount ?? targets.defaultHeadcount)
      : (record[field] ?? 0)
    setEditingCell({ id: record.id, field })
    setCellDraftValue(String(currentVal))
  }

  // Auto-save saat selesai mengetik (onBlur atau Enter)
  const commitCellEdit = () => {
    if (!editingCell) return
    const parsed = Number(cellDraftValue)
    const cleanValue = isNaN(parsed) || parsed < 0 ? 0 : parsed

    const updatedRecords = records.map(r => {
      if (r.id === editingCell.id) {
        return { ...r, [editingCell.field]: cleanValue }
      }
      return r
    })
    saveRecords(updatedRecords)
    setEditingCell(null)
  }

  const handleDeleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
    if (editingCell?.id === id) setEditingCell(null)
  }

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>([2024, 2025, 2026, currentYear])
    records.forEach(r => yearsSet.add(r.year))
    return Array.from(yearsSet).sort((a, b) => a - b)
  }, [records, currentYear])

  const tableYearRecords = useMemo(() => {
    return records
      .filter(r => r.year === tableYearTab)
      .sort((a, b) => a.month - b.month)
  }, [records, tableYearTab])

  const filteredData = useMemo(() => {
    let filtered = selectedYear === 'ALL' 
      ? [...records] 
      : records.filter(r => r.year === selectedYear)
    
    if (selectedYear !== 'ALL') {
      if (selectedPeriod === 'Q1') filtered = filtered.filter(r => r.month >= 1 && r.month <= 3)
      if (selectedPeriod === 'Q2') filtered = filtered.filter(r => r.month >= 4 && r.month <= 6)
      if (selectedPeriod === 'Q3') filtered = filtered.filter(r => r.month >= 7 && r.month <= 9)
      if (selectedPeriod === 'Q4') filtered = filtered.filter(r => r.month >= 10 && r.month <= 12)
    }

    const totalLti = filtered.reduce((sum, r) => sum + r.lti, 0)
    const totalSpills = filtered.reduce((sum, r) => sum + r.spills, 0)
    const totalManDays = filtered.reduce((sum, r) => sum + (r.manDays || 0), 0)
    const totalManHours = filtered.reduce((sum, r) => sum + r.manHours, 0)
    const totalIncidents = filtered.reduce((sum, r) => sum + r.recordableIncidents, 0)

    const trirNum = totalManHours > 0 ? ((totalIncidents * 200000) / totalManHours) : 0
    const trir = trirNum.toFixed(2)

    const sortedRecords = filtered.sort((a, b) => a.year - b.year || a.month - b.month)
    
    const chartLabels = sortedRecords.map(r => {
      const mStr = new Date(2000, r.month - 1).toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase()
      return selectedYear === 'ALL' ? `${mStr} '${r.year.toString().slice(-2)}` : mStr
    })
    
    const chartManHours = sortedRecords.map(r => r.manHours)
    const chartManDays = sortedRecords.map(r => r.manDays || 0)

    const minManHoursTargets = sortedRecords.map(r => {
      const hc = r.headcount && r.headcount > 0 ? r.headcount : targets.defaultHeadcount
      return Math.round(hc * targets.hoursPerDay * targets.workingDaysPerMonth * 0.9)
    })
    const maxManHoursTargets = sortedRecords.map(r => {
      const hc = r.headcount && r.headcount > 0 ? r.headcount : targets.defaultHeadcount
      return Math.round(hc * targets.hoursPerDay * targets.workingDaysPerMonth * 1.1)
    })

    const periodTargetManHours = minManHoursTargets.reduce((a, b) => a + b, 0)

    return { 
      totalLti, totalSpills, totalManDays, totalManHours, 
      trir, trirNum, chartLabels, chartManHours, chartManDays,
      minManHoursTargets, maxManHoursTargets, periodTargetManHours
    }
  }, [records, selectedYear, selectedPeriod, targets, lang])

  const periodLabel = selectedYear === 'ALL' 
    ? `2024 – ${Math.max(...availableYears)}` 
    : `${selectedPeriod} ${selectedYear}`

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "Visibilitas metrik kinerja K3L tersinkronisasi otomatis dari database internal.",
      btn_print: "Cetak Laporan",
      btn_target: "Parameter Rumus",
      all_years: "SEMUA TAHUN (2024–2026)",
      
      sect_lagging: "Lagging Indicators (Data Langsung)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Total Hari Kerja (Man-Days)",
      lag_4: "Total Jam Kerja (Man-Hours)",
      
      sect_leading: "Leading Indicators (Dalam Pengembangan)",
      lead_soon: "Akan Terintegrasi Otomatis Dengan Modul Operasional.",
      lead_1: "Pelaporan Bahaya Terbuka",
      lead_2: "Penyelesaian CAPA",
      lead_3: "Kepatuhan TBM",
      lead_4: "Skor Audit",
      
      chart_title_mhrs: `Tren Jam Kerja Bulanan (${periodLabel})`,
      chart_title_mdys: `Tren Hari Kerja Bulanan (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & Log Histori)",
      mgr_add: "Tambah Data Kinerja Bulanan Baru",
      form_y: "Tahun", form_m: "Bulan", form_hc: "Headcount", form_lti: "LTI", form_spill: "Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Incidents", form_haz: "Hazards", 
      btn_save: "Simpan Baru",

      print_doc_type: "LAPORAN KINERJA K3L",
      print_reg: "Periode Laporan:",
      sign_hse: "Dianalisa Oleh (HSE Supervisor):",
      sign_gm: "Diketahui Oleh (Director):",

      info_hours_title: "Panduan Tren Jam Kerja (Man-Hours) & Fatigue Limit",
      info_hours_q1: "1. Relevansi Man-Hours dengan Kinerja HSE",
      info_hours_b1: "Indikator Eksposur Risiko (Denominator TRIR): Man-Hours mengukur total durasi paparan bahaya pekerja di lapangan. 1 insiden dalam 1,000 jam kerja menandakan risiko tinggi, sedangkan 1 insiden dalam 1,000,000 jam kerja membuktikan keandalan sistem K3L.",
      info_hours_b2: "Batas Atas Merah (Fatigue & Overtime Risk +10%): Jika grafik menembus garis merah, terjadi lembur berlebih di atas kapasitas Headcount bulan tersebut. Kelelahan fisik secara langsung meningkatkan potensi kecelakaan kerja.",
      info_hours_b3: "Batas Bawah Oranye (Low Exposure / Downtime -10%): Jika grafik berada di bawah garis oranye, jam kerja sedang rendah akibat libur, penurunan produksi, atau absensi (bukan pelanggaran HSE, melainkan catatan volume paparan).",
      info_hours_q2: "2. Rumus Zona Normal Man-Hours",
      info_hours_formula: "Headcount Bulan Tersebut x Jam Kerja/Hari x Hari Kerja Efektif (±10%)",
      info_hours_ex: "Contoh: 110 karyawan x 8 jam x 22 hari kerja = 19,360 Man-Hours (Zona Normal: 17,424 – 21,296 HRS).",

      info_days_title: "Panduan Tren Hari Kerja (Man-Days)",
      info_days_q1: "1. Relevansi Man-Days dengan Kinerja HSE",
      info_days_b1: "Baseline Kehadiran Tenaga Kerja: Man-Days merekam akumulasi hari kerja aktif seluruh personel untuk memantau kepadatan operasional dari bulan ke bulan.",
      info_days_b2: "Mengapa Tanpa Batas Atas/Bawah? Berbeda dengan jam lembur (Man-Hours) yang memicu kelelahan fisik, fluktuasi hari kerja bulanan dipengaruhi kalender kerja dan jadwal operasional sehingga ditampilkan sebagai tren historis murni tanpa alarm palsu.",
      info_days_q2: "2. Rumus Referensi Man-Days",
      info_days_formula: "Headcount Bulan Tersebut x Jumlah Hari Kerja Efektif Sebulan",
      info_days_ex: "Contoh: 110 karyawan x 22 hari kerja = 2,420 Man-Days.",

      btn_close: "Tutup"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "HSE Performance Dashboard",
      subtitle: "HSE performance metrics visibility automatically synchronized from internal database.",
      btn_print: "Print Report",
      btn_target: "Formula Params",
      all_years: "ALL YEARS (2024–2026)",
      
      sect_lagging: "Lagging Indicators (Live Data)",
      lag_1: "Total Recordable Incident Rate (TRIR)",
      lag_2: "Lost Time Injury (LTI)",
      lag_3: "Total Safe Man-Days",
      lag_4: "Total Safe Man-Hours",
      
      sect_leading: "Leading Indicators (Coming Soon)",
      lead_soon: "Will Be Auto-Synchronized With Operational Modules.",
      lead_1: "Open Hazard Reports",
      lead_2: "CAPA Closure Rate",
      lead_3: "TBM Compliance",
      lead_4: "Audit Score",
      
      chart_title_mhrs: `Monthly Man-Hours Trend (${periodLabel})`,
      chart_title_mdys: `Monthly Man-Days Trend (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & History Logs)",
      mgr_add: "Add New Monthly Performance Record",
      form_y: "Year", form_m: "Month", form_hc: "Headcount", form_lti: "LTI", form_spill: "Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Incidents", form_haz: "Hazards", 
      btn_save: "Save New",

      print_doc_type: "HSE PERFORMANCE REPORT",
      print_reg: "Report Period:",
      sign_hse: "Analyzed By (HSE Supervisor):",
      sign_gm: "Acknowledged By (Director):",

      info_hours_title: "Man-Hours Trend & Fatigue Limit Guide",
      info_hours_q1: "1. Relevance of Man-Hours to HSE Performance",
      info_hours_b1: "Risk Exposure Denominator (TRIR): Measures total worker exposure duration to field hazards. 1 incident in 1,000 hours signals high risk, while 1 incident in 1,000,000 hours demonstrates strong safety control.",
      info_hours_b2: "Red Upper Limit (Fatigue & Overtime Risk +10%): Breaching the red line indicates excessive overtime beyond the month's Headcount capacity, elevating physical fatigue and accident risks.",
      info_hours_b3: "Orange Lower Limit (Low Exposure / Downtime -10%): Falling below the orange line indicates reduced working hours due to holidays or lower production volume (an exposure note, not an HSE failure).",
      info_hours_q2: "2. Normal Man-Hours Zone Formula",
      info_hours_formula: "Monthly Headcount x Hours/Day x Effective Working Days (±10%)",
      info_hours_ex: "Example: 110 employees x 8 hours x 22 days = 19,360 Man-Hours (Normal Zone: 17,424 – 21,296 HRS).",

      info_days_title: "Man-Days Trend Guide",
      info_days_q1: "1. Relevance of Man-Days to HSE Performance",
      info_days_b1: "Workforce Presence Baseline: Tracks accumulated active working days across all personnel to monitor monthly operational density.",
      info_days_b2: "Why No Upper/Lower Limits? Unlike overtime hours (Man-Hours) which directly impact worker fatigue, monthly working-day variations follow calendar schedules and are displayed as a clean historical trend without false alarms.",
      info_days_q2: "2. Man-Days Reference Formula",
      info_days_formula: "Monthly Headcount x Effective Working Days per Month",
      info_days_ex: "Example: 110 employees x 22 days = 2,420 Man-Days.",

      btn_close: "Close"
    }
  }

  const t = dict[lang]
  if (!mounted) return null 

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowTargetConfig(!showTargetConfig)} 
              className={`px-3 py-1.5 border rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer ${showTargetConfig ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-teal-600'}`}
            >
              {t.btn_target}
            </button>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px]">
              <div className={`flex items-center gap-2 px-2 ${selectedYear !== 'ALL' ? 'border-r border-slate-300 dark:border-slate-700' : ''}`}>
                <label htmlFor={`${formId}-fyear`} className="text-[9px] font-black uppercase text-slate-500">Year:</label>
                <select 
                  id={`${formId}-fyear`} 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))} 
                  className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="dark:bg-slate-900">{t.all_years}</option>
                  {availableYears.map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
                </select>
              </div>
              {selectedYear !== 'ALL' && (
                <div className="flex items-center gap-2 px-2">
                  <label htmlFor={`${formId}-fperiod`} className="text-[9px] font-black uppercase text-slate-500">Period:</label>
                  <select id={`${formId}-fperiod`} value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)} className="bg-transparent text-[10px] font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                    <option value="YTD" className="dark:bg-slate-900">YEAR TO DATE (YTD)</option>
                    <option value="Q1" className="dark:bg-slate-900">QUARTER 1 (Q1)</option>
                    <option value="Q2" className="dark:bg-slate-900">QUARTER 2 (Q2)</option>
                    <option value="Q3" className="dark:bg-slate-900">QUARTER 3 (Q3)</option>
                    <option value="Q4" className="dark:bg-slate-900">QUARTER 4 (Q4)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL PARAMETER RUMUS HEADCOUNT */}
        {showTargetConfig && (
          <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-900 border-2 border-teal-600/50 rounded-[4px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                PARAMETER KALKULASI OTOMATIS ZONA NORMAL MAN-HOURS (±10% DARI HEADCOUNT BULANAN)
              </span>
              <button onClick={() => setShowTargetConfig(false)} className="text-[9px] font-black uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
                <span className="text-[8px] font-black text-emerald-800 dark:text-emerald-500 tracking-widest">INTERNAL DATABASE</span>
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button onClick={() => window.print()} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm shrink-0 cursor-pointer">
            {t.btn_print}
          </button>
        </div>
      </div>

      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">{t.title}</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* LAGGING INDICATORS */}
      <div>
        <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.sect_lagging}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.trirNum > targets.trirMax ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_1}</p>
            <div className="flex items-end gap-2">
              <span className={`text-3xl xl:text-4xl font-black font-mono print:text-black ${filteredData.trirNum > targets.trirMax ? 'text-rose-600 dark:text-rose-500' : 'text-slate-900 dark:text-white'}`}>{filteredData.trir}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">/ 200,000 HRS</span>
            </div>
            <p className={`text-[8px] font-black uppercase tracking-widest mt-3 pt-2 border-t print:border-black print:text-black ${filteredData.trirNum > targets.trirMax ? 'text-rose-500 border-rose-200 dark:border-rose-800' : 'text-slate-400 border-slate-100 dark:border-slate-800'}`}>
              TARGET: &lt; {targets.trirMax.toFixed(1)} {filteredData.trirNum > targets.trirMax && '(OFF TRACK)'}
            </p>
          </div>

          <div className={`p-5 rounded-[4px] border-2 print:border-black print:bg-transparent transition-colors ${filteredData.totalLti > targets.ltiMax ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'}`}>
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_2}</p>
            <div className="flex items-end gap-2">
              <span className={`text-3xl xl:text-4xl font-black font-mono print:text-black ${filteredData.totalLti > targets.ltiMax ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>{filteredData.totalLti}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">CASES</span>
            </div>
            <p className={`text-[8px] font-black uppercase tracking-widest mt-3 pt-2 border-t print:border-black print:text-black ${filteredData.totalLti > targets.ltiMax ? 'text-rose-500 border-rose-200 dark:border-rose-800' : 'text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800'}`}>
              TARGET: {targets.ltiMax} CASES {filteredData.totalLti > targets.ltiMax && '(OFF TRACK)'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_3}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl xl:text-4xl font-black font-mono text-slate-900 dark:text-white print:text-black">{filteredData.totalManDays.toLocaleString('en-US')}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">DAYS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              ACCUMULATED WORKFORCE EXPOSURE
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl xl:text-4xl font-black font-mono text-slate-900 dark:text-white print:text-black">{filteredData.totalManHours.toLocaleString('en-US')}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">HOURS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              MIN. BASELINE: &gt; {filteredData.periodTargetManHours.toLocaleString('en-US')} HRS
            </p>
          </div>
        </div>
      </div>

      {/* LEADING INDICATORS */}
      <div className="mt-8 relative group opacity-60 hover:opacity-100 transition-opacity duration-500">
        <div className="flex justify-between items-end border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4 print:text-black print:border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 print:text-black">
            {t.sect_leading}
          </h2>
          <span className="text-[8px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 rounded-[2px]">
            {t.lead_soon}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4 grayscale">
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_1}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-</span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_2}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_3}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-black">{t.lead_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-400 print:text-black">-<span className="text-xl">%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* DUA GRAFIK TREN TERPISAH: MAN-HOURS (DENGAN BATAS) & MAN-DAYS (CLEAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TrendLineChart 
          title={t.chart_title_mhrs} 
          data={filteredData.chartManHours} 
          minTargets={filteredData.minManHoursTargets}
          maxTargets={filteredData.maxManHoursTargets}
          labels={filteredData.chartLabels}
          unit="HRS"
          showBounds={true}
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('HOURS')}
          lang={lang}
        />
        <TrendLineChart 
          title={t.chart_title_mdys} 
          data={filteredData.chartManDays} 
          labels={filteredData.chartLabels}
          unit="DAYS"
          showBounds={false}
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('DAYS')}
          lang={lang}
        />
      </div>

      {/* PRINT SIGNATURES */}
      <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black text-black">
        <div className="text-center border-2 border-black p-4">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">HSE Supervisor</p>
        </div>
        <div className="text-center border-2 border-black p-4 bg-gray-100">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_gm}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">Director</p>
        </div>
      </div>

      {/* DATABASE INPUT & TABEL RINGKAS (CLICK-TO-EDIT + FULL MONTH NAME + TRASH ICON) */}
      <div className="mt-12 print:hidden">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 14h6M9 10h6" /></svg>
            {t.mgr_title}
          </h2>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[4px] p-5 transition-all">
          <p className="text-[9px] font-black mb-4 text-slate-700 dark:text-slate-300">
            {t.mgr_add}
          </p>
          <form onSubmit={handleAddNewRecord} className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 items-end">
            <div>
              <label htmlFor={`${formId}-y`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_y}</label>
              <input id={`${formId}-y`} type="number" value={inputYear} onChange={e=>setInputYear(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-m`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_m}</label>
              <select id={`${formId}-m`} value={inputMonth} onChange={e=>setInputMonth(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500 cursor-pointer">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>{getMonthFullName(m)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${formId}-hc`} className="block text-[8px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">{t.form_hc}</label>
              <input id={`${formId}-hc`} type="number" placeholder="110" value={inputHeadcount} onChange={e=>setInputHeadcount(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-mdys`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_mdys}</label>
              <input id={`${formId}-mdys`} type="number" placeholder="2420" value={inputManDays} onChange={e=>setInputManDays(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-hrs`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_hrs}</label>
              <input id={`${formId}-hrs`} type="number" placeholder="19360" value={inputManHours} onChange={e=>setInputManHours(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-lti`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_lti}</label>
              <input id={`${formId}-lti`} type="number" min="0" value={inputLti} onChange={e=>setInputLti(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-spl`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_spill}</label>
              <input id={`${formId}-spl`} type="number" min="0" value={inputSpills} onChange={e=>setInputSpills(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-inc`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_inc}</label>
              <input id={`${formId}-inc`} type="number" min="0" value={inputIncidents} onChange={e=>setInputIncidents(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-haz`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_haz}</label>
              <input id={`${formId}-haz`} type="number" min="0" value={inputHazards} onChange={e=>setInputHazards(Number(e.target.value) || (e.target.value==='0'?0:''))} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <button type="submit" disabled={inputManHours==='' || inputManDays==='' || inputHeadcount===''} className="w-full py-1.5 bg-teal-700 dark:bg-teal-600 hover:bg-teal-500 text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] disabled:opacity-50 transition-colors h-[30px] cursor-pointer disabled:cursor-not-allowed">
                {t.btn_save}
              </button>
            </div>
          </form>

          {/* NAVIGASI TAB TAHUN (MAKSIMAL 12 BARIS PER TAHUN) */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 dark:border-slate-700 pb-2">
            <div className="flex items-center gap-1.5">
              {availableYears.map(yr => {
                const count = records.filter(r => r.year === yr).length
                const isActive = tableYearTab === yr
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setTableYearTab(yr)
                      setEditingCell(null)
                    }}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {yr} ({count}/12)
                  </button>
                )
              })}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
              KLIK ANGKA UNTUK EDIT OTOMATIS (ENTER / KLIK LUAR UNTUK SIMPAN)
            </span>
          </div>

          {/* TABEL HISTORI DENGAN DIRECT CLICK-TO-EDIT */}
          <div className="mt-3 border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2 px-3 w-32">MONTH</th>
                  <th className="py-2 px-3">HEADCOUNT</th>
                  <th className="py-2 px-3">M-DAYS</th>
                  <th className="py-2 px-3">M-HOURS</th>
                  <th className="py-2 px-3">LTI</th>
                  <th className="py-2 px-3">SPILLS</th>
                  <th className="py-2 px-3">INCIDENTS</th>
                  <th className="py-2 px-3">HAZARDS</th>
                  <th className="py-2 px-3 text-center w-14">DEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {tableYearRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-slate-400">NO DATA FOR {tableYearTab}</td>
                  </tr>
                ) : (
                  tableYearRecords.map(r => {
                    const renderEditableCell = (
                      field: EditableField, 
                      displayContent: React.ReactNode, 
                      textColorClass = ''
                    ) => {
                      const isEditingThis = editingCell?.id === r.id && editingCell?.field === field
                      if (isEditingThis) {
                        return (
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            aria-label={`Edit ${field}`}
                            value={cellDraftValue}
                            onChange={e => setCellDraftValue(e.target.value)}
                            onBlur={commitCellEdit}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitCellEdit()
                              if (e.key === 'Escape') setEditingCell(null)
                            }}
                            className="w-24 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-950 border-2 border-teal-500 rounded-[2px] focus:outline-none"
                          />
                        )
                      }
                      return (
                        <button
                          type="button"
                          onClick={() => startCellEdit(r, field)}
                          title="Klik untuk edit"
                          className={`text-left font-mono px-1.5 py-0.5 -ml-1.5 rounded-[2px] border border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer ${textColorClass}`}
                        >
                          {displayContent}
                        </button>
                      )
                    }

                    return (
                      <tr key={r.id} className="hover:bg-white/60 dark:hover:bg-slate-950/60 transition-colors">
                        <td className="py-2 px-3 font-black tracking-wider text-slate-900 dark:text-slate-100">
                          {getMonthFullName(r.month)}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell(
                            'headcount',
                            r.headcount ? r.headcount.toLocaleString('en-US') : <span className="text-slate-400">-{targets.defaultHeadcount}-</span>,
                            'text-teal-700 dark:text-teal-400'
                          )}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('manDays', (r.manDays || 0).toLocaleString('en-US'))}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('manHours', r.manHours.toLocaleString('en-US'))}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('lti', r.lti)}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('spills', r.spills)}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('recordableIncidents', r.recordableIncidents, 'text-rose-600 dark:text-rose-400')}
                        </td>
                        <td className="py-1.5 px-3">
                          {renderEditableCell('hazardReports', r.hazardReports, 'text-teal-600 dark:text-teal-400')}
                        </td>
                        <td className="py-1.5 px-3 text-center">
                          <button 
                            type="button"
                            onClick={() => handleDeleteRecord(r.id)} 
                            aria-label={`Delete ${getMonthFullName(r.month)} ${r.year}`}
                            className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-[2px] transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
      </div>

      {/* MODAL PANDUAN SPESIFIK PER TREND */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden" onClick={() => setActiveInfoModal(null)}>
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-[4px] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-700 dark:text-teal-500">
                {activeInfoModal === 'HOURS' ? t.info_hours_title : t.info_days_title}
              </h3>
              <button onClick={() => setActiveInfoModal(null)} aria-label="Close modal" className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {activeInfoModal === 'HOURS' ? (
              <div className="space-y-6 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_hours_q1}</h4>
                  <ul className="space-y-3 list-none pl-0">
                    <li className="flex gap-2">
                      <span className="text-teal-600 mt-0.5">▪</span>
                      <span>{t.info_hours_b1}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-rose-600 mt-0.5">▪</span>
                      <span>{t.info_hours_b2}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-orange-500 mt-0.5">▪</span>
                      <span>{t.info_hours_b3}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.info_hours_q2}</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white mb-2">{t.info_hours_formula}</p>
                    <p className="text-[10px] text-slate-500">{t.info_hours_ex}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_days_q1}</h4>
                  <ul className="space-y-3 list-none pl-0">
                    <li className="flex gap-2">
                      <span className="text-teal-600 mt-0.5">▪</span>
                      <span>{t.info_days_b1}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 mt-0.5">▪</span>
                      <span>{t.info_days_b2}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.info_days_q2}</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white mb-2">{t.info_days_formula}</p>
                    <p className="text-[10px] text-slate-500">{t.info_days_ex}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800 text-right">
              <button onClick={() => setActiveInfoModal(null)} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer">
                {t.btn_close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
