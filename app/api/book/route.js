import { getSupabaseServerClient } from "@/lib/supabase";
import { calculateAvailability } from "@/lib/availability";

export const runtime = "nodejs";

const ID_UPLOAD_BUCKET = process.env.SUPABASE_ID_UPLOAD_BUCKET || "booking-ids";
const MAX_ID_PHOTO_SIZE = 5 * 1024 * 1024;

function getString(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData, key, fallback = 0) {
  const value = Number(getString(formData, key) || fallback);
  return Number.isNaN(value) ? fallback : value;
}

function sanitizePathSegment(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "guest";
}

function getFileExtension(file) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();
  if (extensionFromName && /^[a-z0-9]+$/.test(extensionFromName)) {
    return extensionFromName;
  }

  const extensionFromType = file.type.split("/").pop()?.toLowerCase();
  if (extensionFromType && /^[a-z0-9.+-]+$/.test(extensionFromType)) {
    return extensionFromType.replace("jpeg", "jpg");
  }

  return "bin";
}

export async function POST(req) {
  try {
    const supabase = getSupabaseServerClient();
    const formData = await req.formData();
    const guestName = getString(formData, "guestName");
    const phoneNumber = getString(formData, "phoneNumber");
    const emailAddress = getString(formData, "emailAddress");
    const validIdNumber = getString(formData, "validIdNumber");
    const checkIn = getString(formData, "checkIn");
    const checkOut = getString(formData, "checkOut");
    const mealPlan = getString(formData, "mealPlan");
    const mealPlanLabel = getString(formData, "mealPlanLabel");
    const roomType = getString(formData, "roomType");
    const idPhotograph = formData.get("idPhotograph");

    const normalizedAdults = getNumber(formData, "adults", 1);
    const normalizedChildrenAbove10 = getNumber(formData, "childrenAbove10", 0);
    const normalizedChildrenBelow10 = getNumber(formData, "childrenBelow10", 0);
    const normalizedRoomCount = getNumber(formData, "roomCount", 1);
    const normalizedExtraGuests = getNumber(formData, "extraGuestCount", 0);
    const normalizedMattressCount = getNumber(formData, "autoMattressCount", 0);
    const normalizedMealPlanPeople = getNumber(formData, "mealPlanPeople", 0);
    const normalizedPricePerNight = getNumber(formData, "pricePerNight", 0);
    const normalizedNights = getNumber(formData, "nights", 0);
    const normalizedTotalOccupants = getNumber(formData, "totalOccupants", 0);
    const normalizedTotalPrice = getNumber(formData, "totalPrice", 0);

    if (
      !guestName ||
      !phoneNumber ||
      !emailAddress ||
      !validIdNumber ||
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
          message: "Room availability could not be verified.",
          details: bookingsError.message,
        },
        { status: 500 },
      );
    }

    if (
      overridesError &&
      !overridesError.message.includes("public.room_availability") &&
      !overridesError.message.includes("relation")
    ) {
      return Response.json(
        {
          message: "Room availability overrides could not be verified.",
          details: overridesError.message,
        },
        { status: 500 },
      );
    }

    if (inventoryError && !inventoryError.message.includes("public.room_inventory")) {
      return Response.json(
        {
          message: "Room inventory could not be verified.",
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
      overrides:
        overridesError &&
        (overridesError.message.includes("public.room_availability") ||
          overridesError.message.includes("relation"))
          ? []
          : overrides || [],
      inventoryByRoom,
      roomType,
      checkIn,
      checkOut,
      requestedRooms: normalizedRoomCount,
    });

    if (!availability.available) {
      return Response.json(
        {
          message: availability.message,
          blockedDates: availability.blockedDates,
        },
        { status: 409 },
      );
    }

    if (!(idPhotograph instanceof File) || idPhotograph.size === 0) {
      return Response.json(
        { message: "A valid ID photograph file is required." },
        { status: 400 },
      );
    }

    if (!idPhotograph.type.startsWith("image/")) {
      return Response.json(
        { message: "ID photograph must be an image file." },
        { status: 400 },
      );
    }

    if (idPhotograph.size > MAX_ID_PHOTO_SIZE) {
      return Response.json(
        { message: "ID photograph must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const guestFolder = sanitizePathSegment(guestName);
    const fileExtension = getFileExtension(idPhotograph);
    const filePath =
      `${guestFolder}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(ID_UPLOAD_BUCKET)
      .upload(filePath, idPhotograph, {
        cacheControl: "3600",
        contentType: idPhotograph.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return Response.json(
        {
          message: "ID photograph upload failed",
          details: uploadError.message,
        },
        { status: 500 },
      );
    }

    const bookingRecord = {
      Name: guestName,
      Phone_Number: phoneNumber,
      Email_Address: emailAddress,
      Valid_ID_Number: validIdNumber,
      ID_Photograph_Name: filePath,
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
      await supabase.storage.from(ID_UPLOAD_BUCKET).remove([filePath]);
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
      {
        message: "Booking successful",
        idPhotographPath: filePath,
      },
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
