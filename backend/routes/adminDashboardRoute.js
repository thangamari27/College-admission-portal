const express = require("express");
const router = express.Router();
const { getStudents, updateStudent, deleteStudent } = require("../controllers/adminDashboardController");

// Route to fetch students
router.get("/students", getStudents);

// Route to update a student record
router.put("/students/:id", updateStudent);

// Route to delete a student record
router.delete("/students/:id", deleteStudent);

module.exports = router;
