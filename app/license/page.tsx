'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

interface LicenseItem {
  id: string;
  equipment_or_person: string;
  license_type: string;
  expired_date: string;
  created_at: string;
}

export default function LicensePage() {
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('SIO Operator Forklift');
  const [expiredDate, setExpiredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLicenses = async () => {
    const { data } = await supabase
      .from('hse_licenses')
      .select('*')
      .order('expired_date', { ascending: true });

    if (data) setLicenses(data);
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('hse_licenses').insert([
      {
        equipment_or_person: name,
        license_type: type,
        expired_date: expiredDate,
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setName('');
      setExpiredDate('');
      fetchLicenses();
    } else {
      alert('Gagal menambahkan lisensi: ' + error.message);
    }
  };

  const getStatusBadge = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-700 border border-red-200">
          Kedaluwarsa
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-700 border border-amber-200">
          Kritis ({diffDays} hari lagi)
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
          Aktif
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          License & Compliance Tracker
        </h1>
        <p className="text-slate-500 mt-1">
          Pantau kepatuhan SIO operator, sertifikasi personel K3, dan riksa-uji
          alat.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Tambah Data Lisensi / Riksa Uji
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Alat / Personel <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Forklift Toyota #02 / Joko Susilo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Jenis Lisensi / Pengujian <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: SIO Forklift / Surat Keterangan Riksa Uji"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Tanggal Kedaluwarsa <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Lisensi'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">
            Daftar Masa Berlaku Lisensi
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            {licenses.length} Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                <th className="p-3.5">Nama Alat / Personel</th>
                <th className="p-3.5">Jenis Lisensi</th>
                <th className="p-3.5">Jatuh Tempo</th>
                <th className="p-3.5">Status Kepatuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {licenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    Belum ada lisensi terdaftar.
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-medium text-slate-800 text-xs">
                      {lic.equipment_or_person}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {lic.license_type}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {lic.expired_date}
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(lic.expired_date)}
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
