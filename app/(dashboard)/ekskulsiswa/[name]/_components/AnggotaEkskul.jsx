"use client";

import { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import DetailSiswaPopup from "./DetailSiswa";

export default function AnggotaEkskul() {
  const [anggotaEkskul, setAnggotaEkskul] = useState([]);
  const [detailPopup, setDetailPopup] = useState(null);

  const fetchAnggotaEkskul = async () => {
    const ekskul = JSON.parse(localStorage.getItem("selectedEkskul"));
    const ekskulId = ekskul?.id;
    if (!ekskulId) return;

    try {
      const res = await fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/anggota`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      setAnggotaEkskul(data);
    } catch (err) {
      console.error("❌ Gagal fetch anggota ekskul:", err);
    }
  };

  useEffect(() => {
    fetchAnggotaEkskul();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-2 bg-white rounded-2xl shadow-lg p-3 relative max-sm:px-2 h-[510px] flex flex-col">
      <div className="flex items-center justify-between border-b pb-3 mb-1 max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <div className="flex items-center gap-3 font-semibold text-xl">
          <FaUsers className="text-gray-700" />
          <span>Anggota Ekskul</span>
        </div>
        <div className="border-gray-600 border-1 flex items-center sm:ml-0 gap-2 text-gray-700">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 px-3 py-1 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm max-sm:text-xs">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-gray-700 border-b">
              <th className="py-3 w-12 pl-4">No</th>
              <th className="text-center w-40">Nama</th>
              <th className="text-center w-32">NISN</th>
              <th className="text-center w-20">Kelas</th>
            </tr>
          </thead>
          <tbody>
            {anggotaEkskul.map((anggota, index) => (
              <tr key={anggota.id} className="border-b max-sm:text-xs">
                <td className="py-4 text-center">{index + 1}.</td>
                <td className="py-4 text-left">
                  <div className="flex items-center gap-3 max-sm:gap-2">
                    <img
                      src="/images/profilsiswa.jpg"
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <button 
                      onClick={() => setDetailPopup(anggota)}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {anggota.nama}
                    </button>
                  </div>
                </td>
                <td className="py-4 text-center">{anggota.nisn || "-"}</td>
                <td className="py-4 text-center">{anggota.kelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailPopup && (
        <DetailSiswaPopup
          onClose={() => setDetailPopup(null)}
          anggota={detailPopup}
        />
      )}
    </div>
  );
}
