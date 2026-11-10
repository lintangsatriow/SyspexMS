"use client"

import Link from 'next/link'

export default function LifeSafetyRulesPage() {
  const rules = [
    {
      id: 1,
      title: 'Energy Isolation (LOTO)',
      icon: '🔌',
      shortDesc: 'Verify zero-energy state',
      fullDesc: 'Never work on equipment without verifying a zero-energy state. Always apply personal locks and tags (Lockout/Tagout) before commencing maintenance, cleaning, or servicing.',
      gradient: 'from-teal-400 to-emerald-500'
    },
    {
      id: 2,
      title: 'Work at Height',
      icon: '🪜',
      shortDesc: '100% tie-off & scaffolding check',
      fullDesc: 'Always use 100% tie-off fall protection when working above 1.8 meters. Ensure scaffolding has a valid green tag and is erected by certified scaffolders.',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 3,
      title: 'Safe Lifting',
      icon: '🏗️',
      shortDesc: 'Never walk under suspended loads',
      fullDesc: 'Never walk, stand, or work under a suspended load. Always verify the Safe Working Load (SWL) of cranes, hoists, and rigging equipment prior to executing a lift.',
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      id: 4,
      title: 'Mobile Equipment',
      icon: '🚜',
      shortDesc: 'Keep distance from moving MHE',
      fullDesc: 'Maintain a safe exclusion zone around moving forklifts and Material Handling Equipment (MHE). Operators must hold a valid license (SIO) and conduct daily pre-op inspections.',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 5,
      title: 'Permit to Work',
      icon: '📋',
      shortDesc: 'Valid JSA for high-risk tasks',
      fullDesc: 'Never commence high-risk or non-routine tasks without an authorized Permit to Work. A Job Safety Analysis (JSA) and safety briefing must be completed with all crew members.',
      gradient: 'from-rose-400 to-red-500'
    },
    {
      id: 6,
      title: 'Fit to Work',
      icon: '⚕️',
      shortDesc: 'Zero tolerance for drugs/fatigue',
      fullDesc: 'Always arrive fit for duty. Syspex enforces a strict zero-tolerance policy for working under the influence of drugs, alcohol, or severe fatigue. Report any medical conditions immediately.',
      gradient: 'from-fuchsia-400 to-pink-500'
    }
  ]

  return (
    <div className="w-full flex flex-col px-4 py-8 sm:px-8 sm:py-10 bg-slate-950 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-900" style={{ minHeight: 'calc(100vh - 190px)' }}>
      
      {/* Ambient Background */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="absolute top-0 -right-32 w-96 h-96 bg-teal-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-400 transition mb-6 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>←</span> Back to Main Hub
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Syspex <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Safety Rules</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Our six non-negotiable core standards designed to eliminate fatalities and serious injuries. Compliance is mandatory for all employees and contractors.
          </p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
        {rules.map((rule) => (
          <div key={rule.id} className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col">
            
            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${rule.gradient} transition-opacity duration-500`}></div>
            
            {/* Header / Icon */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {rule.icon}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded border border-slate-800">
                Rule 0{rule.id}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-grow">
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors mb-1">{rule.title}</h3>
              <p className="text-[10px] font-bold text-teal-500/80 uppercase tracking-wider mb-3">{rule.shortDesc}</p>
              <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {rule.fullDesc}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${rule.gradient} transition-all duration-500 ease-out`}></div>
          </div>
        ))}
      </div>

    </div>
  )
}
