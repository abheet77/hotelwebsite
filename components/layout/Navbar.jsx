export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full z-20 px-8 md:px-20">

      {/* Logo */}
      <div className="absolute top-0 left-18">
        <div className="bg-teal-500 text-black px-8 py-6 leading-tight rounded-b-[40px] shadow-lg flex flex-col items-center">
          <p className="text-2xl tracking-widest ">CENTRAL</p>
          <p className="text-sm tracking-[0.4em] text-center">HOTEL</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex justify-end items-center pt-6 space-x-12 text-white text-sm font-medium">
        <a href="#">Home</a>
        <a href="#">Facilities</a>
        <a href="#">Rooms</a>
        <a href="#">Contact-us</a>
      </div>

    </div>
  );
}