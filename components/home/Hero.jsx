"use client";
import Navbar from "../layout/Navbar";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleBookNow = () => {
  router.push("/rooms?scroll=rooms");
};
  return (
    <div
      className="w-full h-screen relative bg-cover bg-center"
      style={{ backgroundImage: 'url("/hero.png")' }}
    >
      <Navbar />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10 px-5 sm:px-6 md:px-16">
        
        <div className="text-white max-w-2xl">

          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] sm:tracking-[0.4em] mb-2 text-gray-200">
            WELCOME TO
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-2xl -ml-1 font-light tracking-[0.05em] leading-[1.1] sm:leading-tight">
            CENTRAL
          </h1>

          <h2 className="text-sm sm:text-base md:text-xl tracking-[0.35em] sm:tracking-[0.45em] mt-2 text-gray-200">
            HOTEL
          </h2>

          <p className="mt-6 text-xs sm:text-sm md:text-base leading-relaxed text-gray-300 max-w-md">
            Book your stay and enjoy Luxury redefined at the most affordable rates.
          </p>
  <button
    onClick={handleBookNow}
    className="mt-8 bg-teal-500 text-white px-6 py-3 rounded-md
              transition duration-300 ease-out
              hover:bg-teal-600 hover:-translate-y-1 hover:shadow-lg
              active:scale-95"
  >
    BOOK NOW
  </button>

        </div>

      </div>

    </div>
  );
}