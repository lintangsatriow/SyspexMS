"use client"

import { useState } from 'react'
import Link from 'next/link'

interface DocumentItem {
  id: string
  docNumber: string
  titleEn: string
  titleId: string
  category: 'Policy' | 'SOP' | 'Form' | 'Manual'
  isoClause: string
  version: string
  effectiveDate: string
  status: 'Active' | 'Under Review' | 'Obsolete'
  owner: string
}

export default function DocumentControlPage() {
  const [documents] = useState<DocumentItem[]>([
    {
      id: 'DOC-01',
      docNumber: 'POL-HSE-001',
      titleEn: 'HSE & Quality Integrated Policy',
      titleId: 'Kebijakan Terintegrasi K3 & Mutu',
      category: 'Policy',
      isoClause: 'ISO 45001: 5.2 / SMK3: 1.1',
      version: 'Rev. 02',
      effectiveDate: '2025-01-10',
      status: 'Active',
      owner: 'Director'
    },
    {
      id: 'DOC-02',
      docNumber: 'SOP-HSE-014',
      titleEn: 'Permit to Work (PTW) Procedure',
      titleId: 'Prosedur Izin Kerja Berbahaya',
      category: 'SOP',
      isoClause: 'ISO 45001: 8.1.2',
      version: 'Rev. 04',
      effectiveDate: '2026-03-15',
      status: 'Active',
      owner: 'HSE Manager'
    },
    {
      id: 'DOC-03',
      docNumber: 'SOP-ENV-001',
      titleEn: 'Hazardous Waste (B3) Handling',
      titleId: 'Penanganan Limbah B3',
      category: 'SOP',
      isoClause: 'ISO 14001: 8.1',
      version: 'Rev. 01',
      effectiveDate: '2026-10-20',
      status: 'Under Review',
      owner: 'HSE Manager'
    },
    {
      id: 'DOC-04',
      docNumber: 'FRM-HSE-022',
      titleEn: 'Daily Forklift Inspection Form',
      titleId: 'Formulir Inspeksi Harian Forklift',
      category: 'Form',
      isoClause: 'ISO 9001: 7.1.3',
      version: 'Rev. 03',
      effectiveDate: '2024-05-11',
      status: 'Active',
      owner: 'Logistics Spv'
    },
    {
      id: 'DOC-05',
      docNumber: 'SOP-HSE-005',
      titleEn: 'Manual Scaffolding Erection',
      titleId: 'Panduan Pemasangan Perancah',
      category: 'Manual',
      isoClause: 'SMK3: 6.1.1',
      version: 'Rev. 01',
      effectiveDate: '2021-02-14',
      status: 'Obsolete',
      owner: 'Engineering Spv'
    }
  ])

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header (Bilingual) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-300 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900 transition">Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Master Document Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
            <span className="block text-slate-500">EN: Centralized repository for ISO 9001, 14001, 45001, and SMK3 documented information (Clause 7.5).</span>
            <span className="block mt-0.5">ID: Pusat pengendalian informasi terdokumentasi untuk kepatuhan audit ISO dan SMK3 (Klausul 7.5).</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm">
            + Upload Document
          </button>
        </div>
      </div>

      {/* Stats / Ringkasan (Bilingual) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Documents</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{documents.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active (Berlaku)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {documents.filter(d => d.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Review (Revisi)</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {documents.filter(d => d.status === 'Under Review').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Obsolete (Usang)</p>
          <p className="text-2xl font-black text-red-500 mt-1">
            {documents.filter(d => d.status === 'Obsolete').length}
          </p>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-bold">Doc Number / Reference</th>
                <th className="py-3 px-4 font-bold">Document Title (EN / ID)</th>
                <th className="py-3 px-4 font-bold text-center">Ver.</th>
                <th className="py-3 px-4 font-bold">ISO/SMK3 Clause</th>
                <th className="py-3 px-4 font-bold">Effective Date</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id} className={`hover:bg-slate-50 transition ${doc.status === 'Obsolete' ? 'opacity-50 bg-slate-50/50' : ''}`}>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{doc.docNumber}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">{doc.category}</span>
                  </td>
                  <td className="py-3 px-4 max-w-[250px]">
                    <span className="font-bold text-slate-900 block truncate" title={doc.titleEn}>{doc.titleEn}</span>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5" title={doc.titleId}>{doc.titleId}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{doc.version}</td>
                  <td className="py-3 px-4 font-mono text-[10px] font-bold text-slate-600">
                    {doc.isoClause}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{doc.effectiveDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase inline-block ${
                      doc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition">
                      VIEW / DOWNLOAD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
