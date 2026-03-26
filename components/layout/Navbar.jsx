"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const handleRoomsClick = () => {
    router.push("/rooms?scroll=rooms");
  };

  const handleHomeClick = () => {
    router.push("/?scroll=features");
  };

  const handleFacilitiesClick = () => {
    router.push("/?scroll=facilities");
  };

  const handleContactClick = () => {
    router.push("/?scroll=contact");
  };
  const handleMenuClick = (item, action) => {
    setActiveItem(item);

    setTimeout(() => {
      setActiveItem("");
      action();
      setMenuOpen(false);
    }, 200);
  };

  return (
    <div className="absolute top-0 left-0 w-full z-20 px-4 md:px-20">

      {/* Logo */}
      <div className="absolute top-0 left-4 md:left-8">
        <div className="bg-teal-500 text-black px-4 py-3 md:px-8 md:py-6 rounded-b-[30px] md:rounded-b-[40px] shadow-lg flex flex-col items-center">
          <p className="text-lg md:text-2xl tracking-widest">CENTRAL</p>
          <p className="text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em]">
            HOTEL
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex justify-end items-center pt-4 md:pt-6">

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 text-white text-sm font-medium">

          <button
  onClick={handleHomeClick}
  className="relative group transition duration-300"
>
  <span className="group-hover:text-teal-400 transition duration-300">
    Home
  </span>

  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
</button>

          <button
            onClick={handleFacilitiesClick}
            className="relative group transition duration-300"
          >
            <span className="group-hover:text-teal-400 transition duration-300">
              Facilities
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
  onClick={handleRoomsClick}
  className="relative group transition duration-300"
>
  <span className="group-hover:text-teal-400 transition duration-300">
    Rooms
  </span>

  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
</button>

        <button
  onClick={handleContactClick}
  className="relative group transition duration-300"
>
  <span className="group-hover:text-teal-400 transition duration-300">
    Contact-us
  </span>

  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
</button>

        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white text-black flex flex-col">

            {/* Close Button */}
            <div className="flex justify-end px-4 py-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-light"
              >
                ✕
              </button>
            </div>
            <button
              onClick={() => handleMenuClick("home", handleHomeClick)}
              className={`w-full text-center py-4 transition-colors duration-200 ${activeItem === "home" ? "bg-teal-500 text-white" : "text-black"
                }`}
            >
              Home
            </button>

            <button
              onClick={() => handleMenuClick("facilities", handleFacilitiesClick)}
              className={`w-full text-center py-4 transition-colors duration-200 ${activeItem === "facilities" ? "bg-teal-500 text-white" : "text-black"
                }`}
            >
              Facilities
            </button>


            <button
              onClick={() => handleMenuClick("rooms", handleRoomsClick)}
              className={`w-full text-center py-4 transition-colors duration-200 ${activeItem === "rooms" ? "bg-teal-500 text-white" : "text-black"
                }`}
            >
              Rooms
            </button>

            <button
              onClick={() => handleMenuClick("contact", handleContactClick)}
              className={`w-full text-center py-4 transition-colors duration-200 ${activeItem === "contact" ? "bg-teal-500 text-white" : "text-black"
                }`}
            >
              Contact-us
            </button>

          </div>

        </div>
      )
      }
    </div >
  );
}