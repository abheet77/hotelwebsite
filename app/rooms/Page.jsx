"use client";

import Hero from "@/components/home/Hero";
import Footer from "@/app/common/Footer";
import RoomsList from "@/components/rooms/RoomsList";
import RoomsHeader from "@/components/rooms/RoomsHeader";
import FunFact from "@/components/rooms/FunFact";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ScrollPath from "@/components/rooms/ScrollPath";

export default function RoomsPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("scroll") === "rooms") {
      setTimeout(() => {
        document
          .getElementById("rooms-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchParams]);

  return (
    <>
      <ScrollPath />
      <Hero />

      <main className="relative bg-white px-6 py-12 text-black md:px-[80px] lg:px-[120px]">
        <RoomsHeader />

        <div id="rooms-section">
          <RoomsList />
        </div>

        <FunFact />
      </main>

      <Footer />
    </>
  );
}
