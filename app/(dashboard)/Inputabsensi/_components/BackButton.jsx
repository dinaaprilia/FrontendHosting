"use client";

import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="text-gray-700 hover:text-gray-900 mr-auto ml-2 transition duration-300"
    >
      <FaArrowLeft className="text-2xl " />
    </button>
  );
}
