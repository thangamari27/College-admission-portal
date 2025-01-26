const express = require('express');
const { signup } = require('../controllers/authController');
const { renderHome } = require('../controllers/homeController');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/signup', signup);

// Home route (protected)
router.get('/college-home', authenticateToken, renderHome);

module.exports = router;
