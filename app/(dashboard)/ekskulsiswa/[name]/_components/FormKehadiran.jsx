"use client";

import { useState, useEffect } from "react";

const API_BASE = "https://backendfix-production.up.railway.app/api";

export default function KehadiranEkskul({ ekskulId, ekskulName }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [kegiatan, setKegiatan] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [day, setDay] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    async function loadAnggota() {
      if (!ekskulId) return;
      try {
        const res = await fetch(`${API_BASE}/ekskul/${ekskulId}/anggota`);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("❌ Gagal mengambil anggota:", err);
      }
    }

    loadAnggota();
  }, [ekskulId]);

  useEffect(() => {
    async function loadAbsensi() {
      if (!ekskulId || !day) return;

      try {
        const res = await fetch(`${API_BASE}/absensi-ekskul/header?ekskul_id=${ekskulId}&tanggal=${day}`);
        const data = await res.json();

        setKegiatan(data.kegiatan || "-");
        setStartTime(data.mulai || "-");
        setEndTime(data.selesai || "-");

        const restored = {};
        if (Array.isArray(data.absensi)) {
          data.absensi.forEach(item => {
            restored[item.anggota_id] = {
              status: item.status,
              time: item.waktu_absen || "-",
            };
          });
        }
        setAttendance(restored);
      } catch (err) {
        console.error("❌ Gagal load absensi:", err);
      }
    }

    loadAbsensi();
  }, [ekskulId, day]);

  return (
    <div className="w-full p-4 border rounded-2xl shadow-md bg-white px-6">
      <div className="mb-4 ml-5 space-y-2">
        <div className="flex items-center"><strong className="w-28">Ekskul</strong><span>: {ekskulName || "-"}</span></div>
        <div className="flex items-center"><strong className="w-28">Kegiatan</strong><span>: {kegiatan}</span></div>
        <div className="flex items-center"><strong className="w-28">Tanggal</strong><span>: {day}</span></div>
        <div className="flex items-center"><strong className="w-28">Mulai</strong><span>: {startTime}</span></div>
        <div className="flex items-center"><strong className="w-28">Selesai</strong><span>: {endTime}</span></div>
      </div>

      <table className="w-full border-t border-gray-300 mt-6">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2">No</th>
            <th className="py-2 text-left pl-3">Nama</th>
            <th className="py-2">Status</th>
            <th className="py-2">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Tidak ada anggota untuk ekskul ini.
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.id} className="border-b border-gray-300 text-center">
                <td className="py-2">{index + 1}</td>
                <td className="py-2 text-left pl-3">{student.nama}</td>
                <td className="py-2 capitalize">{attendance[student.id]?.status || "-"}</td>
                <td className="py-2">{attendance[student.id]?.time || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
