'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function KaryaCard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('https://backendfix-production.up.railway.app/api/perjalanan-wisata-sebelumnya')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        setEvents(sorted);
      })
      .catch(err => console.error("Gagal fetch riwayat:", err));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTitleForURL = (title) =>
    title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-');

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      {events.map((event, index) => (
        <Link
          key={`${event.title}-${event.tanggal}-${index}`}
          href={`/detailkaryawisata/${encodeURIComponent(formatTitleForURL(event.title))}?judul=${encodeURIComponent(event.title)}&tanggal=${event.tanggal}`}
        >
          <div className="bg-white text-black rounded-xl p-6 w-full shadow-md flex justify-between items-center h-36 border-2 border-blue-500 cursor-pointer hover:shadow-lg transition-all">
            <div>
              {/* <h2 className="font-bold text-xl">{event.title}</h2> */}
              <p className="text-sm font-medium opacity-80">{formatDate(event.tanggal)}</p>
            </div>
            <div className="flex-1 flex justify-center">
              <p className="text-[#0f285a] font-bold sm:text-2xl text-lg text-center">{event.title || '-'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
