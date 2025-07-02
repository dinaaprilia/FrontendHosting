"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded shadow-lg text-white z-50 ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
}

export default function ListForm() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "X-A";

  const [students, setStudents] = useState([]);
  const [list, setList] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [lastEdit, setLastEdit] = useState(null);

  const [judul, setJudul] = useState("-");
  const [tanggal, setTanggal] = useState("-");
  const [hari, setHari] = useState("-");
  const [cost, setCost] = useState("-");
  const [endDate, setEndDate] = useState("-");
  const [endDay, setEndDay] = useState("-");
  const [isGenerateEdit, setIsGenerateEdit] = useState(false);

  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const formatDateWithDay = (dateStr) => {
    if (!dateStr || !mounted) return "-";
    const options = { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  const getDayName = (dateStr) => {
    if (!dateStr || !mounted) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" });
  };

  useEffect(() => {
    axios.get("https://backendfix-production.up.railway.app/api/users/siswa")
      .then(res => {
        const filtered = res.data.data.filter(s => s.kelas === kelas);
        setStudents(filtered);
      });
  }, [kelas]);

  useEffect(() => {
    if (!mounted) return;

    const fetchInfo = async () => {
      try {
        const [infoRes, ikutRes] = await Promise.all([
          axios.get("https://backendfix-production.up.railway.app/api/karya-wisata-info/current-title"),
          axios.get("https://backendfix-production.up.railway.app/api/ikut-serta-karya-wisata", { params: { kelas } })
        ]);

        const info = infoRes.data?.data;
        const ikut = ikutRes.data?.data;

        if (info) {
          const newJudul = info.title || "-";
          setJudul(newJudul);
          setTanggal(info.tanggal || "-");
          setHari(formatDateWithDay(info.tanggal));
          localStorage.setItem("judul_karya_wisata", newJudul);
        }

        if (ikut) {
          setCost(ikut.biaya || "-");
          setEndDate(ikut.batas_pendaftaran || "-");
          setEndDay(getDayName(ikut.batas_pendaftaran));
        }

        let cache = {};
        try {
          cache = JSON.parse(localStorage.getItem("absensi_karya_" + kelas)) || {};
        } catch (e) {
          console.warn("⚠️ Gagal parse cache:", e);
        }

        if (cache?.judul === info?.title) {
          setList(cache.list || {});
          setIsEditing(false); // ✅ jika cache valid, jangan mode edit
        } else {
          setList({});
          setIsEditing(true); // ✅ jika tidak cocok, aktifkan edit
        }
      } catch (err) {
        console.error("Gagal mengambil data info atau ikut-serta:", err);
      }
    };

    fetchInfo();
  }, [kelas, mounted]);

  useEffect(() => {
    if (endDate && endDate !== "-") setEndDay(getDayName(endDate));
  }, [endDate]);

  const handleListChange = (id, status) => {
    if (!isEditing || !endDate || endDate === "-") return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID");
    const timeStr = now.toLocaleTimeString("id-ID", {
      hour: '2-digit', minute: '2-digit', hour12: false
    }).replace(":", ".");
    const day = now.toLocaleDateString("id-ID", { weekday: "long" });

    const updated = {
      ...list,
      [id]: {
        status,
        waktu: timeStr,
        tanggal: new Date().toISOString().split("T")[0]
      }
    };

    setList(updated);
    setLastEdit(`${day}, ${dateStr} ${timeStr}`);

    localStorage.setItem("absensi_karya_" + kelas, JSON.stringify({
      judul,
      list: updated,
      cost,
      endDate
    }));
  };

  const handleSave = async () => {
    try {
      const payload = students
        .filter(s => list[s.id])
        .map(s => ({
          user_id: s.id,
          status: list[s.id].status,
          waktu: list[s.id].waktu,
          tanggal: list[s.id].tanggal,
        }));

      await axios.post("https://backendfix-production.up.railway.app/api/absensi-karya-wisata", {
        kelas,
        judul,
        data: payload,
      });

      localStorage.setItem("absensi_karya_" + kelas, JSON.stringify({
        judul,
        list,
        cost,
        endDate
      }));

      setToast({ message: "✅ Data absensi berhasil disimpan.", type: "success" });
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Gagal menyimpan absensi:", err.response?.data || err);
      setToast({ message: "❌ Gagal menyimpan absensi.", type: "error" });
    }
  };

  const handleGenerate = () => {
    setCost("Rp 50000");
    setIsGenerateEdit(true);
    if (tanggal && tanggal !== "-") {
      const deadline = new Date(tanggal);
      deadline.setDate(deadline.getDate() + 3);
      setEndDate(deadline.toISOString().split("T")[0]);
    }
  };

  const handleConfirmYes = async () => {
    if (confirmAction) await confirmAction();
    setShowConfirm(false);
  };

  if (!mounted) return null;
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow text-sm sm:text-base">
      <div className="mb-4 space-y-2">
        <div className="flex max-sm:flex-col"><strong className="w-28">Kelas</strong><span>: {kelas}</span></div>
        <div className="flex max-sm:flex-col"><strong className="w-28">Hari</strong><span>: {hari}</span></div>
        <div className="flex max-sm:flex-col"><strong className="w-28">Judul</strong><span>: {judul}</span></div>
        <div className="flex items-start max-sm:flex-col">
          <strong className="w-28">Biaya</strong>
          <span className="max-sm:mt-1">:
            {isGenerateEdit ? (
              <input type="text" className="ml-2 p-1 border rounded max-sm:ml-0 max-sm:w-full" value={cost} onChange={(e) => setCost(e.target.value)} />
            ) : (
              <span className="ml-2">{cost}</span>
            )}
          </span>
        </div>
        <div className="flex items-start max-sm:flex-col">
          <strong className="w-28">Selesai</strong>
          <span className="max-sm:mt-1">:
            {isGenerateEdit ? (
              <>
                <input type="date" className="ml-2 p-1 border rounded max-sm:ml-0 max-sm:w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <span className="ml-2 text-gray-500 italic max-sm:ml-0">({endDay})</span>
              </>
            ) : (
              <span className="ml-2">{endDate !== "-" ? `${endDay}, ${endDate}` : "-"}</span>
            )}
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={handleGenerate} className="px-4 py-2 bg-purple-600 text-white rounded-md">Generate Info</button>
        {isGenerateEdit && (
          <button
            onClick={() => {
              setConfirmAction(() => async () => {
                try {
                  await axios.post("https://backendfix-production.up.railway.app/api/ikut-serta-karya-wisata", {
                    kelas,
                    biaya: cost,
                    batas_pendaftaran: endDate,
                  });
                  setToast({ message: "✅ Info disimpan!", type: "success" });
                  setIsGenerateEdit(false);
                } catch (err) {
                  setToast({ message: "❌ Gagal simpan info.", type: "error" });
                }
              });
              setShowConfirm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >Submit</button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-300 min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2">No</th>
              <th className="py-2 text-left pl-3">Nama</th>
              <th className="py-2">Hadir</th>
              <th className="py-2">Tidak</th>
              <th className="py-2">Waktu</th>
              <th className="py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id} className="border-b text-center">
                <td className="py-2">{idx + 1}</td>
                <td className="text-left font-semibold pl-3">{s.nama}</td>
                {["Hadir", "Tidak Hadir"].map(status => (
                  <td key={status} className="py-2 px-6">
                    <input
                      type="radio"
                      name={`radio-${s.id}`}
                      checked={list[s.id]?.status === status}
                      onChange={() => handleListChange(s.id, status)}
                      disabled={!isEditing || !endDate || endDate === "-"}
                    />
                  </td>
                ))}
                <td className="py-2">{list[s.id]?.waktu || '-'}</td>
                <td className="py-2">{list[s.id]?.tanggal || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isEditing ? (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSave} disabled={!endDate || endDate === "-"}>Save</button>
        ) : (
          <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>

      {lastEdit && <p className="mt-2 text-gray-500 text-sm">Last edit: {lastEdit}</p>}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold">Lanjutkan submit?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirmYes} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Ya</button>
              <button onClick={() => setShowConfirm(false)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
