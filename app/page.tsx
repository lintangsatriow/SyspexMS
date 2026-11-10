"use client"

import Link from 'next/link'

export default function HomePage() {
  const safetyRules = [
    { 
      id: 1, 
      title: 'Energy Isolation', 
      desc: 'Verify zero-energy state (LOTO)',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    },
    { 
      id: 2, 
      title: 'Work at Height', 
      desc: '100% tie-off & scaffolding check',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    },
    { 
      id: 3, 
      title: 'Safe Lifting', 
      desc: 'Never walk under suspended loads',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    },
    { 
      id: 4, 
      title: 'Mobile Equipment', 
      desc: 'Keep distance from moving MHE',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-2" />
    },
    { 
      id: 5, 
      title: 'Permit to Work', 
      desc: 'Valid JSA for high-risk tasks',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    { 
      id: 6, 
      title: 'Fit to Work', 
      desc: 'Zero tolerance for drugs/fatigue',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    },
  ]

  const infiniteRules = [...safetyRules, ...safetyRules, ...safetyRules]

  return (
    <div className="w-full h-full lg:h-[calc(100vh-2rem)] flex flex-col justify-between items-center text-center px-6 py-8 bg-slate-900/60 rounded-3xl relative shadow-2xl border border-slate-800/80 backdrop-blur-md">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 28s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />

      {/* Ambient Lights */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-teal-900/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-900/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* TOP CONTENT: Hero Section */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto pt-6">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
          Engineering Precision. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500">
            Zero-Harm Governance.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl mt-5 leading-relaxed">
          Integrated workplace governance. Bridging statutory compliance, structural integrity, and executive visibility.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 relative z-30">
          <Link
            href="/executive-report"
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            KPI Dashboard
          </Link>
          <Link
            href="/ai-assistant"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition border border-slate-700 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> AI Copilot
          </Link>
        </div>
      </div>

      {/* BOTTOM CONTENT: Marquee Section */}
      <div className="w-full relative z-30 mt-auto pt-8">
        <div className="text-center mb-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syspex Safety Rules</h2>
        </div>

        <div className="w-full overflow-hidden mask-edges py-1">
          <div className="animate-scroll flex gap-3 items-center">
            {infiniteRules.map((rule, idx) => (
              <Link
                key={`${rule.id}-${idx}`}
                href="/syspex-safety-rules" 
                className="group relative w-64 flex-shrink-0 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 p-4 rounded-xl transition-all duration-300 text-left flex flex-col gap-3 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {rule.icon}
                    </svg>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 group-hover:text-teal-400 transition-colors uppercase tracking-wider border border-slate-800 group-hover:border-teal-500/30 px-1.5 py-0.5 rounded">
                    Rule 0{rule.id}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{rule.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium line-clamp-1">{rule.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
