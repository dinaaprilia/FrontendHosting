"use client"
import { getCookie } from "@/lib/cookieFunction";
import axios from "axios";
import { useState } from "react";

const getProfile= () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME;
  const token = getCookie(cookieName)

  const getProfileUser = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    if (!token) {
      setError("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://backendfix-production.up.railway.app/api/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data.data;
      setData(userData);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, getProfileUser }
}

export default getProfile;
