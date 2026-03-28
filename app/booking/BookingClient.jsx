"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const ROOM_CONFIG = {
  "Market Facing": {
    capacity: 3,
    maxMattressPerRoom: 1,
    breakfastPrice: 500,
    image: "/marketfacing1.png",
    tagline: "Warm interiors with a lively market-facing outlook.",
    facilities: [
      "King size bed",
      "Free WiFi",
      "Hot water",
      "Television",
      "11 x 15 ft room",
      "Window seating area",
    ],
  },
  "Hill Facing": {
    capacity: 3,
    maxMattressPerRoom: 1,
    breakfastPrice: 500,
    image: "/hillfacing1.png",
    tagline: "A calm stay with a softer view toward the hills.",
    facilities: [
      "Queen bed",
      "Free WiFi",
      "Balcony view",
      "Hot water",
      "11 x 13 ft room",
      "Natural daylight",
    ],
  },
  "Twin Room": {
    capacity: 6,
    maxMattressPerRoom: 2,
    breakfastPrice: 1000,
    image: "/TwinRoom.png",
    tagline: "A spacious family setup designed for larger groups.",
    facilities: [
      "Two beds",
      "Free WiFi",
      "Hot water",
      "Television",
      "11 x 15 ft room",
      "Ideal for group stays",
    ],
  },
};

const BOOKING_TERMS = [
  "A valid ID is required for all adult guests at check-in.",
  "Check-in is subject to room availability and booking confirmation.",
  "Extra mattresses are charged separately and depend on room type.",
  "Breakfast, when selected, is billed per room per night.",
  "Date changes or cancellations should be requested in advance.",
];

export default function BookingClient({ room, price }) {
  const numericPrice = Number(price || 0);
  const roomConfig = ROOM_CONFIG[room] || ROOM_CONFIG["Market Facing"];
  const { capacity, maxMattressPerRoom, breakfastPrice, image, tagline, facilities } =
    roomConfig;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [mattressCount, setMattressCount] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const totalGuests = adults + children;
  const minimumRoomsRequired = Math.max(1, Math.ceil(totalGuests / capacity));
  const selectedRoomCount = Math.max(roomCount, minimumRoomsRequired);
  const maxMattress = selectedRoomCount * maxMattressPerRoom;
  const selectedMattressCount = Math.min(mattressCount, maxMattress);

  const today = new Date().toISOString().split("T")[0];

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    return diffTime / (1000 * 60 * 60 * 24);
  }, [checkIn, checkOut]);

  let error = "";
  if (checkIn && checkOut && nights <= 0) {
    error = "Check-out must be after check-in";
  }

  let total = 0;
  if (nights > 0 && numericPrice) {
    total = nights * numericPrice * selectedRoomCount;

    if (selectedMattressCount > 0) {
      total += nights * 500 * selectedMattressCount;
    }

    if (breakfast) {
      total += nights * breakfastPrice * selectedRoomCount;
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:px-6 md:px-[80px] lg:px-[140px]">
      <h1 className="mb-12 flex justify-center text-3xl font-semibold text-gray-900 md:text-4xl">
        Book Your Stay
      </h1>

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Room Type
            </label>
            <input
              type="text"
              value={room || "Not Selected"}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 opacity-100"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Price per night
            </label>
            <input
              type="text"
              value={numericPrice ? `Rs. ${numericPrice}` : "N/A"}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 opacity-100"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Check-in
              </label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Check-out
              </label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Adults
              </label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) => {
                  const nextAdults = Math.max(1, Number(e.target.value) || 1);
                  const nextGuests = nextAdults + children;
                  const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
                  const nextRoomCount = Math.max(roomCount, nextMinimumRooms);

                  setAdults(nextAdults);
                  setRoomCount(nextRoomCount);
                  setMattressCount((current) =>
                    Math.min(current, nextRoomCount * maxMattressPerRoom)
                  );
                }}
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Children (&gt; 10)
              </label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) => {
                  const nextChildren = Math.max(0, Number(e.target.value) || 0);
                  const nextGuests = adults + nextChildren;
                  const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
                  const nextRoomCount = Math.max(roomCount, nextMinimumRooms);

                  setChildren(nextChildren);
                  setRoomCount(nextRoomCount);
                  setMattressCount((current) =>
                    Math.min(current, nextRoomCount * maxMattressPerRoom)
                  );
                }}
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Number of Rooms
            </label>
            <input
              type="number"
              min={minimumRoomsRequired}
              value={selectedRoomCount}
              onChange={(e) => {
                const nextRoomCount = Math.max(
                  minimumRoomsRequired,
                  Number(e.target.value) || minimumRoomsRequired
                );

                setRoomCount(nextRoomCount);
                setMattressCount((current) =>
                  Math.min(current, nextRoomCount * maxMattressPerRoom)
                );
              }}
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum required for {totalGuests} guest(s): {minimumRoomsRequired}
            </p>
            {selectedRoomCount === minimumRoomsRequired && totalGuests > capacity && (
              <p className="mt-1 text-xs text-teal-600">
                Room count increased automatically to match guest capacity.
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Extra Mattress
            </label>
            <input
              type="number"
              min="0"
              max={maxMattress}
              value={selectedMattressCount}
              onChange={(e) =>
                setMattressCount(
                  Math.min(maxMattress, Math.max(0, Number(e.target.value) || 0))
                )
              }
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />
            <p className="mt-1 text-xs text-gray-500">
              Max allowed: {maxMattress} ({maxMattressPerRoom} per room)
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={breakfast}
              onChange={() => setBreakfast(!breakfast)}
            />
            <label className="text-sm text-gray-800">
              Add Breakfast (+ Rs. {breakfastPrice}/night per room)
            </label>
          </div>

          {nights > 0 && (
            <div className="mb-2 text-center text-gray-700">{nights} night(s)</div>
          )}

          <div className="mb-2 text-center text-gray-700">
            Capacity per room: {capacity} guest(s)
          </div>

          <div className="mb-2 text-center text-gray-700">
            Rooms Selected: {selectedRoomCount}
          </div>

          {total > 0 && (
            <div className="mb-4 text-center text-xl font-bold text-teal-600">
              Total Price: Rs. {total}
            </div>
          )}

          {error && (
            <div className="mb-4 text-center text-sm text-red-500">{error}</div>
          )}

          <button
            onClick={() => setShowPopup(true)}
            disabled={!checkIn || !checkOut || !!error}
            className={`w-full rounded-md py-4 font-medium transition ${
              error || !checkIn || !checkOut
                ? "cursor-not-allowed bg-gray-400"
                : "bg-teal-500 text-white hover:scale-[1.02] hover:bg-teal-600"
            }`}
          >
            Confirm Booking
          </button>
        </div>

        <aside className="lg:sticky lg:top-10">
          <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_22px_50px_-32px_rgba(15,23,42,0.24)]">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={image}
                alt={room || "Selected room"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-[0.45em] text-white/70">
                  Selected Room
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[0.08em]">
                  {room || "Not Selected"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="space-y-8 p-6">
              <section>
                <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                    Stay Summary
                  </h3>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    Rs. {numericPrice || "N/A"} / night
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-stone-600">
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Capacity
                    </p>
                    <p className="mt-2 font-medium text-stone-800">{capacity} guests</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Breakfast
                    </p>
                    <p className="mt-2 font-medium text-stone-800">Rs. {breakfastPrice}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Rooms
                    </p>
                    <p className="mt-2 font-medium text-stone-800">{selectedRoomCount}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Extra Mattress
                    </p>
                    <p className="mt-2 font-medium text-stone-800">
                      Up to {maxMattressPerRoom} / room
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                  In This Room
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {facilities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-stone-200/80 px-4 py-3 text-sm text-stone-600"
                    >
                      <span className="h-2 w-2 rounded-full bg-teal-500/80" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                  Terms & Conditions
                </h3>
                <div className="space-y-3">
                  {BOOKING_TERMS.map((term) => (
                    <div
                      key={term}
                      className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600"
                    >
                      {term}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </aside>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Booking Confirmed
            </h2>

            <div className="mb-6 space-y-2 text-gray-700">
              <p><strong>Room:</strong> {room}</p>
              <p><strong>Guests:</strong> {totalGuests}</p>
              <p><strong>Rooms:</strong> {selectedRoomCount}</p>
              <p><strong>Extra Mattress:</strong> {selectedMattressCount}</p>
              <p><strong>Breakfast:</strong> {breakfast ? "Yes" : "No"}</p>
              <p><strong>Nights:</strong> {nights}</p>
              <p><strong>Total:</strong> Rs. {total}</p>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="rounded-md bg-teal-500 px-6 py-2 text-white transition hover:bg-teal-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
