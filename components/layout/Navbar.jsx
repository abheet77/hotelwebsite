"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;

    const timeout = setTimeout(() => {
      setNotice("");
    }, 2200);

    return () => clearTimeout(timeout);
  }, [notice]);

  const showComingSoon = (label) => {
    setNotice(`${label} coming soon`);
  };

  const handleRoomsClick = () => {
    router.push("/rooms?scroll=rooms");
  };

  const handleHomeClick = () => {
    router.push("/?scroll=features");
  };

  const handleRestaurantClick = () => {
    showComingSoon("Restaurant");
  };

  const handleContactClick = () => {
    showComingSoon("Contact us");
  };

  const handleMenuClick = (item, action) => {
    setActiveItem(item);

    setTimeout(() => {
      setActiveItem("");
      action();
      setMenuOpen(false);
    }, 200);
  };

  const isHomePage = pathname === "/";
  const isRoomsPage = pathname === "/rooms";

  return (
    <div className="absolute top-0 left-0 z-20 w-full px-4 md:px-20">
      {notice && (
        <div className="fixed right-4 top-4 z-[60] rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs tracking-[0.2em] text-white shadow-lg backdrop-blur-md md:right-8 md:top-6">
          {notice.toUpperCase()}
        </div>
      )}

      <div className="absolute top-0 left-4 md:left-8">
        <div className="flex flex-col items-center rounded-b-[30px] bg-teal-500 px-4 py-3 text-black shadow-lg md:rounded-b-[40px] md:px-8 md:py-6">
          <p className="text-lg tracking-widest md:text-2xl">CENTRAL</p>
          <p className="text-[10px] tracking-[0.3em] md:text-sm md:tracking-[0.4em]">
            HOTEL
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 md:pt-6">
        <div className="hidden space-x-12 text-sm font-medium text-white md:flex">
          <button
            onClick={handleHomeClick}
            className="group relative transition duration-300"
          >
            <span
              className={`transition duration-300 group-hover:text-teal-400 ${
                isHomePage ? "text-teal-300" : ""
              }`}
            >
              Home
            </span>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-teal-400 transition-all duration-300 ${
                isHomePage ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>

          <button
            onClick={handleRestaurantClick}
            className="group relative transition duration-300"
          >
            <span className="transition duration-300 group-hover:text-teal-400">
              Restaurant
            </span>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-teal-400 transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={handleRoomsClick}
            className="group relative transition duration-300"
          >
            <span
              className={`transition duration-300 group-hover:text-teal-400 ${
                isRoomsPage ? "text-teal-300" : ""
              }`}
            >
              Rooms
            </span>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-teal-400 transition-all duration-300 ${
                isRoomsPage ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>

          <button
            onClick={handleContactClick}
            className="group relative transition duration-300"
          >
            <span className="transition duration-300 group-hover:text-teal-400">
              Contact Us
            </span>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-teal-400 transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl text-white md:hidden"
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-64 flex-col bg-white text-black">
            <div className="flex justify-end px-4 py-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-light"
                aria-label="Close menu"
              >
                &#10005;
              </button>
            </div>

            <button
              onClick={() => handleMenuClick("home", handleHomeClick)}
              className={`w-full py-4 text-center transition-colors duration-200 ${
                activeItem === "home" || isHomePage
                  ? "bg-teal-500 text-white"
                  : "text-black"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleMenuClick("restaurant", handleRestaurantClick)}
              className={`w-full py-4 text-center transition-colors duration-200 ${
                activeItem === "restaurant"
                  ? "bg-teal-500 text-white"
                  : "text-black"
              }`}
            >
              Restaurant
            </button>

            <button
              onClick={() => handleMenuClick("rooms", handleRoomsClick)}
              className={`w-full py-4 text-center transition-colors duration-200 ${
                activeItem === "rooms" || isRoomsPage
                  ? "bg-teal-500 text-white"
                  : "text-black"
              }`}
            >
              Rooms
            </button>

            <button
              onClick={() => handleMenuClick("contact", handleContactClick)}
              className={`w-full py-4 text-center transition-colors duration-200 ${
                activeItem === "contact" ? "bg-teal-500 text-white" : "text-black"
              }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
