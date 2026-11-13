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
type InfoModalType = 'HOURS' | 'AVG_PERSONNEL' | 'DAILY_INTENSITY' | 'TRIR' | null
type EditableField = 'headcount' | 'manDays' | 'manHours' | 'lti' | 'spills' | 'recordableIncidents' | 'hazardReports'

interface HoverTooltip {
  x: number
  y: number
  title: string
  value: string
  statusColor: string
}

const VERIFIED_BASELINE_DATA: Array<{ year: number; month: number; headcount: number; manDays: number; manHours: number }> = [
  { year: 2024, month: 1, headcount: 100, manDays: 1793, manHours: 16402 },
  { year: 2024, month: 2, headcount: 101, manDays: 1605, manHours: 14509 },
  { year: 2024, month: 3, headcount: 101, manDays: 1623, manHours: 14698 },
  { year: 2024, month: 4, headcount: 102, manDays: 1299, manHours: 11752 },
  { year: 2024, month: 5, headcount: 102, manDays: 1621, manHours: 14959 },
  { year: 2024, month: 6, headcount: 104, manDays: 1574, manHours: 14362 },
  { year: 2024, month: 7, headcount: 107, manDays: 1992, manHours: 18131 },
  { year: 2024, month: 8, headcount: 107, manDays: 1909, manHours: 17547 },
  { year: 2024, month: 9, headcount: 108, manDays: 1757, manHours: 16252 },
  { year: 2024, month: 10, headcount: 108, manDays: 2036, manHours: 18539 },
  { year: 2024, month: 11, headcount: 109, manDays: 1855, manHours: 16767 },
  { year: 2024, month: 12, headcount: 110, manDays: 1803, manHours: 16750 },
  { year: 2025, month: 1, headcount: 98, manDays: 1642, manHours: 14959 },
  { year: 2025, month: 2, headcount: 98, manDays: 1710, manHours: 15748 },
  { year: 2025, month: 3, headcount: 98, manDays: 1613, manHours: 14872 },
  { year: 2025, month: 4, headcount: 99, manDays: 1415, manHours: 12850 },
  { year: 2025, month: 5, headcount: 100, manDays: 1629, manHours: 15043 },
  { year: 2025, month: 6, headcount: 101, manDays: 1638, manHours: 15171 },
  { year: 2025, month: 7, headcount: 102, manDays: 1973, manHours: 17972 },
  { year: 2025, month: 8, headcount: 106, manDays: 1932, manHours: 17693 },
  { year: 2025, month: 9, headcount: 108, manDays: 1935, manHours: 18011 },
  { year: 2025, month: 10, headcount: 108, manDays: 2117, manHours: 19478 },
  { year: 2025, month: 11, headcount: 109, manDays: 1877, manHours: 17226 },
  { year: 2025, month: 12, headcount: 109, manDays: 1841, manHours: 16833 },
  { year: 2026, month: 1, headcount: 101, manDays: 1761, manHours: 16266 },
  { year: 2026, month: 2, headcount: 101, manDays: 1676, manHours: 15374 },
  { year: 2026, month: 3, headcount: 102, manDays: 1534, manHours: 13774 },
  { year: 2026, month: 4, headcount: 104, manDays: 1909, manHours: 17222 },
  { year: 2026, month: 5, headcount: 108, manDays: 1736, manHours: 15726 },
  { year: 2026, month: 6, headcount: 108, manDays: 1869, manHours: 16813 },
  { year: 2026, month: 7, headcount: 111, manDays: 2295, manHours: 20977 },
  { year: 2026, month: 8, headcount: 113, manDays: 1987, manHours: 18125 },
  { year: 2026, month: 9, headcount: 117, manDays: 2288, manHours: 21037 },
  { year: 2026, month: 10, headcount: 123, manDays: 2396, manHours: 22215 }
]

const DEFAULT_TARGETS: TargetConfig = {
  trirMax: 1.0,
  ltiMax: 0,
  defaultHeadcount: 106,
  workingDaysPerMonth: 22,
  hoursPerDay: 9
}

const TrendLineChart = ({ 
  title, 
  data, 
  cautionTargets,
  criticalTargets, 
  labels, 
  unit,
  decimals = 0,
  limitMode = 'NONE',
  isMultiYear,
  onOpenInfo,
  lang
}: { 
  title: string
  data: number[]
  cautionTargets?: number[]
  criticalTargets?: number[]
  labels: string[]
  unit: string
  decimals?: number
  limitMode?: 'NONE' | 'TWO_TIER' | 'SINGLE_MAX'
  isMultiYear?: boolean
  onOpenInfo: () => void
  lang: 'ID' | 'EN'
}) => {
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null)

  const formatVal = (val: number) => {
    if (decimals > 0) {
      return val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    }
    return Math.round(val).toLocaleString('en-US')
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black transition-colors">
        <div className="flex justify-between items-center border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">{title}</h2>
          <button onClick={onOpenInfo} aria-label="Panduan Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <div className="h-44 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-800">
          NO DATA FOR SELECTED PERIOD
        </div>
      </div>
    )
  }

  const hasTwoTier = limitMode === 'TWO_TIER' && cautionTargets && criticalTargets && cautionTargets.length === data.length && criticalTargets.length === data.length
  const hasSingleMax = limitMode === 'SINGLE_MAX' && criticalTargets && criticalTargets.length === data.length

  const padX = 44
  const padY = 36
  const width = 1000
  const height = 250
  const plotWidth = width - padX * 2
  const plotHeight = height - padY * 2

  const maxCandidate = hasTwoTier || hasSingleMax
    ? Math.max(...data, ...(criticalTargets || []))
    : Math.max(...data)
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
        ...[...cautionTargets].reverse().map((val, revI) => {
          const origI = cautionTargets.length - 1 - revI
          return `${getX(origI)},${mapY(val)}`
        })
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
          <button onClick={onOpenInfo} aria-label="Panduan Metrik" className="text-slate-400 hover:text-teal-600 transition-colors print:hidden cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

      <div className="flex flex-wrap gap-3 mb-2 text-[8px] font-black uppercase tracking-widest">
        {hasTwoTier ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 border-t-2 border-dashed border-rose-600"></span>
              <span className="text-rose-600 dark:text-rose-400">FATIGUE LIMIT (+10%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 border-t-2 border-dashed border-orange-500"></span>
              <span className="text-orange-600 dark:text-orange-400">EARLY WARNING (100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="text-slate-500 dark:text-slate-400">SAFE</span>
            </div>
          </>
        ) : hasSingleMax ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 border-t-2 border-dashed border-rose-600"></span>
              <span className="text-rose-600 dark:text-rose-400">THRESHOLD LIMIT ({formatVal(avgCritical)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="text-slate-500 dark:text-slate-400">COMPLIANT</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 border-t-2 border-teal-600"></span>
            <span className="text-slate-500 dark:text-slate-400">HISTORICAL TREND</span>
          </div>
        )}
      </div>
      
      <div className="w-full overflow-hidden relative" onMouseLeave={() => setTooltip(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {hasTwoTier && cautionTargets && criticalTargets && (
            <>
              {data.length > 1 ? (
                <polygon
                  points={bufferZonePolygon}
                  className="fill-orange-50 dark:fill-orange-950/25 print:fill-gray-100 cursor-crosshair transition-opacity hover:opacity-80"
                  onMouseEnter={() => setTooltip({
                    x: width / 2,
                    y: (mapY(avgCritical) + mapY(avgCaution)) / 2,
                    title: bufferZoneText,
                    value: `${formatVal(avgCaution)} - ${formatVal(avgCritical)} ${unit}`,
                    statusColor: 'text-orange-600 dark:text-orange-400'
                  })}
                />
              ) : (
                <rect
                  x={padX}
                  y={mapY(criticalTargets[0])}
                  width={plotWidth}
                  height={Math.max(0, mapY(cautionTargets[0]) - mapY(criticalTargets[0]))}
                  className="fill-orange-50 dark:fill-orange-950/25 print:fill-gray-100"
                />
              )}

              {data.length > 1 ? (
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: width / 2,
                    y: mapY(avgCaution),
                    title: cautionLimitText,
                    value: `${formatVal(avgCaution)} ${unit}`,
                    statusColor: 'text-orange-600 dark:text-orange-400'
                  })}
                >
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
              <g
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({
                  x: width / 2,
                  y: mapY(avgCritical),
                  title: criticalLimitText,
                  value: `MAX ${formatVal(avgCritical)} ${unit}`,
                  statusColor: 'text-rose-600 dark:text-rose-400'
                })}
              >
                <polyline points={criticalPoints} fill="none" stroke="transparent" strokeWidth="14" />
                <polyline points={criticalPoints} fill="none" className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
              </g>
            ) : (
              <line x1={padX} y1={mapY(criticalTargets[0])} x2={width-padX} y2={mapY(criticalTargets[0])} className="stroke-rose-600 print:stroke-black" strokeWidth="2.5" strokeDasharray="6,6" />
            )
          )}

          {data.length > 1 && (
            <polyline 
              points={points} 
              fill="none" 
              className="stroke-teal-700 dark:stroke-teal-400 print:stroke-black pointer-events-none" 
              strokeWidth="2.5" 
            />
          )}

          {data.map((val, i) => {
            const cx = getX(i)
            const cy = mapY(val)

            if (hasTwoTier && cautionTargets && criticalTargets) {
              const curCaution = cautionTargets[i]
              const curCritical = criticalTargets[i]
              const isCritical = val > curCritical
              const isCaution = !isCritical && val >= curCaution
              
              const pointClass = isCritical 
                ? "fill-rose-600 print:fill-gray-600" 
                : isCaution
                ? "fill-orange-500 print:fill-gray-400"
                : "fill-teal-600 dark:fill-teal-400 print:fill-black"

              const statusColor = isCritical 
                ? "text-rose-600 dark:text-rose-400" 
                : isCaution
                ? "text-orange-600 dark:text-orange-400"
                : "text-teal-700 dark:text-teal-400"

              const statusTag = isCritical ? ' (OVER LIMIT)' : isCaution ? ' (CAUTION)' : ' (SAFE)'

              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: cx,
                    y: cy,
                    title: `${labels[i]}${statusTag}`,
                    value: `${formatVal(val)} ${unit} [WARN: ${formatVal(curCaution)} | MAX: ${formatVal(curCritical)}]`,
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
            }

            if (hasSingleMax && criticalTargets) {
              const curMax = criticalTargets[i]
              const isOver = val > curMax
              const pointClass = isOver ? "fill-rose-600 print:fill-gray-600" : "fill-teal-600 dark:fill-teal-400 print:fill-black"
              const statusColor = isOver ? "text-rose-600 dark:text-rose-400" : "text-teal-700 dark:text-teal-400"
              const statusTag = isOver ? ' (OFF TRACK)' : ' (ON TRACK)'

              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({
                    x: cx,
                    y: cy,
                    title: `${labels[i]}${statusTag}`,
                    value: `${formatVal(val)} ${unit} [MAX: ${formatVal(curMax)}]`,
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
            }

            return (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({
                  x: cx,
                  y: cy,
                  title: labels[i],
                  value: `${formatVal(val)} ${unit}`,
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
  
  const [inputYear, setInputYear] = useState<number>(currentYear)
  const [inputMonth, setInputMonth] = useState<number>(new Date().getMonth() + 1)
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
    const savedData = localStorage.getItem('syspex_hse_db')
    if (savedData) {
      setRecords(JSON.parse(savedData))
    } else {
      const initialRecords: HseRecord[] = VERIFIED_BASELINE_DATA.map(item => ({
        id: `${item.year}-${item.month}`,
        year: item.year,
        month: item.month,
        headcount: item.headcount,
        manDays: item.manDays,
        manHours: item.manHours,
        lti: 0,
        spills: 0,
        recordableIncidents: 0,
        hazardReports: 0
      }))
      setRecords(initialRecords)
      localStorage.setItem('syspex_hse_db', JSON.stringify(initialRecords))
    }

    const savedTargets = localStorage.getItem('syspex_hse_targets')
    if (savedTargets) {
      setTargets({ ...DEFAULT_TARGETS, ...JSON.parse(savedTargets) })
    } else {
      setTargets(DEFAULT_TARGETS)
      localStorage.setItem('syspex_hse_targets', JSON.stringify(DEFAULT_TARGETS))
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

  const startCellEdit = (record: HseRecord, field: EditableField) => {
    const currentVal = field === 'headcount'
      ? (record.headcount ?? targets.defaultHeadcount)
      : (record[field] ?? 0)
    setEditingCell({ id: record.id, field })
    setCellDraftValue(String(currentVal))
  }

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
    const cautionManHoursTargets = sortedRecords.map(r => {
      const hc = r.headcount && r.headcount > 0 ? r.headcount : targets.defaultHeadcount
      return Math.round(hc * targets.hoursPerDay * targets.workingDaysPerMonth)
    })
    const criticalManHoursTargets = sortedRecords.map(r => {
      const hc = r.headcount && r.headcount > 0 ? r.headcount : targets.defaultHeadcount
      return Math.round(hc * targets.hoursPerDay * targets.workingDaysPerMonth * 1.1)
    })

    const chartAvgHoursPerPerson = sortedRecords.map(r => {
      const hc = r.headcount && r.headcount > 0 ? r.headcount : targets.defaultHeadcount
      return hc > 0 ? Number((r.manHours / hc).toFixed(1)) : 0
    })
    const cautionAvgPersonTargets = sortedRecords.map(() => Number((targets.hoursPerDay * targets.workingDaysPerMonth).toFixed(1)))
    const criticalAvgPersonTargets = sortedRecords.map(() => Number((targets.hoursPerDay * targets.workingDaysPerMonth * 1.1).toFixed(1)))

    const chartDailyIntensity = sortedRecords.map(r => {
      const md = r.manDays || 0
      return md > 0 ? Number((r.manHours / md).toFixed(2)) : 0
    })
    const cautionDailyTargets = sortedRecords.map(() => Number(targets.hoursPerDay.toFixed(2)))
    const criticalDailyTargets = sortedRecords.map(() => Number((targets.hoursPerDay * 1.1).toFixed(2)))

    const chartMonthlyTrir = sortedRecords.map(r => {
      return r.manHours > 0 ? Number(((r.recordableIncidents * 200000) / r.manHours).toFixed(2)) : 0
    })
    const maxTrirTargets = sortedRecords.map(() => targets.trirMax)

    const periodFatigueCeiling = criticalManHoursTargets.reduce((a, b) => a + b, 0)

    return { 
      totalLti, totalSpills, totalManDays, totalManHours, 
      trir, trirNum, chartLabels, 
      chartManHours, cautionManHoursTargets, criticalManHoursTargets,
      chartAvgHoursPerPerson, cautionAvgPersonTargets, criticalAvgPersonTargets,
      chartDailyIntensity, cautionDailyTargets, criticalDailyTargets,
      chartMonthlyTrir, maxTrirTargets,
      periodFatigueCeiling
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
      
      chart_1_title: `1. Tren Jam Kerja Bulanan (${periodLabel})`,
      chart_2_title: `2. Rata-Rata Jam Kerja per Personel (${periodLabel})`,
      chart_3_title: `3. Intensitas Jam Kerja Harian (${periodLabel})`,
      chart_4_title: `4. Tren Rasio Insiden / TRIR (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & Log Histori)",
      mgr_add: "Tambah Data Kinerja Bulanan Baru",
      form_y: "Tahun", form_m: "Bulan", form_hc: "Headcount", form_lti: "LTI", form_spill: "Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Incidents", form_haz: "Hazards", 
      btn_save: "Simpan Baru",

      print_doc_type: "LAPORAN KINERJA K3L",
      print_reg: "Periode Laporan:",
      sign_hse: "Dianalisa Oleh (HSE Supervisor):",
      sign_gm: "Diketahui Oleh (Director):",

      info_1_title: "1. Panduan Total Jam Kerja Bulanan (Man-Hours)",
      info_1_q1: "Relevansi dengan Operasional & Risiko",
      info_1_b1: "Indikator Eksposur Risiko (Denominator TRIR): Mengukur total akumulasi durasi kerja seluruh personel (teknisi lapangan & backoffice) sebagai pembagi standar dalam kalkulasi TRIR.",
      info_1_b2: "Garis Oranye (Early Warning — 100% Kapasitas Normal): Batas jam kerja reguler penuh. Jika grafik memasuki zona oranye, HSE perlu mengantisipasi pengaturan shift dan batasan lembur untuk bulan berikutnya.",
      info_1_b3: "Garis Merah (Critical Fatigue Limit +10%): Ambang batas lembur berlebih. Titik merah menandakan risiko kelelahan kolektif yang meningkatkan potensi kecelakaan berkendara maupun instalasi mesin.",
      info_1_formula: "Early Warning = Headcount x Jam/Hari x Hari Kerja | Fatigue Limit = +10%",

      info_2_title: "2. Panduan Rata-Rata Jam Kerja per Personel",
      info_2_q1: "Mengapa Metrik Ini Penting?",
      info_2_b1: "Netral terhadap Perubahan Jumlah Karyawan: Total Man-Hours bisa naik hanya karena ada perekrutan baru. Dengan membagi Man-Hours dengan Total Headcount (teknisi + backoffice), kita melihat beban kerja rata-rata per individu secara murni.",
      info_2_b2: "Garis Oranye (Standar Bulanan = Jam/Hari x Hari Kerja): Contoh 9 jam kotor (termasuk istirahat) x 22 hari = 198 jam/personel/bulan.",
      info_2_b3: "Garis Merah (+10% Beban Individual): Jika rata-rata melewati garis merah, artinya terjadi beban lembur merata yang memicu kelelahan individu.",
      info_2_formula: "Rumus = Total Man-Hours ÷ Total Headcount Bulan Tersebut",

      info_3_title: "3. Panduan Intensitas Jam Kerja Harian",
      info_3_q1: "Deteksi Lembur Harian (Daily Overtime)",
      info_3_b1: "Durasi Kerja per Hari Kehadiran Aktif: Membandingkan total jam kerja dengan total hari kehadiran aktif (Durasi kerja > 0, tanpa menghitung hari Off/Libur/Cuti).",
      info_3_b2: "Garis Oranye (Jam Kerja Normal/Hari): Standar 9.0 jam kotor/hari sesuai pencatatan sistem absensi HRIS.",
      info_3_b3: "Garis Merah (+10% Lembur Harian): Jika rata-rata harian menembus 9.9 jam/hari, artinya personel sering pulang larut saat melakukan instalasi atau perbaikan di lokasi customer.",
      info_3_formula: "Rumus = Total Man-Hours ÷ Active Man-Days (Durasi Kerja > 0)",

      info_4_title: "4. Panduan Tren Rasio Insiden (TRIR)",
      info_4_q1: "Standar Kinerja Keselamatan Kerja (OSHA / ISO 45001)",
      info_4_b1: "Frekuensi Kecelakaan Tercatat: Mengukur jumlah insiden kerja yang memerlukan penanganan medis (Recordable Incidents) per 200,000 jam kerja.",
      info_4_b2: "Garis Merah (Batas Maksimum Perusahaan): Target perusahaan adalah menjaga TRIR di bawah 1.0 (atau 0.00 untuk Zero Accident).",
      info_4_b3: "Catatan Masa Transisi: Grafik akan menampilkan garis datar di angka 0.00 hingga modul pelaporan insiden aktif sepenuhnya.",
      info_4_formula: "Rumus = (Recordable Incidents x 200,000) ÷ Total Man-Hours",

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
      
      chart_1_title: `1. Monthly Total Man-Hours Trend (${periodLabel})`,
      chart_2_title: `2. Avg Working Hours per Personnel (${periodLabel})`,
      chart_3_title: `3. Daily Working Hour Intensity (${periodLabel})`,
      chart_4_title: `4. Monthly Incident Rate / TRIR Trend (${periodLabel})`,
      
      mgr_title: "DATA HSE (Input & History Logs)",
      mgr_add: "Add New Monthly Performance Record",
      form_y: "Year", form_m: "Month", form_hc: "Headcount", form_lti: "LTI", form_spill: "Spills", form_mdys: "Man-Days", form_hrs: "Man-Hours", form_inc: "Incidents", form_haz: "Hazards", 
      btn_save: "Save New",

      print_doc_type: "HSE PERFORMANCE REPORT",
      print_reg: "Report Period:",
      sign_hse: "Analyzed By (HSE Supervisor):",
      sign_gm: "Acknowledged By (Director):",

      info_1_title: "1. Total Monthly Man-Hours Guide",
      info_1_q1: "Relevance to Operations & Risk Exposure",
      info_1_b1: "Risk Exposure Denominator (TRIR): Tracks total accumulated working hours across all personnel (field technicians & backoffice) as the standard denominator for TRIR.",
      info_1_b2: "Orange Line (Early Warning — 100% Normal Capacity): Full regular working hours. Entering the orange buffer prompts HSE to manage shift rotation and cap overtime for the following month.",
      info_1_b3: "Red Line (Critical Fatigue Limit +10%): Excessive overtime threshold. Red points indicate collective fatigue that elevates commuting and installation accident risks.",
      info_1_formula: "Early Warning = Headcount x Hours/Day x Working Days | Fatigue Limit = +10%",

      info_2_title: "2. Avg Working Hours per Personnel Guide",
      info_2_q1: "Why This Metric Matters",
      info_2_b1: "Headcount-Neutral Workload: Total Man-Hours can rise simply due to new hires. Dividing Man-Hours by Total Headcount (technicians + backoffice) isolates true individual workload.",
      info_2_b2: "Orange Line (Monthly Standard = Hours/Day x Working Days): Example 9 gross hrs x 22 days = 198 hrs/person/month.",
      info_2_b3: "Red Line (+10% Individual Load): Exceeding the red line signals widespread overtime and individual fatigue.",
      info_2_formula: "Formula = Total Man-Hours ÷ Total Monthly Headcount",

      info_3_title: "3. Daily Working Hour Intensity Guide",
      info_3_q1: "Detecting Daily Overtime",
      info_3_b1: "Hours per Active Attendance Day: Compares total working hours against active attendance days (Duration > 0, excluding Off/Holidays/Leave).",
      info_3_b2: "Orange Line (Standard Daily Hours): 9.0 gross hours/day baseline per HRIS attendance logs.",
      info_3_b3: "Red Line (+10% Daily Overtime): Consistently exceeding 9.9 hours/day indicates frequent late shifts during customer machine installations or repairs.",
      info_3_formula: "Formula = Total Man-Hours ÷ Active Monthly Man-Days",

      info_4_title: "4. Monthly Incident Rate (TRIR) Guide",
      info_4_q1: "OSHA / ISO 45001 Safety Benchmark",
      info_4_b1: "Recordable Incident Frequency: Measures work-related recordable incidents per 200,000 working hours.",
      info_4_b2: "Red Line (Company Threshold): Target is keeping TRIR below 1.0 (or 0.00 for Zero Accident).",
      info_4_b3: "Transition Note: Displays a flat 0.00 baseline until incident reporting modules are fully integrated.",
      info_4_formula: "Formula = (Recordable Incidents x 200,000) ÷ Total Man-Hours",

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
              type="button"
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
                PARAMETER KALKULASI EARLY WARNING (100%) & FATIGUE LIMIT (+10%)
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
              <span className="text-[9px] font-bold text-slate-400 mb-1">ACTIVE DAYS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              VERIFIED WORKING ATTENDANCE
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.lag_4}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl xl:text-4xl font-black font-mono text-slate-900 dark:text-white print:text-black">{filteredData.totalManHours.toLocaleString('en-US')}</span>
              <span className="text-[9px] font-bold text-slate-400 mb-1">HOURS</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 print:border-black print:text-black">
              FATIGUE CEILING: &lt; {filteredData.periodFatigueCeiling.toLocaleString('en-US')} HRS
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

      {/* 4 GRAFIK TREN ANALITIK (GRID 2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TrendLineChart 
          title={t.chart_1_title} 
          data={filteredData.chartManHours} 
          cautionTargets={filteredData.cautionManHoursTargets}
          criticalTargets={filteredData.criticalManHoursTargets}
          labels={filteredData.chartLabels}
          unit="HRS"
          decimals={0}
          limitMode="TWO_TIER"
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('HOURS')}
          lang={lang}
        />
        <TrendLineChart 
          title={t.chart_2_title} 
          data={filteredData.chartAvgHoursPerPerson} 
          cautionTargets={filteredData.cautionAvgPersonTargets}
          criticalTargets={filteredData.criticalAvgPersonTargets}
          labels={filteredData.chartLabels}
          unit="HRS / PERSON"
          decimals={1}
          limitMode="TWO_TIER"
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('AVG_PERSONNEL')}
          lang={lang}
        />
        <TrendLineChart 
          title={t.chart_3_title} 
          data={filteredData.chartDailyIntensity} 
          cautionTargets={filteredData.cautionDailyTargets}
          criticalTargets={filteredData.criticalDailyTargets}
          labels={filteredData.chartLabels}
          unit="HRS / DAY"
          decimals={2}
          limitMode="TWO_TIER"
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('DAILY_INTENSITY')}
          lang={lang}
        />
        <TrendLineChart 
          title={t.chart_4_title} 
          data={filteredData.chartMonthlyTrir} 
          criticalTargets={filteredData.maxTrirTargets}
          labels={filteredData.chartLabels}
          unit="TRIR"
          decimals={2}
          limitMode="SINGLE_MAX"
          isMultiYear={selectedYear === 'ALL'}
          onOpenInfo={() => setActiveInfoModal('TRIR')}
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

      {/* DATABASE INPUT & TABEL RINGKAS */}
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
              <input id={`${formId}-mdys`} type="number" placeholder="2000" value={inputManDays} onChange={e=>setInputManDays(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor={`${formId}-hrs`} className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.form_hrs}</label>
              <input id={`${formId}-hrs`} type="number" placeholder="18000" value={inputManHours} onChange={e=>setInputManHours(Number(e.target.value) || '')} className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[2px] focus:outline-none focus:border-teal-500" />
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

          {/* NAVIGASI TAB TAHUN */}
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

      {/* MODAL PANDUAN SPESIFIK UNTUK MASING-MASING DARI 4 TREN */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden" onClick={() => setActiveInfoModal(null)}>
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-[4px] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-teal-700 dark:text-teal-500">
                {activeInfoModal === 'HOURS' && t.info_1_title}
                {activeInfoModal === 'AVG_PERSONNEL' && t.info_2_title}
                {activeInfoModal === 'DAILY_INTENSITY' && t.info_3_title}
                {activeInfoModal === 'TRIR' && t.info_4_title}
              </h3>
              <button onClick={() => setActiveInfoModal(null)} aria-label="Close modal" className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-6 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeInfoModal === 'HOURS' && (
                <>
                  <div>
                    <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_1_q1}</h4>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex gap-2"><span className="text-teal-600 mt-0.5">▪</span><span>{t.info_1_b1}</span></li>
                      <li className="flex gap-2"><span className="text-orange-500 mt-0.5">▪</span><span>{t.info_1_b2}</span></li>
                      <li className="flex gap-2"><span className="text-rose-600 mt-0.5">▪</span><span>{t.info_1_b3}</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white">{t.info_1_formula}</p>
                  </div>
                </>
              )}

              {activeInfoModal === 'AVG_PERSONNEL' && (
                <>
                  <div>
                    <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_2_q1}</h4>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex gap-2"><span className="text-teal-600 mt-0.5">▪</span><span>{t.info_2_b1}</span></li>
                      <li className="flex gap-2"><span className="text-orange-500 mt-0.5">▪</span><span>{t.info_2_b2}</span></li>
                      <li className="flex gap-2"><span className="text-rose-600 mt-0.5">▪</span><span>{t.info_2_b3}</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white">{t.info_2_formula}</p>
                  </div>
                </>
              )}

              {activeInfoModal === 'DAILY_INTENSITY' && (
                <>
                  <div>
                    <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_3_q1}</h4>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex gap-2"><span className="text-teal-600 mt-0.5">▪</span><span>{t.info_3_b1}</span></li>
                      <li className="flex gap-2"><span className="text-orange-500 mt-0.5">▪</span><span>{t.info_3_b2}</span></li>
                      <li className="flex gap-2"><span className="text-rose-600 mt-0.5">▪</span><span>{t.info_3_b3}</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white">{t.info_3_formula}</p>
                  </div>
                </>
              )}

              {activeInfoModal === 'TRIR' && (
                <>
                  <div>
                    <h4 className="text-slate-900 dark:text-white uppercase tracking-wider mb-3">{t.info_4_q1}</h4>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex gap-2"><span className="text-teal-600 mt-0.5">▪</span><span>{t.info_4_b1}</span></li>
                      <li className="flex gap-2"><span className="text-rose-600 mt-0.5">▪</span><span>{t.info_4_b2}</span></li>
                      <li className="flex gap-2"><span className="text-slate-400 mt-0.5">▪</span><span>{t.info_4_b3}</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-[2px] font-mono">
                    <p className="text-[11px] text-slate-900 dark:text-white">{t.info_4_formula}</p>
                  </div>
                </>
              )}
            </div>

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
