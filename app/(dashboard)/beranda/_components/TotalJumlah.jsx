'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';

export default function TotalPopup({ onClose }) {
  const [students, setStudents] = useState([]);  // State untuk menyimpan data user
  const [total, setTotal] = useState(0);  // State untuk menyimpan total user

  // Mengambil data user dan total dari backend
  useEffect(() => {
  const fetchUsersWithTotal = async () => {
    try {
      const res = await fetch('https://backendfix-production.up.railway.app/api/total-user');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();

      // ✅ Hanya siswa dan guru, bukan orang tua (OT_...)
      const filteredUsers = data.data.filter(user =>
        (user.nisn && !user.nisn.startsWith("OT_")) ||
        (user.nip && !user.nip.startsWith("OT_"))
      );

      setStudents(filteredUsers);
      setTotal(filteredUsers.length);
    } catch (error) {
      console.error('❌ Gagal mengambil data:', error);
    }
  };

  fetchUsersWithTotal();
}, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Daftar Total</h2>
            <span className="bg-white text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
              {total} Data
            </span>
          </div>
          <button onClick={onClose} className="bg-white p-1 rounded-full text-yellow-400 hover:bg-gray-200 transition">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Konten Table */}
        <div className="p-5 overflow-y-auto max-h-80">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">NIP/NISN</th>
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
                    {student.name}
                  </td>
                  <td className="p-3">
                    {student.nip ? student.nip : (student.nisn ? student.nisn : '-')}
                  </td>
                  <td className="p-3">
                    {student.gender === 'L' ? 'Laki-laki' : (student.gender === 'P' ? 'Perempuan' : '-')}
                  </td>
                  <td className="p-3">
                    {student.class ? student.class : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Modal */}
        <div className="bg-gray-100 p-4 rounded-b-2xl flex justify-center">
          <button onClick={onClose} className="px-5 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
