
document.addEventListener("DOMContentLoaded", function () {
    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded.");
        return;
    }

    const slides = gsap.utils.toArray(".collection-slide");

    if (slides.length < 2) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Set initial slide states
    slides.forEach((slide, index) => {
        const image = slide.querySelector(".collection-image img");
        const content = slide.querySelector(".collection-content");

        gsap.set(slide, {
            autoAlpha: index === 0 ? 1 : 0,
            zIndex: index === 0 ? 2 : 0
        });

        gsap.set(image, {
            xPercent: index === 0 ? 0 : -100,
            scale: 1.05
        });

        gsap.set(content, {
            x: index === 0 ? 0 : 100,
            autoAlpha: index === 0 ? 1 : 0
        });
    });

    function changeSlide() {
        if (isAnimating) return;

        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const nextIndex = (currentIndex + 1) % slides.length;
        const nextSlide = slides[nextIndex];

        const currentImage =
            currentSlide.querySelector(".collection-image img");
        const currentContent =
            currentSlide.querySelector(".collection-content");

        const nextImage =
            nextSlide.querySelector(".collection-image img");
        const nextContent =
            nextSlide.querySelector(".collection-content");

        // Alternate directions on every slide
        const direction = currentIndex % 2 === 0 ? 1 : -1;

        gsap.set(nextSlide, {
            autoAlpha: 1,
            zIndex: 3
        });

        gsap.set(nextImage, {
            xPercent: direction * -100,
            scale: 1.08
        });

        gsap.set(nextContent, {
            x: direction * 100,
            autoAlpha: 0
        });

        const timeline = gsap.timeline({
            defaults: {
                ease: "power2.inOut"
            },
            onComplete: function () {
                gsap.set(currentSlide, {
                    autoAlpha: 0,
                    zIndex: 0
                });

                gsap.set(currentImage, {
                    xPercent: 0,
                    scale: 1.05
                });

                gsap.set(currentContent, {
                    x: 0,
                    autoAlpha: 1
                });

                nextSlide.classList.add("active");
                currentSlide.classList.remove("active");

                gsap.set(nextSlide, {
                    zIndex: 2
                });

                currentIndex = nextIndex;
                isAnimating = false;
            }
        });

        // Current image moves away
        timeline.to(currentImage, {
            xPercent: direction * 100,
            scale: 1.02,
            duration: 1.8
        }, 0);

        // Current content moves in the opposite direction
        timeline.to(currentContent, {
            x: direction * -100,
            autoAlpha: 0,
            duration: 1.3
        }, 0);

        // Incoming image slides in
        timeline.to(nextImage, {
            xPercent: 0,
            scale: 1,
            duration: 2
        }, 0.2);

        // Incoming heading and paragraph slide from the opposite side
        timeline.to(nextContent, {
            x: 0,
            autoAlpha: 1,
            duration: 1.6,
            ease: "power3.out"
        }, 0.45);
    }

    // Wait before the first transition, then loop continuously
    gsap.delayedCall(3, function () {
        changeSlide();

        gsap.delayedCall(5, function repeatSlides() {
            changeSlide();
            gsap.delayedCall(5, repeatSlides);
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".stackly-collections");

    if (!section) return;

    const grid = section.querySelector(".collections-cards");
    const cards = Array.from(
        section.querySelectorAll(".collection-card")
    );
    const filters = Array.from(
        section.querySelectorAll(".collection-filter")
    );

    if (!grid || !cards.length) return;

    const hasGSAP = typeof gsap !== "undefined";
    const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

    if (hasGSAP && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Reveal section heading
    if (hasGSAP && hasScrollTrigger) {
        gsap.from(section.querySelector(".collections-heading-content"), {
            y: 35,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true
            }
        });

        gsap.from(filters, {
            y: 18,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true
            }
        });
    }

    // Animate visible cards and their images
    function animateCards(cardList) {
        if (!hasGSAP) return;

        cardList.forEach(function (card, index) {
            const image = card.querySelector(
                ".collection-card-image img"
            );
            const fromLeft = index % 2 === 0;

            if (hasScrollTrigger) {
                gsap.fromTo(
                    card,
                    {
                        x: fromLeft ? -65 : 65,
                        autoAlpha: 0
                    },
                    {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.85,
                        delay: (index % 3) * 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 92%",
                            once: true
                        }
                    }
                );
            } else {
                gsap.fromTo(
                    card,
                    { x: fromLeft ? -65 : 65, autoAlpha: 0 },
                    {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.85,
                        delay: index * 0.08,
                        ease: "power3.out"
                    }
                );
            }

            // Image slides upward from the bottom
            if (image) {
                gsap.fromTo(
                    image,
                    {
                        yPercent: 100,
                        scale: 1.08
                    },
                    {
                        yPercent: 0,
                        scale: 1,
                        duration:0.5,
                        delay: 0.12,
                        ease: "power3.out",
                        scrollTrigger: hasScrollTrigger ? {
                            trigger: card,
                            start: "top 92%",
                            once: true
                        } : undefined
                    }
                );
            }
        });
    }

    // Initial reveal
    animateCards(cards);

    // Working category filters
    filters.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;

            filters.forEach(function (filter) {
                const isActive = filter === button;

                filter.classList.toggle("active", isActive);
                filter.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            const visibleCards = [];
            const hiddenCards = [];

            cards.forEach(function (card) {
                const matches =
                    selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;

                (matches ? visibleCards : hiddenCards).push(card);
            });

            // Stop previous animations before filtering
            if (hasGSAP) {
                cards.forEach(function (card) {
                    gsap.killTweensOf(card);
                    gsap.killTweensOf(
                        card.querySelector(".collection-card-image img")
                    );

                    if (hasScrollTrigger) {
                        ScrollTrigger.getAll().forEach(function (trigger) {
                            if (trigger.trigger === card) {
                                trigger.kill();
                            }
                        });
                    }
                });
            }

            // Hide non-matching cards
            hiddenCards.forEach(function (card) {
                if (hasGSAP) {
                    gsap.set(card, {
                        autoAlpha: 0,
                        x: 0,
                        display: "none"
                    });
                } else {
                    card.style.display = "none";
                }
            });

            // Show matching cards
            visibleCards.forEach(function (card) {
                if (hasGSAP) {
                    gsap.set(card, {
                        display: "block",
                        autoAlpha: 1,
                        x: 0
                    });
                } else {
                    card.style.display = "block";
                }
            });

            // Refresh positions after grid reflow
            if (hasScrollTrigger) {
                ScrollTrigger.refresh();
            }

            // Animate filtered results
            if (hasGSAP) {
                const images = visibleCards.map(function (card) {
                    return card.querySelector(
                        ".collection-card-image img"
                    );
                });

                gsap.fromTo(
                    visibleCards,
                    {
                        y: 22,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.55,
                        stagger: 0.07,
                        ease: "power2.out",
                        onComplete: function () {
                            gsap.set(visibleCards, { clearProps: "transform" });
                        }
                    }
                );

                gsap.fromTo(
                    images,
                    {
                        yPercent: 35
                    },
                    {
                        yPercent: 0,
                        duration: 0.7,
                        stagger: 0.06,
                        ease: "power2.out"
                    }
                );
            }
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".new-season-section");

    if (!section || typeof gsap === "undefined") {
        return;
    }

    const content = section.querySelector(".new-season-content");
    const label = section.querySelector(".new-season-label");
    const heading = section.querySelector("h2");
    const description = section.querySelector(
        ".new-season-description"
    );
    const features = section.querySelectorAll(".new-season-feature");
    const imageWrap = section.querySelector(".new-season-image-wrap");
    const image = section.querySelector(".new-season-image");

    // Initial states
    gsap.set([label, heading, description, features], {
        autoAlpha: 0
    });

    gsap.set(content, {
        x: -70
    });

    gsap.set(imageWrap, {
        x: 100,
        rotation: 0,
        autoAlpha: 0
    });

    // Main entrance animation
    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .to(content, {
            x: 0,
            duration: 1.1
        }, 0)

        .to(label, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6
        }, 0.15)

        .fromTo(heading,
            {
                x: -35,
                autoAlpha: 0
            },
            {
                x: 0,
                autoAlpha: 1,
                duration: 0.9
            },
            0.25
        )

        .fromTo(description,
            {
                x: -25,
                autoAlpha: 0
            },
            {
                x: 0,
                autoAlpha: 1,
                duration: 0.8
            },
            0.5
        )

        .fromTo(features,
            {
                x: -20,
                autoAlpha: 0
            },
            {
                x: 0,
                autoAlpha: 1,
                duration: 0.65,
                stagger: 0.16
            },
            0.7
        )

        // Image enters from the right and rotates three times
        .to(imageWrap, {
            x: 0,
            rotation: 1080,
            autoAlpha: 1,
            duration: 2.8,
            ease: "power2.out"
        }, 0.1);

    // Trigger animation when the section becomes visible
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            once: true,
            onEnter: function () {
                timeline.play();
            }
        });
    } else {
        timeline.play();
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


document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".stackly-testimonials");

    if (!section || typeof gsap === "undefined") {
        return;
    }

    const heading = section.querySelector(".testimonials-heading");
    const cards = gsap.utils.toArray(
        section.querySelectorAll(".testimonial-card")
    );

    // Respect reduced-motion accessibility settings
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        gsap.set(section.querySelectorAll(
            ".testimonials-heading, .testimonial-card, .testimonial-avatar"
        ), {
            clearProps: "all"
        });
        return;
    }

    // Heading, label and description reveal
    gsap.from(heading.children, {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: typeof ScrollTrigger !== "undefined"
            ? {
                trigger: section,
                start: "top 80%",
                once: true
            }
            : undefined
    });

    // Cards reveal alternately from left and right
    cards.forEach(function (card, index) {
        const avatar = card.querySelector(".testimonial-avatar");
        const fromLeft = index % 2 === 0;

        const cardAnimation = gsap.timeline({
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: card,
                    start: "top 92%",
                    once: true
                }
                : undefined
        });

        cardAnimation.from(card, {
            x: fromLeft ? -75 : 75,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out"
        });

        // Photo drops from above after the card begins appearing
        cardAnimation.from(avatar, {
            y: -100,
            autoAlpha: 0,
            duration: 0.7,
            ease: "bounce.out"
        }, 0.25);
    });
});