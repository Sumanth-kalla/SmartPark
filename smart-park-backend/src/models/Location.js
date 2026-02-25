const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: String,
    city: String,

    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },

    pricePerHour: {
        type: Number,
        required: true,
    },

    totalSlots: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);