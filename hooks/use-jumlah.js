"use client"
import { getCookie } from "@/lib/cookieFunction";
import axios from "axios";
import { useState } from "react";

const useJumlah = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getUserJumlah = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    if (!token) {
      setError("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://backendfix-production.up.railway.app/api/jumlahUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, getUserJumlah };
};


export default useJumlah;
