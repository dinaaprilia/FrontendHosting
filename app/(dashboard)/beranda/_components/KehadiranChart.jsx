"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
dayjs.extend(localizedFormat);
dayjs.locale("id");

const KehadiranChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const chartRef = useRef(null);

  const formatDateISO = (date) => date.toISOString().split("T")[0];

  const tanggalDisplay = selectedDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const dateStr = formatDateISO(selectedDate);

    fetch(`https://backendfix-production.up.railway.app/api/kehadiran-chart?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.kelas);
        const hadir = data.map((item) => item.hadir);
        const total = data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Jumlah Kehadiran",
              data: hadir,
              backgroundColor: "#B2A5FF",
              borderRadius: 20,
            },
            {
              label: "Jumlah Keseluruhan Siswa",
              data: total,
              backgroundColor: "#493D9E",
              borderRadius: 20,
            },
          ],
        });
      })
      .catch((err) => console.error("Gagal memuat data chart:", err));
  }, [selectedDate]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // legend default dimatikan
      tooltip: { enabled: true },
    },
    scales: {
 y: {
  beginAtZero: true,
  suggestedMax: 30, // Coba tampilkan hingga 60, tapi masih fleksibel jika ada data lebih
  ticks: {
    stepSize: 5,
    callback: function (value) {
      return Number.isInteger(value) ? value : null;
    },
    },
    grid: { color: "rgba(0, 0, 0, 0.2)" },
  },
  x: {
    ticks: { color: "#000" },
    grid: { display: false },
  },
},
    layout: { padding: 0 },
    maintainAspectRatio: false,
  };

  const handleDownloadPDF = () => {
    if (!chartRef.current) return;

    html2canvas(chartRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`kehadiran-chart-${formatDateISO(selectedDate)}.pdf`);
    });
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto rounded-2xl shadow-lg bg-white mt-5"
      style={{ height: "620px" }}
    >
      <div className="p-5 h-full flex flex-col overflow-visible">
        {/* Judul chart */}
        <h2 className="text-md font-semibold mb-2 text-center">
          Kehadiran Absensi Apel Pagi Siswa - {tanggalDisplay}
        </h2>

        {/* Input tanggal */}
        <div className="flex justify-center mb-4">
          <input
            type="date"
            className="p-2 border rounded"
            max={formatDateISO(new Date())}
            value={formatDateISO(selectedDate)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>

        {/* Chart */}
        <div
  ref={chartRef}
  style={{ flexGrow: 1, minHeight: 0 }}
  className="max-sm:overflow-x-auto max-sm:-mx-4"
>
  <div className="max-sm:min-w-[600px]">
    {chartData ? (
      <Bar data={chartData} options={options} height={400} />
    ) : (
      <p className="text-center p-10">Memuat data...</p>
    )}
  </div>
</div>

        {/* Legend manual + tombol download */}
       {/* Legend manual + tombol download */}
{chartData && (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 px-2 gap-2 sm:gap-0">
    {/* Legend */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm font-semibold text-gray-700 text-center sm:text-left">
      <div className="flex items-center gap-2 justify-center">
        <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: "#B2A5FF" }} />
        Jumlah Kehadiran
      </div>
      <div className="flex items-center gap-2 justify-center">
        <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: "#493D9E" }} />
        Jumlah Keseluruhan Siswa
      </div>
    </div>

    {/* Tombol Download */}
    <div className="flex justify-center sm:justify-end">
      <button
        onClick={handleDownloadPDF}
        className="p-2 text-blue-600 hover:text-blue-800 transition"
        title="Download Chart sebagai PDF"
        aria-label="Download PDF"
      >
        <FiDownload size={24} />
      </button>
    </div>
  </div>
        )}
      </div>
    </div>
  );
};

export default KehadiranChart;
