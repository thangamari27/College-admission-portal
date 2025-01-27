const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    // Insert new user into the database
    const [result] = await pool.execute(
      'INSERT INTO Std_Users (email, phone_no, password_hash) VALUES (?, ?, ?)',
      [email, phone_no, hashedPassword]
    );

    // Create a token
    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    // Set the token as a cookie
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }); // 1 hour

    // Redirect to /college-home
    return res.status(201).json({ message: 'Signup successful', redirectUrl: '/college-home' });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
