'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

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

export default function PTWPage() {
  const [ptwList, setPtwList] = useState<PTW[]>([]);
  const [permitType, setPermitType] = useState(
    'Hot Work (Pengelasan/Pemotongan)'
  );
  const [applicantName, setApplicantName] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPTW = async () => {
    const { data } = await supabase
      .from('ptw_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPtwList(data);
  };

  useEffect(() => {
    fetchPTW();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('ptw_requests').insert([
      {
        permit_type: permitType,
        applicant_name: applicantName,
        location: location,
        start_time: startTime,
        end_time: endTime,
        status: 'Pending Review',
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setApplicantName('');
      setLocation('');
      setStartTime('');
      setEndTime('');
      fetchPTW();
    } else {
      alert('Gagal membuat PTW: ' + error.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Permit to Work (PTW)
        </h1>
        <p className="text-slate-500 mt-1">
          Sistem otorisasi dan kontrol pekerjaan berisiko tinggi.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Pengajuan Izin Kerja Baru
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Jenis Pekerjaan <span className="text-red-500">*</span>
            </label>
            <select
              value={permitType}
              onChange={(e) => setPermitType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none bg-white"
            >
              <option value="Hot Work (Pengelasan/Pemotongan)">
                Hot Work (Pengelasan/Pemotongan)
              </option>
              <option value="Working at Height (Ketinggian)">
                Working at Height (Ketinggian)
              </option>
              <option value="Confined Space (Ruang Terbatas)">
                Confined Space (Ruang Terbatas)
              </option>
              <option value="LOTO / Electrical (Kelistrikan)">
                LOTO / Electrical (Kelistrikan)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Pemohon / Kontraktor <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Tim Maintenance / Vendor X"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Lokasi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Rooftop Gudang 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Mulai <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Selesai <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition"
            >
              {submitting ? 'Mengajukan...' : 'Ajukan Permit'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">
            Daftar Pengajuan Permit to Work
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            {ptwList.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                <th className="p-3.5">Jenis Pekerjaan</th>
                <th className="p-3.5">Pemohon</th>
                <th className="p-3.5">Lokasi</th>
                <th className="p-3.5">Waktu Kerja</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ptwList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Belum ada pengajuan izin kerja.
                  </td>
                </tr>
              ) : (
                ptwList.map((ptw) => (
                  <tr key={ptw.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-medium text-slate-800 text-xs">
                      {ptw.permit_type}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {ptw.applicant_name}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {ptw.location}
                    </td>
                    <td className="p-3.5 text-slate-500 text-xs">
                      {new Date(ptw.start_time).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}{' '}
                      s/d{' '}
                      {new Date(ptw.end_time).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${
                          ptw.status === 'Approved'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ptw.status === 'Closed'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ptw.status}
                      </span>
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
