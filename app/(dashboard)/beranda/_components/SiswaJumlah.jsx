'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function StudentPopup({ onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://backendfix-production.up.railway.app/api/siswa') // Ganti dengan URL API Laravel sesuai server kamu
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data siswa');
        return res.json();
      })
      .then((data) => {
        setStudents(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
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
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Daftar Siswa</h2>
            <span className="bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full">
              {students.length} Siswa
            </span>
          </div>
          <button onClick={onClose} className="bg-white p-1 rounded-full text-purple-600 hover:bg-gray-200 transition">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-80">
          {loading ? (
            <p className="text-gray-500 text-center">Memuat data...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">NISN</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Kelas</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{index + 1}.</td>
                    <td className="p-3 flex items-center gap-2">
                      <Image
  src={student.foto_profil || '/images/profilsiswa.jpg'}
  alt="Avatar"
  width={28}
  height={28}
  className="rounded-full border"
  unoptimized
/>
                      {student.nama || '-'}
                    </td>
                    <td className="p-3">{student.nisn || '-'}</td>
                    <td className="p-3">
                      {student.jenis_kelamin === 'L'
                        ? 'Laki-laki'
                        : student.jenis_kelamin === 'P'
                          ? 'Perempuan'
                          : '-'}
                    </td>
                    <td className="p-3">{student.kelas || '-'}</td>
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
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
