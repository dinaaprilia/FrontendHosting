"use client";

import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import AttendanceForm from "./_components/AbsensiForm";
import StudentList from "./_components/ListSiswa";
import BackButton from "./_components/BackButton";

export default function InputAbsensiPage({ searchParams }) {
  const kelas = searchParams.kelas || "Tidak Diketahui";

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-100">

      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      <div className="flex flex-1 pt-16">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 w-full max-w-6xl mx-auto p-4 bg-gray-200 overflow-y-auto">
          <div className="flex items-center justify-between mt-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Input Absensi - {kelas}
            </h1>
            <BackButton />
          </div>

          <div className="mt-5">
            <AttendanceForm />
          </div>

 
          <div className="mt-5">
            <StudentList />
          </div>
        </main>
      </div>
    </div>
  );
}
