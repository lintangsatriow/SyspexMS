'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

interface InspectionRecord {
  id: string;
  area_name: string;
  inspector_name: string;
  hazard_detail: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  action_plan: string;
  pic_name: string;
  due_date: string;
  status: 'Open' | 'In Progress' | 'Closed';
  created_at: string;
}

export default function InspectionPage() {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [areaName, setAreaName] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [hazardDetail, setHazardDetail] = useState('');
  const [riskLevel, setRiskLevel] = useState<
    'Low' | 'Medium' | 'High' | 'Critical'
  >('Medium');
  const [actionPlan, setActionPlan] = useState('');
  const [picName, setPicName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('safety_inspections')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setInspections(data as InspectionRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('safety_inspections').insert([
      {
        area_name: areaName,
        inspector_name: inspectorName,
        hazard_detail: hazardDetail,
        risk_level: riskLevel,
        action_plan: actionPlan,
        pic_name: picName,
        due_date: dueDate || null,
        status: 'Open',
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setAreaName('');
      setInspectorName('');
      setHazardDetail('');
      setActionPlan('');
      setPicName('');
      setDueDate('');
      fetchInspections();
    } else {
      alert('Gagal menyimpan hasil inspeksi: ' + error.message);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: 'Open' | 'In Progress' | 'Closed'
  ) => {
    const { error } = await supabase
      .from('safety_inspections')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setInspections((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      alert('Gagal memperbarui status: ' + error.message);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-2">
          🔍 Field Hazard Observation & Walkthrough
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Safety Walk & Audit Lapangan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pencatatan temuan observasi patroli K3, penentuan tingkat risiko, dan
          penetapan tindakan korektif (CAPA).
        </p>
      </div>

      {/* Form Input Inspeksi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📝</span> Form Catatan Temuan Patroli K3
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Area / Lokasi Patroli <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Workshop Fabrikasi A"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Pengawas / Auditor <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Satrio (HSE Officer)"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Tingkat Risiko Bahaya <span className="text-red-500">*</span>
            </label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none bg-white focus:border-teal-500 transition"
            >
              <option value="Low">Low (Risiko Rendah / Minor)</option>
              <option value="Medium">Medium (Risiko Sedang)</option>
              <option value="High">High (Risiko Tinggi)</option>
              <option value="Critical">
                Critical (Hentikan Pekerjaan Segera)
              </option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Deskripsi Temuan / Kondisi Bahaya{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan detail ketidaksesuaian, posisi alat/pekerja, atau pelanggaran prosedur yang diamati..."
              value={hazardDetail}
              onChange={(e) => setHazardDetail(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none resize-none focus:border-teal-500 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Tindakan Korektif yang Diperlukan (CAPA){' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Pemasangan safety barrier & penggantian kabel gerinda yang terkelupas"
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              PIC Penanggung Jawab <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Spv. Maintenance (Budi)"
              value={picName}
              onChange={(e) => setPicName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Tenggat Waktu Penyelesaian (Due Date)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition active:scale-95"
            >
              {submitting ? 'Menyimpan Temuan...' : 'Catat Temuan Safety Walk'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Log Temuan Inspeksi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Observasi & Status Perbaikan (CAPA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau penyelesaian tindak lanjut oleh PIC terkait.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {inspections.filter((i) => i.status !== 'Closed').length} Temuan
            Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <th className="p-4">Area & Pengawas</th>
                <th className="p-4">Risiko</th>
                <th className="p-4">Deskripsi Temuan</th>
                <th className="p-4">Rencana Tindakan (CAPA)</th>
                <th className="p-4">PIC & Target</th>
                <th className="p-4">Status & Kontrol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Memuat log inspeksi...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada temuan safety walk yang dicatat.
                  </td>
                </tr>
              ) : (
                inspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">
                        {item.area_name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.inspector_name}
                      </p>
                    </td>
                    <td className="p-4">{getRiskBadge(item.risk_level)}</td>
                    <td
                      className="p-4 text-slate-600 max-w-xs truncate"
                      title={item.hazard_detail}
                    >
                      {item.hazard_detail}
                    </td>
                    <td
                      className="p-4 text-slate-600 max-w-xs truncate"
                      title={item.action_plan}
                    >
                      {item.action_plan}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">
                        {item.pic_name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.due_date
                          ? `Deadline: ${item.due_date}`
                          : 'Tanpa deadline'}
                      </p>
                    </td>
                    <td className="p-4">
                      <select
                        value={item.status || 'Open'}
                        onChange={(e) =>
                          updateStatus(item.id, e.target.value as any)
                        }
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition ${
                          item.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Open">🟡 Open</option>
                        <option value="In Progress">🔵 In Progress</option>
                        <option value="Closed">🟢 Closed (Selesai)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
