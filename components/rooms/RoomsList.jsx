import RoomCard from "./RoomCard";

export default function RoomsList() {
    const rooms = [
        {
            title: "Market Facing",
            image: "/hero.png",
            capacity: 3,
        },
        {
            title: "Hill Facing",
            image: "/hero.png",
            capacity: 2,
        },
        {
            title: "Twin Room",
            image: "/hero.png",
            capacity: 4,
        },
    ];
    return (
        <div className="w-full flex flex-col gap-12 items-center ">
            {rooms.map((room, index) => (
                <RoomCard
                    key={index}
                    title={room.title}
                    image={room.image}
                    capacity={room.capacity}
                />
            ))}
        </div>
    );
}