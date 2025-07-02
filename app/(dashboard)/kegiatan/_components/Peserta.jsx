"use client";

import React, { useState } from "react";

const PesertaModal = ({ isOpen, onClose, peserta, judul, tanggal }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredPeserta = peserta.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-center text-lg sm:text-xl font-bold mb-4 text-gray-800">
          Daftar Ikut Serta <span className="text-blue-800">{judul}</span>
          {/* <div className="text-gray-500 text-sm font-normal mt-1">
            {formatTanggal(tanggal)}
          </div> */}
        </h2>

        {peserta.length > 0 ? (
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="max-h-80 overflow-y-auto rounded-md border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">No</th>
                    <th className="px-4 py-2 text-left border-b">Nama</th>
                    <th className="px-4 py-2 text-left border-b">Kelas</th>
                    <th className="px-4 py-2 text-left border-b">NISN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeserta.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2 border-b">{i + 1}</td>
                      <td className="px-4 py-2 border-b">{p.nama}</td>
                      <td className="px-4 py-2 border-b">{p.kelas}</td>
                      <td className="px-4 py-2 border-b">{p.nisn}</td>
                    </tr>
                  ))}
                  {filteredPeserta.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-gray-500 py-4"
                      >
                        Tidak ditemukan siswa dengan nama tersebut.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">Tidak ada peserta</p>
        )}
      </div>
    </div>
  );
};

export default PesertaModal;
