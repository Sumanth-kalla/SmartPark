const cron = require("node-cron");
const ParkingSession = require("../models/ParkingSession");
const Slot = require("../models/Slot");

const startReservationExpiryJob = () => {

    cron.schedule("*/1 * * * *", async () => {

        try {

            const now = new Date();

            const expiredSessions = await ParkingSession.find({
                status: "booked",
                reservationExpiry: { $lt: now }
            });

            for (const session of expiredSessions) {

                session.status = "expired";
                await session.save();

                const slot = await Slot.findById(session.slot);
                if (slot) {
                    slot.isOccupied = false;
                    await slot.save();
                }

            }

            if (expiredSessions.length > 0) {
                console.log(`Expired reservations: ${expiredSessions.length}`);
            }

        } catch (err) {
            console.error("Reservation expiry job error:", err);
        }

    });

};

module.exports = startReservationExpiryJob;