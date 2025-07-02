"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);     // ⬅️ Tambahan
  const [error, setError] = useState(null);           // ⬅️ Tambahan

  const getUserData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch saat pertama render jika ada token
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, getUserData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook global
export const useUserContext = () => useContext(UserContext);
