"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://localhost:8000/api";

export default function RekapanChart({ ekskulId }) {
  const [data, setData] = useState([]);
  const [tanggal, setTanggal] = useState(new Date());

  useEffect(() => {
    if (!ekskulId || !tanggal) return;

    const isoDate = tanggal.toISOString().split("T")[0];

    fetch(`${API_BASE}/absensi-ekskul/rekap-per-tanggal?ekskul_id=${ekskulId}&tanggal=${isoDate}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data)) {
          const grouped = {};

          json.data.forEach((item) => {
            const nama = item.nama;
            const status = item.status;
            const jumlah = item.jumlah;

            if (!grouped[nama]) {
              grouped[nama] = {
                name: nama,
                Hadir: 0,
                "Tidak Hadir": 0,
                Terlambat: 0,
              };
            }

            if (status === "hadir") grouped[nama].Hadir = jumlah;
            else if (status === "tidak hadir") grouped[nama]["Tidak Hadir"] = jumlah;
            else if (status === "terlambat") grouped[nama].Terlambat = jumlah;
          });

          setData(Object.values(grouped));
        } else {
          console.warn("⚠️ Data rekap tidak valid:", json);
          setData([]);
        }
      })
      .catch((err) => {
        console.error("❌ Gagal mengambil data rekap:", err);
        setData([]);
      });
  }, [ekskulId, tanggal]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full">
      <h2 className="text-lg font-bold mb-4 text-black">Rekap Absensi Harian</h2>

      <div className="mb-4">
        <label className="font-semibold mr-2 text-sm text-gray-700">Pilih Tanggal:</label>
        <DatePicker
          selected={tanggal}
          onChange={(date) => setTanggal(date)}
          dateFormat="yyyy-MM-dd"
          className="border px-2 py-1 rounded-md"
        />
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500">Belum ada data absensi pada tanggal ini.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" className="text-xs text-gray-600" />
            <YAxis allowDecimals={false} className="text-xs text-gray-600" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Hadir" fill="#16a34a" radius={[4, 4, 0, 0]} /> {/* green-600 */}
            <Bar dataKey="Tidak Hadir" fill="#dc2626" radius={[4, 4, 0, 0]} /> {/* red-600 */}
            <Bar dataKey="Terlambat" fill="#ca8a04" radius={[4, 4, 0, 0]} /> {/* yellow-600 */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
