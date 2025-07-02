"use client";

import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";

  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Makassar",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function UploadPhotoModal({ onClose }) {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [uploadDate, setUploadDate] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // ⬅️ Alert ketika deskripsi kosong

  useEffect(() => {
    const ekskulId = JSON.parse(localStorage.getItem("selectedEkskul"))?.id;
    if (!ekskulId) return;

    fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/galeri`)
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("❌ Gagal fetch galeri:", err));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedImageFile(file);
      setUploadDate(new Date().toISOString());
    }
  };

  const handleSave = async () => {
    const ekskulId = JSON.parse(localStorage.getItem("selectedEkskul"))?.id;
    if (!selectedImageFile || !ekskulId) return;

    if (!description.trim()) {
      setShowAlert(true); // ⬅️ Tampilkan alert jika kosong
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImageFile);
    formData.append("description", description);

    try {
      const res = await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/galeri`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setGallery((prev) => [...prev, data.data]);
      setSelectedImage(null);
      setSelectedImageFile(null);
      setDescription("");
    } catch (err) {
      console.error("❌ Gagal upload:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/galeri/${id}`, {
        method: "DELETE",
      });
      setGallery((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Gagal hapus gambar:", err);
    }
  };

  const handleConfirmYes = () => {
    handleDelete(selectedDeleteId);
    setShowConfirm(false);
    setSelectedDeleteId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MdPhotoLibrary size={24} /> Galeri Dokumentasi Ekskul
        </h2>

        <div className="mb-4 flex justify-end">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-start gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition w-fit"
          >
            <FaCloudUploadAlt size={20} />
            Unggah Foto
          </label>
        </div>

        {selectedImage && (
          <div className="mt-4 flex flex-col items-center w-full">
            <div className="w-full flex flex-col items-center">
              <div className="w-[300px] h-[200px] md:w-[400px] md:h-[250px] overflow-hidden rounded-lg border shadow-lg">
                <img
                  src={selectedImage}
                  alt="Unggahan"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                📅 {formatDateTime(uploadDate)}
              </p>
            </div>
            <textarea
              className="w-full mt-2 p-2 border rounded-lg shadow-sm"
              placeholder="Tambahkan keterangan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
              onClick={handleSave}
            >
              <IoIosSave size={20} /> Simpan
            </button>
          </div>
        )}

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 shadow-sm flex flex-col items-center"
              >
                <div className="relative w-full">
                  <img
                    src={item.imageUrl}
                    alt="Unggahan"
                    className="w-full h-40 object-cover rounded"
                  />
                  <button
                    onClick={() => {
                      setSelectedDeleteId(item.id);
                      setShowConfirm(true);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  📅 {formatDateTime(item.uploaded_at)}
                </p>
                <p className="mt-1">📝 {item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Konfirmasi hapus */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 font-semibold">Anda yakin ingin menghapus gambar ini?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmYes}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Ya
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedDeleteId(null);
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert deskripsi wajib */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 font-semibold text-red-600">
                Keterangan tidak boleh kosong!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAlert(false)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
          onClick={onClose}
        >
          <IoClose size={20} /> Tutup
        </button>
      </div>
    </div>
  );
}
