'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';
import axios from 'axios';

export default function EkskulList() {
  const router = useRouter();
  const pathname = usePathname();
  const [ekskulData, setEkskulData] = useState([]);

  const API_URL = 'http://localhost:8000/api/ekskul-saya'; // ✅ Hanya ekskul milik siswa

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validEkskul = Array.isArray(res.data)
          ? res.data.filter(item => item.name && item.mentor)
          : [];

        setEkskulData(validEkskul);
      } catch (error) {
        console.error('❌ Gagal ambil ekskul:', error.message);
      }
    };

    fetchData();
  }, [pathname]);

  const fetchEkskulById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/ekskul/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      mentor: data.mentor,
      image: data.image?.startsWith("http")
        ? data.image
        : data.image
          ? `http://localhost:8000/${data.image.replace(/^\/+/, "")}`
          : '/images/default-image.jpg',
    };
  };

  const handleMasukClick = async (ekskul) => {
    const updatedEkskul = await fetchEkskulById(ekskul.id);
    localStorage.setItem("selectedEkskul", JSON.stringify(updatedEkskul));

    const formattedName = ekskul.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    router.push(`/ekskulsiswa/${formattedName}`);
  };

  return (
    <div className="p-6 bg-gray-50 flex-1 sm:mt-10 mt-8 max-w-7xl rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:mt-8 mt-2">
        {ekskulData.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2">Belum ada data ekskul.</p>
        ) : (
          ekskulData.map((ekskul, index) => {
            const imageSrc = ekskul.image
              ? ekskul.image.startsWith("http")
                ? ekskul.image
                : `http://localhost:8000/${ekskul.image}`
              : "/images/default-image.jpg";

            return (
              <div
                key={`ekskul-${index}`}
                className="bg-blue-100 rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={imageSrc}
                  alt={ekskul.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-800">{ekskul.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <FaUser className="w-4 h-4 mr-2" />
                    <div>
                      <p>{ekskul.mentor}</p>
                      <p className="text-xs">Mentor</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleMasukClick(ekskul)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-green-300"
                    >
                      <IoMdLogIn className="w-5 h-5 mr-2" /> Masuk
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
