const express = require("express");
const router = express.Router();

const {
    createSlot,
    getAllSlots,
    getOccupancyStats,
} = require("../controllers/slot.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// -----------------------------
// Create Slot (Admin Only)
// -----------------------------
router.post(
    "/",
    protect,
    authorize("admin"),
    createSlot
);

// -----------------------------
// Get All Slots (All Roles)
// -----------------------------
router.get(
    "/",
    protect,
    authorize("admin", "staff", "user"),
    getAllSlots   // ✅ FIXED HERE
);

// -----------------------------
// Get Occupancy Stats (Admin Only)
// -----------------------------
router.get(
    "/stats",
    protect,
    authorize("admin"),
    getOccupancyStats
);

module.exports = router;