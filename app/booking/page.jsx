"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const room = searchParams.get("room");
  const price = searchParams.get("price");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [mattressCount, setMattressCount] = useState(0);
  const totalGuests = adults + children;

  const [showPopup, setShowPopup] = useState(false);

  const [breakfast, setBreakfast] = useState(false);
  let total = 0;
  let capacity = 3;
  if (room === "Twin Room") {
    capacity = 6;
  }
  let maxMattress = 1;

  if (room === "Twin Room") {
    maxMattress = 2;
  }
  let breakfastPrice = 500;

  if (room === "Twin Room") {
    breakfastPrice = 1000;
  }
  const roomsNeeded = Math.ceil(totalGuests / capacity);
  if (checkIn && checkOut && price) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diffTime = end - start;
    const days = diffTime / (1000 * 60 * 60 * 24);

    if (days > 0) {
      total = days * Number(price) * roomsNeeded;

      if (mattressCount > 0) {
        total += days * 500 * mattressCount;
      }

      if (breakfast) {
        total += days * breakfastPrice * roomsNeeded;
      }
    }
  }
  const today = new Date().toISOString().split("T")[0];
  let nights = 0;

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diffTime = end - start;
    nights = diffTime / (1000 * 60 * 60 * 24);
  }
  let error = "";

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      error = "Check-out must be after check-in";
    }
  }





  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 md:px-[80px] lg:px-[140px] py-16">

      {/* Heading */}
      <h1 className="flex justify-center text-3xl md:text-4xl font-semibold text-gray-900 mb-12">
        Book Your Stay
      </h1>

      {/* Form */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8 border border-gray-200">

          {/* Room Type */}
          <div className="mb-6">
            <label className="block text-sm text-gray-800 font-medium mb-2">
              Room Type
            </label>
            <input
              type="text"
              value={room || "Not Selected"}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-800 opacity-100 cursor-not-allowed"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm text-gray-800 font-medium mb-2">
              Price per night
            </label>
            <input
              type="text"
              value={price ? `₹ ${price}` : "N/A"}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-800 opacity-100 cursor-not-allowed"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <div>
              <label className="block text-sm text-gray-800 font-medium mb-2">
                Check-in
              </label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-800 font-medium mb-2">
                Check-out
              </label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800"
              />
            </div>

          </div>

          {/* Guests */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Adults */}
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-2">
                Adults
              </label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>

            {/* Children */}
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-2">
                Children (&gt; 10)
              </label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-800 font-medium mb-2">
              Extra Mattress
            </label>

            <input
              type="number"
              min="0"
              max={maxMattress}
              value={mattressCount}
              onChange={(e) => setMattressCount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />

            <p className="text-xs text-gray-500 mt-1">
              Max allowed: {maxMattress}
            </p>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={breakfast}
              onChange={() => setBreakfast(!breakfast)}
            />
            <label className="text-sm text-gray-800">
              Add Breakfast (+ ₹{breakfastPrice}/night)
            </label>
          </div>
          {nights > 0 && (
            <div className="text-center text-gray-700 mb-2">
              {nights} night(s)
            </div>
          )}
          <div className="text-center text-gray-700 mb-2">
            Rooms Needed: {roomsNeeded}
          </div>
          {/* Total Price */}
          {total > 0 && (
            <div className="mb-4 text-xl font-bold text-teal-600 text-center">
              Total Price: ₹ {total}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-500 text-center text-sm">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={() => setShowPopup(true)}
            disabled={!checkIn || !checkOut || error}
            className={`w-full py-4 rounded-md font-medium transition ${error || !checkIn || !checkOut
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-500 text-white hover:bg-teal-600 hover:scale-[1.02]"
              }`}
          >
            Confirm Booking
          </button>

        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center shadow-lg">

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Booking Confirmed ✅
            </h2>

            <div className="text-gray-700 space-y-2 mb-6">
              <p><strong>Room:</strong> {room}</p>
              <p><strong>Guests:</strong> {totalGuests}</p>
              <p><strong>Rooms:</strong> {roomsNeeded}</p>
              <p><strong>Extra Mattress:</strong> {mattressCount}</p>
              <p><strong>Breakfast:</strong> {breakfast ? "Yes" : "No"}</p>
              <p><strong>Nights:</strong> {nights}</p>
              <p><strong>Total:</strong> ₹ {total}</p>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </main>
  );
}