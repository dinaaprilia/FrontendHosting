'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function ResponsiblePopup({ onClose }) {
  const [responsible, setResponsible] = useState([]);

  useEffect(() => {
    // Ganti URL ini sesuai dengan endpoint backend-mu
    fetch('https://backendfix-production.up.railway.app/api/penanggung-jawab')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Data dari backend format: [{ name, nip, kelas }, ...]
          // Tambahkan id/index supaya bisa jadi key di map
          const withId = data.data.map((item, index) => ({ id: index + 1, ...item }));
          setResponsible(withId);
        }
      })
      .catch(err => {
        console.error('Failed to fetch penanggung jawab:', err);
      });
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
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Penanggung Jawab</h2>
            <span className="bg-white text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
              {responsible.length} Jumlah
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="bg-white p-1 rounded-full text-blue-400 hover:bg-gray-200 transition"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Konten Table */}
        <div className="p-5 overflow-y-auto max-h-80">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Nomor</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">NIP</th>
                <th className="p-3 text-left">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {responsible.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.nama || "-"}</td>
                  <td className="p-3">{item.nip || "-"}</td>
                  <td className="p-3">{item.kelas || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Modal */}
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
