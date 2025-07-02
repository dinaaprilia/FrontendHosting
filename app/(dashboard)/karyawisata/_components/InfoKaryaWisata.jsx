"use client";

import { FaBullhorn } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function InfoKaryaWisata() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("-");
  const [date, setDate] = useState("-");
  const [hasData, setHasData] = useState(false);
  const [infoId, setInfoId] = useState(null); // ✅ NEW
  const [eventType] = useState("Karya Wisata");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchCurrentInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/karya-wisata-info/current-title");
      const data = res.data?.data;
      if (data) {
        setTitle(data.title || "-");
        setDate(data.tanggal || "-");
        setInfoId(data.id || null); // ✅ SAVE ID
        setHasData(!!data.title && !!data.tanggal);
      }
    } catch (err) {
      console.error("❌ Gagal mengambil data info:", err);
    }
  };

  useEffect(() => {
    fetchCurrentInfo();
  }, []);

  const handleClick = () => {
    if (!isEditing && title && date) {
      redirectToDetail(title, date);
    }
  };

  const redirectToDetail = (judul, tanggal) => {
    const slug = judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const encodedJudul = encodeURIComponent(judul);
    const encodedTanggal = encodeURIComponent(tanggal);

    router.push(`/detailkaryawisata/${slug}?judul=${encodedJudul}&tanggal=${encodedTanggal}`);
  };

  const handleEditClick = async (e) => {
    e.stopPropagation();

    if (isEditing) {
      if (!title.trim() || !date.trim() || title === "-" || date === "-") {
        setErrorMessage("Judul dan tanggal tidak boleh kosong!");
        setShowError(true);
        return;
      }

      try {
        const formattedDate = new Date(date).toISOString().split("T")[0];

        // ✅ UPDATE jika infoId ada, INSERT jika tidak
        if (infoId) {
          await axios.put(
            `http://localhost:8000/api/karya-wisata-info/${infoId}`,
            {
              title,
              tanggal: formattedDate,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          const res = await axios.post(
            "http://localhost:8000/api/karya-wisata-info",
            {
              title,
              tanggal: formattedDate,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setInfoId(res.data?.data?.id || null); // ✅ set infoId baru jika insert
        }

        setHasData(true);
        setShowSuccess(true);

        // ✅ Redirect ke detail setelah simpan/update
        redirectToDetail(title, formattedDate);
      } catch (error) {
        console.error("❌ Gagal menyimpan data:", error);
        setErrorMessage("Gagal menyimpan data.");
        setShowError(true);
      }
    }

    setIsEditing(!isEditing);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleAddNew = (e) => {
    e.stopPropagation();
    const today = new Date().toISOString().split("T")[0];
    setTitle("");
    setDate(today);
    setInfoId(null); // ✅ kosongkan infoId untuk insert baru
    setIsEditing(true);
  };

  return (
    <>
      <div
        className="bg-[#869ddd] p-6 rounded-2xl shadow-lg w-full max-w-7xl sm:h-[220px] h-auto mt-5 flex sm:flex-row flex-col justify-between items-start cursor-pointer hover:opacity-90 relative"
        onClick={handleClick}
      >
        <div className="flex-1 flex flex-col justify-center max-sm:w-full">
          <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start">
            <FaBullhorn className="text-white text-2xl" />
            <h2 className="text-white font-semibold sm:text-2xl text-xl">{eventType}</h2>
          </div>

          {isEditing ? (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-black font-medium sm:text-xl text-base mt-1 p-1 rounded max-sm:w-full max-sm:p-2 max-sm:border max-sm:rounded-lg max-sm:shadow-sm"
            />
          ) : (
            <p className="text-white font-medium sm:text-xl text-base mt-1 break-words">
              {date !== "-" && date
                ? new Date(date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>
          )}

          <div className="flex justify-center items-center sm:ml-28 ml-0 mt-2 max-sm:w-full">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul"
                className="text-black sm:text-3xl text-2xl max-sm:text-lg font-bold p-1 rounded max-sm:w-full max-sm:p-2 max-sm:border max-sm:rounded-lg max-sm:shadow-sm"
              />
            ) : (
              <p className="sm:text-3xl text-2xl font-bold text-blue-950 break-words">{title || "-"}</p>
            )}
          </div>
        </div>

        <div className="sm:w-24 w-16 sm:h-24 h-16 sm:mr-8 mr-2 overflow-hidden flex-shrink-0 sm:mt-10 mt-2">
          <img
            src="/images/tour.png"
            alt="Foto Karya Wisata"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tombol utama */}
        <div className="sm:absolute sm:bottom-4 sm:left-4 w-full flex sm:flex-row flex-col sm:gap-2 gap-3 px-4 mt-4">
          <button
            onClick={handleEditClick}
            className="bg-white text-blue-600 font-semibold sm:px-4 px-1 py-2 rounded-lg shadow sm:h-auto h-[50px] sm:w-auto w-full"
          >
            {isEditing ? "Simpan" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow sm:h-auto h-[50px] sm:w-auto w-full"
            >
              Batal
            </button>
          )}

          {hasData && !isEditing && (
            <button
              onClick={handleAddNew}
              className="bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg shadow sm:h-auto h-[50px] sm:w-auto w-full"
            >
              Tambah Baru
            </button>
          )}
        </div>
      </div>

      {/* ✅ Popup Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-green-600">Data berhasil disimpan!</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
