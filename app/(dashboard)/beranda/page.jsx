"use client";

import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import WelcomeBox from "./_components/WelcomeBox";
import BoxWelcome from "./siswa/_components/BoxWelcome";
import BoxTiga from "./_components/BoxTiga";
import RecentActivity from "./_components/AktivitasTerkini";
import InformasiListGuru from "./_components/Informasidata";
import ListInformsiswa from "./siswa/_components/InformasiUmum";
import HarianAbsensiee from "./siswa/_components/SekilasAbsen";
import EventCalendarGuru from "./_components/Kalender";
import EventCalendar from "./siswa/_components/KalenderSiswa";
import DaftarEkskul from "./siswa/_components/SekilasEkskul";
import WelcomeBoxortu from "./_components/OrtuBox";
import AttendanceTable from "../piket/[siswa]/_components/RiwayatSiswaPiket";
import AktivitasKegiatan from "./_components/DaftarKegiatanAkt";
import dynamic from "next/dynamic";

// Tambahkan ini:
import { useUserContext } from "@/hooks/UserContext";

// Dynamic import chart
const KehadiranChartGuru = dynamic(() => import("./_components/KehadiranChart"), {
  ssr: false,
});

export default function Beranda() {
  const { user } = useUserContext();
  const role = user?.role;

  // Optional: bisa juga buat data siswa kalau role orangtua
  const studentId = user?.childId || user?.student?.id;

  if (!user) {
    return <p className="text-center mt-10 text-red-500">Memuat data pengguna...</p>;
  }

  return (
    <div className="flex h-screen">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl text-black font-bold w-full max-w-6xl sm:mt-14 mt-10 sm:-mb-4 -mb-8">
          Dashboard
        </h1>

        {role === "guru" ? (
          <>
            <WelcomeBox />
            <BoxTiga />
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-4 mt-4">
              <div className="w-full md:w-1/2"><InformasiListGuru /></div>
              <div className="w-full md:w-1/2"><EventCalendarGuru /></div>
            </div>
            <KehadiranChartGuru />
          </>
        ) : role === "siswa" ? (
          <>
            <BoxWelcome />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div><ListInformsiswa /></div>
              <div className="mt-4 md:mt-2"><HarianAbsensiee /></div>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div><DaftarEkskul /></div>
              <div className="md:-mt-4"><EventCalendar /></div>
            </div>
          </>
        ) : role === "orangtua" ? (
          <>
            <WelcomeBoxortu />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:mt-4 mt-2">
              <div><HarianAbsensiee studentId={studentId} /></div>
              <div className="sm:mt-1 -mt-2"><DaftarEkskul studentId={studentId} /></div>
            </div>
            <div className="sm:mt-2 mt-1">
               <AttendanceTable studentId={studentId} />
            </div>
          </>
        ) : role === "admin" ? (
          <>
            <WelcomeBox />
            <BoxTiga />
            <div className="w-full max-w-6xl mx-auto">
              <RecentActivity />
            </div>
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-4 mt-4">
              <div className="w-full md:w-1/2"><InformasiListGuru /></div>
              <div className="w-full md:w-1/2"><EventCalendarGuru /></div>
            </div>
            <KehadiranChartGuru />
            <AktivitasKegiatan />
          </>
        ) : (
          <p className="text-center mt-10 text-red-500">Role tidak dikenali.</p>
        )}
      </main>
    </div>
  );
}
