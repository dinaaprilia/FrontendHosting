"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";

export default function UploadGallery({ judul, tanggal }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (judul && tanggal && judul !== "-" && tanggal !== "-") {
      fetchUploadedImages();
    }
  }, [judul, tanggal]);

  const fetchUploadedImages = async () => {
    try {
      const res = await axios.get(`https://backendfix-production.up.railway.app/api/karya-wisata/galeri`, {
        params: { judul, tanggal },
      });
      setUploadedImages(res.data?.data || []);
    } catch (error) {
      console.error("Gagal fetch gallery:", error);
    }
  };

  const handleImageUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    const newPreview = [...previewImages];
    const newFiles = [...files];
    newPreview.splice(index, 1);
    newFiles.splice(index, 1);
    setPreviewImages(newPreview);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (!judul || !tanggal || files.length === 0) {
      setErrorMessage("Judul, tanggal, dan gambar tidak boleh kosong.");
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("tanggal", tanggal);
    files.forEach((file) => formData.append("files[]", file));

    try {
      const res = await fetch("https://backendfix-production.up.railway.app/api/karya-wisata/upload-gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowSuccess(true);
        setPreviewImages([]);
        setFiles([]);
        fileInputRef.current.value = null;
        fetchUploadedImages();
      } else {
        setErrorMessage("❌ Gagal upload!");
        setShowError(true);
      }
    } catch (error) {
      console.error("Upload gagal:", error);
      setErrorMessage("Terjadi kesalahan saat upload.");
      setShowError(true);
    }
  };

  const handleDeleteImage = (id) => {
    setSelectedImageId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`https://backendfix-production.up.railway.app/api/karya-wisata/gallery/${selectedImageId}`);
      if (res.data?.status === "success") {
        fetchUploadedImages();
      } else {
        setErrorMessage("❌ Gagal menghapus gambar.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Gagal hapus gambar:", error);
      setErrorMessage("Gagal menghapus gambar.");
      setShowError(true);
    } finally {
      setShowConfirmDelete(false);
      setSelectedImageId(null);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-md w-full mx-auto">
        <p className="text-gray-700">
          📌 Judul: <strong>{judul || "-"}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          📅 Tanggal: <strong>{tanggal || "-"}</strong>
        </p>

        <label className="cursor-pointer flex items-center justify-center p-3 bg-blue-200 rounded-md hover:bg-blue-300 transition mb-4">
          <FiUploadCloud className="mr-2" />
          <span className="font-medium text-gray-700">Upload Gambar</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            ref={fileInputRef}
            accept="image/*"
          />
        </label>

        {previewImages.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600 font-semibold mb-2">Preview (belum diupload)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previewImages.map((src, index) => (
                <div key={index} className="relative group">
                  <img src={src} alt={`Preview ${index}`} className="w-full h-auto rounded-md shadow-sm" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600 font-semibold mb-2">Foto Tersimpan</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {uploadedImages.map((img, index) => (
                <div key={img.id} className="relative group">
                  <img
                    src={`https://backendfix-production.up.railway.app${img.url}`}
                    alt={`Uploaded ${index}`}
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    title="Hapus Foto"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Upload ke Sistem
          </button>
        </div>
      </div>

      {/* ✅ Popup Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-green-600">✅ Gambar berhasil diupload!</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ❌ Popup Error */}
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

      {/* 🗑️ Konfirmasi Hapus */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold">Yakin ingin menghapus gambar ini?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
