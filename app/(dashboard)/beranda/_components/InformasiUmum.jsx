'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import GreenButton from './TombolTambah';
import { useSession } from 'next-auth/react';

Modal.setAppElement(typeof document !== 'undefined' ? document.body : null);

export default function InformasiList() {
  const [informasiData, setInformasiData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const { data: session } = useSession();

  // Fetch data informasi
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8000/api/informasi', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Gagal mengambil data informasi');
        const data = await res.json();
        setInformasiData(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const openModal = (info) => {
    setSelectedInfo(info);
    setEditedText(info.text);
    setModalIsOpen(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedInfo(null);
  };

  // Fungsi tambah info (POST)
const handleAddInfo = async (newInfo) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:8000/api/input-informasi', {  // <-- pastikan ini sudah benar
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menambahkan informasi');
    }

    const savedInfo = await response.json();

    setInformasiData((prev) => [savedInfo, ...prev]);
  } catch (error) {
    console.error('Error saat menambahkan informasi:', error.message);
  }
};


  // Fungsi hapus info (DELETE)
  const handleDelete = async () => {
    if (!selectedInfo) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:8000/api/informasi/${selectedInfo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal menghapus informasi');

      setInformasiData((prev) => prev.filter((i) => i.id !== selectedInfo.id));
      closeModal();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fungsi edit info (PUT)
  const handleSaveEdit = async () => {
    if (!selectedInfo) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:8000/api/informasi/${selectedInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editedText }),
      });

      if (!res.ok) throw new Error('Gagal mengupdate informasi');

      const updated = await res.json();

      setInformasiData((prev) =>
        prev.map((i) => (i.id === updated.id ? { ...i, text: updated.text } : i))
      );
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const getShortText = (text) => {
    if (typeof text !== 'string') return '-';
    const words = text.split(' ');
    return words.length > 8 ? words.slice(0, 8).join(' ') + '...' : text;
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-2 px-4 sm:px-6 py-4 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <FaBell className="mr-2" /> Informasi Umum
        </h2>
        <GreenButton onAddInfo={handleAddInfo} />
      </div>

      <div className={`mt-4 space-y-3 ${informasiData.length > 2 ? 'max-h-[300px] overflow-y-auto pr-1' : ''}`}>
        {informasiData.map((info) => (
          <div
            key={info.id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => openModal(info)}
          >
            <div className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-md ${info.color}`}>
              {info.date}
            </div>
            <h3 className="text-gray-800 font-bold mt-2 text-base break-words">{info.title}</h3>
            <p className="mt-2 text-gray-700 font-medium text-sm break-words">{getShortText(info.text)}</p>
            <div className="mt-2 text-gray-500 text-sm flex items-center flex-wrap">
              <img
                src={`http://localhost:8000/storage/${info.foto_profil || 'default.jpg'}`}
                alt="User"
                className="w-5 h-5 rounded-full mr-2"
              />
              <span className="truncate">{info?.author?.trim() || 'Anonim'} / {info?.time?.trim() || '-'}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Informasi Detail"
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div
          className="bg-white w-full max-w-md rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        >
          {selectedInfo && (
            <>
              <h2 className="text-lg font-bold mb-2">
                {selectedInfo?.date ? formatTanggal(selectedInfo.date) : '-'}
              </h2>
              <h3 className="text-gray-800 font-semibold mb-2">
                {selectedInfo?.title?.trim() || '-'}
              </h3>

              {isEditing ? (
                <textarea
                  className="w-full border p-2 rounded-lg"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <p className="text-gray-700 mb-4 break-words">{selectedInfo?.text?.trim() || '-'}</p>
              )}

              <div className="text-sm text-gray-500 flex items-center mb-4">
                <img
                  src={selectedInfo?.photo || '/images/profil.jpg'}
                  alt="User"
                  className="w-6 h-6 rounded-full mr-2"
                />
                {selectedInfo?.author?.trim() || '-'} / {selectedInfo?.time?.trim() || '-'}
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {isEditing ? (
                  <button
                    onClick={handleSaveEdit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center"
                >
                  <FaTrash className="mr-1" /> Hapus
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}