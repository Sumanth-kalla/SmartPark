import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API = import.meta.env.VITE_API_URL;

const AdminSlotsPage = () => {
    const [slots, setSlots] = useState<any[]>([]);
    const [slotCode, setSlotCode] = useState("");
    const [floor, setFloor] = useState(1);
    const [hourlyRate, setHourlyRate] = useState(50);
    const [stats, setStats] = useState<any>(null);

    const token = localStorage.getItem("token");

    const fetchSlots = async () => {
        const res = await fetch(`${API}/api/slots`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setSlots(data.slots || []);
    };

    const fetchStats = async () => {
        const res = await fetch(`${API}/api/slots/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setStats(data);
    };

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`${API}/api/slots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                slotCode,
                floor,
                hourlyRate,
            }),
        });

        setSlotCode("");
        fetchSlots();
        fetchStats();
    };

    useEffect(() => {
        fetchSlots();
        fetchStats();
    }, []);

    return (
        <div className="p-8 text-white bg-[#050b18] min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Slot Management</h1>

            {stats && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <p>Total Slots</p>
                        <h2 className="text-xl font-bold">{stats.total}</h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <p>Occupied</p>
                        <h2 className="text-xl font-bold text-red-400">
                            {stats.occupied}
                        </h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <p>Available</p>
                        <h2 className="text-xl font-bold text-green-400">
                            {stats.available}
                        </h2>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleCreateSlot}
                className="bg-white/5 p-6 rounded-lg mb-8 space-y-4"
            >
                <h2 className="text-xl font-semibold">Create Slot</h2>

                <input
                    type="text"
                    placeholder="Slot Code (A1)"
                    value={slotCode}
                    onChange={(e) => setSlotCode(e.target.value)}
                    required
                    className="w-full p-3 rounded bg-white/10"
                />

                <input
                    type="number"
                    placeholder="Floor"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded bg-white/10"
                />

                <input
                    type="number"
                    placeholder="Hourly Rate"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded bg-white/10"
                />

                <button className="bg-yellow-500 text-black px-6 py-2 rounded font-bold">
                    Create Slot
                </button>
            </form>

            <div className="bg-white/5 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">All Slots</h2>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-2">Slot</th>
                            <th className="p-2">Floor</th>
                            <th className="p-2">Rate</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((slot) => (
                            <tr key={slot._id} className="border-b border-white/5">
                                <td className="p-2">{slot.slotCode}</td>
                                <td className="p-2">{slot.floor}</td>
                                <td className="p-2">₹{slot.hourlyRate}</td>
                                <td className="p-2">
                                    {slot.isOccupied ? (
                                        <span className="text-red-400">Occupied</span>
                                    ) : (
                                        <span className="text-green-400">Available</span>
                                    )}
                                </td>
                                <td className="p-2">
                                    <QRCodeCanvas value={slot._id} size={120} level="H" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSlotsPage;