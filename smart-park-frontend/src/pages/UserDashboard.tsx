import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [activeSession, setActiveSession] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ==============================
    // Fetch Slots
    // ==============================
    const fetchSlots = async () => {
        try {
            const res = await fetch(`${API}/api/slots`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSlots(data.slots || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ==============================
    // Fetch Active Session
    // ==============================
    const fetchActiveSession = async () => {
        try {
            const res = await fetch(`${API}/api/sessions/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.session) {
                setActiveSession(data.session);
            } else {
                setActiveSession(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ==============================
    // Book Slot
    // ==============================
    const bookSlot = async () => {
        if (!selectedSlot) return;

        setMessage("");

        try {
            const res = await fetch(`${API}/api/sessions/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    slotId: selectedSlot,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("Slot booked successfully!");
                setActiveSession(data.session);
                fetchSlots();
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSlots();
        fetchActiveSession();
    }, []);

    // ==============================
    // Derived Analytics
    // ==============================
    const totalBookings = 12; // Replace with real API
    const totalSpent = 2450; // Replace with real API
    const totalHours = 34; // Replace with real API

    return (
        <div className="min-h-screen bg-[#050b18] text-white relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center p-8">
                <h1 className="text-3xl font-bold">
                    Welcome, {user.name}
                </h1>

                <button
                    onClick={() => setShowProfile(true)}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 px-5 py-2 rounded-xl hover:bg-white/20 transition"
                >
                    Profile
                </button>
            </div>

            <div className="px-8 pb-12">

                {message && (
                    <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        {message}
                    </div>
                )}

                {/* Active Session */}
                {activeSession ? (
                    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl mb-10 border border-white/10">
                        <h2 className="text-xl font-semibold mb-4">
                            Your Active Parking Session
                        </h2>

                        <div className="mb-4 space-y-1 text-gray-300">
                            <p>Slot: {activeSession.slot?.slotCode}</p>
                            <p>Status: {activeSession.status}</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl inline-block">
                            <QRCodeCanvas value={activeSession._id} size={220} />
                        </div>

                        <p className="mt-4 text-sm text-gray-400">
                            Show this QR at the entry gate.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Booking Section */}
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl mb-10 border border-white/10 space-y-4">
                            <h2 className="text-xl font-semibold">
                                Book Parking Slot
                            </h2>

                            <select
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                className="w-full p-3 rounded-xl bg-[#1a2332] text-white border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            >
                                <option value="" className="bg-[#1a2332] text-white">
                                    Select Available Slot
                                </option>
                                {slots
                                    .filter((slot) => !slot.isOccupied)
                                    .map((slot) => (
                                        <option
                                            key={slot._id}
                                            value={slot._id}
                                            className="bg-[#1a2332] text-white"
                                        >
                                            {slot.slotCode} — ₹{slot.hourlyRate}/hr
                                        </option>
                                    ))}
                            </select>

                            <button
                                onClick={bookSlot}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold transition shadow-lg"
                            >
                                Book Slot
                            </button>
                        </div>

                        {/* Slot Overview */}
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl mb-4">Live Slot Status</h2>
                            {slots.map((slot) => (
                                <div
                                    key={slot._id}
                                    className="flex justify-between border-b border-white/10 py-2"
                                >
                                    <span>{slot.slotCode}</span>
                                    <span>
                                        {slot.isOccupied ? (
                                            <span className="text-red-400">
                                                Occupied
                                            </span>
                                        ) : (
                                            <span className="text-green-400">
                                                Available
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ==============================
                PROFILE SIDEBAR
            ============================== */}

            <div
                className={`fixed top-0 right-0 h-full w-[420px] bg-[#0b1325] border-l border-white/10 transform transition-transform duration-300 ${showProfile ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-8 h-full overflow-y-auto">

                    {/* Close Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Profile</h2>
                        <button
                            onClick={() => setShowProfile(false)}
                            className="text-gray-400 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Profile Overview */}
                    <div className="bg-white/5 backdrop-blur-lg p-5 rounded-2xl border border-white/10 mb-6">
                        <p className="text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="mt-2 text-xs bg-yellow-500/20 text-yellow-400 inline-block px-3 py-1 rounded-full">
                            {user.role?.toUpperCase()}
                        </p>
                    </div>

                    {/* Analytics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-sm text-gray-400">Bookings</p>
                            <p className="text-xl font-bold">{totalBookings}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-sm text-gray-400">Total Spent</p>
                            <p className="text-xl font-bold">₹{totalSpent}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-sm text-gray-400">Hours</p>
                            <p className="text-xl font-bold">{totalHours}h</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-sm text-gray-400">Active</p>
                            <p className="text-xl font-bold">
                                {activeSession ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>

                    {/* Booking History Placeholder */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6">
                        <h3 className="font-semibold mb-3">Booking History</h3>
                        <p className="text-sm text-gray-400">
                            History integration ready. Connect to
                            /api/sessions/history for full records.
                        </p>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h3 className="font-semibold mb-3">Account Settings</h3>
                        <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl font-semibold transition mb-3">
                            Change Password
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                            className="w-full bg-red-500/80 hover:bg-red-500 py-2 rounded-xl font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboard;