"use client";

import React, { useState, useEffect } from "react";
import { FaPlayCircle, FaCheckCircle } from "react-icons/fa";
import ActivityNowPopup from "./KegiatanBerlangsung";
import ActivityEndPopup from "./KegiatanSelesai";

const KegiatanSummary = () => {
  const [popupType, setPopupType] = useState(null);
  const [summary, setSummary] = useState({
    berlangsung: 0,
    selesai: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/jumlah-kegiatan")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSummary(data.data);
        }
      })
      .catch((error) => {
        console.error("Gagal memuat data summary:", error);
      });
  }, []);

  const data = [
    {
      label: "Kegiatan Berlangsung",
      value: summary.berlangsung,
      icon: <FaPlayCircle className="text-[#2d6ec4] text-5xl" />,
      borderColor: "border-[#2d6ec4]",
      bgColor: "bg-white",
      textColor: "text-[#2d6ec4]",
      popup: "KegiatanBerlangsung",
    },
    {
      label: "Kegiatan Selesai",
      value: summary.selesai,
      icon: <FaCheckCircle className="text-[#337C8E] text-5xl" />,
      borderColor: "border-[#337C8E]",
      bgColor: "bg-white",
      textColor: "text-[#337C8E]",
      popup: "KegiatanSelesai",
    },
  ];

  const handleClick = (popup) => {
    setPopupType(popup);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 p-4 justify-center">
      {data.map((item, index) => (
        <button
          key={index}
          className={`flex flex-col items-center p-6 border-4 rounded-xl shadow-md ${item.borderColor} ${item.bgColor} ${item.textColor} cursor-pointer hover:brightness-105 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          onClick={() => handleClick(item.popup)}
        >
          <div className="mb-4">{item.icon}</div>
          <p className="text-lg font-semibold">{item.label}</p>
          <p className="text-3xl font-bold mt-2">{item.value}</p>
        </button>
      ))}

      {popupType === "KegiatanBerlangsung" && (
        <ActivityNowPopup onClose={() => setPopupType(null)} />
      )}
      {popupType === "KegiatanSelesai" && (
        <ActivityEndPopup onClose={() => setPopupType(null)} />
      )}
    </div>
  );
};

export default KegiatanSummary;
