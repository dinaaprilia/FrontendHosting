"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import UploadPhotoModal from "./GaleriEkskul";

export default function ImageBox() {
  const [imageSrc, setImageSrc] = useState("/images/default.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ekskulName, setEkskulName] = useState("Ekskul");
  const [mentor, setMentor] = useState("Mentor");
  const [ekskulId, setEkskulId] = useState(null);

  const buildImageURL = (rawImage) => {
    if (!rawImage) return "/images/default-image.jpg";
    return rawImage.startsWith("http")
      ? rawImage
      : `https://backendfix-production.up.railway.app/${rawImage.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const storedEkskul = localStorage.getItem("selectedEkskul");
    if (storedEkskul) {
      try {
        const parsed = JSON.parse(storedEkskul);
        setImageSrc(buildImageURL(parsed.image));
        setEkskulName(parsed.name || "Ekskul");
        setMentor(parsed.mentor || "Tidak Diketahui");
        setEkskulId(parsed.id || null);
      } catch (e) {
        console.error("❌ Gagal parsing selectedEkskul:", e.message);
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const stored = localStorage.getItem("selectedEkskul");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setImageSrc(buildImageURL(parsed.image));
            setEkskulName(parsed.name || "Ekskul");
            setMentor(parsed.mentor || "Tidak Diketahui");
            setEkskulId(parsed.id || null);
          } catch (e) {
            console.error("❌ Gagal parsing selectedEkskul:", e.message);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center sm:p-4 p-2 relative">
      <div className="w-full sm:max-w-7xl max-w-5xl relative">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt="Group Photo"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay transparan */}
        <div className="absolute inset-0 bg-indigo-500/50 rounded-2xl"></div>

        {/* Konten Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-3xl text-white font-extrabold drop-shadow">
            {ekskulName}
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white text-sm sm:text-base">
            <FaUserTie size={18} />
            <span className="font-medium">{mentor}</span>
          </div>

          <button
            className="mt-2 sm:mt-4 flex items-center gap-2 bg-[#121e42] text-white text-sm sm:text-base py-1.5 px-4 sm:px-6 rounded-md sm:rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <AiFillPicture size={18} />
            Lihat Galeri Ekskul
          </button>
        </div>
      </div>

      {isModalOpen && <UploadPhotoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
