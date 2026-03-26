"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Features() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const firstTextRef = useRef(null);
  const firstImageRef = useRef(null);
  const secondImageRef = useRef(null);
  const secondTextRef = useRef(null);
  const factRef = useRef(null);

  const handleExploreClick = () => {
    router.push("/rooms?scroll=rooms");
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            headerRef.current,
            firstTextRef.current,
            firstImageRef.current,
            secondImageRef.current,
            secondTextRef.current,
            factRef.current,
          ],
          { opacity: 1, y: 0, x: 0, clearProps: "transform" }
        );
        return;
      }

      const sections = [
        {
          trigger: firstTextRef.current,
          targets: [firstTextRef.current, firstImageRef.current],
          vars: [{ opacity: 0, x: -36 }, { opacity: 0, x: 36, scale: 1.08 }],
        },
        {
          trigger: secondTextRef.current,
          targets: [secondImageRef.current, secondTextRef.current],
          vars: [{ opacity: 0, x: -36, scale: 1.08 }, { opacity: 0, x: 36 }],
        },
      ];

      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      sections.forEach(({ trigger, targets, vars }) => {
        targets.forEach((target, index) => {
          gsap.set(target, vars[index]);
        });

        gsap
          .timeline({
            defaults: { duration: 0.95, ease: "power3.out" },
            scrollTrigger: {
              trigger,
              start: "top 78%",
            },
          })
          .to(
            targets,
            {
              opacity: 1,
              x: 0,
              scale: 1,
              stagger: 0.14,
              clearProps: "transform",
            },
            0
          );
      });

      gsap.set(factRef.current, { opacity: 0, y: 36, scale: 0.96 });
      gsap.to(factRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: factRef.current,
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-white text-black py-16 px-6 md:px-16"
    >
      {/* Top Text */}
      <p ref={headerRef} className="mb-12 text-center text-gray-600">
        All our room types have option of complementary breakfast
      </p>

      {/* ================= SECTION 1 ================= */}
      <div className="grid md:grid-cols-2 gap-10 items-center pb-24">

        {/* Left Text */}
        <div ref={firstTextRef}>
          <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
            COMFORT AND QUALITY YOU CAN AFFORD.
          </h2>

          <p className="mb-4 text-gray-600">
            Our rooms are designed to transport you into an environment made for leisure.
            Take your mind off the day-to-day of home life and find a private paradise for yourself.
          </p>

          <button
            onClick={handleExploreClick}
            className="rounded-md bg-teal-500 px-4 py-2 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-teal-600 hover:shadow-lg active:scale-95"
          >
            EXPLORE
          </button>
        </div>

        {/* Right Image */}
        <img
          ref={firstImageRef}
          src="/room2.png"
          alt="room"
          className="h-[300px] w-full rounded-xl object-cover shadow-[0_24px_60px_-32px_rgba(15,118,110,0.35)]"
        />
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Image */}
        <img
          ref={secondImageRef}
          src="/room1.png"
          alt="woods"
          className="order-2 h-[300px] w-full rounded-xl object-cover shadow-[0_24px_60px_-32px_rgba(15,118,110,0.35)] md:order-1"
        />

        {/* Right Text */}
        <div ref={secondTextRef} className="order-1 md:order-2">
          <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
            EMBRACE THE WOODS
          </h2>

          <p className="mb-4 text-gray-600">
            We love life in the mountains. Surrounded by towering peaks and crisp air,
            each moment brings peace and adventure.
          </p>

          <button
            onClick={handleExploreClick}
            className="rounded-md bg-teal-500 px-4 py-2 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-teal-600 hover:shadow-lg active:scale-95"
          >
            EXPLORE
          </button>
        </div>
      </div>

      {/* ================= FUN FACT ================= */}
      <div ref={factRef} className="mx-auto mt-20 max-w-2xl text-center">
        <h2 className="text-xl md:text-2xl tracking-[0.3em] text-gray-700 mb-6">
          FUN FACT
        </h2>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {`"The name Pahalgam is a combination of two Kashmiri words:
          'Pahal' (meaning shepherd) and 'Gaam' (meaning village)."`}
        </p>
      </div>
    </div>
  );
}
