const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    console.log("🔹 Received Email:", email);
    console.log("🔹 Received Password:", password ? "Provided" : "Not Provided");

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // Check if admin exists
        const [rows] = await db.query("SELECT * FROM AdminUsers WHERE email = ?", [email]);

        if (!rows || rows.length === 0) {
            console.warn("⚠️ Admin not found for email:", email);
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const admin = rows[0];
        const hashedPassword = admin.password_hash || admin.password;

        if (!hashedPassword) {
            console.error("🚨 No hashed password found in DB for email:", email);
            return res.status(500).json({ error: "Server error. Please try again later." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            console.warn("⚠️ Password mismatch for email:", email);
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || "Admin@123",
            { expiresIn: "1h" }
        );        

        console.log("✅ Login successful for:", email);
        res.status(200).json({ token, redirectUrl: "/admin-dashboard" });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

module.exports = adminLogin;
