const Slot = require("../models/Slot");

exports.createSlot = async (req, res, next) => {
    try {
        const { slotCode, floor, hourlyRate } = req.body;

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
        });

        res.status(201).json({
            success: true,
            slot,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllSlots = async (req, res, next) => {
    try {
        const slots = await Slot.find();

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