
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    const sidebar = $("#sidebar");
    const overlay = $("#sidebarOverlay");
    const menuToggle = $("#menuToggle");
    const pages = $$(".dashboard-page");
    const navLinks = $$(".nav-link[data-route]");

    /* ==========================================
       CUSTOMER DETAILS
       Connect these values to your login system.
    ========================================== */

    function readCustomer() {
        const params = new URLSearchParams(window.location.search);

        let email = "";
        let name = "";

        try {
            email =
                localStorage.getItem("stacklyUserEmail") ||
                localStorage.getItem("userEmail") ||
                params.get("email") ||
                "";

            name =
                localStorage.getItem("stacklyUserName") ||
                localStorage.getItem("userName") ||
                params.get("name") ||
                "";
        } catch (error) {
            console.warn("Customer storage is unavailable.");
        }

        email = email.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            email = "customer@example.com";
        }

        name = name.trim();

        if (!name) {
            name = email.split("@")[0]
                .replace(/[._-]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            name = name.replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );
        }

        return { email, name };
    }

    function updateCustomer() {
        const { email, name } = readCustomer();

        // The avatar displays the first letter of the email.
        const initial = email.charAt(0).toUpperCase() || "C";

        $$("[data-avatar]").forEach(avatar => {
            avatar.textContent = initial;
            avatar.title = email;
            avatar.setAttribute(
                "aria-label",
                `Customer account: ${email}`
            );
        });

        $$("[data-customer-name]").forEach(element => {
            element.textContent = name;
        });

        $$("[data-customer-email]").forEach(element => {
            element.textContent = email;
        });

        $$("[data-welcome-name]").forEach(element => {
            element.textContent = name;
        });
    }

    updateCustomer();

    // Refresh the display when another browser tab updates the login.
    window.addEventListener("storage", event => {
        if (
            event.key === "stacklyUserEmail" ||
            event.key === "stacklyUserName" ||
            event.key === "userEmail" ||
            event.key === "userName"
        ) {
            updateCustomer();
        }
    });

    /* ==========================================
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.classList.add("menu-open");

        menuToggle.textContent = "×";
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.classList.remove("menu-open");

        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    menuToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeSidebar();
        }
    });

    /* ==========================================
       DASHBOARD ROUTER
       All views remain in this HTML document.
    ========================================== */

    const validRoutes = new Set(
        pages.map(page => page.id)
    );

    function renderDashboard() {
        let route = decodeURIComponent(
            window.location.hash.slice(1)
        );

        if (!route) {
            route = "overview";
            history.replaceState(null, "", "#overview");
        }

        // Unknown dashboard views go to the 404 page.
        if (!validRoutes.has(route)) {
            window.location.replace("404.html");
            return;
        }

        const activePage = document.getElementById(route);

        pages.forEach(page => {
            const isActive = page.id === route;

            page.classList.toggle("active", isActive);
            page.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });

        navLinks.forEach(link => {
            const isActive = link.dataset.route === route;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        $("#pageHeading").textContent =
            activePage.dataset.title || "My Account";

        $("#pageSubtitle").textContent =
            activePage.dataset.subtitle || "";

        closeSidebar();

        // Start each dashboard view at the top.
       
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});

    }

    window.addEventListener("hashchange", renderDashboard);

    /* ==========================================
       INITIAL VIEW
    ========================================== */

    renderDashboard();
});
