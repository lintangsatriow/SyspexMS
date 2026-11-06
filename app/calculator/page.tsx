'use client';

import { useState } from 'react';

export default function CalculatorPage() {
  // Input Paparan Jam Kerja
  const [employees, setEmployees] = useState<number>(120);
  const [workDays, setWorkDays] = useState<number>(22);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [overtimeHours, setOvertimeHours] = useState<number>(150);

  // Input Data Kasus Insiden
  const [fatalities, setFatalities] = useState<number>(0);
  const [ltiCases, setLtiCases] = useState<number>(0);
  const [restrictedCases, setRestrictedCases] = useState<number>(0);
  const [medicalTreatment, setMedicalTreatment] = useState<number>(1);
  const [firstAidCases, setFirstAidCases] = useState<number>(2);
  const [lostDays, setLostDays] = useState<number>(0);
  const [restrictedDays, setRestrictedDays] = useState<number>(0);

  // 1. Total Man-Hours Exposure
  const totalManHours =
    employees * workDays * hoursPerDay + Number(overtimeHours);

  // 2. Total Recordable Cases (TRC) = Fatality + LTI + RWDC + MTC
  const totalRecordableCases =
    Number(fatalities) +
    Number(ltiCases) +
    Number(restrictedCases) +
    Number(medicalTreatment);

  // 3. Kasus DART = LTI + RWDC
  const dartCases = Number(ltiCases) + Number(restrictedCases);

  // 4. Perhitungan Rumus Statistik
  const ltifr =
    totalManHours > 0
      ? ((Number(ltiCases) + Number(fatalities)) * 1000000) / totalManHours
      : 0;
  const trir =
    totalManHours > 0 ? (totalRecordableCases * 200000) / totalManHours : 0;
  const dartRate = totalManHours > 0 ? (dartCases * 200000) / totalManHours : 0;
  const severityRate =
    totalManHours > 0
      ? ((Number(lostDays) + Number(restrictedDays)) * 1000000) / totalManHours
      : 0;
  const incidentRatePermenaker =
    employees > 0 ? (totalRecordableCases / employees) * 100 : 0;
  const averageDaysLost =
    Number(ltiCases) > 0 ? Number(lostDays) / Number(ltiCases) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Kalkulator Komprehensif Statistik K3 (HSE Metrics Suite)
        </h1>
        <p className="text-slate-500 mt-1">
          Perhitungan otomatis seluruh indikator frekuensi, keparahan, dan
          performa K3 sesuai standar OSHA, ILO, dan Kemenaker RI.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sisi Input Data (7 Kolom) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Box 1: Paparan Jam Kerja Orang */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>⏱️</span> 1. Jam Kerja Orang (Man-Hours Exposure)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Rata-rata Tenaga Kerja (Headcount)
                </label>
                <input
                  type="number"
                  min="1"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jumlah Hari Kerja Operasional
                </label>
                <input
                  type="number"
                  min="1"
                  value={workDays}
                  onChange={(e) => setWorkDays(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jam Kerja Reguler per Hari
                </label>
                <input
                  type="number"
                  min="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Total Jam Lembur Kolektif (Overtime)
                </label>
                <input
                  type="number"
                  min="0"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Data Insiden, Cedera, & Hari Hilang */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>📋</span> 2. Data Kasus Insiden & Hari Hilang
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Fatality (Kematian Kerja)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fatalities}
                  onChange={(e) => setFatalities(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Lost Time Injury (LTI / Kasus Hari Hilang)
                </label>
                <input
                  type="number"
                  min="0"
                  value={ltiCases}
                  onChange={(e) => setLtiCases(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Restricted Work Day Cases (RWDC)
                </label>
                <input
                  type="number"
                  min="0"
                  value={restrictedCases}
                  onChange={(e) => setRestrictedCases(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Medical Treatment Cases (MTC)
                </label>
                <input
                  type="number"
                  min="0"
                  value={medicalTreatment}
                  onChange={(e) => setMedicalTreatment(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  First Aid Cases (P3K - Non-Recordable)
                </label>
                <input
                  type="number"
                  min="0"
                  value={firstAidCases}
                  onChange={(e) => setFirstAidCases(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jumlah Hari Hilang Total (Lost Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={lostDays}
                  onChange={(e) => setLostDays(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jumlah Hari Kerja Terbatas (Restricted Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={restrictedDays}
                  onChange={(e) => setRestrictedDays(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sisi Output Metrik Lengkap (5 Kolom) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Panel Seluruh Indikator Statistik K3
            </h3>

            {/* Man Hours */}
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">
                Total Jam Kerja Orang (Man-Hours)
              </span>
              <p className="text-2xl font-black text-white mt-0.5">
                {totalManHours.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-normal text-slate-400">Jam</span>
              </p>
            </div>

            {/* Grid 2 Kolom untuk Metrik */}
            <div className="grid grid-cols-2 gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  LTIFR (1.000.000 jam)
                </span>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  {ltifr.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Frekuensi cedera waktu hilang.
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  TRIR / TCIR (OSHA)
                </span>
                <p className="text-2xl font-black text-blue-400 mt-1">
                  {trir.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tingkat seluruh insiden tercatat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  DART Rate (OSHA)
                </span>
                <p className="text-2xl font-black text-purple-400 mt-1">
                  {dartRate.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Kasus alih tugas & hari hilang.
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  Severity Rate (SR)
                </span>
                <p className="text-2xl font-black text-red-400 mt-1">
                  {severityRate.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Hari hilang per 1.000.000 jam.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  Incident Rate (Permenaker)
                </span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {incidentRatePermenaker.toFixed(2)}%
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Persentase pekerja celaka.
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  Rata-rata Hari Hilang
                </span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {averageDaysLost.toFixed(1)}{' '}
                  <span className="text-[10px] font-normal text-slate-400">
                    Hari/LTI
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Keparahan rata-rata tiap LTI.
                </p>
              </div>
            </div>
          </div>

          {/* Keterangan Rumus & Definisi Resmi */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">Referensi Rumus Standar:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
              <li>
                <strong>TRIR (OSHA):</strong> (Total Kasus Tercatat &times;
                200.000) / Man-Hours
              </li>
              <li>
                <strong>DART Rate (OSHA):</strong> ((LTI + Alih Tugas) &times;
                200.000) / Man-Hours
              </li>
              <li>
                <strong>LTIFR (ILO/Permenaker):</strong> ((LTI + Fatality)
                &times; 1.000.000) / Man-Hours
              </li>
              <li>
                <strong>Severity Rate (SR):</strong> ((Hari Hilang + Hari
                Terbatas) &times; 1.000.000) / Man-Hours
              </li>
              <li>
                <strong>Incident Rate (Permenaker):</strong> (Total Kasus
                Tercatat / Total Tenaga Kerja) &times; 100%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
