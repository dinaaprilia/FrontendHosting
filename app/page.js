"use client";

import React from 'react';
import LoginForm from '@/app/_components/LoginForm2';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#8998D8] relative overflow-hidden">
      {/* Gambar Siswa */}
      <div className="absolute inset-x-0 z-0 flex justify-center siswa-position">
        <img 
          src="/images/siswa.png" 
          alt="Siswa" 
          className="w-[270px] sm:w-1/4"
        />
      </div>

      {/* Form Login */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
