import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function TeacherPopup({ onClose }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('https://backendfix-production.up.railway.app/api/guru'); // Pastikan endpoint ini benar dan sesuai Laravel route
        const json = await res.json();
        if (json.status === 'success') {
          setTeachers(json.data);
        } else {
          console.error('Gagal mengambil data guru');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getGenderLabel = (gender) => {
    if (gender === 'L') return 'Laki-laki';
    if (gender === 'P') return 'Perempuan';
    return '-';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-pink-500 to-red-300 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Daftar Guru</h2>
            <span className="bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
              {loading ? '...' : `${teachers.length} Guru`}
            </span>
          </div>
          <button onClick={onClose} className="bg-white p-1 rounded-full text-pink-600 hover:bg-gray-200 transition">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Konten Table */}
        <div className="p-5 overflow-y-auto max-h-80">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data guru...</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">NIP</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Kelas / Divisi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-6">Tidak ada data guru.</td>
                  </tr>
                ) : (
                  teachers.map((teacher, index) => (
                    <tr key={teacher.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3">{index + 1}.</td>
                      <td className="p-3 flex items-center gap-2">
                        <Image
  src={teacher.foto_profil || '/images/profilguru.jpg'} // pakai foto_profil dari API, fallback foto default guru
  alt="Avatar"
  width={28}
  height={28}
  className="rounded-full border"
  unoptimized
/>
                        {teacher.nama || '-'}
                      </td>
                      <td className="p-3">{teacher.nip || '-'}</td>
                      <td className="p-3">{getGenderLabel(teacher.jenis_kelamin)}</td>
                      <td className="p-3">{teacher.kelas || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Modal */}
        <div className="bg-gray-100 p-4 rounded-b-2xl flex justify-center">
          <button onClick={onClose} className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
