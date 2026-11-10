"use client"

import Link from 'next/link'

export default function HomePage() {
  const safetyRules = [
    { id: 1, title: 'Energy Isolation', icon: '🔌', desc: 'Verify zero-energy state (LOTO)' },
    { id: 2, title: 'Work at Height', icon: '🪜', desc: '100% tie-off & scaffolding check' },
    { id: 3, title: 'Safe Lifting', icon: '🏗️', desc: 'Never walk under suspended loads' },
    { id: 4, title: 'Mobile Equipment', icon: '🚜', desc: 'Keep distance from moving MHE' },
    { id: 5, title: 'Permit to Work', icon: '📋', desc: 'Valid JSA for high-risk tasks' },
    { id: 6, title: 'Fit to Work', icon: '⚕️', desc: 'Zero tolerance for drugs/fatigue' },
  ]

  const infiniteRules = [...safetyRules, ...safetyRules, ...safetyRules]

  return (
    <div className="w-full flex flex-col justify-between items-center text-center px-4 py-6 bg-slate-950 rounded-3xl relative shadow-2xl border border-slate-900">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />

      {/* Background Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center animate-in fade-in duration-700 zoom-in-95 pointer-events-auto">
        
        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] max-w-4xl">
          Engineering Precision. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Zero-Harm Governance.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl mt-3 leading-relaxed">
          An integrated workplace governance platform bridging statutory safety compliance, structural calculation integrity, and real-time executive visibility.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5 relative z-30">
          <Link
            href="/executive-report"
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
          >
            Launch KPI Dashboard
          </Link>
          <Link
            href="/ai-assistant"
            className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition border border-slate-700 backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-teal-500"></span> Consult AI Copilot
          </Link>
        </div>

        {/* Syspex Safety Rules Section */}
        <div className="mt-8 w-full relative z-30">
          <div className="text-center mb-2">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">Syspex Safety Rules</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Our non-negotiable standards for a safe workplace</p>
          </div>

          <div className="w-full overflow-hidden mask-edges py-2">
            <div className="animate-scroll flex gap-3 items-center">
              {infiniteRules.map((rule, idx) => (
                <Link
                  key={`${rule.id}-${idx}`}
                  href="/life-saving-rules" 
                  className="group relative w-56 flex-shrink-0 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-800 hover:border-teal-500/50 p-3 rounded-2xl transition-all duration-300 text-left flex flex-col gap-2 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xl">{rule.icon}</span>
                    <span className="text-[9px] font-black text-slate-500 group-hover:text-teal-400 transition-colors uppercase tracking-wider border border-slate-700 group-hover:border-teal-500/30 px-1.5 py-0.5 rounded">
                      Rule 0{rule.id}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{rule.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium line-clamp-2">{rule.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
