import { useState, useCallback } from 'react';
import axios from 'axios';

export default function useProfile() {
  const [data, setData] = useState(null);

  const getProfileUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Token tidak ditemukan di localStorage');
        return null;
      }

      const res = await axios.get('https://backendfix-production.up.railway.app/api/user-profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("✅ Data profil berhasil diambil:", res.data);
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error('❌ Gagal ambil profil:', err.response?.status, err.response?.data);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; // redirect jika token tidak valid
      }

      return null;
    }
    
  }, []);

  return { data, getProfileUser };
}
