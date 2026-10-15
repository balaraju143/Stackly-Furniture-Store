
/* ==========================================
   STACKLY 404 — GSAP ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".error-card");
    const logo = document.querySelector(".error-logo");
    const illustration = document.querySelector(".error-illustration");
    const eyebrow = document.querySelector(".error-eyebrow");
    const heading = document.querySelector(".error-content h1");
    const description = document.querySelector(".error-description");
    const buttons = document.querySelectorAll(".error-btn");
    const errorCode = document.querySelector(".error-code");
    const footer = document.querySelector(".error-footer");
    const backButton = document.querySelector("#backButton");

    // Back button
    if (backButton) {
        backButton.addEventListener("click", () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "index.html";
            }
        });
    }

    // Respect reduced-motion settings
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // Display normally if GSAP isn't loaded
    if (typeof gsap === "undefined") {
        return;
    }

    // Initial states
    gsap.set(card, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98
    });

    gsap.set(
        [logo, illustration, eyebrow, heading, description,
         buttons, errorCode, footer],
        {
            autoAlpha: 0,
            y: 18
        }
    );

    // Main reveal timeline
    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .to(card, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65
        })
        .to(logo, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45
        }, "-=0.25")
        .to(illustration, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6
        }, "-=0.2")
        .to(eyebrow, {
            autoAlpha: 1,
            y: 0,
            duration: 0.35
        }, "-=0.25")
        .to(heading, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55
        }, "-=0.15")
        .to(description, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45
        }, "-=0.25")
        .to(buttons, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1
        }, "-=0.15")
        .to([errorCode, footer], {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08
        }, "-=0.15");

    // Gentle illustration float
    gsap.to(".error-icon", {
        y: -5,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
});
