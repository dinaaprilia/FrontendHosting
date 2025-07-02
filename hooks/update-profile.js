// hooks/update-profile.js
import axios from 'axios';
import { useState } from 'react';

export default function UpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const updateData = async ({ nama, email, agama, nomor_hp, password }) => {
  try {
    const token = localStorage.getItem('token');

    // Kirim hanya field yang tidak kosong
    const body = {};
    if (nama?.trim()) body.nama = nama;
    if (email?.trim()) body.email = email;
    if (agama?.trim()) body.agama = agama;
    if (nomor_hp?.trim()) body.nomor_hp = nomor_hp;
    if (password?.trim()) body.password = password;

    console.log("📤 Data yang dikirim ke backend:", body);

    await axios.put('https://backendfix-production.up.railway.app/api/edit-profile', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error("❌ Gagal update profil:", err.response?.status, err.response?.data);
  }
};


const updateProfileImage = async (imageFile) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('foto_profil', imageFile);

    const res = await axios.post('http://localhost:8000/api/upload-foto-profil', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("✅ Foto berhasil diunggah:", res.data);
    return res.data.data;
  } catch (err) {
    console.error("❌ Gagal upload gambar:", err);
    return null;
  }
};

  return { loading, error, updateData, updateProfileImage };
}
