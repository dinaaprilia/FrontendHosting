"use client";

import { FaBullhorn } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function InfoKaryaWisata() {
  const router = useRouter();
  const [title, setTitle] = useState("-");
  const [date, setDate] = useState("-");
  const [hasData, setHasData] = useState(false);
  const [eventType] = useState("Karya Wisata");

  const fetchCurrentInfo = async () => {
    try {
      const res = await axios.get("https://backendfix-production.up.railway.app/api/karya-wisata-info/current-title");
      const data = res.data?.data;
      if (data) {
        setTitle(data.title || "-");
        setDate(data.tanggal || "-");
        setHasData(!!data.title && !!data.tanggal);
      }
    } catch (err) {
      console.error("❌ Gagal mengambil data info:", err);
    }
  };

  useEffect(() => {
    fetchCurrentInfo();
  }, []);

  const handleClick = () => {
    if (title && date && hasData) {
      redirectToDetail(title, date);
    }
  };

  const redirectToDetail = (judul, tanggal) => {
    const slug = judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const encodedJudul = encodeURIComponent(judul);
    const encodedTanggal = encodeURIComponent(tanggal);

    router.push(`/detailkaryawisata/${slug}?judul=${encodedJudul}&tanggal=${encodedTanggal}`);
  };

  return (
    <div
      className="bg-[#869ddd] p-6 rounded-2xl shadow-lg w-full max-w-7xl sm:h-[220px] h-auto mt-5 flex sm:flex-row flex-col justify-between items-start cursor-pointer hover:opacity-90"
      onClick={handleClick}
    >
      <div className="flex-1 flex flex-col justify-center max-sm:w-full">
        <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start">
          <FaBullhorn className="text-white text-2xl" />
          <h2 className="text-white font-semibold sm:text-2xl text-xl">{eventType}</h2>
        </div>

        <p className="text-white font-medium sm:text-xl text-base mt-1 break-words">
          {date !== "-" && date
            ? new Date(date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </p>

        <div className="flex justify-center items-center sm:ml-28 ml-0 mt-2 max-sm:w-full">
          <p className="sm:text-3xl text-2xl font-bold text-blue-950 break-words">{title || "-"}</p>
        </div>
      </div>

      <div className="sm:w-24 w-16 sm:h-24 h-16 sm:mr-8 mr-2 overflow-hidden flex-shrink-0 sm:mt-10 mt-2">
        <img
          src="/images/tour.png"
          alt="Foto Karya Wisata"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
