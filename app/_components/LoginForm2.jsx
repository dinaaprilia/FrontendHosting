"use client";
import React, { useState } from "react";
import { IoPerson, IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import useLogin from "@/hooks/use-login"; 

const LoginForm = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login, loading, error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifier || !password) return;

        await login({ identifier, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen transform translate-y-20">
            <div className="sm:w-[320px] w-[260px] p-4 px-6 bg-white shadow-2xl rounded-2xl sm:max-h-[450px] h-auto"
                style={{ boxShadow: "8px 8px 8px rgba(0, 0, 0, 0.3)" }}>
                
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src="/images/logosevh.png" alt="Logo" className="w-10 h-10" />
                </div>

                <h1 className="sm:text-xl text-lg font-bold text-center text-[#011E43]">Selamat Datang!</h1>
                <h2 className="sm:text-sm text-xs font-light text-center text-[#011E43] mb-4">Silahkan login ke Akun anda</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="identifier" className="block text-xs text-black">NIP atau NISN</label>
                        <IoPerson className="absolute left-3 top-6 w-4 h-4 text-black" />
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full pl-10 pr-3 py-1 border border-[#9ebcfa] rounded-lg focus:ring-2 focus:outline-none text-sm"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-xs text-black">Password</label>
                        <IoLockClosed className="absolute left-3 top-6 w-4 h-4 text-black" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-1 border border-[#9ebcfa] rounded-lg focus:ring-2 focus:outline-none text-sm"
                            required
                        />
                        {showPassword ? (
                            <IoEyeOff className="absolute right-3 top-6 w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(false)} />
                        ) : (
                            <IoEye className="absolute right-3 top-6 w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3 h-3 text-[#598EF6] border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-xs text-gray-700">Remember Me</label>
                    </div>

                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-3/4 mx-auto flex justify-center py-1.5 text-white bg-[#4664eb] rounded-md hover:bg-[#FFC21E] text-sm disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
