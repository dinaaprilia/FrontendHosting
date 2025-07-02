'use client';

import { useEffect, useState } from 'react';
import { MdOutlineLockReset } from 'react-icons/md';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import ResetPasswordForm from './ResetPassSiswa';

export default function ProfileDetail({ user, onClose }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [kelasList, setKelasList] = useState([]);
  const [agamaList, setAgamaList] = useState([]);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        tanggal_lahir: user.tanggal_lahir
          ? new Date(user.tanggal_lahir).toISOString().split('T')[0]
          : ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/kelas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setKelasList(data.kelas || []);
      } catch (error) {
        console.error("❌ Gagal fetch kelas:", error);
      }
    };

    const hardcodedAgama = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
    setAgamaList(hardcodedAgama);

    fetchKelas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setShowSuccessPopup(true);
        setIsEditing(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        alert('Gagal memperbarui: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      ...user,
      tanggal_lahir: user.tanggal_lahir
        ? new Date(user.tanggal_lahir).toISOString().split('T')[0]
        : ''
    });
    setIsEditing(false);
  };

  const handleResetPasswordClick = () => {
    setShowResetPassword(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    handleSave();
  };

  const fotoProfilURL = user?.foto_profil?.startsWith('http')
    ? user.foto_profil
    : `http://localhost:8000/storage/${user.foto_profil}`;

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow-xl border border-green-500 sm:overflow-hidden overflow-y-auto ">
            ✅ Profil berhasil diperbarui
          </div>
        </div>
      )}

     <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl relative w-[95%] max-w-4xl mx-auto h-[400px] sm:h-auto sm:overflow-hidden overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-center sm:text-2xl text-xl font-semibold mb-6">Detail Profil</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="col-span-1 flex justify-center">
            <div className="w-28 h-28 bg-gray-100 rounded-2xl overflow-hidden shadow-md">
              <img
                src={fotoProfilURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {['nama', 'email', 'nomor_hp'].map((field) => (
              <div key={field}>
                <label className="font-semibold text-black capitalize">{field.replace('_', ' ')}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p>{user[field] || '-'}</p>
                )}
              </div>
            ))}

            <div>
              <label className="font-semibold text-black">Agama</label>
              {isEditing ? (
                <select
                  name="agama"
                  value={formData.agama || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih Agama</option>
                  {agamaList.map((agama, index) => (
                    <option key={index} value={agama}>{agama}</option>
                  ))}
                </select>
              ) : (
                <p>{user.agama || '-'}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-black">Tanggal Lahir</label>
              {isEditing ? (
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <p>{user.tanggal_lahir ? new Date(user.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-black">Jenis Kelamin</label>
              {isEditing ? (
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              ) : (
                <p>{user.jenis_kelamin === 'L' ? 'Laki-laki' : user.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-black">Kelas</label>
              {isEditing ? (
                <select
                  name="kelas"
                  value={formData.kelas || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih Kelas</option>
                  {kelasList.map((kelas) => (
                    <option key={kelas} value={kelas}>{kelas}</option>
                  ))}
                </select>
              ) : (
                <p>{user.kelas || '-'}</p>
              )}
            </div>
          </div>
        </div>

         <div className="flex justify-center gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                <FaSave /> Simpan
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
              >
                <FaTimes /> Batalkan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={handleResetPasswordClick}
                className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
              >
                <MdOutlineLockReset /> Reset Password
              </button>
            </>
          )}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
              <p className="mb-4 font-semibold">
                Anda yakin ingin menyimpan perubahan profil siswa ini?
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

        {showResetPassword && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <ResetPasswordForm
                userId={user.id}
                onCancel={() => setShowResetPassword(false)}
                onSuccess={() => {
                  alert('✅ Password berhasil direset');
                  setShowResetPassword(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
