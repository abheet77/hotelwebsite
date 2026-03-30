"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RoomCard({ title, images, price, details, index}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const safeImages = images?.length ? images : ["/HillFacing.png"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      ref={ref}
      className={`mx-auto w-full overflow-hidden rounded-[22px] border border-stone-200/80 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.34)] sm:w-[95%] lg:w-[70%] xl:w-[70%]
      ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 lg:" +
            (index % 2 === 0 ? "-translate-x-20" : "translate-x-20") +
            " translate-y-10"
      }
    `}
    >
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[260px] lg:h-[300px]">
        <Image
          src={safeImages[current]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 95vw, 70vw"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />

        <button
          onClick={prevSlide}
          aria-label={`Previous image for ${title}`}
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
        >
          &#8249;
        </button>

        <button
          onClick={nextSlide}
          aria-label={`Next image for ${title}`}
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
        >
          &#8250;
        </button>
      </div>

      <div className="relative overflow-hidden border-t border-white/10 bg-teal-500 px-6 py-5 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_42%,rgba(0,0,0,0.08))]" />
        <div className="absolute left-8 top-1/2 hidden h-px w-14 -translate-y-1/2 bg-white/35 md:block" />
        <div className="absolute right-8 top-1/2 hidden h-px w-14 -translate-y-1/2 bg-white/35 md:block" />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] uppercase tracking-[0.45em] text-white/75">
            Signature Stay
          </span>
          <div className="text-lg font-semibold tracking-[0.12em] sm:text-xl">
            {title}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200 bg-[linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)] px-6 py-4">
        <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-lg text-gray-600 transition hover:border-stone-400 hover:bg-stone-100"
        >
          {open ? "\u2212" : "+"}
        </button>
          <div className="hidden sm:block">
            <div className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
              Room Details
            </div>
            <div className="mt-1 h-px w-16 bg-stone-300" />
          </div>
        </div>

        <button
          onClick={() =>
            router.push(`/booking?room=${encodeURIComponent(title)}&price=${price}`)
          }
          className="rounded-xl bg-teal-500 px-5 py-3 text-xs font-medium text-white shadow-[0_10px_24px_-16px_rgba(13,148,136,0.9)] transition hover:bg-teal-600 sm:text-sm"
        >
          Rs. {price} / night
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-white px-6 py-5">
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 sm:grid-cols-3">
            {details.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500/75" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
