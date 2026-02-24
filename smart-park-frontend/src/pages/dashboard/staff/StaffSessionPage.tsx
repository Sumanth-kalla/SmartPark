import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const API = import.meta.env.VITE_API_URL;

const StaffSessionPage = () => {
    const [slots, setSlots] = useState<any[]>([]);
    const [scannedSessionId, setScannedSessionId] = useState("");
    const [message, setMessage] = useState("");
    const [scannerActive, setScannerActive] = useState(false);
    const [cameraError, setCameraError] = useState("");

    const token = localStorage.getItem("token");
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // ---------------------------
    // Fetch Slots
    // ---------------------------
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

    // ---------------------------
    // Start Scanner
    // ---------------------------
    const startScanner = () => {
        setCameraError("");
        setScannerActive(true);
    };

    // ---------------------------
    // Stop Scanner
    // ---------------------------
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

    // ---------------------------
    // Scanner Initialization (STABLE VERSION)
    // ---------------------------
    useEffect(() => {
        if (!scannerActive) return;

        const initScanner = async () => {
            try {
                const scanner = new Html5Qrcode("reader");
                scannerRef.current = scanner;

                // Get available cameras safely
                const cameras = await Html5Qrcode.getCameras();

                if (!cameras || cameras.length === 0) {
                    throw new Error("No camera found");
                }

                // Prefer back camera if available
                const backCamera =
                    cameras.find(cam =>
                        cam.label.toLowerCase().includes("back")
                    ) || cameras[0];

                await scanner.start(
                    backCamera.id,
                    {
                        fps: 10,
                        qrbox: { width: 280, height: 280 },
                        aspectRatio: 1,
                    },
                    (decodedText) => {
                        setScannedSessionId(decodedText);
                        stopScanner();
                    },
                    () => { }
                );
            } catch (err) {
                console.error(err);
                setCameraError("Camera permission denied or camera not available.");
                setScannerActive(false);
            }
        };

        initScanner();

        return () => {
            if (!scannerRef.current) return;

            scannerRef.current.stop().catch(() => { });
            try {
                scannerRef.current.clear();
            } catch { }

            scannerRef.current = null;
        };
    }, [scannerActive]);

    // ---------------------------
    // Activate Session
    // ---------------------------
    const activateSession = async () => {
        if (!scannedSessionId) return;

        const res = await fetch(`${API}/api/sessions/activate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId: scannedSessionId }),
        });

        const data = await res.json();
        setMessage(data.success ? "Session Activated" : data.message);
        fetchSlots();
    };

    // ---------------------------
    // End Session
    // ---------------------------
    const endSession = async () => {
        if (!scannedSessionId) return;

        const res = await fetch(`${API}/api/sessions/end`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId: scannedSessionId }),
        });

        const data = await res.json();

        setMessage(
            data.success
                ? `Bill: ₹${data.totalAmount} (${data.durationHours} hrs)`
                : data.message
        );

        fetchSlots();
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div className="min-h-screen bg-[#050b18] text-white p-8">
            <h1 className="text-3xl font-bold mb-6">
                Staff Parking Gate Control
            </h1>

            {message && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    {message}
                </div>
            )}

            {cameraError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                    {cameraError}
                </div>
            )}

            <div className="bg-white/5 p-6 rounded-lg mb-8 space-y-4">
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={scannerActive ? stopScanner : startScanner}
                        className="bg-blue-500 px-6 py-2 rounded font-bold"
                    >
                        {scannerActive ? "Stop Scanner" : "Scan User QR"}
                    </button>

                    <button
                        onClick={activateSession}
                        className="bg-green-500 px-6 py-2 rounded font-bold"
                    >
                        Activate Entry
                    </button>

                    <button
                        onClick={endSession}
                        className="bg-red-500 px-6 py-2 rounded font-bold"
                    >
                        Process Exit
                    </button>
                </div>

                {scannerActive && (
                    <div className="mt-4 bg-black p-4 rounded-lg">
                        <div id="reader" />
                    </div>
                )}

                {scannedSessionId && (
                    <div className="mt-3 text-sm text-gray-400">
                        Scanned Session ID: {scannedSessionId}
                    </div>
                )}
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
                <h2 className="text-xl mb-4">Live Slot Status</h2>
                {slots.map((slot) => (
                    <div
                        key={slot._id}
                        className="flex justify-between border-b border-white/10 py-2"
                    >
                        <span>{slot.slotCode}</span>
                        <span>
                            {slot.isOccupied ? (
                                <span className="text-red-400">Occupied</span>
                            ) : (
                                <span className="text-green-400">Available</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffSessionPage;