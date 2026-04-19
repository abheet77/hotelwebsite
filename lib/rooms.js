export const ROOM_CATALOG = [
  {
    title: "Market Facing",
    price: 3500,
    capacity: 3,
    // Update this to your real inventory count for accurate availability.
    totalUnits: 1,
    images: ["/marketfacing1.png", "/marketfacing2.png", "/bathroom1.png", "/bathroom2.png"],
    details: [
      "capacity: 3",
      "Free WiFi",
      "Hot Water",
      "LED",
      "Size: 11 x 15ft",
      "King Size Bed",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
  {
    title: "Hill Facing",
    price: 3000,
    capacity: 3,
    // Update this to your real inventory count for accurate availability.
    totalUnits: 1,
    images: ["/hillfacing1.png", "/hillfacing2.png", "/bathroom1.png", "/bathroom2.png"],
    details: [
      "capacity: 3",
      "Free WiFi",
      "Balcony View",
      "Size: 11 x 13ft",
      "Queen Bed",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
  {
    title: "Twin Room",
    price: 6000,
    capacity: 6,
    // Update this to your real inventory count for accurate availability.
    totalUnits: 1,
    images: ["/TwinRoom.png", "/twinroom1.png", "/bathroom1.png", "/bathroom2.png"],
    details: [
      "capacity: 6",
      "Free WiFi",
      "Hot Water",
      "LED",
      "Size: 11 x 20ft",
      "2 Beds",
      "Check-in: 2 PM",
      "Check-out: 12 PM",
    ],
  },
];

export function getRoomCatalogMap() {
  return Object.fromEntries(
    ROOM_CATALOG.map((room) => [room.title, room]),
  );
}
