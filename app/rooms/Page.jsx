"use client";

import Hero from "@/components/home/Hero";
import Footer from "@/app/common/Footer";
import RoomsList from "@/components/rooms/RoomsList";
import RoomsHeader from "@/components/rooms/RoomsHeader";
import FunFact from "@/components/rooms/FunFact";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
      {/* FULL WIDTH */}
      <Hero />

      {/* CONSTRAINED CONTENT */}
      <main className="bg-white text-black px-6 md:px-[80px] lg:px-[140px] py-12">
        <RoomsHeader />

        {/* 🔥 TARGET SECTION */}
        <div id="rooms-section">
          <RoomsList />
        </div>

        <FunFact />
      </main>

      {/* FULL WIDTH */}
      <Footer />
    </>
  );
}