"use client"

import Link from 'next/link'

export default function HomePage() {
  const categories = [
    {
      title: 'Management & ISO Systems',
      subtitle: 'Regulatory compliance governance, quality audits, and executive reporting',
      color: 'teal',
      items: [
        {
          name: 'Executive HSE KPI Report',
          desc: 'Safety health index, Zero Harm record, and board-ready executive summaries.',
          href: '/executive-report',
          tag: 'ISO 45001 / SMK3',
          badge: 'Executive',
          badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-200'
        },
        {
          name: 'Document Control Register',
          desc: 'Standard operating procedures (SOP), work instructions, and revision logs.',
          href: '/document-control',
          tag: 'ISO 9001',
          badge: 'Governance',
          badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
        },
        {
          name: 'Hazardous Waste & Env Log',
          desc: 'B3 hazardous waste balance sheet, manifests, and 90-day storage limits.',
          href: '/env-log',
          tag: 'ISO 14001',
          badge: 'Environment',
          badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
        },
        {
          name: 'License & Competency Tracker',
          desc: 'Monitoring forklift SIO licenses, safety officer SKP, and equipment SILO validity.',
          href: '/sio-silo',
          tag: 'Statutory Legal',
          badge: 'Statutory',
          badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200'
        }
      ]
    },
    {
      title: 'Calculators & Engineering Tools',
      subtitle: 'Safe working load validation, scaffolding erection, and high-risk work permits',
      color: 'slate',
      items: [
        {
          name: 'Racking SWL Calculator',
          desc: 'Beam load capacities, L/200 deflection limits, and EN 15512 structural checks.',
          href: '/racking-swl',
          tag: 'Warehouse Tech',
          badge: 'Engineering',
          badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200'
        },
        {
          name: 'Scaffolding BoQ & Erection',
          desc: 'Tubular scaffolding bill of quantities and green/red inspection tagging.',
          href: '/scaffolding',
          tag: 'Work at Height',
          badge: 'Calculation',
          badgeColor: 'bg-slate-500/10 text-slate-700 border-slate-200'
        },
        {
          name: 'Rigging & Lifting Plan',
          desc: 'Crane/forklift load capacity, sling tension angles, and safety factor validation.',
          href: '/lifting-plan',
          tag: 'Heavy Lifting',
          badge: 'Critical Lift',
          badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-200'
        },
        {
          name: 'Job Safety Analysis (JSA)',
          desc: '5x5 risk evaluation matrix and hazard control work permit sheets.',
          href: '/jsa',
          tag: 'Risk Control',
          badge: 'Operational',
          badgeColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-200'
        }
      ]
    },
    {
      title: 'Field HSE & Safety Operations',
      subtitle: 'Daily site checklists, hazard observation, and workplace workforce safety talks',
      color: 'indigo',
      items: [
        {
          name: 'Forklift Pre-Op Checklist',
          desc: 'Daily MHE pre-shift checks, hydraulic/brake validation, and LOTO isolation.',
          href: '/forklift-inspection',
          tag: 'MHE Safety',
          badge: 'Daily Routine',
          badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-200'
        },
        {
          name: 'LOTO Permit & Danger Tag',
          desc: 'Equipment quarantine tagging and hazardous energy isolation procedures.',
          href: '/loto',
          tag: 'Isolation Tag',
          badge: 'Critical Safety',
          badgeColor: 'bg-red-500/10 text-red-700 border-red-200'
        },
        {
          name: 'Hazard & Near-Miss Hunting',
          desc: 'Proactive unsafe act/condition logging with corrective action (CAPA) tracking.',
          href: '/hazard-report',
          tag: 'Proactive HSE',
          badge: 'Field Hunting',
          badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200'
        },
        {
          name: 'Toolbox Meeting (Safety Talk)',
          desc: '5-minute morning safety briefing library, topics, and attendance records.',
          href: '/safety-talk',
          tag: 'Safety Culture',
          badge: 'Daily Briefing',
          badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
        },
        {
          name: 'HSE Induction & Badge ID',
          desc: 'Visitor and contractor orientation passes with printable induction ID cards.',
          href: '/induction',
          tag: 'Site Access',
          badge: 'Credential',
          badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
        },
        {
          name: 'HSE AI Copilot',
          desc: 'Intelligent advisor for statutory standards, ISO frameworks, and risk controls.',
          href: '/ai-assistant',
          tag: 'Smart Assistant',
          badge: 'AI Powered',
          badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200'
        }
      ]
    }
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-16">
      
      {/* Hero Banner Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-teal-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          OFFICIAL HSE OPERATIONS HUB
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Welcome to the Syspex Safety & Operations Center.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Your integrated workplace portal for daily safety inspections, engineering calculations, hazard mitigation, and ISO & SMK3 compliance across all Syspex operations.
        </p>
      </div>

      {/* Quick Launch Action Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
            Quick Executive Access
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">HSE KPI & Board Review Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Update monthly safety metrics, monitor cumulative Safe Man-Hours, and print official board executive reviews.
          </p>
        </div>
        <Link
          href="/executive-report"
          className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shrink-0 flex items-center gap-2"
        >
          Open KPI Dashboard
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
      </div>

      {/* Module Categories Grid */}
      <div className="space-y-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{cat.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{cat.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-600 group-hover:text-teal-700">
                    <span>Open Module</span>
                    <span className="transform group-hover:translate-x-1 transition">→</span>
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
