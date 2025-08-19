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
            this.initCopyLinkButton();
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

                bindEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this; // Store reference for use in event handlers

                    utils.log("Setting up TOC event handlers");

                    // Verify that required elements exist
                    if (!this.state.tocElements.desktopContainer) {
                        utils.log(
                            "Desktop TOC container not found, cannot bind events",
                            "error"
                        );
                        return false;
                    }

                    // Setup intelligent visibility management instead of immediate activation
                    this.setupSmartVisibility();

                    // Setup navigation link handlers for smooth scrolling
                    this.setupNavigationHandlers();

                    // Setup collapse/expand functionality
                    this.setupCollapseHandlers();

                    // Setup scroll tracking for active section highlighting
                    this.setupScrollTracking();

                    // Setup reading progress bar updates
                    this.setupProgressTracking();

                    utils.log("TOC event handlers bound successfully");

                    return true;
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
                updateActiveHighlight: function (
                    previousActiveId,
                    newActiveId
                ) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Remove highlight from previously active section if it exists
                    if (previousActiveId) {
                        var previousLink =
                            this.state.tocElements.tocList.querySelector(
                                '[data-heading-id="' + previousActiveId + '"]'
                            );
                        if (previousLink) {
                            previousLink.classList.remove("active");
                            utils.log(
                                "Removed active highlight from: " +
                                    previousActiveId
                            );
                        }
                    }

                    // Apply highlight to newly active section if one is determined
                    if (newActiveId) {
                        var newActiveLink =
                            this.state.tocElements.tocList.querySelector(
                                '[data-heading-id="' + newActiveId + '"]'
                            );
                        if (newActiveLink) {
                            newActiveLink.classList.add("active");
                            utils.log(
                                "Applied active highlight to: " + newActiveId
                            );

                            // Ensure highlighted item is visible in TOC if content is long
                            this.ensureActiveItemVisibility(newActiveLink);
                        }
                    }

                    // Handle case where no section is active (e.g., at very top of document)
                    if (!newActiveId && previousActiveId) {
                        utils.log(
                            "No active section determined - user may be at document beginning"
                        );
                    }
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

                updateProgressBar: function (progressValue) {
                    var utils = CloudSync.adaptivePages.utils;
                    var progressBar = this.state.tocElements.progressBar;

                    if (!progressBar) {
                        utils.log(
                            "Progress bar element not found, cannot update display",
                            "warn"
                        );
                        return;
                    }

                    // Convert progress value to percentage for CSS width
                    var progressPercentage = Math.round(progressValue * 100);

                    // Update the visual width of the progress bar using CSS
                    progressBar.style.width = progressPercentage + "%";

                    // Update ARIA attributes for accessibility
                    progressBar.setAttribute(
                        "aria-valuenow",
                        progressPercentage
                    );

                    // Provide readable progress information for screen readers
                    var readableProgress =
                        progressPercentage + " percent complete";
                    progressBar.setAttribute(
                        "aria-valuetext",
                        readableProgress
                    );

                    // Log progress updates for debugging and user behavior analysis
                    utils.log(
                        "Progress bar updated to " +
                            progressPercentage +
                            "% (value: " +
                            Math.round(progressValue * 1000) / 1000 +
                            ")"
                    );
                },
                createMobileTOC: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    
                    utils.log("Creating mobile TOC interface");
                    
                    // Check for existing mobile TOC to prevent duplicates
                    var existingFloatingButton = document.querySelector(".floating-toc-button");
                    var existingMobilePanel = document.querySelector(".mobile-toc-panel");
                    
                    if (existingFloatingButton) {
                        existingFloatingButton.remove();
                        utils.log("Removed existing floating TOC button");
                    }
                    
                    if (existingMobilePanel) {
                        existingMobilePanel.remove();
                        utils.log("Removed existing mobile TOC panel");
                    }
                    
                    // Create floating button with progress indicator
                    var floatingButton = document.createElement("div");
                    floatingButton.className = "floating-toc-button";
                    floatingButton.setAttribute("role", "button");
                    floatingButton.setAttribute("aria-label", "Open table of contents");
                    floatingButton.setAttribute("tabindex", "0");
                    
                    // Create progress circle SVG
                    var progressSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    progressSvg.setAttribute("class", "progress-circle");
                    progressSvg.setAttribute("width", "64");
                    progressSvg.setAttribute("height", "64");
                    progressSvg.setAttribute("viewBox", "0 0 64 64");
                    
                    var progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    progressCircle.setAttribute("cx", "32");
                    progressCircle.setAttribute("cy", "32");
                    progressCircle.setAttribute("r", "28");
                    progressCircle.setAttribute("fill", "none");
                    progressCircle.setAttribute("stroke", "rgba(102, 126, 234, 0.8)");
                    progressCircle.setAttribute("stroke-width", "3");
                    progressCircle.setAttribute("stroke-linecap", "round");
                    progressCircle.setAttribute("stroke-dasharray", "175.93"); // 2 * π * r
                    progressCircle.setAttribute("stroke-dashoffset", "175.93");
                    progressCircle.setAttribute("transform", "rotate(-90 32 32)");
                    
                    progressSvg.appendChild(progressCircle);
                    
                    // Create button icon
                    var buttonIcon = document.createElement("i");
                    buttonIcon.className = "toc-button-icon fas fa-list-ul";
                    buttonIcon.setAttribute("aria-hidden", "true");
                    
                    // Create pulse effect element
                    var buttonPulse = document.createElement("div");
                    buttonPulse.className = "button-pulse";
                    
                    // Assemble floating button
                    floatingButton.appendChild(progressSvg);
                    floatingButton.appendChild(buttonIcon);
                    floatingButton.appendChild(buttonPulse);
                    
                    // Create mobile TOC panel
                    var mobilePanel = document.createElement("div");
                    mobilePanel.className = "mobile-toc-panel";
                    mobilePanel.setAttribute("role", "dialog");
                    mobilePanel.setAttribute("aria-modal", "true");
                    mobilePanel.setAttribute("aria-labelledby", "mobile-toc-title");
                    
                    // Panel overlay for backdrop
                    var panelOverlay = document.createElement("div");
                    panelOverlay.className = "mobile-toc-overlay";
                    
                    // Panel content container
                    var panelContent = document.createElement("div");
                    panelContent.className = "mobile-toc-content";
                    
                    // Panel header
                    var panelHeader = document.createElement("div");
                    panelHeader.className = "mobile-toc-header";
                    
                    var panelTitle = document.createElement("h3");
                    panelTitle.id = "mobile-toc-title";
                    panelTitle.className = "mobile-toc-title";
                    panelTitle.textContent = "Table of Contents";
                    
                    var panelProgress = document.createElement("div");
                    panelProgress.className = "mobile-toc-progress";
                    panelProgress.textContent = "0% Complete";
                    
                    var closeButton = document.createElement("button");
                    closeButton.className = "mobile-toc-close";
                    closeButton.setAttribute("aria-label", "Close table of contents");
                    closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
                    
                    panelHeader.appendChild(panelTitle);
                    panelHeader.appendChild(panelProgress);
                    panelHeader.appendChild(closeButton);
                    
                    // Panel navigation area
                    var panelNavigation = document.createElement("div");
                    panelNavigation.className = "mobile-toc-navigation";
                    
                    var tocList = document.createElement("ul");
                    tocList.className = "mobile-toc-list";
                    
                    // Generate navigation items from headings
                    this.state.headings.forEach(function(heading, index) {
                        var listItem = document.createElement("li");
                        listItem.className = "mobile-toc-item toc-h" + heading.level;
                        
                        var link = document.createElement("a");
                        link.className = "mobile-toc-link";
                        link.href = "#" + heading.id;
                        link.textContent = heading.text;
                        link.setAttribute("data-heading-index", index);
                        
                        listItem.appendChild(link);
                        tocList.appendChild(listItem);
                    });
                    
                    panelNavigation.appendChild(tocList);
                    
                    // Panel footer with quick actions
                    var panelFooter = document.createElement("div");
                    panelFooter.className = "mobile-toc-footer";
                    
                    var quickActions = document.createElement("div");
                    quickActions.className = "mobile-toc-quick-actions";
                    
                    var topButton = document.createElement("button");
                    topButton.className = "quick-action-btn";
                    topButton.innerHTML = '<i class="fas fa-arrow-up"></i> Top';
                    topButton.setAttribute("aria-label", "Go to top of page");
                    
                    var bottomButton = document.createElement("button");
                    bottomButton.className = "quick-action-btn";
                    bottomButton.innerHTML = '<i class="fas fa-arrow-down"></i> Bottom';
                    bottomButton.setAttribute("aria-label", "Go to bottom of page");
                    
                    quickActions.appendChild(topButton);
                    quickActions.appendChild(bottomButton);
                    panelFooter.appendChild(quickActions);
                    
                    // Assemble panel
                    panelContent.appendChild(panelHeader);
                    panelContent.appendChild(panelNavigation);
                    panelContent.appendChild(panelFooter);
                    
                    mobilePanel.appendChild(panelOverlay);
                    mobilePanel.appendChild(panelContent);
                    
                    // Add elements to DOM
                    document.body.appendChild(floatingButton);
                    document.body.appendChild(mobilePanel);
                    
                    // Store references for later use
                    this.state.tocElements.mobileButton = floatingButton;
                    this.state.tocElements.mobilePanel = mobilePanel;
                    this.state.tocElements.mobileProgressCircle = progressCircle;
                    this.state.tocElements.mobilePanelProgress = panelProgress;
                    this.state.tocElements.mobileList = tocList;
                    
                    // Bind event handlers
                    this.bindMobileEvents();
                    
                    utils.log("Mobile TOC interface created successfully");
                    return true;
                },
                updateMobileProgress: function(progressValue) {
                    var utils = CloudSync.adaptivePages.utils;
                    
                    if (!this.state.tocElements.mobileProgressCircle || !this.state.tocElements.mobilePanelProgress) {
                        return;
                    }
                    
                    // Update circular progress indicator
                    var circumference = 175.93; // 2 * π * r (r=28)
                    var offset = circumference - (progressValue * circumference);
                    
                    this.state.tocElements.mobileProgressCircle.setAttribute("stroke-dashoffset", offset);
                    
                    // Update panel progress text
                    var progressPercentage = Math.round(progressValue * 100);
                    this.state.tocElements.mobilePanelProgress.textContent = progressPercentage + "% Complete";
                    
                    // Add visual feedback for completion milestones
                    var button = this.state.tocElements.mobileButton;
                    if (progressPercentage >= 100) {
                        button.classList.add("progress-complete");
                    } else {
                        button.classList.remove("progress-complete");
                    }
                    
                    utils.log("Mobile progress updated to " + progressPercentage + "%");
                },
                toggleMobilePanel: function(forceState) {
                    var utils = CloudSync.adaptivePages.utils;
                    
                    if (!this.state.tocElements.mobilePanel) {
                        utils.log("Mobile panel not found, cannot toggle", "error");
                        return false;
                    }
                    
                    var panel = this.state.tocElements.mobilePanel;
                    var isCurrentlyOpen = panel.classList.contains("panel-open");
                    var shouldOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;
                    
                    if (shouldOpen && !isCurrentlyOpen) {
                        // Opening panel
                        utils.log("Opening mobile TOC panel");
                        
                        // Add opening animation class
                        panel.classList.add("panel-opening");
                        panel.style.display = "block";
                        
                        // Trigger reflow for animation
                        panel.offsetHeight;
                        
                        // Add open class for final state
                        panel.classList.add("panel-open");
                        
                        // Clean up opening class after animation
                        setTimeout(function() {
                            panel.classList.remove("panel-opening");
                        }, 300);
                        
                        // Prevent body scrolling when panel is open
                        document.body.style.overflow = "hidden";
                        
                        // Focus management for accessibility
                        var closeButton = panel.querySelector(".mobile-toc-close");
                        if (closeButton) {
                            closeButton.focus();
                        }
                        
                        // Track state
                        this.state.mobilePanel = { isOpen: true };
                        
                        // Dispatch custom event for other modules
                        var openEvent = new CustomEvent("mobileTOCOpened", {
                            detail: { panel: panel }
                        });
                        document.dispatchEvent(openEvent);
                        
                    } else if (!shouldOpen && isCurrentlyOpen) {
                        // Closing panel
                        utils.log("Closing mobile TOC panel");
                        
                        // Remove open class to start closing animation
                        panel.classList.remove("panel-open");
                        
                        // Restore body scrolling
                        document.body.style.overflow = "";
                        
                        // Wait for animation to complete before hiding
                        setTimeout(function() {
                            panel.style.display = "none";
                        }, 300);
                        
                        // Focus management - return to button
                        if (this.state.tocElements.mobileButton) {
                            this.state.tocElements.mobileButton.focus();
                        }
                        
                        // Track state
                        this.state.mobilePanel = { isOpen: false };
                        
                        // Dispatch custom event for other modules
                        var closeEvent = new CustomEvent("mobileTOCClosed", {
                            detail: { panel: panel }
                        });
                        document.dispatchEvent(closeEvent);
                    }
                    
                    return shouldOpen;
                },
                bindMobileEvents: function() {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;
                    
                    utils.log("Binding mobile TOC event handlers");
                    
                    if (!this.state.tocElements.mobileButton || !this.state.tocElements.mobilePanel) {
                        utils.log("Mobile TOC elements not found, cannot bind events", "error");
                        return false;
                    }
                    
                    var button = this.state.tocElements.mobileButton;
                    var panel = this.state.tocElements.mobilePanel;
                    
                    // Floating button click/tap handler
                    var buttonClickHandler = function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        self.toggleMobilePanel();
                        utils.log("Mobile TOC button clicked");
                    };
                    
                    // Keyboard support for floating button
                    var buttonKeyHandler = function(event) {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            self.toggleMobilePanel();
                            utils.log("Mobile TOC button activated via keyboard");
                        } else if (event.key === "Escape") {
                            self.toggleMobilePanel(false);
                        }
                    };
                    
                    // Panel close button handler
                    var closeButtonHandler = function(event) {
                        event.preventDefault();
                        self.toggleMobilePanel(false);
                        utils.log("Mobile TOC panel closed via close button");
                    };
                    
                    // Panel overlay click handler (close on backdrop click)
                    var overlayClickHandler = function(event) {
                        if (event.target.classList.contains("mobile-toc-overlay")) {
                            self.toggleMobilePanel(false);
                            utils.log("Mobile TOC panel closed via overlay click");
                        }
                    };
                    
                    // Navigation link click handlers
                    var linkClickHandler = function(event) {
                        event.preventDefault();
                        
                        var targetId = this.getAttribute("href");
                        
                        // Update active state
                        var allLinks = panel.querySelectorAll(".mobile-toc-link");
                        allLinks.forEach(function(link) {
                            link.parentElement.classList.remove("active-section");
                        });
                        this.parentElement.classList.add("active-section");
                        
                        // Smooth scroll to target
                        var targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            var headerOffset = 100;
                            var targetPosition = targetElement.offsetTop - headerOffset;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: "smooth"
                            });
                            
                            // Close panel after navigation
                            setTimeout(function() {
                                self.toggleMobilePanel(false);
                            }, 300);
                            
                            utils.log("Navigated to section: " + targetId);
                        }
                    };
                    
                    // Quick action handlers
                    var topButtonHandler = function(event) {
                        event.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        self.toggleMobilePanel(false);
                        utils.log("Navigated to top of page");
                    };
                    
                    var bottomButtonHandler = function(event) {
                        event.preventDefault();
                        var documentHeight = Math.max(
                            document.body.scrollHeight,
                            document.body.offsetHeight,
                            document.documentElement.clientHeight,
                            document.documentElement.scrollHeight,
                            document.documentElement.offsetHeight
                        );
                        window.scrollTo({ top: documentHeight, behavior: "smooth" });
                        self.toggleMobilePanel(false);
                        utils.log("Navigated to bottom of page");
                    };
                    
                    // Global keyboard handler for escape key
                    var globalKeyHandler = function(event) {
                        if (event.key === "Escape" && panel.classList.contains("panel-open")) {
                            self.toggleMobilePanel(false);
                        }
                    };
                    
                    // Bind all events
                    button.addEventListener("click", buttonClickHandler);
                    button.addEventListener("keydown", buttonKeyHandler);
                    
                    var closeButton = panel.querySelector(".mobile-toc-close");
                    if (closeButton) {
                        closeButton.addEventListener("click", closeButtonHandler);
                    }
                    
                    var overlay = panel.querySelector(".mobile-toc-overlay");
                    if (overlay) {
                        overlay.addEventListener("click", overlayClickHandler);
                    }
                    
                    var navigationLinks = panel.querySelectorAll(".mobile-toc-link");
                    navigationLinks.forEach(function(link) {
                        link.addEventListener("click", linkClickHandler);
                    });
                    
                    var topButton = panel.querySelector(".quick-action-btn");
                    var bottomButton = panel.querySelectorAll(".quick-action-btn")[1];
                    if (topButton) {
                        topButton.addEventListener("click", topButtonHandler);
                    }
                    if (bottomButton) {
                        bottomButton.addEventListener("click", bottomButtonHandler);
                    }
                    
                    document.addEventListener("keydown", globalKeyHandler);
                    
                    // Store event handlers for cleanup
                    this.state.mobileEventHandlers = {
                        buttonClick: buttonClickHandler,
                        buttonKey: buttonKeyHandler,
                        closeButton: closeButtonHandler,
                        overlayClick: overlayClickHandler,
                        linkClick: linkClickHandler,
                        topButton: topButtonHandler,
                        bottomButton: bottomButtonHandler,
                        globalKey: globalKeyHandler
                    };
                    
                    // Integrate with scroll progress updates
                    var existingScrollHandler = this.updateProgress;
                    if (existingScrollHandler) {
                        var enhancedScrollHandler = function() {
                            // Call existing desktop progress update
                            existingScrollHandler.call(self);
                            
                            // Update mobile progress
                            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                            var documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                            var scrollProgress = documentHeight > 0 ? scrollTop / documentHeight : 0;
                            
                            self.updateMobileProgress(Math.min(Math.max(scrollProgress, 0), 1));
                        };
                        
                        // Replace existing scroll handler with enhanced version
                        if (this.state.eventHandlers && this.state.eventHandlers.scroll) {
                            window.removeEventListener("scroll", this.state.eventHandlers.scroll);
                        }
                        
                        var throttledScrollHandler = utils.throttle(enhancedScrollHandler, 16);
                        window.addEventListener("scroll", throttledScrollHandler, { passive: true });
                        
                        if (!this.state.eventHandlers) {
                            this.state.eventHandlers = {};
                        }
                        this.state.eventHandlers.scroll = throttledScrollHandler;
                    }
                    
                    utils.log("Mobile TOC event handlers bound successfully");
                    return true;
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
