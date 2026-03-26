"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Features() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push("/rooms?scroll=rooms");
  };

  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-white text-black py-16 px-6 md:px-16"
    >
      {/* Top Text */}
      <p className="text-center text-gray-600 mb-12">
        All our room types have option of complementary breakfast
      </p>

      {/* ================= SECTION 1 ================= */}
      <div className="grid md:grid-cols-2 gap-10 items-center pb-24">

        {/* Left Text */}
        <div>
          <h2
            className={`text-2xl md:text-3xl font-semibold mb-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            COMFORT AND QUALITY YOU CAN AFFORD.
          </h2>

          <p
            className={`text-gray-600 mb-4 transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our rooms are designed to transport you into an environment made for leisure.
            Take your mind off the day-to-day of home life and find a private paradise for yourself.
          </p>

          <button
            onClick={handleExploreClick}
            className={`bg-teal-500 text-white px-4 py-2 rounded-md
            transition-all duration-700 delay-300
            hover:bg-teal-600 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            EXPLORE
          </button>
        </div>

        {/* Right Image */}
        <img
          src="/room2.png"
          alt="room"
          className={`w-full h-[300px] object-cover rounded-xl transition-all duration-700 delay-200 ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        />
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Image */}
        <img
          src="/room1.png"
          alt="woods"
          className={`w-full h-[300px] object-cover rounded-xl order-2 md:order-1 transition-all duration-700 delay-200 ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        />

        {/* Right Text */}
        <div className="order-1 md:order-2">
          <h2
            className={`text-2xl md:text-3xl font-semibold mb-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            EMBRACE THE WOODS
          </h2>

          <p
            className={`text-gray-600 mb-4 transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            We love life in the mountains. Surrounded by towering peaks and crisp air,
            each moment brings peace and adventure.
          </p>

          <button
            onClick={handleExploreClick}
            className={`bg-teal-500 text-white px-4 py-2 rounded-md
            transition-all duration-700 delay-300
            hover:bg-teal-600 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            EXPLORE
          </button>
        </div>
      </div>

      {/* ================= FUN FACT ================= */}
      <div className="mt-20 text-center max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl tracking-[0.3em] text-gray-700 mb-6">
          FUN FACT
        </h2>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          "The name Pahalgam is a combination of two Kashmiri words:
          'Pahal' (meaning shepherd) and 'Gaam' (meaning village)."
        </p>
      </div>
    </div>
  );
}