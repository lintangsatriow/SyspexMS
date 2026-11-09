"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Data KPI HSE Keseluruhan (Metrik Global)
  const kpiData = {
    safeManHours: 342850,
    ltiFreeDays: 418,
    activePermits: 12,
    auditScore: 92,
    totalCapa: 24,
    closedCapa: 20
  }
  const capaRate = Math.round((kpiData.closedCapa / kpiData.totalCapa) * 100)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://teizyhspjjhwvnwrgmxj.supabase.co'
        // GANTI TEKS DI BAWAH INI DENGAN API KEY PANJANG ANDA
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaXp5aHNwampod3Zud3JnbXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTQ0ODIsImV4cCI6MjEwOTQzMDQ4Mn0.HgzYCrftZLyWELHjNFZyGJzLCH9DlYCKh5tRfOvlu_A'
        
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Hanya mengambil 5 laporan bahaya terbaru untuk widget dashboard
        const { data, error } = await supabase
          .from('hazard_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setReports(data || [])
      } catch (error: any) {
        setErrorMsg('Gagal memuat data Hazard Supabase: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link><span>/</span><span className="text-slate-800 font-bold">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">HSE Performance Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Tinjauan komprehensif metrik K3L dan log laporan bahaya real-time.</p>
