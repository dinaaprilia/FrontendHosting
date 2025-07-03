"use client";
import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import ProfileCard from "./_components/ProfilAkun";

export default function Profil() {
  return (
    <div className="flex sm:h-screen h-auto"> 
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="sm:text-3xl text-2xl text-black font-bold w-full max-w-6xl sm:mt-14 mt-10 sm:-mb-4 -mb-8">
          Profil
        </h1>

    <ProfileCard/>

      </main>
    </div>
  );
}
