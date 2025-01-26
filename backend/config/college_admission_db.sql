CREATE DATABASE college_admission_db;

USE college_admission_db;

-- college courses list
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

-- college course details
CREATE TABLE course_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
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

-- Personal Info table
CREATE TABLE PersonalInfo (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    EmailAddress VARCHAR(100) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(15) NOT NULL,
    AadhaarNumber VARCHAR(12) NOT NULL UNIQUE,
    BloodGroup VARCHAR(5),
    DateOfBirth DATE,
    Gender VARCHAR(15),
    Address TEXT,
    FathersName VARCHAR(50),
    FathersOccupation VARCHAR(50),
    MothersName VARCHAR(50),
    MothersOccupation VARCHAR(50),
    AnnualIncome DECIMAL(10, 2),
    Community VARCHAR(50),
    Caste VARCHAR(50),
    Religion VARCHAR(50),
    Nationality VARCHAR(50)
);

-- Academic Info table
CREATE TABLE AcademicInfo (
    AcademicID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    SchoolName VARCHAR(100) NOT NULL,
    ExamRegisterNumber VARCHAR(20) NOT NULL,
    Emis_no INT NOT NULL,
    Subjects JSON NOT NULL,
    TotalMarks INT,
    MarkPercentage DECIMAL(5, 2),
    CutOffMarks DECIMAL(5, 2),
    MonthYearPassing VARCHAR(7),
    CourseType VARCHAR(50),
    CourseName VARCHAR(50),
    CourseMode VARCHAR(50),
    PassportPhoto LONGBLOB,
    AadhaarCard LONGBLOB,
    TransferCertificate LONGBLOB,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);

-- Extra Info table
CREATE TABLE ExtraInfo (
    ExtraID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    physically_challenged ENUM('Yes', 'No') NOT NULL,
    ex_serviceman ENUM('Yes', 'No') NOT NULL,
    activities VARCHAR(255) NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);

CREATE TABLE AdmissionRecords (
    AdmissionID VARCHAR(15) PRIMARY KEY NOT NULL,
    StudentID INT NOT NULL,
    AdmissionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID) ON DELETE CASCADE
);