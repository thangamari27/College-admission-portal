const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'admission_DB',
    password: '',
});

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Generate Application ID
async function generateApplicationId(courseType) {
    const year = new Date().getFullYear().toString().slice(2); // Last two digits of year
    const collegeId = '107'; // Static college ID
    const result = await pool.query(
        `SELECT serial_count FROM application_id_tracker 
         WHERE year = $1 AND college_id = $2 AND course_type = $3`,
        [year, collegeId, courseType]
    );

    let serialCount = 1;
    if (result.rows.length > 0) {
        serialCount = result.rows[0].serial_count + 1;
    }

    const applicationId = `${courseType}${year}${collegeId}${serialCount.toString().padStart(4, '0')}`;

    // Update tracker
    if (result.rows.length > 0) {
        await pool.query(
            `UPDATE application_id_tracker 
             SET serial_count = $1 
             WHERE year = $2 AND college_id = $3 AND course_type = $4`,
            [serialCount, year, collegeId, courseType]
        );
    } else {
        await pool.query(
            `INSERT INTO application_id_tracker (year, college_id, course_type, serial_count) 
             VALUES ($1, $2, $3, $4)`,
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

        await pool.query(
            `INSERT INTO personal_info (
                application_id, first_name, last_name, email, phone, aadhaar_number, blood_group, dob, gender, address,
                father_name, father_occupation, mother_name, mother_occupation, annual_income, community, caste, religion, nationality
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
            [applicationId, first_name, last_name, email, phone, aadhaar_number, blood_group, dob, gender, address,
                father_name, father_occupation, mother_name, mother_occupation, annual_income, community, caste, religion, nationality]
        );

        await pool.query(
            `INSERT INTO academic_info (
                application_id, school_name, exam_register_number, subjects, total_marks, percentage, cutoff_marks,
                passing_month_year, course_type, course_mode, photo_path, aadhaar_card_path, transfer_certificate_path
            ) VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [applicationId, school_name, exam_register_number, subjects, total_marks, percentage, cutoff_marks,
                passing_month_year, course_type, course_mode, photo, aadhaarCard, transferCertificate]
        );

        await pool.query(
            `INSERT INTO extra_info (
                application_id, physical_disability, ex_service_man, nss_ncc_sports
            ) VALUES ($1, $2, $3, $4)`,
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
