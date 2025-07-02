'use client';

import { useEffect, useState } from 'react';

const AttendanceTable = ({ selectedDate }) => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState('-');
  const [kelas, setKelas] = useState('-');

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAbsensi = async () => {
      const token = localStorage.getItem('token');

      try {
        const resUser = await fetch('https://backendfix-production.up.railway.app/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const resultUser = await resUser.json();
        const userId = resultUser.user.id;
        setKelas(resultUser.user.kelas ?? '-');

        const bulan = selectedDate.getMonth() + 1;
        const tahun = selectedDate.getFullYear();

        const resAbsensi = await fetch(
          `https://backendfix-production.up.railway.app/api/absensi-by-user?user_id=${userId}&bulan=${bulan}&tahun=${tahun}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        const resultAbsensi = await resAbsensi.json();
        setData(resultAbsensi.absensi || []);

        const bulanNama = selectedDate.toLocaleString('id-ID', { month: 'long' });
        setMonthYear(`${bulanNama} ${tahun}`);
      } catch (error) {
        console.error('❌ Gagal mengambil data absensi:', error.message);
      }
    };

    fetchAbsensi();
  }, [selectedDate]);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'hadir':
        return 'bg-green-500';
      case 'tidak hadir':
        return 'bg-red-500';
      case 'terlambat':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full mt-4">
      <h2 className="text-center font-semibold text-xl text-blue-900 mb-2">
        {monthYear}
      </h2>
      <p className="text-center text-gray-700 font-medium mb-4">
        Kelas: {kelas}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-black">
              <th className="p-4 text-center font-medium border-b border-gray-300 w-[25%]">
                Hari / Tanggal
              </th>
              <th className="p-4 text-center font-medium border-b border-gray-300 w-[15%]">
                Hadir
              </th>
              <th className="p-4 text-center font-medium border-b border-gray-300 w-[15%]">
                Tidak Hadir
              </th>
              <th className="p-4 text-center font-medium border-b border-gray-300 w-[15%]">
                Terlambat
              </th>
              <th className="p-4 text-center font-medium border-b border-gray-300 w-[20%]">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const status = item.status?.toLowerCase?.() ?? '';
              const tanggalFormatted = item.tanggal
                ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-';

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 border-b border-gray-200 text-center text-gray-700 bg-white">
                    {tanggalFormatted}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className={`w-6 h-6 rounded-full mx-auto ${getStatusColor(status === 'hadir' ? 'hadir' : '')}`} />
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className={`w-6 h-6 rounded-full mx-auto ${getStatusColor(status === 'tidak hadir' ? 'tidak hadir' : '')}`} />
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className={`w-6 h-6 rounded-full mx-auto ${getStatusColor(status === 'terlambat' ? 'terlambat' : '')}`} />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center text-gray-700 bg-white">
                    {item.waktu_absen || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Belum ada data absensi</p>
        )}
         {/* Rekap Jumlah Status */}
        <div className="flex flex-wrap justify-center mt-6 gap-4 ">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg text-center w-60 shadow">
            <p className="font-semibold">Jumlah Hadir</p>
            <p className="text-xl">
              {data.filter(item => item.status?.toLowerCase() === 'hadir').length}
            </p>
          </div>
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg text-center w-60 shadow">
            <p className="font-semibold">Jumlah Tidak Hadir</p>
            <p className="text-xl">
              {data.filter(item => item.status?.toLowerCase() === 'tidak hadir').length}
            </p>
          </div>
          <div className="bg-yellow-400 text-white px-6 py-4 rounded-lg text-center w-60 shadow">
            <p className="font-semibold">Jumlah Terlambat</p>
            <p className="text-xl">
              {data.filter(item => item.status?.toLowerCase() === 'terlambat').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
