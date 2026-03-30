"use client";

import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/app/common/Footer";

export default function HomeClient({ scroll }) {
  useEffect(() => {
    if (scroll === "features") {
      setTimeout(() => {
        document
          .getElementById("features-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [scroll]);

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
