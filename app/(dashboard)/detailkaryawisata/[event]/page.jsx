'use client';

import React from 'react';
import Sidebar from '@/app/_components/Sidebar';
import Header from '@/app/_components/Header';
import { useParams, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import StudentParticipation from '../../karyawisatadetail/_components/DetailSiswa';
import UploadGallery from '../../karyawisatadetail/_components/GaleriFoto';

export default function EventDetail() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Ambil judul dari slug URL (misal: "Taman-Situs-Budaya" -> "Taman Situs Budaya")
const judul = searchParams.get('judul') || '';
const tanggal = searchParams.get('tanggal') || '';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <div className="flex items-center justify-between mt-14 mb-4 max-w-6xl">
          <h1 className="sm:text-3xl text-2xl text-black font-bold">
            Detail Riwayat Kegiatan: {judul}
          </h1>
          <button
            onClick={() => window.history.back()}
            className="text-gray-700 hover:text-gray-900 mr-auto ml-2 transition duration-300"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
        </div>

        {/* Komponen detail siswa dan galeri berdasarkan judul & tanggal */}
        <StudentParticipation judul={judul} tanggal={tanggal} />

        <div className="mt-5">
          <UploadGallery judul={judul} tanggal={tanggal} />
        </div>
      </main>
    </div>
  );
}
