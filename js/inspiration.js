document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#inspiration");

    if (!section) return;

    const image = section.querySelector("#inspirationImage");
    const label = section.querySelector(".inspiration-label");
    const heading = section.querySelector(".inspiration-heading h1");
    const descriptionBlock = section.querySelector(
        ".inspiration-description"
    );
    const roomTitle = section.querySelector("#inspirationRoomTitle");
    const description = section.querySelector("#inspirationDescription");
    const card = section.querySelector("#inspirationPriceCard");
    const cardTitle = section.querySelector("#inspirationCardTitle");
    const price = section.querySelector("#inspirationPrice");
    const buttons = section.querySelectorAll(".inspiration-room-btn");

    const hasGSAP = typeof gsap !== "undefined";

    // Replace image paths and example prices with your actual assets/data.
    const rooms = {
        living: {
            image: "assets/Modern Neutral Living Room Cutout.webp",
            alt: "Stackly living room furniture inspiration",
            title: "A living room made for living.",
            description:
                "Complete rooms, designed piece by piece. Discover inviting furniture, natural textures, and thoughtful details that bring your home together.",
            cardTitle: "Living Room Edit",
            price: "₹7,180"
        },

        bedroom: {
            image: "assets/bed-room.webp",
            alt: "Stackly bedroom furniture inspiration",
            title: "Make space for softer moments.",
            description:
                "Create a restful retreat with comfortable beds, tactile fabrics, and calming finishes designed to make every day feel a little more peaceful.",
            cardTitle: "Bedroom Edit",
            price: "₹12,500"
        },

        dining: {
            image: "assets/modern-dining.webp",
            alt: "Stackly dining room furniture inspiration",
            title: "Bring everyone to the table.",
            description:
                "Thoughtfully designed dining tables, inviting chairs, and warm materials turn everyday meals into moments worth sharing.",
            cardTitle: "Dining Room Edit",
            price: "₹9,800"
        },

        office: {
            image: "assets/office.webp",
            alt: "Stackly home office furniture inspiration",
            title: "A better space for big ideas.",
            description:
                "Find the balance between focus and comfort with considered desks, supportive seating, and timeless details for your workspace.",
            cardTitle: "Home Office Edit",
            price: "₹8,400"
        }
    };

    let currentRoom = "living";
    let isChanging = false;

    // Initial reveal
    if (hasGSAP) {
        const contentItems = [
            label,
            heading,
            descriptionBlock,
            buttons.length ? section.querySelector(
                ".inspiration-room-selector"
            ) : null
        ].filter(Boolean);

        gsap.set(contentItems, {
            autoAlpha: 0,
            x: 35
        });

        gsap.set(image, {
            autoAlpha: 0,
            x: -100
        });

        gsap.set(card, {
            autoAlpha: 0,
            y: 25
        });

        const intro = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        intro.to(contentItems, {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.14
        }, 0);

        intro.to(image, {
            autoAlpha: 1,
            x: 0,
            duration: 1.2
        }, 0.2);

        intro.to(card, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75
        }, 0.8);
    }

    function selectRoom(roomKey) {
        if (!rooms[roomKey] || roomKey === currentRoom || isChanging) {
            return;
        }

        const room = rooms[roomKey];

        currentRoom = roomKey;
        isChanging = true;

        // Update active button and accessibility state
        buttons.forEach(function (button) {
            const active = button.dataset.room === roomKey;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        function updateRoomContent() {
            image.src = room.image;
            image.alt = room.alt;
            roomTitle.textContent = room.title;
            description.textContent = room.description;
            cardTitle.textContent = room.cardTitle;
            price.textContent = room.price;
        }

        if (!hasGSAP) {
            updateRoomContent();
            isChanging = false;
            return;
        }

        gsap.killTweensOf([
            image,
            descriptionBlock,
            card,
            roomTitle,
            description,
            cardTitle,
            price
        ]);

        const transition = gsap.timeline({
            onComplete: function () {
                isChanging = false;
            }
        });

        // Current image exits to the left
        transition.to(image, {
            x: -60,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.in"
        }, 0);

        // Content fades out
        transition.to([descriptionBlock, card], {
            y: 12,
            autoAlpha: 0,
            duration: 0.25,
            ease: "power1.in"
        }, 0);

        transition.add(function () {
            updateRoomContent();

            // Prepare the new image to enter from the left
            gsap.set(image, {
                x: -75,
                autoAlpha: 0
            });

            // Prepare new text and card
            gsap.set(descriptionBlock, {
                y: 18,
                autoAlpha: 0
            });

            gsap.set(card, {
                y: 18,
                autoAlpha: 0
            });
        });

        // Wait for the new image to load before revealing it
        transition.add(function () {
            if (image.complete && image.naturalWidth > 0) {
                revealNewRoom();
            } else {
                image.onload = revealNewRoom;
                image.onerror = function () {
                    image.onerror = null;
                    isChanging = false;
                };
            }
        });

        function revealNewRoom() {
            image.onload = null;
            image.onerror = null;

            gsap.to(image, {
                x: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power3.out"
            });

            gsap.to(descriptionBlock, {
                y: 0,
                autoAlpha: 1,
                duration: 0.65,
                delay: 0.08,
                ease: "power3.out"
            });

            gsap.to(card, {
                y: 0,
                autoAlpha: 1,
                duration: 0.65,
                delay: 0.15,
                ease: "power3.out",
                onComplete: function () {
                    isChanging = false;
                }
            });
        }
    }

    // Button interactions
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectRoom(button.dataset.room);
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#room-inspiration");
    if (!section) return;

    const image = section.querySelector("#roomFeatureImage");
    const title = section.querySelector("#roomTitle");
    const description = section.querySelector("#roomDescription");
    const productCard = section.querySelector("#roomProductCard");
    const productName = section.querySelector("#roomProductName");
    const productDescription = section.querySelector(
        "#roomProductDescription"
    );
    const buttons = section.querySelectorAll(".room-product-btn");

    const hasGSAP = typeof gsap !== "undefined";
    let currentProduct = "sofa";
    let isChanging = false;

    // Replace these sample image paths with your actual images.
    const products = {
        sofa: {
            image: "assets/room-living.webp",
            alt: "Marlow sofa in a contemporary living room",
            title: "The Living Room",
            description:
                "Layered olive, walnut and terracotta, built around one deep sofa and a lot of afternoon light.",
            name: "Marlow sofa",
            detail: "A deep, inviting sofa for relaxed everyday living."
        },

        table: {
            image: "assets/coffe-table.webp",
            alt: "Tern coffee table in a warm living room",
            title: "The Living Room",
            description:
                "Natural materials, sculptural silhouettes and considered details make this living space feel complete.",
            name: "Tern coffee table",
            detail: "Sculptural form with a refined, timeless finish."
        },

        chair: {
            image: "assets/chair.webp",
            alt: "Arc lounge chair styled in a contemporary interior",
            title: "The Living Room",
            description:
                "Create a comfortable corner with tactile upholstery, warm wood tones and a chair made for slowing down.",
            name: "Arc lounge chair",
            detail: "A comfortable statement chair for your favorite corner."
        },

        lamp: {
            image: "assets/collection-lantern.webp",
            alt: "Halden floor lamp in a softly lit living room",
            title: "The Living Room",
            description:
                "Warm lighting, soft textures and natural finishes bring a welcoming atmosphere to every evening.",
            name: "Halden floor lamp",
            detail: "Soft ambient lighting for a warm, inviting home."
        }
    };

    // Initial section reveal
    if (hasGSAP) {
        const header = section.querySelector(".room-inspiration-header");
        const explore = section.querySelector(".room-explore-row");

        gsap.set([header, image, productCard, explore], {
            autoAlpha: 0
        });

        const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: section,
                    start: "top 82%",
                    once: true
                }
                : undefined
        });

        intro
            .fromTo(header,
                { y: 25, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 }
            )
            .fromTo(image,
                { x: -70, autoAlpha: 0 },
                { x: 0, autoAlpha: 1, duration: 1.1 },
                "-=0.35"
            )
            .fromTo(productCard,
                { y: -18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65 },
                "-=0.4"
            )
            .fromTo(explore,
                { y: 18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65 },
                "-=0.25"
            );

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    function selectProduct(key) {
        if (!products[key] || key === currentProduct || isChanging) {
            return;
        }

        const product = products[key];
        isChanging = true;

        buttons.forEach(function (button) {
            const active = button.dataset.product === key;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        function updateDetails() {
            image.src = product.image;
            image.alt = product.alt;
            title.textContent = product.title;
            description.textContent = product.description;
            productName.textContent = product.name;
            productDescription.textContent = product.detail;
            currentProduct = key;
        }

        // No GSAP? Update normally.
        if (!hasGSAP) {
            const preload = new Image();

            preload.onload = function () {
                updateDetails();
                isChanging = false;
            };

            preload.onerror = function () {
                isChanging = false;
            };

            preload.src = product.image;
            return;
        }

        // Preload before transition to prevent a blank image.
        const preload = new Image();

        preload.onload = function () {
            gsap.killTweensOf([
                image,
                productCard,
                title,
                description
            ]);

            const transition = gsap.timeline({
                onComplete: function () {
                    isChanging = false;
                }
            });

            transition.to(image, {
                opacity: 0.35,
                scale: 0.99,
                duration: 0.25,
                ease: "power1.out"
            });

            transition.add(function () {
                updateDetails();
            });

            transition.fromTo(image,
                {
                    opacity: 0.35,
                    scale: 1.015
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.65,
                    ease: "power2.out"
                }
            );

            transition.fromTo(productCard,
                { y: 10, opacity: 0.6 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power2.out"
                },
                "-=0.45"
            );

            transition.fromTo(
                [title, description, productName, productDescription],
                { y: 8, opacity: 0.5 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.04,
                    ease: "power2.out"
                },
                "-=0.4"
            );
        };

        preload.onerror = function () {
            // Keep the existing image if the new file cannot load.
            isChanging = false;
            console.error("Could not load image:", product.image);
        };

        preload.src = product.image;
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectProduct(button.dataset.product);
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#bedroom-inspiration");
    if (!section) return;

    const copy = section.querySelector(".bedroom-copy");
    const eyebrow = section.querySelector(".bedroom-eyebrow");
    const title = section.querySelector("#bedroomTitle");
    const description = section.querySelector("#bedroomDescription");
    const image = section.querySelector("#bedroomImage");
    const imageClip = section.querySelector(".bedroom-image-clip");
    const summary = section.querySelector("#bedroomSummary");
    const buttons = section.querySelectorAll(".bedroom-product-btn");

    const hasGSAP = typeof gsap !== "undefined";
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentProduct = "bed";
    let isChanging = false;

    const products = {
        bed: {
            image: "assets/bed-platform.webp",
            alt: "Linen platform bed in a calm, contemporary bedroom",
            title: "Slow Mornings",
            description:
                "A low walnut bed, soft linen, quiet storage and a lamp that glows rather than glares.",
            summary: "4 pieces · ₹4,435"
        },

        nightstand: {
            image: "assets/hollis-nightstand.webp",
            alt: "Hollis wooden nightstand styled beside a bed",
            title: "A Place for Quiet",
            description:
                "Natural wood, thoughtful storage and a considered bedside design for the things you reach for every day.",
            summary: "Hollis Nightstand · View details"
        },

        wardrobe: {
            image: "assets/slab-wardrobe.webp",
            alt: "Sable wardrobe in a warm, minimal bedroom",
            title: "Everything in Its Place",
            description:
                "Simple lines, generous storage and timeless finishes bring calm and order to your bedroom.",
            summary: "Sable Wardrobe · View details"
        },

        lamp: {
            image: "assets/ember-lamp.webp",
            alt: "Ember table lamp casting warm light in a bedroom",
            title: "A Softer Evening",
            description:
                "Warm ambient light and understated details create a restful atmosphere when the day winds down.",
            summary: "Ember Table Lamp · View details"
        }
    };

    // Initial GSAP reveal
    if (hasGSAP && !reducedMotion) {
        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.set(copy, {
            x: -45,
            autoAlpha: 0
        });

        gsap.set(imageClip, {
            x: 55,
            autoAlpha: 0
        });

        const intro = gsap.timeline({
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

        intro
            .to(copy, {
                x: 0,
                autoAlpha: 1,
                duration: 0.9
            })
            .to(imageClip, {
                x: 0,
                autoAlpha: 1,
                duration: 1.05
            }, "-=0.5");
    }

    function setActiveButton(key) {
        buttons.forEach(function (button) {
            const active = button.dataset.product === key;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function selectProduct(key) {
        if (!products[key] || key === currentProduct || isChanging) {
            return;
        }

        const product = products[key];
        isChanging = true;
        setActiveButton(key);

        function updateContent() {
            image.src = product.image;
            image.alt = product.alt;
            title.textContent = product.title;
            description.textContent = product.description;
            summary.textContent = product.summary;
            currentProduct = key;
        }

        // Graceful fallback if GSAP is not loaded
        if (!hasGSAP || reducedMotion) {
            const preload = new Image();

            preload.onload = function () {
                updateContent();
                isChanging = false;
            };

            preload.onerror = function () {
                setActiveButton(currentProduct);
                isChanging = false;
                console.error("Could not load image:", product.image);
            };

            preload.src = product.image;
            return;
        }

        // Preload the next image before starting the transition
        const preload = new Image();

        preload.onload = function () {
            gsap.killTweensOf([
                imageClip,
                image,
                title,
                description,
                summary
            ]);

            const transition = gsap.timeline({
                onComplete: function () {
                    isChanging = false;
                }
            });

            // Move the current image panel slightly left
            transition.to(imageClip, {
                x: -20,
                autoAlpha: 0,
                duration: 0.25,
                ease: "power1.in"
            });

            transition.add(function () {
                updateContent();

                // New image enters from the right
                gsap.set(imageClip, {
                    x: 45,
                    autoAlpha: 0
                });

                gsap.set([title, description, summary], {
                    y: 12,
                    autoAlpha: 0
                });
            });

            transition.to(imageClip, {
                x: 0,
                autoAlpha: 1,
                duration: 0.75,
                ease: "power3.out"
            });

            transition.to([title, description, summary], {
                y: 0,
                autoAlpha: 1,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out"
            }, "-=0.45");
        };

        preload.onerror = function () {
            setActiveButton(currentProduct);
            isChanging = false;
            console.error("Could not load image:", product.image);
        };

        preload.src = product.image;
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectProduct(button.dataset.product);
        });
    });
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

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#small-space-ideas");

    if (!section || typeof gsap === "undefined") return;

    const cards = section.querySelectorAll(".small-space-card");
    const header = section.querySelector(".small-space-header");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Reveal the heading and description
    gsap.from(header, {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: typeof ScrollTrigger !== "undefined"
            ? {
                trigger: header,
                start: "top 85%",
                once: true
            }
            : undefined
    });

    cards.forEach(function (card, index) {
        const imageWrap = card.querySelector(".small-space-image-wrap");
        const image = card.querySelector(".small-space-image");
        const content = card.querySelectorAll(
            ".small-space-category, h3, .small-space-description, .small-space-tags"
        );

        // Keep the image clipped inside its rounded container
        gsap.set(imageWrap, {
            clipPath: "inset(0 0 100% 0 round 13px)"
        });

        gsap.set(image, {
            yPercent: -8,
            scale: 1.04
        });

        gsap.set(content, {
            y: 20,
            autoAlpha: 0
        });

        function animateCard() {
            const timeline = gsap.timeline();

            // Reveal the image container from top to bottom
            timeline.to(imageWrap, {
                clipPath: "inset(0 0 0% 0 round 13px)",
                duration: 1.15,
                ease: "power2.inOut"
            });

            // Image moves down gently within the container
            timeline.to(image, {
                yPercent: 0,
                scale: 1,
                duration: 1.35,
                ease: "power2.out"
            }, "-=1.0");

            // Card content appears smoothly after the image begins revealing
            timeline.to(content, {
                y: 0,
                autoAlpha: 1,
                duration: 0.65,
                stagger: 0.12,
                ease: "power3.out"
            }, "-=0.65");
        }

        function startWhenReady() {
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 86%",
                    once: true,
                    onEnter: animateCard
                });
            } else {
                animateCard();
            }
        }

        // Avoid revealing an unloaded image
        if (image.complete && image.naturalWidth > 0) {
            startWhenReady();
        } else {
            image.addEventListener("load", startWhenReady, { once: true });

            image.addEventListener("error", function () {
                // Don't leave card text hidden if an image path is incorrect
                gsap.set([imageWrap, image, ...content], {
                    clearProps: "all"
                });
            }, { once: true });
        }
    });
});
