import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

function isMissingAvailabilityTable(error) {
  const message = error?.message || "";
  return (
    message.includes("public.room_availability") ||
    message.includes("relation \"public.room_availability\" does not exist")
  );
}

export async function POST(req) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await req.json();
    const roomType = typeof body?.roomType === "string" ? body.roomType.trim() : "";
    const statusDate =
      typeof body?.statusDate === "string" ? body.statusDate.trim() : "";
    const isClosed = Boolean(body?.isClosed);

    if (!roomType || !statusDate) {
      return Response.json(
        { message: "roomType and statusDate are required." },
        { status: 400 },
      );
    }

    const payload = {
      room_type: roomType,
      status_date: statusDate,
      is_closed: isClosed,
      status_note: isClosed
        ? `Closed by admin for ${statusDate}.`
        : `Opened by admin for ${statusDate}.`,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("room_availability")
      .upsert(payload, { onConflict: "room_type,status_date" })
      .select("room_type, status_date, is_closed, status_note")
      .single();

    if (error) {
      return Response.json(
        {
          message: isMissingAvailabilityTable(error)
            ? "Date-wise room controls are not ready yet. Run supabase/setup-admin-dashboard.sql first."
            : "Room status could not be saved.",
          details: error.message,
        },
        { status: isMissingAvailabilityTable(error) ? 503 : 500 },
      );
    }

    return Response.json({ room: data }, { status: 200 });
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
