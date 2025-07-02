"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import ListForm from "./ListTour";
import StudentList from "./ListSiswa";

export default function InputKaryaWisataClient() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "Tidak Diketahui";

  return (
    <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
      <div className="flex items-center justify-between mt-14 mb-4 max-w-6xl">
        <h1 className="text-3xl text-black font-bold">
          List Ikut Serta Siswa {kelas}
        </h1>
        <button
          onClick={() => window.history.back()}
          className="text-gray-700 hover:text-gray-900 mr-auto ml-2 transition duration-300"
        >
          <FaArrowLeft className="text-2xl " />
        </button>
      </div>

      <ListForm />

      <div className="mt-5">
        <StudentList />
      </div>
    </main>
  );
}
