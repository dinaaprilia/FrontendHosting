"use client";

import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import ProfileEditPopup from "./FormEdit";
import ResetPasswordPopup from "./FormReset";
import { FaEdit, FaKey } from "react-icons/fa";

export default function ProfileCard() {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const { data, getProfileUser } = useProfile();
  const [profile, setProfile] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // trigger refresh gambar

  useEffect(() => {
    getProfileUser();
  }, [getProfileUser]);

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  // Dapat menerima timestamp dari FormEdit
  const refreshProfile = async (newTimestamp = Date.now()) => {
    const updated = await getProfileUser();
    if (updated) {
      setProfile(updated);
      setLastUpdate(newTimestamp); // paksa ganti gambar
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto sm:h-[485px] h-auto flex flex-col mt-10 px-10">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        <div className="sm:pl-10 scroll-pl-5 sm:mt-10 mt-2 ">
<img
  key={lastUpdate}
  src={
    profile?.foto_profil
      ? `https://backendfix-production.up.railway.app/storage/${profile.foto_profil}?t=${lastUpdate}`
      : "/images/profil.png"
  }
  alt="Profile"
  className="rounded-xl object-cover sm:w-[220px] w-[120px] sm:h-[200px] h-[120px] "
/>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-x-10 gap-x-2 gap-y-6 w-full sm:mt-10 mt-2 sm:pl-14">
          <div>
            <p className="font-bold sm:text-lg text-base">Nama</p>
            <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.nama}</p>
          </div>
          <div>
            <p className="font-bold sm:text-lg text-base">Jabatan</p>
            <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.role}</p>
          </div>
          {profile?.role !== "admin" && (
  <div>
    <p className="font-bold sm:text-lg text-base">
      {profile?.role === "guru" ? "NIP" : "NISN"}
    </p>
    <p className="text-gray-700 font-medium sm:text-lg text-base">
      {profile?.role === "guru" ? profile?.nip : profile?.nisn}
    </p>
  </div>
)}
          <div>
            <p className="font-bold sm:text-lg text-base">Status</p>
            <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.kelas ?? "Non-Kelas"}</p>
          </div>
          {profile?.role !== 'admin' && (
  <div>
    <p className="font-semibold sm:text-lg text-base">Jenis Kelamin</p>
    <p className="text-gray-700 font-medium sm:text-lg text-base">
      {profile?.jenis_kelamin === "L"
        ? "Laki-laki"
        : profile?.jenis_kelamin === "P"
        ? "Perempuan"
        : "-"}
    </p>
  </div>
)}

          {profile?.role !== 'admin' && (
  <div>
    <p className="font-semibold sm:text-lg text-base">Agama</p>
    <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.agama}</p>
  </div>
)}
          <div>
            <p className="font-semibold sm:text-lg text-base">No HP</p>
            <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.nomor_hp || "-"}</p>
          </div>
          <div>
            <p className="font-semibold sm:text-lg text-base">Email</p>
            <p className="text-gray-700 font-medium sm:text-lg text-base">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end sm:gap-4 gap-1 sm:mt-auto mt-4 pr-2 pb-2">
        <button
          onClick={() => setIsEditPopupOpen(true)}
          className="flex items-center gap-2 bg-[#144A8F] hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaEdit /> Edit Profil
        </button>
        <button
          onClick={() => setIsResetPopupOpen(true)}
          className="flex items-center gap-2 bg-[#1F245D] hover:bg-purple-900 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaKey /> Reset Password
        </button>
      </div>

      <ProfileEditPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onUpdated={refreshProfile} // PENTING
      />
      <ResetPasswordPopup
        isOpen={isResetPopupOpen}
        onClose={() => setIsResetPopupOpen(false)}
      />
    </div>
  );
}
