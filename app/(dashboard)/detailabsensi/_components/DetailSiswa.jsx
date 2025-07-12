"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";

const StudentCard = () => {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nisn) {
      setError("NISN tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://backendfix-production.up.railway.app/api/detail-siswa?nisn=${nisn}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data siswa");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nisn]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-md w-full mt-8 py-4">
      {/* Foto Profil */}
      <div className="w-40 h-52 sm:w-48 sm:h-56 overflow-hidden rounded-lg sm:mt-0 mt-5 sm:mb-0 -mb-10">
        <img
          src={
            data?.foto
              ? `https://backendfix-production.up.railway.app/storage/${data.foto}`
              : "/images/profil.png"
          }
          alt="Profile Picture"
          width={192}
          height={224}
          className="object-cover sm:w-full w-40 sm:h-full h-40"
        />

      </div>

      {/* Informasi + Statistik */}
      <div className="sm:flex-1 flex-3 w-full">
        {/* Informasi Siswa */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4">
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Nama</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.nama}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Kelas</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.kelas}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">NISN</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.nisn}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Jenis Kelamin</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.jenis_kelamin}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Agama</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.agama}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Tanggal Lahir</p>
            <p className="text-gray-800 text-sm sm:text-base">
              {data.tanggal_lahir
                ? format(parseISO(data.tanggal_lahir), "dd MMMM yyyy", { locale: localeID })
                : "-"}
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">No HP</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.no_hp}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 text-sm sm:text-base">Email</p>
            <p className="text-gray-800 text-sm sm:text-base">{data.email}</p>
          </div>
        </div>

        {/* Statistik */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 w-full">
          <div className="flex-1 h-14 sm:h-16 bg-[#5CB338] text-white flex items-center justify-center rounded-full text-lg sm:text-xl font-bold shadow-md">
            {data.statistik?.hadir ?? 0}
          </div>
          <div className="flex-1 h-14 sm:h-16 bg-[#FB4141] text-white flex items-center justify-center rounded-full text-lg sm:text-xl font-bold shadow-md">
            {data.statistik?.tidak_hadir ?? 0}
          </div>
          <div className="flex-1 h-14 sm:h-16 bg-[#FFBB03] text-white flex items-center justify-center rounded-full text-lg sm:text-xl font-bold shadow-md">
            {data.statistik?.terlambat ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
