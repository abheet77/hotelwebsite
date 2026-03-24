"use client";
import { useRouter } from "next/navigation";
export default function RoomCard(props) {
    const { title, image, capacity, price } = props;
    const router = useRouter();
    
    return (
        <div className="w-3/4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition duration-300">

            {/* Image */}
            <img src={image} alt={title} className="w-full aspect-[16/9] object-cover" />

            {/* Title */}
            <div className="bg-teal-500 text-white text-center py-3 font-semibold tracking-wide text-lg">
                {title}
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-center px-6 py-4 text-sm bg-gray-50">

                <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl font-light">+</span>
                    <span className="tracking-wide">MAX CAP: {capacity}</span>
                </div>

                <button onClick={() => router.push(`/booking?room=${encodeURIComponent(title)}&price=${price}`)} className="bg-teal-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-teal-600 transition">
                    Rs {price} / night
                </button>
                

            </div>

        </div>
    );
}