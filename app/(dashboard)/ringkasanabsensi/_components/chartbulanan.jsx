"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceChart = ({ selectedDate, onDateChange }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [data, setData] = useState([
    { name: 'Hadir', jumlah: 0, color: "#5CB338", hoverColor: "#4AA62D" },
    { name: 'Tidak Hadir', jumlah: 0, color: "#FB4141", hoverColor: "#D93636" },
    { name: 'Terlambat', jumlah: 0, color: "#FFBB03", hoverColor: "#E6A800" },
  ]);

  useEffect(() => {
    const bulan = selectedDate.getMonth() + 1;
    const tahun = selectedDate.getFullYear();

    fetch(`https://backendfix-production.up.railway.app/api/statistik-bulanan?bulan=${bulan}&tahun=${tahun}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(() => {
        setData([
          { name: 'Hadir', jumlah: 0, color: "#5CB338", hoverColor: "#4AA62D" },
          { name: 'Tidak Hadir', jumlah: 0, color: "#FB4141", hoverColor: "#D93636" },
          { name: 'Terlambat', jumlah: 0, color: "#FFBB03", hoverColor: "#E6A800" },
        ]);
      });
  }, [selectedDate]);

  return (
    <div className="w-full h-auto p-4 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Statistik Kehadiran</h2>

      {/* Pilihan Bulan & Tahun */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4 sm:ml-5">
        <p className="font-semibold">Pilih Bulan & Tahun:</p>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="border px-3 py-2 rounded-lg shadow-sm w-full sm:w-auto"
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data} margin={{ left: 20, right: 40 }} barGap={8}>
          <XAxis type="number" domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={0} axisLine={false} tickLine={false} tick={false} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="jumlah" barSize={45} radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoverIndex === index ? entry.hoverColor : entry.color}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            ))}
            <LabelList dataKey="jumlah" position="right" formatter={(value) => `${value}%`} fill="#333" fontSize={14} fontWeight="bold" offset={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 sm:mt-4 mt-2 text-center sm:text-left">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-5 h-5" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
