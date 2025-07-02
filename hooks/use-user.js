"use client"
import axios from "axios";
import { useState } from "react";

const useUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const getUserData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://backendfix-production.up.railway.app/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data.user;
      setData(userData);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, getUserData };
};

export default useUser;
