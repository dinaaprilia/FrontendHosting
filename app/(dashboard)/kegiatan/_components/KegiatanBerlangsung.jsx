'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function ActivityNowPopup({ onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch('https://backendfix-production.up.railway.app/api/aktivitas/ongoing'); // ganti dengan endpoint API kamu
        const json = await res.json();
        if (json.status === 'success') {
          setActivities(json.data);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Kegiatan Berlangsung</h2>
            <span className="bg-white text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
              {loading ? '...' : activities.length} Jumlah
            </span>
          </div>
          <button onClick={onClose} className="bg-white p-1 rounded-full text-blue-400 hover:bg-gray-200 transition">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Konten Table */}
        <div className="p-5 overflow-y-auto max-h-80">
          {loading ? (
            <p className="text-center text-gray-500">Memuat kegiatan...</p>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada kegiatan berlangsung saat ini.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Nama Kegiatan</th>
                  <th className="p-3 text-left">Kategori</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Total Days</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{activity.name}</td>
                    <td className="p-3">{activity.category}</td>
                    <td className="p-3">{new Date(activity.start).toLocaleDateString('id-ID')}</td>
                    <td className="p-3">{new Date(activity.end).toLocaleDateString('id-ID')}</td>
                    <td className="p-3">{activity.totalDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Modal */}
        <div className="bg-gray-100 p-4 rounded-b-2xl flex justify-center">
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
