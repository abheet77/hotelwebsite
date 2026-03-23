"use client";
import Navbar from "../layout/Navbar";

export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/hero.png")' }}
    >
      <Navbar />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10 px-6 md:px-16">
        
        <div className="text-white max-w-2xl">

          <p className="text-sm md:text-base tracking-[0.4em] mb-2 text-gray-200">
            WELCOME TO
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-5xl max-w-2xl -ml-1 font-light tracking-[0.05em] leading-none">
            CENTRAL
          </h1>

          <h2 className="text-lg md:text-2xl tracking-[0.5em] mt-2 text-gray-200">
            HOTEL
          </h2>

          <p className="mt-6 text-sm md:text-lg text-gray-300 max-w-md">
            Book your stay and enjoy Luxury redefined at the most affordable rates.
          </p>

          <button className="mt-6 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md text-sm md:text-base">
            BOOK NOW
          </button>

        </div>

      </div>

    </div>
  );
}