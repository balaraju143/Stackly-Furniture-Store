
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("stacklySignupForm");

    if (!form) return;

    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("signupConfirmPassword");
    const role = document.getElementById("signupRole");
    const terms = document.getElementById("signupTerms");
    const formMessage = document.getElementById("signupFormMessage");

    const errorElements = {
        email: document.getElementById("signupEmailError"),
        password: document.getElementById("signupPasswordError"),
        confirm: document.getElementById("signupConfirmError"),
        role: document.getElementById("signupRoleError"),
        terms: document.getElementById("signupTermsError")
    };

    const errorTimers = new Map();

    function showError(element, message) {
        clearTimeout(errorTimers.get(element));

        element.textContent = message;

        errorTimers.set(
            element,
            setTimeout(() => {
                element.textContent = "";
                errorTimers.delete(element);
            }, 3000)
        );
    }

    function clearError(element) {
        clearTimeout(errorTimers.get(element));
        errorTimers.delete(element);
        element.textContent = "";
    }

    function clearAllErrors() {
        Object.values(errorElements).forEach(clearError);
        formMessage.textContent = "";
    }

    // Show / hide password
    document.querySelectorAll(".signup-password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            const icon = button.querySelector(".material-symbols-outlined");

            if (!input || !icon) return;

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";
            icon.textContent = isPassword ? "visibility_off" : "visibility";
            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    });

    // Clear the corresponding error when a field is corrected
    email.addEventListener("input", () => clearError(errorElements.email));
    password.addEventListener("input", () => {
        clearError(errorElements.password);
        clearError(errorElements.confirm);
    });
    confirmPassword.addEventListener("input", () => clearError(errorElements.confirm));
    role.addEventListener("change", () => clearError(errorElements.role));
    terms.addEventListener("change", () => clearError(errorElements.terms));

    // GSAP entrance animations
    if (window.gsap) {
        gsap.set(
            [".signup-eyebrow", ".signup-intro h1", ".signup-intro > p"],
            { autoAlpha: 0, y: 18 }
        );

        gsap.set(".signup-card", {
            autoAlpha: 0,
            x: -65
        });

        const entrance = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        entrance
            .to(".signup-eyebrow", {
                autoAlpha: 1,
                y: 0,
                duration: 0.5
            })
            .to(".signup-intro h1", {
                autoAlpha: 1,
                y: 0,
                duration: 0.65
            }, "-=0.25")
            .to(".signup-intro > p", {
                autoAlpha: 1,
                y: 0,
                duration: 0.5
            }, "-=0.3")
            .to(".signup-card", {
                autoAlpha: 1,
                x: 0,
                duration: 0.8
            }, "-=0.15");

        gsap.from(".signup-topbar > *", {
            autoAlpha: 0,
            y: -12,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out"
        });
    }

    // Signup form validation
    form.addEventListener("submit", event => {
        event.preventDefault();
        clearAllErrors();

        let valid = true;

        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValue) {
            showError(errorElements.email, "Please enter your email address.");
            valid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(errorElements.email, "Please enter a valid email address.");
            valid = false;
        }

        if (!passwordValue) {
            showError(errorElements.password, "Please enter a password.");
            valid = false;
        } else if (passwordValue.length < 8) {
            showError(errorElements.password, "Password must contain at least 8 characters.");
            valid = false;
        }

        if (!confirmValue) {
            showError(errorElements.confirm, "Please re-enter your password.");
            valid = false;
        } else if (passwordValue !== confirmValue) {
            showError(errorElements.confirm, "Passwords do not match.");
            valid = false;
        }

        if (!role.value) {
            showError(errorElements.role, "Please select Client or Admin.");
            valid = false;
        }

        if (!terms.checked) {
            showError(errorElements.terms, "Please accept the Terms and Conditions.");
            valid = false;
        }

        if (!valid) {
            formMessage.textContent = "Please correct the highlighted fields.";
            return;
        }

        /*
         * Demo navigation only.
         * A real signup needs a backend to create an account
         * and securely validate the selected role.
         */
        const selectedRole = role.value;

        try {
            sessionStorage.setItem("stacklySignupRole", selectedRole);
        } catch (error) {
            // Navigation can continue if session storage is unavailable.
        }

        formMessage.textContent = "Details validated. Redirecting to login...";

        window.setTimeout(() => {
            window.location.href = "login.html";
        }, 600);
    });
});
