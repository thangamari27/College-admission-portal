const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔹 Generate next available user ID (Manually incremented)
const getNextUserId = async () => {
    const [rows] = await pool.execute('SELECT MAX(id) AS maxId FROM Std_Users');
    return rows[0].maxId ? rows[0].maxId + 1 : 1; // If no users exist, start at 1
};

// 🔹 Signup Controller
exports.signup = async (req, res) => {
    try {
        const { email, phone_no, password } = req.body;
        console.log(req.body);

        // Check if the user already exists
        const [existingUser] = await pool.execute('SELECT * FROM Std_Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Get the next available user ID
        const nextUserId = await getNextUserId();

        // Insert new user into the database
        const [result] = await pool.execute(
            'INSERT INTO Std_Users (id, email, phone_no, password_hash) VALUES (?, ?, ?, ?)',
            [nextUserId, email, phone_no, hashedPassword]
        );

        // Generate JWT token
        const token = jwt.sign({ id: nextUserId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token);

        // Set the token as a cookie
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });

        return res.status(201).json({ message: 'Signup successful', userId: nextUserId, token, redirectUrl: '/college-home' });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 🔹 Login Controller (Handles Student Authentication)
exports.loginUser = async (req, res) => {
    const { email, admission_id, password } = req.body;

    console.log("Login request received:", req.body);

    if (!email || !admission_id || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Join Std_Users and AdmissionRecords for verification
        const [rows] = await pool.execute(
            `SELECT u.*, a.AdmissionID 
             FROM Std_Users u
             JOIN AdmissionRecords a ON u.id = a.UserID
             WHERE u.email = ? AND a.AdmissionID = ?`, 
            [email, admission_id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT token with Student ID
        const token = jwt.sign(
            { id: user.id, email: user.email, studentID: user.AdmissionID },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Set token in cookie
        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7200000 });

        console.log("Login successful, redirecting to student dashboard");

        return res.status(200).json({ message: "Login successful", token, redirectUrl: "/student-home" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 🔹 General Login Controller (Handles Normal User Login)
exports.loginUser = async (req, res) => {
    const { email, admission_id, password } = req.body;
    console.log("Login request received:", { email, admission_id });

    if (!email || !admission_id || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Fetch user with student ID
        const [rows] = await pool.execute(
            `SELECT u.*, a.AdmissionID 
             FROM Std_Users u
             JOIN AdmissionRecords a ON u.id = a.UserID
             WHERE u.email = ? AND a.AdmissionID = ?`, 
            [email, admission_id]
        );

        console.log("Database Response:", rows);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

        // Ensure studentID exists
        if (!user.AdmissionID) {
            return res.status(500).json({ error: "Student ID not found. Check database records." });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, studentID: user.AdmissionID },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7200000 });

        console.log("Login successful, redirecting to student dashboard");
        return res.status(200).json({ message: "Login successful", token, redirectUrl: "/student-home" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
