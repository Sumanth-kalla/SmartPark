const Slot = require("../models/Slot");

exports.createSlot = async (req, res, next) => {
    try {
        const { slotCode, floor, hourlyRate, location } = req.body;

        const existing = await Slot.findOne({ slotCode });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Slot already exists",
            });
        }

        const slot = await Slot.create({
            slotCode,
            floor,
            hourlyRate,
            location,
        });

        res.status(201).json({
            success: true,
            slot,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.getAllSlots = async (req, res, next) => {
    try {

        const slots = await Slot.find()
            .populate("location", "name city");

        res.json({
            success: true,
            count: slots.length,
            slots,
        });

    } catch (error) {
        next(error);
    }
};

exports.getOccupancyStats = async (req, res, next) => {
    try {

        const total = await Slot.countDocuments();
        const occupied = await Slot.countDocuments({ isOccupied: true });
        const available = total - occupied;

        res.json({
            success: true,
            total,
            occupied,
            available,
        });

    } catch (error) {
        next(error);
    }
};