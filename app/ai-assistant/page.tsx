"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export default function HSECopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Halo! Saya HSE Copilot Syspex Kemasindo. Saya siap membantu Anda menganalisis bahaya kerja (HIRADC), menyusun draf JSA, atau mencari rujukan standar Kemenaker & ISO 45001/14001/9001. Apa yang ingin Anda diskusikan hari ini?',
      timestamp: '08:00'
    }
  ])

  const [inputPrompt, setInputPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    {
      title: 'Draf JSA Instalasi Racking',
      prompt: 'Buatkan urutan langkah kerja, potensi bahaya, dan mitigasi risiko untuk pemasangan balok racking ASRS di ketinggian 6 meter.'
    },
    {
      title: 'Rujukan Permenaker Forklift',
      prompt: 'Sebutkan persyaratan kelaikan operasi (SILO) dan lisensi operator (SIO) Forklift sesuai Permenaker No. 8 Tahun 2020.'
    },
    {
      title: 'Investigasi Insiden (5-Why)',
      prompt: 'Bantu lakukan analisis 5-Why untuk kejadian palet karton miring dan hampir menimpa checker di loading dock.'
    },
    {
      title: 'Prosedur LOTO Mesin Wrapping',
      prompt: 'Jelaskan 6 langkah baku penguncian energi (LOTO) sebelum teknisi melakukan penggantian gearbox mesin stretch wrapper.'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt
    if (!query.trim()) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: query,
      timestamp: timeStr
    }

    setMessages(prev => [...prev, userMsg])
    setInputPrompt('')
    setIsTyping(true)

    // Simulasi respons AI cerdas K3 Syspex
    setTimeout(() => {
      let aiReply = 'Permintaan Anda telah dianalisis berdasarkan regulasi SMK3 dan ISO 45001 Syspex Kemasindo.'

      if (query.toLowerCase().includes('racking') || query.toLowerCase().includes('ketinggian')) {
        aiReply = `Berikut rekomendasi mitigasi pekerjaan Racking di Ketinggian:\n\n1. Eliminasi / Substitusi: Pastikan area bawah lorong (drop zone) dikosongkan dan dipasang safety line barikade radius 3 meter.\n2. Rekayasa Teknis: Gunakan Scaffolding ber-tag HIJAU yang telah diinspeksi atau Scissor Lift resmi.\n3. Administrasi: Wajib verifikasi Tensi/Tekanan Darah & surat Fit-to-Work bebas vertigo sebelum bekerja.\n4. APD Wajib: Full Body Harness dengan Double Lanyard (100% tie-off) terkait di atas bahu, Safety Helmet dengan chinstrap.`
      } else if (query.toLowerCase().includes('forklift') || query.toLowerCase().includes('silo') || query.toLowerCase().includes('permenaker')) {
        aiReply = `Rujukan Regulasi Forklift (Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut):\n\n1. SIO Operator: Operator wajib memiliki lisensi K3 Kemenaker yang masih berlaku (perpanjangan tiap 5 tahun).\n2. SILO Unit: Forklift wajib dilakukan riksa uji berkala oleh PJK3 setiap 1 tahun sekali untuk penerbitan surat keterangan layak K3.\n3. Kecepatan Operasi: Maksimum 10 km/jam di dalam warehouse dan 5 km/jam di tikungan lorong sempit.`
      } else if (query.toLowerCase().includes('loto') || query.toLowerCase().includes('wrapping')) {
        aiReply = `6 Langkah Baku Prosedur LOTO Mesin Syspex:\n\n1. Pemberitahuan: Informasikan kepada seluruh operator shift bahwa mesin akan diisolasi.\n2. Pemadaman: Matikan mesin melalui sakelar kontrol normal.\n3. Isolasi Sumber Energi: Putuskan circuit breaker utama dan lepaskan suplai angin pneumatik.\n4. Pemasangan Gembok (Lockout) & Tag (Tagout): Pasang personal padlock dan Danger Tag bertuliskan nama teknisi.\n5. Pelepasan Sisa Energi: Kuras tekanan kompresor dan pastikan rantai tidak dalam posisi tegang.\n6. Verifikasi Nol Energi: Coba hidupkan mesin untuk memastikan daya benar-benar nol sebelum perbaikan dimulai.`
      } else {
        aiReply = `Analisis Keselamatan Kerja:\nUntuk pekerjaan tersebut, pastikan Job Safety Analysis (JSA) telah ditandatangani sebelum pekerjaan dimulai. Pastikan seluruh pekerja menggunakan APD standar industri Syspex (Helm Chinstrap, Sepatu Safety Steel Toe, Rompi Reflektif) dan area kerja bebas dari ceceran oli bekas (ISO 14001).`
      }

      const assistantMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 900)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* Header Web */}
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Smart Assistant</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              HSE AI Copilot
              <span className="text-[10px] bg-slate-900 text-white font-black px-2 py-0.5 rounded-full uppercase">ISO & K3 AI</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Konsultasi regulasi Kemenaker, analisis mitigasi bahaya, dan pembuatan draf JSA otomatis.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Quick Prompts & Knowledge Base Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Prompt Cepat Lapangan</h2>
            <p className="text-[11px] text-slate-500">Klik salah satu skenario untuk langsung meminta rekomendasi teknis:</p>
            
            <div className="space-y-2 pt-1">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition group"
                >
                  <p className="text-xs font-black text-slate-900 group-hover:text-black flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-slate-400 group-hover:translate-x-0.5 transition">→</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Rujukan Standar Terintegrasi</p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p>✓ Permenaker No. 8/2020 (MHE & Forklift)</p>
              <p>✓ Permenaker No. 9/2016 (Bekerja di Ketinggian)</p>
              <p>✓ ISO 45001:2018 (Sistem Manajemen K3)</p>
              <p>✓ ISO 14001:2015 (Pengelolaan Limbah B3)</p>
              <p>✓ SMK3 PP No. 50 Tahun 2012</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Chat Interface */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                AI
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Syspex HSE Assistant</p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Ready
                </p>
              </div>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition uppercase"
            >
              Reset Chat
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-slate-100 rounded-xl w-24 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Tanyakan analisis bahaya, pasal regulasi, atau draf mitigasi..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-900"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-sm"
              >
                Kirim
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  )
}
