import RoomCard from "./RoomCard";

export default function RoomsList() {
  const rooms = [
  {
    title: "Market Facing",
    images: ["/marketfacing1.png", "/marketfacing2.png","bathroom1.png","bathroom2.png"],
    price: 3500,
    details: [
      "capacity: 3",
      "Free WiFi",
      "Hot Water",
      "TV",
      "Size: 11 x 15ft",
      "King Size Bed",
    ],
  },
  {
    title: "Hill Facing",
    images: ["/hillfacing1.png", "/hillfacing2.png","bathroom1.png","bathroom2.png"],
    price: 3000,
    details: [
      "capacity: 3",
      "Free WiFi",
      "Balcony View",
      "Size: 11 x 13ft",
      "Queen Bed",
    ],
  },
  {
    title: "Twin Room",
    images: ["/TwinRoom.png", "/twinroom1.png","bathroom1.png","bathroom2.png"],
    price: 6000,
    details: [
      "capacity: 6",
      "Free WiFi",
      "Hot Water",
      "TV",
      "Size: 11 x 15ft",
      "2 Beds",
    ],
  },
];

    return (
<div className="w-full flex flex-col gap-16">
  {rooms.map((room, index) => (
    <div
      key={index}
      className={`flex flex-col lg:flex-row items-center ${
        index % 2 !== 0 ? "lg:flex-row-reverse" : ""
      }`}
    >
      <RoomCard
  key={index}
  title={room.title}
  images={room.images}
  
  price={room.price}
  details={room.details}   // ✅ IMPORTANT
  index={index}
/>
    </div>
  ))}
</div>
    );
}