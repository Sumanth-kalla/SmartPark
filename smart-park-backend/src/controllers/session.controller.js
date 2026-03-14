const ParkingSession = require("../models/ParkingSession");
const Slot = require("../models/Slot");


// ============================================
// USER BOOKS SLOT
// ============================================
exports.bookSlot = async (req, res, next) => {
    try {
        const { slotId } = req.body;
        const userId = req.user.id;

        if (!slotId) {
            return res.status(400).json({
                success: false,
                message: "Slot ID is required",
            });
        }

        const existingSession = await ParkingSession.findOne({
            user: userId,
            status: { $in: ["booked", "active"] },
        });

        if (existingSession) {
            return res.status(400).json({
                success: false,
                message: "You already have an active booking",
            });
        }

        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        if (slot.isOccupied || slot.isReserved) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked",
            });
        }

        // reserve slot
        slot.isReserved = true;
        await slot.save();

        // 🔹 Create expiry time (15 minutes)
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        const session = await ParkingSession.create({
            user: userId,
            slot: slotId,
            status: "booked",
            reservationExpiry: expiry
        });

        const io = req.app.get("io");
        io.emit("slotUpdate");

        res.status(201).json({
            success: true,
            message: "Slot booked successfully",
            session,
        });

    } catch (error) {
        next(error);
    }
};


// ============================================
// STAFF SCANS QR → ACTIVATE SESSION
// ============================================
exports.activateSession = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const session = await ParkingSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status !== "booked") {
            return res.status(400).json({
                success: false,
                message: "Invalid or already active session",
            });
        }

        const slot = await Slot.findById(session.slot);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        if (slot.isOccupied) {
            return res.status(400).json({
                success: false,
                message: "Slot already occupied",
            });
        }

        session.status = "active";
        session.entryTime = new Date();
        await session.save();

        slot.isReserved = false;
        slot.isOccupied = true;
        await slot.save();
        const io = req.app.get("io");
        io.emit("slotUpdate");

        res.json({
            success: true,
            message: "Parking session activated",
            session,
        });

    } catch (error) {
        next(error);
    }
};


// ============================================
// STAFF ENDS SESSION
// ============================================
exports.endSession = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const session = await ParkingSession
            .findById(sessionId)
            .populate("slot");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Session not active",
            });
        }
        if (session.status === "booked" && expired) {

            slot.isReserved = false
            session.status = "expired"
        }

        session.exitTime = new Date();

        const durationHours = Math.ceil(
            (session.exitTime - session.entryTime) / (1000 * 60 * 60)
        );

        session.totalAmount =
            durationHours * session.slot.hourlyRate;

        session.status = "completed";

        await session.save();

        const slot = await Slot.findById(session.slot._id);

        if (slot) {
            slot.isOccupied = false;
            slot.isReserved = false;
            await slot.save();
            const io = req.app.get("io");
            io.emit("slotUpdate");
        }

        res.json({
            success: true,
            message: "Session ended",
            totalAmount: session.totalAmount,
            durationHours,
        });

    } catch (error) {
        next(error);
    }
};
// ============================================
// GET USER ACTIVE SESSION
// ============================================
exports.getMySession = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const session = await ParkingSession.findOne({
            user: userId,
            status: { $in: ["booked", "active"] }
        }).populate("slot");

        res.json({
            success: true,
            session: session || null
        });

    } catch (error) {
        next(error);
    }
};