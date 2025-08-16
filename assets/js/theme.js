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
                bindEvents: function () {},
                createDesktopTOC: function () {},
                createMobileTOC: function () {},
                handleBreakpointChange: function () {},
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
    };

    // Временно делаем CloudSync глобальным для отладки
    // Удалить в продакшене
    if (typeof window !== "undefined") {
        window.CloudSync = CloudSync;
    }
})();
