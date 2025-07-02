'use client';
import React, { useEffect, useState } from 'react';

const EkskulCard = () => {
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

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-6">
        Memuat deskripsi ekskul...
      </div>
    );
  }

  return (
    <div className="border-[#94a6d8] border-4 bg-white text-black p-4 rounded-xl max-w-7xl mx-auto">
      <h1 className="flex justify-start text-[#121e42] text-2xl font-bold mb-3">Deskripsi</h1>
      <p className="text-lg text-black leading-relaxed">
        {description || <span className="text-gray-400 italic">Belum ada deskripsi.</span>}
      </p>
    </div>
  );
};

export default EkskulCard;
