"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

export default function ScrollPath() {
  const ballRef = useRef(null);

  useEffect(() => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  gsap.to(ballRef.current, {
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
    },
    motionPath: {
      path: "#path",
      align: "#path",
      autoRotate: false,
    },
    ease: "power1.out",
  });
}, []);

  return (
 <div className="hidden lg:block fixed top-0 right-0 h-full w-[280px] pointer-events-none z-0">

      {/* SVG PATH */}
      <svg width="280" height="100%" viewBox="0 0 280 800">
    <path
  id="path"
  d="M220 0 
     Q180 150 220 300 
     Q260 450 220 600 
     Q180 750 220 800"
  fill="none"
  stroke="#14b8a6"
  strokeWidth="1"
/>
      </svg>

      {/* BALL */}
    <div
  ref={ballRef}
 className="w-10 h-10 rounded-full shadow-md"
  style={{
    background:
      "radial-gradient(circle at 30% 30%, #2dd4bf, #0f766e)",
  }}
/>
    </div>
  );
}