const express = require('express');
const db = require('../config/db'); // Database connection file
const router = express.Router();

// GET all course seats
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM course_seats');

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No course seats found.' });
    }

    res.json(results);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching course seats.' });
  }
});

module.exports = router;
