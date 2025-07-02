import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("id");

export default function PiketCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://backendfix-production.up.railway.app/api/piket-card")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data");
        return res.json();
      })
      .then((json) => {
        console.log("RESPON PIKET:", json);
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch:", err);
        setError("Gagal memuat data piket");
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <p>⏳ Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-[#869ddd] p-6 rounded-2xl shadow-lg w-full max-w-7xl h-[220px] max-sm:h-auto max-sm:flex-col flex justify-between items-start max-sm:items-center max-sm:text-center sm:mt-5 mt-2">
      <div className="flex-1 flex flex-col justify-center max-sm:items-center">
        <div className="flex items-center gap-3 max-sm:flex-col max-sm:gap-1">
          <FaBullhorn className="text-white text-2xl" />
          <h2 className="text-white font-semibold text-2xl max-sm:text-lg">Petugas Piket Harian Siswa</h2>
        </div>
        <p className="text-white font-medium text-xl mt-1 max-sm:text-base">
          {data?.tanggal ? dayjs(data.tanggal).format("dddd, D MMMM YYYY") : "Tanggal tidak tersedia"}
        </p>
        <div className="flex justify-center items-center ml-28 mt-2 max-sm:ml-0">
          <p className="text-6xl font-bold text-blue-950 max-sm:text-4xl">
            {data?.kelas || "-"}
          </p>
        </div>
      </div>
      <div className="w-24 h-24 mr-8 overflow-hidden flex-shrink-0 mt-10 max-sm:mt-4 max-sm:mr-0 max-sm:w-20 max-sm:h-20">
        <img src="/images/piketcard.png" alt="logo piket" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
