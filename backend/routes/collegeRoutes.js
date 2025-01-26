// routes/collegeRoutes.js
const express = require('express');
const { getCollegeDashboard } = require('../controllers/collegeController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticateToken, getCollegeDashboard);

module.exports = router;
