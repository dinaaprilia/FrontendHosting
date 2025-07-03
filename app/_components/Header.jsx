'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useUserContext } from "@/hooks/UserContext";

// ✅ Fungsi untuk format nama siswa
function formatNamaSiswa(nama) {
  if (!nama) return "";
  const parts = nama.trim().split(" ");
  if (parts.length <= 3) return nama;

  return [
    parts[0], // nama depan
    parts[1]?.[0] + ".", // nama tengah 1 → inisial
    parts[2]?.[0] + ".", // nama tengah 2 → inisial
    parts[parts.length - 1] // nama belakang
  ].join(" ");
}

const Header = () => {
  const router = useRouter();
  const { user } = useUserContext(); // ✅ Ambil user dari context

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="w-full bg-[#98abe2] shadow-md p-6 fixed top-0 left-0 z-50 flex justify-between items-center">
      {/* Mobile */}
      <div className="flex sm:hidden bg-[#f9fafd] p-2 rounded-full shadow-md items-center space-x-2 absolute sm:right-4 right-2 sm:top-2 top-1">
        <img
          src={
           "/images/profil.png"
          }
          alt="Profile"
          className="sm:w-8 w-6 sm:h-8 h-6 rounded-full object-cover"
        />
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 transition text-xl"
        >
          <RiLogoutCircleRLine />
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex bg-[#f9fafd] p-3 rounded-3xl shadow-md items-center space-x-3 h-10 absolute right-6 top-1">
        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
          <img
            src={
              user?.foto_profil
                ? `https://backendfix-production.up.railway.app/storage/${user.foto_profil}`
                : "/images/profil.png"
            }
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="text-left leading-tight">
          {user ? (
            <>
              <p className="text-black text-sm font-medium">
                {formatNamaSiswa(user.nama)}
              </p>
              <p className="text-black text-xs capitalize">{user.role}</p>
            </>
          ) : (
            <p className="text-black text-sm font-medium">Memuat...</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 transition text-xl ml-2"
        >
          <RiLogoutCircleRLine />
        </button>
      </div>
    </header>
  );
};

export default Header;
