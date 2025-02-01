const db = require("../config/db");

const collegeCode = '107'; // Example college code
const currentYear = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year

// Fetch the last Student ID and increment
async function generateStudentId() {
    const [rows] = await db.query(`SELECT StudentID FROM PersonalInfo ORDER BY StudentID DESC LIMIT 1`);
    let lastId = rows.length > 0 ? parseInt(rows[0].StudentID.replace("STU", ""), 10) : 0;
    let newId = lastId + 1;
    return `STU${newId.toString().padStart(6, '0')}`; // e.g., STU000001
}

// Fetch the last Academic ID and increment
async function generateAcademicId() {
    const [rows] = await db.query(`SELECT AcademicID FROM AcademicInfo ORDER BY AcademicID DESC LIMIT 1`);
    let lastId = rows.length > 0 ? parseInt(rows[0].AcademicID.replace("ACAD", ""), 10) : 0;
    let newId = lastId + 1;
    return `ACAD${newId.toString().padStart(6, '0')}`;
}

// Fetch the last Admission ID and increment
async function generateAdmissionId(courseType) {
    let table = "AdmissionRecords";
    let prefix = courseType === "UG" ? "UG" : "PG";

    const [rows] = await db.query(`SELECT AdmissionID FROM ${table} WHERE AdmissionID LIKE '${prefix}%' ORDER BY AdmissionID DESC LIMIT 1`);
    let lastId = rows.length > 0 ? parseInt(rows[0].AdmissionID.slice(-4)) : 0;
    let newId = lastId + 1;

    return `${prefix}${currentYear}${collegeCode}${newId.toString().padStart(4, '0')}`;
}

// Submit Admission Form
const submitAdmissionForm = async (req, res) => {
    const {
        // Personal Info
        FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
        DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName,
        MothersOccupation, AnnualIncome, Community, Caste, Religion, Nationality,

        // Academic Info
        SchoolName, ExamRegisterNumber, Emis_no, Subjects, TotalMarks, MarkPercentage,
        CutOffMarks, MonthYearPassing, CourseType, CourseName, CourseMode,
        PassportPhoto, AadhaarCard, TransferCertificate,

        // Extra Info
        physicallyChallenged, exServiceman, activities
    } = req.body;

    console.log(req.body); // Debugging output
    console.log(CourseType); // Debugging output

    try {
        // Validate required fields
        if (!FirstName || !LastName || !EmailAddress || !PhoneNumber || !AadhaarNumber || !DateOfBirth || !Gender || !Nationality) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        // Email and phone validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(EmailAddress)) return res.status(400).json({ message: "Invalid email format." });
        if (!phoneRegex.test(PhoneNumber)) return res.status(400).json({ message: "Invalid phone number format." });

        // Generate unique IDs
        const studentID = await generateStudentId();
        const academicID = await generateAcademicId();
        const admissionID = await generateAdmissionId(CourseType); 

        console.log(studentID, academicID, admissionID); // Debugging output

        // Get a connection from the pool
        const connection = await db.getConnection();

        // Insert into PersonalInfo table
        await connection.query(
            `INSERT INTO PersonalInfo (
                StudentID, FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
                DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName, MothersOccupation, AnnualIncome, Community, Caste, Religion, Nationality
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentID, FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
                DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName, MothersOccupation,
                AnnualIncome, Community, Caste, Religion, Nationality
            ]
        );

        // Insert into AcademicInfo table
        await connection.query(
            `INSERT INTO AcademicInfo (
                AcademicID, StudentID, SchoolName, ExamRegisterNumber, Emis_no, Subjects, TotalMarks,
                MarkPercentage, CutOffMarks, MonthYearPassing, CourseType, CourseName, CourseMode,
                PassportPhoto, AadhaarCard, TransferCertificate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [
                academicID, studentID, SchoolName, ExamRegisterNumber, Emis_no, JSON.stringify(Subjects),
                TotalMarks, MarkPercentage, CutOffMarks, MonthYearPassing, CourseType, CourseName,
                CourseMode, PassportPhoto, AadhaarCard, TransferCertificate
            ]
        );

        // Insert into ExtraInfo table
        await connection.query(
            `INSERT INTO ExtraInfo (
                StudentID, physically_challenged, ex_serviceman, activities
            ) VALUES (?, ?, ?, ?)`,

            [studentID, physicallyChallenged, exServiceman, activities]
        );

        // Insert into AdmissionRecords table
        await connection.query(
            `INSERT INTO AdmissionRecords (AdmissionID, StudentID) VALUES (?, ?)`,
            [admissionID, studentID]
        );

        // Release the connection back to the pool
        connection.release();

        res.status(201).json({
            message: "Admission form submitted successfully!",
            studentID,
            academicID,
            admissionID
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { submitAdmissionForm };
