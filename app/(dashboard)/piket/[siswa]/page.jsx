"use client";
import { useState } from "react";
import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import PiketCard from "./_components/PiketCard";
import AttendanceTable from "./_components/RiwayatSiswaPiket";
import AttendanceForm from "./_components/PiketForm";


export default function PiketSiswa() {
  // ✅ useState & function harus di sini
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJadwalTersimpan = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl text-black font-bold w-full max-w-6xl sm:mt-14 mt-12 -mb-4">
          Piket Harian Siswa
        </h1>

        <div className="flex justify-center mt-5">
          <PiketCard key={refreshKey} />
        </div>

        <div className="flex justify-center sm:mt-3 mt-1">
          <AttendanceTable key={refreshKey} />
        </div>

        <div className="justify-center mt-3">
          <AttendanceForm key={refreshKey} />
        </div>
      </main>
    </div>
  );
}
