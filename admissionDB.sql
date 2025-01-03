-- person info table query
CREATE TABLE PersonalInfo (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    EmailAddress VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(15),
    AadhaarNumber VARCHAR(12) UNIQUE,
    BloodGroup VARCHAR(5),
    DateOfBirth DATE,
    Gender VARCHAR(10),
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

-- academic info tabel query
CREATE TABLE AcademicInfo (
    AcademicID SERIAL PRIMARY KEY,
    StudentID INT,
    SchoolName VARCHAR(100),
    ExamRegisterNumber VARCHAR(20),
    Subjects JSON NOT NULL, 
    TotalMarks INT,
    Percentage NUMERIC(5, 2),
    CutOffMarks NUMERIC(5, 2),
    MonthYearPassing DATE,
    CourseType VARCHAR(50),
    CourseMode VARCHAR(50),
    PassportPhoto LONGBLOB,
    AadhaarCard LONGBLOB,
    TransferCertificate LONGBLOB
);

-- Extra info table query
CREATE TABLE ExtraInfo (
    ExtraID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    PhysicalDisability BOOLEAN,
    ExServiceMan BOOLEAN,
    NSS BOOLEAN,
    NCC BOOLEAN,
    Sports BOOLEAN,
    FOREIGN KEY (StudentID) REFERENCES PersonalInfo(StudentID)
);

