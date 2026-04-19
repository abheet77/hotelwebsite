import AdminDashboardClient from "./AdminDashboardClient";
import {
  doesBookingOverlapDate,
  getTodayDateValue,
} from "@/lib/availability";
import { ROOM_CATALOG } from "@/lib/rooms";
import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isMissingAvailabilityTable(error) {
  const message = error?.message || "";
  return (
    message.includes("public.room_availability") ||
    message.includes("relation \"public.room_availability\" does not exist")
  );
}

function normalizeSelectedDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") ? value : getTodayDateValue();
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default async function AdminPage({ searchParams }) {
  const params = await searchParams;
  const selectedDate = normalizeSelectedDate(
    Array.isArray(params?.date) ? params.date[0] : params?.date,
  );
  const supabase = getSupabaseServerClient();

  const [
    { data: bookings, error: bookingsError },
    { data: overrides, error: overridesError },
    { data: inventoryRows, error: inventoryError },
  ] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase
      .from("room_availability")
      .select("room_type, status_date, is_closed, status_note")
      .eq("status_date", selectedDate),
    supabase
      .from("room_inventory")
      .select("room_type, total_units"),
  ]);

  const missingAvailabilityTable = isMissingAvailabilityTable(overridesError);
  const activeBookings = (bookings || []).filter((booking) =>
    doesBookingOverlapDate(booking, selectedDate),
  );

  const overrideMap = Object.fromEntries(
    (missingAvailabilityTable ? [] : overrides || []).map((row) => [
      row.room_type,
      row,
    ]),
  );
  const inventoryMap = Object.fromEntries(
    (inventoryRows || []).map((row) => [row.room_type, Number(row.total_units || 0)]),
  );

  const rooms = ROOM_CATALOG.map((room) => {
    const roomBookings = activeBookings.filter(
      (booking) => booking.Room_Type === room.title,
    );
    const bookedRooms = roomBookings.reduce(
      (sum, booking) => sum + Number(booking.Number_of_rooms || 0),
      0,
    );
    const totalUnits = Number(inventoryMap[room.title] ?? room.totalUnits ?? 0);
    const availableRooms = Math.max(totalUnits - bookedRooms, 0);
    const override = overrideMap[room.title];

    return {
      ...room,
      totalUnits,
      bookingCount: roomBookings.length,
      bookedRooms,
      availableRooms,
      isClosed: Boolean(override?.is_closed),
      statusNote:
        override?.status_note ||
        (availableRooms === 0
          ? `Sold out for ${selectedDate}.`
          : `${availableRooms} room(s) still available on ${selectedDate}.`),
    };
  });

  const summary = {
    totalBookings: activeBookings.length,
    totalRoomsBooked: activeBookings.reduce(
      (sum, booking) => sum + Number(booking.Number_of_rooms || 0),
      0,
    ),
    totalRevenue: activeBookings.reduce((sum, booking) => {
      const nights = Math.max(Number(booking.Nights || 0), 1);
      return sum + Number(booking.Total_Price || 0) / nights;
    }, 0),
  };

  const dashboardError = [
    bookingsError?.message,
    inventoryError?.message,
    missingAvailabilityTable
      ? "Date-wise room controls are not active yet. Run supabase/setup-admin-dashboard.sql in your Supabase SQL Editor."
      : overridesError?.message,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AdminDashboardClient
      initialBookings={activeBookings}
      initialRooms={rooms}
      dashboardError={dashboardError}
      selectedDate={selectedDate}
      summary={{
        ...summary,
        totalRevenueLabel: formatCurrency(summary.totalRevenue),
      }}
    />
  );
}
