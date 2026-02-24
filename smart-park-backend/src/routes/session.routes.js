const express = require("express");
const router = express.Router();

const {
    bookSlot,
    activateSession,
    endSession,
    getMySession
} = require("../controllers/session.controller");

const { protect } = require("../middleware/auth.middleware");

// ============================================
// USER BOOKS SLOT
// ============================================
router.post("/book", protect, bookSlot);

// ============================================
// GET USER ACTIVE SESSION
// ============================================
router.get("/my", protect, getMySession);

// ============================================
// STAFF ACTIVATES SESSION
// ============================================
router.post("/activate", protect, activateSession);

// ============================================
// STAFF ENDS SESSION
// ============================================
router.post("/end", protect, endSession);

module.exports = router;   // ✅ MUST BE EXACTLY THIS