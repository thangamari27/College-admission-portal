const db = require("../config/db");

// 📌 Fetch all student records
exports.getStudents = async (req, res) => {
    const query = `
        SELECT pi.StudentID, pi.FirstName, pi.LastName, pi.EmailAddress, pi.PhoneNumber, 
               ai.CourseName, ar.ApplicationStatus 
        FROM PersonalInfo pi
        JOIN AcademicInfo ai ON pi.StudentID = ai.StudentID
        JOIN AdmissionRecords ar ON pi.StudentID = ar.StudentID`;

    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ error: "Database query error!" });
    }
};

// 📌 Update student record
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, EmailAddress, PhoneNumber, ApplicationStatus } = req.body;

    const query = `UPDATE PersonalInfo pi
        JOIN AdmissionRecords ar ON pi.StudentID = ar.StudentID
        SET pi.FirstName = ?, pi.LastName = ?, pi.EmailAddress = ?, pi.PhoneNumber = ?, ar.ApplicationStatus = ?
        WHERE pi.StudentID = ?`;

    try {
        const [result] = await db.execute(query, [FirstName, LastName, EmailAddress, PhoneNumber, ApplicationStatus, id]);
        res.json({ message: "Record updated successfully!" });
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ error: "Update failed!" });
    }
};

// 📌 Delete student record
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM PersonalInfo WHERE StudentID = ?`;

    try {
        const [result] = await db.execute(query, [id]);
        res.json({ message: "Record deleted successfully!" });
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ error: "Deletion failed!" });
    }
};
