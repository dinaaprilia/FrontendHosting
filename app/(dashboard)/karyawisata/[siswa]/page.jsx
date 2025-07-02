"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/UserContext"; // ✅ Pakai context

import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import InfoKaryaWisata from "./_components/InfoSIswaKarya";
import ClassGrid from "./_components/SeluruhKelas";

export default function KaryaWisataPage() {
  const { user, loading } = useUserContext(); // ✅ Ambil user dari context
  const [isAllowed, setIsAllowed] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (user.role === "siswa") {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
      router.push("/unauthorized");
    }
  }, [user, loading, router]);

  if (loading || isAllowed === null) {
    return <p className="text-center p-4">Memuat halaman karya wisata...</p>;
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl text-black font-bold w-full max-w-6xl mt-14 -mb-4">
          Perjalanan Karya Wisata
        </h1>

        <div className="flex justify-center mt-5">
          <InfoKaryaWisata />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md mt-5 min-h-fit">
          <div className="flex gap-4 items-center ml-4"></div>
          <ClassGrid />
        </div>
      </main>
    </div>
  );
}
