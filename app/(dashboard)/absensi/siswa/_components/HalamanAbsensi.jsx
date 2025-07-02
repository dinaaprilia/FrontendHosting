'use client';

import { useState } from 'react';
import KehadiranBulanan from './BulananHadir';
import AttendanceTable from './riwayatsiswa';

export default function HalamanAbsensi() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <KehadiranBulanan selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <AttendanceTable selectedDate={selectedDate} />
    </div>
  );
}
