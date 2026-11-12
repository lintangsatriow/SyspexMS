"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../LanguageContext'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export default function HSECopilotPage() {
  const { lang } = useLanguage()

  const dict = {
    ID: {
      breadcrumb: "Smart Assistant",
      title: "HSE AI Copilot",
      subtitle: "Konsultasi regulasi Kemenaker, analisis mitigasi bahaya, dan pembuatan draf JSA otomatis.",
      prompt_title: "Prompt Cepat",
      prompt_desc: "Klik salah satu skenario untuk rekomendasi instan:",
      ref_title: "Rujukan Terintegrasi",
      ai_name: "Syspex HSE Assistant",
      ai_status: "Active & Ready",
      btn_reset: "Reset Chat",
      input_placeholder: "Ketik regulasi, bahaya, atau mitigasi...",
      btn_send: "Kirim",
      intro_msg: "HSE Copilot siap. Ketik skenario bahaya, JSA, atau rujukan regulasi (ISO/Kemenaker) yang ingin dianalisis hari ini.",
      quick_prompts: [
        { title: 'Draf JSA Racking', prompt: 'Buatkan langkah kerja dan mitigasi pemasangan balok racking ASRS di ketinggian 6 meter.' },
        { title: 'Regulasi Forklift', prompt: 'Sebutkan syarat operasi (SILO) dan lisensi (SIO) Forklift (Permenaker No. 8/2020).' },
        { title: 'Investigasi 5-Why', prompt: 'Lakukan analisis 5-Why: palet karton hampir menimpa checker di loading dock.' },
        { title: 'Prosedur LOTO', prompt: 'Jelaskan prosedur baku LOTO sebelum penggantian gearbox mesin.' }
      ]
    },
    EN: {
      breadcrumb: "Smart Assistant",
      title: "HSE AI Copilot",
      subtitle: "Consult statutory regulations, analyze hazard mitigations, and auto-generate JSA drafts.",
      prompt_title: "Quick Prompts",
      prompt_desc: "Select a scenario below for instant technical recommendations:",
      ref_title: "Integrated References",
      ai_name: "Syspex HSE Assistant",
      ai_status: "Active & Ready",
      btn_reset: "Reset Chat",
      input_placeholder: "Type hazard, regulation, or mitigation...",
      btn_send: "Send",
      intro_msg: "HSE Copilot is online. Type a hazard scenario, JSA requirement, or regulation (ISO/Statutory) to analyze today.",
      quick_prompts: [
        { title: 'Racking JSA Draft', prompt: 'Provide work steps and mitigation for ASRS racking beam installation at 6m height.' },
        { title: 'Forklift Regulation', prompt: 'List operation (SILO) and license (SIO) requirements for Forklift.' },
        { title: '5-Why Investigation', prompt: 'Perform a 5-Why analysis: carton pallet almost hit a checker at the loading dock.' },
        { title: 'LOTO Procedure', prompt: 'Explain the standard LOTO procedure before a gearbox replacement.' }
      ]
    }
  }

  const t = dict[lang]

  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize intro message based on current language
  useEffect(() => {
    setMessages([
      {
        id: 'intro',
        sender: 'assistant',
        text: t.intro_msg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }, [lang, t.intro_msg])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt
    if (!query.trim()) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: query,
      timestamp: timeStr
    }

    setMessages(prev => [...prev, userMsg])
    setInputPrompt('')
    setIsTyping(true)

    setTimeout(() => {
      let aiReply = lang === 'ID' 
        ? 'Analisis berdasar SMK3 & ISO 45001:\nPastikan Job Safety Analysis (JSA) disetujui. Gunakan APD standar Syspex.'
        : 'Analysis based on ISO 45001:\nEnsure JSA is approved. Enforce standard Syspex PPE.'

      const queryLower = query.toLowerCase()

      if (queryLower.includes('racking') || queryLower.includes('ketinggian') || queryLower.includes('height')) {
        aiReply = lang === 'ID'
          ? "Mitigasi Pekerjaan Ketinggian:\n1. Barikade: Kosongkan drop zone (radius 3m).\n2. Akses: Scaffolding Tag Hijau / Scissor Lift.\n3. Medis: Cek Tensi & bebas vertigo.\n4. APD: Full Body Harness 100% tie-off, Helm Chinstrap."
          : "Work at Height Mitigation:\n1. Barricade: Clear drop zone (3m radius).\n2. Access: Green Tagged Scaffolding / Scissor Lift.\n3. Medical: BP Check & vertigo-free.\n4. PPE: Full Body Harness 100% tie-off, Helm with Chinstrap."
      } else if (queryLower.includes('forklift') || queryLower.includes('silo') || queryLower.includes('regulation')) {
        aiReply = lang === 'ID'
          ? "Regulasi Forklift (Permenaker 8/2020):\n1. SIO: Lisensi K3 operator valid (5 tahun).\n2. SILO: Riksa uji unit oleh PJK3 tahunan.\n3. Operasi: Maks 10 km/jam di warehouse."
          : "Forklift Regulation:\n1. License: Valid operator statutory license.\n2. Unit: Annual safety inspection certification.\n3. Speed: Max 10 km/h in warehouse."
      } else if (queryLower.includes('loto') || queryLower.includes('wrapping')) {
        aiReply = lang === 'ID'
          ? "Prosedur LOTO:\n1. Matikan mesin via kontrol.\n2. Putus circuit breaker & pneumatik.\n3. Pasang Personal Padlock & Danger Tag.\n4. Kuras sisa energi (angin/tekanan).\n5. Verifikasi: Tes hidupkan mesin."
          : "LOTO Procedure:\n1. Shut down via controls.\n2. Isolate breaker & pneumatic lines.\n3. Apply Personal Padlock & Danger Tag.\n4. Bleed residual energy/pressure.\n5. Verify: Attempt to start machine."
      } else if (queryLower.includes('why') || queryLower.includes('investigasi')) {
        aiReply = lang === 'ID'
          ? "5-Why Palet Miring:\n1. Mengapa miring? Wrapping plastik longgar.\n2. Mengapa longgar? Tensioner mesin kendor.\n3. Mengapa kendor? Belum dikalibrasi bulan ini.\n\nTindakan: Jadwalkan kalibrasi rutin tensioner."
          : "5-Why Tilted Pallet:\n1. Why tilted? Loose plastic wrapping.\n2. Why loose? Machine tensioner is slack.\n3. Why slack? Missed monthly calibration.\n\nAction: Schedule routine tensioner calibration."
      }

      const assistantMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* Header Web */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{t.title}</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white uppercase tracking-widest">
                ISO & K3 AI
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Quick Prompts & Knowledge Base */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.prompt_title}</h2>
            
            <div className="space-y-2 mt-4">
              {t.quick_prompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-slate-900 bg-slate-50 hover:bg-slate-100 transition group"
                >
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1 flex justify-between">
                    {item.title} <span className="text-slate-400 group-hover:text-slate-900 transition">→</span>
                  </p>
                  <p className="text-[10px] font-medium text-slate-600 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">{t.ref_title}</p>
            <div className="space-y-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              <p>• Permenaker No. 8/2020 (MHE)</p>
              <p>• Permenaker No. 9/2016 (WAH)</p>
              <p>• ISO 45001:2018 (Safety)</p>
              <p>• ISO 14001:2015 (Environment)</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Chat Interface */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-xl border border-slate-200 overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                AI
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">{t.ai_name}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-teal-600 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  {t.ai_status}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{ id: 'reset', sender: 'assistant', text: t.intro_msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])}
              className="text-[9px] font-black text-slate-400 hover:text-slate-900 transition uppercase tracking-widest border border-slate-200 hover:border-slate-400 px-2 py-1 rounded"
            >
              {t.btn_reset}
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-4 text-[11px] font-medium leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-xl rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-xl rounded-tl-sm border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-1.5 px-1 tracking-wider uppercase">
                  {msg.sender === 'user' ? 'You' : 'AI'} • {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-4 bg-slate-100 rounded-xl w-16 text-slate-500 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={t.input_placeholder}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded transition"
              >
                {t.btn_send}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
