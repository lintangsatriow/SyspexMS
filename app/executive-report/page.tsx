"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

export default function KpiDashboardPage() {
  const { lang } = useLanguage()
  const [todayDate, setTodayDate] = useState<string>('')

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
  }, [])

  const dict = {
    ID: {
      breadcrumb: "Manajemen & ISO",
      title: "HSE KPI Dashboard",
      subtitle: "Visibilitas eksekutif untuk metrik keselamatan (LTI, TRIR), kepatuhan izin kerja, dan pelaporan bahaya berjalan.",
      btn_print: "Cetak Laporan Eksekutif",
      
      metric_1: "Total Recordable Incident Rate (TRIR)",
      metric_2: "Lost Time Injury (LTI)",
      metric_3: "Active Permit to Work (PTW)",
      metric_4: "Kepatuhan APD (Safety Audit)",
      
      chart_title: "Tren Insiden & Pelaporan Bahaya (YTD)",
      chart_hazards: "Laporan Bahaya (Hazards)",
      chart_incidents: "Insiden Tercatat",
      
      print_doc_type: "LAPORAN EKSEKUTIF K3L (HSE) • SYSPEX MS",
      print_reg: "Nomor Registrasi:",
      sign_hse: "Dianalisa Oleh (HSE Manager):",
      sign_gm: "Diketahui Oleh (General Manager):"
    },
    EN: {
      breadcrumb: "Management & ISO",
      title: "HSE KPI Dashboard",
      subtitle: "Executive visibility for safety metrics (LTI, TRIR), permit to work compliance, and active hazard reporting.",
      btn_print: "Print Executive Report",
      
      metric_1: "Total Recordable Incident Rate (TRIR)",
      metric_2: "Lost Time Injury (LTI)",
      metric_3: "Active Permit to Work (PTW)",
      metric_4: "PPE Compliance (Safety Audit)",
      
      chart_title: "Incident & Hazard Reporting Trends (YTD)",
      chart_hazards: "Hazard Reports",
      chart_incidents: "Recordable Incidents",
      
      print_doc_type: "HSE EXECUTIVE SUMMARY REPORT • SYSPEX MS",
      print_reg: "Registration No:",
      sign_hse: "Analyzed By (HSE Manager):",
      sign_gm: "Acknowledged By (General Manager):"
    }
  }

  const t = dict[lang]

  // Dummy YTD Data (Mechanical Chart Data)
  const monthlyData = [
    { month: 'JAN', hazards: 12, incidents: 0 },
    { month: 'FEB', hazards: 18, incidents: 1 },
    { month: 'MAR', hazards: 15, incidents: 0 },
    { month: 'APR', hazards: 22, incidents: 0 },
    { month: 'MAY', hazards: 9, incidents: 0 },
    { month: 'JUN', hazards: 14, incidents: 0 },
  ]
  const maxHazards = Math.max(...monthlyData.map(d => d.hazards))

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">{t.title}</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition shadow-sm shrink-0"
          >
            {t.btn_print}
          </button>
        </div>
      </div>

      {/* HEADER CETAK DOKUMEN (PRINT) */}
      <div className="hidden print:block border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">HSE Executive Report</h1>
            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{t.print_doc_type}</p>
          </div>
          <div className="text-right border-2 border-black p-2">
            <span className="text-[9px] font-black text-black uppercase tracking-widest block">{t.print_reg}</span>
            <span className="text-sm font-black text-black uppercase">EXC-{todayDate.replace(/-/g, '')}</span>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
          <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.metric_1}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white print:text-black">1.2</span>
            <span className="text-xs font-bold text-slate-400 mb-1">/ 200K HRS</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
          <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.metric_2}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-500 print:text-black">0</span>
            <span className="text-xs font-bold text-slate-400 mb-1">CASES</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
          <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.metric_3}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-amber-600 dark:text-amber-500 print:text-black">8</span>
            <span className="text-xs font-bold text-slate-400 mb-1">OPEN</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-[4px] print:border-black print:bg-transparent transition-colors">
          <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 print:text-black">{t.metric_4}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-teal-600 dark:text-teal-500 print:text-black">94<span className="text-2xl">%</span></span>
          </div>
        </div>
      </div>

      {/* MECHANICAL CHART SECTION */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[4px] print:border-black print:bg-transparent transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-slate-100 dark:border-slate-800 print:border-black pb-4 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white print:text-black">
            {t.chart_title}
          </h2>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-600 border border-teal-700 print:border-black print:bg-gray-300"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_hazards}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-600 border border-rose-700 print:border-black print:bg-black"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black">{t.chart_incidents}</span>
            </div>
          </div>
        </div>

        {/* CSS Grid Bar Chart */}
        <div className="flex items-end gap-4 sm:gap-8 h-48 pt-4">
          {monthlyData.map((data, idx) => {
            const hazardHeight = (data.hazards / maxHazards) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full relative">
                  {/* Hazard Bar */}
                  <div 
                    style={{ height: `${hazardHeight}%` }} 
                    className="w-1/2 max-w-[40px] bg-teal-600 border-t-2 border-teal-400 dark:border-teal-300 print:border-black print:bg-gray-300 transition-all duration-500 relative group"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-500 print:text-black opacity-0 group-hover:opacity-100 print:opacity-100">{data.hazards}</span>
                  </div>
                  {/* Incident Bar */}
                  {data.incidents > 0 && (
                    <div 
                      style={{ height: `${(data.incidents / maxHazards) * 100}%` }} 
                      className="w-1/2 max-w-[40px] bg-rose-600 border-t-2 border-rose-400 dark:border-rose-300 print:border-black print:bg-black transition-all duration-500 relative group"
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-500 print:text-black opacity-0 group-hover:opacity-100 print:opacity-100">{data.incidents}</span>
                    </div>
                  )}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-black border-t-2 border-slate-200 dark:border-slate-800 print:border-black w-full text-center pt-2">
                  {data.month}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* DOKUMEN CETAK (PRINT) - SIGNATURES */}
      <div className="hidden print:grid grid-cols-2 gap-12 pt-12 mt-12 border-t-4 border-black text-black">
        <div className="text-center border-2 border-black p-4">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_hse}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">Syspex HSE Manager</p>
        </div>
        <div className="text-center border-2 border-black p-4 bg-gray-100">
          <p className="text-[9px] font-black uppercase tracking-widest mb-20">{t.sign_gm}</p>
          <div className="w-3/4 mx-auto border-b-2 border-black"></div>
          <p className="text-[10px] font-black mt-2 uppercase">General Manager</p>
        </div>
      </div>

    </div>
  )
}
