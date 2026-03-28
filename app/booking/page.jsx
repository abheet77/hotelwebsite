import BookingClient from "./BookingClient";

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  const room = Array.isArray(params?.room) ? params.room[0] : params?.room;
  const price = Array.isArray(params?.price) ? params.price[0] : params?.price;

  return <BookingClient room={room || ""} price={price || ""} />;
}
