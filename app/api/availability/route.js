import { calculateAvailability } from "@/lib/availability";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

function isMissingAvailabilityTable(error) {
  const message = error?.message || "";
  return (
    message.includes("public.room_availability") ||
    message.includes("relation \"public.room_availability\" does not exist")
  );
}

export async function GET(req) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const roomType = searchParams.get("roomType")?.trim() || "";
    const checkIn = searchParams.get("checkIn")?.trim() || "";
    const checkOut = searchParams.get("checkOut")?.trim() || "";
    const requestedRooms = Number(searchParams.get("roomCount") || "1");

    if (!roomType || !checkIn || !checkOut) {
      return Response.json(
        { message: "roomType, checkIn, and checkOut are required." },
        { status: 400 },
      );
    }

    const [
      { data: bookings, error: bookingsError },
      { data: overrides, error: overridesError },
      { data: inventoryRows, error: inventoryError },
    ] =
      await Promise.all([
        supabase
          .from("bookings")
          .select("Room_Type, Number_of_rooms, Check_in, Check_out"),
        supabase
          .from("room_availability")
          .select("room_type, status_date, is_closed"),
        supabase
          .from("room_inventory")
          .select("room_type, total_units"),
      ]);

    if (bookingsError) {
      return Response.json(
        {
          message: "Availability could not be checked.",
          details: bookingsError.message,
        },
        { status: 500 },
      );
    }

    if (overridesError && !isMissingAvailabilityTable(overridesError)) {
      return Response.json(
        {
          message: "Availability overrides could not be checked.",
          details: overridesError.message,
        },
        { status: 500 },
      );
    }

    if (inventoryError && !inventoryError.message.includes("public.room_inventory")) {
      return Response.json(
        {
          message: "Room inventory could not be checked.",
          details: inventoryError.message,
        },
        { status: 500 },
      );
    }

    const inventoryByRoom = Object.fromEntries(
      (inventoryRows || []).map((row) => [row.room_type, Number(row.total_units || 0)]),
    );

    const availability = calculateAvailability({
      bookings: bookings || [],
      overrides: isMissingAvailabilityTable(overridesError) ? [] : overrides || [],
      inventoryByRoom,
      roomType,
      checkIn,
      checkOut,
      requestedRooms,
    });

    return Response.json(availability, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Server error",
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
