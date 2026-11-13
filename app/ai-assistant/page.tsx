"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface ChatMessage {
  id: string
  role: 'system' | 'user' | 'ai'
  content: string
  timestamp: string
}

export default function AiCopilotPage() {
  const { lang } = useLanguage()
  const [input, setInput] = useState('')
  
  // Terminal History State
  const [history, setHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'system', content: 'SYSPEX AI COPILOT INITIALIZED. KNOWLEDGE BASE: ISO 9001/45001, BS-1139.', timestamp: new Date().toLocaleTimeString() },
    { id: '2', role: 'ai', content: lang === 'ID' ? 'Sistem siap. Ketik perintah atau analisis yang Anda butuhkan (contoh: "Evaluasi JSA", "Cek aturan LOTO").' : 'System ready. Enter command or analysis request (e.g., "Evaluate JSA", "Check LOTO rules").', timestamp: new Date().toLocaleTimeString() }
  ])

  const dict = {
    ID: {
      breadcrumb: "Sistem Terintegrasi",
      title: "AI Copilot Terminal",
      subtitle: "Asisten analitik pintar untuk evaluasi dokumen K3L, audit kepatuhan, dan ekstraksi data regulasi.",
      
      placeholder: "Ketik perintah analitik di sini (Enter untuk mengirim)...",
      btn_send: "EKSEKUSI",
      stat_online: "SISTEM ONLINE",
      
      cmd_1: "Analisa Bahaya JSA",
      cmd_2: "Aturan BS-1139",
      cmd_3: "Audit LOTO"
    },
    EN: {
      breadcrumb: "Integrated Systems",
      title: "AI Copilot Terminal",
      subtitle: "Smart analytical assistant for HSE document evaluation, compliance auditing, and regulatory data extraction.",
      
      placeholder: "Enter analytical command here (Enter to send)...",
      btn_send: "EXECUTE",
      stat_online: "SYSTEM ONLINE",
      
      cmd_1: "JSA Hazard Analysis",
      cmd_2: "BS-1139 Rules",
      cmd_3: "LOTO Audit"
    }
  }

  const t = dict[lang]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setHistory([...history, newMsg])
    setInput('')
    
    // Simulate mechanical AI response
    setTimeout(() => {
      setHistory(prev => [...prev, {
        id: Math.random().toString(),
        role: 'ai',
        content: `[ACKNOWLEDGED] Analisis untuk "${newMsg.content}" sedang diproses... (Fungsi integrasi backend belum diaktifkan pada modul demo ini).`,
        timestamp: new Date().toLocaleTimeString()
      }])
    }, 1000)
  }

  const handlePreset = (cmd: string) => {
    setInput(cmd)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col print:hidden">
      
      {/* HEADER WEB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0 transition-colors">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">HUB</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">{t.breadcrumb}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-cyan-700 dark:text-cyan-500 tracking-tight uppercase transition-colors flex items-center gap-3">
              {t.title}
              <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-[2px]">
                <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-black text-emerald-800 dark:text-emerald-500 tracking-widest">{t.stat_online}</span>
              </span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* TERMINAL CHAT WINDOW */}
      <div className="flex-1 bg-white dark:bg-[#0b0f19] border-2 border-slate-200 dark:border-slate-800 rounded-[4px] flex flex-col overflow-hidden transition-colors shadow-sm">
        
        {/* LOG HISTORY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar font-mono text-xs">
          {history.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 mb-1">
                {msg.role === 'user' ? 'USER' : msg.role === 'system' ? 'SYSTEM' : 'COPILOT'} {'//'} {msg.timestamp}
              </span>
              <div className={`max-w-[85%] p-3 border-l-2 ${
                msg.role === 'user' 
                  ? 'bg-slate-100 dark:bg-slate-900 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100' 
                  : msg.role === 'system'
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-amber-800 dark:text-amber-500 font-bold'
                  : 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-600 dark:border-cyan-500 text-cyan-900 dark:text-cyan-100'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
          <div className="flex gap-2 mb-3">
            <button onClick={() => handlePreset(t.cmd_1)} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors rounded-[2px]">
              {t.cmd_1}
            </button>
            <button onClick={() => handlePreset(t.cmd_2)} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors rounded-[2px]">
              {t.cmd_2}
            </button>
            <button onClick={() => handlePreset(t.cmd_3)} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors rounded-[2px]">
              {t.cmd_3}
            </button>
          </div>
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 rounded-[2px] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="px-8 py-3 bg-cyan-700 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors rounded-[2px] shrink-0"
            >
              {t.btn_send}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
