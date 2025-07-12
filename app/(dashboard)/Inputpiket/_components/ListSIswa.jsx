"use client";

import Image from "next/image";
import { FaUsers, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DetailPiketPopup from "./DetilPiketSiswa"; // pastikan path-nya sesuai

export default function StudentList() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (!kelas) return;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://backendfix-production.up.railway.app/api/siswa-kelas?kelas=${encodeURIComponent(kelas)}`
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data siswa");
        }
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

  const filteredStudents = students
    .filter((student) => student.nisn !== null && student.nisn !== "")
    .filter((student) =>
      student.nama.toLowerCase().includes(search.toLowerCase())
    );

  if (!kelas) return <p>Mohon pilih kelas terlebih dahulu.</p>;
  if (loading) return <p>Memuat data siswa...</p>;
  if (error) return <p>Error: {error}</p>;
  if (students.length === 0) return <p>Tidak ada siswa di kelas {kelas}</p>;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <FaUsers /> Daftar Siswa Kelas {kelas}
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari siswa..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 sm:p-4 sm:pl-20">No</th>
              <th className="text-left p-3 sm:p-4 sm:pl-10">Nama</th>
              <th className="text-left p-3 sm:p-4 sm:pl-9">NISN</th>
              <th className="text-left p-3 sm:p-4 sm:pl-4">Jenis Kelamin</th>
              <th className="text-left p-3 sm:p-4">Tanggal Lahir</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={`${student.nisn}-${index}`} className="border-b">
                <td className="p-3 sm:p-4 sm:pl-20">{index + 1}.</td>
                <td className="p-3 sm:p-4 flex items-center gap-2">
                  <img
                    src={
                      student.foto_profil
                        ? `https://backendfix-production.up.railway.app/storage/${student.foto_profil}`
                        : "/images/profil.png"
                    }
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setSelectedStudent({
                        ...student,
                        kelas: student.kelas || kelas
                      });
                      setPopupOpen(true);
                    }}
                  >
                    {student.nama}
                  </button>
                </td>
                <td className="p-2 sm:pr-10">{student.nisn}</td>
                <td className="p-3 sm:p-4 sm:pr-2">
                  <span
                    className={`px-3 py-1 text-xs sm:text-sm rounded-full text-white ${student.jenis_kelamin === "P"
                      ? "bg-pink-400"
                      : "bg-purple-500 ml-2"
                      }`}
                  >
                    {student.jenis_kelamin === "P"
                      ? "Perempuan"
                      : "Laki-laki"}
                  </span>
                </td>
                <td className="p-3 sm:p-6">
                  {student.tanggal_lahir
                    ? new Date(student.tanggal_lahir).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal DetailPiketPopup */}
      {popupOpen && selectedStudent && (
        <DetailPiketPopup
          anggota={selectedStudent}
          onClose={() => {
            setPopupOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
