"use client";

import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const API_BASE = "http://localhost:8000/api";

export default function KehadiranEkskul({ ekskulId, ekskulName }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [lastEdit, setLastEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [day, setDay] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadAnggota() {
      if (!ekskulId) return setStudents([]);
      try {
        const res = await fetch(`${API_BASE}/ekskul/${ekskulId}/anggota`);
        if (!res.ok) throw new Error("Gagal mengambil anggota");
        const data = await res.json();
        setStudents(data);
        setAttendance({});
      } catch (err) {
        console.error(err);
        setStudents([]);
      }
    }
    loadAnggota();
  }, [ekskulId]);

  useEffect(() => {
    async function loadExistingAttendance() {
      if (!ekskulId || !day) return;
      try {
        const res = await fetch(`${API_BASE}/absensi-ekskul/header?ekskul_id=${ekskulId}&tanggal=${day}`);
        if (!res.ok) throw new Error("Gagal memuat absensi sebelumnya");
        const data = await res.json();
        if (data?.absensi?.length > 0) {
          setKegiatan(data.kegiatan || "");
          setStartTime(data.mulai || "");
          setEndTime(data.selesai || "");
          const restored = {};
          data.absensi.forEach(item => {
            restored[item.anggota_id] = {
              status: item.status,
              time: item.waktu_absen || "-",
            };
          });
          setAttendance(restored);
          setIsEditing(false);
          setIsEditable(false);
          setHasGenerated(true);
        } else {
          setKegiatan("");
          setStartTime("");
          setEndTime("");
          setAttendance({});
          setIsEditing(false);
          setIsEditable(false);
          setHasGenerated(false);
        }
      } catch (err) {
        console.error("❌ Gagal load absensi:", err);
      }
    }
    loadExistingAttendance();
  }, [ekskulId, day, students]);

  const handleAttendanceChange = (id, status) => {
    if (!isEditing) return;
    setAttendance(prev => ({
      ...prev,
      [id]: {
        status,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      },
    }));
    setLastEdit(new Date().toLocaleString());
  };

  const handleSave = async () => {
    if (!ekskulId || !day) return alert("Tanggal dan ekskul harus diisi dulu!");
    const absensiPayload = Object.entries(attendance).map(([anggota_id, obj]) => ({
      anggota_id: parseInt(anggota_id),
      status: obj.status,
      waktu_absen: obj.time || null,
    }));
    try {
      const res = await fetch(`${API_BASE}/absensi-ekskul`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ekskul_id: parseInt(ekskulId),
          tanggal: day,
          absensi: absensiPayload,
          kegiatan,
          mulai: startTime,
          selesai: endTime,
        }),
      });
      if (!res.ok) throw new Error("Gagal simpan absensi");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
      setIsEditable(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleGenerate = () => {
    const now = new Date();
    setDay(now.toISOString().slice(0, 10));
    setStartTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    setEndTime(new Date(now.getTime() + 30 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    setIsEditable(true);
    setIsEditing(true);
    setHasGenerated(true);
  };

  return (
    <div className="w-full gap-2 p-4 border rounded-2xl shadow-md bg-white px-6 max-sm:px-3 max-sm:py-4">
      <style>{`input[type="radio"]:disabled { accent-color: black; cursor: not-allowed; }`}</style>

      <div className="mb-4 ml-5 gap-4 space-y-2 max-sm:ml-0 max-sm:text-sm">
        <div className="flex flex-wrap items-center"><strong className="w-28">Ekskul</strong><span>: {ekskulName || "-"}</span></div>
        <div className="flex flex-wrap items-center">
          <strong className="w-28">Kegiatan</strong>
          {isEditable ? (
            <input type="text" className="border px-2 py-1 rounded-md flex-1 max-sm:w-full" value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} />
          ) : (<span>: {kegiatan || "-"}</span>)}
        </div>
        <div className="flex flex-wrap items-center">
          <strong className="w-28">Tanggal</strong>
          {isEditable ? (
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} className="border px-2 py-1 rounded-md max-sm:w-full" />
          ) : (<span>: {day}</span>)}
        </div>
        <div className="flex flex-wrap items-center">
          <strong className="w-28">Mulai</strong>
          {isEditable ? (
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border px-2 py-1 rounded-md max-sm:w-full" />
          ) : (<span>: {startTime}</span>)}
        </div>
        <div className="flex flex-wrap items-center">
          <strong className="w-28">Selesai</strong>
          {isEditable ? (
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border px-2 py-1 rounded-md max-sm:w-full" />
          ) : (<span>: {endTime}</span>)}
        </div>
      </div>

      <div className="py-4 text-center ml-5 -mt-5 max-sm:ml-0">
        <button className="px-4 py-2 bg-blue-700 text-white rounded-md flex items-center justify-center w-full sm:w-auto text-sm" onClick={handleGenerate}>
          <FaExternalLinkAlt className="mr-2" /> Generate Absensi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-300 text-sm table-fixed max-sm:text-xs">
          <thead>
            <tr className="border-b border-gray-300 text-center">
              <th className="py-2 w-[5%]">No</th>
              <th className="py-2 w-[40%] text-left pl-3">Nama</th>
              <th className="py-2 w-[15%]">Hadir</th>
              <th className="py-2 w-[15%]">Tidak Hadir</th>
              <th className="py-2 w-[25%]">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">Tidak ada anggota untuk ekskul ini.</td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className="border-b border-gray-300 text-center">
                  <td className="py-2">{index + 1}.</td>
                  <td className="py-2 text-left pl-3">{student.nama}</td>
                  {["hadir", "tidak hadir"].map((status) => (
                    <td key={status} className="py-2">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id]?.status === status}
                        onChange={() => handleAttendanceChange(student.id, status)}
                        disabled={!isEditing}
                      />
                    </td>
                  ))}
                  <td className="py-2">{attendance[student.id]?.time || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showSuccess && (
        <div className="mt-4 text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded-md text-sm shadow-md text-center">
          ✅ Absensi berhasil disimpan
        </div>
      )}

      {hasGenerated && (
        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
          {isEditing ? (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md w-full sm:w-auto text-sm" onClick={handleSave}>Simpan</button>
          ) : (
            <button className="px-4 py-2 bg-green-500 text-white rounded-md w-full sm:w-auto text-sm" onClick={handleEdit}>Edit</button>
          )}
        </div>
      )}

      {lastEdit && <p className="mt-2 text-gray-600 text-xs">Last Edit: {lastEdit}</p>}
    </div>
  );
}
