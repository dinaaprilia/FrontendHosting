'use client';

import { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

export default function FormInformasiViewer() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const ekskulId = JSON.parse(localStorage.getItem("selectedEkskul"))?.id;
    if (!ekskulId) return;

    fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/informasi`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          setDate(latest.date);
          setDescription(latest.description);
        }
      })
      .catch((err) => console.error("❌ Gagal fetch informasi:", err));
  }, []);

  return (
    <div className="p-6 w-96 rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-bold text-blue-800">Informasi Terkini</h2>

      <div className="mt-4">
        <label className="block font-medium text-gray-700">Hari / Tanggal</label>
        <div className="mt-1 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
          {date || "Belum ada informasi"}
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-medium text-gray-700">Deskripsi</label>
        <div className="relative mt-1 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg min-h-[5rem]">
          {description || "Belum ada deskripsi"}
          <FaPencilAlt className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
