"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PopupForm({ onAddEkskul, onClose }) {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [ekskulName, setEkskulName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); // 🆕 Konfirmasi

  const API_URL = 'https://backendfix-production.up.railway.app/api';

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMsg('Token tidak ditemukan. Silakan login ulang.');
          return;
        }

        const res = await axios.get(`${API_URL}/users?role=guru`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dataGuru = Array.isArray(res.data) ? res.data : res.data.data;
        setAdmins(dataGuru);
      } catch (err) {
        console.error('❌ Gagal fetch admin:', err.response?.data || err.message);
        setErrorMsg('Gagal mengambil daftar guru. Pastikan Anda sudah login.');
      }
    };

    fetchAdmins();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // ✅ Konfirmasi 'Ya'
  const handleConfirmYes = () => {
    setShowConfirm(false);
    handleCreateEkskul(); // lanjut buat ekskul
  };

  // ✅ Validasi awal → munculkan konfirmasi
  const handleBuatClick = () => {
    if (!ekskulName || !selectedAdmin) {
      setErrorMsg('Nama ekskul dan penanggung jawab harus diisi.');
      return;
    }
    setShowConfirm(true);
  };

  const handleCreateEkskul = async () => {
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', ekskulName);
    formData.append('mentor', selectedAdmin);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ekskul`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Ekskul berhasil dibuat:', response.data);
      onAddEkskul(response.data);
      onClose();
    } catch (err) {
      console.error('Gagal membuat ekskul:', err.response?.data || err.message);
      setErrorMsg('Gagal membuat ekskul. Pastikan semua data valid dan Anda terautentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FORM UTAMA */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 text-xl font-bold"
          >
            ✖
          </button>
          <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Tambah Ekstrakurikuler</h2>

          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="mb-3">
            <label className="block font-semibold">Nama Ekskul</label>
            <input
              type="text"
              placeholder="Contoh: Basket, Paduan Suara"
              value={ekskulName}
              onChange={(e) => setEkskulName(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold">Penanggung Jawab (Guru)</label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              <option value="">-- Pilih Guru --</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.nama}>
                  {admin.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block font-semibold">Sampul Ekskul (opsional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-md border"
              />
            )}
          </div>

          <button
            onClick={handleBuatClick}
            className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Buat'}
          </button>
        </div>
      </div>

      {/* KONFIRMASI */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold">
              Anda yakin ingin membuat ekskul ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
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
