'use client';

import { useEffect, useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';

export default function AttendanceTable() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [user, setUser] = useState({
    name: '-',
    kelas: '-',
    photo: '/images/profil.png',
  });

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'berkontribusi': return 'bg-green-500';
      case 'tidak berkontribusi': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const resUser = await fetch('https://backendfix-production.up.railway.app/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const resultUser = await resUser.json();
        const kelas = resultUser.user.kelas;

setUser({
  name: resultUser.user.nama,
  kelas: kelas ?? '-',
  photo: resultUser.user.foto_profil?.startsWith('http')
    ? resultUser.user.foto_profil
    : `https://backendfix-production.up.railway.app/storage/${resultUser.user.foto_profil || ''}`,
});



        const resData = await fetch(`https://backendfix-production.up.railway.app/api/piket-saya?bulan=${selectedMonth}&tahun=${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resultData = await resData.json();
        setData(resultData ?? []);
      } catch (err) {
        console.error('❌ Gagal ambil data:', err.message);
      }
    };

    fetchUserAndData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full mt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <FaClipboardList className="text-blue-700 text-xl sm:text-2xl" />
          <h2 className="font-semibold text-lg sm:text-xl text-black">Riwayat Piket Kelas</h2>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <select
            className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((bulan, i) => (
              <option key={i} value={i + 1}>{bulan}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026].map((tahun) => (
              <option key={tahun} value={tahun}>{tahun}</option>
            ))}
          </select>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center mb-6">
        <img
          src={user.photo}
          alt="Foto Profil"
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 border-2 border-blue-300 object-cover"
        />
        <div>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800">
            {user.name.replace(/^Orangtua\s+/i, '')}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{user.kelas}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-blue-100 text-black">
              <th className="p-3 sm:p-4 text-center font-medium border-b border-gray-300 w-[25%]">Hari / Tanggal</th>
              <th className="p-3 sm:p-4 text-center font-medium border-b border-gray-300 w-[20%]">Berkontribusi</th>
              <th className="p-3 sm:p-4 text-center font-medium border-b border-gray-300 w-[20%]">Tidak Berkontribusi</th>
              <th className="p-3 sm:p-4 text-center font-medium border-b border-gray-300 w-[20%]">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">Belum ada data piket</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 sm:p-4 border-b border-gray-200 text-gray-700 text-center">{item.tanggal}</td>
                  <td className="p-3 sm:p-4 border-b border-gray-200">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full mx-auto ${item.status === 'berkontribusi' ? getStatusColor('berkontribusi') : 'bg-gray-300'}`} />
                  </td>
                  <td className="p-3 sm:p-4 border-b border-gray-200">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full mx-auto ${item.status === 'tidak berkontribusi' ? getStatusColor('tidak berkontribusi') : 'bg-gray-300'}`} />
                  </td>
                  <td className="p-3 sm:p-4 border-b border-gray-200 text-gray-700 text-center">{item.waktu || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
