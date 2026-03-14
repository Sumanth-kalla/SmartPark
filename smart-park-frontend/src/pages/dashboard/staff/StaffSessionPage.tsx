import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const StaffSessionPage = () => {

    const [slots, setSlots] = useState<any[]>([]);
    const [scannedSessionId, setScannedSessionId] = useState("");
    const [message, setMessage] = useState("");
    const [scannerActive, setScannerActive] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [processing, setProcessing] = useState(false);

    const token = localStorage.getItem("token");
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // Fetch Slots
    const fetchSlots = async () => {
        try {
            const res = await fetch(`${API}/api/slots`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setSlots(data.slots || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Start Scanner
    const startScanner = () => {
        setCameraError("");
        setScannerActive(true);
    };

    // Stop Scanner
    const stopScanner = async () => {
        try {
            if (scannerRef.current) {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                scannerRef.current = null;
            }
        } catch { }

        setScannerActive(false);
    };

    // Initialize QR Scanner
    useEffect(() => {
        if (!scannerActive) return;

        const initScanner = async () => {
            try {

                const scanner = new Html5Qrcode("reader");
                scannerRef.current = scanner;

                const cameras = await Html5Qrcode.getCameras();

                if (!cameras || cameras.length === 0)
                    throw new Error("No camera found");

                const backCamera =
                    cameras.find(c => c.label.toLowerCase().includes("back")) ||
                    cameras[0];

                await scanner.start(
                    backCamera.id,
                    {
                        fps: 10,
                        qrbox: { width: 280, height: 280 }
                    },
                    decodedText => {
                        setScannedSessionId(decodedText);
                        stopScanner();
                    },
                    () => { }
                );

            } catch (err) {
                console.error(err);
                setCameraError("Camera permission denied or unavailable.");
                setScannerActive(false);
            }
        };

        initScanner();

        return () => stopScanner();

    }, [scannerActive]);

    // Activate Entry
    const activateSession = async () => {

        if (!scannedSessionId) {
            setMessage("⚠ Scan QR first.");
            return;
        }

        setProcessing(true);

        try {

            const res = await fetch(`${API}/api/sessions/activate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId: scannedSessionId })
            });

            const data = await res.json();

            setMessage(
                data.success
                    ? "✅ Entry Activated Successfully"
                    : data.message
            );

            fetchSlots();

        } catch (err) {
            console.error(err);
        }

        setProcessing(false);
    };

    // Exit Parking
    const endSession = async () => {

        if (!scannedSessionId) {
            setMessage("⚠ Scan QR first.");
            return;
        }

        setProcessing(true);

        try {

            const res = await fetch(`${API}/api/sessions/end`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId: scannedSessionId })
            });

            const data = await res.json();

            setMessage(
                data.success
                    ? `✅ Exit Processed | Bill ₹${data.totalAmount}`
                    : data.message
            );

            fetchSlots();

        } catch (err) {
            console.error(err);
        }

        setProcessing(false);
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const available = slots.filter(s => !s.isOccupied && !s.isReserved).length;
    const reserved = slots.filter(s => s.isReserved).length;
    const occupied = slots.filter(s => s.isOccupied).length;

    return (

        <div className="min-h-screen bg-[#050b18] text-white">

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-8"
                >
                    Staff Parking Gate Control
                </motion.h1>

                {/* Alerts */}
                {message && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        {message}
                    </div>
                )}

                {cameraError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                        {cameraError}
                    </div>
                )}

                {/* Parking Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    <div className="bg-green-500/20 p-5 rounded-xl text-center">
                        <p className="text-2xl font-bold">{available}</p>
                        <p className="text-sm">Available</p>
                    </div>

                    <div className="bg-yellow-500/20 p-5 rounded-xl text-center">
                        <p className="text-2xl font-bold">{reserved}</p>
                        <p className="text-sm">Reserved</p>
                    </div>

                    <div className="bg-red-500/20 p-5 rounded-xl text-center">
                        <p className="text-2xl font-bold">{occupied}</p>
                        <p className="text-sm">Occupied</p>
                    </div>

                </div>

                {/* QR Scanner Panel */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-2xl mb-8"
                >

                    <h2 className="text-xl font-semibold mb-4">
                        QR Entry Scanner
                    </h2>

                    <div className="flex flex-wrap gap-4 mb-4">

                        <button
                            onClick={scannerActive ? stopScanner : startScanner}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold"
                        >
                            {scannerActive ? "Stop Scanner" : "Scan User QR"}
                        </button>

                        <button
                            onClick={activateSession}
                            disabled={processing}
                            className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold"
                        >
                            Activate Entry
                        </button>

                        <button
                            onClick={endSession}
                            disabled={processing}
                            className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold"
                        >
                            Process Exit
                        </button>

                    </div>

                    {scannerActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-black p-4 rounded-xl"
                        >
                            <div id="reader"></div>
                        </motion.div>
                    )}

                    {scannedSessionId && (
                        <p className="mt-3 text-sm text-gray-400">
                            Session ID: {scannedSessionId}
                        </p>
                    )}

                </motion.div>

                {/* Slot Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
                >

                    {slots.map(slot => (

                        <motion.div
                            key={slot._id}
                            whileHover={{ scale: 1.05 }}
                            className={`p-6 rounded-xl text-center border transition
                                ${slot.isOccupied
                                    ? "bg-red-500/20 border-red-500 text-red-400"
                                    : slot.isReserved
                                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                                        : "bg-green-500/20 border-green-500 text-green-400"
                                }
                            `}
                        >

                            <p className="text-xl font-bold">
                                {slot.slotCode}
                            </p>

                            <p className="text-sm mt-1">
                                {slot.isOccupied
                                    ? "Occupied"
                                    : slot.isReserved
                                        ? "Reserved"
                                        : "Available"}
                            </p>

                        </motion.div>

                    ))}

                </motion.div>

            </div>

        </div>

    );
};

export default StaffSessionPage;