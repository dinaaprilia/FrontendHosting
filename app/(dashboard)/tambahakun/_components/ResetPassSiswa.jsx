'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPasswordForm({ userId, onSuccess, onCancel }) {
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== konfirmasi) {
      alert('❌ Password dan konfirmasi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backendfix-production.up.railway.app/api/siswa/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('✅ Password berhasil direset.');
        if (onSuccess) onSuccess();
      } else {
        alert('❌ Gagal reset: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Terjadi kesalahan saat reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg sm:text-xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>

        {/* Password Baru */}
        <div className="mb-4 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded pr-10"
            placeholder="Masukkan password baru"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Konfirmasi Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            value={konfirmasi}
            onChange={(e) => setKonfirmasi(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded pr-10"
            placeholder="Ulangi password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-8 text-gray-600 hover:text-gray-800"
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Tombol */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
          >
            Batal
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition font-semibold w-full sm:w-auto"
          >
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
