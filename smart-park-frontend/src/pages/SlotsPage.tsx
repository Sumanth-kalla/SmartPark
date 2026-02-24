const mockSlots = [
    { id: "A1", status: "Available" },
    { id: "A2", status: "Occupied" },
    { id: "B1", status: "Available" },
];

const SlotsPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Parking Slots</h2>

            <div className="grid grid-cols-3 gap-6">
                {mockSlots.map((slot) => (
                    <div
                        key={slot.id}
                        className="border p-6 rounded-xl shadow-sm flex flex-col justify-between"
                    >
                        <h3 className="text-lg font-semibold">{slot.id}</h3>

                        <span
                            className={`mt-2 text-sm font-medium ${slot.status === "Available"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {slot.status}
                        </span>

                        <button className="mt-4 bg-black text-white py-2 rounded-lg text-sm">
                            Book
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SlotsPage;