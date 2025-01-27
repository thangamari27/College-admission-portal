const express = require('express');
const { signup } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Protected home route
router.get('/college-home', authenticateToken, (req, res) => {
  res.render('college_home', { user: req.user });
});

module.exports = router;
