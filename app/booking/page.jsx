"use client";

export default function BookingPage() {
  return (
    <main className="px-6 md:px-[80px] lg:px-[140px] py-16">
      
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-10">
        Book Your Stay
      </h1>

      {/* Form */}
      <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 border border-gray-200">

        {/* Room Name (static for now) */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Room Type
          </label>
          <input
            type="text"
            value="Market Facing"
            disabled
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Check-in
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Check-out
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

        </div>

        {/* Guests */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Guests
          </label>
          <input
            type="number"
            min="1"
            placeholder="Enter number of guests"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        {/* Button */}
        <button className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600 transition">
          Confirm Booking
        </button>

      </div>

    </main>
  );
}