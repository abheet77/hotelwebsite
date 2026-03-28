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

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addDays(value, days) {
  const date = parseDateString(value);
  if (!date) return "";
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

function QuantityInput({
  label,
  value,
  min = 0,
  max,
  hint,
  onChange,
}) {
  const decreaseDisabled = value <= min;
  const increaseDisabled = typeof max === "number" ? value >= max : false;

  const handleManualChange = (nextValue) => {
    if (nextValue === "") {
      onChange(min);
      return;
    }

    const numericValue = Number(nextValue.replace(/[^\d]/g, ""));
    if (Number.isNaN(numericValue)) return;
    onChange(numericValue);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex items-center overflow-hidden rounded-2xl border border-stone-300 bg-stone-50">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={decreaseDisabled}
          className="flex h-12 w-12 shrink-0 items-center justify-center text-lg text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleManualChange(e.target.value)}
          className="h-12 min-w-0 flex-1 border-x border-stone-300 bg-white px-3 text-center text-base font-medium text-stone-800 outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={increaseDisabled}
          className="flex h-12 w-12 shrink-0 items-center justify-center text-lg text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function BookingClient({ room, price }) {
  const numericPrice = Number(price || 0);
  const roomConfig = ROOM_CONFIG[room] || ROOM_CONFIG["Market Facing"];
  const { capacity, maxMattressPerRoom, breakfastPrice, image, tagline, facilities } =
    roomConfig;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [validIdNumber, setValidIdNumber] = useState("");
  const [idPhotographName, setIdPhotographName] = useState("");
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

  const today = formatLocalDate(new Date());
  const minimumCheckoutDate = checkIn ? addDays(checkIn, 1) : today;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = parseDateString(checkIn);
    const end = parseDateString(checkOut);
    if (!start || !end) return 0;
    const diffTime = end - start;
    return diffTime / (1000 * 60 * 60 * 24);
  }, [checkIn, checkOut]);

  let error = "";
  if (checkIn && checkOut && nights <= 0) {
    error = "Check-out must be after check-in";
  }

  const emailIsValid =
    emailAddress.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim());
  const phoneIsValid =
    phoneNumber.trim() === "" || /^[0-9]{10,15}$/.test(phoneNumber.replace(/\s+/g, ""));

  if (emailAddress && !emailIsValid) {
    error = "Please enter a valid email address";
  } else if (phoneNumber && !phoneIsValid) {
    error = "Please enter a valid phone number";
  }

  const isGuestInfoComplete =
    guestName.trim() &&
    phoneNumber.trim() &&
    emailAddress.trim() &&
    validIdNumber.trim() &&
    idPhotographName.trim();

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

  const updateAdults = (nextAdultsValue) => {
    const nextAdults = Math.max(1, nextAdultsValue || 1);
    const nextGuests = nextAdults + children;
    const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
    const nextRoomCount = Math.max(roomCount, nextMinimumRooms);

    setAdults(nextAdults);
    setRoomCount(nextRoomCount);
    setMattressCount((current) =>
      Math.min(current, nextRoomCount * maxMattressPerRoom)
    );
  };

  const updateChildren = (nextChildrenValue) => {
    const nextChildren = Math.max(0, nextChildrenValue || 0);
    const nextGuests = adults + nextChildren;
    const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
    const nextRoomCount = Math.max(roomCount, nextMinimumRooms);

    setChildren(nextChildren);
    setRoomCount(nextRoomCount);
    setMattressCount((current) =>
      Math.min(current, nextRoomCount * maxMattressPerRoom)
    );
  };

  const updateRoomCount = (nextRoomCountValue) => {
    const nextRoomCount = Math.max(minimumRoomsRequired, nextRoomCountValue || minimumRoomsRequired);

    setRoomCount(nextRoomCount);
    setMattressCount((current) =>
      Math.min(current, nextRoomCount * maxMattressPerRoom)
    );
  };

  const updateMattressCount = (nextMattressValue) => {
    setMattressCount(Math.min(maxMattress, Math.max(0, nextMattressValue || 0)));
  };

  const handleCheckInChange = (nextCheckIn) => {
    setCheckIn(nextCheckIn);

    if (!nextCheckIn) {
      setCheckOut("");
      return;
    }

    const nextMinimumCheckout = addDays(nextCheckIn, 1);
    if (!checkOut || checkOut < nextMinimumCheckout) {
      setCheckOut(nextMinimumCheckout);
    }
  };

  const handleCheckOutChange = (nextCheckOut) => {
    if (!nextCheckOut) {
      setCheckOut("");
      return;
    }

    if (nextCheckOut < minimumCheckoutDate) {
      setCheckOut(minimumCheckoutDate);
      return;
    }

    setCheckOut(nextCheckOut);
  };

  const handleIdPhotographChange = (event) => {
    const file = event.target.files?.[0];
    setIdPhotographName(file ? file.name : "");
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-white px-3 py-16 sm:px-6 md:px-[80px] lg:px-[140px]">
      <h1 className="mb-12 flex justify-center text-3xl font-semibold text-gray-900 md:text-4xl">
        Book Your Stay
      </h1>

      <div className="mx-auto grid w-full max-w-6xl gap-8 overflow-x-clip lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="min-w-0 w-full rounded-xl border border-gray-200 bg-white p-5 shadow-md sm:p-8">
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
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Check-out
              </label>
              <input
                type="date"
                min={minimumCheckoutDate}
                value={checkOut}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-4 border-b border-stone-200 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                Guest Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s+]/g, ""))}
                  placeholder="Enter phone number"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Valid ID Number
                </label>
                <input
                  type="text"
                  value={validIdNumber}
                  onChange={(e) => setValidIdNumber(e.target.value)}
                  placeholder="Passport / Aadhaar / Driving Licence"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  ID Photograph
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdPhotographChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800 file:mr-4 file:rounded-md file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700"
                />
                {idPhotographName && (
                  <p className="mt-1 text-xs text-gray-500">{idPhotographName}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <QuantityInput label="Adults" value={adults} min={1} onChange={updateAdults} />
            <QuantityInput
              label="Children (> 10)"
              value={children}
              min={0}
              onChange={updateChildren}
            />
          </div>

          <div className="mb-6">
            <QuantityInput
              label="Number of Rooms"
              value={selectedRoomCount}
              min={minimumRoomsRequired}
              onChange={updateRoomCount}
              hint={`Minimum required for ${totalGuests} guest(s): ${minimumRoomsRequired}`}
            />
            {selectedRoomCount === minimumRoomsRequired && totalGuests > capacity && (
              <p className="mt-1 text-xs text-teal-600">
                Room count increased automatically to match guest capacity.
              </p>
            )}
          </div>

          <div className="mb-6">
            <QuantityInput
              label="Extra Mattress"
              value={selectedMattressCount}
              min={0}
              max={maxMattress}
              onChange={updateMattressCount}
              hint={`Max allowed: ${maxMattress} (${maxMattressPerRoom} per room)`}
            />
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

          {!isGuestInfoComplete && (
            <div className="mb-4 text-center text-sm text-stone-500">
              Please fill in all guest details before confirming the booking.
            </div>
          )}

          <button
            onClick={() => setShowPopup(true)}
            disabled={!checkIn || !checkOut || !!error || !isGuestInfoComplete}
            className={`w-full rounded-md py-4 font-medium transition ${
              error || !checkIn || !checkOut || !isGuestInfoComplete
                ? "cursor-not-allowed bg-gray-400"
                : "bg-teal-500 text-white hover:scale-[1.02] hover:bg-teal-600"
            }`}
          >
            Confirm Booking
          </button>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-10">
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
              <p><strong>Name:</strong> {guestName}</p>
              <p><strong>Phone:</strong> {phoneNumber}</p>
              <p><strong>Email:</strong> {emailAddress}</p>
              <p><strong>Valid ID:</strong> {validIdNumber}</p>
              <p><strong>ID Photograph:</strong> {idPhotographName}</p>
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
