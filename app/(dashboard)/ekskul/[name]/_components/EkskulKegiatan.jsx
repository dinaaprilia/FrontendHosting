"use client";

import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";

function formatDateToText(dateStr) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  const monthName = months[parseInt(month, 10) - 1];
  return `${day} ${monthName} ${year}`;
}

export default function KegiatanEksCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState(""); // ✅ NEW
  const [kegiatanId, setKegiatanId] = useState(null);
  const [namaEkskul, setNamaEkskul] = useState("-");
  const [ekskulId, setEkskulId] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const selected = localStorage.getItem("selectedEkskul");
      if (selected) {
        const parsed = JSON.parse(selected);
        setNamaEkskul(parsed.name || "-");
        setEkskulId(parsed.id || null);
      }
    }
  }, []);

  useEffect(() => {
    if (!ekskulId) return;
    fetch(`http://localhost:8000/api/ekskul/${ekskulId}/kegiatan`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTitle(data[0].title);
          setDate(data[0].date);
          setStartDate(data[0].start); // ✅ NEW
          setKegiatanId(data[0].id);
        }
      })
      .catch((err) => {
        setErrorMessage("Gagal memuat data kegiatan");
        setShowError(true);
        console.error("❌ Gagal fetch kegiatan:", err);
      });
  }, [ekskulId]);

  const handleEditClick = async (e) => {
    e.stopPropagation();
    if (isEditing) {
      if (!title || !date || !startDate) {
        setErrorMessage("Judul, tanggal mulai, dan tanggal akhir wajib diisi!");
        setShowError(true);
        return;
      }

      try {
        if (kegiatanId) {
          await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/kegiatan/${kegiatanId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, date, start: startDate }) // ✅ NEW
          });
        } else {
          const res = await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/kegiatan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, date, start: startDate }) // ✅ NEW
          });
          const result = await res.json();
          setKegiatanId(result.data.id);
        }

        setShowSuccess(true);
      } catch (err) {
        console.error("❌ Gagal simpan:", err);
        setErrorMessage("Gagal menyimpan kegiatan.");
        setShowError(true);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    if (!kegiatanId) return;
    try {
      await fetch(`http://localhost:8000/api/kegiatan/${kegiatanId}`, {
        method: "DELETE",
      });
      setTitle("");
      setDate("");
      setStartDate("");
      setKegiatanId(null);
      setShowSuccess(true);
    } catch (err) {
      console.error("❌ Gagal hapus:", err);
      setErrorMessage("Gagal menghapus kegiatan.");
      setShowError(true);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-7xl h-[220px] max-sm:h-auto mt-1 flex max-sm:flex-col max-sm:gap-4 max-sm:items-center justify-between items-start cursor-default hover:opacity-90 relative">
        <div className="flex-1 flex flex-col justify-center max-sm:items-center max-sm:text-center">
          <div className="flex items-center gap-2 max-sm:flex-col max-sm:gap-1 max-sm:mb-2">
            <FaBullhorn className="text-black sm:text-2xl text-xl" />
            <h2 className="text-black font-semibold sm:text-2xl text-xl">{namaEkskul}</h2>
          </div>

          {/* ✅ Tanggal Mulai */}
          {isEditing && (
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-[200px] text-black font-medium text-base mt-1 p-2 border rounded-lg shadow-sm"
  />
)}

          {/* ✅ Tanggal Akhir */}
          {isEditing ? (
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-[200px] text-black font-medium text-base mt-1 p-2 border rounded-lg shadow-sm"
  />
) : (
  <p className="text-black font-medium text-base mt-1">
    {formatDateToText(date)}
  </p>
)}

          <div className="flex justify-center items-center ml-28 mt-2 max-sm:ml-0">
          {isEditing ? (
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Judul Kegiatan"
    className="text-black sm:text-3xl text-2xl max-sm:text-lg font-bold p-1 rounded max-sm:w-full max-sm:px-3 max-sm:py-2 max-sm:border max-sm:rounded-lg max-sm:shadow-sm"
  />
) : (
  <p className="sm:text-3xl text-2xl font-bold text-blue-950">{title || "-"}</p>
)}
          </div>
        </div>

        <div className="w-32 h-28 mr-8 overflow-hidden flex-shrink-0 mt-10 max-sm:mt-0 max-sm:mr-0 max-sm:w-24 max-sm:h-24">
          <img
            src="/images/Ekskul.png"
            alt="logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap max-sm:static max-sm:mt-4">
  {/* Tombol Tambah Baru */}
  {!isEditing && (
    <button
      onClick={() => {
        setTitle("");
        setDate("");
        setStartDate("");
        setKegiatanId(null);
        setIsEditing(true);
      }}
      className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-700"
    >
      Tambah Baru
    </button>
  )}

  {/* Tombol Simpan / Update */}
  <button
    onClick={handleEditClick}
    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700"
  >
    {isEditing ? "Simpan" : "Update Kegiatan"}
  </button>

  {/* Tombol Batal (saat editing) */}
  {isEditing && (
    <button
      onClick={() => setIsEditing(false)}
      className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-500"
    >
      Batal
    </button>
  )}

  {/* Tombol Hapus (saat editing dan ada data) */}
  {isEditing && kegiatanId && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
      className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-700"
    >
      Hapus
    </button>
  )}
</div>
      </div>

      {/* ✅ Popup Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-green-600">
              Berhasil menyimpan perubahan!
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ❌ Popup Gagal */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-red-600">{errorMessage}</p>
            <button
              onClick={() => setShowError(false)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
