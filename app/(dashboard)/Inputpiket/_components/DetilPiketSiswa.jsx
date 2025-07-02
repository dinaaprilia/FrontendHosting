"use client";

import { useEffect, useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';

export default function DetailPiketPopup({ onClose, anggota }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'hadir': return 'bg-green-500';
      case 'tidak hadir': return 'bg-red-500';
      case 'berkontribusi': return 'bg-blue-500';
      case 'tidak berkontribusi': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !anggota?.nisn) return;

      try {
        const url = `https://backendfix-production.up.railway.app/api/piket/riwayat-nisn/${anggota.nisn}?bulan=${selectedMonth}&tahun=${selectedYear}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const json = await res.json();
        console.log("📊 Data dari API:", json);
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("❌ Gagal ambil data piket:", err.message);
      }
    };

    fetchData();
  }, [anggota?.nisn, selectedMonth, selectedYear]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl mt-10 mb-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FaClipboardList className="text-blue-700 text-2xl" />
            <h2 className="font-semibold text-xl text-black">Riwayat Kehadiran Piket</h2>
          </div>
          <button onClick={onClose} className="text-red-600 text-lg font-bold">✕</button>
        </div>

        {/* Filter Bulan dan Tahun */}
        <div className="flex space-x-4 mb-6">
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((bulan, i) => (
              <option key={i} value={i + 1}>{bulan}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026].map((tahun) => (
              <option key={tahun} value={tahun}>{tahun}</option>
            ))}
          </select>
        </div>

        {/* Profil Siswa */}
        <div className="flex items-center mb-6">
          <img
            src={anggota.foto_profil || "/images/profilsiswa.jpg"}
            alt="Foto Profil"
            className="w-16 h-16 rounded-full mr-4 border-2 border-blue-300"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{anggota.nama}</h2>
            <p className="text-gray-500">{anggota.kelas || '-'}</p>
          </div>
        </div>

        {/* Tabel Riwayat Piket */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-black">
                <th className="p-4 text-center font-medium border-b border-gray-300 w-[30%]">Hari / Tanggal</th>
                <th className="p-4 text-center font-medium border-b border-gray-300 w-[20%]">Status</th>
                <th className="p-4 text-center font-medium border-b border-gray-300 w-[20%]">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">Belum ada data piket</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-4 border-b border-gray-200 text-gray-700 text-center">{item.tanggal}</td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">{item.waktu || item.waktu_absen || '-'}</td>
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
