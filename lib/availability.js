import { getRoomCatalogMap } from "@/lib/rooms";

export function parseDateValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateValue(date) {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateValue() {
  return formatDateValue(new Date());
}

export function enumerateStayDates(checkIn, checkOut) {
  const start = parseDateValue(checkIn);
  const end = parseDateValue(checkOut);

  if (!start || !end || end <= start) {
    return [];
  }

  const dates = [];
  const cursor = new Date(start);

  while (cursor < end) {
    dates.push(formatDateValue(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function doesBookingOverlapDate(booking, date) {
  return booking.Check_in <= date && booking.Check_out > date;
}

export function calculateAvailability({
  bookings,
  overrides,
  inventoryByRoom = {},
  roomType,
  checkIn,
  checkOut,
  requestedRooms = 1,
}) {
  const room = getRoomCatalogMap()[roomType];
  const totalUnits = Number(inventoryByRoom[roomType] ?? room?.totalUnits ?? 0);
  const stayDates = enumerateStayDates(checkIn, checkOut);

  if (!room || stayDates.length === 0) {
    return {
      available: false,
      message: "Select a valid stay to check availability.",
      totalUnits,
      requestedRooms,
      remainingRooms: 0,
      blockedDates: [],
    };
  }

  let remainingRooms = totalUnits;
  const blockedDates = [];

  for (const date of stayDates) {
    const bookedRooms = bookings
      .filter((booking) => booking.Room_Type === roomType && doesBookingOverlapDate(booking, date))
      .reduce((sum, booking) => sum + Number(booking.Number_of_rooms || 0), 0);

    const isClosed = overrides.some(
      (override) =>
        override.room_type === roomType &&
        override.status_date === date &&
        override.is_closed,
    );

    const roomsLeft = Math.max(totalUnits - bookedRooms, 0);
    remainingRooms = Math.min(remainingRooms, roomsLeft);

    if (isClosed || roomsLeft < requestedRooms) {
      blockedDates.push(date);
    }
  }

  if (blockedDates.length > 0) {
    return {
      available: false,
      message:
        blockedDates.length === 1
          ? `${roomType} is not available on ${blockedDates[0]}.`
          : `${roomType} is not available for the selected stay.`,
      totalUnits,
      requestedRooms,
      remainingRooms,
      blockedDates,
    };
  }

  return {
    available: true,
    message: `${remainingRooms} ${remainingRooms === 1 ? "room is" : "rooms are"} available for these dates.`,
    totalUnits,
    requestedRooms,
    remainingRooms,
    blockedDates: [],
  };
}
