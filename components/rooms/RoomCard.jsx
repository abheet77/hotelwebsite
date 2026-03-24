"use client";
import { useRouter } from "next/navigation";

export default function RoomCard({ title, image, capacity, price }) {
  const router = useRouter();

  return (
    <div className="w-full sm:w-[95%] lg:w-[80%] xl:w-[70%] mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-300">

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-[220px] sm:h-[260px] lg:h-[300px] object-cover"
      />

      {/* Title Bar (IMPORTANT HEIGHT) */}
      <div className="bg-teal-500 text-white text-center py-4 text-lg sm:text-xl font-semibold tracking-wide">
        {title}
      </div>

      {/* Bottom Strip */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-gray-100">

        {/* Capacity */}
        <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
          <span className="text-lg">+</span>
          <span>MAX CAP: {capacity}</span>
        </div>

        {/* Price */}
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