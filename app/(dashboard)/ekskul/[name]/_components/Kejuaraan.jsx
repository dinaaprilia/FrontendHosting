import React, { useState, useEffect } from "react";
import { FaTrophy, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import InputKejuaraan from "./InputKejuaraan";

const AchievementBox = ({ ekskulId }) => {
  const [achievements, setAchievements] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/ekskul/${ekskulId}/achievements`);
      if (!res.ok) throw new Error("Gagal fetch data prestasi");
      const data = await res.json();
      setAchievements(data);
    } catch (err) {
      console.error("❌ Gagal ambil prestasi:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus prestasi ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/achievements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus prestasi");
      fetchAchievements(); // refresh list
    } catch (err) {
      console.error("❌ Gagal hapus prestasi:", err);
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setShowInput(true);
  };

  useEffect(() => {
    if (!ekskulId) return;
    fetchAchievements();
  }, [ekskulId]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-2xl max-sm:p-3 h-[438px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2 max-sm:text-lg">
          <FaTrophy className="text-yellow-500" /> Capaian Prestasi
        </h2>

        <button
          onClick={() => {
            setShowInput(true);
            setEditingAchievement(null); // mode tambah baru
          }}
          className="bg-green-500 hover:bg-green-600 text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Form InputKejuaraan */}
      {showInput && (
        <div className="mb-4">
          <InputKejuaraan
            ekskulId={ekskulId}
            achievement={editingAchievement} // jika null = tambah, jika ada = edit
            onSuccess={() => {
              setShowInput(false);
              setEditingAchievement(null);
              fetchAchievements(); // refresh list
            }}
            onCancel={() => {
              setShowInput(false);
              setEditingAchievement(null);
            }}
          />
        </div>
      )}

      {/* List Prestasi */}
      <div className="grid gap-4 max-h-[350px] overflow-y-auto pr-2">
        {Array.isArray(achievements) && achievements.length > 0 ? (
          achievements.map((achieve, index) => (
            <div
              key={index}
              className="border border-yellow-500 shadow-md rounded-lg p-4 bg-white flex justify-between items-start max-sm:p-3"
            >
              <div>
                <h3 className="text-lg font-semibold max-sm:text-base">{achieve.championship}</h3>
                <p className="text-gray-600 max-sm:text-sm">{achieve.event}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(achieve.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleEdit(achieve)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit prestasi"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(achieve.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Hapus prestasi"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">Belum ada data prestasi</p>
        )}
      </div>
    </div>
  );
};

export default AchievementBox;
