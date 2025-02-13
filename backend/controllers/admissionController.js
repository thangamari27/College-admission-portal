const db = require("../config/db");

const collegeCode = "107"; // Example college code
const currentYear = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year

// Generate unique Student ID
async function generateStudentId() {
    const [rows] = await db.query(`SELECT StudentID FROM PersonalInfo ORDER BY StudentID DESC LIMIT 1`);
    let lastId = rows.length > 0 ? parseInt(rows[0].StudentID.replace("STU", ""), 10) : 0;
    return `STU${(lastId + 1).toString().padStart(6, "0")}`;
}

// Generate unique Academic ID
async function generateAcademicId() {
    const [rows] = await db.query(`SELECT AcademicID FROM AcademicInfo ORDER BY AcademicID DESC LIMIT 1`);
    let lastId = rows.length > 0 ? parseInt(rows[0].AcademicID.replace("ACAD", ""), 10) : 0;
    return `ACAD${(lastId + 1).toString().padStart(6, "0")}`;
}

// Generate unique Admission ID
async function generateAdmissionId(courseType) {
    let prefix = courseType === "UG" ? "UG" : "PG";
    const [rows] = await db.query(
        `SELECT AdmissionID FROM AdmissionRecords WHERE AdmissionID LIKE '${prefix}%' ORDER BY AdmissionID DESC LIMIT 1`
    );
    let lastId = rows.length > 0 ? parseInt(rows[0].AdmissionID.slice(-4)) : 0;
    return `${prefix}${currentYear}${collegeCode}${(lastId + 1).toString().padStart(4, "0")}`;
}

// Submit Admission Form
const submitAdmissionForm = async (req, res) => {
    const {
        FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
        DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName,
        MothersOccupation, AnnualIncome, Community, Caste, Religion, Nationality,
        SchoolName, ExamRegisterNumber, Emis_no, TotalMarks, MarkPercentage,
        CutOffMarks, MonthYearPassing, CourseType, CourseName, CourseMode,
        physicallyChallenged, exServiceman, activities
    } = req.body;

    if (!FirstName || !LastName || !EmailAddress || !PhoneNumber || !AadhaarNumber || !DateOfBirth || !Gender || !Nationality) {
        return res.status(400).json({ message: "Required fields are missing." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(EmailAddress)) return res.status(400).json({ message: "Invalid email format." });
    if (!phoneRegex.test(PhoneNumber)) return res.status(400).json({ message: "Invalid phone number format." });

    // Handle file uploads
    const passportPhoto = req.files && req.files.PassportPhoto ? req.files.PassportPhoto[0].path : null;
    const aadhaarCard = req.files && req.files.AadhaarCard ? req.files.AadhaarCard[0].path : null;
    const transferCertificate = req.files && req.files.TransferCertificate ? req.files.TransferCertificate[0].path : null;

    // Parse dynamic subjects and marks
    const subjects = [];
    Object.keys(req.body).forEach((key) => {
        if (key.startsWith('subject_') && key.endsWith('_name')) {
            const index = key.split('_')[1];
            const name = req.body[`subject_${index}_name`];
            const marks = req.body[`subject_${index}_marks`];
            if (name && marks) {
                subjects.push({ name, marks: parseInt(marks, 10) });
            }
        }
    });

    if (subjects.length === 0) {
        return res.status(400).json({ message: "Subjects cannot be empty." });
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        const studentID = await generateStudentId();
        const academicID = await generateAcademicId();
        const admissionID = await generateAdmissionId(CourseType);

        await connection.query(
            `INSERT INTO PersonalInfo (StudentID, FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
                DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName, MothersOccupation, AnnualIncome, Community, Caste, Religion, Nationality)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentID, FirstName, LastName, EmailAddress, PhoneNumber, AadhaarNumber, BloodGroup,
                DateOfBirth, Gender, Address, FathersName, FathersOccupation, MothersName, MothersOccupation,
                AnnualIncome, Community, Caste, Religion, Nationality
            ]
        );

        await connection.query(
            `INSERT INTO AcademicInfo (AcademicID, StudentID, SchoolName, ExamRegisterNumber, Emis_no, Subjects, TotalMarks,
                MarkPercentage, CutOffMarks, MonthYearPassing, CourseType, CourseName, CourseMode, PassportPhoto, AadhaarCard, TransferCertificate)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                academicID, studentID, SchoolName, ExamRegisterNumber, Emis_no, JSON.stringify(subjects),
                TotalMarks, MarkPercentage, CutOffMarks, MonthYearPassing, CourseType, CourseName,
                CourseMode, passportPhoto, aadhaarCard, transferCertificate
            ]
        );

        await connection.query(
            `INSERT INTO ExtraInfo (StudentID, physically_challenged, ex_serviceman, activities) VALUES (?, ?, ?, ?)`,
            [studentID, physicallyChallenged, exServiceman, activities]
        );

        await connection.query(
            `INSERT INTO AdmissionRecords (AdmissionID, StudentID) VALUES (?, ?)`,
            [admissionID, studentID]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Admission form submitted successfully!",
            studentID,
            academicID,
            admissionID
        });
    } catch (error) {
        console.error("Error:", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { submitAdmissionForm };
