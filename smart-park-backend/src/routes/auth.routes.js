const express = require("express");
const { signup, login } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route
router.get("/me", protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

module.exports = router;