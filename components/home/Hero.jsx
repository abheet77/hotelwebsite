"use client";

export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/hero.png")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24 z-10">
        <div className="text-white max-w-md space-y-4">
          <h1 className="mb-4">
            <span className="font-['Montserrat'] text-[50px] font-light leading-[1.4] tracking-[0.35em]">WELCOME TO </span>
            <span className="font-['Aboreto'] text-[130px] font-normal leading-[1] tracking-normal">CENTRAL </span>
            <span className="font-['Aboreto'] text-[60px] font-light leading-[1.2] tracking-[0.4em]">HOTEL</span>
          </h1>

          <p className="font-['Montserrat'] text-[25px] mb-6">
            Book your stay and enjoy Luxury redefined at the most affordable rates.
          </p>

          <button className="bg-[#30b0c7] hover:bg-[#2a9ca8] px-6 py-3 rounded-lg">
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
}