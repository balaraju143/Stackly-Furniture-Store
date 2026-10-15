
/* ==========================================
   STACKLY FURNITURE ADMIN DASHBOARD
   File: js/admin-dashboard.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ---------- ELEMENTS ----------
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggle = document.getElementById("menuToggle");

  const navLinks = [...document.querySelectorAll(".nav-link")];
  const pages = [...document.querySelectorAll(".admin-page")];

  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");

  // ---------- DYNAMIC ADMIN IDENTITY ----------

  function readStored(keys) {
    for (const key of keys) {
      try {
        const value = localStorage.getItem(key);

        if (value && value.trim()) {
          return value.trim();
        }
      } catch (error) {
        // Browser storage may be disabled.
      }
    }

    return "";
  }

 
function getIdentity() {
    const params = new URLSearchParams(window.location.search);

    const email =
        params.get("email") ||
        readStored([
            "stacklyUserEmail",
            "userEmail",
            "user_email",
            "email",
            "loggedInEmail",
            "stacklyEmail"
        ]) ||
        "admin@stackly.com";

    const storedName =
        params.get("name") ||
        readStored([
            "stacklyUserName",
            "userName",
            "user_name",
            "name",
            "loggedInName",
            "stacklyName"
        ]);

    const name = storedName ||
        email.split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, character => character.toUpperCase());

    const initial = email.trim().charAt(0).toUpperCase() || "A";

    return { email, name, initial };
}

function renderIdentity() {
    const user = getIdentity();

    const identityElements = {
        sidebarAvatar: user.initial,
        headerAvatar: user.initial,
        sidebarName: user.name,
        headerName: user.name,
        sidebarEmail: user.email,
        headerEmail: user.email,
        settingsName: user.name,
        settingsEmail: user.email
    };

    Object.entries(identityElements).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });
}

renderIdentity();

window.addEventListener("storage", event => {
    if (
        [
            "stacklyUserEmail",
            "stacklyUserName",
            "userEmail",
            "userName"
        ].includes(event.key)
    ) {
        renderIdentity();
    }
});

  // ---------- MOBILE SIDEBAR ----------

  function openSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.add("open");
    overlay.classList.add("show");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("show");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("sidebar-open");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  // Close the sidebar if the screen changes to desktop size.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  // ---------- DASHBOARD PAGE NAVIGATION ----------

  function renderPage() {
    if (!pages.length) return;

    const requestedId = (
      window.location.hash || "#overview"
    ).slice(1);

    const activePage = pages.find(
      page => page.id === requestedId
    );

    if (!activePage) {
      if (window.location.hash !== "#overview") {
        window.location.hash = "overview";
      } else {
        const overview = pages.find(
          page => page.id === "overview"
        );

        if (overview) {
          overview.classList.add("active");
        }
      }

      return;
    }

    // Show only the selected dashboard section.
    pages.forEach(page => {
      page.classList.toggle("active", page === activePage);
    });

    // Update active sidebar navigation.
    navLinks.forEach(link => {
      const isActive =
        link.getAttribute("href") === "#" + requestedId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Update header title and subtitle.
    const activeLink = navLinks.find(
      link => link.getAttribute("href") === "#" + requestedId
    );

    if (pageTitle) {
      pageTitle.textContent =
        activeLink?.dataset.title || "Overview";
    }

    if (pageSubtitle) {
      pageSubtitle.textContent =
        activeLink?.dataset.subtitle ||
        "Your furniture store at a glance";
    }

    closeSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  window.addEventListener("hashchange", renderPage);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (link.hash === window.location.hash) {
        renderPage();
      }
    });
  });

  renderPage();

  // ---------- PRODUCT SEARCH AND FILTER ----------

  const productFilter = document.getElementById("productFilter");
  const categoryFilter = document.getElementById("categoryFilter");

  const productRows = [
    ...document.querySelectorAll("#productsTable tbody tr")
  ];

  function filterProducts() {
    const query = (
      productFilter?.value || ""
    ).toLowerCase().trim();

    const category = categoryFilter?.value || "all";

    let visibleCount = 0;

    productRows.forEach(row => {
      const rowText = row.textContent.toLowerCase();

      const matchesText = rowText.includes(query);

      const rowCategory = (
        row.dataset.category || ""
      ).toLowerCase();

      const matchesCategory =
        category === "all" ||
        rowCategory === category.toLowerCase();

      const shouldShow = matchesText && matchesCategory;

      row.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    const count = document.getElementById("productCount");

    if (count) {
      count.textContent =
        `Showing ${visibleCount} product${visibleCount === 1 ? "" : "s"}`;
    }
  }

  productFilter?.addEventListener("input", filterProducts);
  categoryFilter?.addEventListener("change", filterProducts);

  // ---------- ORDER SEARCH AND STATUS FILTER ----------

  const orderFilter = document.getElementById("orderFilter");
  const orderStatusFilter =
    document.getElementById("orderStatusFilter");

  const orderRows = [
    ...document.querySelectorAll("#ordersTable tbody tr")
  ];

  function filterOrders() {
    const query = (
      orderFilter?.value || ""
    ).toLowerCase().trim();

    const status = (
      orderStatusFilter?.value || "all"
    ).toLowerCase();

    let visibleCount = 0;

    orderRows.forEach(row => {
      const matchesText = row.textContent
        .toLowerCase()
        .includes(query);

      const rowStatus = (
        row.dataset.status || ""
      ).toLowerCase();

      const matchesStatus =
        status === "all" || rowStatus === status;

      const shouldShow = matchesText && matchesStatus;

      row.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    const count = document.getElementById("orderCount");

    if (count) {
      count.textContent =
        `Showing ${visibleCount} order${visibleCount === 1 ? "" : "s"}`;
    }
  }

  orderFilter?.addEventListener("input", filterOrders);
  orderStatusFilter?.addEventListener("change", filterOrders);

  // ---------- CUSTOMER SEARCH ----------

  const customerFilter = document.getElementById("customerFilter");

  customerFilter?.addEventListener("input", () => {
    const query = customerFilter.value.toLowerCase().trim();

    document.querySelectorAll(".customer-card").forEach(card => {
      card.hidden = !card.textContent
        .toLowerCase()
        .includes(query);
    });
  });

  // ---------- HEADER ACCOUNT BUTTON ----------

  document.getElementById("headerUser")?.addEventListener(
    "click",
    () => {
      window.location.hash = "settings";
    }
  );

  // ---------- SALES CHART PERIOD SELECTOR ----------

  const salesPeriod = document.getElementById("salesPeriod");

  salesPeriod?.addEventListener("change", event => {
    const bars = [
      ...document.querySelectorAll(".bar-column .bar")
    ];

    const selectedPeriod = event.target.value;

    const multiplier =
      selectedPeriod === "Last 30 days"
        ? 0.88
        : selectedPeriod === "Last 90 days"
          ? 0.76
          : 1;

    const baseValues = [45, 65, 52, 78, 62, 91, 72];

    bars.forEach((bar, index) => {
      const base = baseValues[index % baseValues.length];

      bar.style.height =
        `${Math.max(18, base * multiplier)}%`;
    });
  });

  // ---------- GENERAL TABLE SEARCH ----------

  document.querySelectorAll("[data-table-search]").forEach(input => {
    input.addEventListener("input", () => {
      const selector = input.dataset.tableSearch;
      const table = document.querySelector(selector);

      if (!table) return;

      const query = input.value.toLowerCase().trim();

      table.querySelectorAll("tbody tr").forEach(row => {
        row.hidden = !row.textContent
          .toLowerCase()
          .includes(query);
      });
    });
  });

  // ---------- DEMO COPY PROMOTION CODE ----------

  document.querySelectorAll("[data-copy-code]").forEach(button => {
    button.addEventListener("click", async () => {
      const code = button.dataset.copyCode;

      if (!code) return;

      try {
        await navigator.clipboard.writeText(code);

        const originalText = button.textContent;
        button.textContent = "Copied!";

        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      } catch (error) {
        // Clipboard access may require HTTPS or localhost.
        window.prompt("Copy this promotion code:", code);
      }
    });
  });

  // ---------- SETTINGS FORM DEMO ----------

  document.querySelectorAll("[data-demo-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const message = form.querySelector("[data-form-message]");

      if (message) {
        message.textContent =
          "Settings updated in this demo.";
        message.hidden = false;
      }
    });
  });

  // ---------- LOGOUT ----------

  document.querySelectorAll("[data-admin-logout]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const confirmed = window.confirm(
        "Are you sure you want to log out?"
      );

      if (!confirmed) return;

      // Change this path to your actual login page.
      window.location.href = "login.html";
    });
  });

});
