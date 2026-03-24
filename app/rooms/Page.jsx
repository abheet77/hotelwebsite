import RoomsList from "@/components/rooms/RoomsList";
import RoomsHeader from "@/components/rooms/RoomsHeader";
import FunFact from "@/components/rooms/FunFact";
export default function RoomsPage() {
  return (
    <main className="bg-white text-black px-6 md:px-[80px] lg:px-[140px] py-12">
      
      <RoomsHeader />

      <RoomsList />
      <FunFact />
    </main>
  );
}