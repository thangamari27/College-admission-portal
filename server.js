// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'admission_DB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database.');
        connection.release();
    }
});

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Generate Application ID
async function generateApplicationId(courseType) {
    const year = new Date().getFullYear().toString().slice(2); // Last two digits of year
    const collegeId = '107'; // Static college ID

    const [rows] = await pool.promise().query(
        `SELECT serial_count FROM application_id_tracker 
         WHERE year = ? AND college_id = ? AND course_type = ?`,
        [year, collegeId, courseType]
    );

    let serialCount = 1;
    if (rows.length > 0) {
        serialCount = rows[0].serial_count + 1;
    }

    const applicationId = `${courseType}${year}${collegeId}${serialCount.toString().padStart(4, '0')}`;

    // Update tracker
    if (rows.length > 0) {
        await pool.promise().query(
            `UPDATE application_id_tracker 
             SET serial_count = ? 
             WHERE year = ? AND college_id = ? AND course_type = ?`,
            [serialCount, year, collegeId, courseType]
        );
    } else {
        await pool.promise().query(
            `INSERT INTO application_id_tracker (year, college_id, course_type, serial_count) 
             VALUES (?, ?, ?, ?)`,
            [year, collegeId, courseType, serialCount]
        );
    }

    return applicationId;
}

// Submit admission form data
app.post('/submit-admission', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhaar_card', maxCount: 1 },
    { name: 'transfer_certificate', maxCount: 1 }
]), async (req, res) => {
    const {
        first_name, last_name, email, phone, aadhaar_number, blood_group, dob, gender, address,
        father_name, father_occupation, mother_name, mother_occupation, annual_income,
        community, caste, religion, nationality, school_name, exam_register_number,
        subjects, total_marks, percentage, cutoff_marks, passing_month_year,
        course_type, course_mode, physical_disability, ex_service_man, nss_ncc_sports
    } = req.body;

    const photo = req.files['photo'][0].path;
    const aadhaarCard = req.files['aadhaar_card'][0].path;
    const transferCertificate = req.files['transfer_certificate'][0].path;

    try {
        const applicationId = await generateApplicationId(course_type.toUpperCase());

        await pool.promise().query(
            `INSERT INTO personal_info (
                application_id, first_name, last_name, email, phone, aadhaar_number, blood_group, dob, gender, address,
                father_name, father_occupation, mother_name, mother_occupation, annual_income, community, caste, religion, nationality
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [applicationId, first_name, last_name, email, phone, aadhaar_number, blood_group, dob, gender, address,
                father_name, father_occupation, mother_name, mother_occupation, annual_income, community, caste, religion, nationality]
        );

        await pool.promise().query(
            `INSERT INTO academic_info (
                application_id, school_name, exam_register_number, subjects, total_marks, percentage, cutoff_marks,
                passing_month_year, course_type, course_mode, photo_path, aadhaar_card_path, transfer_certificate_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [applicationId, school_name, exam_register_number, subjects, total_marks, percentage, cutoff_marks,
                passing_month_year, course_type, course_mode, photo, aadhaarCard, transferCertificate]
        );

        await pool.promise().query(
            `INSERT INTO extra_info (
                application_id, physical_disability, ex_service_man, nss_ncc_sports
            ) VALUES (?, ?, ?, ?)`,
            [applicationId, physical_disability === 'true', ex_service_man === 'true', nss_ncc_sports]
        );

        res.status(201).json({ message: 'Application submitted successfully.', applicationId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
