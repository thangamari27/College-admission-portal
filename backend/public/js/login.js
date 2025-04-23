function attachPasswordToggle() {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);
            if (passwordInput) {
                const isPassword = passwordInput.type === "password";
                passwordInput.type = isPassword ? "text" : "password";
                this.innerHTML = isPassword
                    ?   ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                            </svg> ` 
                    : ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                        </svg> `;
                    
            }
        });
    });
}
attachPasswordToggle();

function loginValidation(){
document.getElementById("admissionformlogin").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

// Get form values
const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value.trim();

// Error containers
const emailErrorContainer = document.querySelector("#loginEmail + .text-danger") || document.createElement("div");
const passwordErrorContainer = document.querySelector("#input-group3 + .text-danger") || document.createElement("div");

emailErrorContainer.classList.add("text-danger");
passwordErrorContainer.classList.add("text-danger");

// Reset errors
emailErrorContainer.textContent = "";
passwordErrorContainer.textContent = "";

let isValid = true;

// Email validation
if (!email) {
    emailErrorContainer.textContent = "Email is required.";
    isValid = false;
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErrorContainer.textContent = "Please enter a valid email address.";
    isValid = false;
}

// Password validation
if (!password) {
    passwordErrorContainer.textContent = "Password is required.";
    isValid = false;
} else if (password.length < 8 || password.length > 20) {
    passwordErrorContainer.textContent = "Password must be between 8 and 20 characters.";
    isValid = false;
}
else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}/.test(password)) {
    passwordErrorContainer.textContent = 'Ex:Ambaiarts@123';
    isValid = false;
} 
else if (/\s/.test(password)) {
    passwordErrorContainer.textContent = 'Password must not contain spaces';
    isValid = false;
}


// Display errors
if (!isValid) {
    document.getElementById("loginEmail").after(emailErrorContainer);
    document.getElementById("input-group3").after(passwordErrorContainer);
    return;
}

 // Get input values
 const formData = {
    email: document.getElementById("loginEmail").value.trim(),
    admission_id: document.getElementById("loginAdId").value.trim(),
    password: document.getElementById("loginPassword").value.trim()
};

// Validate inputs before sending
if (!formData.email || !formData.admission_id || !formData.password) {
    alert("All fields are required!");
    return;
}

try {
    // Send data to the backend using fetch
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: "include"

    });

    console.log(response);

    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
    }

    const result = await response.json();
    console.log('Success:', result);

    var alertSuccessContainer = document.getElementById('successalert');
    if (alertSuccessContainer && response.ok) { 
        var alertStructure = `
            <div class="alert alert-success d-flex align-items-center alert-container text-dark" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2 text-light" viewBox="0 0 16 16" role="img" aria-label="success:">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <div>Login Successfull</div>
            </div>
        `;
        alertSuccessContainer.innerHTML = alertStructure;
    }

    // ✅ Store token in localStorage safely
    if (result.token) {
        localStorage.setItem("token", result.token);
    }
    if (result.admission_id) {
        localStorage.setItem("admissionId", result.admission_id);
    }

    // ✅ Ensure redirect URL exists before redirecting
    if (result.redirectUrl) {
        setTimeout(() => {
            window.location.href = result.redirectUrl;
        }, 2000);
    }
} catch (error) {
    console.error('Error:', error);

    var alertErrorContainer = document.getElementById('successalert');
    if (alertErrorContainer) { // ✅ Check if alert container exists
        var errorAlert = `
            <div class="alert alert-danger d-flex align-items-center alert-container text-dark" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 text-light" viewBox="0 0 16 16" role="img" aria-label="error:">
                    <path d="M8.982 1.566a1 1 0 0 0-1.964 0l-6.9 12.857A1 1 0 0 0 1.992 16h12.016a1 1 0 0 0 .874-1.577l-6.9-12.857zM8 5c.535 0 .954.462.9.995l-.5 5.005a.552.552 0 0 1-1.1 0l-.5-5.005A.905.905 0 0 1 8 5zm.002 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <div>Login failed: ${error.message}</div>
            </div>
        `;
        alertErrorContainer.innerHTML = errorAlert;
    }
}

});
}
loginValidation();

