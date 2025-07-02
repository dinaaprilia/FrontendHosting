"use client";

import React, { useState, useEffect } from "react";
import { FaDownload, FaUserPlus, FaTrash } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdCloseCircle } from "react-icons/io";
import TambahAkunForm from "./InputManualAdm";
import ProfileDetailGuru from "./DetailProfilGuru";

const AdminTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [showAddAccountPopup, setShowAddAccountPopup] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [guru, setGuru] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [guruToDelete, setGuruToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const formatName = (fullName) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length <= 3) return fullName;
    return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2][0]}. ${nameParts[nameParts.length - 1]}`;
  };

  const fetchGuruData = () => {
    fetch("http://localhost:8000/api/guru")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data guru");
        return res.json();
      })
      .then((data) => {
        setGuru(data.data || []);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    fetchGuruData();
  }, []);

  const filteredUsers = guru.filter((guru) =>
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType !== "xls" && fileType !== "xlsx") {
        alert("❌ Hanya file Excel (.xls, .xlsx) yang diperbolehkan!");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleCloseAddAccountPopup = () => {
    setShowAddAccountPopup(false);
    fetchGuruData();
  };

  const handleDeleteClick = (guru) => {
    setGuruToDelete(guru);
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (!guruToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/users/${guruToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setGuru((prev) => prev.filter((g) => g.id !== guruToDelete.id));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      console.error("Gagal hapus:", err);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
    setShowConfirm(false);
    setGuruToDelete(null);
  };

  return (
    <div className="p-4 sm:mt-10 mt-5 bg-white rounded-xl shadow-md w-full">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-green-700 px-6 py-3 rounded-lg shadow-lg border border-green-500">
            ✅ Akun guru berhasil dihapus
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-red-700 px-6 py-3 rounded-lg shadow-lg border border-red-500">
            ❌ Gagal menghapus akun
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
        <div className="flex gap-2">
          <input
            type="file"
            id="fileUpload"
            accept=".xls,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            color="primary"
            className="flex items-center gap-2 rounded-xl"
            onClick={() => setShowAddAccountPopup(true)}
          >
            <FaUserPlus size={16} />
          </Button>
          <Button
            variant="contained"
            color="success"
            className="flex items-center gap-2 rounded-xl"
          >
            <FaDownload size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-gray-200 z-5">
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">NIP</th>
              <th className="border border-gray-300 p-2">Nama</th>
              <th className="border border-gray-300 p-2">Kelas</th>
              <th className="border border-gray-300 p-2">Tanggal Lahir</th>
              <th className="border border-gray-300 p-2">Jenis Kelamin</th>
              <th className="border border-gray-300 p-2">Agama</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Password</th>
              <th className="border border-gray-300 p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((guru, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{guru.nip || "-"}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    type="button"
                    className="text-blue-500 underline hover:text-blue-700"
                    onClick={() => setSelectedGuru(guru)}
                  >
                    {formatName(guru.nama) || "-"}
                  </button>
                </td>
                <td className="border border-gray-300 p-2">{guru.kelas || "-"}</td>
                <td className="border border-gray-300 p-2">
                  {guru.tanggal_lahir
                    ? new Date(guru.tanggal_lahir).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">{guru.jenis_kelamin || "-"}</td>
                <td className="border border-gray-300 p-2">{guru.agama || "-"}</td>
                <td className="border border-gray-300 p-2">{guru.nomor_hp || "-"}</td>
                <td className="border border-gray-300 p-2">{guru.email || "-"}</td>
                <td className="border border-gray-300 p-2">********</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteClick(guru)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddAccountPopup && (
        <div className="fixed mt-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white h-auto p-6 rounded-2xl shadow-lg max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={handleCloseAddAccountPopup}
            >
              <IoMdCloseCircle className="h-8 w-8 text-red-800" />
            </button>
            <TambahAkunForm onClose={handleCloseAddAccountPopup} />
          </div>
        </div>
      )}

      {selectedGuru && (
        <ProfileDetailGuru user={selectedGuru} onClose={() => setSelectedGuru(null)} />
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <p className="mb-4 font-semibold text-gray-800">
              Anda yakin ingin menghapus akun ini?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
