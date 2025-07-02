"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/UserContext"; // ✅ pakai UserContext

import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import EkskulList from "./_components/Ekskulpage";

export default function Ekskul() {
  const { user, loading } = useUserContext(); // ✅ ambil user & loading dari context
  const [isAllowed, setIsAllowed] = useState(null); // null: loading
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // tunggu data selesai di-fetch
    if (!user) return;

    if (user.role === "siswa") {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
      router.push("/unauthorized");
    }
  }, [user, loading]);

  if (loading || isAllowed === null) {
    return <p className="text-center p-4">Memuat halaman ekskul...</p>;
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl text-black font-bold w-full max-w-6xl sm:mt-14 mt-12 -mb-4">
          Ekstra Kulikuler
        </h1>

        <EkskulList />
      </main>
    </div>
  );
}
