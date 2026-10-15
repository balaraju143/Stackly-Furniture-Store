
/* ==========================================
   GSAP FURNITURE HERO ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof gsap === "undefined") {
        console.warn("GSAP could not be loaded.");
        return;
    }

    const hero = document.querySelector(".furniture-hero");

    if (!hero) return;

    const eyebrow = hero.querySelector(".furniture-eyebrow");
    const title = hero.querySelector(".furniture-title");
    const description = hero.querySelector(".furniture-description");
    const buttons = hero.querySelectorAll(".furniture-btn");
    const stats = hero.querySelectorAll(".furniture-stat");

    const room = hero.querySelector(".furniture-room-wrap");
    const sofa = hero.querySelector(".furniture-sofa-wrap");
    const productCard = hero.querySelector(".furniture-product-card");

    /* Respect reduced motion preferences */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    /* Set starting positions */

    gsap.set(
        [eyebrow, title, description, buttons, stats],
        {
            autoAlpha: 0,
            x: -35
        }
    );

    gsap.set(room, {
        autoAlpha: 0,
        x: 45
    });

    gsap.set(sofa, {
        autoAlpha: 0,
        x: -100
    });

    gsap.set(productCard, {
        autoAlpha: 0,
        y: 25
    });

    /* Build entrance timeline */

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .to(eyebrow, {
            autoAlpha: 1,
            x: 0,
            duration: 0.65
        })

        .to(title, {
            autoAlpha: 1,
            x: 0,
            duration: 0.9
        }, "-=0.35")

        .to(description, {
            autoAlpha: 1,
            x: 0,
            duration: 0.7
        }, "-=0.5")

        .to(buttons, {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
            stagger: 0.12
        }, "-=0.35")

        .to(stats, {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12
        }, "-=0.3")

        .to(room, {
            autoAlpha: 1,
            x: 0,
            duration: 1.1
        }, 0.1)

        .to(sofa, {
            autoAlpha: 1,
            x: 0,
            duration: 1.15
        }, "-=0.7")

        .to(productCard, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65
        }, "-=0.4");

});




/* ==========================================
   SHOP BY ROOM — GSAP REVEALS
========================================== */

const roomSection = document.querySelector(".shop-rooms");

if (roomSection && typeof gsap !== "undefined") {

    const roomHeading = roomSection.querySelector(".shop-rooms-heading");
    const roomIntro = roomSection.querySelector(".shop-rooms-intro");

    const roomCards = gsap.utils.toArray(
        roomSection.querySelectorAll("[data-room]")
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {

        gsap.set(roomHeading, {
            autoAlpha: 0,
            x: -45
        });

        gsap.set(roomIntro, {
            autoAlpha: 0,
            x: 35
        });

        gsap.set(roomCards, {
            autoAlpha: 0,
            y: 35
        });

        const roomTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: roomSection,
                start: "top 78%",
                once: true
            },
            defaults: {
                ease: "power3.out"
            }
        });

        roomTimeline
            .to(roomHeading, {
                autoAlpha: 1,
                x: 0,
                duration: 0.7
            })
            .to(roomIntro, {
                autoAlpha: 1,
                x: 0,
                duration: 0.7
            }, "-=0.45")
            .to(roomCards.slice(0, 3), {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.15
            }, "-=0.15")
            .to(roomCards.slice(3), {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.18
            }, "-=0.25");
    }
}



/* ==========================================
   MATERIALS SECTION — GSAP ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof gsap === "undefined") {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const materialsSection = document.querySelector(".materials-section");

    if (!materialsSection) {
        return;
    }

    const materialsImage = materialsSection.querySelector(
        ".materials-visual"
    );

    const materialsContent = materialsSection.querySelector(
        ".materials-content"
    );

    // Image rotates three complete turns, then stays upright.
    gsap.fromTo(
        materialsImage,
        {
            rotation: 1080,
            scale: 0.88,
            opacity: 0
        },
        {
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: materialsSection,
                start: "top 78%",
                once: true
            }
        }
    );

    // Content reveals smoothly from the right.
    gsap.fromTo(
        materialsContent,
        {
            x: 75,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: materialsSection,
                start: "top 78%",
                once: true
            }
        }
    );

});




/* ==========================================
   AUTUMN COLLECTION — GSAP ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".autumn-collection");

    if (!section || typeof gsap === "undefined") {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const heading = section.querySelector(".autumn-heading");
    const intro = section.querySelector(".autumn-intro");
    const products = section.querySelectorAll(".autumn-product");

    // Header enters from opposite sides.
    gsap.set(heading, {
        autoAlpha: 0,
        x: -45
    });

    gsap.set(intro, {
        autoAlpha: 0,
        x: 45
    });

    // Alternate product reveal directions.
    products.forEach(function (product, index) {
        gsap.set(product, {
            autoAlpha: 0,
            x: index % 3 === 0 ? -40 : 40,
            y: 12
        });
    });

    const revealCollection = function () {

        const timeline = gsap.timeline();

        timeline
            .to(heading, {
                autoAlpha: 1,
                x: 0,
                duration: 0.75,
                ease: "power3.out"
            })
            .to(intro, {
                autoAlpha: 1,
                x: 0,
                duration: 0.75,
                ease: "power3.out"
            }, "-=0.45")
            .to(products, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.75,
                stagger: 0.12,
                ease: "power3.out"
            }, "-=0.25");
    };

    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                once: true
            }
        });

        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: revealCollection
        });

    } else {
        // Fallback if ScrollTrigger is unavailable.
        revealCollection();
    }

});



/* ==========================================
   FURNITURE STORY CTA — GSAP REVEAL
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const storySection = document.querySelector("#furniture-story");

    if (!storySection) return;

    const content = storySection.querySelectorAll(
        ".furniture-story-eyebrow, " +
        ".furniture-story-title, " +
        ".furniture-story-description, " +
        ".furniture-story-button"
    );

    // Show content normally if GSAP is unavailable.
    if (
        typeof gsap === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    // Set initial animation state.
    gsap.set(content, {
        autoAlpha: 0,
        y: 25
    });

    let hasAnimated = false;

    function revealStory() {
        if (hasAnimated) return;

        hasAnimated = true;

        gsap.to(content, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: "power3.out",
            clearProps: "transform"
        });
    }

    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: storySection,
            start: "top 82%",
            once: true,
            onEnter: revealStory
        });

    } else {
        // Fallback when ScrollTrigger is not loaded.
        revealStory();
    }

});




/* ==========================================
   BESTSELLERS — GSAP SCROLL ANIMATION
========================================== */
/*
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#bestsellers");

    if (!section) return;

    const header = section.querySelector(".bestsellers-header");
    const intro = section.querySelector(".bestsellers-intro");
    const description = section.querySelector(".bestsellers-description");
    const cards = section.querySelectorAll(".bestseller-card");

    // Respect reduced-motion preferences.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // If GSAP is missing, show the section normally.
    if (typeof gsap === "undefined") {
        return;
    }

    let hasAnimated = false;

    gsap.set([intro, description], {
        autoAlpha: 0,
        y: 24
    });

    gsap.set(cards, {
        autoAlpha: 0,
        y: 45
    });

    function revealBestsellers() {

        if (hasAnimated) return;

        hasAnimated = true;

        const timeline = gsap.timeline();

        timeline
            .to(intro, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            })
            .to(description, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            }, "-=0.4")
            .to(cards, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "transform"
            }, "-=0.2");
    }

    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: revealBestsellers
        });

    } else {
        // Works without ScrollTrigger.
        revealBestsellers();
    }

});
*/


/* ==========================================
   BESTSELLERS — GSAP IMAGE REVEAL ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#bestsellers");

    if (!section) return;

    const intro = section.querySelector(".bestsellers-intro");
    const description = section.querySelector(".bestsellers-description");
    const cards = section.querySelectorAll(".bestseller-card");

    // Respect reduced-motion preferences.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // Fallback if GSAP is not loaded.
    if (typeof gsap === "undefined") {
        return;
    }

    let hasAnimated = false;

    // Prepare text and cards.
    gsap.set([intro, description], {
        autoAlpha: 0,
        y: 25
    });

    gsap.set(cards, {
        autoAlpha: 0,
        y: 35
    });

    // Prepare images for a separate upward reveal.
    cards.forEach(function (card) {

        const image = card.querySelector(".bestseller-image");

        if (image) {
            gsap.set(image, {
                y: 65,
                scale: 1.08
            });
        }

    });

    function revealBestsellers() {

        if (hasAnimated) return;

        hasAnimated = true;

        const timeline = gsap.timeline();

        // Reveal heading and description.
        if (intro) {
            timeline.to(intro, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            });
        }

        if (description) {
            timeline.to(description, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            }, "-=0.4");
        }

        // Cards rise into view one after another.
        timeline.to(cards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out"
        }, "-=0.2");

        // Images move upward inside their cards.
        cards.forEach(function (card, index) {

            const image = card.querySelector(".bestseller-image");

            if (!image) return;

            timeline.to(image, {
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "power3.out",
                clearProps: "transform"
            }, 0.45 + index * 0.12);

        });

    }

    // Trigger when the section enters the viewport.
    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: revealBestsellers
        });

    } else {
        revealBestsellers();
    }

});



/* ==========================================
   WHY STACKLY — GSAP ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#why-stackly");

    if (!section) return;

    const header = section.querySelector(".why-stackly-header");
    const visual = section.querySelector(".why-stackly-visual");
    const image = section.querySelector(".why-stackly-image");
    const cards = section.querySelectorAll(".why-stackly-card");

    // Respect reduced-motion preferences.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // Fallback if GSAP is unavailable.
    if (typeof gsap === "undefined") {
        return;
    }

    let hasAnimated = false;

    // Initial animation states.
    gsap.set(header, {
        autoAlpha: 0,
        y: 25
    });

    gsap.set(visual, {
        autoAlpha: 0,
        x: -45
    });

    if (image) {
        gsap.set(image, {
            y: 35,
            scale: 0.97
        });
    }

    cards.forEach(function (card, index) {

        const fromLeft = index % 2 === 0;

        gsap.set(card, {
            autoAlpha: 0,
            x: fromLeft ? -45 : 45,
            y: 12
        });

    });

    function animateSection() {

        if (hasAnimated) return;

        hasAnimated = true;

        const timeline = gsap.timeline();

        // Heading and paragraph.
        timeline.to(header, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out"
        });

        // Left-side illustration.
        timeline.to(visual, {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out"
        }, "-=0.3");

        // Illustration settles into place.
        if (image) {
            timeline.to(image, {
                y: 0,
                scale: 1,
                duration: 0.9,
                ease: "power3.out"
            }, "-=0.65");
        }

        // Alternate cards from left and right.
        cards.forEach(function (card, index) {

            timeline.to(card, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            }, index === 0 ? "-=0.35" : "<0.12");

        });

    }

    // Scroll-triggered animation.
    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            once: true,
            onEnter: animateSection
        });

    } else {
        animateSection();
    }

});