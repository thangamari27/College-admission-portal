const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/authenticateAdmin");
const adminController = require("../controllers/adminController");

// Admin Login Route (No Authentication Needed)
router.post("/login", adminController);

// ✅ Protected Admin Dashboard Route (Token Required)
router.get("/admin-dashboard", authenticateAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome Admin!", admin: req.admin });
});

module.exports = router;
