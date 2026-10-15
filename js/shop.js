
/* =========================================
   STACKLY FURNITURE — SHOP PAGE JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const materialFilter = document.getElementById("materialFilter");
    const styleFilter = document.getElementById("styleFilter");
    const sortFilter = document.getElementById("sortFilter");
    const clearFiltersButton = document.getElementById("clearFilters");
    const productGrid = document.getElementById("productGrid");
    const resultCount = document.getElementById("resultCount");
    const filterFeedback = document.getElementById("filterFeedback");
    const noProducts = document.getElementById("noProducts");

    const products = productGrid
        ? Array.from(productGrid.querySelectorAll(".shop-product"))
        : [];

    /* =====================================
       GSAP ENTRANCE ANIMATIONS
    ===================================== */

    if (window.gsap) {
        const entrance = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        entrance
            .from(".shop-copy h1", {
                x: -65,
                opacity: 0,
                duration: 1
            })
            .from(".shop-description", {
                x: -35,
                opacity: 0,
                duration: 0.75
            }, "-=0.55")
            .from(".shop-hero-actions .shop-btn", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.13
            }, "-=0.4")
            .from(".shop-hero-image", {
                x: 65,
                opacity: 0,
                scale: 1.06,
                duration: 1.1
            }, "-=1.15")
            .to(".floating-product-card", {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: "back.out(1.25)"
            }, "-=0.25")
            .from(".shop-toolbar", {
                y: 20,
                opacity: 0,
                duration: 0.65
            }, "-=0.25");

        /* Reveal the product section as it enters the viewport */

        if ("IntersectionObserver" in window) {
            const productObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            ".results-heading",
                            {
                                y: 24,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.7,
                                ease: "power3.out"
                            }
                        );

                        gsap.fromTo(
                            ".shop-product",
                            {
                                y: 28,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.65,
                                stagger: 0.12,
                                ease: "power2.out",
                                clearProps: "transform,opacity"
                            }
                        );

                        productObserver.disconnect();
                    }
                });
            }, {
                threshold: 0.12
            });

            const resultsSection = document.querySelector(".shop-results");

            if (resultsSection) {
                productObserver.observe(resultsSection);
            }
        }
    } else {
        /* Keep everything visible if GSAP cannot load. */
        const floatingCard = document.querySelector(".floating-product-card");

        if (floatingCard) {
            floatingCard.style.opacity = "1";
            floatingCard.style.transform = "none";
        }
    }

    /* =====================================
       FILTER HELPERS
    ===================================== */

    function getSelectedCategory() {
        return categoryFilter?.value || "all";
    }

    function setCategory(category) {
        if (categoryFilter) {
            categoryFilter.value = category;
        }

        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === category;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        applyFilters();
    }

    function matchesPrice(price) {
        const selected = priceFilter?.value || "all";

        if (selected === "under10000") {
            return price < 10000;
        }

        if (selected === "10000-25000") {
            return price >= 10000 && price <= 25000;
        }

        if (selected === "above25000") {
            return price > 25000;
        }

        return true;
    }

    function applyFilters() {
        const category = getSelectedCategory();
        const material = materialFilter?.value || "all";
        const style = styleFilter?.value || "all";

        let visibleCount = 0;

        products.forEach((product) => {
            const productCategory = product.dataset.category;
            const productMaterial = product.dataset.material;
            const productStyle = product.dataset.style;
            const productPrice = Number(product.dataset.price) || 0;

            const categoryMatches =
                category === "all" || productCategory === category;

            const materialMatches =
                material === "all" || productMaterial === material;

            const styleMatches =
                style === "all" || productStyle === style;

            const priceMatches = matchesPrice(productPrice);

            const visible =
                categoryMatches &&
                materialMatches &&
                styleMatches &&
                priceMatches;

            product.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        /* Apply the selected sort order to visible products. */

        const sortOrder = sortFilter?.value || "featured";

        const sortedProducts = [...products].sort((a, b) => {
            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;

            if (sortOrder === "price-low") {
                return priceA - priceB;
            }

            if (sortOrder === "price-high") {
                return priceB - priceA;
            }

            if (sortOrder === "name") {
                return (a.dataset.name || "").localeCompare(
                    b.dataset.name || ""
                );
            }

            /* Featured preserves the original product order. */
            return products.indexOf(a) - products.indexOf(b);
        });

        sortedProducts.forEach((product) => {
            productGrid.appendChild(product);
        });

        if (resultCount) {
            resultCount.textContent =
                `Showing ${visibleCount} ${visibleCount === 1 ? "piece" : "pieces"}`;
        }

        if (noProducts) {
            noProducts.hidden = visibleCount !== 0;
        }

        if (filterFeedback) {
            const activeFilters = [];

            if (category !== "all") activeFilters.push(category);
            if (material !== "all") activeFilters.push(material);
            if (style !== "all") activeFilters.push(style);

            if (priceFilter?.value !== "all") {
                activeFilters.push("price");
            }

            filterFeedback.textContent = activeFilters.length
                ? `Filters applied: ${activeFilters.join(", ")}`
                : "";
        }
    }

    /* =====================================
       CATEGORY BUTTONS
    ===================================== */

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setCategory(button.dataset.category || "all");
        });
    });

    /* Keep category tabs synchronized with dropdown. */

    categoryFilter?.addEventListener("change", () => {
        const category = categoryFilter.value || "all";

        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === category;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        applyFilters();
    });

    /* =====================================
       FILTER AND SORT EVENTS
    ===================================== */

    [priceFilter, materialFilter, styleFilter, sortFilter].forEach((control) => {
        control?.addEventListener("change", applyFilters);
    });

    /* =====================================
       CLEAR ALL FILTERS
    ===================================== */

    clearFiltersButton?.addEventListener("click", () => {
        if (categoryFilter) categoryFilter.value = "all";
        if (priceFilter) priceFilter.value = "all";
        if (materialFilter) materialFilter.value = "all";
        if (styleFilter) styleFilter.value = "all";
        if (sortFilter) sortFilter.value = "featured";

        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === "all";

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        applyFilters();
    });

    /* Initial product list */

    applyFilters();
});



/* ==========================================
   HOLLIS FEATURE - GSAP REVEAL
========================================== */

if (window.gsap) {
    const hollisImage = document.querySelector(".hollis-image-wrap");
    const hollisCard = document.querySelector(".hollis-product-card");

    if (hollisImage && hollisCard) {
        gsap.set(hollisImage, {
            x: -65,
            opacity: 0
        });

        gsap.set(hollisCard, {
            x: 65,
            opacity: 0
        });

        const hollisAnimation = gsap.timeline({
            defaults: {
                ease: "power3.out"
            },
            scrollTrigger: window.ScrollTrigger ? {
                trigger: ".hollis-feature",
                start: "top 82%",
                once: true
            } : undefined
        });

        hollisAnimation
            .to(hollisImage, {
                x: 0,
                opacity: 1,
                duration: 0.9
            })
            .to(hollisCard, {
                x: 0,
                opacity: 1,
                duration: 0.9
            }, "-=0.55");
    }
}

/* ==========================================
   HOLLIS SECTION HEADING - GSAP REVEAL
========================================== */

if (window.gsap) {
    const heading = document.querySelector(".hollis-section-heading");
    const eyebrow = heading?.querySelector("span");
    const title = heading?.querySelector("h2");
    const paragraph = heading?.querySelector("p");

    if (heading && eyebrow && title && paragraph) {
        gsap.set([eyebrow, title, paragraph], {
            opacity: 0,
            y: 25
        });

        const headingTimeline = gsap.timeline({
            paused: true,
            defaults: {
                ease: "power3.out"
            }
        });

        headingTimeline
            .to(eyebrow, {
                opacity: 1,
                y: 0,
                duration: 0.55
            })
            .to(title, {
                opacity: 1,
                y: 0,
                duration: 0.75
            }, "-=0.25")
            .to(paragraph, {
                opacity: 1,
                y: 0,
                duration: 0.65
            }, "-=0.35");

        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.create({
                trigger: heading,
                start: "top 85%",
                once: true,
                onEnter: () => headingTimeline.play()
            });
        } else {
            headingTimeline.play();
        }
    }
}



/* ==========================================
   SHOWROOM FLOOR - GSAP ANIMATIONS
   Add inside your existing DOMContentLoaded
========================================== */

if (window.gsap) {
    const showroom = document.querySelector(".showroom-floor");

    if (showroom) {
        const showroomHeading = showroom.querySelector(".showroom-heading");
        const showroomLabel = showroom.querySelector(".showroom-eyebrow");
        const showroomTitle = showroom.querySelector(".showroom-heading h2");
        const showroomIntro = showroom.querySelector(".showroom-intro");

        /* Heading animation */

        if (showroomHeading) {
            gsap.set(
                [showroomLabel, showroomTitle, showroomIntro].filter(Boolean),
                {
                    opacity: 0,
                    y: 22
                }
            );

            const headingAnimation = () => {
                gsap.timeline({
                    defaults: {
                        ease: "power3.out"
                    }
                })
                .to(showroomLabel, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                })
                .to(showroomTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                }, "-=0.25")
                .to(showroomIntro, {
                    opacity: 1,
                    y: 0,
                    duration: 0.65
                }, "-=0.35");
            };

            if (window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);

                ScrollTrigger.create({
                    trigger: showroomHeading,
                    start: "top 85%",
                    once: true,
                    onEnter: headingAnimation
                });
            } else {
                headingAnimation();
            }
        }

        /* Six image reveal directions */

        const showroomItems = showroom.querySelectorAll(".showroom-item");

        showroomItems.forEach((item, index) => {
            let fromVars = {
                opacity: 0,
                duration: 0.9,
                ease: "power3.out"
            };

            /* Left column enters from left */
            if (item.classList.contains("showroom-left")) {
                fromVars.x = -65;
            }

            /* Middle column enters from above */
            else if (item.classList.contains("showroom-middle")) {
                fromVars.y = -55;
            }

            /* Right column enters from right */
            else if (item.classList.contains("showroom-right")) {
                fromVars.x = 65;
            }

            gsap.set(item, {
                opacity: 0,
                x: fromVars.x || 0,
                y: fromVars.y || 0
            });

            const revealItem = () => {
                gsap.to(item, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.85,
                    delay: (index % 3) * 0.12,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            };

            if (window.ScrollTrigger) {
                ScrollTrigger.create({
                    trigger: item,
                    start: "top 90%",
                    once: true,
                    onEnter: revealItem
                });
            } else {
                revealItem();
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Check GSAP libraries
    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") {
        console.error("GSAP or ScrollTrigger is not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Prevent animations from running twice
    ScrollTrigger.getAll().forEach(function (trigger) {
        if (trigger.vars.id === "shoppingPromise") {
            trigger.kill();
        }
    });

    // Heading and label reveal
    gsap.from(".promise-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            id: "shoppingPromise",
            trigger: ".shopping-promise",
            start: "top 80%",
            once: true
        }
    });

    // Description reveal
    gsap.from(".promise-heading > p", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".shopping-promise",
            start: "top 80%",
            once: true
        }
    });

    // Cards enter from the left
    gsap.from(".promise-left", {
        x: -80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".promise-grid",
            start: "top 85%",
            once: true
        }
    });

    // Cards enter from the right
    gsap.from(".promise-right", {
        x: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".promise-grid",
            start: "top 85%",
            once: true
        }
    });

    // Refresh trigger positions after page layout
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });
});