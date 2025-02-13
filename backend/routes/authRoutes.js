const express = require('express');
const authController = require('../controllers/authController'); // Fixed missing import
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.loginUser);

// Protected home route
router.get('/college-home', authenticateToken, (req, res) => {
    res.render('college_home', { user: req.user });
});

router.get("/student-home", authenticateToken, (req, res) => {
    res.render("studentDashboard", { student: req.user });
});

module.exports = router;
