// hooks/update-password.js
import axios from 'axios';

export default function useUpdatePassword() {
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://backendfix-production.up.railway.app/api/update-password',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Gagal update password:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Terjadi kesalahan' };
    }
  };

  return { updatePassword };
}
