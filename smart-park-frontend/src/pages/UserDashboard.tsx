import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import socket from "../utils/socket";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const UserDashboard = () => {

    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState("");

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [estimatedCost, setEstimatedCost] = useState(0);

    const [activeSession, setActiveSession] = useState<any>(null);
    const [completedSession, setCompletedSession] = useState<any>(null);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    const billingRef = useRef<HTMLDivElement | null>(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");


    /* ---------------- FETCH SLOTS ---------------- */

    const fetchSlots = async () => {

        try {

            const res = await fetch(`${API}/api/slots`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setSlots(data.slots || []);

        } catch (err) { console.error(err) }

    };


    /* ---------------- FETCH SESSION ---------------- */

    const fetchActiveSession = async () => {

        try {

            const res = await fetch(`${API}/api/sessions/my`, {
                headers: { Authorization: `Bearer ${token}` }
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

        } catch (err) { console.error(err) }

    };


    /* ---------------- SOCKET + POLLING ---------------- */

    useEffect(() => {

        fetchSlots();
        fetchActiveSession();

        const handleUpdate = () => {
            fetchSlots();
            fetchActiveSession();
        };

        socket.on("slotUpdate", handleUpdate);

        const interval = setInterval(() => {
            fetchActiveSession();
        }, 4000);

        return () => {
            socket.off("slotUpdate", handleUpdate);
            clearInterval(interval);
        };

    }, []);


    /* ---------------- LIVE TIMER ---------------- */

    useEffect(() => {

        if (!activeSession?.entryTime) {
            setElapsedTime("00:00:00");
            return;
        }

        const timer = setInterval(() => {

            const start = new Date(activeSession.entryTime).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            const hrs = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            setElapsedTime(
                `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
            );

        }, 1000);

        return () => clearInterval(timer);

    }, [activeSession]);


    /* ---------------- ESTIMATE BILL ---------------- */

    useEffect(() => {

        if (!startTime || !endTime || !selectedSlot) return;

        const slot = slots.find(s => s._id === selectedSlot);

        if (!slot) return;

        const start = new Date(startTime);
        const end = new Date(endTime);

        const diff = end.getTime() - start.getTime();

        if (diff <= 0) return;

        const hours = Math.ceil(diff / (1000 * 60 * 60));

        setEstimatedCost(hours * slot.hourlyRate);

    }, [startTime, endTime, selectedSlot, slots]);


    /* ---------------- BOOK SLOT ---------------- */

    const bookSlot = async () => {

        if (!selectedSlot) {
            setMessage("⚠ Select a slot");
            return;
        }

        if (!startTime || !endTime) {
            setMessage("⚠ Select parking time");
            return;
        }

        setLoading(true);

        try {

            const res = await fetch(`${API}/api/sessions/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    slotId: selectedSlot,
                    startTime,
                    endTime
                })
            });

            const data = await res.json();

            if (data.success) {

                setActiveSession(data.session);
                setSelectedSlot("");
                setStartTime("");
                setEndTime("");
                setEstimatedCost(0);

                fetchSlots();

                setMessage("✅ Slot booked successfully!");

            } else {
                setMessage(data.message);
            }

        } catch (err) { console.error(err) }

        setLoading(false);

    };


    /* ---------------- SLOT STATS ---------------- */

    const available = slots.filter(s => !s.isOccupied && !s.isReserved).length;
    const reserved = slots.filter(s => s.isReserved).length;
    const occupied = slots.filter(s => s.isOccupied).length;


    /* ---------------- RENDER ---------------- */

    return (

        <div className="min-h-screen bg-[#050b18] text-white">

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-3xl font-bold">
                        Welcome, {user.name}
                    </h1>

                    <button
                        onClick={() => setShowProfile(true)}
                        className="bg-white/10 border border-white/20 px-5 py-2 rounded-xl hover:bg-white/20"
                    >
                        Profile
                    </button>

                </div>


                {/* ACTIVE PARKING */}

                {activeSession && (

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-400/20 p-6 rounded-xl mb-8"
                    >

                        <h2 className="font-semibold mb-2">
                            🚗 Active Parking
                        </h2>

                        <p>Slot {activeSession.slot?.slotCode}</p>

                        <p className="text-sm text-gray-400">
                            Started {new Date(activeSession.entryTime).toLocaleTimeString()}
                        </p>

                        <p className="text-green-400 font-bold mt-2">
                            {elapsedTime}
                        </p>

                        <div className="mt-4 bg-white p-4 rounded-xl inline-block">
                            <QRCodeCanvas value={activeSession._id} size={200} />
                        </div>

                    </motion.div>

                )}


                {/* BILLING */}

                {completedSession && (

                    <div
                        ref={billingRef}
                        className="bg-yellow-500/10 border border-yellow-400/20 p-6 rounded-xl mb-8"
                    >

                        <h2 className="font-bold mb-2">
                            Parking Summary
                        </h2>

                        <p>Slot {completedSession.slot?.slotCode}</p>

                        <p>
                            Entry {new Date(completedSession.entryTime).toLocaleString()}
                        </p>

                        <p>
                            Exit {new Date(completedSession.exitTime).toLocaleString()}
                        </p>

                        <p className="mt-2 font-bold">
                            Total Paid ₹{completedSession.totalAmount}
                        </p>


                        {/* REVIEW */}

                        {!reviewSubmitted && (

                            <div className="mt-6">

                                <p className="mb-2">Rate your experience</p>

                                <div className="flex gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-500"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Write review"
                                    className="w-full p-3 rounded-xl bg-[#1a2332]"
                                />

                                <button
                                    onClick={() => setReviewSubmitted(true)}
                                    className="mt-3 bg-yellow-500 px-6 py-2 rounded-xl text-black font-bold"
                                >
                                    Submit Review
                                </button>

                            </div>

                        )}

                    </div>

                )}


                {/* SLOT STATS */}

                <div className="grid grid-cols-3 gap-4 mb-8">

                    <div className="bg-green-500/20 p-4 rounded-xl text-center">
                        <p className="text-xl font-bold">{available}</p>
                        <p className="text-xs">Available</p>
                    </div>

                    <div className="bg-yellow-500/20 p-4 rounded-xl text-center">
                        <p className="text-xl font-bold">{reserved}</p>
                        <p className="text-xs">Reserved</p>
                    </div>

                    <div className="bg-red-500/20 p-4 rounded-xl text-center">
                        <p className="text-xl font-bold">{occupied}</p>
                        <p className="text-xs">Occupied</p>
                    </div>

                </div>


                {/* BOOK SLOT */}

                {!activeSession && !completedSession && (

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">

                        <h2 className="text-xl font-semibold mb-6">
                            Choose Parking Slot
                        </h2>

                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#1a2332]"
                        >

                            <option value="">Select Slot</option>

                            {slots
                                .filter(s => !s.isOccupied && !s.isReserved)
                                .map(slot => (
                                    <option key={slot._id} value={slot._id}>
                                        {slot.slotCode} — ₹{slot.hourlyRate}/hr
                                    </option>
                                ))}

                        </select>


                        {/* TIME SELECT */}

                        <div className="grid grid-cols-2 gap-4 mt-4">

                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="p-3 rounded-xl bg-[#1a2332]"
                            />

                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="p-3 rounded-xl bg-[#1a2332]"
                            />

                        </div>


                        {/* COST ESTIMATE */}

                        {estimatedCost > 0 && (

                            <div className="mt-4 p-4 bg-green-500/10 border border-green-400/20 rounded-xl">

                                <p>
                                    Estimated Cost
                                </p>

                                <p className="text-xl font-bold text-green-400">
                                    ₹{estimatedCost}
                                </p>

                            </div>

                        )}


                        <button
                            onClick={bookSlot}
                            disabled={loading || !selectedSlot}
                            className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-xl font-bold"
                        >
                            {loading ? "Processing..." : "Confirm Booking"}
                        </button>

                    </div>

                )}

            </div>


            {/* PROFILE SIDEBAR */}

            <div className={`fixed top-0 right-0 h-full w-[420px] bg-[#0b1325] border-l border-white/10 transform transition-transform duration-300
${showProfile ? "translate-x-0" : "translate-x-full"}`}>

                <div className="p-8">

                    <h2 className="text-xl font-bold mb-4">
                        Profile
                    </h2>

                    <p>{user.name}</p>
                    <p className="text-gray-400">{user.email}</p>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="mt-6 bg-red-500 px-4 py-2 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

};

export default UserDashboard;