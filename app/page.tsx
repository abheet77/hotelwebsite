"use client";

import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/app/common/Footer";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("scroll") === "features") {
      setTimeout(() => {
        document
          .getElementById("features-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchParams]);

  return (
    <>
      <Hero />

      <div id="features-section">
        <Features />
      </div>

      <Footer />
    </>
  );
}