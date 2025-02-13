const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Function to generate a unique signup ID
const generateSignupId = () => {
    return `signup_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// User signup function
const createUser  = (signupData, callback) => {
    const { email, phone_no, password } = signupData;
    const signup_id = generateSignupId(); // Generate a unique signup ID

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err);
        const query = `
            INSERT INTO Std_Users (signup_id, email, phone_no, password) 
            VALUES (?, ?, ?, ?)
        `;
        db.query(query, [signup_id, email, phone_no, hashedPassword], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

module.exports = { createUser  };