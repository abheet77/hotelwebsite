import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      extraMattress,
      breakfast,
      roomType,
      price,
    } = body;

    // ✅ validation
    if (!name || !phone || !checkIn || !checkOut) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ insert into DB
    const { error } = await supabase.from("bookings").insert([
      {
        name: name,
        phone: phone,
        email: email,
        check_in: checkIn,
        check_out: checkOut,
        adults: adults,
        children: children,
        rooms: rooms,
        extra_mattress: extraMattress,
        breakfast: breakfast,
        room_type: roomType,
        price: price,
      },
    ]);

    if (error) {
      console.error(error);
      return Response.json(
        { message: "Database error" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Booking successful" },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}