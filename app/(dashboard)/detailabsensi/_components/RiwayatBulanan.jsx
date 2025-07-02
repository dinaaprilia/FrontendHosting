'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const AttendanceTable = () => {
  const searchParams = useSearchParams();
  const nisn = searchParams.get('nisn');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk menentukan warna berdasarkan status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Hadir':
        return 'bg-green-500';
      case 'Tidak Hadir':
      case 'tidak-hadir':
        return 'bg-red-500';
      case 'Terlambat':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  useEffect(() => {
    if (!nisn) return;

    setLoading(true);
    setError(null);

    fetch(`https://backendfix-production.up.railway.app/api/absensi-detail?nisn=${nisn}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data absensi');
        return res.json();
      })
      .then((json) => {
        setData(json.absensi || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nisn]);

  if (!nisn) {
    return <p className="text-center mt-10 text-red-500">Parameter nisn tidak ditemukan di URL</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading data absensi...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full mt-5">
      <h2 className="text-center font-semibold text-xl text-blue-900 mb-6">Absensi Siswa</h2>
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
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Data absensi tidak tersedia.
                </td>
              </tr>
            )}

            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-4 border-b border-gray-200 text-gray-700 text-center">
                  {item.date}
                </td>

                {/* Hadir */}
                <td className="p-4 border-b border-gray-200">
                  <div
                    className={`w-6 h-6 rounded-full mx-auto ${
                      item.status === 'Hadir' ? getStatusColor('Hadir') : 'bg-gray-300'
                    }`}
                  ></div>
                </td>

                {/* Tidak Hadir */}
                <td className="p-4 border-b border-gray-200">
                  <div
                    className={`w-6 h-6 rounded-full mx-auto ${
                      item.status === 'Tidak Hadir' || item.status === 'Tidak Hadir'
                        ? getStatusColor('Tidak Hadir')
                        : 'bg-gray-300'
                    }`}
                  ></div>
                </td>

                {/* Terlambat */}
                <td className="p-4 border-b border-gray-200">
                  <div
                    className={`w-6 h-6 rounded-full mx-auto ${
                      item.status === 'Terlambat' ? getStatusColor('Terlambat') : 'bg-gray-300'
                    }`}
                  ></div>
                </td>

                <td className="p-4 border-b border-gray-200 text-gray-700 text-center">
                  {item.waktu}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
