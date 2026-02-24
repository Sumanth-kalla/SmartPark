const mockBookings = [
    { id: 1, slot: "A1", status: "Active" },
    { id: 2, slot: "B2", status: "Completed" },
];

const BookingsPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Bookings</h2>

            <div className="space-y-4">
                {mockBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="border p-4 rounded-lg flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium">Slot: {booking.slot}</p>
                        </div>

                        <span
                            className={`text-sm font-medium ${booking.status === "Active"
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                        >
                            {booking.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsPage;