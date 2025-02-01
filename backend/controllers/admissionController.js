// admissionController.js
const db = require("../config/db");

let studentCounter = 0; // Counter for student IDs 
let ugCounter = 0; // Counter for undergraduate admissions
let pgCounter = 0; // Counter for postgraduate admissions
const collegeCode = '107'; // Example college code
const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the current year

// Function to generate a student ID
function generateStudentId() {
    studentCounter++;
    return `STU${studentCounter.toString().padStart(6, '0')}`; // e.g., STU-000001
}

// Function to generate an academic ID
function generateAcademicId() {
    return `ACAD${studentCounter.toString().padStart(6, '0')}`; // e.g., ACAD-000001
}

// Function to generate an admission ID (for UG/PG)
function generateAdmissionId(courseType) {
    let counter;
    
    if (courseType === 'UG') {
        ugCounter++;
        counter = ugCounter;
        return `UG${currentYear}${collegeCode}${counter.toString().padStart(4, '0')}`; // e.g., UG251070001
    } else if (courseType === 'PG') {
        pgCounter++;
        counter = pgCounter;
        return `PG${currentYear}${collegeCode}${counter.toString().padStart(4, '0')}`; // e.g., PG251070001
    } else {
        throw new Error('Invalid program type. Use "UG" or "PG".');
    }
}

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

    console.log(req.body); // Check if it outputs "UG" or "PG"
    console.log(CourseType); // Check if it outputs "UG" or "PG"

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

        // Generate Student ID, Academic ID, and Admission ID
        const studentID = generateStudentId();
        const academicID = generateAcademicId();
        const admissionID = generateAdmissionId(CourseType); // Use CourseType as it's destructured from req.body

        console.log(studentID);
        console.log(academicID);
        console.log(admissionID);

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
            [
                studentID, physicallyChallenged, exServiceman, activities
            ]
        );

        // Release the connection back to the pool
        connection.release();

        res.status(201).json({ message: "Admission form submitted successfully!", studentID, academicID, admissionID });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { submitAdmissionForm };
