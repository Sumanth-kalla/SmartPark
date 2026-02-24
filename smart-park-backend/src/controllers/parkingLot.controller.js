const ParkingLot = require("../models/ParkingLot");

exports.createParkingLot = async (req, res, next) => {
    try {
        const { name, address, totalFloors } = req.body;

        const lot = await ParkingLot.create({
            name,
            address,
            totalFloors,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            parkingLot: lot,
        });
    } catch (error) {
        next(error);
    }
};

exports.getParkingLots = async (req, res, next) => {
    try {
        const lots = await ParkingLot.find({ createdBy: req.user.id });

        res.json({
            success: true,
            count: lots.length,
            parkingLots: lots,
        });
    } catch (error) {
        next(error);
    }
};