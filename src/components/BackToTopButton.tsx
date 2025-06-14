"use client";

import { HiArrowUp } from "react-icons/hi2";

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="paper-texture bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 handwriting-print text-lg transform hover:-rotate-1"
    >
      <HiArrowUp size={20} />
      Back to Top
    </button>
  );
}
