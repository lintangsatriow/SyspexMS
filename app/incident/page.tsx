'use client';

import { useState } from 'react';
import { supabase } from '../../supabase';

export default function IncidentPage() {
  const [category, setCategory] = useState('Unsafe Condition');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    const { error } = await supabase.from('incident_reports').insert([
      {
        category,
        location,
        description,
        incident_date: new Date().toISOString(),
        status: 'Open',
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setSuccess(true);
      setLocation('');
      setDescription('');
    } else {
      alert('Gagal mengirim laporan: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Form Pelaporan Insiden & Bahaya
        </h1>
        <p className="text-slate-500 mt-1">
          Laporkan kondisi tidak aman, nearmiss, atau kecelakaan kerja secara
          langsung.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center justify-between">
            <span>✅ Laporan berhasil tersimpan ke sistem database!</span>
            <button
              onClick={() => setSuccess(false)}
              className="text-emerald-700 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Kategori Temuan <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none bg-white"
            >
              <option value="Unsafe Condition">
                Unsafe Condition (Kondisi Tidak Aman)
              </option>
              <option value="Unsafe Action">
                Unsafe Action (Tindakan Tidak Aman)
              </option>
              <option value="Nearmiss">Nearmiss (Hampir Celaka)</option>
              <option value="First Aid">First Aid (Pertolongan Pertama)</option>
              <option value="LTI">LTI (Lost Time Injury)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Lokasi Kerja <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Area Gudang Pallet B"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Kronologi / Deskripsi Kejadian{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan detail bahaya atau kejadian yang Anda temukan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {submitting ? 'Mengirim Laporan...' : 'Kirim Laporan K3'}
          </button>
        </form>
      </div>
    </div>
  );
}
