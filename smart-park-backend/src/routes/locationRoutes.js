const express = require("express");

const router = express.Router();

const {
    createLocation,
    getLocations,
    deleteLocation
} = require("../controllers/location.controller");


router.post("/", createLocation);

router.get("/", getLocations);

router.delete("/:id", deleteLocation);


module.exports = router;