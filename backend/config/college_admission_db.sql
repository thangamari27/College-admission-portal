CREATE DATABASE college_admission_db;

USE college_admission_db;

-- College courses list
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coursename VARCHAR(255) NOT NULL,
    fees DECIMAL(10, 2) NOT NULL,
    courseduration VARCHAR(100),
    eligibility TEXT,
    feeslink VARCHAR(255),
    brochurelink VARCHAR(255),
    brochurename VARCHAR(100),
    applylink VARCHAR(255),
    applyname VARCHAR(100)
);

-- College course details
CREATE TABLE course_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    program VARCHAR(255),
    fees DECIMAL(10, 2),
    eligibility TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_seats (
    CourseID INT PRIMARY KEY AUTO_INCREMENT,  -- Unique course ID
    coursename VARCHAR(255) NOT NULL,         -- Course name
    seats INT NOT NULL                  -- Total number of available seats
);


-- Users table
CREATE TABLE Std_Users (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

CREATE TABLE PersonalInfo (
    StudentID VARCHAR(15) PRIMARY KEY, -- STU-000001
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    EmailAddress VARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    AadhaarNumber VARCHAR(12) NOT NULL,
    BloodGroup VARCHAR(5),
    DateOfBirth DATE,
    Gender VARCHAR(10),
    Address TEXT,
    FathersName VARCHAR(100),
    FathersOccupation VARCHAR(100),
    MothersName VARCHAR(100),
    MothersOccupation VARCHAR(100),
    AnnualIncome DECIMAL(15,2),
    Community VARCHAR(50),
    Caste VARCHAR(50),
    Religion VARCHAR(50),
    Nationality VARCHAR(50)
);

CREATE TABLE AcademicInfo (
    AcademicID VARCHAR(15) PRIMARY KEY, -- ACAD-000001
    StudentID VARCHAR(15) NOT NULL,
    SchoolName VARCHAR(100),
    ExamRegisterNumber VARCHAR(100),
    Emis_no VARCHAR(20),
    Subjects JSON,
    TotalMarks INT,
    MarkPercentage DECIMAL(5,2),
    CutOffMarks DECIMAL(5,2),
    MonthYearPassing VARCHAR(7), -- MM-YYYY
    CourseType VARCHAR(50),
    CourseName VARCHAR(100),
    CourseMode VARCHAR(50),
    PassportPhoto LONGBLOB,
    AadhaarCard LONGBLOB,
    TransferCertificate LONGBLOB,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);

CREATE TABLE ExtraInfo (
    StudentID VARCHAR(15) PRIMARY KEY,
    physically_challenged VARCHAR(10),
    ex_serviceman VARCHAR(10),
    activities TEXT,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);

CREATE TABLE AdmissionRecords (
    UserID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incremented ID
    AdmissionID VARCHAR(15) NOT NULL UNIQUE,  -- Unique Admission ID
    StudentID VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    AdmissionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ApplicationStatus ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);

CREATE TABLE AdminUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO AdminUsers (email, password) VALUES 
("admin123@gmail.com", " $2a$10$CYkCD7lJyIJy9OE9U2EG7eJ/QTseWAV3LuTiZ1eVIbjWDuPBBKLVK");


-- login checking
SELECT u.*, a.AdmissionID
FROM Std_Users u
JOIN AdmissionRecords a ON u.id = a.StudentID
WHERE u.email = 'thangamari616@gmail.com' AND a.AdmissionID = 'UG251070001';

-- insert record query 
INSERT INTO courses (coursename, fees, courseduration, eligibility, feeslink, brochurelink, brochurename, applylink, applyname)
VALUES 
('Bachelor of Computer Application[BCA]', 1200.00, '3YR | Full Time', 'Eligibility : 10+2', 'Details Fees', 'brochure_bsc_computer_science.pdf', 'Brochure', '/admissionForm', 'Apply Now');

INSERT INTO course_details (course_id, program, fees, eligibility)
VALUES 
(1, 'Computer Application', 1100.00, '10+2');

INSERT INTO course_seats (coursename, seats) VALUES
('[BCA]Computer Application(SF)', 48),
('[B.Com]Commerce(SF)', 128),
('[BA]English(SF)', 64),
('[B.Com]Commerce(REG)', 64),
('[BA]Econamics(REG)', 64),
('[MA]Econamics(REG)', 24);

INSERT INTO Std_Users (Id, email, phone_no, password_hash, created_at) VALUES 
(1,'thangamari616@gmail.com','8248225449','$2b$10$pRWX5elS5HlxzCr7VQwsXuaZrCgDYnYd6cgGZK31novFNiJIZjtQK', '2025-02-04 08:02:13'),
(2,'tmjk202@gmail.com','8248225449','$2b$10$kAKD529bN2o9IWFA4jXivevT.unuF0SPA2PhxYAqPeSBK2ueD7CRC', '2025-02-09 05:34:29');



-- application status update query
UPDATE `admissionrecords` SET ApplicationStatus = 'Approved' WHERE StudentID = 'STU000001';

-- profile query
 SELECT 
                p.StudentID, p.FirstName, p.LastName, p.EmailAddress AS email, p.PhoneNumber AS phoneNo, 
                p.AadhaarNumber AS aadhaarNo, p.BloodGroup AS bloodGroup, p.DateOfBirth AS dob, p.Gender AS gender, 
                p.Address AS address, p.Nationality AS nationality, p.Religion AS religion, p.Community AS community, p.Caste AS caste,
                p.FathersName AS fatherName, p.MothersName AS motherName, p.FathersOccupation AS fatherOccupation, p.MothersOccupation AS motherOccupation, p.AnnualIncome AS annualIncome,
                a.SchoolName AS schoolName, a.ExamRegisterNumber AS regNo, a.MonthYearPassing AS yearOfPassing, a.TotalMarks AS totalMarks, a.CutOffMarks AS cutOff, a.Emis_no AS emisNo, 
                a.Subjects AS subjects, -- JSON column for subject-wise marks
                a.CourseType AS courseType, a.CourseName AS courseName, a.CourseMode AS courseMode,
                e.physically_challenged AS physicallyChallenged, e.ex_serviceman AS exServiceMan, e.activities AS activities
            FROM PersonalInfo p
            LEFT JOIN AcademicInfo a ON p.StudentID = a.StudentID
            LEFT JOIN ExtraInfo e ON p.StudentID = e.StudentID
            LEFT JOIN AdmissionRecords ar ON p.StudentID = ar.StudentID
            WHERE p.StudentID = ?;