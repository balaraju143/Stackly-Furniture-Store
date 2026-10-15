
document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const body = document.body;

    if (!navbar || !menuToggle || !mobileMenu) {
        return;
    }

    /* =========================
       NAVBAR SCROLL EFFECT
    ========================= */

    function handleScroll() {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();

    /* =========================
       OPEN MOBILE MENU
    ========================= */

    function openMenu() {
        mobileMenu.inert = false;
        mobileMenu.setAttribute("aria-hidden", "false");

        menuToggle.classList.add("open");
        mobileMenu.classList.add("open");
        body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    /* =========================
       CLOSE MOBILE MENU
    ========================= */

    function closeMenu() {
        menuToggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        mobileMenu.setAttribute("aria-hidden", "true");
        mobileMenu.inert = true;
    }

    /* =========================
       TOGGLE BUTTON
    ========================= */

    menuToggle.addEventListener("click", function () {
        const isOpen = menuToggle.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    /* =========================
       CLOSE AFTER NAVIGATION
    ========================= */

    mobileMenu.querySelectorAll(".mobile-menu-links a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
        });
    });

    /* =========================
       CLOSE WITH ESCAPE
    ========================= */

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    /* =========================
       CLOSE WHEN RESIZED
    ========================= */

    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });

    /* =========================
       ACTIVE PAGE LINKS
    ========================= */

    const currentFile = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    const pageMap = {
        "index.html": "home",
        "shop.html": "shop",
        "collections.html": "collections",
        "inspiration.html": "inspiration",
        "contact.html": "contact"
    };

    const currentPage = pageMap[currentFile] || "";

    document.querySelectorAll("[data-page]").forEach(function (link) {
        const isActive = link.dataset.page === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

});




/* ==========================================
   STACKLY FOOTER — VALIDATION + GSAP
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector("#furniture-footer");

    if (!footer) return;

    const form = footer.querySelector("#footerNewsletter");
    const emailInput = footer.querySelector("#footerEmail");
    const message = footer.querySelector("#footerFormMessage");
    const submitButton = footer.querySelector(".footer-subscribe-btn");

    let messageTimer;

    /* --------------------------------------
       NEWSLETTER VALIDATION
    -------------------------------------- */

    function showMessage(text, type) {
        clearTimeout(messageTimer);

        message.textContent = text;
        message.className =
            "footer-form-message is-visible is-" + type;

        messageTimer = setTimeout(function () {
            message.classList.remove("is-visible");
        }, 3000);
    }

    function clearMessage() {
        clearTimeout(messageTimer);
        message.textContent = "";
        message.className = "footer-form-message";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!email) {
            showMessage("Please enter your email address.", "error");
            emailInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            emailInput.focus();
            return;
        }

        showMessage("Thank you! Redirecting...", "success");

        submitButton.disabled = true;
        submitButton.textContent = "Please wait...";

        // The newsletter is a front-end demonstration.
        // Redirect only after a valid email is entered.
        window.setTimeout(function () {
            window.location.href = "404.html";
        }, 700);
    });

    emailInput.addEventListener("input", function () {
        if (message.classList.contains("is-error")) {
            clearMessage();
        }
    });

    /* --------------------------------------
       RESET WHEN RETURNING TO THIS PAGE
    -------------------------------------- */

    window.addEventListener("pageshow", function () {
        form.reset();
        clearMessage();

        submitButton.disabled = false;
        submitButton.textContent = "Subscribe";
    });

    /* --------------------------------------
       GSAP REVEAL ANIMATIONS
    -------------------------------------- */

    const revealItems = footer.querySelectorAll(".footer-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    if (typeof gsap === "undefined") {
        return;
    }

    gsap.set(revealItems, {
        autoAlpha: 0,
        y: 24
    });

    function revealFooter() {
        gsap.to(revealItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform"
        });
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: footer,
            start: "top 85%",
            once: true,
            onEnter: revealFooter
        });
    } else {
        revealFooter();
    }
});



document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading animation
    gsap.from(".materials-reveal", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".furniture-materials",
            start: "top 80%",
            once: true
        }
    });

    // Left cards enter from the right
    gsap.from(".material-left", {
        x: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".materials-grid",
            start: "top 78%",
            once: true
        }
    });

    // Right cards enter from the left
    gsap.from(".material-right", {
        x: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".materials-grid",
            start: "top 78%",
            once: true
        }
    });

    // Upper middle card enters from above
    gsap.from(".material-middle-top", {
        y: -75,
        opacity: 0,
        duration: 1.1,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".materials-grid",
            start: "top 78%",
            once: true
        }
    });

    // Lower middle card enters from below
    gsap.from(".material-middle-bottom", {
        y: 75,
        opacity: 0,
        duration: 1.1,
        delay: 0.25,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".materials-grid",
            start: "top 78%",
            once: true
        }
    });
});




/* ========================================
   STACKLY LOADER SCRIPT
======================================== */

(() => {
    const loader = document.getElementById("stacklyLoader");

    if (!loader) return;

    const progressBar = document.getElementById("loaderProgressBar");
    const percentage = document.getElementById("loaderPercentage");

    const duration = 1900;
    const startTime = performance.now();

    let animationFrame;
    let finished = false;

    function hideLoader() {
        if (finished) return;
        finished = true;

        cancelAnimationFrame(animationFrame);

        if (progressBar) progressBar.style.width = "100%";
        if (percentage) percentage.textContent = "100%";

        loader.classList.add("is-hidden");

        window.setTimeout(() => {
            loader.remove();
        }, 600);
    }

    function updateProgress(now) {
        if (finished) return;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth progress that finishes at the target duration.
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        const value = Math.round(easedProgress * 100);

        if (progressBar) {
            progressBar.style.width = value + "%";
        }

        if (percentage) {
            percentage.textContent = String(value).padStart(2, "0") + "%";
        }

        if (progress < 1) {
            animationFrame = requestAnimationFrame(updateProgress);
        } else {
            hideLoader();
        }
    }

    // Fallback: never leave the loader covering the page.
    const fallbackTimer = window.setTimeout(hideLoader, 2200);

    const originalHideLoader = hideLoader;

    // Start the progress animation.
    animationFrame = requestAnimationFrame(updateProgress);

    // If the page is already loaded, keep the same short loader duration.
    if (document.readyState === "complete") {
        // Progress animation continues normally.
    }

    window.addEventListener("pageshow", function () {
        if (finished) {
            loader.remove();
        }
    }, { once: true });
})();
