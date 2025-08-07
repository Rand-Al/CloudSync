/**
 * CloudSync Theme JavaScript - Vanilla JS Version
 *
 * Modern JavaScript implementation without jQuery dependencies.
 * Provides full functionality while maintaining optimal performance
 * and compatibility with the WordPress ecosystem.
 *
 * @package CloudSync
 * @since 1.0.0
 */

(function () {
    "use strict";

    // Wait for DOM to be fully loaded
    document.addEventListener("DOMContentLoaded", function () {
        CloudSync.init();
    });

    // Main theme object containing all functionality
    var CloudSync = {
        /**
         * Initialize all theme functions
         * This method orchestrates the setup of all interactive features
         */
        init: function () {
            this.smoothScrolling();
            this.mobileMenu();
            this.headerScroll();
            this.scrollAnimations();
            this.parallaxCards();
            this.interactiveCards();
            this.initCopyLinkButton();
            this.initAdaptivePages();
        },

        /**
         * Smooth scrolling for internal anchor links
         * Enhances navigation experience with smooth transitions
         */
        smoothScrolling: function () {
            // Find all links that point to page anchors
            var anchorLinks = document.querySelectorAll('a[href^="#"]');

            anchorLinks.forEach(function (link) {
                link.addEventListener("click", function (event) {
                    event.preventDefault();

                    var targetId = this.getAttribute("href");
                    var targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // Calculate position accounting for fixed header
                        var headerHeight = 80;
                        var targetPosition =
                            targetElement.offsetTop - headerHeight;

                        // Smooth scroll to target position
                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth",
                        });
                    }
                });
            });
        },

        /**
         * Mobile navigation menu functionality
         * Handles hamburger menu toggle and accessibility
         */
        mobileMenu: function () {
            var menuToggle = document.querySelector(".menu-toggle");
            var navigation = document.querySelector(".main-navigation ul");

            if (!menuToggle || !navigation) return;

            // Toggle menu when hamburger button is clicked
            menuToggle.addEventListener("click", function () {
                var isExpanded = this.getAttribute("aria-expanded") === "true";
                var icon = this.querySelector("i");

                // Toggle menu visibility
                navigation.classList.toggle("show");

                // Update accessibility attributes
                this.setAttribute("aria-expanded", !isExpanded);

                // Switch between hamburger and close icons
                if (icon) {
                    if (isExpanded) {
                        icon.classList.remove("fa-times");
                        icon.classList.add("fa-bars");
                    } else {
                        icon.classList.remove("fa-bars");
                        icon.classList.add("fa-times");
                    }
                }
            });

            // Close menu when clicking outside navigation area
            document.addEventListener("click", function (event) {
                var isClickInside =
                    navigation.contains(event.target) ||
                    menuToggle.contains(event.target);

                if (!isClickInside) {
                    navigation.classList.remove("show");
                    menuToggle.setAttribute("aria-expanded", "false");

                    var icon = menuToggle.querySelector("i");
                    if (icon) {
                        icon.classList.remove("fa-times");
                        icon.classList.add("fa-bars");
                    }
                }
            });
        },

        /**
         * Dynamic header styling based on scroll position
         * Changes header appearance to improve readability
         */
        headerScroll: function () {
            var header = document.querySelector(".site-header");

            if (!header) return;

            window.addEventListener("scroll", function () {
                var scrollPosition = window.pageYOffset;

                if (scrollPosition > 100) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            });
        },

        /**
         * Scroll-triggered animations for page elements
         * Uses modern Intersection Observer API for performance
         */
        scrollAnimations: function () {
            // Check for Intersection Observer support
            if ("IntersectionObserver" in window) {
                this.setupIntersectionObserver();
            } else {
                // Fallback for older browsers
                this.setupScrollListener();
            }
        },

        /**
         * Modern animation setup using Intersection Observer
         * More efficient than scroll event listeners
         */
        setupIntersectionObserver: function () {
            var observerOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            };

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        // Stop observing once animation is triggered
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Start observing all elements with fade-in class
            var animatedElements = document.querySelectorAll(".fade-in");
            animatedElements.forEach(function (element) {
                observer.observe(element);
            });
        },

        /**
         * Fallback animation setup for older browsers
         * Uses scroll events as alternative to Intersection Observer
         */
        setupScrollListener: function () {
            window.addEventListener("scroll", function () {
                var animatedElements = document.querySelectorAll(
                    ".fade-in:not(.visible)"
                );
                var windowHeight = window.innerHeight;
                var scrollPosition = window.pageYOffset;

                animatedElements.forEach(function (element) {
                    var elementTop = element.offsetTop;

                    if (elementTop < scrollPosition + windowHeight - 50) {
                        element.classList.add("visible");
                    }
                });
            });
        },

        /**
         * Parallax effect for floating cards in hero section
         * Creates subtle movement that adds visual depth
         */
        parallaxCards: function () {
            var floatingCards = document.querySelectorAll(".floating-card");

            if (floatingCards.length === 0) return;

            window.addEventListener("scroll", function () {
                var scrollPosition = window.pageYOffset;
                var parallaxRate = scrollPosition * -0.5;

                floatingCards.forEach(function (card, index) {
                    var offset = parallaxRate * (0.5 + index * 0.1);
                    card.style.transform = "translateY(" + offset + "px)";
                });
            });
        },

        /**
         * Interactive hover effects for cards and interactive elements
         * Enhances user experience with visual feedback
         */
        interactiveCards: function () {
            this.setupFeatureCardEffects();
            this.setupPricingCardEffects();
        },

        /**
         * Setup hover effects for feature cards
         * Creates engaging interactions on mouse events
         */
        setupFeatureCardEffects: function () {
            var featureCards = document.querySelectorAll(".feature-card");

            featureCards.forEach(function (card) {
                card.addEventListener("mouseenter", function () {
                    this.style.transform = "translateY(-10px) scale(1.02)";
                    this.style.transition = "all 0.3s ease";
                });

                card.addEventListener("mouseleave", function () {
                    this.style.transform = "translateY(0) scale(1)";
                    this.style.transition = "all 0.3s ease";
                });
            });
        },

        /**
         * Setup hover effects for pricing cards
         * Handles special case for popular card styling
         */
        setupPricingCardEffects: function () {
            var pricingCards = document.querySelectorAll(".pricing-card");

            pricingCards.forEach(function (card) {
                // Skip hover effects for popular card (has special styling)
                if (card.classList.contains("popular")) return;

                card.addEventListener("mouseenter", function () {
                    this.style.transform = "translateY(-5px)";
                    this.style.borderColor = "#667eea";
                    this.style.transition = "all 0.3s ease";
                });

                card.addEventListener("mouseleave", function () {
                    this.style.transform = "translateY(0)";
                    this.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    this.style.transition = "all 0.3s ease";
                });
            });
        },
        /**
         * Copy link functionality for social sharing
         * Modern clipboard API with fallback for older browsers
         */
        initCopyLinkButton: function () {
            var copyButtons = document.querySelectorAll(".share-copy");

            copyButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    var url = this.getAttribute("data-url");
                    var buttonText = this.querySelector("span");
                    var originalText = buttonText.textContent;

                    // Try modern clipboard API first
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard
                            .writeText(url)
                            .then(function () {
                                showCopySuccess();
                            })
                            .catch(function () {
                                fallbackCopyTextToClipboard(url);
                            });
                    } else {
                        // Fallback for older browsers
                        fallbackCopyTextToClipboard(url);
                    }

                    function showCopySuccess() {
                        button.classList.add("copied");
                        buttonText.textContent = "Copied!";

                        setTimeout(function () {
                            button.classList.remove("copied");
                            buttonText.textContent = originalText;
                        }, 2000);
                    }

                    function fallbackCopyTextToClipboard(text) {
                        var textArea = document.createElement("textarea");
                        textArea.value = text;
                        textArea.style.position = "fixed";
                        textArea.style.left = "-999999px";
                        textArea.style.top = "-999999px";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();

                        try {
                            document.execCommand("copy");
                            showCopySuccess();
                        } catch (err) {
                            console.error(
                                "Fallback: Oops, unable to copy",
                                err
                            );
                        }

                        document.body.removeChild(textArea);
                    }
                });
            });
        },

        /**
         * Initialize adaptive page functionality for intelligent content presentation
         * This system automatically enhances pages based on their content characteristics
         * without requiring manual configuration from users
         */
        initAdaptivePages: function () {
            // Only run on actual pages, not posts or archives
            if (!document.body.classList.contains("page")) return;

            this.setupTableOfContents();
            this.setupReadingProgress();
            this.setupLegalPageNavigation();
            this.setupImageLightbox();
        },

        /**
         * Automatically generate table of contents for long-form content
         * Creates navigation based on page headings for improved user experience
         * and accessibility compliance
         */
        setupTableOfContents: function () {
            console.log("TOC Setup started");

            // Get the main element where classes are applied
            var mainElement = document.querySelector(".site-main");

            console.log("Main element:", mainElement);
            console.log(
                "Main classes:",
                mainElement ? mainElement.className : "not found"
            );

            // Only activate for long content pages - check main element, not body
            if (
                !mainElement ||
                !mainElement.classList.contains("long-content")
            ) {
                console.log("Not long-content, exiting");
                return;
            }

            var tocContainer = document.getElementById("page-toc-content");
            var contentArea = document.querySelector(".entry-content");

            console.log("TOC Container:", tocContainer);
            console.log("Content Area:", contentArea);

            if (!tocContainer || !contentArea) {
                console.log("Missing container or content area");
                return;
            }

            // Find all headings in the content (H2 and H3 for optimal structure)
            var headings = contentArea.querySelectorAll("h2, h3");

            console.log("Headings found:", headings.length);

            if (headings.length < 3) {
                // Hide TOC if insufficient headings for meaningful navigation
                var tocSection = document.querySelector(".page-toc");
                if (tocSection) tocSection.style.display = "none";
                console.log("Too few headings, hiding TOC");
                return;
            }

            // Store reference to CloudSync object for use in event handlers
            var self = this;

            // Create navigation structure with proper accessibility attributes
            var tocList = document.createElement("ul");
            tocList.setAttribute("role", "navigation");
            tocList.setAttribute("aria-label", "Page contents");

            headings.forEach(function (heading, index) {
                // Generate unique ID for linking if not already present
                if (!heading.id) {
                    heading.id = "section-" + (index + 1);
                }

                var listItem = document.createElement("li");
                var link = document.createElement("a");

                link.href = "#" + heading.id;
                link.textContent = heading.textContent;
                link.className =
                    heading.tagName.toLowerCase() === "h3"
                        ? "toc-subsection"
                        : "toc-section";

                // Add smooth scroll behavior for better user experience
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    var target = document.getElementById(heading.id);
                    if (target) {
                        var headerOffset = 120;
                        var elementPosition = target.offsetTop;
                        var offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                        });

                        // Use self reference instead of CloudSync
                        if (self.updateActiveToC) {
                            self.updateActiveToC(link);
                        }
                    }
                });

                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });

            tocContainer.appendChild(tocList);
            tocContainer.style.display = "block";

            console.log("TOC created successfully");

            // Initialize active section tracking
            if (this.initActiveSectionTracking) {
                this.initActiveSectionTracking();
            }
        },

        /**
         * Track active section and update table of contents highlighting
         * Provides visual feedback about user's current reading position
         */
        initActiveSectionTracking: function () {
            var headings = document.querySelectorAll(
                ".entry-content h2, .entry-content h3"
            );
            var tocLinks = document.querySelectorAll("#page-toc-content a");

            if (headings.length === 0 || tocLinks.length === 0) return;

            // Use Intersection Observer for efficient scroll tracking
            if ("IntersectionObserver" in window) {
                var observer = new IntersectionObserver(
                    function (entries) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting) {
                                var activeLink = document.querySelector(
                                    '#page-toc-content a[href="#' +
                                        entry.target.id +
                                        '"]'
                                );
                                if (activeLink) {
                                    CloudSync.updateActiveToC(activeLink);
                                }
                            }
                        });
                    },
                    {
                        rootMargin: "-20% 0px -70% 0px", // Activate when heading is in middle area of viewport
                        threshold: 0,
                    }
                );

                headings.forEach(function (heading) {
                    observer.observe(heading);
                });
            }
        },

        /**
         * Update active table of contents link for visual feedback
         * @param {Element} activeLink - The link element to mark as active
         */
        updateActiveToC: function (activeLink) {
            // Remove active class from all links
            var allTocLinks = document.querySelectorAll("#page-toc-content a");
            allTocLinks.forEach(function (link) {
                link.classList.remove("active");
            });

            // Add active class to current link
            if (activeLink) {
                activeLink.classList.add("active");
            }
        },

        /**
         * Setup reading progress bar for long-form content
         * Provides visual feedback about reading progress through the document
         */
        setupReadingProgress: function () {
            // Only show progress bar for long content
            if (!document.body.classList.contains("long-content")) return;

            var progressBar = document.getElementById("reading-progress-bar");
            var contentArea = document.querySelector(".entry-content");

            if (!progressBar || !contentArea) return;

            // Calculate progress based on content area scroll position
            function updateProgress() {
                var windowHeight = window.innerHeight;
                var documentHeight = contentArea.offsetHeight;
                var scrollTop = window.pageYOffset;
                var contentTop = contentArea.offsetTop;

                // Calculate percentage of content that has been scrolled through
                var progress = Math.max(
                    0,
                    Math.min(
                        100,
                        ((scrollTop - contentTop + windowHeight) /
                            documentHeight) *
                            100
                    )
                );

                progressBar.style.width = progress + "%";
            }

            // Use throttled scroll event for performance optimization
            var throttleTimer = null;
            window.addEventListener("scroll", function () {
                if (throttleTimer) return;

                throttleTimer = setTimeout(function () {
                    updateProgress();
                    throttleTimer = null;
                }, 16); // ~60fps for smooth animation
            });
        },

        /**
         * Enhanced navigation for legal documents with section jumping
         * Improves accessibility and usability of policy pages and legal content
         */
        setupLegalPageNavigation: function () {
            if (!document.body.classList.contains("page-type-legal")) return;

            var contentArea = document.querySelector(".entry-content");
            if (!contentArea) return;

            // Add quick navigation for legal sections
            var legalHeadings = contentArea.querySelectorAll("h2, h3");

            if (legalHeadings.length > 5) {
                // Create floating navigation for easy section jumping
                var quickNav = document.createElement("div");
                quickNav.className = "legal-quick-nav";
                quickNav.innerHTML =
                    '<button type="button" class="quick-nav-toggle">Sections</button>';

                var navList = document.createElement("ul");
                navList.className = "quick-nav-list";

                legalHeadings.forEach(function (heading, index) {
                    if (!heading.id) {
                        heading.id = "legal-section-" + (index + 1);
                    }

                    var listItem = document.createElement("li");
                    var link = document.createElement("a");
                    link.href = "#" + heading.id;
                    link.textContent = heading.textContent;

                    link.addEventListener("click", function (event) {
                        event.preventDefault();
                        heading.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                        quickNav.classList.remove("active");
                    });

                    listItem.appendChild(link);
                    navList.appendChild(listItem);
                });

                quickNav.appendChild(navList);

                // Toggle functionality for mobile-friendly navigation
                quickNav
                    .querySelector(".quick-nav-toggle")
                    .addEventListener("click", function () {
                        quickNav.classList.toggle("active");
                    });

                document.body.appendChild(quickNav);
            }
        },

        /**
         * Simple lightbox functionality for image-rich pages
         * Enhances image viewing experience without external dependencies
         */
        setupImageLightbox: function () {
            if (!document.body.classList.contains("image-rich")) return;

            var contentImages = document.querySelectorAll(".entry-content img");

            contentImages.forEach(function (img) {
                // Skip small images that don't benefit from lightbox
                if (img.width < 400) return;

                img.style.cursor = "pointer";
                img.addEventListener("click", function () {
                    CloudSync.openImageLightbox(this);
                });
            });
        },

        /**
         * Open image in simple overlay lightbox
         * @param {Element} imageElement - The image to display in lightbox
         */
        openImageLightbox: function (imageElement) {
            var lightbox = document.createElement("div");
            lightbox.className = "image-lightbox";
            lightbox.innerHTML =
                '<div class="lightbox-content">' +
                '<img src="' +
                imageElement.src +
                '" alt="' +
                (imageElement.alt || "") +
                '">' +
                '<button type="button" class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
                "</div>";

            // Close lightbox functionality
            function closeLightbox() {
                lightbox.remove();
                document.body.style.overflow = "";
            }

            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });

            lightbox
                .querySelector(".lightbox-close")
                .addEventListener("click", closeLightbox);

            // Keyboard accessibility
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    closeLightbox();
                }
            });

            document.body.appendChild(lightbox);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        },
    };
    // Временно делаем CloudSync глобальным для отладки
    // Удалить в продакшене
    if (typeof window !== "undefined") {
        window.CloudSync = CloudSync;
    }
})();
