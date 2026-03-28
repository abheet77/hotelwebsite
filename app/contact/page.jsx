"use client";
import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        ```
if (!name || !email || !message) {
  setError("All fields are required");
  return;
}

setError("");
alert("Message sent successfully!");
```

    };

    return (<main className="bg-white px-6 md:px-[80px] lg:px-[140px] py-16">

        ```
        {/* 🔥 HERO SECTION */}
        <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
                Contact Us
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Experience comfort and luxury at Central Hotel, Pahalgam.
                Reach out for bookings, queries, or personalized assistance.
            </p>
        </div>

        {/* 🔥 MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* LEFT: MAP + INFO */}
            <div className="space-y-8">

                {/* MAP */}
                <div className="rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps?q=Central+Hotel+Pahalgam&output=embed"
                        className="w-full h-[350px]"
                        loading="lazy"
                    ></iframe>
                </div>

                {/* INFO CARD */}
                <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 space-y-6">

                    <div className="flex items-start gap-4">
                        <FaMapMarkerAlt className="text-teal-500 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Address</h3>
                            <p className="text-gray-600">
                                Central Hotel, Pahalgam, Jammu & Kashmir
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <FaPhoneAlt className="text-teal-500 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Phone</h3>
                            <p className="text-gray-600">+91 98765 43210</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <FaEnvelope className="text-teal-500 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Email</h3>
                            <p className="text-gray-600">contact@centralhotel.com</p>
                        </div>
                    </div>

                    {/* CTA BUTTON */}
                    <a
                        href="https://maps.app.goo.gl/JzETTTVmwsjBPREMA"
                        target="_blank"
                        className="inline-block mt-4 bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
                    >
                        Get Directions →
                    </a>

                </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="bg-gray-50 shadow-xl rounded-xl p-10 border border-gray-200">

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Send a Message
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border text-gray-600 border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border text-gray-600 border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                    />

                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border text-gray-600 border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                    ></textarea>

                    <button className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600 transition">
                        Send Message
                    </button>

                </form>
            </div>

        </div>

    </main>

    );
}
