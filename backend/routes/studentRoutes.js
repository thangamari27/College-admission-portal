// routes/studentRoutes.js
const express = require('express');
const { getStudentDashboard } = require('../controllers/studentController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticateToken, getStudentDashboard);

module.exports = router;
