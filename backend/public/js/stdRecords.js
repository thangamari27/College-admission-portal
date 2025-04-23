document.addEventListener("DOMContentLoaded", async function () {
    await fetchStudents();
});

// 📌 Fetch student records dynamically
async function fetchStudents() {
    try {
        const response = await fetch("http://localhost:5000/api/admin/students");

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON response from server!");
        }

        const studentTableBody = document.getElementById("studentTableBody");
        const noRecordsMessage = document.getElementById("noRecordsMessage");

        studentTableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            noRecordsMessage.style.display = "block";
        } else {
            noRecordsMessage.style.display = "none";
            data.forEach(student => {
                if (!student.StudentID || !student.FirstName || !student.LastName) {
                    console.warn("Skipping incomplete student record:", student);
                    return;
                }

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.StudentID}</td>
                    <td>${student.FirstName} ${student.LastName}</td>
                    <td>${student.EmailAddress || "N/A"}</td>
                    <td>${student.PhoneNumber || "N/A"}</td>
                    <td>${student.CourseName || "N/A"}</td>
                    <td>
                        <span class="status-${(student.ApplicationStatus || "unknown").toLowerCase()}">
                            ${student.ApplicationStatus || "Unknown"}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-btn"
                            data-id="${student.StudentID}" 
                            data-firstname="${student.FirstName}"
                            data-lastname="${student.LastName}"
                            data-email="${student.EmailAddress || ''}"
                            data-phone="${student.PhoneNumber || ''}"
                            data-coursename="${student.CourseName || ''}"
                            data-status="${student.ApplicationStatus || ''}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${student.StudentID}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                studentTableBody.appendChild(row);
            });

            attachEventListeners();
        }
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// 📌 Attach event listeners for edit and delete buttons
function attachEventListeners() {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            openEditModal(
                this.dataset.id,
                this.dataset.firstname,
                this.dataset.lastname,
                this.dataset.email,
                this.dataset.phone,
                this.dataset.coursename,
                this.dataset.status
            );
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            deleteStudent(this.dataset.id);
        });
    });
}

// 📌 Open edit modal
function openEditModal(id, firstName, lastName, email, phone, coursename, status) {
    document.getElementById("editStudentId").value = id;
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editCourseName").value = coursename;
    document.getElementById("editStatus").value = status;

    let modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
}

// 📌 Update student record
document.getElementById("editForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentId = document.getElementById("editStudentId").value;
    const updatedStudent = {
        FirstName: document.getElementById("editFirstName").value,
        LastName: document.getElementById("editLastName").value,
        EmailAddress: document.getElementById("editEmail").value,
        PhoneNumber: document.getElementById("editPhone").value,
        CourseName: document.getElementById("editCourseName").value,
        ApplicationStatus: document.getElementById("editStatus").value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedStudent)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message);
        fetchStudents();

        let modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();
    } catch (error) {
        console.error("Error updating student:", error);
    }
});

// 📌 Delete student record
async function deleteStudent(studentId) {
    if (confirm("Are you sure you want to delete this record?")) {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}
