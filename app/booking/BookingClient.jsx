"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const ROOM_CONFIG = {
  "Market Facing": {
    capacity: 3,
    image: "/marketfacing1.png",
    tagline: "Warm interiors with a lively market-facing outlook.",
    facilities: [
      "King size bed",
      "Free WiFi",
      "Hot water",
      "LED",
      "11 x 15 ft room",
      "Running hot water",
      "Generator backup",
      "Electric blankets",
      "Intercom",
      "Room service",
      "Multicuisine dining",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
  "Hill Facing": {
    capacity: 3,
    image: "/hillfacing1.png",
    tagline: "A calm stay with a softer view toward the hills.",
    facilities: [
      "Queen bed",
      "Free WiFi",
      "Balcony view",
      "Hot water",
      "11 x 13 ft room",
      "LED",
      "Running hot water",
      "Generator backup",
      "Electric blankets",
      "Intercom",
      "Room service",
      "Multicuisine dining",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
  "Twin Room": {
    capacity: 6,
    image: "/TwinRoom.png",
    tagline: "A spacious family setup designed for larger groups.",
    facilities: [
      "2 beds",
      "Free WiFi",
      "Hot water",
      "LED",
      "11 x 20 ft room",
      "Ideal for group stays",
      "Running hot water",
      "Generator backup",
      "Electric blankets",
      "Intercom",
      "Room service",
      "Multicuisine dining",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
};

const MEAL_PLANS = {
  none: {
    label: "None",
    price: 0,
    summary: "No meal plan selected.",
  },
  breakfast: {
    label: "Breakfast Included",
    price: 250,
    summary: "Breakfast at Rs. 250 per person.",
  },
  breakfastMeal: {
    label: "Breakfast + 1 Meal Included",
    price: 600,
    summary: "Breakfast and 1 meal at Rs. 600 per person.",
  },
};

const BOOKING_TERMS = [
  "A valid ID is required for all adult guests at check-in.",
  "Check-in time is 2 PM and check-out time is 12 PM.",
  "Room rates are for 2 guests per room.",
  "Each additional guest above the included 2 guests is charged Rs. 500.",
  "Each additional guest is treated as 1 extra mattress automatically.",
  "Meal plans are optional and billed per person per night.",
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

function QuantityInput({ label, value, min = 0, hint, onChange, disabled = false }) {
  const decreaseDisabled = value <= min;

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
          disabled={disabled || decreaseDisabled}
          className="flex h-12 w-12 shrink-0 items-center justify-center text-lg text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleManualChange(e.target.value)}
          disabled={disabled}
          className="h-12 min-w-0 flex-1 border-x border-stone-300 bg-white px-3 text-center text-base font-medium text-stone-800 outline-none disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={disabled}
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
  const { capacity, image, tagline, facilities } = roomConfig;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [validIdNumber, setValidIdNumber] = useState("");
  const [idPhotographName, setIdPhotographName] = useState("");
  const [adults, setAdults] = useState(1);
  const [childrenAbove10, setChildrenAbove10] = useState(0);
  const [childrenBelow10, setChildrenBelow10] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [mealPlan, setMealPlan] = useState("none");
  const [mealPlanPeople, setMealPlanPeople] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const billableGuests = adults + childrenAbove10;
  const complimentaryChildrenBelow10 = Math.min(childrenBelow10, 2);
  const totalOccupants = billableGuests + complimentaryChildrenBelow10;
  const minimumRoomsRequired = Math.max(1, Math.ceil(billableGuests / capacity));
  const selectedRoomCount = Math.max(roomCount, minimumRoomsRequired);
  const includedGuests = selectedRoomCount * 2;
  const extraGuestCount = Math.max(0, billableGuests - includedGuests);
  const autoMattressCount = extraGuestCount;
  const selectedMealPlan = MEAL_PLANS[mealPlan] || MEAL_PLANS.none;
  const normalizedMealPlanPeople =
    mealPlan === "none" ? 0 : Math.min(Math.max(mealPlanPeople, 0), totalOccupants);

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

  const trimmedName = guestName.trim();
  const trimmedPhone = phoneNumber.replace(/\s+/g, "");
  const trimmedEmail = emailAddress.trim();
  const trimmedId = validIdNumber.trim();

  const nameIsValid = /^[A-Za-z][A-Za-z\s'.-]{1,}$/.test(trimmedName);
  const phoneIsValid = /^[0-9]{10}$/.test(trimmedPhone);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const validIdIsValid = trimmedId.length > 0;
  const idPhotographIsValid = Boolean(idPhotographName);
  const isGuestInfoComplete =
    trimmedName &&
    trimmedPhone &&
    trimmedEmail &&
    trimmedId &&
    idPhotographIsValid;

  let error = "";
  if (checkIn && checkOut && nights <= 0) {
    error = "Check-out must be after check-in";
  } else if (trimmedName && !nameIsValid) {
    error = "Please enter a valid name";
  } else if (trimmedEmail && !emailIsValid) {
    error = "Please enter a valid email address";
  } else if (trimmedPhone && !phoneIsValid) {
    error = "Please enter a valid 10-digit phone number";
  } else if (trimmedId && !validIdIsValid) {
    error = "Please enter a valid ID number";
  }

  const areAllInputsValid =
    nameIsValid &&
    phoneIsValid &&
    emailIsValid &&
    validIdIsValid &&
    idPhotographIsValid &&
    adults >= 1 &&
    childrenAbove10 >= 0 &&
    childrenBelow10 >= 0 &&
    childrenBelow10 <= 2 &&
    selectedRoomCount >= minimumRoomsRequired &&
    normalizedMealPlanPeople >= 0 &&
    normalizedMealPlanPeople <= totalOccupants;

  let total = 0;
  if (nights > 0 && numericPrice) {
    total = nights * numericPrice * selectedRoomCount;

    if (extraGuestCount > 0) {
      total += nights * 500 * extraGuestCount;
    }

    if (normalizedMealPlanPeople > 0 && selectedMealPlan.price > 0) {
      total += nights * selectedMealPlan.price * normalizedMealPlanPeople;
    }
  }

  const updateAdults = (nextAdultsValue) => {
    const nextAdults = Math.max(1, nextAdultsValue || 1);
    const nextGuests = nextAdults + childrenAbove10;
    const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
    setAdults(nextAdults);
    setRoomCount((current) => Math.max(current, nextMinimumRooms));
  };

  const updateChildrenAbove10 = (nextChildrenValue) => {
    const nextChildren = Math.max(0, nextChildrenValue || 0);
    const nextGuests = adults + nextChildren;
    const nextMinimumRooms = Math.max(1, Math.ceil(nextGuests / capacity));
    setChildrenAbove10(nextChildren);
    setRoomCount((current) => Math.max(current, nextMinimumRooms));
  };

  const updateChildrenBelow10 = (nextChildrenValue) => {
    const nextChildren = Math.min(2, Math.max(0, nextChildrenValue || 0));
    setChildrenBelow10(nextChildren);
  };

  const updateRoomCount = (nextRoomCountValue) => {
    const nextRoomCount = Math.max(minimumRoomsRequired, nextRoomCountValue || minimumRoomsRequired);
    setRoomCount(nextRoomCount);
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

  const updateMealPlanPeople = (nextMealPlanPeopleValue) => {
    const cappedValue = Math.min(
      totalOccupants,
      Math.max(0, nextMealPlanPeopleValue || 0),
    );
    setMealPlanPeople(cappedValue);
  };

  const handleMealPlanChange = (nextMealPlan) => {
    setMealPlan(nextMealPlan);

    if (nextMealPlan === "none") {
      setMealPlanPeople(0);
      return;
    }

    setMealPlanPeople((current) => {
      if (totalOccupants === 0) return 0;
      if (current <= 0) return totalOccupants;
      return Math.min(current, totalOccupants);
    });
  };

  const mealPlanHint =
    mealPlan === "none"
      ? "Select a meal plan first to choose the number of people."
      : `You can apply this plan to up to ${totalOccupants} occupant(s).`;

  const handleConfirmBooking = async () => {
    if (
      !checkIn ||
      !checkOut ||
      error ||
      !isGuestInfoComplete ||
      !areAllInputsValid ||
      isSubmitting
    ) {
      return;
    }

    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: trimmedName,
          phoneNumber: trimmedPhone,
          emailAddress: trimmedEmail,
          validIdNumber: trimmedId,
          idPhotographName,
          checkIn,
          checkOut,
          adults,
          childrenAbove10,
          childrenBelow10: complimentaryChildrenBelow10,
          roomCount: selectedRoomCount,
          extraGuestCount,
          autoMattressCount,
          mealPlan,
          mealPlanLabel: selectedMealPlan.label,
          mealPlanPeople: normalizedMealPlanPeople,
          roomType: room || "Not Selected",
          pricePerNight: numericPrice,
          nights,
          totalOccupants,
          totalPrice: total,
        }),
      });

      const responseText = await response.text();
      let result = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.details ||
            result?.message ||
            `Booking could not be saved. Server returned ${response.status}.`,
        );
      }

      if (!result) {
        throw new Error("Booking was saved, but the server response was invalid.");
      }

      setShowPopup(true);
    } catch (submitError) {
      setApiError(
        submitError instanceof Error
          ? submitError.message
          : "Booking could not be saved. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-white px-3 py-16 sm:px-6 md:px-[80px] lg:px-[140px]">
      <h1 className="mb-12 flex justify-center text-3xl font-semibold text-gray-900 md:text-4xl">
        Book Your Stay
      </h1>

      <div className="mx-auto grid w-full max-w-6xl gap-8 overflow-x-clip lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="order-2 min-w-0 w-full rounded-xl border border-gray-200 bg-white p-5 shadow-md sm:p-8 lg:order-1">
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
                {guestName && !nameIsValid && (
                  <p className="mt-1 text-xs text-red-500">
                    Enter at least 2 letters. Numbers are not allowed.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Enter 10-digit phone number"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800"
                />
                {phoneNumber && !phoneIsValid && (
                  <p className="mt-1 text-xs text-red-500">
                    Phone number must be exactly 10 digits.
                  </p>
                )}
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
                {emailAddress && !emailIsValid && (
                  <p className="mt-1 text-xs text-red-500">Enter a valid email address.</p>
                )}
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
                {idPhotographName ? (
                  <p className="mt-1 text-xs text-gray-500">{idPhotographName}</p>
                ) : (
                  <p className="mt-1 text-xs text-red-500">Please upload a valid ID photograph.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <QuantityInput label="Adults" value={adults} min={1} onChange={updateAdults} />
            <QuantityInput
              label="Children (> 10)"
              value={childrenAbove10}
              min={0}
              onChange={updateChildrenAbove10}
            />
          </div>

          <div className="mb-6">
            <QuantityInput
              label="Children (< 10)"
              value={childrenBelow10}
              min={0}
              onChange={updateChildrenBelow10}
              hint="Up to 2 children below 10 are allowed and not counted as chargeable guests."
            />
          </div>

          <div className="mb-6">
            <QuantityInput
              label="Number of Rooms"
              value={selectedRoomCount}
              min={minimumRoomsRequired}
              onChange={updateRoomCount}
              hint={`Minimum required for ${billableGuests} chargeable guest(s): ${minimumRoomsRequired}`}
            />
            {selectedRoomCount === minimumRoomsRequired && billableGuests > capacity && (
              <p className="mt-1 text-xs text-teal-600">
                Room count increased automatically to match guest capacity.
              </p>
            )}
          </div>

          <div className="mb-6 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-600">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-stone-700">Extra Guests / Extra Mattresses</span>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-700">
                {extraGuestCount}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              Room price is for 2 people. Every additional guest adds Rs. 500 and is treated as 1 extra mattress automatically.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-4">
            <div className="mb-4 border-b border-stone-200 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                Meal Plan
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Select Plan
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => handleMealPlanChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-800"
                >
                  <option value="breakfast">Breakfast Included</option>
                  <option value="breakfastMeal">Breakfast + 1 Meal Included</option>
                  <option value="none">None</option>
                </select>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  {selectedMealPlan.summary}
                </p>
              </div>

              <QuantityInput
                label="Plan For How Many People"
                value={normalizedMealPlanPeople}
                min={0}
                hint={mealPlanHint}
                onChange={updateMealPlanPeople}
                disabled={mealPlan === "none"}
              />
              {mealPlan !== "none" && normalizedMealPlanPeople > 0 && (
                <p className="text-xs text-teal-700">
                  {selectedMealPlan.label}: Rs. {selectedMealPlan.price} per person per night
                </p>
              )}
            </div>
          </div>

          {nights > 0 && <div className="mb-2 text-center text-gray-700">{nights} night(s)</div>}

          <div className="mb-2 text-center text-gray-700">
            Capacity per room: {capacity} guest(s)
          </div>

          <div className="mb-2 text-center text-gray-700">
            Total Occupants: {totalOccupants}
          </div>

          <div className="mb-2 text-center text-gray-700">
            Rooms Selected: {selectedRoomCount}
          </div>

          <div className="mb-2 text-center text-gray-700">
            Extra Guests Charged: {extraGuestCount}
          </div>

          {total > 0 && (
            <div className="mb-4 text-center text-xl font-bold text-teal-600">
              Total Price: Rs. {total}
            </div>
          )}

          {error && <div className="mb-4 text-center text-sm text-red-500">{error}</div>}
          {apiError && <div className="mb-4 text-center text-sm text-red-500">{apiError}</div>}

          {!isGuestInfoComplete && (
            <div className="mb-4 text-center text-sm text-stone-500">
              Please fill in all guest details before confirming the booking.
            </div>
          )}

          <button
            onClick={handleConfirmBooking}
            disabled={!checkIn || !checkOut || !!error || !isGuestInfoComplete || !areAllInputsValid || isSubmitting}
            className={`w-full rounded-md py-4 font-medium transition ${
              error || !checkIn || !checkOut || !isGuestInfoComplete || !areAllInputsValid || isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-teal-500 text-white hover:scale-[1.02] hover:bg-teal-600"
            }`}
          >
            {isSubmitting ? "Saving Booking..." : "Confirm Booking"}
          </button>
        </div>

        <aside className="order-1 min-w-0 lg:sticky lg:top-10 lg:order-2">
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
                      Meal Plan
                    </p>
                    <p className="mt-2 font-medium text-stone-800">{selectedMealPlan.label}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Rooms
                    </p>
                    <p className="mt-2 font-medium text-stone-800">{selectedRoomCount}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Plan Guests
                    </p>
                    <p className="mt-2 font-medium text-stone-800">{normalizedMealPlanPeople}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
                  {mealPlan === "none"
                    ? "No meal plan cost added."
                    : `${selectedMealPlan.label} for ${normalizedMealPlanPeople} occupant(s) at Rs. ${selectedMealPlan.price} per person per night.`}
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
              <p><strong>Adults:</strong> {adults}</p>
              <p><strong>Children &gt; 10:</strong> {childrenAbove10}</p>
              <p><strong>Children &lt; 10:</strong> {complimentaryChildrenBelow10}</p>
              <p><strong>Total Occupants:</strong> {totalOccupants}</p>
              <p><strong>Rooms:</strong> {selectedRoomCount}</p>
              <p><strong>Extra Guests / Mattresses:</strong> {autoMattressCount}</p>
              <p><strong>Meal Plan:</strong> {selectedMealPlan.label}</p>
              <p><strong>Meal Plan People:</strong> {normalizedMealPlanPeople}</p>
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
