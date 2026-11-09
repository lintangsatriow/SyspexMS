"use client"

import Link from 'next/link'

export default function HomePage() {
  const systemMetrics = [
    { label: 'Cumulative Safe Hours', value: '142,500', sub: 'Zero Lost Time Injury (LTI)', status: 'text-teal-600' },
    { label: 'Integrated Modules', value: '9 Active', sub: 'Field, Tech & Governance', status: 'text-slate-900' },
    { label: 'Audit Readiness', value: '100%', sub: 'ISO 9001 / 14001 / 45001', status: 'text-emerald-600' },
    { label: 'System Architecture', value: 'Zero Server Cost', sub: 'Client Persistence / Fast I/O', status: 'text-indigo-600' }
  ]

  const categories = [
    {
      title: 'Management & ISO Frameworks',
      subtitle: 'Executive governance, statutory licenses, and international compliance verification',
      items: [
        {
          name: 'Executive HSE KPI Report',
          desc: 'Safety performance index, proactive leading indicators, and auto-generated board review printouts.',
          href: '/executive-report',
          tag: 'ISO 45001 / SMK3',
          badge: 'Executive',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
        },
        {
          name: 'Document Control Register',
          desc: 'Centralized master repository for SOPs, Work Instructions, form templates, and version matrices.',
          href: '/document-control',
          tag: 'ISO 9001',
          badge: 'Governance',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
          name: 'Hazardous Waste & Env Log',
          desc: 'Statutory balance sheet for toxic substances (B3), manifest verification, and 90-day storage clocks.',
          href: '/env-log',
          tag: 'ISO 14001',
          badge: 'Environmental',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
          name: 'License & Competency Tracker',
          desc: 'Interactive tracker for forklift SIO, safety officer SKP penunjukan, and third-party SILO certificates.',
          href: '/sio-silo',
          tag: 'Statutory Legal',
          badge: 'Compliance',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        }
      ]
    },
    {
      title: 'Technical Calculators & Structural Safety',
      subtitle: 'Deterministic engineering validation for warehousing structures and heavy lifting',
      items: [
        {
          name: 'Racking SWL Calculator',
          desc: 'Validated safe working load checks, L/200 beam deflection compliance, and EN 15512 safety factors.',
          href: '/racking-swl',
          tag: 'Warehouse Tech',
          badge: 'Engineering',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        },
        {
          name: 'Scaffolding BoQ & Erection',
          desc: 'Bill of quantities estimator for tubular structures paired with strict Green/Red tag inspection gates.',
          href: '/scaffolding',
          tag: 'Work at Height',
          badge: 'Safety Calc',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
        },
        {
          name: 'Rigging & Lifting Plan',
          desc: 'Tension calculations across varying sling angles, crane utilization load percentages, and derating metrics.',
          href: '/lifting-plan',
          tag: 'Heavy Lifting',
          badge: 'Critical Lift',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
        },
        {
          name: 'Job Safety Analysis (JSA)',
          desc: '5x5 risk evaluation matrix coupled with hierarchical hazard controls and dynamic permits.',
          href: '/jsa',
          tag: 'Risk Mitigation',
          badge: 'Operational',
          badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
        }
      ]
    },
    {
      title: 'Field Operations & Workforce Protection',
      subtitle: 'Daily site verifications, instant isolation tagging, and continuous safety culture coaching',
      items: [
        {
          name: 'Forklift Pre-Op Checklist',
          desc: 'Shift-by-shift mechanical, hydraulic, and safety device inspections preventing forklift incidents.',
          href: '/forklift-inspection',
          tag: 'MHE Operations',
          badge: 'Daily Inspection',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
        },
        {
          name: 'LOTO Permit & Danger Tag',
          desc: 'Hazardous zero-energy isolation workflows with printable red quarantine lockout warnings.',
          href: '/loto',
          tag: 'Energy Isolation',
          badge: 'Life-Saving',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
        },
        {
          name: 'Hazard & Near-Miss Hunting',
          desc: 'On-site reporting mechanism capturing unsafe conditions/acts with closed-loop corrective action tracking.',
          href: '/hazard-report',
          tag: 'Proactive Safety',
          badge: 'Incident Prev.',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        {
          name: 'Toolbox Meeting (Safety Talk)',
          desc: 'Curated library of 5-minute pre-work safety modules with digital sign-off and attendance logs.',
          href: '/safety-talk',
          tag: 'Safety Culture',
          badge: 'Briefing Hub',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
          name: 'HSE Induction & Badge ID',
          desc: 'Structured safety onboarding system generating verified QR/ID permits for visitors and contractors.',
          href: '/induction',
          tag: 'Access Control',
          badge: 'Gate Pass',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
          name: 'HSE AI Copilot',
          desc: 'Context-aware intelligence providing instant guidance on Kemenaker regulations, OSHA, and ISO standards.',
          href: '/ai-assistant',
          tag: 'Artificial Intelligence',
          badge: 'AI Advisor',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
        }
      ]
    }
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-16">
      
      {/* ========================================================= */}
      {/* 1. HERO BANNER SECTION (ELEGANT & SHOWCASE-READY) */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 rounded-3xl border border-slate-800 text-white p-7 sm:p-10 shadow-xl">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5">
          
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-[10px] font-black uppercase tracking-widest border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Live Production System
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-[10px] font-bold tracking-wider border border-slate-700">
              ISO 9001 • ISO 14001 • ISO 45001 • SMK3
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-teal-400 text-[10px] font-black uppercase tracking-wider border border-slate-700">
              PT. Syspex Kemasindo
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Integrated HSE Management <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-teal-200 to-cyan-400">
                & Engineering Operations Hub
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl pt-1">
              An enterprise-grade operational ecosystem engineered to streamline structural safety calculations, field hazard mitigation, statutory equipment licenses, and C-Suite executive reporting.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/executive-report"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <span>📊</span> Launch Board KPI Dashboard
            </Link>
            <Link
              href="/ai-assistant"
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400"></span> Consult HSE AI Copilot
            </Link>
            <Link
              href="/sio-silo"
              className="px-4 py-2.5 bg-transparent hover:bg-white/5 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Review License Registry →
            </Link>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. OPERATIONAL INTEGRITY KPI CARDS (LOOKS PROFESSIONAL) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((met, idx) => (
          <div 
            key={idx} 
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-colors"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{met.label}</p>
              <p className={`text-2xl sm:text-3xl font-black mt-1.5 tracking-tight ${met.status}`}>{met.value}</p>
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <span className="text-teal-600">✓</span> {met.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 3. CORE ARCHITECTURE PILLARS (VALUE PROPOSITION) */}
      {/* ========================================================= */}
      <div className="bg-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <span className="text-base">🛡️</span>
              <span>Statutory & Audit Ready</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Standardized in accordance with Indonesian Occupational Safety Regulations (Kemenaker) and ISO management frameworks.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <span className="text-base">⚡</span>
              <span>Deterministic Calculations</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Eliminates human estimation in racking weight limits, crane sling rigging tension, and scaffolding components BoQ.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <span className="text-base">📋</span>
              <span>Field Verification & Governance</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Empowers warehouse and site operations with instant digital checklists, quarantine tags, and automated board summaries.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. SYSTEM MODULES DIRECTORY (CATEGORIES & CARDS) */}
      {/* ========================================================= */}
      <div className="space-y-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-3.5">
            
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-2.5 gap-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{cat.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{cat.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition leading-snug">
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-600 group-hover:text-teal-700">
                    <span>Access Tool</span>
                    <span className="transform group-hover:translate-x-1 transition font-bold">→</span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
