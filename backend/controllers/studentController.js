const pool = require('../config/db');

exports.getStudentDashboard = async (req, res) => {
  try {
      console.log("Incoming request for student dashboard:", req.user);

      // Validate request
      if (!req.user || !req.user.StudentID) {
          console.error("Missing StudentID in request.");
          return res.status(400).json({ error: "StudentID is required in the token" });
      }

      const studentID = req.user.StudentID; // Extract StudentID from JWT

      const query = `
          SELECT 
              p.FirstName, 
              p.LastName, 
              a.AdmissionID, 
              a.ApplicationStatus,
              ac.SchoolName,
              ac.TotalMarks,
              ac.MarkPercentage,
              ac.CutOffMarks,
              e.physically_challenged,
              e.ex_serviceman,
              e.activities
          FROM PersonalInfo p
          LEFT JOIN AdmissionRecords a ON p.StudentID = a.StudentID
          LEFT JOIN AcademicInfo ac ON p.StudentID = ac.StudentID
          LEFT JOIN ExtraInfo e ON p.StudentID = e.StudentID
          WHERE p.StudentID = ?;
      `;

      const [rows] = await pool.execute(query, [studentID]);
      console.log(rows);

      if (rows.length === 0) {
          return res.status(404).json({ error: "Student not found" });
      }

      res.json(rows[0]);
  } catch (error) {
      console.error("Error fetching student dashboard data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
