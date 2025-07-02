'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function AmountPopup({ onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('https://backendfix-production.up.railway.app/api/peserta-ongoing');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        if (data.status === 'success') {
          setParticipants(data.data);
        } else {
          setError('Response tidak berstatus success');
        }
      } catch (err) {
        console.error('Gagal memuat data partisipan:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Jumlah Partisipan</h2>
            <span className="bg-white text-blue-500 text-xs font-bold px-3 py-1 rounded-full">
              {participants.length} Jumlah
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-white p-1 rounded-full text-blue-400 hover:bg-gray-200 transition"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Konten */}
        <div className="p-5 overflow-y-auto max-h-80">
          {loading ? (
            <p>Memuat data partisipan...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : participants.length === 0 ? (
            <p className="text-gray-500 text-center">
              Tidak ada partisipan yang sedang mengikuti kegiatan.
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Nomor</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">NISN</th>
                  <th className="p-3 text-left">Kelas</th>
                  <th className="p-3 text-left">Jenis Kegiatan</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((item, index) => (
                  <tr
                    key={`${item.nisn}-${index}`}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.nisn}</td>
                    <td className="p-3">{item.kelas}</td>
                    <td className="p-3">{item.jenis_kegiatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 rounded-b-2xl flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
