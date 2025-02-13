const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const { getProfileData, logoutUser } = require("../controllers/profileController");

const router = express.Router();

// ✅ Profile Route - Fetch user profile data
router.get("/profile", authenticateToken, getProfileData);

// ✅ Logout Route - Clears JWT and redirects
router.get("/logout", logoutUser);

module.exports = router;
