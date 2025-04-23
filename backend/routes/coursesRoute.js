const express = require('express');
const db = require('../config/db');
const router = express.Router();

// API to fetch courses
router.get('/', async (req, res) => {
  const query = `
    SELECT c.*, 
           IFNULL(CONCAT('[', GROUP_CONCAT(
               CONCAT('{"program": "', d.program, '", "fees": ', d.fees, ', "eligibility": "', d.eligibility, '"}')
           ), ']'), '[]') AS table_data
    FROM courses c
    LEFT JOIN course_details d ON c.id = d.course_id
    GROUP BY c.id;
  `;

  try {
    const [results] = await db.query(query); // Use await to handle the promise

    const formattedResults = results.map(course => ({
      ...course,
      table: JSON.parse(course.table_data || '[]'), // Safeguard against NULL
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching courses.' });
  }
});

module.exports = router;