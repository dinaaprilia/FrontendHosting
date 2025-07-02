import React, { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";

const AchievementViewer = ({ ekskulId }) => {
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`https://backendfix-production.up.railway.app/api/ekskul/${ekskulId}/achievements`);
      if (!res.ok) throw new Error("Gagal fetch data prestasi");
      const data = await res.json();
      setAchievements(data);
    } catch (err) {
      console.error("❌ Gagal ambil prestasi:", err);
    }
  };

  useEffect(() => {
    if (!ekskulId) return;
    fetchAchievements();
  }, [ekskulId]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-2xl h-[438px] overflow-y-auto">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-black">
          <FaTrophy /> Capaian Prestasi
        </h2>
      </div>

      {achievements.length === 0 ? (
        <p className="text-gray-600">Belum ada data prestasi yang tersedia.</p>
      ) : (
        <div className="grid gap-4">
          {achievements.map((achieve, index) => (
            <div key={index} className="border border-yellow-500 shadow-md rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">{achieve.championship}</h3>
              <p className="text-gray-700 font-medium">{achieve.event}</p>
              <p className="text-sm text-gray-500">
                {new Date(achieve.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementViewer;
