import React, { Suspense } from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import DetailAbsensiClient from "./_components/DetailAbsensiClient";

export default function DetailAbsensiPage() {
  return (
    <div className="flex h-screen">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Client Component dibungkus Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <DetailAbsensiClient />
      </Suspense>
    </div>
  );
}
