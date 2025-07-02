import { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export default function InputKejuaraan({ ekskulId, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    date: "",
    championship: "",
    event: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || "",
        championship: initialData.championship || "",
        event: initialData.event || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!ekskulId) {
        alert("ID ekskul tidak ditemukan.");
        return;
      }

      const method = initialData?.id ? "PUT" : "POST";
      const url = initialData?.id
        ? `https://backendfix-production.up.railway.app/api/achievements/${initialData.id}`
        : `https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/achievements`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        return;
      }

      const data = await res.json();
      alert("Gagal menyimpan: " + (data.message || "Terjadi kesalahan."));
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-sm:w-[90%] max-sm:max-h-[90vh] max-sm:overflow-y-auto relative">
        <button className="absolute top-4 right-4" onClick={onSuccess}>
          <AiFillCloseCircle className="w-6 h-6 text-red-500" />
        </button>
        <h2 className="text-center font-bold text-lg mb-4">
          {initialData ? "Edit Kejuaraan" : "Input Kejuaraan"}
        </h2>

        <label className="block font-semibold">Hari/Tanggal</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3"
        />

        <label className="block font-semibold">Kejuaraan</label>
        <input
          type="text"
          name="championship"
          value={formData.championship}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3"
        />

        <label className="block font-semibold">Event</label>
        <input
          type="text"
          name="event"
          value={formData.event}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-4"
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
