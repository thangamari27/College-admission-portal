const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');
const studentController = require('../controllers/studentController');

// Route to fetch student dashboard details
router.get('/student-dashboard', authenticateToken, studentController.getStudentDashboard);

module.exports = router;
