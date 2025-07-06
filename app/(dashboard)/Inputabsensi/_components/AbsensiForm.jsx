"use client";

import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function AttendanceForm() {
  const [attendance, setAttendance] = useState({});
  const [lastEdit, setLastEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [students, setStudents] = useState([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [absensiFetched, setAbsensiFetched] = useState(false);
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "";
  const [hasAttendanceData, setHasAttendanceData] = useState(false);
  const [lastDate, setLastDate] = useState(new Date().toISOString().slice(0, 10));
  const [popupMessage, setPopupMessage] = useState("");
  const [hasGeneratedToday, setHasGeneratedToday] = useState(false);

  useEffect(() => {
    if (!kelas) return;
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://backendfix-production.up.railway.app/api/siswa-kelas?kelas=${encodeURIComponent(kelas)}`);
        if (!response.ok) throw new Error("Gagal mengambil data siswa");
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [kelas]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchAbsensi = async () => {
      try {
        const res = await fetch(`https://backendfix-production.up.railway.app/api/absensi?kelas=${kelas}&tanggal=${today}`);
        if (!res.ok) throw new Error("Gagal mengambil data absensi");
        const data = await res.json();
        if (!data.data || data.data.length === 0) {
          setHasAttendanceData(false);
          setAttendance({});
          setDay("");
          setStartTime("");
          setEndTime("");
          setIsEditing(true);
          setIsEditable(true);
        } else {
          setHasAttendanceData(true);
          setDay(data.hari || "");
          setStartTime(data.mulai || "");
          setEndTime(data.selesai || "");
          const absensiMap = {};
          data.data.forEach(item => {
            if (item.nisn) {
              absensiMap[item.nisn] = {
                status: item.status,
                time: item.waktu_absen,
              };
            }
          });
          setAttendance(absensiMap);
          setIsEditing(false);
          setIsEditable(false);
        }
        setAbsensiFetched(true);
      } catch (error) {
        console.error("Error fetching absensi:", error.message);
        setHasAttendanceData(false);
        setIsEditing(true);
        setIsEditable(true);
      }
    };
    if (kelas) fetchAbsensi();
  }, [kelas]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `generatedAbsensi-${kelas}-${today}`;
    const stored = localStorage.getItem(key);
    if (stored === "true") {
      setHasGeneratedToday(true);
    }
  }, [kelas]);

  const handleAttendanceChange = (nisn, status) => {
    if (!isEditing) return;
    const now = new Date();
    const formattedTime = now.toTimeString().slice(0, 5);
    setAttendance((prev) => ({
      ...prev,
      [nisn]: {
        status,
        time: formattedTime,
      },
    }));
    setLastEdit(new Date().toLocaleString());
  };

  const handleGenerate = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const key = `generatedAbsensi-${kelas}-${today}`;
    localStorage.setItem(key, "true");
    setHasGeneratedToday(true);

    const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
    const date = now.toLocaleDateString("id-ID");
    const fullDay = `${dayName}, ${date}`;
    setDay(fullDay);

    const start = now.toTimeString().slice(0, 5);
    const endTimeObj = new Date(now.getTime() + 30 * 60000);
    const end = endTimeObj.toTimeString().slice(0, 5);

    setStartTime(start);
    setEndTime(end);
    setIsEditable(true);
  };

  const handleSave = async () => {
    if (!day || !startTime || !endTime) {
      setPopupMessage("Klik Generate dulu sebelum Save");
      return;
    }

    const absensiArray = Object.entries(attendance).map(([nisn, value]) => ({
      nisn,
      status: value.status,
      waktu_absen: value.time,
    }));

    const payload = {
      kelas,
      tanggal: new Date().toISOString().slice(0, 10),
      hari: day,
      mulai: startTime,
      selesai: endTime,
      absensi: absensiArray,
    };

    try {
      const response = await fetch("https://backendfix-production.up.railway.app/api/input-absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        setPopupMessage("Gagal menyimpan: " + JSON.stringify(err));
        return;
      }
      setPopupMessage("Absensi berhasil disimpan!");
      setIsEditing(false);
      setIsEditable(false);
    } catch (err) {
      setPopupMessage("Gagal: " + err.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const filteredStudents = students
    .filter((student) => student.nisn)
    .filter((student) => student.nama.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setAttendance({});
    setDay("");
    setStartTime("");
    setEndTime("");
    setIsEditing(true);
    setIsEditable(false);
    setLastEdit(null);
    setHasAttendanceData(false);

    const today = new Date().toISOString().slice(0, 10);
    const key = `generatedAbsensi-${kelas}-${today}`;
    localStorage.removeItem(key);
    setHasGeneratedToday(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date().toISOString().slice(0, 10);
      if (today !== lastDate) {
        resetForm();
        setLastDate(today);
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [lastDate]);

  useEffect(() => {
    if (!endTime) return;
    const checkEndTime = () => {
      const now = new Date();
      const [endHour, endMinute] = endTime.split(":").map(Number);
      const endDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);
      if (now >= endDateTime) {
        setAttendance((prev) => {
          const updated = {};
          Object.keys(prev).forEach((nisn) => {
            updated[nisn] = {
              status: "Tidak Hadir",
              time: prev[nisn]?.time || "",
            };
          });
          return updated;
        });
        setIsEditing(false);
        setIsEditable(false);
      }
    };
    checkEndTime();
    const intervalId = setInterval(checkEndTime, 60000);
    return () => clearInterval(intervalId);
  }, [endTime]);

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full overflow-x-auto relative">
      {popupMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center">
          {popupMessage}
        </div>
      )}

      <div className="mb-4 ml-0 sm:ml-5 gap-2 flex flex-col sm:block text-sm">
        <div className="flex">
          <strong className="w-28">Kelas</strong> <span>: {kelas}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Hari</strong> <span>: {day}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Mulai</strong> <span>: {startTime}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Selesai</strong> <span>: {endTime}</span>
        </div>
      </div>

      <div className="py-4 text-center sm:text-left sm:ml-5 -mt-5">
        <button
          className={`px-4 py-2 ${hasGeneratedToday ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
            } text-white rounded-md flex items-center justify-center`}
          onClick={handleGenerate}
          disabled={hasGeneratedToday}
        >
          <FaExternalLinkAlt className="mr-2" />
          {hasGeneratedToday ? "Sudah Digenerate" : "Generate Absensi"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full max-w-md"
        />
      </div>

      {loading && <p>Loading data siswa...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto max-sm:-mx-4">
          <table className="min-w-full border-t border-gray-300">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">No</th>
                <th className="py-2">Nama</th>
                <th className="py-2">Hadir</th>
                <th className="py-2">Tidak Hadir</th>
                <th className="py-2">Terlambat</th>
                <th className="py-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const uniqueId = student.nisn;
                return (
                  <tr key={`${student.id ?? index}-${index}`} className="border-b border-gray-300 text-center">
                    <td className="py-2">{index + 1}.</td>
                    <td className="py-6 pl-3 text-left">{student.nama}</td>
                    {["Hadir", "Tidak Hadir", "Terlambat"].map((status) => (
                      <td key={status} className="py-2 px-6">
                        <input
                          type="radio"
                          id={`attendance-${uniqueId}-${status}`}
                          name={`attendance-${uniqueId}`}
                          value={status}
                          checked={attendance[uniqueId]?.status === status}
                          onChange={() => handleAttendanceChange(uniqueId, status)}
                          disabled={!isEditing}
                          className="accent-blue-600"
                        />
                        <label htmlFor={`attendance-${uniqueId}-${status}`} className="sr-only">
                          {status}
                        </label>
                      </td>
                    ))}
                    <td className="py-2">{attendance[uniqueId]?.time || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {(isEditing || !hasAttendanceData) ? (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      {lastEdit && <p className="mt-2 text-gray-600">Last Edit: {lastEdit}</p>}
    </div>
  );
}
