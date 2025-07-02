'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoPeople } from "react-icons/io5";

export default function KehadiranBulanan({ selectedDate, setSelectedDate }) {
  const [hadir, setHadir] = useState(0);
  const [tidakHadir, setTidakHadir] = useState(0);
  const [terlambat, setTerlambat] = useState(0);
  const [user, setUser] = useState(null);
  const [waliKelas, setWaliKelas] = useState('-');
  const [dataAnak, setDataAnak] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch("https://backendfix-production.up.railway.app/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const result = await res.json();
        const userData = result.user;

        setUser({
          id: userData.id,
          nama: userData.nama,
          kelas: userData.kelas ?? '-',
          foto_profil: userData.foto_profil
            ? `https://backendfix-production.up.railway.app/storage/${userData.foto_profil}`
            : '/images/profil.png',
          role: userData.role,
        });

        if (userData.role === 'orangtua') {
          const anakId = localStorage.getItem("anakId");
          if (!anakId) {
            console.error("anakId tidak ditemukan");
            return;
          }

          const anakRes = await fetch(`https://backendfix-production.up.railway.app/api/siswa/${anakId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          const anakData = await anakRes.json();

          setDataAnak({
            nama: anakData.nama,
            kelas: anakData.kelas,
            foto_profil: anakData.foto_profil
              ? `https://backendfix-production.up.railway.app/storage/${anakData.foto_profil}`
              : '/images/profil.png',
          });

          const resWali = await fetch(`https://backendfix-production.up.railway.app/api/guru-wali?kelas=${encodeURIComponent(anakData.kelas)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          const waliData = await resWali.json();
          setWaliKelas(waliData.nama ?? '-');
        } else if (userData.kelas) {
          const resWali = await fetch(`https://backendfix-production.up.railway.app/api/guru-wali?kelas=${encodeURIComponent(userData.kelas)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          const waliData = await resWali.json();
          setWaliKelas(waliData.nama ?? '-');
        }
      } catch (err) {
        console.error("❌ Gagal mengambil data user:", err.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedDate || !user) return;

    const fetchAbsensi = async () => {
      const token = localStorage.getItem('token');
      const bulan = selectedDate.getMonth() + 1;
      const tahun = selectedDate.getFullYear();

      try {
        let response;

        if (user.role === 'orangtua') {
          const anakId = localStorage.getItem("anakId");
          if (!anakId) {
            console.error("anakId tidak ditemukan di localStorage");
            return;
          }

          response = await fetch(`https://backendfix-production.up.railway.app/api/absensi-anak-bulanan?bulan=${bulan}&tahun=${tahun}&anak_id=${anakId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        } else {
          response = await fetch(`https://backendfix-production.up.railway.app/api/absensi-saya-bulanan?bulan=${bulan}&tahun=${tahun}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        }

        const data = await response.json();
        setHadir(data.hadir || 0);
        setTidakHadir(data.tidak_hadir || 0);
        setTerlambat(data.terlambat || 0);
      } catch (error) {
        console.error("❌ Error saat fetch absensi:", error.message);
      }
    };

    fetchAbsensi();
  }, [selectedDate, user]);

  if (!user) {
    return <div className="text-center py-10 text-gray-500">Memuat data pengguna...</div>;
  }

  const displayFoto = user.role === 'orangtua' ? dataAnak?.foto_profil : user.foto_profil;
  const displayNama = user.role === 'orangtua' ? dataAnak?.nama : user.nama;
  const displayKelas = user.role === 'orangtua' ? dataAnak?.kelas : user.kelas;

  return (
    <div className="bg-white border shadow-md rounded-2xl p-4 sm:p-6 md:p-8 max-w-7xl mx-auto text-center sm:-mt-5 -mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-6">
        <p className="font-semibold text-sm sm:text-base">Pilih Bulan & Tahun:</p>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="border px-3 py-2 rounded-lg shadow-sm w-full sm:w-auto mt-2 sm:mt-0"
        />
      </div>

      <div className="w-24 h-24 sm:w-36 sm:h-36 relative rounded-full overflow-hidden mx-auto mb-4 sm:mb-6">
        <Image
          src={displayFoto}
          alt="Foto Siswa"
          width={144}
          height={144}
          style={{ objectFit: 'cover', borderRadius: '9999px' }}
        />
      </div>

      <h3 className="font-bold text-lg sm:text-2xl text-gray-900">{displayNama}</h3>
      <p className="font-semibold text-base sm:text-lg text-black">{displayKelas}</p>

      {(user.role === 'siswa' || user.role === 'orangtua') && (
        <div className="flex justify-center items-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 mt-2 sm:mt-0">
          <IoPeople className="mr-1 sm:mr-2 text-sm sm:text-lg text-gray-600" />
          <span>{waliKelas}</span>
        </div>
      )}

      {[
        { label: 'Hadir', value: hadir, color: '#5CB338' },
        { label: 'Tidak Hadir', value: tidakHadir, color: '#FB4141' },
        { label: 'Terlambat', value: terlambat, color: '#FFBB03' },
      ].map((item, i) => (
        <div key={i} className="flex flex-col sm:flex-row justify-center items-center mb-3 sm:mb-4">
          <div className="w-full sm:w-2/3 bg-gray-200 h-6 sm:h-8 rounded-full overflow-hidden">
            <div className="h-6 sm:h-8 rounded-l-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
          </div>
          <span className="mt-1 sm:mt-0 sm:ml-3 text-sm sm:text-md font-medium">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}
