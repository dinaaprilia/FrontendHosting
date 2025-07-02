'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaPlus, FaUser, FaTrash } from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';
import PopupForm from './EkskulForm';
import axios from 'axios';
import { useUserContext } from '@/hooks/UserContext'; // pastikan path ini sesuai

export default function EkskulList() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ekskulData, setEkskulData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user, loading } = useUserContext(); // GUNAKAN user dari Context

  const API_URL = 'https://backendfix-production.up.railway.app/api/ekskul';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validEkskul = Array.isArray(res.data)
          ? res.data.filter((item) => item.name && item.mentor)
          : [];

        setEkskulData(validEkskul);
      } catch (error) {
        console.error('❌ Gagal ambil ekskul:', error.message);
      }
    };

    fetchData();
  }, [pathname]);

  const fetchEkskulById = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://backendfix-production.up.railway.app/api/ekskul/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      mentor: data.mentor,
      image: data.image?.startsWith('http')
        ? data.image
        : data.image
        ? `https://backendfix-production.up.railway.app/${data.image.replace(/^\/+/g, '')}`
        : '/images/default.png',
    };
  };

  const handleMasukClick = async (ekskul) => {
    const updatedEkskul = await fetchEkskulById(ekskul.id);
    localStorage.setItem('selectedEkskul', JSON.stringify(updatedEkskul));
    router.push(`/ekskul/${ekskul.name.toLowerCase().replace(/\s+/g, '')}`);
  };

  const handleAddEkskul = (newEkskul) => {
    setEkskulData((prev) => [...prev, newEkskul]);
    setIsPopupOpen(false);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEkskulData((prev) => prev.filter((e) => e.id !== selectedId));
      console.log('✅ Ekskul berhasil dihapus');
    } catch (err) {
      console.error('❌ Gagal menghapus ekskul:', err.response?.data || err.message);
      alert('Gagal menghapus ekskul.');
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 flex-1 mt-10 max-w-7xl rounded-md">
      {user?.role === 'admin' && (
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mb-4"
        >
          <FaPlus className="w-5 h-5 mr-2" /> Tambah Ekskul
        </button>
      )}

      {isPopupOpen && (
        <PopupForm onAddEkskul={handleAddEkskul} onClose={() => setIsPopupOpen(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {ekskulData.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2">Belum ada data ekskul.</p>
        ) : (
          ekskulData.map((ekskul, index) => {
            const imageSrc = ekskul.image
              ? ekskul.image.startsWith('http')
                ? ekskul.image
                : `https://backendfix-production.up.railway.app/${ekskul.image}`
              : '/images/default.png';

            return (
              <div
                key={`ekskul-${index}`}
                className="bg-blue-100 rounded-xl shadow-lg overflow-hidden relative"
              >
                <img
                  src={imageSrc}
                  alt={ekskul.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-blue-800">{ekskul.name}</h3>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => confirmDelete(ekskul.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus Ekskul"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
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

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-gray-800">
              Anda yakin ingin menghapus ekskul ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedId(null);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
