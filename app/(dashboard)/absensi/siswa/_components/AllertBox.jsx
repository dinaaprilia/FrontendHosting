'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export default function AbsensiAlert() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://backendfix-production.up.railway.app/api/absensi-hari-ini", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const result = await res.json();
        setStatus(result.status); // null jika belum absen
      } catch (err) {
        console.error("Gagal mengambil status absensi:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 max-w-7xl mx-auto shadow-md mt-5">
      {status !== null ? (
        <>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-xl text-green-700">
              Absensi Hari Ini Telah Diisi
            </p>
            <FaCheck className="text-green-900 w-4 h-4" />
          </div>
          <p className="text-md text-gray-700">
            Tetap pantau dan tingkatkan kehadiran anda setiap hari.
            Jika terjadi kesalahan pengisian absensi,
            silahkan hubungi wali kelas anda.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-xl text-red-600">
              Absensi hari ini belum diisi
            </p>
          </div>
          <p className="text-md text-gray-700">
            Ayo datang tepat waktu!
          </p>
        </>
      )}
    </div>
  );
}
