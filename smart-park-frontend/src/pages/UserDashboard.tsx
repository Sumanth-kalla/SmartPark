import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [activeSession, setActiveSession] = useState<any>(null);
    const [completedSession, setCompletedSession] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const billingRef = useRef<HTMLDivElement | null>(null);

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
    // Fetch Session (Polling)
    // ==============================
    const fetchActiveSession = async () => {
        try {
            const res = await fetch(`${API}/api/sessions/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && data.session) {
                if (data.session.status === "completed") {
                    setActiveSession(null);
                    setCompletedSession(data.session);
                } else {
                    setCompletedSession(null);
                    setActiveSession(data.session);
                }
            } else {
                setActiveSession(null);
                setCompletedSession(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ==============================
    // Book Slot
    // ==============================
    const bookSlot = async () => {
        if (!selectedSlot) {
            setMessage("⚠ Please select a slot before booking.");
            return;
        }

        if (activeSession) {
            setMessage("⚠ You already have an active session.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${API}/api/sessions/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ slotId: selectedSlot }),
            });

            const data = await res.json();

            if (data.success) {
                setActiveSession(data.session);
                setSelectedSlot("");
                fetchSlots();
                setMessage("✅ Slot booked successfully!");
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    // ==============================
    // Initial Load + Polling
    // ==============================
    useEffect(() => {
        fetchSlots();
        fetchActiveSession();

        const interval = setInterval(() => {
            fetchActiveSession();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Auto clear message
    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => setMessage(""), 4000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    // Smooth scroll to billing
    useEffect(() => {
        if (completedSession && billingRef.current) {
            billingRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [completedSession]);

    const calculateDuration = (entry: string, exit: string) => {
        const diff = new Date(exit).getTime() - new Date(entry).getTime();
        return Math.ceil(diff / (1000 * 60 * 60));
    };

    return (
        <div className="min-h-screen bg-[#050b18] text-white relative overflow-hidden">

            {/* HEADER */}
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

            {/* MAIN CONTENT */}
            <div className="px-6 pb-16 flex justify-center">
                <div className="w-full max-w-4xl">

                    {message && (
                        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            {message}
                        </div>
                    )}

                    {/* ACTIVE SESSION */}
                    {activeSession && (
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl mb-10 border border-white/10 shadow-2xl">

                            <h2 className="text-xl font-semibold mb-4">
                                Your Active Parking Session
                            </h2>

                            <div className="mb-4 text-gray-300">
                                <p>Slot: {activeSession.slot?.slotCode}</p>
                                <p>Status: {activeSession.status}</p>
                            </div>

                            {activeSession.status === "active" && (
                                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                                    🚗 Your vehicle is now safely parked.
                                </div>
                            )}

                            {(activeSession.status === "booked" ||
                                activeSession.status === "active") && (
                                    <>
                                        <div className="bg-white p-4 rounded-xl inline-block shadow-xl">
                                            <QRCodeCanvas
                                                value={activeSession._id}
                                                size={220}
                                            />
                                        </div>
                                        <p className="mt-4 text-sm text-gray-400">
                                            QR valid while session is active.
                                        </p>
                                    </>
                                )}
                        </div>
                    )}

                    {/* BILLING SECTION */}
                    {completedSession && (
                        <div
                            ref={billingRef}
                            className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl mb-10 border border-white/10 shadow-2xl"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                                Parking Summary
                            </h2>

                            <p>Slot: {completedSession.slot?.slotCode}</p>
                            <p>Entry: {new Date(completedSession.entryTime).toLocaleString()}</p>
                            <p>Exit: {new Date(completedSession.exitTime).toLocaleString()}</p>
                            <p>
                                Duration: {calculateDuration(
                                    completedSession.entryTime,
                                    completedSession.exitTime
                                )} hour(s)
                            </p>
                            <p className="mt-2 font-bold">
                                Total Paid: ₹{completedSession.totalAmount}
                            </p>

                            {!reviewSubmitted && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Rate Your Experience
                                    </h3>

                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="text-2xl"
                                            >
                                                <span
                                                    className={
                                                        (hoverRating || rating) >= star
                                                            ? "text-yellow-400"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Write your feedback (optional)..."
                                        className="w-full p-3 rounded-xl bg-[#1a2332] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        rows={3}
                                    />

                                    <button
                                        disabled={!rating}
                                        onClick={() => {
                                            setReviewSubmitted(true);
                                            setMessage("🎉 Thank you for your feedback!");
                                        }}
                                        className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold disabled:opacity-50"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            )}

                            {reviewSubmitted && (
                                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                                    Thank you for rating us ⭐ {rating}/5
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setCompletedSession(null);
                                    setRating(0);
                                    setReviewComment("");
                                    setReviewSubmitted(false);
                                }}
                                className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold"
                            >
                                Book Again
                            </button>
                        </div>
                    )}

                    {/* BOOKING SECTION */}
                    {!activeSession && !completedSession && (
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">

                            <h2 className="text-xl font-semibold mb-4">
                                Book Parking Slot
                            </h2>

                            <select
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                disabled={loading}
                                className="w-full p-3 rounded-xl bg-[#1a2332] text-white border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                            >
                                <option value="">Select Available Slot</option>
                                {slots
                                    .filter((slot) => !slot.isOccupied)
                                    .map((slot) => (
                                        <option key={slot._id} value={slot._id}>
                                            {slot.slotCode} — ₹{slot.hourlyRate}/hr
                                        </option>
                                    ))}
                            </select>

                            <button
                                onClick={bookSlot}
                                disabled={loading}
                                className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Book Slot"}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* PROFILE SIDEBAR (UNCHANGED) */}
            <div
                className={`fixed top-0 right-0 h-full w-[420px] bg-[#0b1325] border-l border-white/10 transform transition-transform duration-300 ${showProfile ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-8 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Profile</h2>
                        <button
                            onClick={() => setShowProfile(false)}
                            className="text-gray-400 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg p-5 rounded-2xl border border-white/10 mb-6">
                        <p className="text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="mt-2 text-xs bg-yellow-500/20 text-yellow-400 inline-block px-3 py-1 rounded-full">
                            {user.role?.toUpperCase()}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="w-full bg-red-500/80 hover:bg-red-500 py-2 rounded-xl font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;