export default function Features() {
  return (
    <div className="bg-white text-black py-16 px-6 md:px-16">

      {/* Top Text */}
      <p className="text-center text-gray-600 mb-12">
        All our room types have option of complementary breakfast
      </p>

      {/* Section 1 */}
      <div className="grid md:grid-cols-2 gap-10 items-center pb-35">

        {/* Left Text */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            COMFORT AND QUALITY YOU CAN AFFORD.
          </h2>

          <p className="text-gray-600 mb-4">
            Our rooms are designed to transport you into an environment made for leisure.
            Take your mind off the day-to-day of home life and find a private paradise for yourself.
          </p>

          <button className="bg-teal-500 text-white px-4 py-2 rounded">
            EXPLORE
          </button>
        </div>

        {/* Right Image */}
        <img src="/room2.png" alt="room" className="w-full h-[300px] object-cover rounded-xl"
/>

      </div>

      {/* Section 2 */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Image */}
        <img src="/room1.png" alt="woods" className="w-full h-[300px] object-cover rounded-xl" />

        {/* Right Text */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            EMBRACE THE WOODS
          </h2>

          <p className="text-gray-600 mb-4">
            We love life in the mountains. Surrounded by towering peaks and crisp air,
            each moment brings peace and adventure.
          </p>

          <button className="bg-teal-500 text-white px-4 py-2 rounded">
            EXPLORE
          </button>
        </div>

      </div>
      {/* Fun Fact Section */}
<div className="mt-20 text-center max-w-2xl mx-auto">

  <h2 className="text-xl md:text-2xl tracking-[0.3em] text-gray-700 mb-6">
    FUN FACT
  </h2>

  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
    "The name Pahalgam is a combination of two Kashmiri words:
    'Pahal' (meaning shepherd) and 'Gaam' (meaning village)."
  </p>

</div>

    </div>
  );
}