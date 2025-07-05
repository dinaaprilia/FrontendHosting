"use client";

import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import StudentCard from "./DetailSiswa";
import AttendanceTable from "./RiwayatBulanan";

export default function DetailAbsensiClient() {
  const searchParams = useSearchParams();
  const nama = searchParams.get("nama") || "Nama Tidak Diketahui";

  return (
    <main className="flex-1 bg-gray-200 p-4 flex flex-col items-center justify-start w-full overflow-y-auto">
      <div className="w-full max-w-6xl sm:mt-14 mt-10 -mb-3 flex items-center justify-between">
        <h1 className="sm:text-3xl text-2xl text-black font-bold">
          Detail Kehadiran Siswa
        </h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition duration-300 mr-auto ml-2"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      <StudentCard />
      <AttendanceTable />
    </main>
  );
}
