"use client";
import Navbar from "../layout/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero({ bookNowMode = "route" }) {
  const router = useRouter();
  const pathname = usePathname();
  const heroRef = useRef(null);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            titleRef.current,
            subtitleRef.current,
            copyRef.current,
            ctaRef.current,
            cueRef.current,
          ],
          { opacity: 1, y: 0, clearProps: "transform" }
        );
        return;
      }

      gsap.set(backgroundRef.current, { scale: 1.12 });
      gsap.set(
        [
          eyebrowRef.current,
          titleRef.current,
          subtitleRef.current,
          copyRef.current,
          ctaRef.current,
          cueRef.current,
        ],
        { opacity: 0, y: 36 }
      );

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(backgroundRef.current, { scale: 1, duration: 1.8 }, 0)
        .to(
          [
            eyebrowRef.current,
            titleRef.current,
            subtitleRef.current,
            copyRef.current,
            ctaRef.current,
            cueRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            clearProps: "transform",
          },
          0.2
        );

      gsap.to(backgroundRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(cueRef.current, {
        y: 12,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleBookNow = () => {
    if (bookNowMode === "scroll" || pathname === "/rooms") {
      document.getElementById("rooms-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push("/rooms?scroll=rooms");
  };

  const isScrollMode = bookNowMode === "scroll" || pathname === "/rooms";

  return (
    <div
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/hero.png")' }}
      />

      <Navbar />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50"></div>

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex items-center px-5 sm:px-6 md:px-16"
      >
        <div className="text-white max-w-2xl">
          <p
            ref={eyebrowRef}
            className="mb-2 text-[10px] tracking-[0.35em] text-gray-200 sm:text-xs sm:tracking-[0.4em] md:text-sm"
          >
            WELCOME TO
          </p>

          <h1
            ref={titleRef}
            className="-ml-1 max-w-2xl text-4xl font-light leading-[1.1] tracking-[0.05em] sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl"
          >
            CENTRAL
          </h1>

          <h2
            ref={subtitleRef}
            className="mt-2 text-sm tracking-[0.35em] text-gray-200 sm:text-base sm:tracking-[0.45em] md:text-xl"
          >
            HOTEL
          </h2>

          <p
            ref={copyRef}
            className="mt-6 max-w-md text-xs leading-relaxed text-gray-300 sm:text-sm md:text-base"
          >
            Book your stay and enjoy Luxury redefined at the most affordable rates.
          </p>

          <button
            ref={ctaRef}
            onClick={handleBookNow}
            className="mt-8 rounded-md bg-teal-500 px-6 py-3 text-white transition duration-300 ease-out hover:-translate-y-1 hover:bg-teal-600 hover:shadow-lg active:scale-95"
          >
            {isScrollMode ? "VIEW ROOMS" : "BOOK NOW"}
          </button>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-white"
      >
        <span className="text-[10px] tracking-[0.4em] text-white/75 sm:text-xs">
          SCROLL
        </span>
        <span className="mt-3 h-12 w-px bg-gradient-to-b from-white/90 to-transparent" />
      </div>
    </div>
  );
}
