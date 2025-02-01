// admissionRoute.js
const express = require('express');
const db = require('../config/db');
const upload = require('../multerConfig');
const { submitAdmissionForm } = require('../controllers/admissionController'); // Import the controller
const router = express.Router();

// Define the route for submitting the admission form with file uploads
router.post(
  '/submitForm',
  upload.fields([
    { name: 'PassportPhoto', maxCount: 1 },
    { name: 'AadhaarCard', maxCount: 1 },
    { name: 'TransferCertificate', maxCount: 1 },
  ]),
  submitAdmissionForm // Use the controller function to handle the request
);

module.exports = router;