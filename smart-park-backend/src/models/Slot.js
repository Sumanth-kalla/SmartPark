const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
    {
        slotCode: {
            type: String,
            required: true,
            unique: true, // important
        },
        floor: {
            type: Number,
            required: true,
        },
        hourlyRate: {
            type: Number,
            required: true,
        },
        isOccupied: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);