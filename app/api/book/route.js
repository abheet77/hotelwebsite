import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();

    const {
      guestName,
      phoneNumber,
      emailAddress,
      validIdNumber,
      idPhotographName,
      checkIn,
      checkOut,
      adults,
      childrenAbove10,
      childrenBelow10,
      roomCount,
      extraGuestCount,
      autoMattressCount,
      mealPlan,
      mealPlanLabel,
      mealPlanPeople,
      roomType,
      pricePerNight,
      nights,
      totalOccupants,
      totalPrice,
    } = body;

    const normalizedAdults = Number(adults ?? 1);
    const normalizedChildrenAbove10 = Number(childrenAbove10 ?? 0);
    const normalizedChildrenBelow10 = Number(childrenBelow10 ?? 0);
    const normalizedRoomCount = Number(roomCount ?? 1);
    const normalizedExtraGuests = Number(extraGuestCount ?? 0);
    const normalizedMattressCount = Number(autoMattressCount ?? 0);
    const normalizedMealPlanPeople = Number(mealPlanPeople ?? 0);
    const normalizedPricePerNight = Number(pricePerNight ?? 0);
    const normalizedNights = Number(nights ?? 0);
    const normalizedTotalOccupants = Number(totalOccupants ?? 0);
    const normalizedTotalPrice = Number(totalPrice ?? 0);

    if (
      !guestName ||
      !phoneNumber ||
      !emailAddress ||
      !validIdNumber ||
      !idPhotographName ||
      !checkIn ||
      !checkOut ||
      !roomType ||
      Number.isNaN(normalizedPricePerNight)
    ) {
      return Response.json(
        { message: "Missing required booking fields" },
        { status: 400 },
      );
    }

    const bookingRecord = {
      Name: guestName,
      Phone_Number: phoneNumber,
      Email_Address: emailAddress,
      Valid_ID_Number: validIdNumber,
      ID_Photograph_Name: idPhotographName,
      Check_in: checkIn,
      Check_out: checkOut,
      Adults: normalizedAdults,
      Children_Above_10: normalizedChildrenAbove10,
      Children_Below_10: normalizedChildrenBelow10,
      Number_of_rooms: normalizedRoomCount,
      Extra_Guests: normalizedExtraGuests,
      Extra_Mattress_Count: normalizedMattressCount,
      Select_Plan: mealPlan || "none",
      Select_Plan_Label: mealPlanLabel || "None",
      Plan_For_How_Many_People: normalizedMealPlanPeople,
      Room_Type: roomType,
      Price_per_night: normalizedPricePerNight,
      Nights: normalizedNights,
      Total_Occupants: normalizedTotalOccupants,
      Total_Price: normalizedTotalPrice,
    };

    const { error } = await supabase.from("bookings").insert([bookingRecord]);

    if (error) {
      console.error(error);
      return Response.json(
        {
          message: "Database error",
          details: error.message,
          hint: error.hint ?? null,
        },
        { status: 500 },
      );
    }

    return Response.json(
      { message: "Booking successful" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        message: "Server error",
        details: err instanceof Error ? err.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
