"use client";
import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import WelcomeBox from "./_components/BoxWelcome";
import ListInformsiswa from "./_components/InformasiUmum";
import EventCalendar from "./_components/KalenderSiswa";
// import dynamic from "next/dynamic"; // <== Tambahkan ini
import HarianAbsensi from "./_components/SekilasAbsen";
import DaftarEkskul from "./_components/SekilasEkskul";

// const AttendanceChart = dynamic(() => import("./_components/GrafikKehadiran"), {
//   ssr: false,
// });

export default function Beranda() {
  return (
    <div className="flex h-screen">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="text-3xl text-black font-bold w-full max-w-6xl mt-14 -mb-4">
          Dashboard
        </h1>

        <WelcomeBox />

        {/* RecentActivity lebih lebar */}
        <div className="w-full max-w-6xl mx-auto">

        </div>

        {/* <div className="flex max-w-6xl mx-auto ml-auto">
          <InformasiCard />
        </div> */}
        <div className="flex max-w-6xl mx-auto gap-4 mt-4">
          <div className="w-1/2">
            <ListInformsiswa />
          </div>
          <div className="w-1/2 mt-1">
            <HarianAbsensi />
          </div>
        </div>
        <div className="flex max-w-6xl mx-auto gap-4 mt-4">
          <div className="w-1/2">
            <DaftarEkskul />
          </div>
          <div className="w-1/2">
            <EventCalendar />
          </div>
        </div>

      </main>
    </div>
  );
}