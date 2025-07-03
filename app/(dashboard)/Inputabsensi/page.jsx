import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import { FaArrowLeft } from "react-icons/fa";
import AttendanceForm from "./_components/AbsensiForm";
import StudentList from "./_components/ListSiswa";
import BackButton from "./_components/BackButton";

export default function InputAbsensiPage({ searchParams }) {
  const kelas = searchParams.kelas || "Tidak Diketahui";
  return (
    <div className="flex h-screen">
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
