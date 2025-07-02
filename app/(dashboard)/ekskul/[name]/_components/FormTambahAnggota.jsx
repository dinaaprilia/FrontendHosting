'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function TambahAnggotaForm({ onAddAnggota, onClose, existingAnggota = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [namaList, setNamaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/siswa-tersedia")
      .then((res) => res.json())
      .then((data) => {
        setNamaList(data.namaList || []);
      })
      .catch((err) => {
        console.error("Gagal fetch data siswa tersedia:", err);
      });
  }, []);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const siswa = namaList.find((s) => s.id === selectedOption.value);
      setSelectedSiswa(siswa);
    } else {
      setSelectedSiswa(null);
    }
  };

  const handleConfirmYes = () => {
    if (!selectedSiswa) return;

    const sudahAda = existingAnggota.some(
      (anggota) => anggota.user_id === selectedSiswa.id
    );

    if (sudahAda) {
      setShowConfirm(false);
      setShowErrorModal(true);
      return;
    }

    const newAnggota = {
      nama: selectedSiswa.name,
      kelas: selectedSiswa.kelas,
      nisn: selectedSiswa.nisn,
      user_id: selectedSiswa.id,
    };

    try {
      onAddAnggota(newAnggota);
      setShowConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error menambahkan anggota:", error);
      setShowConfirm(false);
      setShowErrorModal(true);
    }
  };

  const handleTambahkan = () => {
    if (!selectedSiswa) {
      setShowErrorModal(true); // ✅ tampilkan modal error jika nama belum dipilih
      return;
    }
    setShowConfirm(true);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 text-xl font-bold"
          >
            ✖
          </button>
          <h2 className="text-lg font-bold text-center mb-4">Tambah Anggota</h2>

          {/* Dropdown react-select */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Pilih Nama Siswa</label>
            <Select
              options={namaList.map((siswa) => ({
                value: siswa.id,
                label: siswa.name,
              }))}
              onChange={handleSelectChange}
              placeholder="Cari dan pilih nama..."
              isClearable
              className="text-sm"
            />
          </div>

          {/* Kelas */}
          <div className="mb-3">
            <label className="block font-semibold">Kelas</label>
            <input
              type="text"
              value={selectedSiswa?.kelas || ''}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          {/* NISN */}
          <div className="mb-3">
            <label className="block font-semibold">NISN</label>
            <input
              type="text"
              value={selectedSiswa?.nisn || ''}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={handleTambahkan}
            className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Tambahkan
          </button>
        </div>

        {/* Modal Konfirmasi */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 font-semibold">
                Anda yakin ingin menambahkan siswa tersebut?
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

        {/* Modal Error */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 font-semibold text-red-600">
                Gagal menambahkan anggota.<br />
                {selectedSiswa
                  ? "Siswa sudah terdaftar di ekskul ini."
                  : "Nama siswa belum dipilih."}
              </p>
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
    )
  );
}
