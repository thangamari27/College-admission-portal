function formSwitch() {
    document.addEventListener("DOMContentLoaded", () => {
    
    const formContent = document.getElementById("form-content");
    const templates = {
        signup: `
            <form action="http://localhost:3000/signup" method="post" class="admissionformregister" id="admissionformregister">            
                        <div class="mb-3">
                            <label for="signupEmail" class="form-label">Username</label>
                            <input type="text" class="form-control" id="signupEmail" name="email" placeholder="Enter your email">
                            <div  class="text-danger mt-2"></div>
                        </div>
                        <div class="mb-3">
                            <label for="signupPhoneNumber" class="form-label">Phone No</label>
                            <input type="number" class="form-control" id="signupPhoneNumber" name="phone_no" placeholder="Enter your phone no">
                            <div class="text-danger mt-2"></div>
                        </div>
                         <div class="mb-3">
                            <label for="signupPassword" class="form-label">Create Password</label>
                            <div class="input-group" id="input-group1">
                                <input type="password" class="form-control" id="signupPassword" name="password" placeholder="Create your password">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="signupPassword">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="text-danger mt-2"></div>
                        </div>
                        <div class="mb-3">
                            <label for="signupPasswordConfirm" class="form-label">Confirm Password</label>
                            <div class="input-group" id="input-group2">
                                <input type="password" class="form-control" id="signupPasswordConfirm" placeholder="Confirm password">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="signupPasswordConfirm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="text-danger mt-2"></div>
                        </div>
                        <button type="submit" class="btn btn-custom w-100">SIGNUP</button>
                        <div class="form-text text-center mt-3">
                            If you already have an account, <span id="signin" class="signpage" onclick="formSwitch()">Sign in</span>
                        </div>
                    </form>
        `,
        login: `
            <form action="" method="post" class="admissionformlogin" id="admissionformlogin" autocomplete="off">
                <div class="mb-3">
                    <label for="loginEmail" class="form-label">Username</label>
                    <input type="text" class="form-control" id="loginEmail" placeholder="Enter your email" autocomplete="username">
                    <div class="text-danger mt-2"></div>
                </div>
                <div class="mb-3">
                    <label for="loginPassword" class="form-label">Password</label>
                     <div class="input-group" id="input-group3">
                                <input type="password" class="form-control" id="loginPassword" placeholder="Enter your Password">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="loginPassword">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>
                                </button>
                        </div>
                </div>
                <div class="mb-3 text-end">
                    <a href="#" class="form-text">Forgot password?</a>
                </div>
                <button type="submit" class="btn btn-custom w-100">LOGIN</button>
                <div class="form-text text-center mt-3">
                    Don't have an account? <span id="signup" class="signpage">Sign up</span>
                </div>
            </form>
        `
    };

    function loadForm(type) {
        formContent.innerHTML = type === "login" ? templates.login : templates.signup;
        localStorage.setItem("formType", type);
        // Reattach validation functions
        if (type === "login") {
            loginValidation();
        } else {
            registerValidation();
        }

        // Reattach form switch functionality
        document.getElementById("signin")?.addEventListener("click", () => loadForm("login"));
        document.getElementById("signup")?.addEventListener("click", () => loadForm("signup"));
        attachPasswordToggle()
    }


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

    const savedFormType = localStorage.getItem("formType") || "signin";
    loadForm(savedFormType);
});
}
formSwitch();

function registerValidation(){
    const form = document.getElementById('admissionformregister')
    form.addEventListener('submit', async function (event) {
    event.preventDefault(); 

        // Get form inputs
        const username = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('signupPasswordConfirm').value.trim();
        const phoneNumber = document.getElementById('signupPhoneNumber').value.trim();

        document.querySelectorAll('#admissionformregister .text-danger').forEach((error) => {
            error.textContent = '';
        });

        let isValid = true;
        const usernameErrorContainer = document.querySelector('#signupEmail + .text-danger');
        if (!username) {
            usernameErrorContainer.textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
            usernameErrorContainer.textContent = 'Ex:ambaiarts123@gmail.com';
            isValid = false;
        }

          // Phone number validation
        const phoneNumberErrorContainer = document.querySelector('#signupPhoneNumber + .text-danger');
        if (!phoneNumber) {
            phoneNumberErrorContainer.textContent = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            phoneNumberErrorContainer.textContent = 'Enter a valid 10-digit phone number';
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            phoneNumberErrorContainer.textContent = 'Phone number must start with 6, 7, 8, or 9';
            isValid = false;
        }

        // Validate Password
        const passwordErrorContainer = document.querySelector('#input-group1 + .text-danger');
        if (!password) {
            passwordErrorContainer.textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 8 || password.length > 20) {
            passwordErrorContainer.textContent = 'Password must be between 8 and 20 characters';
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}/.test(password)) {
            passwordErrorContainer.textContent = 'Ex:Ambaiarts@123';
            isValid = false;
        } else if (/\s/.test(password)) {
            passwordErrorContainer.textContent = 'Password must not contain spaces';
            isValid = false;
        }

        // Validate Retype Password
        const confirmPasswordErrorContainer = document.querySelector('#input-group2 + .text-danger');
        if (!confirmPassword || confirmPassword !== password) {
            confirmPasswordErrorContainer.textContent = 'Passwords do not match.';
            isValid = false;
        }
        // Create a FormData object from the form
        const formData = Object.fromEntries(new FormData(event.target).entries());
        console.log(formData);
        try {
            // Send data to the backend using fetch
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            console.log('Success:', result);
            var alertSuccessContainer = document.getElementById('successalert');
            var alertStructure = `
                    <div class="alert alert-primary d-flex align-items-center alert-container text-dark ft-2" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2 text-light" viewBox="0 0 16 16" role="img" aria-label="success:">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <div>Login Success</div>
                    </div>
            `;
            // If all validations pass, submit the form
            if (response.ok) {
                alertSuccessContainer.innerHTML = alertStructure;
            }
            // Optionally, redirect to another page or clear the form
        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem with your signup: ' + error.message);
        }

    });   
}


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
    // Create a FormData object from the form
    const formData = new FormData(this);

    try {
        // Send data to the backend using fetch
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            body: formData // Send the FormData object
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Success:', result);
        var alertSuccessContainer = document.getElementById('successalert');
        var alertStructure = `
                <div class="alert alert-primary d-flex align-items-center alert-container text-dark ft-2" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2 text-light" viewBox="0 0 16 16" role="img" aria-label="success:">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <div>Login Success</div>
                </div>
        `;
        // If all validations pass, submit the form
        if (response.ok) {
            alertSuccessContainer.innerHTML = alertStructure;
        }
        // Optionally, redirect to another page or clear the form
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem with your signup: ' + error.message);
    }
    
});   
}