'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import GreenButton from './TombolTambah';

Modal.setAppElement(typeof document !== 'undefined' ? document.body : null);

export default function InformasiEkskul() {
  const [informasiData, setInformasiData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [ekskulName, setEkskulName] = useState('');

  const openModal = (info) => {
    setSelectedInfo(info);
    setEditedText(info.description);
    setModalIsOpen(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedInfo(null);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/informasi/${selectedInfo.id}`, {
        method: 'DELETE',
      });

      setInformasiData(informasiData.filter((item) => item.id !== selectedInfo.id));
      closeModal();
    } catch (error) {
      console.error('❌ Gagal menghapus informasi:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:8000/api/informasi/${selectedInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editedText }),
      });

      setInformasiData(informasiData.map((item) =>
        item.id === selectedInfo.id ? { ...item, description: editedText } : item
      ));
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Gagal mengedit informasi:', error);
    }
  };

  useEffect(() => {
    const ekskul = JSON.parse(localStorage.getItem('selectedEkskul'));
    const ekskulId = ekskul?.id;

    if (!ekskulId) return;

    setEkskulName(ekskul.name);

    fetch(`http://localhost:8000/api/ekskul/${ekskulId}/informasi`)
      .then((res) => res.json())
      .then((data) => setInformasiData(data))
      .catch((err) => console.error('❌ Gagal ambil informasi:', err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-2 p-4 bg-white rounded-2xl shadow-md h-[510px] flex flex-col z-50">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <FaBell className="mr-2" /> Informasi Ekskul
        </h2>
        <GreenButton />
      </div>

      {/* Daftar Informasi (scroll jika lebih dari tinggi container) */}
      <div className="mt-4 space-y-3 overflow-y-auto pr-2 flex-grow">
        {informasiData.map((info) => (
          <div
            key={info.id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={() => openModal(info)}
          >
            <div className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-md ${info.color}`}>
              {new Date(info.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <p className="text-indigo-900 font-bold mt-2 text-lg">{ekskulName}</p>
            <p className="text-gray-700 font-medium mt-1">{info.description}</p>
            <div className="mt-2 text-gray-500 text-sm flex items-center">
              <img src="/images/profil.jpg" alt="User" className="w-5 h-5 rounded-full mr-2" />
              {info.author} / {info.time}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Informasi Detail"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        overlayClassName="fixed inset-0 z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md sm:w-full w-72 max-h-[420px] overflow-y-auto">
          {selectedInfo && (
            <>
              <h2 className="text-lg font-bold mb-2">{selectedInfo.date}</h2>
              {isEditing ? (
                <textarea
                  className="w-full border p-2 rounded-lg"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <p className="text-gray-700 mb-4">{selectedInfo.description}</p>
              )}
              <div className="text-sm text-gray-500 flex items-center">
                <img src="/images/profil.jpg" alt="User" className="w-6 h-6 rounded-full mr-2" />
                {selectedInfo.author} / {selectedInfo.time}
              </div>
              <div className="mt-4 flex sm:justify-end justify-center space-x-2">
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
