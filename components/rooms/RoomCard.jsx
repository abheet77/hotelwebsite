export default function RoomCard(props) {
    const { title, image, capacity } = props;

    return (
        <div className="rounded-lg border overflow-hidden bg-white shadow-sm w-full">

            {/* Image */}
            <img src={image} alt={title} className="w-full aspect-[16/9] object-cover" />

            {/* Title */}
            <div className="bg-teal-500 text-white text-center py-2 font-semibold text-sm">
                {title}
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-center px-5 py-4 text-sm bg-gray-50">
                <span>MAX CAP: {capacity}</span>

                <button className="bg-teal-500 text-white px-3 py-1 rounded text-xs hover:bg-teal-600 transition">
                    Know more
                </button>
            </div>

        </div>
    );
}