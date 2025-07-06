'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentParticipation({ judul, tanggal }) {
  const [students, setStudents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua");

  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!judul || !tanggal || judul === '-' || tanggal === '-') return;

    axios.get("https://backendfix-production.up.railway.app/api/absensi-karya-wisata/peserta", {
      params: {
        judul: judul.toLowerCase(),
        tanggal,
      },
    })
      .then((res) => {
        setStudents(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Gagal mengambil data partisipasi:", err);
      });
  }, [judul, tanggal]);

  // Hapus duplikat berdasarkan nama (hanya ambil entri pertama)
  const uniqueStudents = Array.from(
    new Map(students.map(item => [item.nama?.toLowerCase(), item])).values()
  );

  // Lalu filter berdasarkan status
  const filteredStudents = uniqueStudents.filter((s) => {
    if (filterStatus === 'semua') return true;
    return s.status?.toLowerCase() === filterStatus;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <div className="flex items-center">
          <h2 className="sm:text-xl text-base font-semibold text-gray-800">
            Daftar Siswa – {judul} ({formatDateWithDay(tanggal)})
          </h2>
          <div className="bg-yellow-500 text-white px-4 py-1.5 rounded-full font-semibold text-sm shadow-md ml-3">
            {filteredStudents.length}
          </div>
        </div>
        <div className="flex mt-2 sm:mt-0 space-x-2">
          {['semua', 'hadir', 'tidak hadir'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                filterStatus === status
                  ? status === 'hadir'
                    ? 'bg-green-600 text-white'
                    : status === 'tidak hadir'
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto border rounded-md">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b text-gray-600">
              <th className="p-3 text-sm font-medium text-center w-16">No</th>
              <th className="p-3 text-sm font-medium text-center">Nama</th>
              <th className="p-3 text-sm font-medium text-center">Kelas</th>
              <th className="p-3 text-sm font-medium text-center">Status</th>
              <th className="p-3 text-sm font-medium text-center">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3 text-center">{i + 1}</td>
                <td className="p-3 text-center">{s.nama || '-'}</td>
                <td className="p-3 text-center">{s.kelas || '-'}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                    s.status?.toLowerCase() === 'hadir'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-center">{s.waktu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
