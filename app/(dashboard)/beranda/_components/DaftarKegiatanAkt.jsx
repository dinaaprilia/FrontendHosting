"use client";

import React, { useState, useEffect } from "react";
import { FaDownload, FaUser } from "react-icons/fa";
import PesertaModal from "../../kegiatan/_components/Peserta";

const AktivitasKegiatan = () => {
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kegiatan");
  const [selectedMonth, setSelectedMonth] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pesertaData, setPesertaData] = useState([]);
  const [judulDipilih, setJudulDipilih] = useState("");

  const bukaModalPeserta = (judul, startDateObj) => {
    if (!startDateObj) return;
    const tanggalFormatted = new Date(startDateObj).toLocaleDateString("sv-SE");
    fetch(`https://backendfix-production.up.railway.app/api/peserta-karya-wisata?judul=${encodeURIComponent(judul)}&tanggal=${tanggalFormatted}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setPesertaData(data.data);
          setJudulDipilih(judul);
          setModalOpen(true);
        }
      })
      .catch((err) => {
        console.error("Gagal ambil peserta:", err);
      });
  };

  const months = [
    "Semua", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    fetch("https://backendfix-production.up.railway.app/api/semua-kegiatan")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const mapped = data.data.map((item) => {
            const startRaw = item.is_karya_wisata === "1"
  ? new Date(item.start.replace(" ", "T"))
  : new Date(item.end.replace(" ", "T")); // untuk ekskul, start = created_at

const endRaw = item.is_karya_wisata === "1"
  ? new Date(item.end.replace(" ", "T"))
  : new Date(item.start.replace(" ", "T")); // untuk ekskul, end = date
  
            let total = null;
            if (endRaw) {
              endRaw.setHours(0, 0, 0, 0);
              const diff = endRaw - today;
              total = Math.ceil(diff / (1000 * 60 * 60 * 24));
            }

            return {
              name: item.nama_kegiatan,
              category: item.category,
              penanggungJawab: item.penanggung_jawab,
              jumlahPeserta: item.jumlah_peserta ?? 0,
              startDate: startRaw,
              start: startRaw
                ? startRaw.toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                  }) : "-",
              end: endRaw
                ? endRaw.toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                  }) : "-",
              totalDaysRaw: total,
              totalDaysLabel:
                total === null ? "-" : total >= 0 ? `${total} hari lagi` : "Selesai"
            };
          });

          mapped.sort((a, b) => {
            if (!a.startDate) return 1;
            if (!b.startDate) return -1;
            return a.startDate - b.startDate;
          });

          setActivities(mapped);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueYears = Array.from(
    new Set(
      activities
        .map((act) => act.startDate?.getFullYear())
        .filter((year) => year !== undefined && year !== null)
    )
  ).sort((a, b) => b - a).map((year) => year.toString());

  const years = ["Semua", ...uniqueYears];

  const filteredActivities = activities.filter((activity) => {
    const matchCategory =
      selectedCategory === "Semua Kegiatan" || activity.category === selectedCategory;

    const matchMonth =
      selectedMonth === "Semua" ||
      (activity.startDate && activity.startDate.getMonth() === months.indexOf(selectedMonth) - 1);

    const matchYear =
      selectedYear === "Semua" ||
      (activity.startDate && activity.startDate.getFullYear().toString() === selectedYear);

    const totalDays = Number(activity.totalDaysRaw);
    const matchStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Berlangsung" && totalDays >= 0) ||
      (statusFilter === "Selesai" && totalDays < 0);

    return matchCategory && matchMonth && matchYear && matchStatus;
  });

  const handleDownload = () => {
    const csvContent = [
      ["No", "Nama Kegiatan", "Kategori", "Penanggung Jawab", "Start", "End", "Total Days"].join(","),
      ...filteredActivities.map((activity, index) =>
        [
          index + 1,
          activity.name,
          activity.category,
          activity.penanggungJawab,
          activity.start,
          activity.end,
          activity.totalDaysLabel,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "daftar_kegiatan.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div>Loading...</div>;

  const categoryLabels = {
    "Semua Kegiatan": "Semua Kegiatan",
    Ekstrakurikuler: "Ekstrakurikuler",
    "Karya Wisata": "Karya Wisata",
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 text-center mt-5 overflo-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar Kegiatan Aktivitas</h2>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          <FaDownload />
          <span>Download</span>
        </button>
      </div>

      <div className="overflow-x-auto whitespace-nowrap mb-4">
        <div className="flex space-x-6">
          {Object.keys(categoryLabels).map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="accent-black"
              />
              <span>{categoryLabels[category]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium whitespace-nowrap">Bulan:</label>
            <select
              className="border px-3 py-1 rounded w-36"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month, idx) => (
                <option key={idx} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium whitespace-nowrap">Tahun:</label>
            <select
              className="border px-3 py-1 rounded w-28"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium whitespace-nowrap">Status:</label>
            <select
              className="border px-3 py-1 rounded w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[250px] border border-gray-300 rounded">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nama Kegiatan</th>
              <th className="px-4 py-2 border">Kategori</th>
              <th className="px-4 py-2 border">Penanggung Jawab</th>
              <th className="px-4 py-2 border">Jumlah Peserta</th>
              <th className="px-4 py-2 border">Start</th>
              <th className="px-4 py-2 border">End</th>
              <th className="px-4 py-2 border">Total Days</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${activity.totalDaysRaw >= 0 ? "bg-blue-50" : ""}`}
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{activity.name}</td>
                <td className="px-4 py-2 border">{activity.category}</td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <FaUser className="text-gray-500 text-sm" />
                    <span className="whitespace-nowrap">{activity.penanggungJawab}</span>
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => bukaModalPeserta(activity.name, activity.startDate)}
                    className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-300 hover:bg-blue-200 transition"
                    title="Klik untuk lihat daftar peserta"
                  >
                    {activity.jumlahPeserta} siswa
                  </button>
                </td>
                <td className="px-4 py-2 border">{activity.start}</td>
                <td className="px-4 py-2 border">{activity.end}</td>
                <td className="px-4 py-2 border">{activity.totalDaysLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <PesertaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          peserta={pesertaData}
          judul={judulDipilih}
        />
      </div>
    </div>
  );
};

export default AktivitasKegiatan;
