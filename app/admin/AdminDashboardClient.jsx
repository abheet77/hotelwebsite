"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function AdminDashboardClient({
  initialBookings,
  initialRooms,
  dashboardError,
  selectedDate,
  summary,
}) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [inventoryDrafts, setInventoryDrafts] = useState(
    Object.fromEntries(initialRooms.map((room) => [room.title, String(room.totalUnits)])),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState(dashboardError || "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRooms(initialRooms);
    setInventoryDrafts(
      Object.fromEntries(initialRooms.map((room) => [room.title, String(room.totalUnits)])),
    );
  }, [initialRooms]);

  useEffect(() => {
    setError(dashboardError || "");
  }, [dashboardError]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);

    return () => clearInterval(interval);
  }, [router]);

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    router.push(`/admin?date=${nextDate}`);
  };

  const handleRefresh = () => {
    setMessage("");
    router.refresh();
  };

  const handleToggleRoom = (roomType, nextClosed) => {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/room-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType,
            statusDate: selectedDate,
            isClosed: nextClosed,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.details ||
              result?.message ||
              "Room status could not be updated.",
          );
        }

        setRooms((currentRooms) =>
          currentRooms.map((room) =>
            room.title === roomType
              ? {
                  ...room,
                  isClosed: nextClosed,
                  statusNote: result?.room?.status_note || room.statusNote,
                }
              : room,
          ),
        );
        setMessage(
          nextClosed
            ? `${roomType} is now closed for ${selectedDate}.`
            : `${roomType} is open again for ${selectedDate}.`,
        );
      } catch (toggleError) {
        setError(
          toggleError instanceof Error
            ? toggleError.message
            : "Room status could not be updated.",
        );
      }
    });
  };

  const handleInventoryChange = (roomType, value) => {
    setInventoryDrafts((current) => ({
      ...current,
      [roomType]: value.replace(/[^\d]/g, ""),
    }));
  };

  const handleInventorySave = (roomType) => {
    const nextTotalUnits = Number(inventoryDrafts[roomType] || "0");
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/room-inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType,
            totalUnits: nextTotalUnits,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.details ||
              result?.message ||
              "Room inventory could not be updated.",
          );
        }

        setMessage(`${roomType} inventory updated to ${nextTotalUnits} room(s).`);
        router.refresh();
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Room inventory could not be updated.",
        );
      }
    });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7faf9_0%,#edf6f3_100%)] px-4 py-10 text-stone-900 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_42%),linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.42em] text-emerald-100/80">
                  Central Hotel
                </p>
                <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-50/85 sm:text-base">
                  Review date-wise bookings, revenue, and room availability from one place.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-emerald-100/80">
                  Dashboard Date
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    Refresh Now
                  </button>
                </div>
                <p className="mt-2 text-xs text-emerald-100/80">
                  Auto-refresh runs every 15 seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-8">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                Active Bookings
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {summary.totalBookings}
              </p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                Rooms Booked
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {summary.totalRoomsBooked}
              </p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                Revenue For Date
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {summary.totalRevenueLabel}
              </p>
            </div>
          </div>
        </section>

        {(message || error) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.3)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  Room Control
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  Availability On {selectedDate}
                </h2>
              </div>
              {isPending && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Updating...
                </span>
              )}
            </div>

            <div className="space-y-4">
              {rooms.map((room) => {
                const soldOut = room.availableRooms === 0;
                const unavailable = room.isClosed || soldOut;

                return (
                  <div
                    key={room.title}
                    className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">
                          {room.title}
                        </h3>
                        <p className="mt-1 text-sm text-stone-600">
                          Total inventory: {room.totalUnits} room(s)
                        </p>
                        <p className="mt-1 text-sm text-stone-600">
                          Booked on this date: {room.bookedRooms}
                        </p>
                        <p className="mt-1 text-sm text-stone-600">
                          Remaining on this date: {room.availableRooms}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            unavailable
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {room.isClosed ? "Closed By Admin" : soldOut ? "Sold Out" : "Available"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleRoom(room.title, !room.isClosed)}
                          disabled={isPending}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            room.isClosed
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-stone-900 text-white hover:bg-stone-700"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {room.isClosed ? "Reopen For This Date" : "Close For This Date"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        Price: {formatCurrency(room.price)}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        Active bookings: {room.bookingCount}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                        Rooms In This Category
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={inventoryDrafts[room.title] ?? ""}
                          onChange={(event) =>
                            handleInventoryChange(room.title, event.target.value)
                          }
                          className="min-w-0 flex-1 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleInventorySave(room.title)}
                          disabled={isPending}
                          className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Save Count
                        </button>
                      </div>
                    </div>

                    {room.statusNote ? (
                      <p className="mt-3 text-sm text-stone-500">{room.statusNote}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.3)]">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Booking Ledger
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                Active On {selectedDate}
              </h2>
            </div>

            <div className="space-y-4">
              {initialBookings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 px-5 py-10 text-center text-sm text-stone-500">
                  No active bookings for this date.
                </div>
              ) : (
                initialBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">
                          {booking.Name}
                        </h3>
                        <p className="mt-1 text-sm text-stone-600">
                          {booking.Room_Type} • {booking.Number_of_rooms} room(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-stone-900">
                          {formatCurrency(
                            Number(booking.Total_Price || 0) /
                              Math.max(Number(booking.Nights || 0), 1),
                          )}{" "}
                          / day
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">Stay:</strong> {booking.Check_in} to{" "}
                        {booking.Check_out} ({booking.Nights} nights)
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">Guests:</strong> {booking.Total_Occupants} total
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">Phone:</strong> {booking.Phone_Number}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">Email:</strong> {booking.Email_Address}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">ID Number:</strong> {booking.Valid_ID_Number}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                        <strong className="text-stone-800">ID Photo Path:</strong> {booking.ID_Photograph_Name}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
