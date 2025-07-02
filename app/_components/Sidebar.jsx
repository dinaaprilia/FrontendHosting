"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaUserPlus,
  FaClipboardList,
  FaPaintBrush,
  FaClipboardCheck,
  FaBus,
  FaBars,
  FaPlusCircle,
} from 'react-icons/fa';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { useUserContext } from "@/hooks/UserContext"; // ✅ gunakan context

const allMenuItems = [
  { name: 'Beranda', icon: <FaHome />, path: '/beranda' },
  { name: 'Profil', icon: <IoPerson />, path: '/kelolaprofil' },
  { name: 'Tambah Akun', icon: <FaUserPlus />, path: '/tambahakun' },
  { name: 'Kegiatan', icon: <FaPlusCircle />, path: '/kegiatan' },
  { name: 'Absensi', icon: <FaClipboardList />, path: '/absensi' },
  { name: 'Ekskul', icon: <FaPaintBrush />, path: '/ekskul' },
  { name: 'Piket', icon: <FaClipboardCheck />, path: '/piket' },
  { name: 'Karya Wisata', icon: <FaBus />, path: '/karyawisata' },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useUserContext(); // ✅ pakai context

  const showFullMenu = isMobileOpen || !isCollapsed;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const collapsedState = localStorage.getItem("sidebarCollapsed") === "true";
    setIsCollapsed(collapsedState);
  }, [pathname]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState);
  };

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleMenuClick = (path) => {
    if (path) {
      router.push(path);
      if (isMobile) setIsMobileOpen(false);
    }
  };

  const menuItems = allMenuItems
    .map(item => {
      if (!user) return null;

      const role = user.role;
      const kelasGuru = user.kelas?.toUpperCase() || "";
      const isWaliKelas = /^(X|XI|XII)-[A-Z]$/.test(kelasGuru);

      if (item.name === "Absensi" && role === "siswa") return { ...item, path: "/absensi/siswa" };
      if (item.name === "Ekskul" && role === "siswa") return { ...item, path: "/ekskulsiswa" };
      if (item.name === "Piket" && role === "siswa") return { ...item, path: "/piket/siswa" };
      if (item.name === "Karya Wisata" && role === "siswa") return { ...item, path: "/karyawisata/siswa" };

      return item;
    })
    .filter(item => {
      if (!item || !user) return false;

      const role = user.role;
      const kelasGuru = user.kelas?.toUpperCase() || "";
      const isWaliKelas = /^(X|XI|XII)-[A-Z]$/.test(kelasGuru);

      if (role === "siswa" && (item.name === "Tambah Akun" || item.name === "Kegiatan")) return false;
      if (role === "orangtua" && item.name !== "Beranda") return false;
      if (item.name === "Tambah Akun" && !(role === "admin" || (role === "guru" && isWaliKelas))) return false;
      if (item.name === "Kegiatan" && role === "guru" && isWaliKelas) return false;

      return true;
    });

  return (
    <>
      <button
        className="md:hidden fixed sm:top-4 top-2 left-4 z-[60] bg-[#728cd3] text-white p-2 rounded-full shadow-lg"
        onClick={toggleMobileSidebar}
      >
        <FaBars />
      </button>

      {isMobile && (
        <div
          className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-40 bg-black bg-opacity-40 backdrop-blur-sm ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`fixed md:static top-0 left-0 h-screen z-[70] bg-[#98abe2] drop-shadow-lg text-white
        transition-all duration-700 ease-in-out
        ${isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        md:flex md:flex-col
        ${isMobile ? 'w-4/5' : (isCollapsed ? 'w-20' : 'w-64')}
      `}>
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-8 bg-[#728cd3] p-2 rounded-full hover:bg-[#639fe9] focus:outline-none shadow-lg hidden md:block"
        >
          <FaBars className={`text-white transition-transform duration-700 ease-in-out ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center justify-center pt-8 px-4 mb-8 h-20">
          <img
            src="/images/logosevh.png"
            alt="logo"
            width={70}
            height={70}
            className={`transition-transform duration-700 ease-in-out ${isCollapsed ? 'scale-75' : 'scale-100'}`}
          />
        </div>

        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => {
              const isActive =
                pathname === item.path ||
                (item.path === "/beranda" && pathname.startsWith("/beranda/siswa")) ||
                (item.path === "/absensi" && pathname.startsWith("/absensi/siswa")) ||
                (item.path === "/absensi" && (
                  pathname.startsWith("/Inputabsensi") ||
                  pathname.startsWith("/ringkasanabsensi") ||
                  pathname.startsWith("/detailabsensi")
                )) ||
                ((item.path === "/ekskul" || item.path === "/ekskulsiswa") &&
                  (pathname.startsWith("/ekskul/") || pathname.startsWith("/ekskulsiswa/"))) ||
                (item.path === "/piket" && (
                  pathname.startsWith("/Inputpiket") ||
                  pathname.startsWith("/AbsensiPiket")
                )) ||
                (item.path === "/karyawisata" && (
                  pathname.startsWith("/detailkaryawisata/") ||
                  pathname.startsWith("/inputkaryawisata") ||
                  pathname.startsWith("/karyawisatadetail")
                ));

              return (
                <li
                  key={index}
                  className={`relative flex items-center p-2 cursor-pointer rounded-xl mx-3 transition-all duration-700 ${isActive ? "bg-[#728cd3]" : "hover:bg-[#3f84d8]"}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <span className={`text-lg ${isCollapsed ? 'w-20 flex justify-center' : 'ml-6'}`}>
                    {item.icon}
                  </span>
                  <span className={`ml-2 text-lg ${!showFullMenu ? 'hidden' : 'block'}`}>
                    {item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
