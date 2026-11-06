'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

interface VisitorRecord {
  id: string;
  full_name: string;
  company_name: string;
  purpose: string;
  host_person: string;
  induction_date: string;
  status: string;
}

export default function InductionPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [hostPerson, setHostPerson] = useState('');
  const [inductionDate, setInductionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);

  const fetchVisitors = async () => {
    const { data } = await supabase
      .from('visitor_inductions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setVisitors(data);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('visitor_inductions').insert([
      {
        full_name: fullName,
        company_name: companyName,
        purpose: purpose,
        host_person: hostPerson,
        induction_date: inductionDate,
        status: 'Active',
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setFullName('');
      setCompanyName('');
      setPurpose('');
      setHostPerson('');
      fetchVisitors();
    } else {
      alert('Gagal mencatat induksi: ' + error.message);
    }
  };

  const toggleCheckOut = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Checked Out' : 'Active';
    const { error } = await supabase
      .from('visitor_inductions')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setVisitors((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Safety Induction & Visitor Pass
        </h1>
        <p className="text-slate-500 mt-1">
          Registrasi pengenalan bahaya kerja dan pelacakan tamu/kontraktor di
          lokasi.
        </p>
      </div>

      {/* Form Pendaftaran Induksi */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Catat Induksi Tamu / Pekerja Baru
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Rian Pratama"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Asal Instansi / Vendor <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Syspex"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Keperluan Kunjungan <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Visit Warehouse"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              PIC / Pendamping Internal <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Satrio"
              value={hostPerson}
              onChange={(e) => setHostPerson(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              Materi induksi K3, APD wajib, dan jalur evakuasi telah dipaparkan.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition"
            >
              {submitting ? 'Menyimpan...' : 'Terbitkan Pas Masuk'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Log Induksi & Status Keluar-Masuk */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">
            Daftar Pengunjung Berizin Hari Ini
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            {visitors.filter((v) => v.status === 'Active').length} Berada di
            Area
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                <th className="p-3.5">Nama Tamu</th>
                <th className="p-3.5">Perusahaan</th>
                <th className="p-3.5">Keperluan</th>
                <th className="p-3.5">PIC Pendamping</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Aksi / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Belum ada kunjungan tercatat.
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-medium text-slate-800 text-xs">
                      {visitor.full_name}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {visitor.company_name}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {visitor.purpose}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {visitor.host_person}
                    </td>
                    <td className="p-3.5 text-slate-500 text-xs">
                      {visitor.induction_date}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() =>
                          toggleCheckOut(visitor.id, visitor.status)
                        }
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border transition ${
                          visitor.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {visitor.status === 'Active'
                          ? '🟢 Di Area (Klik Checkout)'
                          : '⚪ Sudah Keluar'}
                      </button>
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
