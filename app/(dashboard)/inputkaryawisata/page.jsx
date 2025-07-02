import React, { Suspense } from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import InputKaryaWisataClient from "./_components/InputKaryaWisataClient";

export default function InputKaryaWisataPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <Suspense fallback={<div>Loading...</div>}>
        <InputKaryaWisataClient />
      </Suspense>
    </div>
  );
}
