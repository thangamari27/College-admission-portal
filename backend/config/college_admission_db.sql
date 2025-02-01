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

-- Users table
CREATE TABLE Std_Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    AdmissionID VARCHAR(15) PRIMARY KEY NOT NULL,
    StudentID VARCHAR(15) NOT NULL,
    AdmissionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);


-- insert record query 
INSERT INTO courses (coursename, fees, courseduration, eligibility, feeslink, brochurelink, brochurename, applylink, applyname)
VALUES 
('Bachelor of Computer Application[BCA]', 1200.00, '3YR | Full Time', 'Eligibility : 10+2', 'Details Fees', 'brochure_bsc_computer_science.pdf', 'Brochure', '/admission-form', 'Apply Now');

INSERT INTO course_details (course_id, program, fees, eligibility)
VALUES 
(course_id, 'Computer Application', 1100.00, '10+2');