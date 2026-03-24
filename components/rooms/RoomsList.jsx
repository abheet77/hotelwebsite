import RoomCard from "./RoomCard";

export default function RoomsList() {
    const rooms = [
        {
            title: "Market Facing",
            image: "MarketFacing.png",
            capacity: 3,
            price: 3500,
        },
        {
            title: "Hill Facing",
            image: "HillFacing.png",
            capacity: 2,
            price: 3000,
        },
        {
            title: "Twin Room",
            image: "TwinRoom.png",
            capacity: 4,
            price: 4000,
        },
    ];

    return (
<div className="w-full flex flex-col items-center gap-8 sm:gap-10 lg:gap-12">            {rooms.map((room, index) => (
                <RoomCard
                    key={index}
                    title={room.title}
                    image={room.image}
                    capacity={room.capacity}
                    price={room.price}
                />
            ))}
        </div>
    );
}