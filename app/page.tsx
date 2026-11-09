"use client"

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center text-center px-4 animate-in fade-in duration-500">
      
      {/* Status Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-teal-400 text-[11px] font-black uppercase tracking-widest shadow-sm mb-6 border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
        HSE & Compliance Operations System
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl">
        Engineering Precision. <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600">
          Uncompromised Safety.
        </span>
      </h1>

      {/* Tagline Elegan */}
      <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mt-5 leading-relaxed">
        The centralized operational platform for Syspex, integrating daily technical compliance, structural safety, and high-risk work governance.
      </p>

      {/* Navigation Quick Action */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          href="/executive-report"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>📊</span> Open KPI Dashboard
        </Link>
        <Link
          href="/ai-assistant"
          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition border border-slate-300 shadow-xs flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500"></span> Consult AI Copilot
        </Link>
      </div>

      {/* Subtle Corporate Credentials */}
      <div className="mt-14 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span>ISO 9001</span>
        <span>•</span>
        <span>ISO 14001</span>
        <span>•</span>
        <span>ISO 45001</span>
        <span>•</span>
        <span>SMK3 Kemnaker</span>
      </div>

    </div>
  )
}
