"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollOrb() {
  const orbRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(orbRef.current, {
      y: 400,
      x: -100,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div className="hidden lg:block fixed right-20 top-40 z-0 pointer-events-none">
      <div
        ref={orbRef}
        className="w-32 h-32 rounded-full blur-xl opacity-70"
        style={{
          background:
            "radial-gradient(circle, #67e8f9, #a78bfa, #f472b6)",
        }}
      />
    </div>
  );
}