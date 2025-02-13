const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.authenticateToken = async (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies.jwt || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("Missing token. Checking requested path...");

    if (req.path === "/college-home") {
      console.log("Redirecting to signup.");
      return res.redirect("/signup");
    }

    if (req.path === "/student-home") {
      console.log("Redirecting to login.");
      return res.redirect("/login");
    }

    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", decoded);

    // Fetch additional student info from DB
    const [user] = await pool.execute(
      `SELECT u.id, u.email, a.StudentID 
       FROM Std_Users u 
       LEFT JOIN AdmissionRecords a ON u.id = a.UserID 
       WHERE u.id = ?`, 
      [decoded.id]
    );

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach verified user info, including StudentID, to the request
    req.user = {
      id: user[0].id,
      email: user[0].email,
      StudentID: user[0].StudentID // Ensure StudentID is available
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.redirect("/login"); // Redirect if token is invalid
  }
};
