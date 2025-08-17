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
            this.scrollAnimations();
            this.parallaxCards();
            this.interactiveCards();
            this.initCopyLinkButton(); //TODO What is this!!???
            this.adaptivePages.init();
            this.smartHeader.init();
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
         * Handles hamburger menu toggle, accessibility, and selective scroll lock
         */
        mobileMenu: function () {
            var menuToggle = document.querySelector(".menu-toggle");
            var navigation = document.querySelector(".main-navigation ul");

            if (!menuToggle || !navigation) return;

            /**
             * Lock body scroll but allow menu scroll
             * Prevents background content scrolling while keeping menu navigable
             */
            var lockBodyScroll = function () {
                // Lock body scroll
                document.body.style.overflow = "hidden";

                // Ensure menu container can scroll if needed
                navigation.style.overflowY = "auto";
                navigation.style.maxHeight = "calc(100vh - 80px)"; // Account for header height
            };

            /**
             * Unlock body scroll and reset menu scroll properties
             * Restores normal scrolling behavior for the entire page
             */
            var unlockBodyScroll = function () {
                // Restore body scroll
                document.body.style.overflow = "";

                // Reset menu scroll properties
                navigation.style.overflowY = "";
                navigation.style.maxHeight = "";
            };

            /**
             * Close mobile menu and restore scroll
             * Centralizes menu closing logic to ensure consistent behavior
             */
            var closeMenu = function () {
                navigation.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
                unlockBodyScroll(); // Always unlock body scroll when closing menu

                var icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            };

            /**
             * Open mobile menu and lock body scroll
             * Centralizes menu opening logic
             */
            var openMenu = function () {
                navigation.classList.add("show");
                menuToggle.setAttribute("aria-expanded", "true");
                lockBodyScroll(); // Lock body scroll but allow menu scroll

                var icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                }
            };

            // Toggle menu when hamburger button is clicked
            menuToggle.addEventListener("click", function () {
                var isExpanded = this.getAttribute("aria-expanded") === "true";

                if (isExpanded) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Close menu when clicking outside navigation area
            document.addEventListener("click", function (event) {
                var isClickInside =
                    navigation.contains(event.target) ||
                    menuToggle.contains(event.target);

                var isMenuOpen = navigation.classList.contains("show");

                if (!isClickInside && isMenuOpen) {
                    closeMenu();
                }
            });

            // Close menu on window resize to desktop size
            window.addEventListener("resize", function () {
                var isMenuOpen = navigation.classList.contains("show");

                if (window.innerWidth >= 768 && isMenuOpen) {
                    closeMenu();
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
         * Smart Header Module for CloudSync Theme
         *
         * Provides intelligent header behavior that hides/shows based on scroll direction.
         * Enhances user experience by maximizing content visibility while maintaining
         * easy access to navigation when needed.
         *
         * @since 1.0.0
         * @author CloudSync Theme
         */
        smartHeader: {
            /**
             * Module configuration
             * These settings control header behavior and can be customized per implementation
             */
            config: {
                offset: 100, // Scroll position to start tracking (pixels)
                tolerance: 5, // Minimum scroll change to trigger action (pixels)
                hideClass: "header-hidden", // CSS class for hidden state
                scrollClass: "header-scrolled", // CSS class for scrolled state
                headerSelector: ".site-header", // DOM selector for header element
            },

            /**
             * Internal module state
             * Tracks current scroll position and animation frame optimization
             */
            state: {
                lastScrollPosition: 0, // Previous scroll position for direction detection
                ticking: false, // requestAnimationFrame optimization flag
                headerElement: null, // Cached DOM reference to header
                isInitialized: false, // Prevents duplicate initialization
            },

            /**
             * Get current scroll position
             * Cross-browser compatible method for retrieving scroll offset
             *
             * @returns {number} Current vertical scroll position in pixels
             */
            getCurrentScrollPosition: function () {
                return window.pageYOffset || window.scrollY || 0;
            },

            /**
             * Hide header element
             * Applies CSS class that should contain transform animation for smooth hiding
             */
            hideHeader: function () {
                if (this.state.headerElement) {
                    this.state.headerElement.classList.add(
                        this.config.hideClass
                    );
                }
            },

            /**
             * Show header element
             * Removes hiding CSS class to restore header visibility
             */
            showHeader: function () {
                if (this.state.headerElement) {
                    this.state.headerElement.classList.remove(
                        this.config.hideClass
                    );
                }
            },

            /**
             * Main header update logic
             * Analyzes scroll direction and applies appropriate header state.
             * Called via requestAnimationFrame for optimal performance.
             */
            updateHeader: function () {
                const currentScrollPosition = this.getCurrentScrollPosition();
                const scrollDifference =
                    currentScrollPosition - this.state.lastScrollPosition;

                // Ignore micro-movements to prevent header jitter
                if (Math.abs(scrollDifference) < this.config.tolerance) {
                    this.state.ticking = false;
                    return;
                }

                // Page top: always show header without scroll styling
                if (currentScrollPosition <= 0) {
                    this.showHeader();
                    this.state.headerElement.classList.remove(
                        this.config.scrollClass
                    );
                }
                // Past offset threshold: apply smart hiding logic
                else if (currentScrollPosition > this.config.offset) {
                    // Add scrolled styling for background/shadow effects
                    this.state.headerElement.classList.add(
                        this.config.scrollClass
                    );

                    // Hide on downward scroll, show on upward scroll
                    if (scrollDifference > 0) {
                        this.hideHeader();
                    } else {
                        this.showHeader();
                    }
                }
                // Between top and offset: show header without scroll styling
                else {
                    this.showHeader();
                    this.state.headerElement.classList.remove(
                        this.config.scrollClass
                    );
                }

                // Update position tracking for next frame
                this.state.lastScrollPosition = currentScrollPosition;
                this.state.ticking = false;
            },

            /**
             * Optimized scroll event handler
             * Uses requestAnimationFrame to throttle updates to screen refresh rate
             */
            requestUpdate: function () {
                if (!this.state.ticking) {
                    window.requestAnimationFrame(this.updateHeader.bind(this));
                    this.state.ticking = true;
                }
            },

            /**
             * Initialize smart header functionality
             * Sets up event listeners and applies initial state based on current scroll position
             *
             * @returns {boolean} True if initialization successful, false otherwise
             */
            init: function () {
                // Prevent duplicate initialization
                if (this.state.isInitialized) {
                    return false;
                }

                // Locate header element in DOM
                this.state.headerElement = document.querySelector(
                    this.config.headerSelector
                );

                if (!this.state.headerElement) {
                    console.error(
                        "CloudSync SmartHeader: Header element not found with selector:",
                        this.config.headerSelector
                    );
                    return false;
                }

                // Bind scroll event with context preservation
                this.scrollHandler = this.requestUpdate.bind(this);
                window.addEventListener("scroll", this.scrollHandler, {
                    passive: true,
                });

                // Apply initial state if page is already scrolled
                const currentPosition = this.getCurrentScrollPosition();
                if (currentPosition > this.config.offset) {
                    this.state.headerElement.classList.add(
                        this.config.scrollClass
                    );
                }

                this.state.isInitialized = true;
                return true;
            },

            /**
             * Clean up module resources
             * Removes event listeners and resets header to default state
             */
            destroy: function () {
                if (this.scrollHandler) {
                    window.removeEventListener("scroll", this.scrollHandler);
                }

                // Reset header to visible state with no styling
                if (this.state.headerElement) {
                    this.showHeader();
                    this.state.headerElement.classList.remove(
                        this.config.scrollClass
                    );
                }

                // Reset internal state
                this.state.lastScrollPosition = 0;
                this.state.ticking = false;
                this.state.headerElement = null;
                this.state.isInitialized = false;
            },

            /**
             * Update module configuration
             * Allows runtime modification of behavior settings
             *
             * @param {Object} newConfig - Configuration object with properties to override
             */
            updateConfig: function (newConfig) {
                Object.assign(this.config, newConfig);
            },
        },
    };
    /**
     * CloudSync Adaptive Pages System - Production Architecture
     *
     * This system automatically enhances pages based on content analysis,
     * providing intelligent navigation, reading progress, and interactive features.
     * Built with modular architecture for maintainability and extensibility.
     *
     * Architecture Overview:
     * - Core: Main coordinator and shared utilities
     * - TOC: Table of contents with desktop/mobile adaptations
     * - Progress: Reading progress tracking
     * - Legal: Enhanced navigation for legal documents
     * - Lightbox: Image viewing enhancement
     *
     * @package CloudSync
     * @since 1.0.0
     */

    CloudSync.adaptivePages = {
        // Основная конфигурация остается той же
        config: {
            tocMinHeadings: 3,
            tocDesktopBreakpoint: 768,
            tocScrollOffset: 150,
            scrollThrottle: 16,
            resizeDebounce: 250,
            enableTOC: true,
            enableProgress: true,
            enableLegalNav: true,
            enableLightbox: true,
            debug: true,
        },

        state: {
            isInitialized: false,
            activeModules: [],
            currentBreakpoint: null,
            pageContext: null,
        },

        modules: {
            tableOfContents: {
                config: {
                    minHeadings: 3,
                    maxDepth: 6,
                    headingSelector:
                        ".entry-content h1, .entry-content h2, .entry-content h3, .entry-content h4, .entry-content h5, .entry-content h6",
                    containerSelector: ".page-content-wrapper",
                    scrollOffset: 120,
                },
                state: {
                    // Lifecycle states
                    isInitialized: false,
                    isReady: false,

                    // Content data
                    headings: [],
                    tocStructure: null,

                    // Responsive behavior
                    currentBreakpoint: null,
                    currentMode: "hidden", // 'desktop', 'mobile', 'hidden'

                    // User interaction
                    activeHeading: null,
                    isScrolling: false,

                    // DOM references for performance
                    tocElements: {
                        desktopContainer: null,
                        mobileContainer: null,
                        progressBar: null,
                        tocList: null,
                    },

                    // Intersection Observer for performance
                    observer: null,

                    // Event handlers for cleanup
                    eventHandlers: {
                        scroll: null,
                        resize: null,
                        click: null,
                    },
                },
                init: function () {
                    // Create utility reference for cleaner code
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Starting Table of Contents module initialization"
                    );
                    try {
                        // Prevent duplicate initialization
                        if (this.state.isInitialized) {
                            utils.log(
                                "TOC module already initialized, skipping"
                            );
                            return true;
                        }

                        // Check if we're on a suitable page for TOC
                        if (
                            !document.body ||
                            !document.body.classList.contains("page")
                        ) {
                            utils.log(
                                "Not on a page context, TOC initialization cancelled"
                            );
                            return false;
                        }

                        // Scan page content for headings
                        utils.log("Scanning page for headings...");
                        var headingsScanResult = this.scanHeadings();

                        if (
                            !headingsScanResult ||
                            this.state.headings.length === 0
                        ) {
                            utils.log(
                                "No headings found on page, TOC not needed"
                            );
                            return false;
                        }

                        if (
                            this.state.headings.length < this.config.minHeadings
                        ) {
                            utils.log(
                                "Insufficient headings for TOC: found " +
                                    this.state.headings.length +
                                    ", minimum required " +
                                    this.config.minHeadings
                            );
                            return false;
                        }
                        utils.log(
                            "Successfully found " +
                                this.state.headings.length +
                                " headings for TOC"
                        );
                        // Determine display mode based on current breakpoint
                        var currentBreakpoint =
                            CloudSync.adaptivePages.state.currentBreakpoint;
                        utils.log("Current breakpoint: " + currentBreakpoint);

                        if (currentBreakpoint === "desktop") {
                            this.state.currentMode = "desktop";
                            utils.log("TOC will use desktop floating mode");
                        } else {
                            this.state.currentMode = "mobile";
                            utils.log("TOC will use mobile collapsible mode");
                        }
                        // Create TOC interface based on selected mode
                        utils.log(
                            "Creating TOC interface for " +
                                this.state.currentMode +
                                " mode"
                        );

                        var interfaceCreated = false;

                        if (this.state.currentMode === "desktop") {
                            interfaceCreated = this.createDesktopTOC();
                        } else if (this.state.currentMode === "mobile") {
                            interfaceCreated = this.createMobileTOC();
                            utils.log("Mobile TOC");
                        }

                        if (!interfaceCreated) {
                            utils.log(
                                "Failed to create TOC interface, initialization aborted",
                                "error"
                            );
                            return false;
                        }

                        utils.log("TOC interface created successfully");
                        // Bind interactive events and behaviors
                        utils.log("Binding TOC interactive events");

                        var eventsBindingResult = this.bindEvents();

                        if (!eventsBindingResult) {
                            utils.log(
                                "Failed to bind TOC events, initialization incomplete",
                                "error"
                            );
                            return false;
                        }

                        utils.log("TOC events bound successfully");
                        // Mark module as fully initialized and ready
                        this.state.isInitialized = true;
                        this.state.isReady = true;

                        utils.log(
                            "Table of Contents module initialization completed successfully"
                        );
                        utils.log(
                            "Active mode: " +
                                this.state.currentMode +
                                ", headings: " +
                                this.state.headings.length
                        );

                        return true;
                    } catch (error) {
                        utils.log(
                            "Critical error during TOC initialization",
                            "error",
                            error
                        );
                        utils.log("Error message: " + error.message, "error");
                        if (error.stack) {
                            utils.log("Error stack: " + error.stack, "error");
                        }

                        // Ensure state remains clean after error
                        this.state.isInitialized = false;
                        this.state.isReady = false;

                        return false;
                    }
                },
                destroy: function () {},
                scanHeadings: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log("Starting headings scan process");

                    // Clear any existing headings data
                    this.state.headings = [];

                    // Find all headings using configured selector
                    var headingElements = document.querySelectorAll(
                        this.config.headingSelector
                    );
                    utils.log(
                        "Found " +
                            headingElements.length +
                            " potential heading elements"
                    );

                    if (headingElements.length === 0) {
                        utils.log(
                            "No heading elements found with selector: " +
                                this.config.headingSelector
                        );
                        return false;
                    }

                    // Process each heading element to extract navigation data
                    for (var i = 0; i < headingElements.length; i++) {
                        var headingElement = headingElements[i];

                        // Extract heading level from tag name (H1 = 1, H2 = 2, etc.)
                        var tagName = headingElement.tagName.toLowerCase();
                        var level = parseInt(tagName.charAt(1), 10);

                        // Get the text content, cleaned of any HTML markup
                        var text =
                            headingElement.textContent ||
                            headingElement.innerText ||
                            "";
                        text = text.trim();

                        // Skip empty headings - they provide no value for navigation
                        if (!text) {
                            utils.log(
                                "Skipping empty heading element at position " +
                                    i
                            );
                            continue;
                        }

                        utils.log(
                            'Processing heading: "' +
                                text +
                                '" (level ' +
                                level +
                                ")"
                        );

                        // Handle heading ID - use existing or generate new unique one
                        var headingId = headingElement.id;

                        if (!headingId) {
                            // Generate new ID based on heading text
                            headingId = utils.generateUniqueId(text, "heading");
                            headingElement.id = headingId;
                            utils.log(
                                "Generated new ID for heading: " + headingId
                            );
                        } else {
                            // Verify existing ID is unique in document
                            var duplicateElements = document.querySelectorAll(
                                "#" + headingId
                            );
                            if (duplicateElements.length > 1) {
                                // ID conflict detected, generate new unique ID
                                var newId = utils.generateUniqueId(
                                    text,
                                    "heading"
                                );
                                headingElement.id = newId;
                                headingId = newId;
                                utils.log(
                                    "Resolved ID conflict, assigned new ID: " +
                                        headingId
                                );
                            } else {
                                utils.log(
                                    "Using existing unique ID: " + headingId
                                );
                            }
                        }
                        // Create heading data object with all necessary information
                        var headingData = {
                            element: headingElement, // Reference to DOM element
                            id: headingId, // Unique identifier for navigation
                            text: text, // Display text for TOC link
                            level: level, // Heading hierarchy level (1-6)
                            offsetTop: 0, // Will be calculated later for scroll positioning
                        };

                        // Add processed heading to our collection
                        this.state.headings.push(headingData);
                        utils.log(
                            "Added heading to collection: " +
                                text +
                                " (ID: " +
                                headingId +
                                ")"
                        );
                    }
                    // Calculate accurate scroll positions for all processed headings
                    utils.log(
                        "Calculating scroll positions for navigation accuracy"
                    );

                    for (var j = 0; j < this.state.headings.length; j++) {
                        var heading = this.state.headings[j];
                        heading.offsetTop = heading.element.offsetTop;

                        utils.log(
                            'Heading "' +
                                heading.text +
                                '" position: ' +
                                heading.offsetTop +
                                "px"
                        );
                    }
                    // Final validation and summary of scan results
                    if (this.state.headings.length === 0) {
                        utils.log(
                            "Scan completed but no valid headings were processed",
                            "warn"
                        );
                        return false;
                    }

                    utils.log("Headings scan completed successfully");
                    utils.log(
                        "Total headings processed: " +
                            this.state.headings.length
                    );
                    utils.log(
                        "Heading levels found: " + this.getHeadingLevelsRange()
                    );

                    return true;
                },
                getHeadingLevelsRange: function () {
                    // Return empty indicator if no headings processed
                    if (
                        !this.state.headings ||
                        this.state.headings.length === 0
                    ) {
                        return "none";
                    }

                    // Extract all unique heading levels from processed headings
                    var levels = [];
                    for (var i = 0; i < this.state.headings.length; i++) {
                        var level = this.state.headings[i].level;
                        if (levels.indexOf(level) === -1) {
                            levels.push(level);
                        }
                    }

                    // Sort levels numerically for proper range calculation
                    levels.sort(function (a, b) {
                        return a - b;
                    });

                    // Format the range information for human readability
                    if (levels.length === 1) {
                        return "H" + levels[0];
                    } else {
                        return (
                            "H" + levels[0] + "-H" + levels[levels.length - 1]
                        );
                    }
                },
                generateTOC: function () {},

                bindEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this; // Store reference for use in event handlers

                    utils.log(
                        "Setting up adaptive TOC event handlers for " +
                            this.state.currentMode +
                            " mode"
                    );

                    // Check what type of interface we actually have created
                    var hasDesktopTOC =
                        this.state.tocElements.desktopContainer !== null;
                    var hasMobileTOC =
                        this.state.tocElements.mobileContainer !== null;

                    // Validate that we have at least one interface to work with
                    if (!hasDesktopTOC && !hasMobileTOC) {
                        utils.log(
                            "No TOC interface found (neither desktop nor mobile), cannot bind events",
                            "error"
                        );
                        return false;
                    }

                    utils.log(
                        "TOC interface availability - Desktop: " +
                            hasDesktopTOC +
                            ", Mobile: " +
                            hasMobileTOC
                    );

                    // Setup desktop-specific event handlers if desktop TOC exists
                    if (hasDesktopTOC) {
                        utils.log("Setting up desktop TOC event handlers");

                        // Setup intelligent visibility management for desktop floating TOC
                        this.setupDesktopVisibility();

                        // Setup navigation link handlers for desktop smooth scrolling
                        this.setupDesktopNavigationHandlers();

                        // Setup collapse/expand functionality for desktop TOC
                        this.setupDesktopCollapseHandlers();

                        utils.log(
                            "Desktop TOC event handlers bound successfully"
                        );
                    }

                    // Setup mobile-specific event handlers if mobile TOC exists
                    if (hasMobileTOC) {
                        utils.log("Setting up mobile TOC event handlers");

                        // Setup floating button interaction for showing/hiding panel
                        this.setupMobileButtonHandlers();

                        // Setup panel navigation and interaction handlers
                        this.setupMobilePanelHandlers();

                        // Setup touch gestures for panel dismissal
                        this.setupMobileTouchHandlers();

                        utils.log(
                            "Mobile TOC event handlers bound successfully"
                        );
                    }

                    // Setup universal event handlers that work for both interfaces
                    utils.log("Setting up universal TOC event handlers");

                    // Setup scroll tracking for active section highlighting (works for both)
                    this.setupScrollTracking();

                    // Setup reading progress tracking (works for both)
                    this.setupProgressTracking();

                    // Setup window resize handler for responsive behavior
                    this.setupResponsiveHandlers();

                    utils.log("All TOC event handlers bound successfully");
                    return true;
                },
                setupMobileButtonHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this; // Preserve context for event handlers

                    utils.log(
                        "Setting up mobile TOC button interaction handlers"
                    );

                    // Get reference to the floating button we created earlier
                    // This button serves as the primary interaction point for mobile users
                    var floatingButton = this.state.tocElements.floatingButton;
                    if (!floatingButton) {
                        utils.log(
                            "Mobile TOC button not found, cannot setup button handlers",
                            "error"
                        );
                        return false;
                    }

                    // Initialize button state tracking
                    // This helps us manage the open/closed state of the navigation panel
                    this.state.mobileButtonState = {
                        isPanelOpen: false,
                        isAnimating: false,
                        lastTapTime: 0,
                    };

                    // Primary click/tap handler for opening and closing the navigation panel
                    // This is the main interaction that users will use to access TOC navigation
                    var primaryClickHandler = function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        // Prevent rapid successive taps that could cause animation conflicts
                        var currentTime = Date.now();
                        if (
                            currentTime -
                                self.state.mobileButtonState.lastTapTime <
                            300
                        ) {
                            utils.log(
                                "Rapid tap detected, ignoring to prevent animation conflicts"
                            );
                            return;
                        }
                        self.state.mobileButtonState.lastTapTime = currentTime;

                        // Check if we're currently animating to prevent interruption
                        if (self.state.mobileButtonState.isAnimating) {
                            utils.log(
                                "Button animation in progress, ignoring tap"
                            );
                            return;
                        }

                        // Toggle the panel state and execute the appropriate action
                        if (self.state.mobileButtonState.isPanelOpen) {
                            utils.log("Closing mobile TOC panel");
                            self.closeMobilePanel();
                        } else {
                            utils.log("Opening mobile TOC panel");
                            self.openMobilePanel();
                        }

                        // Update button's ARIA state for accessibility
                        floatingButton.setAttribute(
                            "aria-expanded",
                            self.state.mobileButtonState.isPanelOpen
                                ? "false"
                                : "true"
                        );
                    };

                    // Enhanced touch handler for better mobile experience
                    // This provides immediate visual feedback when user touches the button
                    var touchStartHandler = function (event) {
                        // Add visual feedback class for immediate response
                        floatingButton.classList.add("button-pressed");

                        // Create a subtle haptic-like visual effect
                        var pulseElement =
                            floatingButton.querySelector(".button-pulse");
                        if (pulseElement) {
                            pulseElement.style.animation = "none";
                            // Force reflow to restart animation
                            pulseElement.offsetHeight;
                            pulseElement.style.animation =
                                "buttonPress 0.2s ease-out";
                        }
                    };

                    // Touch end handler to clean up visual states
                    var touchEndHandler = function (event) {
                        // Remove pressed state with slight delay for visual continuity
                        setTimeout(function () {
                            floatingButton.classList.remove("button-pressed");
                        }, 150);
                    };

                    // Keyboard navigation handler for accessibility compliance
                    // This ensures users can interact with the button using only keyboard
                    var keyboardHandler = function (event) {
                        // Handle Enter and Space keys as button activation
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();

                            // Trigger the same action as a click
                            primaryClickHandler(event);

                            // Provide visual feedback for keyboard users
                            floatingButton.classList.add("keyboard-activated");
                            setTimeout(function () {
                                floatingButton.classList.remove(
                                    "keyboard-activated"
                                );
                            }, 200);
                        }

                        // Handle Escape key to close panel if it's open
                        if (
                            event.key === "Escape" &&
                            self.state.mobileButtonState.isPanelOpen
                        ) {
                            self.closeMobilePanel();
                        }
                    };

                    // Mouse interaction handlers for desktop users who might encounter mobile view
                    // These provide smooth hover states and proper cursor feedback
                    var mouseEnterHandler = function (event) {
                        // Enhance button appearance on hover for pointer devices
                        if (!self.state.mobileButtonState.isAnimating) {
                            floatingButton.classList.add("button-hover");
                        }
                    };

                    var mouseLeaveHandler = function (event) {
                        // Clean up hover state when pointer leaves button area
                        floatingButton.classList.remove("button-hover");
                    };

                    // Bind all event handlers using the utility system for proper cleanup
                    // The utility system ensures these events can be properly removed if needed
                    utils.addEventListener(
                        floatingButton,
                        "click",
                        primaryClickHandler
                    );
                    utils.addEventListener(
                        floatingButton,
                        "touchstart",
                        touchStartHandler,
                        { passive: true }
                    );
                    utils.addEventListener(
                        floatingButton,
                        "touchend",
                        touchEndHandler,
                        { passive: true }
                    );
                    utils.addEventListener(
                        floatingButton,
                        "keydown",
                        keyboardHandler
                    );
                    utils.addEventListener(
                        floatingButton,
                        "mouseenter",
                        mouseEnterHandler
                    );
                    utils.addEventListener(
                        floatingButton,
                        "mouseleave",
                        mouseLeaveHandler
                    );

                    // Store event handler references for potential cleanup
                    // This allows the system to properly remove events when the module is destroyed
                    this.state.eventHandlers.mobileButton = {
                        click: primaryClickHandler,
                        touchstart: touchStartHandler,
                        touchend: touchEndHandler,
                        keydown: keyboardHandler,
                        mouseenter: mouseEnterHandler,
                        mouseleave: mouseLeaveHandler,
                    };

                    // Setup progress update mechanism that works with button's circular indicator
                    // This creates a visual connection between reading progress and button state
                    this.setupMobileButtonProgressUpdates();

                    utils.log(
                        "Mobile TOC button handlers bound successfully with full interaction support"
                    );
                    return true;
                },
                setupMobileButtonProgressUpdates: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up mobile button progress updates (temporary stub)"
                    );

                    // Temporary implementation - just log that we're here
                    // This allows the main functionality to work while we develop the full feature

                    // TODO: Implement actual progress synchronization between button and scroll position
                    // This function should update the circular progress indicator on the floating button
                    // as the user scrolls through the document

                    utils.log(
                        "Mobile button progress updates configured (stub implementation)"
                    );
                    return true;
                },
                setupMobilePanelHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up mobile panel navigation handlers (temporary stub)"
                    );

                    // Temporary implementation for panel interaction handlers
                    // This function should setup click handlers for navigation links within the panel
                    // and manage the interaction behavior when users tap on different sections

                    var mobilePanel = this.state.tocElements.mobilePanel;
                    if (!mobilePanel) {
                        utils.log(
                            "Mobile panel not found for handler setup",
                            "error"
                        );
                        return false;
                    }

                    // TODO: Implement actual navigation link handlers
                    // TODO: Setup section highlighting when links are clicked
                    // TODO: Add smooth scrolling behavior to target sections

                    utils.log(
                        "Mobile panel handlers configured (stub implementation)"
                    );
                    return true;
                },

                setupMobileTouchHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up mobile touch gesture handlers (temporary stub)"
                    );

                    // Temporary implementation for touch-specific interactions
                    // This function should handle swipe gestures for closing the panel
                    // and other touch-specific behaviors that enhance mobile experience

                    // TODO: Implement swipe-down gesture to close panel
                    // TODO: Add touch momentum for panel interactions
                    // TODO: Handle edge swipe gestures for quick access

                    utils.log(
                        "Mobile touch handlers configured (stub implementation)"
                    );
                    return true;
                },

                updateMobileActiveSection: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Updating mobile active section highlight (temporary stub)"
                    );

                    // Temporary implementation for active section highlighting
                    // This function should determine which section is currently visible
                    // and highlight it in the navigation panel for user orientation

                    var mobilePanel = this.state.tocElements.mobilePanel;
                    if (!mobilePanel) {
                        return false;
                    }

                    // TODO: Calculate current visible section based on scroll position
                    // TODO: Update visual highlights in the navigation list
                    // TODO: Ensure highlighted section stays visible in panel scroll area

                    utils.log(
                        "Mobile active section updated (stub implementation)"
                    );
                    return true;
                },

                setupScrollTracking: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up universal scroll tracking (temporary stub)"
                    );

                    // Temporary implementation for scroll-based updates
                    // This function should monitor page scrolling and update various
                    // visual indicators based on user's current position in the document

                    // TODO: Implement scroll event listener with throttling
                    // TODO: Update progress indicators during scroll
                    // TODO: Update active section highlighting during scroll
                    // TODO: Handle smooth scrolling to sections when navigation links are clicked

                    utils.log(
                        "Scroll tracking configured (stub implementation)"
                    );
                    return true;
                },

                setupProgressTracking: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up universal progress tracking (temporary stub)"
                    );

                    // Temporary implementation for reading progress updates
                    // This function should coordinate all progress-related visual updates
                    // across different interface elements

                    // TODO: Implement progress calculation based on scroll position
                    // TODO: Update circular progress on floating button
                    // TODO: Update progress text in mobile panel
                    // TODO: Coordinate with section-specific progress indicators

                    utils.log(
                        "Progress tracking configured (stub implementation)"
                    );
                    return true;
                },

                setupResponsiveHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Setting up responsive behavior handlers (temporary stub)"
                    );

                    // Temporary implementation for responsive design behavior
                    // This function should handle screen size changes and device orientation changes
                    // ensuring the interface adapts properly to different screen configurations

                    // TODO: Implement window resize handler with debouncing
                    // TODO: Handle orientation change events
                    // TODO: Switch between mobile and desktop modes when breakpoint changes
                    // TODO: Preserve user state during responsive transitions

                    utils.log(
                        "Responsive handlers configured (stub implementation)"
                    );
                    return true;
                },
                openMobilePanel: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Opening mobile TOC panel with coordinated animation sequence"
                    );

                    // Get references to all elements involved in the opening animation
                    var mobilePanel = this.state.tocElements.mobilePanel;
                    var floatingButton = this.state.tocElements.floatingButton;

                    // Validate that all required elements exist before proceeding
                    if (!mobilePanel || !floatingButton) {
                        utils.log(
                            "Required mobile TOC elements not found, cannot open panel",
                            "error"
                        );
                        return false;
                    }

                    // Prevent opening if panel is already open or currently animating
                    if (
                        this.state.mobileButtonState.isPanelOpen ||
                        this.state.mobileButtonState.isAnimating
                    ) {
                        utils.log(
                            "Panel already open or animating, ignoring open request"
                        );
                        return false;
                    }

                    // Mark animation as in progress to prevent interference
                    this.state.mobileButtonState.isAnimating = true;
                    this.state.mobileButtonState.isPanelOpen = true;

                    // Update button visual state to reflect that panel will be open
                    floatingButton.classList.add("panel-open");
                    floatingButton.setAttribute("aria-expanded", "true");

                    // Phase 1: Prepare panel for animation by making it visible but positioned off-screen
                    // This allows the browser to calculate dimensions and prepare for smooth animation
                    mobilePanel.style.visibility = "visible";
                    mobilePanel.style.display = "block";
                    mobilePanel.setAttribute("aria-hidden", "false");

                    // Add opening class to trigger CSS animations
                    mobilePanel.classList.add("panel-opening");

                    // Phase 2: Start the overlay fade-in animation
                    // The overlay provides visual separation and context for the modal-like panel
                    var overlay = mobilePanel.querySelector(
                        ".mobile-toc-overlay"
                    );
                    if (overlay) {
                        overlay.style.opacity = "0";
                        overlay.style.visibility = "visible";

                        // Use requestAnimationFrame to ensure smooth animation start
                        requestAnimationFrame(function () {
                            overlay.style.transition =
                                "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
                            overlay.style.opacity = "1";
                        });
                    }

                    // Phase 3: Start the panel slide-up animation
                    // This creates the primary visual effect of the panel emerging from the bottom
                    var panelContent = mobilePanel.querySelector(
                        ".mobile-toc-content"
                    );
                    if (panelContent) {
                        // Start panel below the viewport
                        panelContent.style.transform = "translateY(100%)";
                        panelContent.style.visibility = "visible";

                        // Animate panel sliding up into view
                        requestAnimationFrame(function () {
                            panelContent.style.transition =
                                "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                            panelContent.style.transform = "translateY(0)";
                        });
                    }

                    // Phase 4: Update reading progress display in the panel
                    // This ensures the panel shows current and relevant information when opened
                    this.updateMobilePanelProgress();

                    // Phase 5: Highlight the current section in the navigation list
                    // This provides immediate context about user's current position in the document
                    this.updateMobileActiveSection();

                    // Phase 6: Setup completion handler to clean up animation state
                    // This ensures system returns to stable state after animation completes
                    setTimeout(function () {
                        // Remove opening animation class to prevent interference with future animations
                        mobilePanel.classList.remove("panel-opening");
                        mobilePanel.classList.add("panel-open");

                        // Mark animation as complete
                        self.state.mobileButtonState.isAnimating = false;

                        // Set focus to the first interactive element in panel for keyboard users
                        var firstFocusable = mobilePanel.querySelector(
                            'a[href], button, [tabindex]:not([tabindex="-1"])'
                        );
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }

                        utils.log("Mobile TOC panel opened successfully");

                        // Trigger custom event for other system components that might need to know
                        var openEvent = new CustomEvent(
                            "mobileTOCPanelOpened",
                            {
                                detail: {
                                    panel: mobilePanel,
                                    button: floatingButton,
                                },
                            }
                        );
                        document.dispatchEvent(openEvent);
                    }, 400); // Match the longest animation duration

                    // Phase 7: Setup outside click handler for easy dismissal
                    // This allows users to close panel by tapping anywhere outside it
                    this.setupPanelOutsideClickHandler();

                    return true;
                },

                closeMobilePanel: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Closing mobile TOC panel with reverse animation sequence"
                    );

                    // Get references to all elements involved in the closing animation
                    var mobilePanel = this.state.tocElements.mobilePanel;
                    var floatingButton = this.state.tocElements.floatingButton;

                    // Validate that required elements exist
                    if (!mobilePanel || !floatingButton) {
                        utils.log(
                            "Required mobile TOC elements not found, cannot close panel",
                            "error"
                        );
                        return false;
                    }

                    // Prevent closing if panel is already closed or currently animating
                    if (
                        !this.state.mobileButtonState.isPanelOpen ||
                        this.state.mobileButtonState.isAnimating
                    ) {
                        utils.log(
                            "Panel already closed or animating, ignoring close request"
                        );
                        return false;
                    }

                    // Mark animation as in progress and update state
                    this.state.mobileButtonState.isAnimating = true;
                    this.state.mobileButtonState.isPanelOpen = false;

                    // Update button visual state immediately
                    floatingButton.classList.remove("panel-open");
                    floatingButton.setAttribute("aria-expanded", "false");

                    // Add closing animation class
                    mobilePanel.classList.remove("panel-open");
                    mobilePanel.classList.add("panel-closing");

                    // Phase 1: Start panel slide-down animation
                    // This creates the primary visual effect of panel disappearing downward
                    var panelContent = mobilePanel.querySelector(
                        ".mobile-toc-content"
                    );
                    if (panelContent) {
                        panelContent.style.transition =
                            "transform 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
                        panelContent.style.transform = "translateY(100%)";
                    }

                    // Phase 2: Start overlay fade-out animation
                    // The overlay disappears slightly after panel starts moving for better visual flow
                    var overlay = mobilePanel.querySelector(
                        ".mobile-toc-overlay"
                    );
                    if (overlay) {
                        setTimeout(function () {
                            overlay.style.transition = "opacity 0.2s ease-out";
                            overlay.style.opacity = "0";
                        }, 100); // Slight delay for staggered animation effect
                    }

                    // Phase 3: Return focus to the floating button
                    // This ensures keyboard users don't lose their place in the interface
                    setTimeout(function () {
                        floatingButton.focus();
                    }, 150);

                    // Phase 4: Complete cleanup after animation finishes
                    setTimeout(function () {
                        // Hide panel completely
                        mobilePanel.style.visibility = "hidden";
                        mobilePanel.style.display = "none";
                        mobilePanel.setAttribute("aria-hidden", "true");

                        // Clean up animation classes
                        mobilePanel.classList.remove("panel-closing");

                        // Reset transform states for next opening
                        if (panelContent) {
                            panelContent.style.transform = "";
                            panelContent.style.transition = "";
                        }
                        if (overlay) {
                            overlay.style.opacity = "";
                            overlay.style.transition = "";
                            overlay.style.visibility = "hidden";
                        }

                        // Mark animation as complete
                        self.state.mobileButtonState.isAnimating = false;

                        utils.log("Mobile TOC panel closed successfully");

                        // Trigger custom event for system coordination
                        var closeEvent = new CustomEvent(
                            "mobileTOCPanelClosed",
                            {
                                detail: {
                                    panel: mobilePanel,
                                    button: floatingButton,
                                },
                            }
                        );
                        document.dispatchEvent(closeEvent);
                    }, 300); // Match animation duration

                    // Phase 5: Remove outside click handler since panel is closing
                    this.removePanelOutsideClickHandler();

                    return true;
                },
                setupPanelOutsideClickHandler: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Setting up outside click handler for mobile TOC panel dismissal"
                    );

                    // Get references to the panel and its interactive areas
                    var mobilePanel = this.state.tocElements.mobilePanel;
                    if (!mobilePanel) {
                        utils.log(
                            "Mobile panel not found, cannot setup outside click handler",
                            "error"
                        );
                        return false;
                    }

                    // Find the overlay element that serves as the clickable dismissal area
                    var overlay = mobilePanel.querySelector(
                        ".mobile-toc-overlay"
                    );
                    var panelContent = mobilePanel.querySelector(
                        ".mobile-toc-content"
                    );

                    // Create comprehensive click handler that distinguishes between different click targets
                    // This handler needs to be smart about when to close vs when to ignore clicks
                    var outsideClickHandler = function (event) {
                        // Only process clicks when panel is actually open and not animating
                        // This prevents interference during transition states
                        if (
                            !self.state.mobileButtonState.isPanelOpen ||
                            self.state.mobileButtonState.isAnimating
                        ) {
                            return;
                        }

                        // Determine if the click target is outside the panel content area
                        // We need to check the actual click target and its parent hierarchy
                        var clickTarget = event.target;
                        var isClickOutsidePanel = true;

                        // Traverse up the DOM tree to see if click occurred within panel content
                        // This handles cases where user clicks on child elements inside the panel
                        var currentElement = clickTarget;
                        while (
                            currentElement &&
                            currentElement !== document.body
                        ) {
                            if (currentElement === panelContent) {
                                isClickOutsidePanel = false;
                                break;
                            }
                            currentElement = currentElement.parentNode;
                        }

                        // Also check if click was specifically on the floating button
                        // Button clicks should be handled by the button's own event handler, not this one
                        var floatingButton =
                            self.state.tocElements.floatingButton;
                        if (
                            floatingButton &&
                            (clickTarget === floatingButton ||
                                floatingButton.contains(clickTarget))
                        ) {
                            // Let the button's own handler deal with this click
                            return;
                        }

                        // If click was outside panel content or specifically on overlay, close the panel
                        if (isClickOutsidePanel || clickTarget === overlay) {
                            utils.log(
                                "Outside click detected, closing mobile TOC panel"
                            );

                            // Prevent the click from bubbling and potentially triggering other actions
                            event.preventDefault();
                            event.stopPropagation();

                            // Close the panel with our established animation sequence
                            self.closeMobilePanel();
                        }
                    };

                    // Create touch-specific handler for better mobile experience
                    // Touch events have different characteristics than mouse events
                    var touchStartHandler = function (event) {
                        // Store the initial touch position to handle drag gestures properly
                        // This prevents accidental closures when user scrolls within the panel
                        self.state.initialTouchY = event.touches[0].clientY;
                        self.state.initialTouchX = event.touches[0].clientX;
                    };

                    var touchEndHandler = function (event) {
                        // Only process touch end if panel is open and not animating
                        if (
                            !self.state.mobileButtonState.isPanelOpen ||
                            self.state.mobileButtonState.isAnimating
                        ) {
                            return;
                        }

                        // Get the final touch position to calculate movement distance
                        var changedTouch = event.changedTouches[0];
                        var finalTouchY = changedTouch.clientY;
                        var finalTouchX = changedTouch.clientX;

                        // Calculate how much the finger moved during the touch gesture
                        var deltaY = Math.abs(
                            finalTouchY - self.state.initialTouchY
                        );
                        var deltaX = Math.abs(
                            finalTouchX - self.state.initialTouchX
                        );

                        // If finger moved significantly, this was likely a scroll or drag gesture
                        // We should not close the panel in this case
                        if (deltaY > 10 || deltaX > 10) {
                            utils.log(
                                "Touch movement detected, ignoring as dismissal gesture"
                            );
                            return;
                        }

                        // If touch ended outside panel with minimal movement, treat as dismissal tap
                        var touchTarget = document.elementFromPoint(
                            finalTouchX,
                            finalTouchY
                        );
                        if (
                            touchTarget &&
                            (touchTarget === overlay ||
                                !panelContent.contains(touchTarget))
                        ) {
                            utils.log(
                                "Outside touch tap detected, closing mobile TOC panel"
                            );

                            event.preventDefault();
                            event.stopPropagation();

                            self.closeMobilePanel();
                        }
                    };

                    // Create keyboard handler for additional accessibility
                    // This allows dismissal via Escape key from anywhere in the document
                    var keyboardDismissHandler = function (event) {
                        // Handle Escape key as universal dismissal command
                        if (
                            event.key === "Escape" &&
                            self.state.mobileButtonState.isPanelOpen
                        ) {
                            utils.log(
                                "Escape key pressed, closing mobile TOC panel"
                            );

                            event.preventDefault();
                            self.closeMobilePanel();
                        }
                    };

                    // Bind all event handlers using a systematic approach
                    // We attach to document to catch events that bubble up from anywhere
                    utils.addEventListener(
                        document,
                        "click",
                        outsideClickHandler,
                        true
                    ); // Use capture phase
                    utils.addEventListener(
                        document,
                        "touchstart",
                        touchStartHandler,
                        { passive: true }
                    );
                    utils.addEventListener(
                        document,
                        "touchend",
                        touchEndHandler,
                        { passive: false }
                    ); // Need preventDefault capability
                    utils.addEventListener(
                        document,
                        "keydown",
                        keyboardDismissHandler
                    );

                    // Store handler references for proper cleanup when panel closes
                    // This prevents memory leaks and ensures handlers are removed when not needed
                    this.state.eventHandlers.outsideClick = {
                        click: outsideClickHandler,
                        touchstart: touchStartHandler,
                        touchend: touchEndHandler,
                        keydown: keyboardDismissHandler,
                    };

                    utils.log(
                        "Outside click handlers for mobile TOC panel setup successfully"
                    );
                    return true;
                },

                removePanelOutsideClickHandler: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Removing outside click handlers for mobile TOC panel"
                    );

                    // Get stored handler references
                    var handlers = this.state.eventHandlers.outsideClick;
                    if (!handlers) {
                        utils.log("No outside click handlers found to remove");
                        return;
                    }

                    // Try multiple approaches to remove event handlers based on available methods
                    // This defensive approach ensures compatibility with different utility implementations

                    try {
                        // Method 1: Try the standard utils.removeEventListener if it exists
                        if (
                            handlers.click &&
                            typeof utils.removeEventListener === "function"
                        ) {
                            utils.removeEventListener(
                                document,
                                "click",
                                handlers.click,
                                true
                            );
                            utils.removeEventListener(
                                document,
                                "touchstart",
                                handlers.touchstart,
                                { passive: true }
                            );
                            utils.removeEventListener(
                                document,
                                "touchend",
                                handlers.touchend,
                                { passive: false }
                            );
                            utils.removeEventListener(
                                document,
                                "keydown",
                                handlers.keydown
                            );
                            utils.log(
                                "Event handlers removed using utils.removeEventListener"
                            );
                        }
                        // Method 2: Fall back to native DOM removeEventListener
                        else if (handlers.click) {
                            document.removeEventListener(
                                "click",
                                handlers.click,
                                true
                            );
                            document.removeEventListener(
                                "touchstart",
                                handlers.touchstart,
                                { passive: true }
                            );
                            document.removeEventListener(
                                "touchend",
                                handlers.touchend,
                                { passive: false }
                            );
                            document.removeEventListener(
                                "keydown",
                                handlers.keydown
                            );
                            utils.log(
                                "Event handlers removed using native DOM methods"
                            );
                        }
                    } catch (error) {
                        utils.log(
                            "Error removing event handlers: " + error.message,
                            "error"
                        );
                        // Even if removal fails, we continue to clean up references
                    }

                    // Always clear the stored references to prevent potential memory leaks
                    this.state.eventHandlers.outsideClick = null;

                    utils.log("Outside click handlers cleanup completed");
                },
                updateMobilePanelProgress: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("Updating mobile TOC panel progress indicators");

                    // Get reference to the mobile panel and validate its existence
                    var mobilePanel = this.state.tocElements.mobilePanel;
                    if (!mobilePanel) {
                        utils.log(
                            "Mobile panel not found, cannot update progress",
                            "error"
                        );
                        return false;
                    }

                    // Find the progress summary element that displays the reading progress text
                    var progressSummary = mobilePanel.querySelector(
                        ".mobile-toc-progress-summary"
                    );
                    if (!progressSummary) {
                        utils.log(
                            "Progress summary element not found in mobile panel",
                            "error"
                        );
                        return false;
                    }

                    // Calculate the current reading progress using viewport and scroll metrics
                    // This calculation takes into account the total document height, current scroll position,
                    // and the visible area height to determine how much content has been "read through"
                    var scrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0;
                    var documentHeight = Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.clientHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight
                    );
                    var windowHeight =
                        window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight;

                    // Calculate the maximum possible scroll position
                    // This represents the scroll position when user has reached the very bottom of the document
                    var maxScroll = documentHeight - windowHeight;

                    // Calculate reading progress as a percentage
                    // We use Math.max to ensure progress never goes below 0, and Math.min to cap it at 100
                    var progressPercentage = 0;
                    if (maxScroll > 0) {
                        progressPercentage = Math.min(
                            100,
                            Math.max(0, (scrollTop / maxScroll) * 100)
                        );
                    }

                    // Round to one decimal place for clean display
                    progressPercentage =
                        Math.round(progressPercentage * 10) / 10;

                    // Determine the current section based on scroll position
                    // This provides context about where the user is in the document structure
                    var currentSection = this.getCurrentSectionInfo(scrollTop);

                    // Calculate estimated reading time remaining based on average reading speed
                    // We use a baseline of 200 words per minute, which is average for web content
                    var estimatedTimeRemaining =
                        this.calculateEstimatedReadingTime(progressPercentage);

                    // Update the progress summary with comprehensive information
                    // This creates a rich, informative display that helps users understand their position
                    var progressText = this.buildProgressSummaryText({
                        percentage: progressPercentage,
                        currentSection: currentSection,
                        timeRemaining: estimatedTimeRemaining,
                    });

                    // Apply the updated text to the progress summary element
                    progressSummary.innerHTML = progressText;

                    // Update individual section progress indicators in the navigation list
                    // This shows visual progress bars next to each section heading
                    this.updateSectionProgressIndicators(scrollTop);

                    // Update the floating button's circular progress indicator if visible
                    // This synchronizes the button's visual state with the panel's information
                    this.updateFloatingButtonProgress(progressPercentage);

                    // Store the current progress for use by other system components
                    this.state.currentReadingProgress = progressPercentage;
                    this.state.lastProgressUpdate = Date.now();

                    utils.log(
                        "Mobile panel progress updated: " +
                            progressPercentage +
                            "% complete"
                    );

                    return true;
                },

                getCurrentSectionInfo: function (scrollTop) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Iterate through all headings to find which section user is currently reading
                    // We need to account for the offset that positions headings properly when scrolled to
                    var headings = this.state.headings;
                    var currentSection = null;
                    var scrollOffset = this.config.scrollOffset || 120;

                    // Find the last heading that is above the current scroll position
                    // This represents the section that the user is currently reading
                    for (var i = headings.length - 1; i >= 0; i--) {
                        var heading = headings[i];
                        if (heading.offsetTop <= scrollTop + scrollOffset) {
                            currentSection = {
                                index: i + 1,
                                total: headings.length,
                                title: heading.text,
                                level: heading.level,
                                id: heading.id,
                            };
                            break;
                        }
                    }

                    // If no section found (user is before first heading), create default info
                    if (!currentSection && headings.length > 0) {
                        currentSection = {
                            index: 0,
                            total: headings.length,
                            title: "Beginning of document",
                            level: 1,
                            id: "start",
                        };
                    }

                    return currentSection;
                },

                calculateEstimatedReadingTime: function (progressPercentage) {
                    // Calculate estimated time remaining based on average reading speed and remaining content
                    // This feature helps users plan their reading sessions effectively

                    // Get the total word count of the document
                    // We estimate this by counting words in the main content area
                    var contentArea =
                        document.querySelector(".entry-content") ||
                        document.querySelector("main") ||
                        document.body;
                    var totalText = contentArea
                        ? contentArea.textContent || contentArea.innerText
                        : "";
                    var wordCount = totalText.split(/\s+/).length;

                    // Calculate remaining words based on progress percentage
                    var remainingWords = Math.round(
                        wordCount * ((100 - progressPercentage) / 100)
                    );

                    // Convert to estimated reading time using average reading speed of 200 words per minute
                    var estimatedMinutes = Math.ceil(remainingWords / 200);

                    // Format the time estimate in a user-friendly way
                    if (estimatedMinutes === 0) {
                        return "Almost finished!";
                    } else if (estimatedMinutes === 1) {
                        return "About 1 minute left";
                    } else if (estimatedMinutes < 60) {
                        return "About " + estimatedMinutes + " minutes left";
                    } else {
                        var hours = Math.floor(estimatedMinutes / 60);
                        var minutes = estimatedMinutes % 60;
                        if (hours === 1 && minutes === 0) {
                            return "About 1 hour left";
                        } else if (minutes === 0) {
                            return "About " + hours + " hours left";
                        } else {
                            return "About " + hours + "h " + minutes + "m left";
                        }
                    }
                },

                buildProgressSummaryText: function (data) {
                    // Create rich, informative progress summary that provides multiple types of context
                    // This summary serves as a dashboard for the user's current reading state

                    var progressHtml = '<div class="progress-main">';
                    progressHtml +=
                        '<span class="progress-percentage">' +
                        data.percentage +
                        "%</span>";
                    progressHtml +=
                        '<span class="progress-label">complete</span>';
                    progressHtml += "</div>";

                    // Add current section information if available
                    if (
                        data.currentSection &&
                        data.currentSection.title !== "Beginning of document"
                    ) {
                        progressHtml += '<div class="progress-section">';
                        progressHtml +=
                            '<span class="section-indicator">Section ' +
                            data.currentSection.index +
                            " of " +
                            data.currentSection.total +
                            "</span>";
                        progressHtml +=
                            '<span class="section-title">' +
                            this.truncateText(data.currentSection.title, 40) +
                            "</span>";
                        progressHtml += "</div>";
                    }

                    // Add estimated time remaining if calculated
                    if (data.timeRemaining) {
                        progressHtml += '<div class="progress-time">';
                        progressHtml +=
                            '<i class="fas fa-clock" aria-hidden="true"></i>';
                        progressHtml +=
                            '<span class="time-estimate">' +
                            data.timeRemaining +
                            "</span>";
                        progressHtml += "</div>";
                    }

                    return progressHtml;
                },

                updateSectionProgressIndicators: function (scrollTop) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Update visual progress indicators next to each section in the navigation list
                    // This provides granular feedback about progress through individual sections

                    var navigationList =
                        this.state.tocElements.mobilePanel.querySelector(
                            ".mobile-toc-list"
                        );
                    if (!navigationList) {
                        return;
                    }

                    var headings = this.state.headings;
                    var scrollOffset = this.config.scrollOffset || 120;

                    // Iterate through each section item in the navigation list
                    var sectionItems =
                        navigationList.querySelectorAll(".mobile-toc-item");
                    for (
                        var i = 0;
                        i < sectionItems.length && i < headings.length;
                        i++
                    ) {
                        var item = sectionItems[i];
                        var heading = headings[i];
                        var progressIndicator =
                            item.querySelector(".section-progress");

                        if (!progressIndicator) {
                            continue;
                        }

                        // Determine the progress state for this section
                        var sectionStart = heading.offsetTop;
                        var sectionEnd =
                            i + 1 < headings.length
                                ? headings[i + 1].offsetTop
                                : document.body.scrollHeight;
                        var currentPosition = scrollTop + scrollOffset;

                        // Calculate progress through this specific section
                        if (currentPosition < sectionStart) {
                            // Section not yet reached
                            progressIndicator.className =
                                "section-progress not-reached";
                            progressIndicator.style.width = "0%";
                        } else if (currentPosition >= sectionEnd) {
                            // Section completely read through
                            progressIndicator.className =
                                "section-progress completed";
                            progressIndicator.style.width = "100%";
                        } else {
                            // Section currently being read
                            var sectionProgress =
                                ((currentPosition - sectionStart) /
                                    (sectionEnd - sectionStart)) *
                                100;
                            progressIndicator.className =
                                "section-progress current";
                            progressIndicator.style.width =
                                Math.min(100, Math.max(0, sectionProgress)) +
                                "%";
                        }
                    }
                },

                updateFloatingButtonProgress: function (progressPercentage) {
                    // Synchronize the floating button's circular progress indicator with the overall reading progress
                    // This creates visual consistency between the button and the panel
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log(
                        "updateFloatingButtonProgress called with: " +
                            progressPercentage +
                            "%"
                    );
                    var floatingButton = this.state.tocElements.floatingButton;
                    if (!floatingButton || !floatingButton.progressCircle) {
                        return;
                    }

                    var progressCircle = floatingButton.progressCircle;
                    var circumference = floatingButton.circumference;

                    // Calculate the stroke-dashoffset for the circular progress indicator
                    // This determines how much of the circle is "filled" with the progress color
                    var offset =
                        circumference -
                        (progressPercentage / 100) * circumference;

                    // Apply the calculated offset with smooth transition
                    progressCircle.style.strokeDashoffset = offset;

                    // Update the visual state of the button based on progress level
                    if (progressPercentage < 10) {
                        floatingButton.classList.remove(
                            "progress-mid",
                            "progress-high"
                        );
                        floatingButton.classList.add("progress-low");
                    } else if (progressPercentage < 75) {
                        floatingButton.classList.remove(
                            "progress-low",
                            "progress-high"
                        );
                        floatingButton.classList.add("progress-mid");
                    } else {
                        floatingButton.classList.remove(
                            "progress-low",
                            "progress-mid"
                        );
                        floatingButton.classList.add("progress-high");
                    }
                },

                truncateText: function (text, maxLength) {
                    // Helper function to truncate long section titles for display in compact interfaces
                    // This ensures the interface remains clean and readable even with verbose headings

                    if (!text || text.length <= maxLength) {
                        return text;
                    }

                    return text.substring(0, maxLength - 3) + "...";
                },

                createDesktopTOC: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    // Check for existing TOC to prevent duplicates
                    var existingTOC = document.querySelector(".advanced-toc");
                    if (existingTOC) {
                        utils.log(
                            "Removing existing desktop TOC to prevent duplicates"
                        );
                        existingTOC.parentNode.removeChild(existingTOC);
                    }
                    utils.log("Creating desktop TOC interface");

                    // Find suitable container for TOC placement
                    var targetContainer = utils.querySelector(
                        this.config.containerSelector
                    );
                    if (!targetContainer) {
                        utils.log(
                            "Target container not found: " +
                                this.config.containerSelector,
                            "error"
                        );
                        return false;
                    }

                    // Create main TOC container with modern glassmorphism design
                    var tocContainer = document.createElement("div");
                    tocContainer.className = "advanced-toc";
                    tocContainer.setAttribute(
                        "aria-label",
                        "Table of Contents Navigation"
                    );

                    // Create header section with title and controls
                    var tocHeader = document.createElement("div");
                    tocHeader.className = "toc-header";

                    var tocTitle = document.createElement("div");
                    tocTitle.className = "toc-title";
                    tocTitle.innerHTML =
                        '</span><span>Table of Contents</span><i class="fas fa-list-ul" aria-hidden="true"></i>';

                    var tocControls = document.createElement("div");
                    tocControls.className = "toc-controls";

                    var collapseButton = document.createElement("button");
                    collapseButton.className = "toc-collapse";
                    collapseButton.setAttribute(
                        "aria-label",
                        "Collapse table of contents"
                    );
                    collapseButton.innerHTML =
                        '<i class="fas fa-minus" aria-hidden="true"></i>';

                    tocControls.appendChild(collapseButton);
                    tocHeader.appendChild(tocControls);
                    tocHeader.appendChild(tocTitle);

                    // Create reading progress indicator
                    var tocProgress = document.createElement("div");
                    tocProgress.className = "toc-progress";

                    var progressBar = document.createElement("div");
                    progressBar.className = "toc-progress-bar";
                    progressBar.setAttribute("role", "progressbar");
                    progressBar.setAttribute("aria-valuemin", "0");
                    progressBar.setAttribute("aria-valuemax", "100");
                    progressBar.setAttribute("aria-valuenow", "0");
                    progressBar.setAttribute("aria-label", "Reading progress");

                    tocProgress.appendChild(progressBar);

                    // Create navigation container for heading links
                    var tocNavigation = document.createElement("div");
                    tocNavigation.className = "toc-navigation";

                    var tocList = document.createElement("ul");
                    tocList.className = "toc-list";
                    tocList.setAttribute("role", "navigation");
                    tocList.setAttribute(
                        "aria-label",
                        "Document outline navigation"
                    );

                    // Generate navigation items from collected heading data
                    for (var i = 0; i < this.state.headings.length; i++) {
                        var heading = this.state.headings[i];

                        var listItem = document.createElement("li");
                        listItem.className = "toc-item toc-h" + heading.level;

                        var link = document.createElement("a");
                        link.className = "toc-link";
                        link.href = "#" + heading.id;
                        link.textContent = heading.text;
                        link.setAttribute("data-heading-id", heading.id);
                        link.setAttribute(
                            "aria-describedby",
                            "toc-description"
                        );

                        listItem.appendChild(link);
                        tocList.appendChild(listItem);
                    }

                    tocNavigation.appendChild(tocList);

                    // Assemble all components into complete TOC structure
                    tocContainer.appendChild(tocHeader);
                    tocContainer.appendChild(tocProgress);
                    tocContainer.appendChild(tocNavigation);

                    // Store references to key elements for future manipulation
                    this.state.tocElements.desktopContainer = tocContainer;
                    this.state.tocElements.progressBar = progressBar;
                    this.state.tocElements.tocList = tocList;

                    // Insert TOC into page at optimal position
                    targetContainer.appendChild(tocContainer);

                    utils.log(
                        "Desktop TOC interface created successfully with " +
                            this.state.headings.length +
                            " navigation items"
                    );

                    return true;
                },
                setupCollapseHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Setting up TOC collapse/expand functionality");

                    // Find the collapse button that was created in createDesktopTOC
                    var collapseButton =
                        this.state.tocElements.desktopContainer.querySelector(
                            ".toc-collapse"
                        );
                    if (!collapseButton) {
                        utils.log(
                            "Collapse button not found, cannot setup collapse handlers",
                            "error"
                        );
                        return false;
                    }

                    // Initialize collapse state tracking
                    this.state.isCollapsed = false;

                    // Set up click handler for toggle functionality
                    utils.addEventListener(
                        collapseButton,
                        "click",
                        function (event) {
                            event.preventDefault();

                            // Toggle the collapsed state
                            self.state.isCollapsed = !self.state.isCollapsed;

                            // Apply visual changes through CSS classes
                            self.updateCollapseState();

                            // Log state change for debugging and user behavior analysis
                            utils.log(
                                "TOC " +
                                    (self.state.isCollapsed
                                        ? "collapsed"
                                        : "expanded") +
                                    " by user interaction"
                            );
                        },
                        { passive: false }
                    );

                    utils.log("Collapse functionality activated successfully");
                    return true;
                },
                updateCollapseState: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var tocContainer = this.state.tocElements.desktopContainer;
                    var collapseButton =
                        tocContainer.querySelector(".toc-collapse");
                    var buttonIcon = collapseButton.querySelector("i");

                    if (this.state.isCollapsed) {
                        // Apply collapsed visual state
                        tocContainer.classList.add("collapsed");

                        // Update button icon to indicate expand action
                        buttonIcon.className = "fas fa-plus";

                        // Update accessibility attributes for screen readers
                        collapseButton.setAttribute(
                            "aria-label",
                            "Expand table of contents"
                        );
                        collapseButton.setAttribute("aria-expanded", "false");

                        utils.log(
                            "Applied collapsed state: TOC minimized to compact view"
                        );
                    } else {
                        // Apply expanded visual state
                        tocContainer.classList.remove("collapsed");

                        // Update button icon to indicate collapse action
                        buttonIcon.className = "fas fa-minus";

                        // Update accessibility attributes for screen readers
                        collapseButton.setAttribute(
                            "aria-label",
                            "Collapse table of contents"
                        );
                        collapseButton.setAttribute("aria-expanded", "true");

                        utils.log(
                            "Applied expanded state: TOC showing full navigation view"
                        );
                    }
                },
                setupScrollTracking: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Setting up intelligent active section tracking");

                    // Configuration for scroll tracking behavior
                    var trackingConfig = {
                        activationLine: -0.5,
                        updateThreshold: 50, // Minimum scroll distance to trigger updates
                        debounceDelay: 100, // Delay to prevent excessive updates during rapid scrolling
                    };

                    // State for tracking scroll behavior and active sections
                    var trackingState = {
                        lastScrollPosition: 0, // Previous scroll position for comparison
                        currentActiveId: null, // ID of currently highlighted section
                        lastUpdateTime: 0, // Timestamp of last update to control frequency
                    };

                    // Create optimized scroll handler using throttling for performance
                    var scrollTracker = utils.throttle(
                        function () {
                            var currentTime = Date.now();
                            var currentScroll =
                                window.pageYOffset ||
                                document.documentElement.scrollTop;
                            var scrollDifference = Math.abs(
                                currentScroll - trackingState.lastScrollPosition
                            );

                            // Only process updates if significant scroll movement occurred
                            if (
                                scrollDifference >=
                                trackingConfig.updateThreshold
                            ) {
                                var activeHeadingId =
                                    self.determineActiveSection(
                                        currentScroll,
                                        trackingConfig.activationLine
                                    );

                                // Update highlighting only if active section actually changed
                                if (
                                    activeHeadingId !==
                                    trackingState.currentActiveId
                                ) {
                                    self.updateActiveHighlight(
                                        trackingState.currentActiveId,
                                        activeHeadingId
                                    );
                                    trackingState.currentActiveId =
                                        activeHeadingId;

                                    utils.log(
                                        "Active section changed to: " +
                                            (activeHeadingId || "none")
                                    );
                                }

                                trackingState.lastScrollPosition =
                                    currentScroll;
                                trackingState.lastUpdateTime = currentTime;
                            }
                        },
                        trackingConfig.debounceDelay,
                        "toc-scroll-tracking"
                    );

                    // Attach the scroll tracker to monitor user movement through document
                    utils.addEventListener(window, "scroll", scrollTracker, {
                        passive: true,
                    });

                    utils.log(
                        "Active section tracking system initialized successfully"
                    );
                },
                determineActiveSection: function (
                    currentScrollPosition,
                    activationLineRatio
                ) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Calculate the activation line position in viewport
                    var viewportHeight = window.innerHeight;
                    var activationLinePosition =
                        currentScrollPosition +
                        viewportHeight * activationLineRatio;

                    var activeHeadingId = null;
                    var smallestDistance = Infinity;

                    // Analyze each heading to find the one closest to activation line
                    for (var i = 0; i < this.state.headings.length; i++) {
                        var heading = this.state.headings[i];
                        var headingPosition = heading.offsetTop;

                        // Calculate how far this heading is from our activation line
                        var distanceFromLine = Math.abs(
                            headingPosition - activationLinePosition
                        );

                        // Only consider headings that are above or at the activation line
                        // This ensures we highlight the section the user is currently reading
                        if (
                            headingPosition <= activationLinePosition &&
                            distanceFromLine < smallestDistance
                        ) {
                            smallestDistance = distanceFromLine;
                            activeHeadingId = heading.id;
                        }
                    }

                    // Log detailed analysis for debugging and optimization
                    utils.log(
                        "Active section analysis: scroll=" +
                            Math.round(currentScrollPosition) +
                            "px, activation=" +
                            Math.round(activationLinePosition) +
                            "px, result=" +
                            (activeHeadingId || "none")
                    );

                    return activeHeadingId;
                },
                updateActiveHighlight: function (activeHeadingId) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Determine which interface is currently active and update accordingly
                    // This ensures the function works correctly in both mobile and desktop modes

                    if (this.state.currentMode === "desktop") {
                        // Desktop-specific highlighting logic
                        var desktopContainer =
                            this.state.tocElements.desktopContainer;
                        if (desktopContainer) {
                            var tocLinks =
                                desktopContainer.querySelectorAll(".toc-link");
                            // Update desktop TOC highlighting
                            for (var i = 0; i < tocLinks.length; i++) {
                                var link = tocLinks[i];
                                if (
                                    link.getAttribute("data-target") ===
                                    activeHeadingId
                                ) {
                                    link.classList.add("active");
                                } else {
                                    link.classList.remove("active");
                                }
                            }
                        }
                    } else if (this.state.currentMode === "mobile") {
                        // Mobile-specific highlighting logic
                        var mobilePanel = this.state.tocElements.mobilePanel;
                        if (mobilePanel) {
                            var mobileLinks =
                                mobilePanel.querySelectorAll(
                                    ".mobile-toc-link"
                                );
                            // Update mobile TOC highlighting
                            for (var i = 0; i < mobileLinks.length; i++) {
                                var link = mobileLinks[i];
                                var parentItem =
                                    link.closest(".mobile-toc-item");
                                if (
                                    link.getAttribute("data-target") ===
                                    activeHeadingId
                                ) {
                                    parentItem.classList.add("active-section");
                                } else {
                                    parentItem.classList.remove(
                                        "active-section"
                                    );
                                }
                            }
                        }
                    }

                    utils.log(
                        "Active section highlight updated for " +
                            this.state.currentMode +
                            " mode: " +
                            activeHeadingId
                    );
                },
                ensureActiveItemVisibility: function (activeLink) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Find the correct scrollable container - should be .toc-navigation
                    var tocNavigation =
                        this.state.tocElements.desktopContainer.querySelector(
                            ".toc-navigation"
                        );
                    if (!tocNavigation) {
                        utils.log(
                            "TOC navigation container not found for auto-scroll",
                            "warn"
                        );
                        return;
                    }

                    // Check if the TOC navigation area actually needs scrolling
                    var hasVerticalScroll =
                        tocNavigation.scrollHeight > tocNavigation.clientHeight;
                    if (!hasVerticalScroll) {
                        utils.log(
                            "TOC content fits in visible area, no scrolling needed"
                        );
                        return; // No scrolling needed if all content is visible
                    }

                    // Calculate positions more precisely using getBoundingClientRect for accuracy
                    var containerRect = tocNavigation.getBoundingClientRect();
                    var linkRect = activeLink.getBoundingClientRect();

                    // Calculate relative positions within the scrollable container
                    var containerTop = 0;
                    var containerBottom = containerRect.height;
                    var linkTop =
                        linkRect.top -
                        containerRect.top +
                        tocNavigation.scrollTop;
                    var linkBottom = linkTop + linkRect.height;
                    var currentScrollTop = tocNavigation.scrollTop;

                    // Determine if active link is outside visible area and calculate target position
                    var needsScrolling = false;
                    var targetScrollPosition = currentScrollTop;
                    var padding = 40; // Generous padding for better visual separation

                    if (linkTop < currentScrollTop + padding) {
                        // Active link is above visible area - scroll up to show it with padding
                        needsScrolling = true;
                        targetScrollPosition = Math.max(0, linkTop - padding);
                        utils.log(
                            "Scrolling TOC up to show active item: " +
                                activeLink.textContent.substring(0, 30) +
                                "..."
                        );
                    } else if (
                        linkBottom >
                        currentScrollTop + containerRect.height - padding
                    ) {
                        // Active link is below visible area - scroll down to show it with padding
                        needsScrolling = true;
                        targetScrollPosition =
                            linkBottom - containerRect.height + padding;
                        utils.log(
                            "Scrolling TOC down to show active item: " +
                                activeLink.textContent.substring(0, 30) +
                                "..."
                        );
                    }

                    // Perform smooth scrolling within the TOC if needed
                    if (needsScrolling) {
                        tocNavigation.scrollTo({
                            top: Math.max(0, targetScrollPosition),
                            behavior: "smooth",
                        });
                        utils.log(
                            "TOC auto-scroll executed to position: " +
                                targetScrollPosition
                        );
                    } else {
                        utils.log(
                            "Active item already visible in TOC, no scrolling needed"
                        );
                    }
                },
                setupProgressTracking: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Setting up reading progress tracking system");

                    // Configuration for progress tracking behavior
                    var progressConfig = {
                        updateThreshold: 25, // Minimum scroll distance to update progress
                        smoothingFactor: 0.1, // Controls smoothness of progress updates
                        completionThreshold: 0.95, // Consider reading "complete" at 95% to account for footer
                    };

                    // State tracking for progress calculations
                    var progressState = {
                        lastCalculatedProgress: 0, // Previous progress value for comparison
                        lastScrollPosition: 0, // Previous scroll position for threshold checking
                        documentHeight: 0, // Cached document height for performance
                        viewportHeight: 0, // Cached viewport height for performance
                    };

                    // Function to recalculate document dimensions when needed
                    var updateDocumentDimensions = function () {
                        progressState.documentHeight = Math.max(
                            document.body.scrollHeight,
                            document.body.offsetHeight,
                            document.documentElement.clientHeight,
                            document.documentElement.scrollHeight,
                            document.documentElement.offsetHeight
                        );
                        progressState.viewportHeight = window.innerHeight;
                        utils.log(
                            "Updated document dimensions: height=" +
                                progressState.documentHeight +
                                "px, viewport=" +
                                progressState.viewportHeight +
                                "px"
                        );
                    };

                    // Initial calculation of document dimensions
                    updateDocumentDimensions();

                    // Create optimized progress tracker with throttling for smooth performance
                    var progressTracker = utils.throttle(
                        function () {
                            var currentScrollPosition =
                                window.pageYOffset ||
                                document.documentElement.scrollTop;
                            var scrollDifference = Math.abs(
                                currentScrollPosition -
                                    progressState.lastScrollPosition
                            );

                            // Only update progress if significant scroll movement occurred
                            if (
                                scrollDifference >=
                                progressConfig.updateThreshold
                            ) {
                                var newProgress = self.calculateReadingProgress(
                                    currentScrollPosition,
                                    progressState,
                                    progressConfig
                                );

                                // Apply smoothing to prevent jarring progress jumps
                                var smoothedProgress =
                                    self.smoothProgressTransition(
                                        progressState.lastCalculatedProgress,
                                        newProgress,
                                        progressConfig.smoothingFactor
                                    );

                                // Update visual progress bar with calculated value
                                self.updateProgressBar(smoothedProgress);

                                progressState.lastCalculatedProgress =
                                    smoothedProgress;
                                progressState.lastScrollPosition =
                                    currentScrollPosition;
                            }
                        },
                        50,
                        "toc-progress-tracking"
                    ); // 50ms throttling for smooth visual updates

                    // Attach progress tracker to monitor user reading behavior
                    utils.addEventListener(window, "scroll", progressTracker, {
                        passive: true,
                    });

                    // Update dimensions when window is resized to maintain accuracy
                    utils.addEventListener(
                        window,
                        "resize",
                        utils.throttle(
                            function () {
                                updateDocumentDimensions();
                                // Trigger immediate progress recalculation after resize
                                progressTracker();
                            },
                            250,
                            "toc-progress-resize"
                        ),
                        { passive: true }
                    );

                    utils.log(
                        "Reading progress tracking system initialized successfully"
                    );
                },
                calculateReadingProgress: function (
                    currentScrollPosition,
                    progressState,
                    progressConfig
                ) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Let's diagnose what's happening with our calculations
                    utils.log("=== PROGRESS CALCULATION DIAGNOSIS ===");
                    utils.log(
                        "Current scroll position: " +
                            currentScrollPosition +
                            "px"
                    );
                    utils.log(
                        "Document height: " +
                            progressState.documentHeight +
                            "px"
                    );
                    utils.log(
                        "Viewport height: " +
                            progressState.viewportHeight +
                            "px"
                    );

                    // The key insight: maximum scrollable distance is where the user can actually scroll to
                    // When user reaches bottom, scrollTop equals (documentHeight - viewportHeight)
                    var maxScrollableDistance =
                        progressState.documentHeight -
                        progressState.viewportHeight;
                    utils.log(
                        "Calculated max scrollable distance: " +
                            maxScrollableDistance +
                            "px"
                    );

                    // Ensure we don't divide by zero or negative numbers
                    if (maxScrollableDistance <= 0) {
                        utils.log(
                            "Document shorter than viewport - progress should be 100%"
                        );
                        return 1; // Document is shorter than viewport, so we're always "complete"
                    }

                    // Calculate raw progress as simple ratio
                    var rawProgress =
                        currentScrollPosition / maxScrollableDistance;
                    utils.log(
                        "Raw progress calculation: " +
                            currentScrollPosition +
                            " / " +
                            maxScrollableDistance +
                            " = " +
                            rawProgress
                    );

                    // Clamp the value between 0 and 1 to handle edge cases
                    var clampedProgress = Math.min(1, Math.max(0, rawProgress));
                    utils.log("Clamped progress (0-1): " + clampedProgress);

                    // For now, let's skip adjustments to see if basic calculation works
                    var progressPercentage = Math.round(clampedProgress * 100);
                    utils.log("Final percentage: " + progressPercentage + "%");
                    utils.log("=== END DIAGNOSIS ===");

                    return clampedProgress;
                },
                applyProgressAdjustments: function (
                    rawProgress,
                    progressConfig
                ) {
                    var adjustedProgress = rawProgress;

                    // Early completion recognition: users feel "done" before reaching absolute bottom
                    // This accounts for footers, comment sections, or other non-essential content
                    if (rawProgress >= progressConfig.completionThreshold) {
                        // Gradually approach 100% as user gets very close to bottom
                        // This creates satisfying completion feeling without premature 100% display
                        var remainingDistance =
                            1 - progressConfig.completionThreshold;
                        var progressBeyondThreshold =
                            rawProgress - progressConfig.completionThreshold;
                        var completionMultiplier =
                            progressBeyondThreshold / remainingDistance;

                        // Use easing function to smooth approach to 100%
                        adjustedProgress =
                            progressConfig.completionThreshold +
                            remainingDistance *
                                this.easeInOutQuad(completionMultiplier);
                    }

                    // Early progress enhancement: make initial reading feel more rewarding
                    // Small amounts of scrolling in the beginning feel like bigger achievements
                    if (rawProgress <= 0.1) {
                        // Slightly boost early progress to encourage continued reading
                        adjustedProgress = rawProgress * 1.2;
                    }

                    // Ensure final result stays within valid bounds
                    return Math.min(1, Math.max(0, adjustedProgress));
                },
                easeInOutQuad: function (t) {
                    // Quadratic easing function for smooth animation curves
                    // Creates natural acceleration and deceleration in progress changes
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },

                smoothProgressTransition: function (
                    previousProgress,
                    newProgress,
                    smoothingFactor
                ) {
                    // Calculate the difference between current and target progress
                    var progressDifference = Math.abs(
                        newProgress - previousProgress
                    );

                    // Use adaptive smoothing based on the size of change and proximity to completion
                    var adaptiveFactor = smoothingFactor;

                    // Increase responsiveness for large changes (user jumping around document)
                    if (progressDifference > 0.1) {
                        adaptiveFactor = 0.4; // Much more responsive for big jumps
                    }

                    // Increase responsiveness significantly when approaching 100%
                    if (newProgress > 0.9) {
                        adaptiveFactor = 0.6; // Very responsive near completion
                    }

                    // For the final approach to 100%, use minimal smoothing
                    if (newProgress > 0.95) {
                        adaptiveFactor = 0.8; // Almost immediate response at the very end
                    }

                    // Apply the adaptive smoothing
                    var actualDifference = newProgress - previousProgress;
                    var smoothedChange = actualDifference * adaptiveFactor;

                    return previousProgress + smoothedChange;
                },

                updateProgressBar: function (percentage) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Update progress indicators based on current interface mode
                    // Each mode has its own progress display elements that need updating

                    if (this.state.currentMode === "desktop") {
                        // Update desktop progress bar if it exists
                        var desktopProgressBar =
                            this.state.tocElements.progressBar;
                        if (desktopProgressBar) {
                            desktopProgressBar.style.width = percentage + "%";
                            desktopProgressBar.setAttribute(
                                "aria-valuenow",
                                percentage
                            );
                        }
                    } else if (this.state.currentMode === "mobile") {
                        // Update mobile progress indicators
                        this.updateFloatingButtonProgress(percentage);
                        this.updateMobilePanelProgress();
                    }

                    utils.log(
                        "Progress updated for " +
                            this.state.currentMode +
                            " mode: " +
                            percentage +
                            "%"
                    );
                },
                createMobileTOC: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Creating mobile TOC interface with floating design"
                    );

                    // Step 1: Create the main container that will hold all mobile TOC elements
                    // Think of this as the "stage" where our mobile TOC performance will happen
                    var mobileContainer = document.createElement("div");
                    mobileContainer.className = "mobile-toc-system";
                    mobileContainer.setAttribute(
                        "aria-label",
                        "Mobile table of contents navigation"
                    );

                    // Step 2: Create the floating action button - this is what users will see and tap
                    // This button serves dual purpose: navigation trigger and reading progress indicator
                    var floatingButton = this.createFloatingTOCButton();
                    if (!floatingButton) {
                        utils.log(
                            "Failed to create floating TOC button",
                            "error"
                        );
                        return false;
                    }

                    // Step 3: Create the slide-up navigation panel - this appears when button is tapped
                    // This panel contains the actual navigation links and reading progress
                    var navigationPanel = this.createMobileTOCPanel();
                    if (!navigationPanel) {
                        utils.log("Failed to create mobile TOC panel", "error");
                        return false;
                    }

                    // Step 4: Assemble the complete mobile TOC system
                    // Order matters here - button should be above panel in DOM for proper layering
                    mobileContainer.appendChild(floatingButton);
                    mobileContainer.appendChild(navigationPanel);

                    // Step 5: Insert the complete system into the page
                    // We append to body to ensure it's always on top and not constrained by parent containers
                    document.body.appendChild(mobileContainer);

                    // Step 6: Store references for later manipulation and cleanup
                    // This allows other functions to interact with these elements efficiently
                    this.state.tocElements.mobileContainer = mobileContainer;
                    this.state.tocElements.floatingButton = floatingButton;
                    this.state.tocElements.mobilePanel = navigationPanel;

                    utils.log("Mobile TOC interface created successfully");
                    return true;
                },
                createFloatingTOCButton: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Creating floating TOC button with progress indicator"
                    );

                    // Create the main button container with proper accessibility attributes
                    var buttonContainer = document.createElement("div");
                    buttonContainer.className = "floating-toc-button";
                    buttonContainer.setAttribute("role", "button");
                    buttonContainer.setAttribute("tabindex", "0");
                    buttonContainer.setAttribute(
                        "aria-label",
                        "Open table of contents navigation"
                    );
                    buttonContainer.setAttribute("aria-expanded", "false");

                    // Create the circular progress ring that shows reading progress
                    var progressRing = document.createElement("div");
                    progressRing.className = "progress-ring";
                    progressRing.setAttribute("aria-hidden", "true");

                    // Create the actual progress circle using SVG for crisp rendering
                    // IMPORTANT: SVG elements require setAttribute for class assignment
                    var progressSVG = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    progressSVG.setAttribute("width", "56");
                    progressSVG.setAttribute("height", "56");
                    progressSVG.setAttribute("viewBox", "0 0 56 56");
                    // Fix: Use setAttribute instead of className for SVG elements
                    progressSVG.setAttribute("class", "progress-svg");

                    // Background circle - represents the total content length
                    var backgroundCircle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    backgroundCircle.setAttribute("cx", "28");
                    backgroundCircle.setAttribute("cy", "28");
                    backgroundCircle.setAttribute("r", "26");
                    backgroundCircle.setAttribute("fill", "none");
                    backgroundCircle.setAttribute(
                        "stroke",
                        "rgba(255, 255, 255, 0.1)"
                    );
                    backgroundCircle.setAttribute("stroke-width", "2");
                    // Fix: Use setAttribute for SVG class assignment
                    backgroundCircle.setAttribute(
                        "class",
                        "progress-background"
                    );

                    // Progress circle - represents how much content has been read
                    var progressCircle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    progressCircle.setAttribute("cx", "28");
                    progressCircle.setAttribute("cy", "28");
                    progressCircle.setAttribute("r", "26");
                    progressCircle.setAttribute("fill", "none");
                    progressCircle.setAttribute(
                        "stroke",
                        "url(#progressGradient)"
                    );
                    progressCircle.setAttribute("stroke-width", "2");
                    progressCircle.setAttribute("stroke-linecap", "round");
                    // Fix: Use setAttribute for SVG class assignment
                    progressCircle.setAttribute("class", "progress-circle");

                    // Calculate the circumference for proper progress calculation
                    var circumference = 2 * Math.PI * 26; // radius is 26
                    progressCircle.style.strokeDasharray = circumference;
                    progressCircle.style.strokeDashoffset = circumference; // Start with 0% progress

                    // Create gradient definition for beautiful progress colors
                    var defs = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "defs"
                    );
                    var gradient = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "linearGradient"
                    );
                    gradient.setAttribute("id", "progressGradient");
                    gradient.setAttribute("x1", "0%");
                    gradient.setAttribute("y1", "0%");
                    gradient.setAttribute("x2", "100%");
                    gradient.setAttribute("y2", "100%");

                    var stop1 = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "stop"
                    );
                    stop1.setAttribute("offset", "0%");
                    stop1.setAttribute("stop-color", "#667eea");

                    var stop2 = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "stop"
                    );
                    stop2.setAttribute("offset", "100%");
                    stop2.setAttribute("stop-color", "#764ba2");

                    gradient.appendChild(stop1);
                    gradient.appendChild(stop2);
                    defs.appendChild(gradient);

                    // Assemble the SVG progress indicator
                    progressSVG.appendChild(defs);
                    progressSVG.appendChild(backgroundCircle);
                    progressSVG.appendChild(progressCircle);
                    progressRing.appendChild(progressSVG);

                    // Create the central icon that indicates the button's purpose
                    var buttonIcon = document.createElement("div");
                    buttonIcon.className = "toc-button-icon";
                    buttonIcon.innerHTML =
                        '<i class="fas fa-list-ul" aria-hidden="true"></i>';

                    // Create a subtle pulse animation element for visual appeal
                    var pulseElement = document.createElement("div");
                    pulseElement.className = "button-pulse";
                    pulseElement.setAttribute("aria-hidden", "true");

                    // Assemble all button components in proper layering order
                    buttonContainer.appendChild(pulseElement);
                    buttonContainer.appendChild(progressRing);
                    buttonContainer.appendChild(buttonIcon);

                    // Store references for easy updates during scroll
                    buttonContainer.progressCircle = progressCircle;
                    buttonContainer.circumference = circumference;

                    utils.log(
                        "Floating TOC button created with progress tracking capability"
                    );

                    return buttonContainer;
                },
                createMobileTOCPanel: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Creating mobile TOC navigation panel with modern slide-up design"
                    );

                    // Create the main panel container that will slide up from bottom
                    // This container serves as the foundation for our entire navigation interface
                    var panelContainer = document.createElement("div");
                    panelContainer.className = "mobile-toc-panel";
                    panelContainer.setAttribute(
                        "aria-label",
                        "Table of contents navigation panel"
                    );
                    panelContainer.setAttribute("aria-hidden", "true"); // Start hidden
                    panelContainer.setAttribute("role", "dialog");

                    // Create overlay backdrop that appears behind the panel
                    // This provides visual separation and allows closing panel by tapping outside
                    var panelOverlay = document.createElement("div");
                    panelOverlay.className = "mobile-toc-overlay";
                    panelOverlay.setAttribute("aria-hidden", "true");

                    // Create the actual content area of the panel
                    // This contains the header, navigation list, and any additional controls
                    var panelContent = document.createElement("div");
                    panelContent.className = "mobile-toc-content";

                    // Create panel header with title and close button
                    // Header provides context and easy dismissal option for users
                    var panelHeader = document.createElement("div");
                    panelHeader.className = "mobile-toc-header";

                    // Create drag handle indicator at top of panel
                    // This visual cue suggests the panel can be dragged to close
                    var dragHandle = document.createElement("div");
                    dragHandle.className = "mobile-toc-drag-handle";
                    dragHandle.setAttribute("aria-hidden", "true");

                    // Create title area that shows current reading progress and document info
                    var titleArea = document.createElement("div");
                    titleArea.className = "mobile-toc-title-area";

                    var panelTitle = document.createElement("h3");
                    panelTitle.className = "mobile-toc-title";
                    panelTitle.textContent = "Table of Contents";

                    // Create reading progress summary for quick reference
                    var progressSummary = document.createElement("div");
                    progressSummary.className = "mobile-toc-progress-summary";
                    progressSummary.innerHTML =
                        '<span class="progress-text">Reading progress: <strong>0%</strong></span>';

                    titleArea.appendChild(panelTitle);
                    titleArea.appendChild(progressSummary);

                    // Create close button for explicit dismissal
                    var closeButton = document.createElement("button");
                    closeButton.className = "mobile-toc-close";
                    closeButton.setAttribute(
                        "aria-label",
                        "Close table of contents"
                    );
                    closeButton.innerHTML =
                        '<i class="fas fa-times" aria-hidden="true"></i>';

                    // Assemble the header components
                    panelHeader.appendChild(dragHandle);
                    panelHeader.appendChild(titleArea);
                    panelHeader.appendChild(closeButton);

                    // Create the navigation area that will contain all heading links
                    var navigationArea = document.createElement("div");
                    navigationArea.className = "mobile-toc-navigation";

                    // Create scrollable list container for the actual navigation links
                    // This allows handling documents with many sections without overwhelming the interface
                    var navigationList = document.createElement("div");
                    navigationList.className = "mobile-toc-list";
                    navigationList.setAttribute("role", "navigation");
                    navigationList.setAttribute(
                        "aria-label",
                        "Document sections"
                    );

                    // Generate navigation links from the headings we found earlier
                    var headings = this.state.headings;
                    if (headings && headings.length > 0) {
                        utils.log(
                            "Generating " +
                                headings.length +
                                " navigation links for mobile panel"
                        );

                        for (var i = 0; i < headings.length; i++) {
                            var heading = headings[i];

                            // Create individual navigation item for each heading
                            var navItem = document.createElement("div");
                            navItem.className =
                                "mobile-toc-item toc-level-" + heading.level;

                            // Create the clickable link that will scroll to the section
                            var navLink = document.createElement("a");
                            navLink.href = "#" + heading.id;
                            navLink.className = "mobile-toc-link";
                            navLink.textContent = heading.text;
                            navLink.setAttribute("data-target", heading.id);

                            // Add visual indicator for different heading levels
                            var levelIndicator = document.createElement("span");
                            levelIndicator.className = "level-indicator";
                            levelIndicator.setAttribute("aria-hidden", "true");

                            // Create progress indicator for this specific section
                            var sectionProgress =
                                document.createElement("span");
                            sectionProgress.className = "section-progress";
                            sectionProgress.setAttribute("aria-hidden", "true");

                            // Assemble the navigation item
                            navItem.appendChild(levelIndicator);
                            navItem.appendChild(navLink);
                            navItem.appendChild(sectionProgress);

                            navigationList.appendChild(navItem);
                        }
                    } else {
                        // Fallback content if no headings are found
                        var noContent = document.createElement("div");
                        noContent.className = "mobile-toc-no-content";
                        noContent.textContent =
                            "No sections found in this document.";
                        navigationList.appendChild(noContent);
                    }

                    navigationArea.appendChild(navigationList);

                    // Create footer area with additional controls and information
                    var panelFooter = document.createElement("div");
                    panelFooter.className = "mobile-toc-footer";

                    // Add quick action buttons for common navigation tasks
                    var quickActions = document.createElement("div");
                    quickActions.className = "mobile-toc-quick-actions";

                    var scrollToTop = document.createElement("button");
                    scrollToTop.className = "quick-action-btn scroll-to-top";
                    scrollToTop.innerHTML =
                        '<i class="fas fa-arrow-up" aria-hidden="true"></i><span>Top</span>';
                    scrollToTop.setAttribute(
                        "aria-label",
                        "Scroll to top of document"
                    );

                    var scrollToBottom = document.createElement("button");
                    scrollToBottom.className =
                        "quick-action-btn scroll-to-bottom";
                    scrollToBottom.innerHTML =
                        '<i class="fas fa-arrow-down" aria-hidden="true"></i><span>Bottom</span>';
                    scrollToBottom.setAttribute(
                        "aria-label",
                        "Scroll to bottom of document"
                    );

                    quickActions.appendChild(scrollToTop);
                    quickActions.appendChild(scrollToBottom);
                    panelFooter.appendChild(quickActions);

                    // Assemble all panel content components
                    panelContent.appendChild(panelHeader);
                    panelContent.appendChild(navigationArea);
                    panelContent.appendChild(panelFooter);

                    // Assemble the complete panel with overlay
                    panelContainer.appendChild(panelOverlay);
                    panelContainer.appendChild(panelContent);

                    // Store references to key elements for later interaction
                    panelContainer.navigationList = navigationList;
                    panelContainer.progressSummary = progressSummary;
                    panelContainer.closeButton = closeButton;
                    panelContainer.overlay = panelOverlay;

                    utils.log(
                        "Mobile TOC panel created with " +
                            (headings ? headings.length : 0) +
                            " navigation items"
                    );

                    return panelContainer;
                },
                handleBreakpointChange: function () {},
                setupSmartVisibility: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Setting up intelligent TOC visibility management"
                    );

                    // Configuration for smart visibility behavior
                    var visibilityConfig = {
                        scrollThreshold: 0.1, // Show TOC after 15% of content scrolled
                        timeThreshold: 5000, // Minimum time on page (10 seconds)
                        hideOnTop: true, // Hide when user returns to top
                        topThreshold: 0.05, // Consider "top" as first 5% of content
                    };

                    // State tracking for user behavior analysis
                    var behaviorState = {
                        pageLoadTime: Date.now(), // When user arrived on page
                        isVisible: false, // Current TOC visibility state
                        hasBeenVisible: false, // Whether TOC has ever been shown
                        lastScrollPosition: 0, // Previous scroll position for direction detection
                        scrollDirection: "down", // Current scroll direction
                    };

                    var scrollHandler = utils.throttle(
                        function () {
                            var currentTime = Date.now();
                            var timeOnPage =
                                currentTime - behaviorState.pageLoadTime;

                            // Calculate scroll position as percentage of total content
                            var scrollTop =
                                window.pageYOffset ||
                                document.documentElement.scrollTop;
                            var documentHeight =
                                document.documentElement.scrollHeight -
                                window.innerHeight;
                            var scrollPercent = scrollTop / documentHeight;

                            // Detect scroll direction for behavior analysis
                            var newDirection =
                                scrollTop > behaviorState.lastScrollPosition
                                    ? "down"
                                    : "up";
                            behaviorState.scrollDirection = newDirection;
                            behaviorState.lastScrollPosition = scrollTop;

                            // Log detailed behavior analysis for debugging
                            utils.log(
                                "Behavior analysis: " +
                                    Math.round(scrollPercent * 100) +
                                    "% scrolled, " +
                                    Math.round(timeOnPage / 1000) +
                                    "s on page, scrolling " +
                                    newDirection
                            );

                            // Apply visibility logic based on analyzed behavior
                            self.evaluateVisibilityConditions(
                                scrollPercent,
                                timeOnPage,
                                behaviorState,
                                visibilityConfig
                            );
                        },
                        100,
                        "toc-smart-visibility"
                    ); // Throttle to 100ms for smooth performance

                    // Attach the scroll handler to monitor user behavior
                    utils.addEventListener(window, "scroll", scrollHandler, {
                        passive: true,
                    });

                    utils.log("Smart visibility system initialized");
                },
                evaluateVisibilityConditions: function (
                    scrollPercent,
                    timeOnPage,
                    behaviorState,
                    visibilityConfig
                ) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Determine if TOC should be visible based on current conditions
                    var shouldBeVisible = this.calculateOptimalVisibility(
                        scrollPercent,
                        timeOnPage,
                        behaviorState,
                        visibilityConfig
                    );

                    // Apply visibility changes only when state actually changes
                    if (shouldBeVisible !== behaviorState.isVisible) {
                        this.updateTOCVisibility(
                            shouldBeVisible,
                            behaviorState
                        );

                        // Log visibility state changes for debugging and optimization
                        var reason = this.getVisibilityChangeReason(
                            scrollPercent,
                            timeOnPage,
                            behaviorState,
                            visibilityConfig
                        );
                        utils.log(
                            "TOC visibility changed to " +
                                (shouldBeVisible ? "visible" : "hidden") +
                                ": " +
                                reason
                        );
                    }
                },
                calculateOptimalVisibility: function (
                    scrollPercent,
                    timeOnPage,
                    behaviorState,
                    visibilityConfig
                ) {
                    // Check if user has spent enough time on page to warrant TOC assistance
                    var hasMinimumTimeInvestment =
                        timeOnPage >= visibilityConfig.timeThreshold;

                    // Check if user has scrolled enough to indicate serious reading intent
                    var hasScrolledSufficientDistance =
                        scrollPercent >= visibilityConfig.scrollThreshold;

                    // Special logic for hiding TOC when user returns to top of document
                    var isAtTopOfDocument =
                        scrollPercent <= visibilityConfig.topThreshold;
                    var shouldHideAtTop =
                        visibilityConfig.hideOnTop &&
                        isAtTopOfDocument &&
                        behaviorState.hasBeenVisible;

                    // Primary visibility condition: show TOC when user demonstrates reading engagement
                    var primaryCondition =
                        hasMinimumTimeInvestment &&
                        hasScrolledSufficientDistance;

                    // Override condition: hide when user returns to top after having seen TOC
                    var overrideCondition = shouldHideAtTop;

                    // Final decision combines primary logic with override scenarios
                    return primaryCondition && !overrideCondition;
                },
                updateTOCVisibility: function (shouldBeVisible, behaviorState) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Get reference to the TOC container for state manipulation
                    var tocContainer = this.state.tocElements.desktopContainer;
                    if (!tocContainer) {
                        utils.log(
                            "Cannot update TOC visibility: container not found",
                            "error"
                        );
                        return;
                    }

                    if (shouldBeVisible && !behaviorState.isVisible) {
                        // Show TOC with elegant CSS animation by adding visible class
                        tocContainer.classList.add("visible");
                        behaviorState.isVisible = true;
                        behaviorState.hasBeenVisible = true; // Track that TOC has been shown at least once
                        utils.log("TOC activated with smooth animation");
                    } else if (!shouldBeVisible && behaviorState.isVisible) {
                        // Hide TOC by removing visible class, leveraging CSS transitions
                        tocContainer.classList.remove("visible");
                        behaviorState.isVisible = false;
                        utils.log("TOC deactivated with smooth animation");
                    }
                },
                getVisibilityChangeReason: function (
                    scrollPercent,
                    timeOnPage,
                    behaviorState,
                    visibilityConfig
                ) {
                    var timeInSeconds = Math.round(timeOnPage / 1000);
                    var scrollPercentage = Math.round(scrollPercent * 100);

                    // Analyze specific conditions that triggered the visibility change
                    if (
                        scrollPercent <= visibilityConfig.topThreshold &&
                        behaviorState.hasBeenVisible
                    ) {
                        return (
                            "User returned to top of document (" +
                            scrollPercentage +
                            "% position)"
                        );
                    }

                    if (timeOnPage < visibilityConfig.timeThreshold) {
                        return (
                            "Insufficient time investment: " +
                            timeInSeconds +
                            "s (minimum: " +
                            Math.round(visibilityConfig.timeThreshold / 1000) +
                            "s)"
                        );
                    }

                    if (scrollPercent < visibilityConfig.scrollThreshold) {
                        return (
                            "Insufficient scroll depth: " +
                            scrollPercentage +
                            "% (minimum: " +
                            Math.round(visibilityConfig.scrollThreshold * 100) +
                            "%)"
                        );
                    }

                    // Default reason for showing TOC when all conditions are met
                    return (
                        "Reading engagement detected: " +
                        timeInSeconds +
                        "s on page, " +
                        scrollPercentage +
                        "% scrolled, direction: " +
                        behaviorState.scrollDirection
                    );
                },
                setupNavigationHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Setting up intelligent navigation handlers");

                    // Find all TOC navigation links for event binding
                    var tocLinks =
                        this.state.tocElements.tocList.querySelectorAll(
                            ".toc-link"
                        );

                    // Attach smart navigation handler to each link
                    for (var i = 0; i < tocLinks.length; i++) {
                        var link = tocLinks[i];

                        utils.addEventListener(
                            link,
                            "click",
                            function (event) {
                                // Prevent default browser anchor behavior
                                event.preventDefault();

                                // Extract target heading ID from the link
                                var targetId =
                                    this.getAttribute("href").substring(1); // Remove # symbol
                                var targetElement =
                                    document.getElementById(targetId);

                                if (!targetElement) {
                                    utils.log(
                                        "Navigation target not found: " +
                                            targetId,
                                        "error"
                                    );
                                    return;
                                }

                                // Calculate optimal scroll position accounting for dynamic header
                                var optimalPosition =
                                    self.calculateOptimalScrollPosition(
                                        targetElement
                                    );

                                // Perform smooth scroll to calculated position
                                self.performSmoothScroll(
                                    optimalPosition,
                                    targetElement
                                );

                                // Update browser history for proper back/forward button behavior
                                if (history.pushState) {
                                    history.pushState(
                                        null,
                                        null,
                                        "#" + targetId
                                    );
                                }
                            },
                            { passive: false }
                        ); // passive: false allows preventDefault()
                    }

                    utils.log(
                        "Navigation handlers attached to " +
                            tocLinks.length +
                            " TOC links"
                    );
                },
                calculateOptimalScrollPosition: function (targetElement) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Calculate absolute position of element relative to document
                    // This method accumulates offsets from the element up to the document root
                    var elementTop = 0;
                    var currentElement = targetElement;

                    // Walk up the DOM tree to calculate true absolute position
                    while (currentElement) {
                        elementTop += currentElement.offsetTop;
                        currentElement = currentElement.offsetParent;
                    }

                    // Calculate dynamic header height including admin bar if present
                    var headerHeight = utils.getHeaderHeight();

                    // Add breathing room for better visual separation
                    var breathingRoom = 20;

                    // Calculate final scroll position with all offsets
                    var finalPosition = Math.max(
                        0,
                        elementTop - headerHeight - breathingRoom
                    );

                    utils.log(
                        'Improved position calculation for "' +
                            targetElement.textContent.trim() +
                            '": ' +
                            finalPosition +
                            "px (absolute element position: " +
                            elementTop +
                            "px, header: " +
                            headerHeight +
                            "px)"
                    );

                    return finalPosition;
                },
                performSmoothScroll: function (targetPosition, targetElement) {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Initiating smooth scroll to position: " +
                            targetPosition +
                            "px"
                    );

                    // Try modern smooth scroll API first (best performance and browser optimization)
                    if ("scrollBehavior" in document.documentElement.style) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth",
                        });

                        utils.log(
                            "Using native smooth scroll API for optimal performance"
                        );

                        // Set up completion detection for native smooth scroll
                        this.detectScrollCompletion(
                            targetPosition,
                            targetElement
                        );
                    } else {
                        // Fallback to custom animation for older browsers
                        utils.log(
                            "Native smooth scroll not supported, using custom animation fallback"
                        );
                        this.performCustomSmoothScroll(
                            targetPosition,
                            targetElement
                        );
                    }
                },
                detectScrollCompletion: function (
                    targetPosition,
                    targetElement
                ) {
                    var utils = CloudSync.adaptivePages.utils;
                    var checkInterval = 50; // Check every 50ms for smooth detection
                    var tolerance = 5; // Allow 5px tolerance for position matching
                    var maxWaitTime = 2000; // Maximum wait time of 2 seconds
                    var startTime = Date.now();

                    var completionChecker = setInterval(function () {
                        var currentPosition =
                            window.pageYOffset ||
                            document.documentElement.scrollTop;
                        var timePassed = Date.now() - startTime;

                        // Check if we've reached the target position (within tolerance)
                        var positionReached =
                            Math.abs(currentPosition - targetPosition) <=
                            tolerance;

                        // Check if maximum wait time exceeded (animation might be interrupted)
                        var timeoutReached = timePassed >= maxWaitTime;

                        if (positionReached || timeoutReached) {
                            clearInterval(completionChecker);

                            if (positionReached) {
                                utils.log(
                                    'Smooth scroll completed successfully to "' +
                                        targetElement.textContent.trim() +
                                        '"'
                                );
                            } else {
                                utils.log(
                                    "Smooth scroll timeout reached, assuming completion"
                                );
                            }
                        }
                    }, checkInterval);
                },
            },
        },

        /**
         * Core utilities that provide shared functionality across all modules
         * Think of this as the "standard library" for our adaptive pages system
         */
        utils: {
            /**
             * Internal state for utilities
             */
            state: {
                isInitialized: false,
                eventListeners: [], // Track listeners for cleanup
                throttledFunctions: new Map(), // Cache throttled functions
            },

            /**
             * Initialize utility system
             * Sets up performance monitoring and shared resources
             */
            init: function () {
                if (this.state.isInitialized) return;
                this.log("Initializing utility system", "info");
                this.state.isInitialized = true;
            },

            /**
             * Intelligent logging system with debug levels
             * Only logs when debug mode is enabled, preventing console spam in production
             *
             * @param {string} message - The message to log
             * @param {string} level - Log level: 'info', 'warn', 'error'
             * @param {*} data - Optional additional data to log
             */
            log: function (message, level, data) {
                if (!CloudSync.adaptivePages.config.debug) return;

                var prefix = "[CloudSync AdaptivePages]";
                var timestamp = new Date().toISOString().substr(11, 8);
                var fullMessage = prefix + " " + timestamp + " " + message;

                switch (level) {
                    case "warn":
                        console.warn(fullMessage, data || "");
                        break;
                    case "error":
                        console.error(fullMessage, data || "");
                        break;
                    default:
                        console.log(fullMessage, data || "");
                }
            },

            /**
             * Enhanced DOM query with error handling and caching
             * Provides better error messages and prevents null reference errors
             *
             * @param {string} selector - CSS selector
             * @param {Element} context - Optional context element (default: document)
             * @returns {Element|null} Found element or null
             */
            querySelector: function (selector, context) {
                context = context || document;

                try {
                    var element = context.querySelector(selector);
                    if (!element) {
                        this.log("Element not found: " + selector, "warn");
                    }
                    return element;
                } catch (error) {
                    this.log("Invalid selector: " + selector, "error", error);
                    return null;
                }
            },

            /**
             * Enhanced DOM query for multiple elements
             *
             * @param {string} selector - CSS selector
             * @param {Element} context - Optional context element
             * @returns {NodeList} Found elements (may be empty)
             */
            querySelectorAll: function (selector, context) {
                context = context || document;

                try {
                    return context.querySelectorAll(selector);
                } catch (error) {
                    this.log("Invalid selector: " + selector, "error", error);
                    return document.createDocumentFragment().childNodes; // Empty NodeList
                }
            },

            /**
             * Performance-optimized throttle function with caching
             * Prevents excessive function calls during scroll/resize events
             * Uses Map for O(1) lookup performance
             *
             * @param {Function} func - Function to throttle
             * @param {number} delay - Throttle delay in milliseconds
             * @param {string} key - Unique identifier for caching
             * @returns {Function} Throttled function
             */
            throttle: function (func, delay, key) {
                // Check if we already have a throttled version of this function
                if (this.state.throttledFunctions.has(key)) {
                    return this.state.throttledFunctions.get(key);
                }

                var lastExecution = 0;
                var timeoutId = null;

                var throttledFunction = function () {
                    var context = this;
                    var args = arguments;
                    var now = Date.now();

                    if (now - lastExecution >= delay) {
                        lastExecution = now;
                        func.apply(context, args);
                    } else if (!timeoutId) {
                        timeoutId = setTimeout(function () {
                            lastExecution = Date.now();
                            timeoutId = null;
                            func.apply(context, args);
                        }, delay - (now - lastExecution));
                    }
                };

                // Cache the throttled function for reuse
                this.state.throttledFunctions.set(key, throttledFunction);
                return throttledFunction;
            },

            /**
             * Debounce function for resize events and user input
             * Delays execution until after the specified wait period has elapsed
             *
             * @param {Function} func - Function to debounce
             * @param {number} delay - Debounce delay in milliseconds
             * @returns {Function} Debounced function
             */
            debounce: function (func, delay) {
                var timeoutId;

                return function () {
                    var context = this;
                    var args = arguments;

                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        func.apply(context, args);
                    }, delay);
                };
            },

            /**
             * Safe event listener registration with automatic cleanup tracking
             * Prevents memory leaks by tracking all listeners for later removal
             *
             * @param {Element} element - Element to attach listener to
             * @param {string} event - Event type
             * @param {Function} handler - Event handler function
             * @param {Object} options - Event listener options
             */
            addEventListener: function (element, event, handler, options) {
                if (!element || typeof handler !== "function") {
                    this.log("Invalid addEventListener parameters", "error");
                    return;
                }

                element.addEventListener(event, handler, options);

                // Track for cleanup
                this.state.eventListeners.push({
                    element: element,
                    event: event,
                    handler: handler,
                    options: options,
                });
            },

            /**
             * Generate unique, SEO-friendly IDs for headings
             * Ensures IDs are unique across the document and URL-safe
             *
             * @param {string} text - Text to convert to ID
             * @param {string} prefix - Optional prefix for the ID
             * @returns {string} Unique, URL-safe ID
             */
            generateUniqueId: function (text, prefix) {
                prefix = prefix || "toc";

                // Create base ID from text
                var baseId =
                    prefix +
                    "-" +
                    text
                        .toLowerCase()
                        .trim()
                        .replace(/[^\w\s-]/g, "") // Remove special characters
                        .replace(/\s+/g, "-") // Replace spaces with hyphens
                        .replace(/-+/g, "-") // Collapse multiple hyphens
                        .substring(0, 50); // Limit length for readability

                // Ensure uniqueness
                var finalId = baseId;
                var counter = 1;

                while (document.getElementById(finalId)) {
                    finalId = baseId + "-" + counter;
                    counter++;
                }

                return finalId;
            },

            /**
             * Calculate dynamic header height for scroll positioning
             * Accounts for fixed headers, admin bars, and mobile variations
             *
             * @returns {number} Current header height in pixels
             */
            getHeaderHeight: function () {
                var header = this.querySelector(".site-header");
                var adminBar = this.querySelector("#wpadminbar");

                var headerHeight = header ? header.offsetHeight : 0;
                var adminBarHeight = adminBar ? adminBar.offsetHeight : 0;

                return headerHeight + adminBarHeight;
            },

            /**
             * Cross-browser compatible smooth scroll to element
             * Handles fixed header offset and provides fallback for older browsers
             *
             * @param {Element} targetElement - Element to scroll to
             * @param {number} additionalOffset - Additional offset in pixels
             */
            scrollToElement: function (targetElement, additionalOffset) {
                if (!targetElement) return;

                additionalOffset = additionalOffset || 0;
                var headerHeight = this.getHeaderHeight();
                var totalOffset = headerHeight + additionalOffset + 20; // 20px breathing room

                var targetPosition = Math.max(
                    0,
                    targetElement.offsetTop - totalOffset
                );

                // Use modern smooth scroll if available
                if ("scrollBehavior" in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition);
                }
            },

            /**
             * Cleanup all tracked event listeners
             * Prevents memory leaks when destroying the system
             */
            cleanup: function () {
                this.log("Cleaning up utility system");

                // Remove all tracked event listeners
                this.state.eventListeners.forEach(function (listener) {
                    if (
                        listener.element &&
                        listener.element.removeEventListener
                    ) {
                        listener.element.removeEventListener(
                            listener.event,
                            listener.handler,
                            listener.options
                        );
                    }
                });

                // Clear tracking arrays
                this.state.eventListeners = [];
                this.state.throttledFunctions.clear();
                this.state.isInitialized = false;
            },
        },
        /**
         * Main initialization coordinator for the adaptive pages system
         * This method serves as the central hub that orchestrates all system components
         * Think of it as the conductor of an orchestra, ensuring each section plays in harmony
         */
        /**
         * Enhanced main initialization with comprehensive error handling
         * This version includes multiple checkpoints and graceful error recovery
         */
        init: function () {
            try {
                this.utils.log("=== STARTING SYSTEM INITIALIZATION ===");

                // Prevent duplicate initialization
                if (this.state.isInitialized) {
                    this.utils.log("System already initialized, skipping");
                    return false;
                }

                // Only run on actual pages, not posts or archives
                if (
                    !document.body ||
                    !document.body.classList.contains("page")
                ) {
                    this.utils.log(
                        "Not a page context, initialization cancelled"
                    );
                    return false;
                }

                // Step 1: Initialize the utility system
                this.utils.log("Step 1: Initializing utility system");
                if (this.utils && typeof this.utils.init === "function") {
                    this.utils.init();
                    this.utils.log("✓ Utility system initialized successfully");
                } else {
                    this.utils.log("✗ Utils system not available", "error");
                    return false;
                }

                // Step 2: Analyze page context
                this.utils.log("Step 2: Analyzing page context");
                this.state.pageContext = this.analyzePageContext();
                if (!Array.isArray(this.state.pageContext)) {
                    this.utils.log(
                        "Page context analysis failed, using empty array",
                        "warn"
                    );
                    this.state.pageContext = [];
                }
                this.utils.log(
                    "✓ Page context: " +
                        (this.state.pageContext.length > 0
                            ? this.state.pageContext.join(", ")
                            : "standard page")
                );

                // Step 3: Detect device breakpoint
                this.utils.log("Step 3: Detecting device breakpoint");
                var detectedBreakpoint = this.detectBreakpoint();
                this.utils.log(
                    "Breakpoint detection returned: " + detectedBreakpoint
                );

                if (detectedBreakpoint) {
                    this.state.currentBreakpoint = detectedBreakpoint;
                    this.utils.log(
                        "✓ Breakpoint set to: " + this.state.currentBreakpoint
                    );
                } else {
                    this.utils.log(
                        "Breakpoint detection failed, using mobile fallback",
                        "warn"
                    );
                    this.state.currentBreakpoint = "mobile";
                }

                // Step 4: Setup global listeners
                this.utils.log("Step 4: Setting up global event listeners");
                this.setupGlobalListeners();
                this.utils.log("✓ Global listeners established");

                // Step 5: Initialize modules
                this.utils.log("Step 5: Initializing modules");
                this.initializeModules();
                this.utils.log("✓ Module initialization completed");

                // Final step: Mark as initialized
                this.state.isInitialized = true;
                this.utils.log(
                    "=== SYSTEM INITIALIZATION COMPLETED SUCCESSFULLY ==="
                );

                // Automatically run debug output to show final state
                setTimeout(function () {
                    CloudSync.adaptivePages.debugSystem();
                }, 100);

                return true;
            } catch (error) {
                this.utils.log(
                    "CRITICAL ERROR during initialization",
                    "error",
                    error
                );
                return false;
            }
        },

        /**
         * Analyze the current page to understand its content and context
         * This method examines page characteristics to help modules make smart decisions
         * Now includes protective checks to prevent null reference errors
         */
        analyzePageContext: function () {
            // Start with empty array to ensure we always return a valid array
            var context = [];

            try {
                // Safely check for body element and its classes
                if (
                    document.querySelector("main") &&
                    document.querySelector("main").className
                ) {
                    var mainClasses = document.querySelector("main").className;

                    // Detect content type based on WordPress body classes
                    if (mainClasses.indexOf("page-type-legal") !== -1) {
                        context.push("legal-document");
                    }

                    if (mainClasses.indexOf("long-content") !== -1) {
                        context.push("long-form-content");
                    }

                    if (mainClasses.indexOf("image-rich") !== -1) {
                        context.push("visual-heavy");
                    }
                }

                // Safely analyze URL patterns for additional context
                if (window.location && window.location.pathname) {
                    var currentPath = window.location.pathname.toLowerCase();
                    if (
                        currentPath.indexOf("privacy") !== -1 ||
                        currentPath.indexOf("terms") !== -1
                    ) {
                        context.push("legal-document");
                    }
                }

                this.utils.log(
                    "Page context analyzed: " +
                        (context.length > 0
                            ? context.join(", ")
                            : "standard page")
                );
            } catch (error) {
                this.utils.log(
                    "Error during page context analysis",
                    "error",
                    error
                );
                // Return empty array on error to maintain expected data type
            }

            return context;
        },

        /**
         * Enhanced breakpoint detection with comprehensive logging
         * This version provides detailed information about the detection process
         */
        detectBreakpoint: function () {
            var utils = CloudSync.adaptivePages.utils;

            try {
                // Gather comprehensive window information
                var windowWidth = window.innerWidth || 0;
                var windowHeight = window.innerHeight || 0;
                var screenWidth = window.screen ? window.screen.width : 0;
                var outerWidth = window.outerWidth || 0;

                utils.log(
                    "Window dimensions: " + windowWidth + "x" + windowHeight
                );
                utils.log(
                    "Screen width: " +
                        screenWidth +
                        ", Outer width: " +
                        outerWidth
                );
                utils.log(
                    "Breakpoint threshold: " +
                        this.config.tocDesktopBreakpoint +
                        "px"
                );

                // Determine breakpoint based on window width
                var breakpoint;
                if (windowWidth >= this.config.tocDesktopBreakpoint) {
                    breakpoint = "desktop";
                } else if (windowWidth >= 768) {
                    breakpoint = "tablet";
                } else {
                    breakpoint = "mobile";
                }

                utils.log(
                    "Calculated breakpoint: " +
                        breakpoint +
                        " (based on width: " +
                        windowWidth +
                        "px)"
                );
                return breakpoint;
            } catch (error) {
                utils.log("Error in breakpoint detection", "error", error);
                return "mobile"; // Safe fallback
            }
        },

        /**
         * Set up global event listeners that multiple modules might need
         * This prevents duplicate listeners and provides centralized event management
         * Like setting up a central communication system for a building
         */
        setupGlobalListeners: function () {
            var self = this;

            // Set up responsive breakpoint monitoring
            var resizeHandler = this.utils.debounce(function () {
                var oldBreakpoint = self.state.currentBreakpoint;
                var newBreakpoint = self.detectBreakpoint();

                if (oldBreakpoint !== newBreakpoint) {
                    self.utils.log(
                        "Breakpoint changed from " +
                            oldBreakpoint +
                            " to " +
                            newBreakpoint
                    );
                    self.state.currentBreakpoint = newBreakpoint;
                    self.handleBreakpointChange(oldBreakpoint, newBreakpoint);
                }
            }, this.config.resizeDebounce);

            this.utils.addEventListener(window, "resize", resizeHandler, {
                passive: true,
            });
            this.utils.log("Global event listeners established");
        },

        /**
         * Handle breakpoint changes by notifying active modules
         * This method coordinates responsive behavior across all modules
         * Like a traffic controller directing flow when conditions change
         */
        handleBreakpointChange: function (oldBreakpoint, newBreakpoint) {
            this.utils.log(
                "Handling breakpoint change: " +
                    oldBreakpoint +
                    " → " +
                    newBreakpoint
            );

            // Notify all active modules about the breakpoint change
            // Each module can decide how to respond to the change
            this.state.activeModules.forEach(
                function (moduleName) {
                    var module = this.modules[moduleName];
                    if (
                        module &&
                        typeof module.handleBreakpointChange === "function"
                    ) {
                        module.handleBreakpointChange(
                            oldBreakpoint,
                            newBreakpoint
                        );
                    }
                }.bind(this)
            );
        },

        /**
         * Initialize all enabled modules in the correct order
         * This method serves as the module coordinator, ensuring proper initialization sequence
         * Like a project manager ensuring tasks are completed in the right order
         */
        initializeModules: function () {
            var enabledModules = [];

            // Check which modules are enabled and add them to the initialization queue
            if (this.config.enableTOC) {
                enabledModules.push("tableOfContents");
            }

            if (this.config.enableProgress) {
                enabledModules.push("readingProgress");
            }

            if (this.config.enableLegalNav) {
                enabledModules.push("legalNavigation");
            }

            if (this.config.enableLightbox) {
                enabledModules.push("imageLightbox");
            }

            this.utils.log(
                "Initializing " +
                    enabledModules.length +
                    " enabled modules: " +
                    enabledModules.join(", ")
            );

            // Initialize each enabled module and track successful initializations
            enabledModules.forEach(
                function (moduleName) {
                    if (
                        this.modules[moduleName] &&
                        typeof this.modules[moduleName].init === "function"
                    ) {
                        try {
                            var success = this.modules[moduleName].init();
                            if (success) {
                                this.state.activeModules.push(moduleName);
                                this.utils.log(
                                    "Module " +
                                        moduleName +
                                        " initialized successfully"
                                );
                            } else {
                                this.utils.log(
                                    "Module " +
                                        moduleName +
                                        " initialization returned false",
                                    "warn"
                                );
                            }
                        } catch (error) {
                            this.utils.log(
                                "Module " +
                                    moduleName +
                                    " initialization failed",
                                "error",
                                error
                            );
                        }
                    } else {
                        this.utils.log(
                            "Module " +
                                moduleName +
                                " not found or missing init method",
                            "warn"
                        );
                    }
                }.bind(this)
            );

            this.utils.log(
                "Module initialization completed. Active modules: " +
                    this.state.activeModules.length
            );
        },

        /**
         * Enhanced debug system with more comprehensive state reporting
         * This version shows the actual values being stored and retrieved
         */
        debugSystem: function () {
            if (!this.config.debug) {
                console.log(
                    "Debug mode is disabled. Enable debug in config to use this method."
                );
                return;
            }

            try {
                this.utils.log("=== COMPREHENSIVE SYSTEM STATE DEBUG ===");

                // Show initialization state with detailed breakdown
                this.utils.log("System Status:");
                this.utils.log("  - Initialized: " + this.state.isInitialized);
                this.utils.log(
                    "  - Utils initialized: " +
                        (this.utils.state
                            ? this.utils.state.isInitialized
                            : "utils.state not available")
                );

                // Show breakpoint information with detailed analysis
                this.utils.log("Breakpoint Information:");
                this.utils.log(
                    "  - Stored breakpoint: " +
                        (this.state.currentBreakpoint || "null")
                );
                this.utils.log(
                    "  - Current window width: " +
                        (window.innerWidth || "not available")
                );
                this.utils.log(
                    "  - Breakpoint threshold: " +
                        this.config.tocDesktopBreakpoint
                );

                // Re-test breakpoint detection in real-time
                var realtimeBreakpoint = this.detectBreakpoint();
                this.utils.log(
                    "  - Real-time detection: " + realtimeBreakpoint
                );

                // Show page context with validation
                var contextInfo = "none";
                if (
                    this.state.pageContext &&
                    Array.isArray(this.state.pageContext)
                ) {
                    if (this.state.pageContext.length > 0) {
                        contextInfo = this.state.pageContext.join(", ");
                    }
                } else {
                    contextInfo =
                        "invalid (not an array): " +
                        typeof this.state.pageContext;
                }
                this.utils.log("Page Context: " + contextInfo);

                // Show module information
                var activeModulesInfo = "none";
                if (
                    this.state.activeModules &&
                    Array.isArray(this.state.activeModules)
                ) {
                    if (this.state.activeModules.length > 0) {
                        activeModulesInfo = this.state.activeModules.join(", ");
                    }
                } else {
                    activeModulesInfo =
                        "invalid (not an array): " +
                        typeof this.state.activeModules;
                }
                this.utils.log("Active Modules: " + activeModulesInfo);

                // Show utility system statistics
                if (this.utils && this.utils.state) {
                    this.utils.log("Utility Statistics:");
                    this.utils.log(
                        "  - Event listeners: " +
                            (this.utils.state.eventListeners
                                ? this.utils.state.eventListeners.length
                                : "not available")
                    );
                    this.utils.log(
                        "  - Throttled functions: " +
                            (this.utils.state.throttledFunctions
                                ? this.utils.state.throttledFunctions.size
                                : "not available")
                    );
                }

                // Show configuration
                this.utils.log("Configuration:");
                this.utils.log("  - Debug mode: " + this.config.debug);
                this.utils.log("  - TOC enabled: " + this.config.enableTOC);
                this.utils.log(
                    "  - Desktop breakpoint: " +
                        this.config.tocDesktopBreakpoint +
                        "px"
                );

                this.utils.log("=== END COMPREHENSIVE DEBUG ===");
            } catch (error) {
                console.error(
                    "[CloudSync AdaptivePages] Error in debugSystem:",
                    error
                );
            }
        },
        // Temporary testing function for TOC module development
        testTOCModule: function () {
            var utils = this.utils;
            utils.log("=== STARTING TOC MODULE TEST ===");

            // Test module existence
            if (!this.modules.tableOfContents) {
                utils.log("ERROR: tableOfContents module not found", "error");
                return false;
            }

            // Test initialization
            var initResult = this.modules.tableOfContents.init();
            utils.log("Initialization result: " + initResult);

            // Test heading scanning specifically
            if (initResult) {
                utils.log("Testing scanHeadings method directly...");
                var scanResult = this.modules.tableOfContents.scanHeadings();
                utils.log("Scan result: " + scanResult);

                // Display collected data
                var headings = this.modules.tableOfContents.state.headings;
                utils.log("Headings found: " + headings.length);

                for (var i = 0; i < headings.length; i++) {
                    var h = headings[i];
                    utils.log(
                        "Heading " +
                            (i + 1) +
                            ': "' +
                            h.text +
                            '" (H' +
                            h.level +
                            ", ID: " +
                            h.id +
                            ", pos: " +
                            h.offsetTop +
                            "px)"
                    );
                }
            }

            utils.log("=== TOC MODULE TEST COMPLETED ===");
            return initResult;
        },
    };

    // Временно делаем CloudSync глобальным для отладки
    // Удалить в продакшене
    if (typeof window !== "undefined") {
        window.CloudSync = CloudSync;
    }
})();
