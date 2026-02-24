const express = require("express");
const router = express.Router();

const {
    createParkingLot,
    getParkingLots,
} = require("../controllers/parkingLot.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Admin only
router.post("/", protect, authorize("admin"), createParkingLot);
router.get("/", protect, authorize("admin"), getParkingLots);

module.exports = router;