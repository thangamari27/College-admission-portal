// config/db.js
const mysql = require('mysql2/promise'); // Use the promise-based version
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'college_admission_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

testConnection();

module.exports = pool; // Export the pool for use in your routes