"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollPath() {
  const rootRef = useRef(null);
  const leftMarkerRef = useRef(null);
  const rightMarkerRef = useRef(null);
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      gsap.fromTo(
        [leftLineRef.current, rightLineRef.current],
        { scaleY: 0.35, opacity: 0.25, transformOrigin: "top center" },
        {
          scaleY: 1,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.to(leftMarkerRef.current, {
        y: () => window.innerHeight - 180,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      gsap.to(rightMarkerRef.current, {
        y: () => window.innerHeight - 180,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.35,
        },
      });

      gsap.to(leftMarkerRef.current, {
        x: 8,
        repeat: -1,
        yoyo: true,
        duration: 2.8,
        ease: "sine.inOut",
      });

      gsap.to(rightMarkerRef.current, {
        x: -8,
        repeat: -1,
        yoyo: true,
        duration: 3.1,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-y-0 left-0 right-0 z-0 hidden lg:block"
    >
      <div className="absolute inset-y-12 left-8 flex items-start xl:left-12">
        <div className="relative h-full w-8">
          <div
            ref={leftLineRef}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-teal-500/35 to-transparent"
          />
          <div
            ref={leftMarkerRef}
            className="absolute left-1/2 top-14 h-20 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-teal-500/80 to-transparent shadow-[0_0_18px_rgba(20,184,166,0.18)]"
          />
        </div>
      </div>

      <div className="absolute inset-y-12 right-8 flex items-start xl:right-12">
        <div className="relative h-full w-8">
          <div
            ref={rightLineRef}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone-400/40 to-transparent"
          />
          <div
            ref={rightMarkerRef}
            className="absolute left-1/2 top-24 h-20 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-stone-500/75 to-transparent shadow-[0_0_18px_rgba(120,113,108,0.14)]"
          />
        </div>
      </div>
    </div>
  );
}
