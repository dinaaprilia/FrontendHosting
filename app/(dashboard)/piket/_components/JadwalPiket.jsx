import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function JadwalPiketPopup({ onClose, onSimpan }) {
  const [tanggal, setTanggal] = useState("");
  const [kelas, setKelas] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const kelasOptions = ["X-A", "X-B", "X-C", "XI-A", "XI-B", "XI-C", "XII-A", "XII-B", "XII-C"];

  const handleSubmit = async () => {
    if (!tanggal || !kelas) {
      setErrorMessage("Tanggal dan kelas wajib diisi!");
      setShowError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/piket-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tanggal, kelas }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
      } else {
        setErrorMessage(data.message || "Gagal menyimpan jadwal piket");
        setShowError(true);
      }
    } catch (err) {
      console.error("Gagal kirim:", err);
      setErrorMessage("Terjadi kesalahan saat mengirim data.");
      setShowError(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (onSimpan) onSimpan();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80 max-sm:w-[90%] max-sm:max-h-[90vh] max-sm:overflow-y-auto relative">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={onClose}
          >
            <AiOutlineClose size={24} />
          </button>
          <h2 className="text-lg font-bold text-center mb-4 max-sm:text-base">Atur Jadwal Piket</h2>

          <div className="max-sm:text-sm">
            <label className="block font-semibold">Hari/Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full p-2 mt-1 border rounded bg-gray-200"
            />
          </div>

          <div className="mt-4 max-sm:text-sm">
            <label className="block font-semibold">Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full p-2 mt-1 border rounded bg-gray-200"
            >
              <option value="">Pilih Kelas</option>
              {kelasOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 w-full bg-green-600 text-white p-2 rounded max-sm:text-sm"
            onClick={handleSubmit}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* ✅ POPUP Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-green-600">
              Jadwal piket berhasil disimpan!
            </p>
            <button
              onClick={handleCloseSuccess}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ❌ POPUP Error */}
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
