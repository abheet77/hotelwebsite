"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function RoomCard({ title, images, price, details, index}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const safeImages = images?.length ? images : ["/HillFacing.png"];
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    },
    { threshold: 0.2 }
  );

  if (ref.current) observer.observe(ref.current);

  return () => observer.disconnect();
}, []);
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
   <div
  ref={ref}
  className={`w-full sm:w-[95%] lg:w-[70%] xl:w-[70%] mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-700
     hover:scale-[1.01]
  ${
    visible
      ? "opacity-100 translate-x-0"
      : "opacity-0 lg:" +
        (index % 2 === 0 ? "-translate-x-20" : "translate-x-20") +
        " translate-y-10"
  }
`}
>

      {/* IMAGE SLIDER */}
      <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden">

        <img
          src={images[current]}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
        >
          ›
        </button>

      </div>

      {/* TITLE BAR */}
      <div className="bg-teal-500 text-white text-center py-4 text-lg sm:text-xl font-semibold tracking-wide">
        {title}
      </div>

      {/* BOTTOM STRIP */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-gray-100">
        {open && (
  <div className="px-5 sm:px-6 py-4 bg-white border-t border-gray-200">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
      {details.map((item, i) => (
        <div key={i}>• {item}</div>
      ))}
    </div>
  </div>
)}
        {/* + BUTTON */}
        <button
  onClick={() => setOpen(!open)}
  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-gray-200 transition"
>
  {open ? "−" : "+"}
</button>

        {/* PRICE */}
        <button
          onClick={() =>
            router.push(`/booking?room=${encodeURIComponent(title)}&price=${price}`)
          }
          className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-teal-600 transition"
        >
          ₹ {price} / night
        </button>

      </div>
    </div>
  );
  
}
