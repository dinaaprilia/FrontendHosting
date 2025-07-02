"use client"; // Jika pakai Next.js
import { useEffect, useState } from "react";
import { FaListAlt } from "react-icons/fa";

export default function DaftarEkskul() {
  const [ekskulList, setEkskulList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEkskul = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://backendfix-production.up.railway.app/api/ekskul-saya", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data ekskul");
        }

        const data = await response.json();
        setEkskulList(data);
      } catch (error) {
        console.error("❌ Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEkskul();
  }, []);

return (
  <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow-lg h-[439px] overflow-y-auto">
    <h2 className="text-lg font-semibold flex items-center mb-2  ">
      <FaListAlt className="mr-2" /> Daftar Ekskul Anda
    </h2>

    {loading ? (
      <p>Memuat data ekskul...</p>
    ) : ekskulList.length === 0 ? (
      <p className="text-gray-500">Anda belum bergabung dengan ekskul manapun.</p>
    ) : (
      // ⬇️ Bungkus list dalam div scroll
      <div className="max-h-[380px] overflow-y-auto pr-2">
        {ekskulList.map((ekskul, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-4 mb-4 rounded-xl border-2 border-blue-400 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">{ekskul.name}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <img
                  src="/images/profil.png"
                  alt="Mentor Icon"
                  className="w-5 h-5 mr-2"
                />
                <span className="font-semibold">{ekskul.mentor}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Anda bergabung sejak {ekskul.tanggalBergabung}
              </p>
            </div>
            <img
              src="/images/ekskulsiswa.png"
              alt="Ikon Ekskul"
              className="w-16 h-16 object-contain"
            />
          </div>
        ))}
      </div>
    )}
  </div>
);

}
