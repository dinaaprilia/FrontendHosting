'use client';

import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import Modal from 'react-modal';
import { parseISO, format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

Modal.setAppElement(typeof document !== 'undefined' ? document.body : null);

export default function listInform() {
  const [informasiData, setInformasiData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const API_BASE = 'https://backendfix-production.up.railway.app/api/informasi';

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setInformasiData(data));
  }, []);

  const openModal = (info) => {
    setSelectedInfo(info);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedInfo(null);
  };

  const getShortText = (text) => {
    if (typeof text !== 'string') return '-';
    const words = text.split(' ');
    return words.length > 8 ? words.slice(0, 8).join(' ') + '...' : text;
  };

  const formatTanggal = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: localeID });
    } catch {
      return 'Tanggal tidak tersedia';
    }
  };

  const isToday = (dateString) => {
    const today = new Date();
    const inputDate = new Date(dateString);
    return (
      today.getDate() === inputDate.getDate() &&
      today.getMonth() === inputDate.getMonth() &&
      today.getFullYear() === inputDate.getFullYear()
    );
  };

  return (
    <div className="w-full sm:max-w-2xl mx-auto mt-2 p-2 sm:p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <FaBell className="mr-2" /> Informasi Umum
        </h2>
        {/* GreenButton viewer-only: hidden */}
      </div>

      <div
        className={`mt-4 space-y-3 ${informasiData.length > 2 ? 'max-h-[350px] overflow-y-auto pr-1' : ''}`}
      >
        {informasiData.map((info, index) => (
          <div
            key={info.id || index}
            className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => openModal(info)}
          >
            <div
              className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-md ${
                isToday(info.date) ? 'bg-orange-500' : 'bg-blue-600'
              }`}
            >
              {info?.date ? formatTanggal(info.date) : 'Tanggal tidak tersedia'}
            </div>
            <h3 className="text-gray-800 font-bold mt-2 text-base break-words">
              {info?.title?.trim() || 'Tanpa Judul'}
            </h3>
            <p className="mt-2 text-gray-700 font-medium text-sm sm:text-base break-words">
              {getShortText(info?.text?.trim() || '-')}
            </p>
            <div className="mt-2 text-gray-500 text-sm flex items-center flex-wrap">
              <img
                src={
                  info?.photo
                    ? `https://backendfix-production.up.railway.app/storage/${info.photo}`
                    : "/images/profil.png"
                }
                alt="User"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span className="truncate">
                {info?.author?.trim() || 'Anonim'} / {info?.time?.trim() || '-'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail View Only */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Informasi Detail"
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full sm:max-w-md mx-auto rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {selectedInfo && (
            <>
              <h2 className="sm:text-lg text-md font-bold mb-2">
                {selectedInfo?.date ? formatTanggal(selectedInfo.date) : '-'}
              </h2>
              <h3 className="text-gray-800 font-semibold mb-2">
                {selectedInfo?.title?.trim() || '-'}
              </h3>
              <p className="text-gray-700 mb-4 break-words">
                {selectedInfo?.text?.trim() || '-'}
              </p>
              <div className="text-sm text-gray-500 flex items-center mb-4">
                <img
                  src={selectedInfo?.photo || '/images/profil.jpg'}
                  alt="User"
                  className="w-6 h-6 rounded-full mr-2"
                />
                {selectedInfo?.author?.trim() || '-'} / {selectedInfo?.time?.trim() || '-'}
              </div>
              <div className="mt-4 flex justify-end">
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
