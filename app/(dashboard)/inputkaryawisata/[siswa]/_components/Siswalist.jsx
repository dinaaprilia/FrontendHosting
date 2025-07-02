"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function StudentList() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!kelas) return;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/siswa-kelas?kelas=${encodeURIComponent(kelas)}`
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
    .filter(student => student.nisn !== null && student.nisn !== "")
    .filter(student => student.nama.toLowerCase().includes(search.toLowerCase()));

  if (!kelas) return <p>Mohon pilih kelas terlebih dahulu.</p>;
  if (loading) return <p>Memuat data siswa...</p>;
  if (error) return <p>Error: {error}</p>;
  if (students.length === 0) return <p>Tidak ada siswa di kelas {kelas}</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="sm:text-xl text-md font-bold flex items-center gap-2">
          <FaUsers /> Daftar Siswa Kelas {kelas}
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari siswa..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 sm:pl-20 pl-2">No</th>
              <th className="text-left p-4 pl-10">Nama</th>
              <th className="text-left p-4 pl-9">NISN</th>
              <th className="text-left p-4 pl-4">Jenis Kelamin</th>
              <th className="text-left p-4">Tanggal Lahir</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={`${student.nisn}-${index}`} className="border-b">
                <td className="p-4 sm:pl-20 pl-2">{index + 1}.</td>
                <td className="p-4 flex items-center gap-2">
                  <Image
    src={student.avatar && student.avatar !== "" ? student.avatar : "/images/profil.png"}
    alt={`Foto ${student.nama}`}
    width={32}
    height={32}
    className="rounded-full object-cover"
    onError={(e) => (e.target.src = "/images/profil.png")}
  />
  <span className="font-medium text-gray-800">{student.nama}</span>
</td>
                <td className="p-4 pr-7">{student.nisn}</td>
                <td className="p-4 pr-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full text-white ${
                      student.jenis_kelamin === "P"
                        ? "bg-pink-400"
                        : "bg-purple-500 ml-2"
                    }`}
                  >
                    {student.jenis_kelamin === "P" ? "Perempuan" : "Laki-laki"}
                  </span>
                </td>
                <td className=" p-2">
                  {student.tanggal_lahir
                    ? new Date(student.tanggal_lahir).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}