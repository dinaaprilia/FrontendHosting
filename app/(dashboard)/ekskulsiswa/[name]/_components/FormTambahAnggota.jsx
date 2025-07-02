'use client';

import { useState, useEffect } from 'react';

export default function TambahAnggotaForm({ onAddAnggota, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [kelasList, setKelasList] = useState([]);
  const [namaList, setNamaList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [nisn, setNisn] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch("https://backendfix-production.up.railway.app/api/siswa-tersedia")
      .then((res) => res.json())
      .then((data) => {
        setKelasList(data.kelasList);
        setNamaList(data.namaList);
      })
      .catch((err) => {
        console.error("Gagal fetch data siswa tersedia:", err);
      });
  }, []);

  useEffect(() => {
    const siswaTerpilih = namaList.find(
      (s) => s.id.toString() === selectedUserId
    );
    if (siswaTerpilih) {
      setSelectedKelas(siswaTerpilih.kelas || '');
      setNisn(siswaTerpilih.nisn || '');
    } else {
      setSelectedKelas('');
      setNisn('');
    }
  }, [selectedUserId, namaList]);

  const handleConfirmYes = () => {
    const siswa = namaList.find((s) => s.id.toString() === selectedUserId);
    if (!siswa) return;

    const newAnggota = {
      nama: siswa.name,
      kelas: siswa.kelas,
      nisn: siswa.nisn,
      user_id: siswa.id,
    };

    onAddAnggota(newAnggota);
    setShowConfirm(false);
    onClose();
  };

  const handleTambahkan = () => {
    if (!selectedUserId) {
      alert('Nama siswa harus dipilih');
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

          {/* Dropdown Nama Siswa */}
          <div className="mb-3">
            <label className="block font-semibold">Pilih Nama Siswa</label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Pilih Nama</option>
              {namaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas - Tampilkan otomatis */}
          <div className="mb-3">
            <label className="block font-semibold">Kelas</label>
            <input
              type="text"
              value={selectedKelas}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          {/* NISN - Tampilkan otomatis */}
          <div className="mb-3">
            <label className="block font-semibold">NISN</label>
            <input
              type="text"
              value={nisn}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tombol Tambahkan */}
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
      </div>
    )
  );
}
