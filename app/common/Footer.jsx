export default function Footer() {
  return (
    <footer className="bg-cyan-600 text-white">

      <div className="px-8 md:px-16 lg:px-24 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* LEFT */}
          <div>
            <div>
            <h2 className="tracking-[0.35em] text-s font-light">
              CENTRAL
            </h2>
            <h2 className="tracking-[0.35em] text-xs font-light">
              HOTEL
            </h2>
            </div>
            <p className="text-[10px] text-white/80 mt-3 leading-relaxed">
              KP Rd, Chandanwari,<br />
              Pahalgam,<br />
              Jammu and Kashmir 192126
            </p>
          </div>

          {/* CENTER */}
          <div className="text-xs space-y-3 text-white/90">
            <p>About Us</p>
            <p>Contact</p>
            <p>Terms & Conditions</p>
          </div>

          {/* RIGHT */}
          <div>
            <p className="text-xs mb-3">
              Subscribe to our newsletter
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="px-3 py-2 text-xs w-44 bg-white/20 placeholder-white/70 outline-none"
              />
              <button className="bg-cyan-800 px-4 text-xs hover:bg-cyan-900 transition">
                OK
              </button>
            </div>
          </div>

        </div>

      </div>

    </footer>
  );
}