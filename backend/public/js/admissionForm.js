const courses = {
    "UG": {
        "B.Com": ["Regular", "Self Finance"],
        "B.A Econamics": ["Regular"],
        "B.A English": ["Self Finance"],
        "BCA Computer Application": ["Self Finance"]
    },
    "PG": {
        "M.A Econamics": ["Regular"]
    }
};

function showCourseOptions() {
    const courseType = document.getElementById('course-type').value;
    const courseList = document.getElementById('course-list');
    const courseOptionsDiv = document.getElementById('course-options');

    // Clear previous options
    courseList.innerHTML = `<option value="" disabled selected>Select your Course</option>`;
    document.getElementById('course-mode').innerHTML = `<option value="" disabled selected>Select course mode</option>`;

    if (courseType in courses) {
        Object.keys(courses[courseType]).forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseList.appendChild(option);
        });

        courseOptionsDiv.classList.remove('d-none'); // Show course selection
    } else {
        courseOptionsDiv.classList.add('d-none'); // Hide if no selection
    }
}

function updateCourseMode() {
    const courseType = document.getElementById('course-type').value;
    const selectedCourse = document.getElementById('course-list').value;
    const courseMode = document.getElementById('course-mode');

    courseMode.innerHTML = `<option value="" disabled selected>Select course mode</option>`; // Reset course mode

    if (selectedCourse) {
        courses[courseType][selectedCourse].forEach(mode => {
            let option = document.createElement("option");
            option.value = mode;
            option.textContent = mode;
            courseMode.appendChild(option);
        });
    }
}

function nextPage(currentSectionId, targetSectionId, labelId) {
    if (validateForm(currentSectionId)) {
        document.getElementById(currentSectionId).classList.add("d-none");
        document.getElementById(targetSectionId).classList.remove("d-none");
        document.getElementById(labelId).classList.add('completed');
        if (labelId === 'extra-info-label') {
            handleSubmit();
        }
    }
}

function navigateBack(targetSectionId, currentSectionId, labelId) {
    document.getElementById(currentSectionId).classList.add("d-none");
    document.getElementById(targetSectionId).classList.remove("d-none");
    document.getElementById(labelId).classList.remove('completed');
}

// Validate input
function validateForm(sectionId) {
    const section = document.getElementById(sectionId);
    let valid = true;

    const validationRules = {
        "first-name": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "last-name": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "email": { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Please enter a valid email address." },
        "phone": { regex: /^\d{10}$/, error: "Phone number must be 10 digits." },
        "aadhaar": { regex: /^\d{12}$/, error: "Aadhaar number must be 12 digits." },
        "dob": {
            custom: (value) => {
                const currentYear = new Date().getFullYear();
                const birthYear = new Date(value.value).getFullYear();
                return currentYear - birthYear >= 17 && currentYear - birthYear <= 25;
            },
            error: "Date of birth indicates ineligibility. Must be between 17 to 25 years.",
        },
        "father-name": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "father-occupation": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "mother-name": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "mother-occupation": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "annual-income": { regex: /^\d+$/, error: "Only numeric values are allowed." },
        "school-name": { regex: /^[a-zA-Z\s]+$/, error: "Only letters are allowed." },
        "exam-reg-no": { regex: /^\d+$/, error: "Only numeric values are allowed." },
        "school-emi-no": { regex: /^\d+$/, error: "Only numeric values are allowed." },
        "marks-scored": {
            custom: (value) => /^\d+$/.test(value) && value > 0 && value <= 100,
            error: "Marks scored must be a number between 1 and 100.",
        },
        "documents": {
            custom: (field) => field.files[0]?.size <= 100 * 1024, // 100KB
            error: "File size must not exceed 100KB.",
        },
    };

    Array.from(section.querySelectorAll("input, select, textarea")).forEach((field) => {
        const value = field.value.trim();
        const rule = validationRules[field.id];
        let errorMessage = "";

        if (rule) {
            if (rule.regex && !rule.regex.test(value)) {
                errorMessage = rule.error;
            } else if (rule.custom && !rule.custom(field)) {
                errorMessage = rule.error;
            }
        } else if (field.required && !value) {
            errorMessage = `Please fill out the ${field.placeholder || field.id} field.`;
        }

        if (errorMessage) {
            field.classList.add("is-invalid");
            let errorDiv = field.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains("error-message")) {
                errorDiv = document.createElement("div");
                errorDiv.className = "error-message text-danger";
                field.after(errorDiv);
            }
            errorDiv.innerText = errorMessage;
            valid = false;
        } else {
            field.classList.remove("is-invalid");
            const errorDiv = field.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains("error-message")) {
                errorDiv.remove();
            }
        }
    });

    return valid;
}

// Constants for Auto-Save
const storageKey = "formAutoSave";
const encryptionKey = "secureEncryptionKey123"; // Secure key
const ttl = 3600000; // 1 hour (time-to-live)

// Encrypt data using AES
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

// Decrypt data using AES
function decryptData(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Save data to localStorage with expiration
function saveWithExpiration(key, data) {
    const timestamp = Date.now();
    const payload = {
        data: encryptData(data),
        timestamp,
    };
    localStorage.setItem(key, JSON.stringify(payload));
}

// Load data from localStorage, checking for expiration
function loadWithExpiration(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const payload = JSON.parse(item);
    const now = Date.now();

    if (now - payload.timestamp > ttl) {
        localStorage.removeItem(key);
        console.warn("Saved data has expired.");
        return null;
    }

    return decryptData(payload.data);
}

// Auto-save function for individual fields
function autoSave(event) {
    const field = event.target;
    const savedData = loadWithExpiration(storageKey) || {};

    if (field.id) {
        savedData[field.id] = field.value.trim();
    } else if (field.closest("#subject-table")) {
        const rows = Array.from(document.querySelectorAll("#subject-table tr"));
        const tableData = rows.map((row) => {
            const subject = row.querySelector("input[type='text']").value.trim();
            const marks = row.querySelector(".marks-input").value.trim();
            return { subject, marks };
        });
        savedData["subject-table"] = tableData;
    }

    saveWithExpiration(storageKey, savedData);
}

// Initialize subject count
let subjectCount = 0;

// Load saved data when the page loads
window.onload = function () {
    loadSavedData();
};

// Load saved data and populate fields
function loadSavedData() {
    const savedData = loadWithExpiration(storageKey); // Assuming you have loadWithExpiration implemented

    if (savedData) {
        Object.keys(savedData).forEach((key) => {
            if (key === "subject-table") {
                const tableBody = document.getElementById("subject-table");

                // Clear existing rows to avoid duplicates
                tableBody.innerHTML = "";

                // Add rows from saved data
                savedData[key].forEach((rowData) => {
                    addSubjectRow(rowData.subject, rowData.marks);
                });
            } else {
                const field = document.getElementById(key);
                if (field) {
                    field.value = savedData[key];
                }
            }
        });
        calculateMarks(); // Update calculated values on load
    }
}

// Dynamically add a new subject row
function addSubject(subjectName = "", subjectMarks = "") {
    const table = document.getElementById("subject-table");
    const row = document.createElement("tr");
    row.id = `subjects-container-${++subjectCount}`;
    row.innerHTML = `
        <td class="subject-entry"><input type="text" name="subject_${subjectCount}_name" class="form-control" value="${subjectName}" placeholder="Enter subject" required></td>
        <td><input type="number" name="subject_${subjectCount}_marks" class="marks-input" value="${subjectMarks}" placeholder="Enter marks" oninput="calculateMarks()" required></td>
    `;
    table.appendChild(row);
}

// Add subject rows with saved data (helper function)
function addSubjectRow(subjectName, subjectMarks) {
    addSubject(subjectName, subjectMarks);
}

// Add subject data to FormData dynamically
function appendSubjectsToFormData(formData) {
    const subjectsContainer = document.getElementById("subject-table"); // Refers to the table containing subjects
    const subjectRows = subjectsContainer.querySelectorAll("tr[id^='subjects-container']");

    subjectRows.forEach((row, index) => {
        const subjectNameField = row.querySelector('input[name^="subject_"][name$="_name"]');
        const subjectMarksField = row.querySelector('input[name^="subject_"][name$="_marks"]');

        if (subjectNameField && subjectMarksField) {
            formData.append(`subject_${index + 1}_name`, subjectNameField.value);
            formData.append(`subject_${index + 1}_marks`, subjectMarksField.value);
        }
    });
}

// Calculate total marks, percentage, and cut-off
function calculateMarks() {
    const marksInputs = document.querySelectorAll(".marks-input");
    let totalMarks = 0;
    let count = 0;
    let majorSubjects = 0;

    // List of major subject indices (adjust as per requirements)
    const majorSubjectIndices = [2, 3, 4, 5];

    // Calculate total marks and major subject marks
    marksInputs.forEach((input, index) => {
        const value = parseFloat(input.value) || 0;
        totalMarks += value;
        count++;

        if (majorSubjectIndices.includes(index)) {
            majorSubjects += value;
        }
    });

    // Calculate percentage and cut-off marks
    const percentage = ((totalMarks / (count * 100)) * 100).toFixed(2);
    const cutOffMarks = ((majorSubjects / (majorSubjectIndices.length * 100)) * 100).toFixed(2);

    // Update the visible display fields
    document.getElementById("total-marks-display").textContent = totalMarks.toFixed(2);
    document.getElementById("percentage-display").textContent = `${percentage}%`;
    document.getElementById("cut-off-display").textContent = cutOffMarks;

    // Update the hidden input fields for form submission
    document.getElementById("total-marks").value = totalMarks.toFixed(2);
    document.getElementById("percentage").value = percentage;
    document.getElementById("cut-off").value = cutOffMarks;

    // Trigger auto-save for persistence
    if (marksInputs.length > 0) {
        autoSave({ target: marksInputs[0] });
    }
}

// Initialize Auto-Save
function initializeAutoSave() {
    document.querySelectorAll("#personal-info input, #personal-info select, #personal-info textarea, #academic-info input, #subject-table input").forEach((input) => {
        input.addEventListener("input", debouncedAutoSave);
    });
}

// Submit the form
async function submitAdmissionForm(formData) {
    try {
        // Send form data to backend
        const response = await fetch('http://localhost:5000/admission/submitForm', {
            method: "POST",
            body: formData,
        });

        console.log(response);
        const data = await response.json();
        console.log(data);

        // Get the modal container
        const modalContainer = document.getElementById('successModalContent');

        // Handle response
        if (response.ok) {
            // Clear saved data after successful submission
            localStorage.removeItem("formAutoSave");

            modalContainer.innerHTML = `
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="icon text-success" style="font-size: 3rem;">&#10004;</div>
                    <h5 class="text-success">Application Submitted Successfully!</h5>
                    <p>Your application has been received. We will review your details and update you soon.</p>
                    <p><strong>Admission ID:</strong> ${data.admissionID}</p>
                    <p class="text-muted"><small>Note: Save your Admission ID or take a screenshot. You will need it to check your application status on the login page.</small></p>
                </div>
                <div class="modal-footer">
                    <a href="/college-home" id="button1Redirect" class="btn btn-primary d-inline-block">Explore More Courses</a>
                    <a href="/login" id="button2Redirect" class="btn btn-danger d-inline-block">Go to Student Dashboard</a>
                </div>
            `;
        } else {
            modalContainer.innerHTML = `
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="icon text-danger" style="font-size: 3rem;">&#10060;</div>
                    <h5 class="text-danger">Submission Failed</h5>
                    <p>Something went wrong while submitting your application. Please try again later.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            `;
        }

        // Show the modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

    } catch (error) {
        console.error("Error submitting form:", error);

        // Get the modal container
        const modalContainer = document.getElementById('successModalContent');
        modalContainer.innerHTML = `
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <div class="icon text-danger" style="font-size: 3rem;">&#10060;</div>
                <h5 class="text-danger">An error occurred</h5>
                <p>There was an issue processing your request. Please try again later.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        `;

        // Show the modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }
}

// Add event listener to form
const formElement = document.getElementById('admission-form'); 
formElement.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(formElement); // Create FormData object
    submitAdmissionForm(formData); // Submit the form
});
