"use client";
import Image from "next/image";
import { FaEdit, FaCamera, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import useProfile from "@/hooks/useProfile";
import UpdateProfile from "@/hooks/update-profile";
import { useUserContext } from "@/hooks/UserContext";

export default function ProfileEditPopup({ isOpen, onClose, onUpdated }) {
  const { data, getProfileUser } = useProfile();
  const { loading, updateData, updateProfileImage } = UpdateProfile();
  const { setUser } = useUserContext();

  const [updatedNama, setUpdatedNama] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAgama, setUpdatedAgama] = useState('');
  const [updatedNomorHp, setUpdatedNomorHp] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const [showConfirm, setShowConfirm] = useState(false); // ✅ popup konfirmasi

  useEffect(() => {
    getProfileUser();
  }, []);

  useEffect(() => {
    if (data) {
      setUpdatedNama(data.nama || '');
      setUpdatedEmail(data.email || '');
      setUpdatedAgama(data.agama || '');
      setUpdatedNomorHp(data.nomor_hp || '');
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleImageUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!updatedNama.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    let newFotoProfil = null;

    if (imageFile) {
      const updatedData = await updateProfileImage(imageFile);
      newFotoProfil = updatedData?.foto_profil;
    }

    const profileData = {};
    if (updatedNama?.trim()) profileData.nama = updatedNama;
    if (updatedEmail?.trim()) profileData.email = updatedEmail;
    if (updatedAgama?.trim()) profileData.agama = updatedAgama;
    if (updatedNomorHp?.trim()) profileData.nomor_hp = updatedNomorHp;

    await updateData(profileData);
    setImageFile(null);

    setUser((prev) => ({
      ...(prev || {}),
      nama: updatedNama || prev?.nama,
      email: updatedEmail || prev?.email,
      agama: updatedAgama || prev?.agama,
      nomor_hp: updatedNomorHp || prev?.nomor_hp,
      foto_profil: newFotoProfil || prev?.foto_profil,
    }));

    if (onUpdated) await onUpdated(Date.now());
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[90%] sm:max-w-[700px] max-w-[250px] sm:h-[500px] h-[440px] sm:overflow-hidden overflow-y-auto">
        <h2 className="sm:text-2xl text-xl font-bold text-center sm:mb-6 mb-1">Kelola Profil</h2>
        <div className="flex flex-col md:flex-row items-center sm:gap-6 gap-2">
          <div className="relative mt-3 w-[100px] h-[100px] sm:w-[210px] sm:h-[210px]">
            <img
              key={(previewUrl || data?.foto_profil) + lastUpdate}
              src={
                previewUrl
                  ? previewUrl
                  : data?.foto_profil && data.foto_profil !== ""
                    ? `https://backendfix-production.up.railway.app/storage/${data.foto_profil}?t=${lastUpdate}`
                    : "/images/profil.png"
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/profil.png"; // fallback saat error
              }}
              alt="Foto Profil"
              className="w-full h-full object-cover rounded-xl"
            />

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              className="absolute -bottom-3 -right-1 bg-yellow-500 text-white p-2 rounded-full shadow-md"
              onClick={handleImageUpload}
            >
              <FaCamera />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 w-full">
            <div>
              <p className="font-semibold sm:text-lg text-base">Nama</p>
              <div className="flex items-center border p-2 rounded-md">
                <input
                  type="text"
                  value={updatedNama}
                  onChange={(e) => setUpdatedNama(e.target.value)}
                  className="w-full focus:outline-none"
                />
                <FaEdit className="text-gray-500" />
              </div>
            </div>

            {data?.role !== 'admin' && (
              <div>
                <p className="font-semibold sm:text-lg text-base">Agama</p>
                <select
                  value={updatedAgama}
                  onChange={(e) => setUpdatedAgama(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">-- Pilih Agama --</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Islam">Islam</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
            )}

            <div>
              <p className="font-semibold sm:text-lg text-base">No HP</p>
              <div className="flex items-center border p-2 rounded-md">
                <input
                  type="text"
                  value={updatedNomorHp}
                  onChange={(e) => setUpdatedNomorHp(e.target.value)}
                  className="w-full focus:outline-none"
                />
                <FaEdit className="text-gray-500" />
              </div>
            </div>

            <div>
              <p className="font-semibold sm:text-lg text-base">Email</p>
              <div className="flex items-center border p-2 rounded-md">
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  className="w-full focus:outline-none"
                />
                <FaEdit className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end justify-center sm:gap-4 gap-1 sm:mt-10 mt-4">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
            onClick={() => setShowConfirm(true)}
            disabled={loading}
          >
            <FaRegCheckCircle /> {loading ? "Saving..." : "Simpan"}
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
            onClick={onClose}
          >
            <MdOutlineCancel /> Batalkan
          </button>
        </div>
      </div>

      {/* ✅ Popup Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 text-center">
            <p className="mb-4 font-semibold">Anda yakin ingin menyimpan perubahan profil?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await handleSave();
                  setShowConfirm(false);
                }}
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
  );
}
