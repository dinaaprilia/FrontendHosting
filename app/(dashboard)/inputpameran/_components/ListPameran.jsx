'use client';

import { useState, useEffect } from 'react';
import GenerateButton from './buttongen';
import { useSearchParams } from "next/navigation";

export default function ListForm() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [formData, setFormData] = useState({ date: "", cost: "", endDate: "" });
  const [lastEdit, setLastEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [search, setSearch] = useState("");
  const [kelas, setKelas] = useState("");
  const [hasAttendanceData, setHasAttendanceData] = useState(false);
  const [lastDate, setLastDate] = useState(new Date().toISOString().slice(0, 10));
  const searchParams = useSearchParams();

  useEffect(() => {
    const kelasParam = searchParams.get("kelas") || "";
    setKelas(kelasParam);

    if (!kelasParam) return;
    const fetchStudents = async () => {
      try {
        const res = await fetch(`https://backendfix-production.up.railway.app/api/siswa-kelas?kelas=${encodeURIComponent(kelasParam)}`);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [searchParams]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    const fetchPameran = async () => {
      try {
        const res = await fetch(`https://backendfix-production.up.railway.app/api/absensi-pameran?kelas=${kelas}&tanggal=${today}`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
          setHasAttendanceData(false);
          setAttendance({});
          setIsEditing(true);
        } else {
          setHasAttendanceData(true);
          setFormData({
            date: data.tanggal_kegiatan || "",
            cost: data.biaya ? `Rp ${data.biaya.toLocaleString('id-ID')}` : "",
            endDate: data.batas_pendaftaran || "",
          });

          const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });

          const pameranMap = {};
          data.data.forEach(item => {
            if (item.nisn) {
              pameranMap[item.nisn] = {
                status: item.status,
                time: item.waktu_daftar || "",
                tanggal_daftar: formatDate(item.tanggal_daftar) || "",
              };
            }
          });
          setAttendance(pameranMap);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching pameran:", error.message);
      }
    };

    if (kelas) fetchPameran();
  }, [kelas]);

  const handleAttendanceChange = (nisn, status) => {
  if (!isEditing) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const formattedDate = now.toLocaleDateString('id-ID');
  const dayName = now.toLocaleDateString('id-ID', { weekday: 'long' });

  setAttendance((prev) => ({
    ...prev,
    [nisn]: {
      status,
      time: formattedTime,
      tanggal_daftar: `${dayName}, ${formattedDate}`,
    },
  }));

  setLastEdit(now.toLocaleString());
};


  const handleSave = async () => {
    if (!formData.date || !formData.endDate) {
      alert("Klik Generate dulu sebelum Save");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const PameranArray = Object.entries(attendance).map(([nisn, value]) => ({
      nisn,
      status: value.status,
      waktu_daftar: value.time,
      tanggal_daftar: today,
    }));

    const payload = {
      kelas,
      tanggal_kegiatan: today,
      hari_kegiatan: formData.date,
      batas_pendaftaran: formData.endDate,
      biaya: parseInt(formData.cost.replace(/[^\d]/g, '')) || 0,
      Pameran: PameranArray,
    };

    try {
      const response = await fetch('https://backendfix-production.up.railway.app/api/input-pameran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Data pameran berhasil disimpan!");
      setIsEditing(false);
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const handleFormSave = (data) => {
    setFormData(data);
  };

  const filteredStudents = students.filter(
    (student) => student.nisn && student.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <div className="mb-4 space-y-2 text-md">
        <div className="flex"><strong className="w-28">Kelas</strong><span>: {kelas}</span></div>
        <div className="flex"><strong className="w-28">Hari</strong><span>: {formData.date}</span></div>
        <div className="flex"><strong className="w-28">Biaya</strong><span>: {formData.cost}</span></div>
        <div className="flex"><strong className="w-28">Batas</strong><span>: {formData.endDate}</span></div>
        <div className="mb-2 flex justify-start">
          <GenerateButton onSave={handleFormSave} />
        </div>
      </div>
      <table className="w-full border-t border-gray-300 overflow-hidden">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2">No</th>
            <th className="py-2">Nama</th>
            <th className="py-2">Daftar</th>
            <th className="py-2">Tidak Daftar</th>
            <th className="py-2">Waktu</th>
            <th className="py-2">Hari/Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.nisn || index} className="border-b border-gray-300 text-center">
              <td className="py-2">{index + 1}</td>
              <td className="py-2 text-left">
                <div className="flex items-center gap-2">
                  <img src={student.foto || '/images/default-profile.png'} className="w-8 h-8 rounded-full object-cover" />
                  <span>{student.nama}</span>
                </div>
              </td>
              {["Daftar", "Tidak Daftar"].map((status) => (
                <td key={status} className="py-2 px-4">
                  <input
                    type="radio"
                    name={`attendance-${student.nisn}`}
                    value={status}
                    checked={attendance[student.nisn]?.status === status}
                    onChange={() => handleAttendanceChange(student.nisn, status)}
                    disabled={!isEditing}
                    className="accent-blue-600"
                  />
                </td>
              ))}
              <td className="py-2">{attendance[student.nisn]?.time || "-"}</td>
              <td className="py-2">{attendance[student.nisn]?.tanggal_daftar || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {(isEditing || !hasAttendanceData) ? (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSave}>Save</button>
        ) : (
          <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
      {lastEdit && <p className="mt-2 text-gray-600">Last Edit: {lastEdit}</p>}
    </div>
  );
}
