"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import AttendanceForm from "./AbsensiForm";
import StudentList from "./ListSiswa";
import BackButton from "./BackButton";

export default function AttendancePageClient() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "Tidak Diketahui";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <div className="flex items-center justify-between sm:mt-14 mt-10 sm:mb-4 mb-2 max-w-6xl">
          <h1 className="sm:text-3xl text-2xl text-black font-bold">
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
  );
}
