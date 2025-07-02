'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/UserContext";

import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import AbsensiForm from "./_components/AbsensiForm";
// import AbsensiAlert from "./_components/AllertBox";
import HalamanAbsensi from "./_components/HalamanAbsensi";

export default function AbsensiSiswaPage() {
  const router = useRouter();
  const { user, loading } = useUserContext(); // Ambil dari context
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    if (loading) return; // Tunggu sampai selesai loading
    if (!user) return; // Jika belum ada user, tunggu

    if (user.role === "siswa") {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
      router.push("/unauthorized");
    }
  }, [user, loading]);

  if (loading || isAllowed === null) {
    return <p className="text-center p-4">Memuat halaman absensi...</p>;
  }

  if (!isAllowed) {
    return null; // Sudah dialihkan ke unauthorized
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl font-bold sm:mt-14 mt-12 mb-6 text-black">Absensi Apel Pagi</h1>

        <div className="mb-4">
          <HalamanAbsensi />
        </div>

        {/* <div className="mb-4">
          <AbsensiAlert />
        </div> */}

        <div>
          <AbsensiForm />
        </div>
      </main>
    </div>
  );
}
