import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await req.json();
    const roomType = typeof body?.roomType === "string" ? body.roomType.trim() : "";
    const totalUnits = Number(body?.totalUnits);

    if (!roomType || Number.isNaN(totalUnits) || totalUnits < 0) {
      return Response.json(
        { message: "roomType and a valid non-negative totalUnits are required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("room_inventory")
      .upsert(
        {
          room_type: roomType,
          total_units: totalUnits,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "room_type" },
      )
      .select("room_type, total_units")
      .single();

    if (error) {
      return Response.json(
        {
          message: "Room inventory could not be saved.",
          details: error.message,
        },
        { status: 500 },
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
