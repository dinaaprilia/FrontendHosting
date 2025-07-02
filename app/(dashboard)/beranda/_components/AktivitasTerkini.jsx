import React, { useEffect, useState } from "react";
import { FaClock, FaChevronDown } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/id"; // import bahasa Indonesia
import localizedFormat from "dayjs/plugin/localizedFormat"; // untuk format seperti "Senin, 27 Mei 2025"

dayjs.extend(localizedFormat);
dayjs.locale("id"); // set bahasa Indonesia

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/recent-activity", {
          headers: {
            "Content-Type": "application/json",
            // Jika endpoint dilindungi oleh JWT:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat aktivitas");
        }

        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="p-5 rounded-xl shadow-md bg-white w-full max-w-6xl mx-auto mt-5">
  <h2 className="text-xl font-semibold mb-3 flex items-center">
    <FaClock className="mr-2 text-lg" /> Recent Activity
  </h2>

  <div className="overflow-x-auto">
    {loading ? (
      <div className="text-center py-6 text-gray-500">Loading...</div>
    ) : (
      <div className={`${activities.length >= 6 ? "max-h-96 overflow-y-auto" : ""}`}>
        <table className="min-w-[700px] w-full text-sm sm:text-base table-fixed">
          <thead className="sticky top-0 bg-white z-10 shadow">
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2 min-w-[130px] text-center">Tanggal</th>
              <th className="py-3 px-2 min-w-[100px] text-center">Waktu</th>
              <th className="py-3 px-2 min-w-[200px] text-center">Nama</th>
              <th className="py-3 px-2 min-w-[130px] text-center">Status</th>
              <th className="py-3 px-2 min-w-[100px] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index} className="border-b text-gray-700 text-center">
                <td className="py-3 px-2 font-semibold">
                  {dayjs(activity.date).format("dddd, DD MMMM YYYY")}
                </td>
                <td className="py-3 px-2">{activity.time}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={activity.avatar || "/images/profil.png"}
                      alt={activity.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    <span className="truncate max-w-[100px] sm:max-w-none">{activity.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-center">
                    <span className={`text-white px-3 py-1 rounded-lg text-xs sm:text-sm ${activity.color}`}>
                      <span className={activity.roleColor}>{activity.role}</span>
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">{activity.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
  );
};

export default RecentActivity;
