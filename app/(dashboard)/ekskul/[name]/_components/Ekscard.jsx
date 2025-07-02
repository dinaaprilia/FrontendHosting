'use client';
import React, { useEffect, useState } from 'react';
import { FiEdit, FiSave } from 'react-icons/fi';

const EkskulCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [ekskulId, setEkskulId] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("selectedEkskul");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEkskulId(parsed.id);
        console.log("✅ ID Ekskul:", parsed.id);
      } catch (e) {
        console.error("❌ Gagal parsing selectedEkskul:", e.message);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDescription = async () => {
      if (!ekskulId) return;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/description`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("📥 Deskripsi dari server:", data.description);
        setDescription(data.description || '');
      } catch (error) {
        console.error('❌ Gagal mengambil deskripsi:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [ekskulId]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!ekskulId) return;

    try {
      await fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/description`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      console.log("✅ Deskripsi berhasil disimpan");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Gagal menyimpan deskripsi:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-6">
        Memuat deskripsi ekskul...
      </div>
    );
  }

  return (
    <div className="border-[#94a6d8] border-4 bg-white text-black p-4 rounded-xl max-w-7xl mx-auto">
      <h1 className="flex justify-start text-[#121e42] sm:text-2xl text-xl font-bold sm:mb-3 mb-1">Deskripsi</h1>

      {isEditing ? (
        <textarea
          className="w-full p-2 border border-gray-400 rounded-md"
          placeholder="Tuliskan deskripsi ekskul di sini..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <p className="text-lg text-black leading-relaxed">
          {description || <span className="text-gray-400 italic">Belum ada deskripsi.</span>}
        </p>
      )}

      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
      >
        {isEditing ? <FiSave size={20} /> : <FiEdit size={20} />}
        {isEditing ? 'Simpan' : 'Edit'}
      </button>
    </div>
  );
};

export default EkskulCard;
