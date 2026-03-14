import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const AdminSlotsPage = () => {

    const [slots, setSlots] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);

    const [slotCode, setSlotCode] = useState("");
    const [floor, setFloor] = useState(1);
    const [hourlyRate, setHourlyRate] = useState(50);
    const [location, setLocation] = useState("");

    const [stats, setStats] = useState<any>(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");


    /* FETCH LOCATIONS */

    const fetchLocations = async () => {

        const res = await fetch(`${API}/api/locations`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setLocations(data.locations || []);

    };


    /* FETCH SLOTS */

    const fetchSlots = async () => {

        const res = await fetch(`${API}/api/slots`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setSlots(data.slots || []);

    };


    /* FETCH STATS */

    const fetchStats = async () => {

        const res = await fetch(`${API}/api/slots/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setStats(data);

    };


    /* CREATE SLOT */

    const handleCreateSlot = async (e: React.FormEvent) => {

        e.preventDefault();

        const res = await fetch(`${API}/api/slots`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                slotCode,
                floor,
                hourlyRate,
                location
            })

        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message || "Slot creation failed");
            return;
        }

        setMessage("Slot created successfully");

        setSlotCode("");
        setFloor(1);
        setHourlyRate(50);
        setLocation("");

        fetchSlots();
        fetchStats();

    };


    /* INITIAL LOAD */

    useEffect(() => {

        fetchSlots();
        fetchStats();
        fetchLocations();

    }, []);


    return (

        <div className="min-h-screen bg-[#050b18] text-white p-8">

            {/* HEADER */}

            <div className="mb-10">

                <h1 className="text-3xl font-bold mb-2">
                    Parking Infrastructure Control
                </h1>

                <p className="text-gray-400">
                    Manage parking slots, pricing and locations
                </p>

            </div>


            {message && (

                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    {message}
                </div>

            )}


            {/* STATS */}

            {stats && (

                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-yellow-500/30 transition"
                    >

                        <p className="text-gray-400 text-sm">
                            Total Slots
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {stats.total}
                        </h2>

                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl"
                    >

                        <p className="text-gray-300 text-sm">
                            Occupied
                        </p>

                        <h2 className="text-3xl font-bold text-red-400 mt-2">
                            {stats.occupied}
                        </h2>

                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl"
                    >

                        <p className="text-gray-300 text-sm">
                            Available
                        </p>

                        <h2 className="text-3xl font-bold text-green-400 mt-2">
                            {stats.available}
                        </h2>

                    </motion.div>

                </div>

            )}


            {/* CREATE SLOT */}

            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleCreateSlot}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-12"
            >

                <h2 className="text-xl font-semibold mb-6">
                    Create Parking Slot
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="text-sm text-gray-400">
                            Slot Code
                        </label>

                        <input
                            type="text"
                            placeholder="A1"
                            value={slotCode}
                            onChange={(e) => setSlotCode(e.target.value)}
                            required
                            className="w-full mt-2 p-3 rounded-lg bg-white/10"
                        />

                    </div>


                    <div>

                        <label className="text-sm text-gray-400">
                            Floor
                        </label>

                        <input
                            type="number"
                            value={floor}
                            onChange={(e) => setFloor(Number(e.target.value))}
                            required
                            className="w-full mt-2 p-3 rounded-lg bg-white/10"
                        />

                    </div>


                    <div>

                        <label className="text-sm text-gray-400">
                            Hourly Rate
                        </label>

                        <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            required
                            className="w-full mt-2 p-3 rounded-lg bg-white/10"
                        />

                    </div>


                    <div>

                        <label className="text-sm text-gray-400">
                            Location
                        </label>

                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="w-full mt-2 p-3 rounded-lg bg-white/10"
                        >

                            <option value="">
                                Select Location
                            </option>

                            {locations.map((loc) => (
                                <option key={loc._id} value={loc._id}>
                                    {loc.name} - {loc.city}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>


                <button className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400">
                    Create Slot
                </button>

            </motion.form>


            {/* SLOT TABLE */}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

                <h2 className="text-xl font-semibold mb-6">
                    All Parking Slots
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="text-gray-400 text-sm border-b border-white/10">

                                <th className="p-3 text-left">Slot</th>
                                <th className="p-3 text-left">Floor</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Rate</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">QR</th>

                            </tr>

                        </thead>


                        <tbody>

                            {slots.map((slot) => (
                                <tr
                                    key={slot._id}
                                    className="border-b border-white/5 hover:bg-white/5 transition"
                                >

                                    <td className="p-3 font-semibold">
                                        {slot.slotCode}
                                    </td>

                                    <td className="p-3">
                                        {slot.floor}
                                    </td>

                                    <td className="p-3">
                                        {slot.location?.name}
                                    </td>

                                    <td className="p-3">
                                        ₹{slot.hourlyRate}
                                    </td>

                                    <td className="p-3">

                                        {slot.isOccupied ? (

                                            <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                                                Occupied
                                            </span>

                                        ) : (

                                            <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                                                Available
                                            </span>

                                        )}

                                    </td>


                                    <td className="p-3">

                                        <div className="bg-white p-2 rounded-lg inline-block">
                                            <QRCodeCanvas value={slot._id} size={90} />
                                        </div>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default AdminSlotsPage;