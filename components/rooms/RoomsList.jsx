import RoomCard from "./RoomCard";
import { ROOM_CATALOG } from "@/lib/rooms";

function SideProp({ align = "left", label }) {
  const isLeft = align === "left";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 xl:flex ${
        isLeft ? "left-0 -translate-x-8" : "right-0 translate-x-8"
      } items-center gap-4 text-stone-400/80`}
    >
      {isLeft ? (
        <>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-stone-300" />
          <div className="flex flex-col items-center gap-3">
            <span className="h-2 w-2 rounded-full border border-stone-300 bg-white" />
            <span className="h-10 w-px bg-stone-200" />
            <span className="text-[10px] tracking-[0.35em] uppercase">{label}</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] tracking-[0.35em] uppercase">{label}</span>
            <span className="h-10 w-px bg-stone-200" />
            <span className="h-2 w-2 rounded-full border border-stone-300 bg-white" />
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-stone-300" />
        </>
      )}
    </div>
  );
}

export default function RoomsList() {
  const rooms = ROOM_CATALOG;

  return (
    <div className="flex w-full flex-col gap-16">
      {rooms.map((room, index) => (
        <div
          key={index}
          className={`relative flex flex-col items-center lg:flex-row ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
        >
          <SideProp align="left" label="stay" />
          <RoomCard
            title={room.title}
            images={room.images}
            price={room.price}
            details={room.details}
            index={index}
          />
          <SideProp align="right" label="view" />
        </div>
      ))}
    </div>
  );
}
