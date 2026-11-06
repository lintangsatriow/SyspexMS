'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

interface Incident {
  id: string;
  category: string;
  incident_date: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
}

interface PTW {
  id: string;
  permit_type: string;
  applicant_name: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

export default function InternalDashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [ptwList, setPtwList] = useState<PTW[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);

    // Tarik data laporan insiden
    const { data: incidentData } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (incidentData) setIncidents(incidentData);

    // Tarik data permit to work
    const { data: ptwData } = await supabase
      .from('ptw_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (ptwData) setPtwList(ptwData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateIncidentStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('incident_reports')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      alert('Gagal mengubah status insiden: ' + error.message);
    }
  };

  const updatePtwStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('ptw_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setPtwList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      alert('Gagal mengubah status PTW: ' + error.message);
    }
  };

  const exportToCSV = () => {
    if (incidents.length === 0) return alert('Belum ada data untuk diunduh.');

    const headers = [
      'ID',
      'Kategori',
      'Tanggal & Waktu',
      'Lokasi',
      'Deskripsi',
      'Status',
    ];
    const rows = incidents.map((item) => [
      `"${item.id}"`,
      `"${item.category}"`,
      `"${new Date(item.incident_date).toLocaleString('id-ID')}"`,
      `"${item.location.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.status || 'Open'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Insiden_Internal_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredIncidents =
    filterCategory === 'ALL'
      ? incidents
      : incidents.filter((i) => i.category === filterCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Dashboard Internal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2">
            🔒 Workspace Internal Pribadi
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pusat pemantauan insiden tapak kerja, otorisasi izin PTW berisiko
            tinggi, dan kontrol operasional.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm transition active:scale-95"
          >
            <span>📥</span> Unduh CSV
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-emerald-600/20 transition active:scale-95"
          >
            <span>🔄</span> Sinkronisasi Data
          </button>
        </div>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Temuan
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-sm">
              📁
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">
            {incidents.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Akumulasi insiden & nearmiss
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Temuan Open
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-sm">
              ⚠️
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-3">
            {incidents.filter((i) => (i.status || 'Open') === 'Open').length}
          </p>
          <p className="text-xs text-amber-600/80 mt-1 font-medium">
            Perlu tindakan korektif
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              PTW Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 text-sm">
              ⏳
            </div>
          </div>
          <p className="text-3xl font-black text-rose-600 mt-3">
            {
              ptwList.filter(
                (p) => (p.status || 'Pending Review') === 'Pending Review'
              ).length
            }
          </p>
          <p className="text-xs text-rose-600/80 mt-1 font-medium">
            Menunggu persetujuan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              PTW Berjalan
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm">
              🛡️
            </div>
          </div>
          <p className="text-3xl font-black text-blue-600 mt-3">
            {ptwList.filter((p) => p.status === 'Approved').length}
          </p>
          <p className="text-xs text-blue-600/80 mt-1 font-medium">
            Pekerjaan berisiko aktif
          </p>
        </div>
      </div>

      {/* Bagian 1: Kontrol Permit to Work (PTW) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>⚡</span> Kontrol Izin Kerja (Permit to Work)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Otorisasi langsung izin kerja panas, ketinggian, dan ruang
              terbatas.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {ptwList.length} Izin Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <th className="p-4">Jenis Izin</th>
                <th className="p-4">Pemohon</th>
                <th className="p-4">Lokasi Lapangan</th>
                <th className="p-4">Jadwal Jam Kerja</th>
                <th className="p-4">Status & Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Memuat data izin kerja...
                  </td>
                </tr>
              ) : ptwList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada pengajuan izin kerja.
                  </td>
                </tr>
              ) : (
                ptwList.slice(0, 5).map((ptw) => (
                  <tr key={ptw.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-semibold text-slate-900">
                      {ptw.permit_type}
                    </td>
                    <td className="p-4 text-slate-600">{ptw.applicant_name}</td>
                    <td className="p-4 text-slate-600">{ptw.location}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(ptw.start_time).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      •{' '}
                      {new Date(ptw.start_time).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(ptw.end_time).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <select
                        value={ptw.status || 'Pending Review'}
                        onChange={(e) =>
                          updatePtwStatus(ptw.id, e.target.value)
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer shadow-sm transition ${
                          ptw.status === 'Approved'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : ptw.status === 'Closed'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <option value="Pending Review">
                          🟡 Pending Review
                        </option>
                        <option value="Approved">
                          🔵 Approved (Diizinkan)
                        </option>
                        <option value="Closed">⚪ Closed (Selesai)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian 2: Log Pelaporan Insiden & Bahaya */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Insiden & Temuan Lapangan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan kasus bahaya dan status penyelesaian perbaikan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Filter Kategori:
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-1.5 bg-white shadow-sm outline-none cursor-pointer text-slate-700 hover:border-slate-300"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Unsafe Condition">Unsafe Condition</option>
              <option value="Unsafe Action">Unsafe Action</option>
              <option value="Nearmiss">Nearmiss</option>
              <option value="First Aid">First Aid</option>
              <option value="LTI">LTI</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <th className="p-4">Kategori Bahaya</th>
                <th className="p-4">Waktu Lapor</th>
                <th className="p-4">Lokasi Kejadian</th>
                <th className="p-4">Detail Kronologi</th>
                <th className="p-4">Status Temuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Memuat data temuan...
                  </td>
                </tr>
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Tidak ada laporan pada kategori yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80">
                        {incident.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(incident.incident_date).toLocaleString(
                        'id-ID',
                        { dateStyle: 'medium', timeStyle: 'short' }
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {incident.location}
                    </td>
                    <td
                      className="p-4 text-slate-600 max-w-sm truncate"
                      title={incident.description}
                    >
                      {incident.description}
                    </td>
                    <td className="p-4">
                      <select
                        value={incident.status || 'Open'}
                        onChange={(e) =>
                          updateIncidentStatus(incident.id, e.target.value)
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer shadow-sm transition ${
                          incident.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : incident.status === 'Investigation'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Open">🟡 Open (Aktif)</option>
                        <option value="Investigation">🔵 Investigasi</option>
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
