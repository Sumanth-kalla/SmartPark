const mongoose = require("mongoose");

const parkingSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true,
        },
        status: {
            type: String,
            enum: ["booked", "active", "completed"],
            default: "booked",
        },
        entryTime: Date,
        exitTime: Date,
        totalAmount: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("ParkingSession", parkingSessionSchema);