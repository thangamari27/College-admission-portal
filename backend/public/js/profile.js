document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("token");
  if (!token) {
      console.warn("No authentication token found. Redirecting to login.");
      window.location.href = "/login";
      return;
  }

  try {
      console.log("Fetching profile data...");
      const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });

      // Check if the response is OK
      if (!response.ok) {
          throw new Error(`Profile fetch failed. Status: ${response.status}`);
      }

      // Destructure the response data
      const { personalInfo, academicInfo, extraInfo } = await response.json();

      // Log the fetched data for debugging
      console.log("Personal Info:", personalInfo);
      console.log("Academic Info:", academicInfo);
      console.log("Extra Info:", extraInfo);

      // Function to update DOM elements safely
      const updateField = (id, value) => {
          const element = document.getElementById(id);
          if (element) {
              element.textContent = value || "N/A"; // Handles null, undefined, and empty values
          } else {
              console.warn(`Element with ID '${id}' not found.`);
          }
      };

      // Function to format date
      const formatDate = (dateString) => {
          if (!dateString) return "N/A"; // Handle empty date
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          });
      };

      // Populate profile sections
      updateField("profileName", `${personalInfo.FirstName || ""} ${personalInfo.LastName || ""}`.trim() || "N/A");
      
      updateField("fullName", `${personalInfo.FirstName || ""} ${personalInfo.LastName || ""}`.trim() || "N/A");
      updateField("gender", personalInfo.Gender);
      updateField("dob", formatDate(personalInfo.DateOfBirth)); // Format the DateOfBirth
      updateField("email", personalInfo.EmailAddress || "N/A");
      updateField("phoneNo", personalInfo.PhoneNumber || "N/A");
      updateField("aadhaarNo", personalInfo.AadhaarNumber || "N/A");
      updateField("bloodGroup", personalInfo.BloodGroup || "N/A");

      updateField("fatherName", personalInfo.FathersName || "N/A");
      updateField("motherName", personalInfo.MothersName || "N/A");
      updateField("fatherOccupation", personalInfo.FathersOccupation || "N/A");
      updateField("motherOccupation", personalInfo.MothersOccupation || "N/A");
      updateField("annualIncome", personalInfo.AnnualIncome || "N/A");

      updateField("courseType", academicInfo.CourseType || "N/A");
      updateField("courseName", academicInfo.CourseName || "N/A");
      updateField("courseMode", academicInfo.CourseMode || "N/A");

      updateField("address", personalInfo.Address || "N/A");
      updateField("nationality", personalInfo.Nationality || "N/A");
      updateField("religion", personalInfo.Religion || "N/A");
      updateField("community", personalInfo.Community || "N/A");
      updateField("caste", personalInfo.Caste || "N/A");

      updateField("schoolName", academicInfo.SchoolName || "N/A");
      updateField("regNo", academicInfo.ExamRegisterNumber || "N/A");
      updateField("yearOfPassing", academicInfo.MonthYearPassing || "N/A");
      updateField("totalMarks", academicInfo.TotalMarks || "N/A");
      updateField("cutOff", academicInfo.CutOffMarks || "N/A");
      updateField("emissNo", academicInfo.Emis_no || "N/A");

      updateField("physicallyChallenged", extraInfo.physically_challenged || "N/A");
      updateField("exServiceMan", extraInfo.ex_serviceman || "N/A");
      updateField("activities", extraInfo.activities || "N/A");

      const subjectTable = document.getElementById("subject-table");

      if (academicInfo.Subjects) {
          let subjects = [];

          // ✅ Try parsing the JSON string
          try {
              subjects = JSON.parse(academicInfo.Subjects);
          } catch (error) {
              console.error("Error parsing subjects data:", error);
          }

          if (Array.isArray(subjects) && subjects.length > 0) {
              subjectTable.innerHTML = "";
              subjects.forEach(({ name, marks }) => {
                  const row = document.createElement("tr");
                  row.innerHTML = `<td>${name || "N/A"}</td><td>${marks || "N/A"}</td>`;
                  subjectTable.appendChild(row);
              });
          } else {
              subjectTable.innerHTML = "<tr><td colspan='2'>No marks available</td></tr>";
          }
      } else {
          subjectTable.innerHTML = "<tr><td colspan='2'>No marks available</td></tr>";
      }

      console.log("Profile successfully loaded and updated in DOM.");
  } catch (error) {
      console.error("Error loading profile:", error);
      alert("An error occurred while loading your profile. Please try again later."); // User-friendly error message
  }
});