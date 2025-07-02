import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/hooks/UserContext'; // pastikan path-nya benar

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getUserData } = useUserContext(); // ✅ Ambil dari context

  const login = async ({ identifier, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://backendfix-production.up.railway.app/api/login", {
        identifier,
        password,
      });

      const { token } = response.data;

      // ✅ Simpan token ke localStorage
      localStorage.setItem("token", token);

      // ✅ Refresh user dari API dan simpan ke context
      await getUserData(); // ini akan mengisi state user di context

      // ✅ Redirect ke beranda
      router.push("/beranda");
    } catch (err) {
      console.error("Login error:", err);
      setError("Ups! NIP/NISN atau password salah. Coba lagi, ya.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};

export default useLogin;
