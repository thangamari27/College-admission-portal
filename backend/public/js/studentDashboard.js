async function fetchStudentDashboard() {
    try {
        const response = await fetch("http://localhost:5000/api/student-dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token") // Pass token
            },
            credentials: "include" // Ensure cookies are included
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Dashboard Data:", data);

        // Update Welcome Message
        if (data.FirstName && data.LastName) {
            document.getElementById("welcomeMessage").innerText = `Welcome, ${data.FirstName} ${data.LastName}`;
        }

        // Update Application Status Cards
        updateApplicationStatus(data);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }
}

function updateApplicationStatus(data) {
    if (!data.ApplicationStatus) return;

    if (data.ApplicationStatus === "Pending") {
        document.getElementById("pendingAppCard").style.display = "block";
        document.getElementById("pendingCount").innerText = `Your application is currently pending.`;
    } else if (data.ApplicationStatus === "Approved") {
        document.getElementById("approvedAppCard").style.display = "block";
        document.getElementById("approvedCount").innerText = `Your application has been approved!`;
    } else if (data.ApplicationStatus === "Rejected") {
        document.getElementById("rejectedAppCard").style.display = "block";
        document.getElementById("rejectedCount").innerText = `Unfortunately, your application was rejected.`;
    }
}

// Call the function to fetch the student dashboard data
fetchStudentDashboard();
