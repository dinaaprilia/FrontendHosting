"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Menambahkan useRouter untuk routing
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const initialClasses = [
  "X-A", "X-B", "X-C",
  "XI-A", "XI-B", "XI-C",
  "XII-A", "XII-B", "XII-C" // Tambahkan kelas sesuai kebutuhan
];

const ClassGrid = () => {
  const [classes, setClasses] = useState(initialClasses);
  const router = useRouter(); // ✅ Inisialisasi router

  const handleClassClick = (className) => {
router.push(`/inputkaryawisata/siswa?kelas=${encodeURIComponent(className)}`);
  };

  const handleButtonClick = () => {
    router.push("/riwayatkarya");
  };

  return (
    <div className="p-2">
      <button 
        className="bg-[#869ddd] flex items-center gap-2 text-blue-950 font-semibold py-2 px-4 rounded-lg shadow "
        onClick={handleButtonClick}
      >
        <FaSearch className="text-blue-950 text-lg" />
        Lihat Perjalanan Sebelumnya
      </button>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {classes.map((className) => ( // ✅ Mengganti key dari index ke className
          <motion.button 
            key={className} 
            type="button" // ✅ Tambahan untuk mencegah submit jika dalam form
            aria-label={`Pilih kelas ${className}`} // ✅ Tambahan untuk aksesibilitas
            className="border-[#8ba1df] border-2 text-blue-950 text-2xl font-bold py-4 rounded-lg text-center shadow-lg h-[120px] flex items-center justify-center cursor-pointer transition-all w-full"
            whileHover={{ scale: 1.08, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)" }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={() => handleClassClick(className)}
          >
            {className}
          </motion.button>
        ))}
      </div>
      
      {/* Button Lihat Perjalanan Sebelumnya */}
      
    </div>
  );
};

export default ClassGrid;