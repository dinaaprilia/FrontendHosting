"use client";

import { useState, useEffect } from "react";
import { FaUserPlus, FaUsers, FaTrash } from "react-icons/fa";
import TambahAnggotaForm from "./FormTambahAnggota";
import DetailSiswaPopup from "./DetailSiswa";

export default function AnggotaEkskul() {
  const [anggotaEkskul, setAnggotaEkskul] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [anggotaToDelete, setAnggotaToDelete] = useState(null);
  const [detailPopup, setDetailPopup] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // ✅ NEW
  const [errorMessage, setErrorMessage] = useState(""); // ✅ NEW

  const fetchAnggotaEkskul = async () => {
    const ekskul = JSON.parse(localStorage.getItem("selectedEkskul"));
    const ekskulId = ekskul?.id;
    if (!ekskulId) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/anggota`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      setAnggotaEkskul(data);
    } catch (err) {
      console.error("❌ Gagal fetch anggota ekskul:", err);
      setErrorMessage("Gagal mengambil data anggota ekskul.");
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchAnggotaEkskul();
  }, []);

  const handleAddAnggota = async (anggotaBaru) => {
    const ekskulId = JSON.parse(localStorage.getItem("selectedEkskul"))?.id;
    if (!ekskulId) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/anggota`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(anggotaBaru),
      });

      if (!res.ok) throw new Error("Gagal menambahkan anggota");
      await fetchAnggotaEkskul();
    } catch (err) {
      console.error("❌ Error saat tambah anggota:", err);
      setErrorMessage("Gagal menambahkan anggota.");
      setShowErrorModal(true);
    }
  };

  const confirmDeleteAnggota = (anggota) => {
    setAnggotaToDelete(anggota);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAnggota = async () => {
    if (!anggotaToDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ekskul/anggota/${anggotaToDelete.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Gagal menghapus anggota");

      setShowDeleteConfirm(false);
      setAnggotaToDelete(null);
      await fetchAnggotaEkskul();
    } catch (err) {
      console.error("❌ Error saat hapus anggota:", err);
      setErrorMessage("Gagal menghapus anggota.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-2 bg-white rounded-2xl shadow-lg p-3 relative max-sm:px-2 h-[510px] flex flex-col">
      <div className="flex items-center justify-between border-b pb-3 mb-1 max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <div className="flex items-center gap-3 font-semibold text-xl">
          <FaUsers className="text-gray-700" />
          <span>Anggota Ekskul</span>
        </div>
        <div className="border-gray-600 border-1 flex items-center sm:ml-0 gap-2 text-gray-700">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 px-3 py-1 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm max-sm:text-xs">
          <thead className="sticky top-0 bg-white z-20">
            <tr className="text-gray-700 border-b">
              <th className="py-3 w-12 pl-4">No</th>
              <th className="text-center w-40">Nama</th>
              <th className="text-center w-32">NISN</th>
              <th className="text-center w-20">Kelas</th>
              <th className="w-6"></th>
            </tr>
          </thead>
          <tbody>
            {anggotaEkskul.map((anggota, index) => (
              <tr key={anggota.id} className="border-b max-sm:text-xs">
                <td className="py-4 text-center">{index + 1}.</td>
                <td className="py-4 text-left font-medium text-blue-800">
                  <div className="flex items-center gap-3 max-sm:gap-2">
                    <img
                      src="/images/profil.png"
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <button onClick={() => setDetailPopup(anggota)}>{anggota.nama}</button>
                  </div>
                </td>
                <td className="py-4 text-center">{anggota.nisn || "-"}</td>
                <td className="py-4 text-center">{anggota.kelas}</td>
                <td className="py-4 text-center">
                  <button onClick={() => confirmDeleteAnggota(anggota)}>
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-3">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="w-[250px] h-[40px] bg-blue-600 text-white flex items-center justify-center gap-3 py-3 rounded-lg text-lg hover:bg-blue-700 transition max-sm:w-full"
        >
          <FaUserPlus />
          Tambah Anggota
        </button>
      </div>

      {isPopupOpen && (
        <TambahAnggotaForm
          onAddAnggota={handleAddAnggota}
          onClose={() => setIsPopupOpen(false)}
          existingAnggota={anggotaEkskul} // ✅ kirim data anggota ekskul
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold">Yakin ingin menghapus anggota ini?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteAnggota}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAnggotaToDelete(null);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {detailPopup && (
        <DetailSiswaPopup
          onClose={() => setDetailPopup(null)}
          anggota={detailPopup}
        />
      )}

      {/* Modal Error */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 px-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-red-600">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
