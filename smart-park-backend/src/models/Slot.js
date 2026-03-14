const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    slotCode: {
        type: String,
        required: true
    },

    floor: String,

    hourlyRate: {
        type: Number,
        default: 50
    },

    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },

    isReserved: {
        type: Boolean,
        default: false
    },

    isOccupied: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Slot", slotSchema);