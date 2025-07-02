import { getCookie } from "@/lib/cookieFunction";
import axios from "axios";
import { useState } from "react";

const addUser = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const cookie = process.env.NEXT_PUBLIC_COOKIE_NAME;
  const token = getCookie(cookie);
  const bearerToken = `Bearer ${token}`;

const user = async (body) => {
  setLoading(true);
  setError(null);
  setData(null);

  try {
    console.log("Kirim data:", body);

    const response = await axios.post(
      "https://backendfix-production.up.railway.app/api/addUser",
      body,
      {
        headers: {
          Authorization: bearerToken,
          "Content-Type": "application/json",
        },
      }
    );

    setData(response.data);
console.log(response);
return response.data; // ✅ ini penting!

  } catch (error) {
  if (error.response) {
    const res = error.response.data ?? {};
    console.error("📦 Full error object:", error);        // 👈 tambahkan ini
    console.error("📬 Status:", error.response.status);   // 👈 ini juga
    console.error("📬 Headers:", error.response.headers); // 👈 tambahan

    let firstError = null;
    if (res.errors && typeof res.errors === "object") {
      const values = Object.values(res.errors);
      if (Array.isArray(values[0])) {
        firstError = values[0][0];
      }
    }

    setError(firstError || res.message || "Terjadi kesalahan");
    console.error("❌ Error response:", error.response); // biarkan untuk referensi
  } else {
    setError(error.message || "Terjadi kesalahan jaringan");
    console.error("❌ Error:", error.message);
  }
}

};


  return { loading, error, data, user };
};

export default addUser;
