
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("stacklyLoginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const roleSelect = document.getElementById("loginRole");
    const passwordToggle = document.getElementById("passwordToggle");
    const formMessage = document.getElementById("loginFormMessage");
    const submitButton = form.querySelector(".login-submit-btn");

    const errorFields = {
        email: document.getElementById("emailError"),
        password: document.getElementById("passwordError"),
        role: document.getElementById("roleError")
    };

    const errorTimers = {};
    let messageTimer;

    /* =========================
       GSAP ENTRANCE ANIMATIONS
    ========================= */

    if (typeof gsap !== "undefined") {
        const intro = document.querySelector(".login-intro");
        const card = document.querySelector(".login-card");
        const topbar = document.querySelector(".login-topbar");
        const bottomNote = document.querySelector(".login-bottom-note");

        gsap.set([topbar, intro, card, bottomNote], {
            willChange: "transform, opacity"
        });

        const entrance = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        entrance
            .from(topbar, {
                y: -20,
                opacity: 0,
                duration: 0.65
            })
            .from(intro, {
                x: 55,
                opacity: 0,
                duration: 0.85
            }, "-=0.3")
            .from(card, {
                x: -65,
                opacity: 0,
                duration: 0.9
            }, "-=0.55")
            .from(bottomNote, {
                y: 12,
                opacity: 0,
                duration: 0.5
            }, "-=0.4");

        entrance.eventCallback("onComplete", () => {
            gsap.set(
                [topbar, intro, card, bottomNote],
                { willChange: "auto" }
            );
        });
    }

    /* =========================
       SHOW / HIDE PASSWORD
    ========================= */

    passwordToggle.addEventListener("click", () => {
        const showPassword = passwordInput.type === "password";

        passwordInput.type = showPassword ? "text" : "password";

        passwordToggle.innerHTML = `
            <span class="material-symbols-outlined">
                ${showPassword ? "visibility_off" : "visibility"}
            </span>
        `;

        passwordToggle.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );
    });

    /* =========================
       ERROR HANDLING
       Errors disappear after 3 seconds
    ========================= */

    function showError(field, message) {
        const input = {
            email: emailInput,
            password: passwordInput,
            role: roleSelect
        }[field];

        const errorElement = errorFields[field];

        clearTimeout(errorTimers[field]);

        errorElement.textContent = message;
        input.setAttribute("aria-invalid", "true");

        errorTimers[field] = setTimeout(() => {
            errorElement.textContent = "";
            input.removeAttribute("aria-invalid");
        }, 3000);
    }

    function clearError(field) {
        const input = {
            email: emailInput,
            password: passwordInput,
            role: roleSelect
        }[field];

        clearTimeout(errorTimers[field]);
        errorFields[field].textContent = "";
        input.removeAttribute("aria-invalid");
    }

    function showFormMessage(message) {
        clearTimeout(messageTimer);

        formMessage.textContent = message;
        formMessage.classList.add("show");

        messageTimer = setTimeout(() => {
            formMessage.textContent = "";
            formMessage.classList.remove("show");
        }, 3000);
    }

    function clearFormMessage() {
        clearTimeout(messageTimer);
        formMessage.textContent = "";
        formMessage.classList.remove("show");
    }

    /* Clear errors while the user corrects fields */
    emailInput.addEventListener("input", () => clearError("email"));
    passwordInput.addEventListener("input", () => clearError("password"));
    roleSelect.addEventListener("change", () => clearError("role"));

    /* =========================
       VALIDATION
    ========================= */

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateForm() {
        let valid = true;

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleSelect.value;

        ["email", "password", "role"].forEach(clearError);
        clearFormMessage();

        if (!email) {
            showError("email", "Please enter your email address.");
            valid = false;
        } else if (!validateEmail(email)) {
            showError("email", "Please enter a valid email address.");
            valid = false;
        }

        if (!password.trim()) {
            showError("password", "Please enter your password.");
            valid = false;
        } else if (password.length < 6) {
            showError(
                "password",
                "Password must contain at least 6 characters."
            );
            valid = false;
        }

        if (!role) {
            showError("role", "Please select Client or Admin.");
            valid = false;
        }

        return valid;
    }

    /* =========================
       LOGIN FORM SUBMISSION
    ========================= */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
   
        const role = roleSelect.value;

        /*
         * DEMO FRONTEND ROUTING ONLY.
         *
         * Connect your backend authentication here before
         * allowing real users into protected dashboards.
         */
        const dashboardRoutes = {
            client: "client-dashboard.html",
            admin: "admin-dashboard.html"
        };

        const destination = dashboardRoutes[role];

        if (!destination) {
            showFormMessage("Please select a valid account role.");
            return;
        }

       
// Save customer details for the dashboard
try {
    const email = emailInput.value.trim();
    const name = email.split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, letter => letter.toUpperCase());

    localStorage.setItem("stacklyUserEmail", email);
    localStorage.setItem("stacklyUserName", name);
    localStorage.setItem("stacklyUserRole", role);
} catch (error) {
    showFormMessage("Unable to save account details. Please try again.");
    return;
}

submitButton.disabled = true;

const buttonText = submitButton.querySelector("span:first-child");
if (buttonText) {
    buttonText.textContent = "Opening dashboard...";
}

window.location.assign(destination);

    });
});
