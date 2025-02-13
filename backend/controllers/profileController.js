const pool = require("../config/db");

// ✅ Get Profile Data
exports.getProfileData = async (req, res) => {
  try {
    const { StudentID } = req.user; // Get StudentID from authenticated user

    // Fetch Personal, Academic, and Extra Info
    const [personalInfo] = await pool.execute("SELECT * FROM PersonalInfo WHERE StudentID = ?", [StudentID]);
    const [academicInfo] = await pool.execute("SELECT * FROM AcademicInfo WHERE StudentID = ?", [StudentID]);
    const [extraInfo] = await pool.execute("SELECT * FROM ExtraInfo WHERE StudentID = ?", [StudentID]);

    // Check if data exists
    if (!personalInfo.length || !academicInfo.length || !extraInfo.length) {
      return res.status(404).json({ error: "Profile data not found" });
    }

    // Send the data as a response
    res.status(200).json({
      personalInfo: personalInfo[0],
      academicInfo: academicInfo[0],
      extraInfo: extraInfo[0]
    });

  } catch (error) {
    console.error("Error fetching profile data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Logout User - Clears JWT and redirects
exports.logoutUser = (req, res) => {
  res.clearCookie("jwt"); // Clear JWT cookie if used
  res.redirect("/"); // Redirect to the college dashboard
};
