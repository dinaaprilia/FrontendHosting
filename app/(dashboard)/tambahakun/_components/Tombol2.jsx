import React, { useState } from "react";

const AccountTabs = ({ onTabChange, onlyUserTab = false }) => {
  const [activeTab, setActiveTab] = useState("user");

  const handleTabClick = (tab) => {
    // Jika hanya boleh akses user, jangan izinkan klik "admin"
    if (onlyUserTab && tab === "admin") return;

    setActiveTab(tab);
    onTabChange(tab); // Kirim ke parent (Beranda)
  };

  return (
    <div className="flex border-b border-gray-300 w-full max-w-md sm:mt-10 mt-1">
      <button
        className={`flex-1 text-center py-2 font-medium ${
          activeTab === "user"
            ? "text-black border-b-2 border-purple-500"
            : "text-gray-500"
        }`}
        onClick={() => handleTabClick("user")}
      >
        Siswa
      </button>

      <button
        className={`flex-1 text-center py-2 font-medium ${
          onlyUserTab
            ? "text-gray-300 cursor-not-allowed"
            : activeTab === "admin"
            ? "text-black border-b-2 border-purple-500"
            : "text-gray-500"
        }`}
        disabled={onlyUserTab}
        onClick={() => handleTabClick("admin")}
      >
        Guru
      </button>
    </div>
  );
};

export default AccountTabs;
