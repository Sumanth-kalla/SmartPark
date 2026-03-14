const Location = require("../models/Location");


/* CREATE LOCATION */

exports.createLocation = async (req, res) => {

    try {

        const { name, city, address } = req.body;

        const location = new Location({
            name,
            city,
            address
        });

        await location.save();

        res.json({
            success: true,
            location
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create location"
        });

    }

};



/* GET ALL LOCATIONS */

exports.getLocations = async (req, res) => {

    try {

        const locations = await Location.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            locations
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch locations"
        });

    }

};



/* DELETE LOCATION */

exports.deleteLocation = async (req, res) => {

    try {

        const { id } = req.params;

        await Location.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Location deleted"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });

    }

};