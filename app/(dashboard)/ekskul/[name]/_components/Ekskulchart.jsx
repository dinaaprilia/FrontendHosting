"use client"; // ⬅️ HARUS di paling atas

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AiOutlineBarChart } from "react-icons/ai";
import { useEffect, useState } from "react";

export default function EkskulChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const ekskul = JSON.parse(localStorage.getItem("selectedEkskul"));
    const ekskulId = ekskul?.id;

    if (!ekskulId) {
      console.warn("❗ Ekskul ID tidak ditemukan di localStorage");
      return;
    }

    fetch(`https://backendfix-production.up.railway.app/api/statistik-ekskul?ekskul_id=${ekskulId}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch");
        return res.json();
      })
      .then((data) => {
        const formatted = Array.isArray(data)
          ? data.map((item) => ({
              name: item.name || "-",
              Anggota: item.Anggota ?? 0,
              Siswa: item.Siswa ?? 0,
            }))
          : [];

        setChartData(formatted);
      })
      .catch((err) => {
        console.error("❌ Gagal fetch data statistik ekskul:", err);
      });
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md h-[440px] max-sm:h-auto">
      <div className="flex items-center gap-2 mb-4 max-sm:flex-col max-sm:items-start max-sm:gap-1">
        <AiOutlineBarChart className="text-2xl text-black mt-2 max-sm:mt-0" />
        <h2 className="text-xl font-bold text-black mt-2 max-sm:text-base">
          Statistik Anggota Ekskul & Jumlah Siswa
        </h2>
      </div>

      <div className="w-full overflow-x-auto max-sm:-mx-4 max-sm:px-2">
        <div className="min-w-[640px] max-sm:min-w-[520px] h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="name" className="text-gray-600 text-xs" />
              <YAxis
                className="text-gray-600 text-xs"
                domain={[0, 30]} // 🔒 Tinggi tetap, ubah angka sesuai kebutuhan
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="Anggota" fill="#4F46E5" radius={[5, 5, 0, 0]} />
              <Bar dataKey="Siswa" fill="#10B981" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
