"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import FilterButton from "./tombolfilter";

const formatName = (fullName) => {
  const nameParts = fullName.split(" ");
  return nameParts.length <= 3
    ? fullName
    : `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2][0]}. ${nameParts[nameParts.length - 1]}`;
};

const AttendanceMonthTable = ({ selectedDate }) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const bulan = selectedDate.getMonth() + 1;
      const tahun = selectedDate.getFullYear();

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedClass && selectedClass !== "Semua Kelas") params.append("kelas", selectedClass);
      params.append("bulan", bulan);
      params.append("tahun", tahun);
      params.append("role", "siswa"); // ✅ Tambahkan filter hanya siswa

      const res = await fetch(`https://backendfix-production.up.railway.app/api/list-absensi-siswa?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, searchTerm, selectedClass]);

  const handleDownload = () => {
    const csvContent = [
      ["No", "NISN", "Nama", "Kelas", "Hadir", "Terlambat", "Tidak Hadir"].join(","),
      ...attendanceData.map((student, index) => [
        index + 1,
        student.nisn,
        student.nama,
        student.kelas,
        student.hadir,
        student.terlambat,
        student.tidakHadir,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kehadiran_siswa.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDetailClick = (nisn) => {
    router.push(`/detailabsensi?nisn=${nisn}`);
  };

  return (
    <div className="w-full p-8 bg-white rounded-xl shadow-md mt-5">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
          <TextField
            label="Search Nama"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <FilterButton onSelect={setSelectedClass} />
        </div>
        <Button
          variant="contained"
          color="success"
          onClick={handleDownload}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <FaDownload size={20} />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading data...</p>
        ) : (
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-black text-center bg-gray-100">
                <th className="px-4 sm:px-6 py-4">No</th>
                <th className="px-4 sm:px-6 py-4">NISN</th>
                <th className="px-4 sm:px-6 py-4">Nama</th>
                <th className="px-4 sm:px-6 py-4 text-left">Kelas</th>
                <th className="px-4 sm:px-6 py-4">Hadir</th>
                <th className="px-4 sm:px-6 py-4">Tidak Hadir</th>
                <th className="px-4 sm:px-6 py-4">Terlambat</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                attendanceData.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-300 text-center">
                    <td className="px-4 sm:px-6 py-4">{index + 1}.</td>
                    <td className="px-4 sm:px-6 py-4">{student.nisn}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <a
                        href="#"
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleDetailClick(student.nisn)}
                      >
                        {formatName(student.nama)}
                      </a>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-left">{student.kelas}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-medium">
                          {student.hadir}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-medium">
                          {student.tidakHadir}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-medium">
                          {student.terlambat}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceMonthTable;
