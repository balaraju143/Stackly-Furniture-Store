
document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#contact-hero");

    if (!section || typeof gsap === "undefined") return;

    const label = section.querySelector(".contact-hero-label");
    const heading = section.querySelector(".contact-hero-heading h1");
    const imageWrap = section.querySelector(".contact-hero-image-wrap");
    const image = section.querySelector(".contact-hero-image");
    const description = section.querySelector(".contact-hero-description");
    const button = section.querySelector(".contact-hero-button");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.set([label, heading], {
        y: 24,
        autoAlpha: 0
    });

    gsap.set(imageWrap, {
        x: -65,
        autoAlpha: 0
    });

    gsap.set([description, button], {
        y: 20,
        autoAlpha: 0
    });

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        },
        scrollTrigger: typeof ScrollTrigger !== "undefined"
            ? {
                trigger: section,
                start: "top 82%",
                once: true
            }
            : undefined
    });

    timeline
        .to(label, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55
        })
        .to(heading, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85
        }, "-=0.25")
        .to(imageWrap, {
            x: 0,
            autoAlpha: 1,
            duration: 1.1
        }, "-=0.35")
        .to([description, button], {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.15
        }, "-=0.45");

    // Gentle image movement after the entrance animation
    if (image) {
        gsap.fromTo(
            image,
            { scale: 1.035 },
            {
                scale: 1,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.6,
                scrollTrigger: typeof ScrollTrigger !== "undefined"
                    ? {
                        trigger: imageWrap,
                        start: "top 85%",
                        once: true
                    }
                    : undefined
            }
        );
    }
});


// STACKLY CONTACT SECTION ANIMATIONS
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const section = document.querySelector(".stackly-contact-info");
    if (!section) return;

    const heading = section.querySelector(".stackly-contact-heading");
    const leftCards = section.querySelectorAll(".contact-card-left");
    const rightCards = section.querySelectorAll(".contact-card-right");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const revealHeading = () => {
        gsap.fromTo(
            heading,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                clearProps: "transform"
            }
        );
    };

    const revealCards = () => {
        gsap.fromTo(
            leftCards,
            { x: -65, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.16,
                ease: "power3.out",
                clearProps: "transform"
            }
        );

        gsap.fromTo(
            rightCards,
            { x: 65, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.16,
                delay: 0.1,
                ease: "power3.out",
                clearProps: "transform"
            }
        );
    };

    if (typeof ScrollTrigger !== "undefined") {
        gsap.set([heading, leftCards, rightCards], {
            opacity: 0
        });

        ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            once: true,
            onEnter: () => {
                revealHeading();
                revealCards();
            }
        });
    } else {
        revealHeading();
        revealCards();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".stackly-message-section");
    const form = document.getElementById("stacklyContactForm");

    if (!section || !form) return;

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const phoneInput = document.getElementById("contactPhone");
    const messageInput = document.getElementById("contactMessage");

    const fields = [nameInput, emailInput, phoneInput, messageInput];
    const errorTimers = new WeakMap();

    // Allow letters and spaces in the name field.
    nameInput.addEventListener("input", () => {
        nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
    });

    // Allow digits only, with a maximum of 10 digits.
    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });

    function showError(input, message) {
        const field = input.closest(".stackly-form-field");
        const error = field.querySelector(".stackly-form-error");

        clearTimeout(errorTimers.get(input));

        error.textContent = message;
        input.classList.add("field-invalid");
        input.classList.remove("field-valid");
        input.setAttribute("aria-invalid", "true");

        // Remove the message after 3 seconds.
        const timer = setTimeout(() => {
            error.textContent = "";
        }, 3000);

        errorTimers.set(input, timer);
    }

    function clearError(input) {
        const field = input.closest(".stackly-form-field");
        const error = field.querySelector(".stackly-form-error");

        clearTimeout(errorTimers.get(input));
        error.textContent = "";
        input.classList.remove("field-invalid");
        input.classList.add("field-valid");
        input.setAttribute("aria-invalid", "false");
    }

    function validateField(input) {
        const value = input.value.trim();

        if (!value) {
            const messages = {
                contactName: "Please enter your name.",
                contactEmail: "Please enter your email address.",
                contactPhone: "Please enter your phone number.",
                contactMessage: "Please enter a message."
            };

            showError(input, messages[input.id]);
            return false;
        }

        if (input === nameInput) {
            if (!/^[a-zA-Z]+(?:[ '\-][a-zA-Z]+)*$/.test(value)) {
                showError(input, "Please enter a valid name using letters only.");
                return false;
            }

            if (value.replace(/[^a-zA-Z]/g, "").length < 2) {
                showError(input, "Name must contain at least 2 letters.");
                return false;
            }
        }

        if (input === emailInput) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (!emailPattern.test(value)) {
                showError(input, "Please enter a valid email address.");
                return false;
            }
        }

        if (input === phoneInput) {
            if (!/^[0-9]{10}$/.test(value)) {
                showError(input, "Please enter a valid 10-digit phone number.");
                return false;
            }
        }

        if (input === messageInput && value.length < 5) {
            showError(input, "Please enter at least 5 characters.");
            return false;
        }

        clearError(input);
        return true;
    }

    // Validate on blur and clear stale errors when corrected.
    fields.forEach((input) => {
        input.addEventListener("blur", () => {
            if (input.value.trim()) validateField(input);
        });

        input.addEventListener("input", () => {
            if (input.classList.contains("field-invalid")) {
                validateField(input);
            } else if (input.classList.contains("field-valid")) {
                validateField(input);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const results = fields.map(validateField);
        const isValid = results.every(Boolean);

        if (!isValid) {
            const firstInvalid = fields.find(
                input => input.getAttribute("aria-invalid") === "true"
            );

            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Reset immediately so returning to this page starts fresh.
        form.reset();

        fields.forEach((input) => {
            clearTimeout(errorTimers.get(input));
            const error = input
                .closest(".stackly-form-field")
                .querySelector(".stackly-form-error");

            error.textContent = "";
            input.classList.remove("field-invalid", "field-valid");
            input.removeAttribute("aria-invalid");
        });

        // Navigate only after client-side validation succeeds.
        window.location.href = "404.html";
    });

    // Reset when the user returns via browser back navigation.
    window.addEventListener("pageshow", () => {
        form.reset();

        fields.forEach((input) => {
            clearTimeout(errorTimers.get(input));

            const error = input
                .closest(".stackly-form-field")
                .querySelector(".stackly-form-error");

            error.textContent = "";
            input.classList.remove("field-invalid", "field-valid");
            input.removeAttribute("aria-invalid");
        });
    });

    // GSAP entrance animations.
    if (
        typeof gsap !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const heading = section.querySelector(".stackly-message-heading");
        const image = section.querySelector(".stackly-message-visual");
        const card = section.querySelector(".stackly-message-card");

        const animateSection = () => {
            gsap.fromTo(
                heading,
                { y: 25, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );

            gsap.fromTo(
                image,
                { x: -70, autoAlpha: 0 },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 1.1,
                    delay: 0.15,
                    ease: "power3.out"
                }
            );

            gsap.fromTo(
                card,
                { x: 70, autoAlpha: 0 },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 1.1,
                    delay: 0.25,
                    ease: "power3.out"
                }
            );
        };

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);

            gsap.set([heading, image, card], { autoAlpha: 0 });

            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: animateSection
            });
        } else {
            animateSection();
        }
    }
});

/* STACKLY LOCATION GSAP ANIMATIONS */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const heading = document.querySelector(".gsap-map-heading");
    const map = document.querySelector(".gsap-map-container");
    const info = document.querySelector(".gsap-map-info");

    if (heading) {
        gsap.from(heading, {
            y: 45,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: heading,
                    start: "top 85%",
                    once: true
                }
                : undefined
        });
    }

    if (map) {
        gsap.from(map, {
            y: 35,
            opacity: 0,
            duration: 1.1,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: map,
                    start: "top 85%",
                    once: true
                }
                : undefined
        });
    }

    if (info) {
        gsap.from(info, {
            x: -55,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: map,
                    start: "top 80%",
                    once: true
                }
                : undefined
        });
    }
});
