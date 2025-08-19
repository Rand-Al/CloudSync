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
                /**
                 * Table of Contents Module for CloudSync Theme
                 *
                 * Automatically generates an intelligent table of contents from page headings
                 * with smooth scrolling navigation and reading progress tracking. Enhances
                 * content discoverability and user navigation experience on content-heavy pages.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
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
                /**
                 * Bind Interactive Events for Table of Contents
                 *
                 * Establishes comprehensive event handling system for TOC functionality including
                 * smooth scrolling navigation, visibility management, progress tracking, and
                 * responsive collapse behavior. Creates seamless user interaction patterns
                 * that enhance content navigation and reading experience.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @return {boolean} True if all events bound successfully, false on failure
                 */

                /**
                 * Bind Interactive Events for Table of Contents System
                 *
                 * Establishes comprehensive event handling for both desktop and mobile TOC modes.
                 * This universal method detects the current display mode and applies appropriate
                 * event bindings while maintaining shared functionality across platforms. The method
                 * coordinates between different interaction patterns while ensuring accessibility
                 * compliance and optimal user experience for each device type.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if all relevant event handlers bound successfully
                 */
                bindEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Setting up universal TOC event handlers for " +
                            this.state.currentMode +
                            " mode"
                    );

                    try {
                        // Determine which interface elements exist based on current mode
                        // This allows us to bind events only to elements that are actually present
                        var hasDesktopElements =
                            !!this.state.tocElements.desktopContainer;
                        var hasMobileElements =
                            !!this.state.tocElements.mobileContainer;

                        utils.log(
                            "Interface availability: Desktop=" +
                                hasDesktopElements +
                                ", Mobile=" +
                                hasMobileElements
                        );

                        // Verify that we have the appropriate elements for the current mode
                        if (
                            this.state.currentMode === "desktop" &&
                            !hasDesktopElements
                        ) {
                            utils.log(
                                "Desktop mode active but desktop elements not found",
                                "error"
                            );
                            return false;
                        }

                        if (
                            this.state.currentMode === "mobile" &&
                            !hasMobileElements
                        ) {
                            utils.log(
                                "Mobile mode active but mobile elements not found",
                                "error"
                            );
                            return false;
                        }

                        // Bind mode-specific events based on current interface state
                        if (
                            this.state.currentMode === "desktop" &&
                            hasDesktopElements
                        ) {
                            utils.log("Binding desktop-specific TOC events");
                            this.bindDesktopEvents();
                        }

                        if (
                            this.state.currentMode === "mobile" &&
                            hasMobileElements
                        ) {
                            utils.log("Binding mobile-specific TOC events");
                            this.bindMobileEvents();
                            this.initializeProgressRing();
                            this.initializeReadingTimeUpdates();
                        }

                        // Bind universal events that work across both desktop and mobile modes
                        // These events provide core functionality regardless of display mode
                        utils.log("Binding universal TOC events");
                        this.bindUniversalEvents();

                        utils.log(
                            "All TOC event handlers bound successfully for " +
                                this.state.currentMode +
                                " mode"
                        );

                        return true;
                    } catch (error) {
                        utils.log("Error binding TOC events", "error", error);
                        return false;
                    }
                },
                /**
                 * Bind Mobile-Specific Event Handlers
                 *
                 * Establishes event handling specifically optimized for mobile interface elements
                 * including floating button interactions, panel opening/closing, and touch-optimized
                 * navigation. This method focuses on mobile UX patterns while ensuring proper
                 * accessibility support for mobile screen readers and keyboard navigation.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if mobile events bound successfully
                 */
                bindMobileEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Binding mobile-specific interaction events");

                    try {
                        // Bind floating button events for panel opening
                        this.bindFloatingButtonEvents();

                        // Bind panel closing events (overlay, close button, escape key)
                        this.bindMobilePanelEvents();

                        // Bind mobile navigation events with touch optimization
                        this.bindMobileNavigationEvents();

                        utils.log("Mobile-specific events bound successfully");
                        return true;
                    } catch (error) {
                        utils.log(
                            "Error binding mobile events",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Bind Desktop-Specific Event Handlers
                 *
                 * Establishes event handling for desktop interface elements including hover states,
                 * collapse functionality, and mouse-optimized interactions. This method maintains
                 * the existing desktop functionality while providing clear separation from mobile
                 * event handling for better code organization and maintenance.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if desktop events bound successfully
                 */
                bindDesktopEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("Binding desktop-specific interaction events");

                    try {
                        // Use existing desktop event binding methods
                        this.setupSmartVisibility();
                        this.setupCollapseHandlers();

                        utils.log("Desktop-specific events bound successfully");
                        return true;
                    } catch (error) {
                        utils.log(
                            "Error binding desktop events",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Bind Universal Event Handlers
                 *
                 * Establishes event handling that works consistently across both desktop and mobile
                 * modes including navigation link functionality, scroll tracking, and progress updates.
                 * These events provide core table of contents functionality regardless of the
                 * interface presentation method, ensuring consistent user experience across devices.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if universal events bound successfully
                 */
                bindUniversalEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("Binding universal TOC events");

                    try {
                        // Navigation handlers work the same way in both modes
                        this.setupNavigationHandlers();

                        // Scroll tracking for active section highlighting
                        this.setupScrollTracking();

                        // Reading progress tracking
                        this.setupProgressTracking();

                        utils.log("Universal events bound successfully");
                        return true;
                    } catch (error) {
                        utils.log(
                            "Error binding universal events",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Setup Intelligent Visibility Management for Table of Contents
                 *
                 * Implements sophisticated behavioral analysis to determine optimal timing
                 * for TOC appearance based on user engagement patterns. Monitors scroll depth,
                 * time investment, and reading behavior to show navigation assistance only when
                 * users demonstrate genuine content engagement, preventing interface clutter
                 * while maximizing utility for committed readers.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
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
                /**
                 * Setup Navigation Event Handlers for Table of Contents
                 *
                 * Establishes intelligent click handlers for TOC navigation links that provide
                 * enhanced smooth scrolling with dynamic header offset calculation. Prevents
                 * default browser anchor behavior and implements precise positioning that
                 * accounts for varying header heights and viewport considerations, ensuring
                 * target content appears optimally positioned for comfortable reading.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
                setupNavigationHandlers: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Setting up intelligent navigation handlers");

                    // Determine which container to use based on current mode
                    var activeContainer = null;
                    var linkSelector = "";

                    if (
                        this.state.currentMode === "desktop" &&
                        this.state.tocElements.desktopContainer
                    ) {
                        activeContainer =
                            this.state.tocElements.desktopContainer;
                        linkSelector = ".toc-link";
                        utils.log("Using desktop navigation elements");
                    } else if (
                        this.state.currentMode === "mobile" &&
                        this.state.tocElements.mobileContainer
                    ) {
                        activeContainer =
                            this.state.tocElements.mobileContainer;
                        linkSelector = ".mobile-toc-link";
                        utils.log("Using mobile navigation elements");
                    } else {
                        utils.log(
                            "No appropriate navigation container found for mode: " +
                                this.state.currentMode,
                            "warn"
                        );
                        return;
                    }

                    // Find navigation links in the appropriate container
                    var navigationLinks =
                        activeContainer.querySelectorAll(linkSelector);
                    if (navigationLinks.length === 0) {
                        utils.log(
                            "No navigation links found in " +
                                this.state.currentMode +
                                " mode",
                            "warn"
                        );
                        return;
                    }

                    utils.log(
                        "Found " +
                            navigationLinks.length +
                            " navigation links in " +
                            this.state.currentMode +
                            " mode"
                    );

                    // Apply universal navigation behavior to found links
                    for (var i = 0; i < navigationLinks.length; i++) {
                        var link = navigationLinks[i];

                        utils.addEventListener(link, "click", function (event) {
                            event.preventDefault();

                            var targetId = this.getAttribute("href");
                            if (targetId && targetId.startsWith("#")) {
                                var targetElement =
                                    document.querySelector(targetId);
                                if (targetElement) {
                                    // Universal smooth scrolling works the same way in both modes
                                    targetElement.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });

                                    // Mode-specific post-navigation actions
                                    if (self.state.currentMode === "mobile") {
                                        // Close mobile panel after navigation
                                        setTimeout(function () {
                                            if (self.closeMobilePanel) {
                                                self.closeMobilePanel();
                                            }
                                        }, 500);
                                    }

                                    utils.log(
                                        "Universal navigation to: " + targetId
                                    );
                                }
                            }
                        });
                    }

                    utils.log(
                        "Universal navigation handlers established successfully"
                    );
                },
                /**
                 * Setup Collapse/Expand Event Handlers for Table of Contents
                 *
                 * Implements sophisticated toggle functionality that allows users to minimize
                 * the TOC to a compact view when screen space is premium, while maintaining
                 * quick access to full navigation. Manages visual state transitions, icon
                 * updates, and accessibility attributes to ensure seamless user experience
                 * across different viewport sizes and interaction patterns.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @return {boolean} True if collapse handlers configured successfully
                 */
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
                /**
                 * Update Visual State and Accessibility Attributes for TOC Collapse
                 *
                 * Synchronizes all interface elements when TOC transitions between collapsed
                 * and expanded states. Orchestrates CSS class changes, icon transformations,
                 * and accessibility attribute updates to maintain consistent visual feedback
                 * and screen reader compatibility. Ensures state changes are communicated
                 * clearly to both sighted users and assistive technology users.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
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
                /**
                 * Setup Intelligent Scroll Tracking for Active Section Detection
                 *
                 * Implements sophisticated viewport analysis to automatically highlight the
                 * currently visible content section in the table of contents. Uses optimized
                 * scroll detection with throttling and intelligent activation zones to provide
                 * accurate visual feedback about user's reading position without impacting
                 * performance. Creates intuitive navigation experience where TOC highlights
                 * dynamically follow the user's reading progress.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
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
                /**
                 * Setup Reading Progress Tracking System for Content Navigation
                 *
                 * Establishes sophisticated progress measurement that converts scroll position
                 * into meaningful reading completion percentage. Implements intelligent document
                 * dimension analysis, smooth progress transitions, and psychological progress
                 * enhancements to create engaging user feedback. Optimizes calculations for
                 * performance while providing accurate visual representation of reading journey
                 * through complex content structures.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 */
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

                /**
                 * Scan Document Content for Navigation-Worthy Headings
                 *
                 * Performs comprehensive document analysis to identify and catalog heading
                 * elements suitable for table of contents generation. Implements intelligent
                 * content filtering, unique ID management, and hierarchical structure detection.
                 * Processes both existing and dynamically generated content while ensuring
                 * accessibility compliance and navigation reliability through robust heading
                 * validation and cleanup procedures.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @return {boolean} True if suitable headings found and processed successfully
                 */
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
                /**
                 * Generate Human-Readable Summary of Document Heading Structure
                 *
                 * Analyzes the hierarchical distribution of processed headings to create
                 * a concise textual representation of the document's structural complexity.
                 * Provides valuable debugging information and user feedback about content
                 * organization depth, helping both developers and content creators understand
                 * the navigational scope and heading hierarchy patterns within the document.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @return {string} Formatted range description (e.g., "H2-H4", "H1", "none")
                 */
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

                /**
                 * Create Advanced Desktop Table of Contents Interface
                 *
                 * Constructs sophisticated floating navigation panel with modern glassmorphism
                 * design and comprehensive accessibility features. Builds hierarchical heading
                 * structure, implements interactive progress tracking, and establishes
                 * collapsible interface elements. Creates premium user experience through
                 * carefully orchestrated DOM construction, semantic markup, and intelligent
                 * content organization optimized for desktop navigation patterns.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @return {boolean} True if desktop TOC interface created successfully
                 */
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
                /**
                 * Determine Currently Active Content Section Based on Reading Position
                 *
                 * Implements sophisticated viewport analysis algorithm that calculates which
                 * document section the user is actively reading by evaluating scroll position
                 * against heading locations using configurable activation zones. Employs
                 * geometric proximity calculations and intelligent threshold detection to
                 * provide accurate section highlighting that reflects genuine reading progress
                 * rather than simple scroll position, enhancing navigation relevance.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} currentScrollPosition Current vertical scroll offset in pixels
                 * @param {number} activationLineRatio Viewport percentage for activation zone
                 * @return {string|null} ID of active heading element, or null if none active
                 */
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
                /**
                 * Update Active Heading Highlight in Current Interface Mode
                 *
                 * Updates the visual highlighting of the currently active heading in both desktop
                 * and mobile interfaces. This method intelligently adapts to the current mode,
                 * applying appropriate CSS classes and visual feedback while maintaining
                 * accessibility standards across different interface presentations.
                 *
                 * @since 1.0.0
                 * @param {string} activeHeadingId - ID of the heading to highlight as active
                 */
                updateActiveHighlight: function (activeHeadingId) {
                    var utils = CloudSync.adaptivePages.utils;

                    if (!activeHeadingId) {
                        utils.log(
                            "No active heading ID provided for highlight update",
                            "warn"
                        );
                        return;
                    }

                    // Determine which interface to update based on current mode
                    var activeContainer = null;
                    var linkSelector = "";
                    var activeClass = "";

                    if (
                        this.state.currentMode === "desktop" &&
                        this.state.tocElements.desktopContainer
                    ) {
                        activeContainer =
                            this.state.tocElements.desktopContainer;
                        linkSelector = ".toc-link";
                        activeClass = "active";
                        utils.log(
                            "Updating desktop interface active highlight"
                        );
                    } else if (
                        this.state.currentMode === "mobile" &&
                        this.state.tocElements.mobileContainer
                    ) {
                        activeContainer =
                            this.state.tocElements.mobileContainer;
                        linkSelector = ".mobile-toc-link";
                        activeClass = "active-section";
                        utils.log("Updating mobile interface active highlight");
                    } else {
                        utils.log(
                            "No appropriate interface container found for highlight update",
                            "warn"
                        );
                        return;
                    }

                    // Remove existing active states from all links in current interface
                    var allLinks =
                        activeContainer.querySelectorAll(linkSelector);
                    for (var i = 0; i < allLinks.length; i++) {
                        var link = allLinks[i];
                        var parentItem =
                            link.closest("li") || link.parentElement;
                        if (parentItem) {
                            parentItem.classList.remove(activeClass);
                        }
                        link.classList.remove("active");
                    }

                    // Find and highlight the active link
                    var targetSelector =
                        linkSelector + '[href="#' + activeHeadingId + '"]';
                    var activeLink =
                        activeContainer.querySelector(targetSelector);

                    if (activeLink) {
                        var parentItem =
                            activeLink.closest("li") ||
                            activeLink.parentElement;
                        if (parentItem) {
                            parentItem.classList.add(activeClass);
                        }
                        activeLink.classList.add("active");

                        utils.log(
                            "Active highlight updated for: " +
                                activeHeadingId +
                                " in " +
                                this.state.currentMode +
                                " mode"
                        );
                    } else {
                        utils.log(
                            "Active link not found for ID: " + activeHeadingId,
                            "warn"
                        );
                    }
                },
                /**
                 * Ensure Active Navigation Item Remains Visible Within TOC Scroll Area
                 *
                 * Implements intelligent auto-scrolling mechanism for the TOC navigation panel
                 * when the currently highlighted section link moves outside the visible area.
                 * Calculates precise positioning requirements using geometric analysis and
                 * applies smooth scrolling transitions with optimal padding to maintain user
                 * orientation. Prevents navigation confusion by keeping active items accessible
                 * while preserving the overall TOC context and scroll position memory.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {Element} activeLink DOM element of the currently active TOC link
                 */
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
                /**
                 * Calculate Precise Reading Progress Percentage from Scroll Position
                 *
                 * Performs sophisticated mathematical analysis to convert raw scroll coordinates
                 * into meaningful reading completion percentage. Implements intelligent document
                 * dimension analysis, handles edge cases for varying content heights, and
                 * applies psychological progress enhancements to create engaging user feedback.
                 * Accounts for viewport considerations and maximum scrollable distances to
                 * ensure accurate progress representation across different content structures.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} currentScrollPosition Current vertical scroll offset in pixels
                 * @param {Object} progressState Cached state with document dimensions
                 * @param {Object} progressConfig Configuration for progress calculation behavior
                 * @return {number} Progress value between 0 and 1 representing completion percentage
                 */
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
                /**
                 * Apply Psychological Progress Enhancement and User Experience Refinements
                 *
                 * Implements sophisticated progress manipulation techniques based on user
                 * experience research to create more engaging and motivating reading feedback.
                 * Applies early progress boosting for initial engagement, smooth completion
                 * transitions using easing functions, and intelligent threshold management
                 * that accounts for user psychology. Transforms raw mathematical progress
                 * into psychologically satisfying progress perception that encourages
                 * continued content consumption and reduces abandonment rates.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} rawProgress Unmodified progress value from 0 to 1
                 * @param {Object} progressConfig Configuration object with adjustment thresholds
                 * @return {number} Enhanced progress value optimized for user experience
                 */
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
                /**
                 * Quadratic Easing Function for Natural Animation Transitions
                 *
                 * Implements mathematical interpolation curve that creates smooth acceleration
                 * and deceleration patterns mimicking natural motion physics. Provides organic
                 * feeling transitions for progress animations by applying quadratic mathematical
                 * functions that ease in during the first half of animation and ease out
                 * during the second half. Essential for creating professional-quality user
                 * interface animations that feel intuitive and visually pleasing rather
                 * than mechanically linear or jarring in their movement patterns.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} t Time parameter between 0 and 1 representing animation progress
                 * @return {number} Eased value between 0 and 1 with smooth acceleration curve
                 */
                easeInOutQuad: function (t) {
                    // Quadratic easing function for smooth animation curves
                    // Creates natural acceleration and deceleration in progress changes
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },
                /**
                 * Apply Intelligent Progress Value Interpolation for Smooth Visual Transitions
                 *
                 * Implements adaptive mathematical interpolation between previous and current
                 * progress values to eliminate jarring visual jumps during scroll events.
                 * Uses contextual smoothing algorithms that adjust responsiveness based on
                 * change magnitude and completion proximity. Creates fluid progress animations
                 * that feel natural and responsive while maintaining accuracy, particularly
                 * during rapid scrolling movements or document navigation jumps that would
                 * otherwise create disorienting visual discontinuities.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} previousProgress Last calculated progress value (0-1)
                 * @param {number} newProgress Current raw progress calculation (0-1)
                 * @param {number} smoothingFactor Base interpolation strength (0-1)
                 * @return {number} Smoothed progress value optimized for visual continuity
                 */
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
                /**
                 * Update Reading Progress Bar for Current Interface Mode
                 *
                 * Updates the visual progress indicator showing reading completion percentage.
                 * This method adapts to the current interface mode, updating desktop progress bars
                 * or mobile progress indicators as appropriate while maintaining consistent
                 * progress calculation across all device types.
                 *
                 * @since 1.0.0
                 * @param {number} progressValue - Progress value between 0 and 1
                 */
                updateProgressBar: function (progressValue) {
                    var utils = CloudSync.adaptivePages.utils;

                    if (
                        typeof progressValue !== "number" ||
                        progressValue < 0 ||
                        progressValue > 1
                    ) {
                        utils.log(
                            "Invalid progress value provided: " + progressValue,
                            "warn"
                        );
                        return;
                    }

                    // Find progress bar element based on current mode
                    var progressBar = null;

                    if (
                        this.state.currentMode === "desktop" &&
                        this.state.tocElements.desktopContainer
                    ) {
                        progressBar =
                            this.state.tocElements.desktopContainer.querySelector(
                                ".progress-bar"
                            );
                        if (progressBar) {
                            utils.log("Updating desktop progress bar");
                        }
                    } else if (
                        this.state.currentMode === "mobile" &&
                        this.state.tocElements.mobileContainer
                    ) {
                        // Mobile progress could be in the panel header or floating button
                        progressBar =
                            this.state.tocElements.mobileContainer.querySelector(
                                ".mobile-progress-bar"
                            );
                        if (!progressBar) {
                            // Try to find progress indicator in the header
                            var progressElement =
                                this.state.tocElements.mobileContainer.querySelector(
                                    ".mobile-toc-progress"
                                );
                            if (progressElement) {
                                // Update text-based progress for mobile
                                var percentage = Math.round(
                                    progressValue * 100
                                );
                                progressElement.textContent =
                                    this.state.headings.length +
                                    " sections (" +
                                    percentage +
                                    "% read)";
                                utils.log(
                                    "Updated mobile progress text: " +
                                        percentage +
                                        "%"
                                );
                                return;
                            }
                        }

                        if (progressBar) {
                            utils.log("Updating mobile progress bar");
                        }
                    }

                    // Update visual progress bar if found
                    if (progressBar) {
                        var progressPercentage = Math.round(
                            progressValue * 100
                        );

                        // Update the visual width of the progress bar
                        progressBar.style.width = progressPercentage + "%";

                        // Update ARIA attributes for accessibility
                        progressBar.setAttribute(
                            "aria-valuenow",
                            progressPercentage
                        );
                        progressBar.setAttribute(
                            "aria-valuetext",
                            progressPercentage + " percent complete"
                        );

                        utils.log(
                            "Progress bar updated to " +
                                progressPercentage +
                                "% in " +
                                this.state.currentMode +
                                " mode"
                        );
                    } else {
                        // This is now just informational, not an error
                        utils.log(
                            "No progress bar element found in " +
                                this.state.currentMode +
                                " mode - this is normal for some interface configurations"
                        );
                    }
                },
                /**
                 * Orchestrate Complex Decision Logic for Table of Contents Visibility
                 *
                 * Functions as the central decision-making engine that determines whether TOC
                 * should appear or remain hidden based on sophisticated user behavior analysis.
                 * Coordinates multiple data sources including scroll progress, time investment,
                 * and behavioral patterns to make intelligent visibility decisions. Manages
                 * state transitions smoothly while providing detailed reasoning for debugging
                 * and optimization purposes, ensuring TOC appears precisely when users would
                 * benefit most from navigation assistance.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} scrollPercent Current scroll position as decimal (0-1)
                 * @param {number} timeOnPage Milliseconds user has spent on current page
                 * @param {Object} behaviorState Current user behavior tracking data
                 * @param {Object} visibilityConfig Configuration thresholds for visibility logic
                 */
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
                /**
                 * Calculate Optimal TOC Visibility Using Multi-Factor Behavioral Analysis
                 *
                 * Implements sophisticated decision tree algorithm that evaluates multiple user
                 * engagement indicators to determine the mathematically optimal moment for TOC
                 * presentation. Combines time-based commitment analysis with scroll-depth
                 * assessment and applies intelligent override logic for edge cases like document
                 * navigation patterns. Creates data-driven visibility decisions that maximize
                 * user utility while minimizing interface intrusion through evidence-based
                 * engagement threshold evaluation.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} scrollPercent Current document scroll progress (0-1)
                 * @param {number} timeOnPage User session duration in milliseconds
                 * @param {Object} behaviorState Comprehensive user interaction tracking data
                 * @param {Object} visibilityConfig Business rules and threshold configuration
                 * @return {boolean} True if TOC should be visible based on current conditions
                 */
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
                /**
                 * Execute Smooth Visual Transitions for Table of Contents Display State
                 *
                 * Manages the actual implementation of visibility decisions by orchestrating
                 * CSS class manipulations and state synchronization between logical visibility
                 * conditions and visual presentation. Applies elegant animation triggers through
                 * class-based styling while maintaining comprehensive state tracking for future
                 * decision-making cycles. Ensures visibility changes feel natural and responsive
                 * by leveraging CSS transitions and providing detailed logging for behavioral
                 * analysis and system optimization.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {boolean} shouldBeVisible Target visibility state from decision logic
                 * @param {Object} behaviorState User behavior tracking object to update
                 */
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
                /**
                 * Generate Detailed Diagnostic Report for TOC Visibility State Changes
                 *
                 * Performs comprehensive forensic analysis of user behavior data to determine
                 * and articulate the specific factors that triggered a visibility transition.
                 * Creates human-readable explanations by examining threshold comparisons,
                 * timing analysis, and behavioral pattern recognition. Provides essential
                 * debugging intelligence and user experience insights by translating complex
                 * algorithmic decisions into clear diagnostic messages that facilitate system
                 * optimization and behavioral understanding.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} scrollPercent Current scroll position as percentage
                 * @param {number} timeOnPage Session duration in milliseconds
                 * @param {Object} behaviorState Complete user interaction state data
                 * @param {Object} visibilityConfig Threshold configuration for analysis
                 * @return {string} Human-readable explanation of visibility change trigger
                 */
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
                /**
                 * Calculate Precise Scroll Target Position with Dynamic Header Compensation
                 *
                 * Performs intelligent geometric calculations to determine the optimal scroll
                 * destination that accounts for fixed headers, viewport considerations, and
                 * content positioning nuances. Implements dynamic offset computation that
                 * adapts to varying header heights and ensures target content appears in the
                 * most readable viewport position. Creates seamless navigation experience by
                 * preventing content from being obscured by interface elements during smooth
                 * scrolling operations.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {Element} targetElement DOM element to scroll to
                 * @return {number} Calculated scroll position in pixels for optimal content display
                 */
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
                /**
                 * Execute Cross-Browser Compatible Smooth Scrolling with Fallback Support
                 *
                 * Implements progressive enhancement approach that prioritizes modern native
                 * smooth scrolling API while providing custom animation fallbacks for older
                 * browsers. Orchestrates scroll completion detection and user feedback systems
                 * to ensure consistent navigation experience across all browser environments.
                 * Manages performance optimization by leveraging browser-native implementations
                 * when available and gracefully degrading to JavaScript-based alternatives
                 * for comprehensive compatibility coverage.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} targetPosition Calculated scroll destination in pixels
                 * @param {Element} targetElement DOM element being scrolled to for completion detection
                 */
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
                /**
                 * Monitor and Detect Native Smooth Scroll Animation Completion
                 *
                 * Implements intelligent polling mechanism to determine when browser-native
                 * smooth scrolling has reached its target destination. Uses precision timing
                 * and position tolerance calculations to detect completion without interfering
                 * with browser optimization. Provides essential feedback for user experience
                 * enhancements like progress indicators or subsequent animations while
                 * maintaining performance through configurable polling intervals and maximum
                 * wait time constraints for reliable completion detection.
                 *
                 * @since 1.0.0
                 * @author CloudSync Theme
                 * @param {number} targetPosition Expected final scroll position in pixels
                 * @param {Element} targetElement Target DOM element for additional completion verification
                 */
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
                /**
                 * Calculate Reading Time Using Existing PHP Data and Real-Time Progress
                 *
                 * Leverages existing PHP calculations from cloudsync_analyze_page_context()
                 * and reading time estimates while adding real-time scroll progress tracking.
                 * This approach maintains consistency with server-side analysis while providing
                 * dynamic user feedback based on actual reading progress.
                 *
                 * @since 1.0.0
                 * @returns {Object} Reading time data with remaining estimates
                 */
                calculateReadingTime: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    try {
                        // Get data from PHP analysis
                        var phpData = this.extractPHPPageData();

                        // Calculate current scroll progress
                        var scrollProgress = this.getCurrentScrollProgress();

                        // Calculate remaining time based on PHP total and current progress
                        var totalMinutes = phpData.totalMinutes;
                        var remainingMinutes = Math.ceil(
                            totalMinutes * (1 - scrollProgress)
                        );

                        var result = {
                            totalMinutes: totalMinutes,
                            remainingMinutes: Math.max(0, remainingMinutes),
                            scrollProgress: Math.round(scrollProgress * 100),
                            contentType: phpData.contentType,
                            contentLength: phpData.contentLength,
                            isComplete: scrollProgress >= 0.95,
                        };

                        utils.log(
                            "Reading time calculated using PHP data:",
                            result
                        );
                        return result;
                    } catch (error) {
                        utils.log(
                            "Error calculating reading time",
                            "error",
                            error
                        );
                        return {
                            totalMinutes: 5,
                            remainingMinutes: 5,
                            scrollProgress: 0,
                            contentType: "standard",
                            contentLength: "medium",
                            isComplete: false,
                        };
                    }
                },
                /**
                 * Extract Page Data with Intelligent Fallback System
                 *
                 * Attempts to use existing PHP calculations when available (for posts),
                 * falls back to JavaScript calculations for pages. This hybrid approach
                 * ensures consistency with server-side analysis while providing universal
                 * coverage across all content types without requiring template modifications.
                 *
                 * @since 1.0.0
                 * @returns {Object} Complete page data with reading time estimates
                 */
                extractPHPPageData: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var data = {
                        totalMinutes: 5,
                        contentType: "standard",
                        contentLength: "medium",
                        dataSource: "fallback",
                    };

                    // Try to find PHP reading time element (available in posts)
                    var readingTimeElement = document.querySelector(
                        ".reading-time, .post-meta-item.reading-time, .page-meta-item.reading-time"
                    );
                    if (readingTimeElement) {
                        var timeText =
                            readingTimeElement.textContent ||
                            readingTimeElement.innerText ||
                            "";
                        var timeMatch = timeText.match(/(\d+)\s*min/i);
                        if (timeMatch) {
                            data.totalMinutes = parseInt(timeMatch[1]);
                            data.dataSource = "php";
                            utils.log(
                                "Using PHP reading time: " +
                                    data.totalMinutes +
                                    " minutes"
                            );
                        }
                    } else {
                        // No PHP reading time found - calculate using JavaScript for pages
                        data.totalMinutes =
                            this.calculateJavaScriptReadingTime();
                        data.dataSource = "javascript";
                        utils.log(
                            "Using JavaScript reading time: " +
                                data.totalMinutes +
                                " minutes"
                        );
                    }

                    // Extract content classification from PHP analysis (this works for both posts and pages)
                    var mainElement = document.querySelector("main");
                    if (mainElement && mainElement.className) {
                        var classes = mainElement.className;

                        // Content length classification from cloudsync_analyze_page_context
                        if (classes.indexOf("short-content") !== -1) {
                            data.contentLength = "short";
                        } else if (classes.indexOf("long-content") !== -1) {
                            data.contentLength = "long";
                        } else {
                            data.contentLength = "medium";
                        }

                        // Content type classification
                        if (classes.indexOf("page-type-legal") !== -1) {
                            data.contentType = "legal";
                        } else if (classes.indexOf("page-type-about") !== -1) {
                            data.contentType = "about";
                        } else if (classes.indexOf("page-type-docs") !== -1) {
                            data.contentType = "docs";
                        } else if (
                            classes.indexOf("page-type-product") !== -1
                        ) {
                            data.contentType = "product";
                        } else {
                            data.contentType = "standard";
                        }

                        utils.log(
                            "Content analysis: " +
                                data.contentLength +
                                " " +
                                data.contentType +
                                " content"
                        );
                    }

                    return data;
                },
                /**
                 * Calculate Reading Time Using JavaScript Analysis
                 *
                 * Provides intelligent reading time calculation when PHP data is not available.
                 * Uses content analysis, reading speed adjustments, and smart filtering to
                 * provide accurate estimates that complement the existing PHP analysis system.
                 *
                 * @since 1.0.0
                 * @returns {number} Reading time in minutes
                 */
                calculateJavaScriptReadingTime: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    try {
                        // Find main content area using multiple selectors
                        var contentArea = this.findContentArea();
                        if (!contentArea) {
                            utils.log(
                                "No content area found for JS reading time calculation",
                                "warn"
                            );
                            return 5;
                        }

                        // Extract clean text content
                        var cleanText = this.extractCleanText(contentArea);
                        if (!cleanText || cleanText.trim().length < 50) {
                            utils.log(
                                "Insufficient content for reading time calculation",
                                "warn"
                            );
                            return 1;
                        }

                        // Count words intelligently
                        var wordCount = this.countMeaningfulWords(cleanText);

                        // Determine reading speed based on content type and complexity
                        var readingSpeed =
                            this.determineReadingSpeed(cleanText);

                        // Calculate time with minimum threshold
                        var minutes = Math.max(
                            1,
                            Math.ceil(wordCount / readingSpeed)
                        );

                        utils.log(
                            "JS Reading time calculated: " +
                                wordCount +
                                " words at " +
                                readingSpeed +
                                " WPM = " +
                                minutes +
                                " minutes"
                        );

                        return minutes;
                    } catch (error) {
                        utils.log(
                            "Error in JavaScript reading time calculation",
                            "error",
                            error
                        );
                        return 5; // Safe fallback
                    }
                },

                /**
                 * Find Main Content Area Using Intelligent Selector Strategy
                 *
                 * Uses a prioritized list of selectors to locate the primary readable content
                 * while avoiding navigation, sidebar, and UI elements. Works across different
                 * WordPress themes and content structures.
                 *
                 * @since 1.0.0
                 * @returns {HTMLElement|null} Main content element
                 */
                findContentArea: function () {
                    // Priority-ordered selectors for finding main content
                    var selectors = [
                        ".entry-content", // WordPress standard (both posts and pages)
                        ".post-content", // Alternative post content
                        ".page-content .entry-content", // Page-specific content
                        "article .content", // Semantic article content
                        "main article", // Main article element
                        ".content-area .content", // Theme-specific content area
                        "main .container", // Main container content
                        ".site-main .entry-content", // Site main content
                        "main", // HTML5 main element
                        ".content", // Generic content class
                        "article", // Article element
                        "#content", // Content ID fallback
                    ];

                    for (var i = 0; i < selectors.length; i++) {
                        var element = document.querySelector(selectors[i]);
                        if (element) {
                            var textLength = (element.textContent || "").trim()
                                .length;
                            if (textLength > 100) {
                                // Ensure it has substantial content
                                return element;
                            }
                        }
                    }

                    return null;
                },

                /**
                 * Extract Clean Text Content for Word Counting
                 *
                 * Removes non-readable elements and content to ensure accurate word counting.
                 * Filters out navigation, code blocks, UI elements, and our own TOC components.
                 *
                 * @since 1.0.0
                 * @param {HTMLElement} element - Element to extract text from
                 * @returns {string} Cleaned text content
                 */
                extractCleanText: function (element) {
                    // Clone to avoid modifying the original element
                    var clone = element.cloneNode(true);

                    // Remove elements that shouldn't count toward reading time
                    var excludeSelectors = [
                        // Navigation and structural elements
                        "nav",
                        "header",
                        "footer",
                        ".menu",
                        ".nav",
                        ".navigation",
                        ".breadcrumbs",
                        ".pagination",
                        ".post-meta",
                        ".page-meta",

                        // Technical and interactive elements
                        "script",
                        "style",
                        "noscript",
                        "code",
                        "pre",
                        ".code-block",

                        // Our own TOC elements
                        ".advanced-toc",
                        ".mobile-toc-system",
                        ".floating-toc-button",
                        ".page-toc",
                        "#page-toc-content",

                        // UI and sidebar elements
                        ".sidebar",
                        ".widget",
                        ".widget-area",
                        ".comments",
                        ".comment-form",
                        ".social-share",
                        ".share-buttons",
                        ".related-posts",

                        // Hidden and decorative content
                        '[aria-hidden="true"]',
                        '[style*="display: none"]',
                        '[style*="display:none"]',
                        ".screen-reader-text",
                        ".sr-only",
                    ];

                    // Remove excluded elements
                    excludeSelectors.forEach(function (selector) {
                        var elements = clone.querySelectorAll(selector);
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].remove();
                        }
                    });

                    // Get text and clean it up
                    var text = clone.textContent || clone.innerText || "";

                    // Normalize whitespace and clean up
                    text = text.replace(/\s+/g, " ").trim();

                    return text;
                },

                /**
                 * Count Meaningful Words in Text Content
                 *
                 * Implements intelligent word counting that excludes numbers, single characters,
                 * and other non-meaningful content while accurately counting readable words.
                 *
                 * @since 1.0.0
                 * @param {string} text - Text to analyze
                 * @returns {number} Count of meaningful words
                 */
                countMeaningfulWords: function (text) {
                    if (!text || text.trim().length === 0) {
                        return 0;
                    }

                    // Split into potential words
                    var potentialWords = text.trim().split(/\s+/);

                    // Filter to count only meaningful words
                    var meaningfulWords = potentialWords.filter(function (
                        word
                    ) {
                        // Clean word boundaries
                        var cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, "");

                        // Skip empty words
                        if (!cleanWord || cleanWord.length === 0) {
                            return false;
                        }

                        // Skip pure numbers (but allow words with numbers like "2024")
                        if (/^\d+$/.test(cleanWord)) {
                            return false;
                        }

                        // Skip single characters unless they're meaningful words
                        if (cleanWord.length === 1) {
                            return /^[aeiouAEIOU]$/i.test(cleanWord); // Only count vowels as single-letter words
                        }

                        // Count everything else as a meaningful word
                        return true;
                    });

                    return meaningfulWords.length;
                },

                /**
                 * Determine Reading Speed Based on Content Analysis
                 *
                 * Analyzes content characteristics to adjust reading speed for more accurate
                 * time estimates. Technical content and complex writing require slower reading
                 * speeds for proper comprehension.
                 *
                 * @since 1.0.0
                 * @param {string} text - Text content to analyze
                 * @returns {number} Adjusted reading speed in words per minute
                 */
                determineReadingSpeed: function (text) {
                    var baseSpeed = 225; // Conservative average for web content
                    var adjustmentFactor = 1.0;

                    // Get content type from PHP analysis if available
                    var mainElement = document.querySelector("main");
                    var contentType = "standard";

                    if (mainElement && mainElement.className) {
                        var classes = mainElement.className;
                        if (classes.indexOf("page-type-legal") !== -1) {
                            contentType = "legal";
                        } else if (classes.indexOf("page-type-docs") !== -1) {
                            contentType = "docs";
                        }
                    }

                    // Adjust speed based on content type
                    switch (contentType) {
                        case "legal":
                            adjustmentFactor = 0.8; // 20% slower for legal documents
                            break;
                        case "docs":
                            adjustmentFactor = 0.85; // 15% slower for documentation
                            break;
                        default:
                            // Analyze text complexity for other content types
                            adjustmentFactor = this.analyzeTextComplexity(text);
                    }

                    return Math.round(baseSpeed * adjustmentFactor);
                },

                /**
                 * Analyze Text Complexity for Reading Speed Adjustment
                 *
                 * Examines sentence length, technical terminology, and other complexity
                 * indicators to determine appropriate reading speed adjustments.
                 *
                 * @since 1.0.0
                 * @param {string} text - Text to analyze
                 * @returns {number} Adjustment factor (0.7 to 1.2)
                 */
                analyzeTextComplexity: function (text) {
                    var adjustmentFactor = 1.0;

                    // Analyze average sentence length
                    var sentences = text.split(/[.!?]+/).filter(function (s) {
                        return s.trim().length > 10;
                    });

                    if (sentences.length > 0) {
                        var totalWords = 0;
                        sentences.forEach(function (sentence) {
                            totalWords += sentence.split(/\s+/).length;
                        });
                        var avgSentenceLength = totalWords / sentences.length;

                        // Adjust based on sentence complexity
                        if (avgSentenceLength > 30) {
                            adjustmentFactor *= 0.9; // 10% slower for complex sentences
                        } else if (avgSentenceLength < 15) {
                            adjustmentFactor *= 1.1; // 10% faster for simple sentences
                        }
                    }

                    // Check for technical indicators
                    var technicalTerms = (
                        text.match(
                            /\b(function|method|class|object|array|variable|parameter|algorithm|implementation|configuration|deployment|authentication|encryption|framework|library|database|server|API|HTML|CSS|JavaScript)\b/gi
                        ) || []
                    ).length;
                    var wordCount = text.split(/\s+/).length;
                    var technicalDensity = technicalTerms / wordCount;

                    if (technicalDensity > 0.02) {
                        // More than 2% technical terms
                        adjustmentFactor *= 0.85; // 15% slower for technical content
                    }

                    // Ensure factor stays within reasonable bounds
                    return Math.max(0.7, Math.min(1.2, adjustmentFactor));
                },
                /**
                 * Get Current Scroll Progress
                 *
                 * Simple, reliable scroll progress calculation that works consistently
                 * across different browsers and content types.
                 *
                 * @since 1.0.0
                 * @returns {number} Progress value between 0 and 1
                 */
                getCurrentScrollProgress: function () {
                    var scrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop;
                    var documentHeight = Math.max(
                        document.body.scrollHeight,
                        document.documentElement.scrollHeight
                    );
                    var windowHeight = window.innerHeight;

                    var scrollableDistance = documentHeight - windowHeight;

                    if (scrollableDistance <= 0) {
                        return 0;
                    }

                    var progress = scrollTop / scrollableDistance;
                    return Math.min(Math.max(progress, 0), 1);
                },
                /**
                 * Update Mobile Progress Display Using PHP Data
                 *
                 * Updates the mobile TOC header with reading progress information derived
                 * from existing PHP calculations. Provides contextual messages based on
                 * content type and reading progress while maintaining consistency with
                 * server-side analysis.
                 *
                 * @since 1.0.0
                 */
                updateMobileProgressDisplay: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    if (
                        this.state.currentMode !== "mobile" ||
                        !this.state.tocElements.mobileContainer
                    ) {
                        return;
                    }

                    var progressElement =
                        this.state.tocElements.mobileContainer.querySelector(
                            ".mobile-toc-progress"
                        );
                    if (!progressElement) {
                        return;
                    }

                    try {
                        var readingData = this.calculateReadingTime();

                        // Build contextual progress message
                        var progressText =
                            this.state.headings.length + " sections";

                        if (readingData.totalMinutes > 0) {
                            if (readingData.isComplete) {
                                progressText += " • Reading complete! ✅";
                            } else if (readingData.remainingMinutes === 0) {
                                progressText += " • Almost done!";
                            } else if (readingData.remainingMinutes === 1) {
                                progressText += " • ~1 min left";
                            } else {
                                progressText +=
                                    " • ~" +
                                    readingData.remainingMinutes +
                                    " min left";
                            }
                        }

                        progressText +=
                            " (" + readingData.scrollProgress + "%)";

                        progressElement.textContent = progressText;
                    } catch (error) {
                        // Fallback to basic display
                        progressElement.textContent =
                            this.state.headings.length + " sections";
                    }
                },
                /**
                 * Initialize Reading Progress Updates for Mobile
                 *
                 * Sets up scroll event handling to update reading time display in real-time.
                 * Uses throttling for performance while providing responsive feedback.
                 *
                 * @since 1.0.0
                 */
                initializeReadingTimeUpdates: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    if (this.state.currentMode !== "mobile") {
                        return;
                    }

                    // Throttled scroll handler
                    var updateProgress = utils.throttle(function () {
                        self.updateMobileProgressDisplay();
                    }, 150); // Update every 150ms for smooth feedback

                    // Bind scroll event
                    utils.addEventListener(window, "scroll", updateProgress, {
                        passive: true,
                    });

                    // Initial update
                    setTimeout(function () {
                        self.updateMobileProgressDisplay();
                    }, 500);

                    utils.log(
                        "Reading time progress updates initialized using PHP data"
                    );
                },

                /**
                 * =================================================
                 * --------------MOBILE TOC-------------------------
                 * =================================================
                 *
                /**
                 * Create Enhanced Mobile TOC System with Full Accessibility Support
                 *
                 * Creates comprehensive mobile table of contents components with complete functionality
                 * including proper ARIA attributes, keyboard navigation support, and touch optimization.
                 * This enhanced version provides production-ready accessibility compliance while
                 * maintaining the rapid testing capabilities of the minimal implementation.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if enhanced mobile TOC created successfully
                 */
                createMobileTOC: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Creating enhanced mobile TOC with full accessibility support"
                    );

                    try {
                        // Remove existing mobile TOC if present
                        var existing =
                            document.querySelector(".mobile-toc-system");
                        if (existing) {
                            existing.remove();
                        }

                        // Create main container
                        var container = document.createElement("div");
                        container.className = "mobile-toc-system";

                        // Create floating button with enhanced accessibility
                        var button = document.createElement("button");
                        button.className = "floating-toc-button";
                        button.innerHTML = "☰";
                        button.setAttribute(
                            "aria-label",
                            "Open table of contents"
                        );
                        button.setAttribute("aria-expanded", "false");
                        button.setAttribute(
                            "aria-controls",
                            "mobile-toc-panel"
                        );
                        button.setAttribute("type", "button");

                        // Create panel with proper dialog semantics
                        var panel = document.createElement("div");
                        panel.className = "mobile-toc-panel";
                        panel.id = "mobile-toc-panel";
                        panel.setAttribute("role", "dialog");
                        panel.setAttribute(
                            "aria-labelledby",
                            "mobile-toc-title"
                        );
                        panel.setAttribute("aria-hidden", "true");
                        panel.setAttribute("aria-modal", "true");

                        // Create overlay for modal behavior
                        var overlay = document.createElement("div");
                        overlay.className = "mobile-toc-overlay";

                        // Create panel content
                        var content = document.createElement("div");
                        content.className = "mobile-toc-content";

                        // Create enhanced header with proper structure
                        var header = document.createElement("div");
                        header.className = "mobile-toc-header";

                        var titleSection = document.createElement("div");
                        var title = document.createElement("h2");
                        title.className = "mobile-toc-title";
                        title.id = "mobile-toc-title";
                        title.textContent = "Table of Contents";

                        var progress = document.createElement("div");
                        progress.className = "mobile-toc-progress";
                        progress.textContent =
                            this.state.headings.length + " sections";

                        titleSection.appendChild(title);
                        titleSection.appendChild(progress);

                        var closeButton = document.createElement("button");
                        closeButton.className = "mobile-toc-close";
                        closeButton.innerHTML = "×";
                        closeButton.setAttribute(
                            "aria-label",
                            "Close table of contents"
                        );
                        closeButton.setAttribute("type", "button");

                        header.appendChild(titleSection);
                        header.appendChild(closeButton);

                        // Create navigation with enhanced accessibility
                        var nav = document.createElement("div");
                        nav.className = "mobile-toc-navigation";
                        nav.setAttribute("role", "navigation");
                        nav.setAttribute("aria-label", "Page sections");

                        var list = document.createElement("ul");
                        list.className = "mobile-toc-list";

                        // Add heading links with proper attributes
                        for (var i = 0; i < this.state.headings.length; i++) {
                            var heading = this.state.headings[i];
                            var item = document.createElement("li");
                            item.className =
                                "mobile-toc-item toc-h" + heading.level;

                            var link = document.createElement("a");
                            link.className = "mobile-toc-link";
                            link.href = "#" + heading.id;
                            link.textContent = heading.text;
                            link.setAttribute("role", "button");
                            link.setAttribute("tabindex", "0");

                            item.appendChild(link);
                            list.appendChild(item);
                        }

                        nav.appendChild(list);
                        // Create footer with quick action buttons
                        var footer = document.createElement("div");
                        footer.className = "mobile-toc-footer";

                        var quickActions = document.createElement("div");
                        quickActions.className = "mobile-toc-quick-actions";

                        // Quick action: Go to top
                        var topButton = document.createElement("button");
                        topButton.className =
                            "quick-action-btn quick-action-top";
                        topButton.setAttribute("type", "button");
                        topButton.setAttribute(
                            "aria-label",
                            "Scroll to top of page"
                        );
                        topButton.innerHTML =
                            '<span aria-hidden="true">↑</span> Top';

                        // Quick action: Go to bottom
                        var bottomButton = document.createElement("button");
                        bottomButton.className =
                            "quick-action-btn quick-action-bottom";
                        bottomButton.setAttribute("type", "button");
                        bottomButton.setAttribute(
                            "aria-label",
                            "Scroll to bottom of page"
                        );
                        bottomButton.innerHTML =
                            '<span aria-hidden="true">↓</span> Bottom';

                        quickActions.appendChild(topButton);
                        quickActions.appendChild(bottomButton);
                        footer.appendChild(quickActions);

                        // Assemble complete structure
                        content.appendChild(header);
                        content.appendChild(nav);
                        content.appendChild(footer);
                        panel.appendChild(overlay);
                        panel.appendChild(content);

                        container.appendChild(button);
                        container.appendChild(panel);
                        document.body.appendChild(container);

                        // Store references
                        this.state.tocElements.mobileContainer = container;
                        this.state.tocElements.floatingButton = button;
                        this.state.tocElements.mobilePanel = panel;

                        utils.log(
                            "Enhanced mobile TOC created with full accessibility compliance"
                        );
                        return true;
                    } catch (error) {
                        utils.log(
                            "Error creating enhanced mobile TOC",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Quick Test for Mobile TOC Basic Functionality
                 *
                 * Performs rapid validation of core mobile TOC creation and structure.
                 * This test focuses on essential functionality verification without
                 * testing complex interactions or animations.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if all basic tests pass
                 */
                testMobileTOCQuick: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log("=== QUICK MOBILE TOC TEST ===");

                    // Test 1: Check if headings were scanned
                    if (
                        !this.state.headings ||
                        this.state.headings.length === 0
                    ) {
                        utils.log("ERROR: No headings found for TOC", "error");
                        return false;
                    }
                    utils.log(
                        "✓ Headings scanned: " + this.state.headings.length
                    );

                    // Test 2: Create mobile TOC
                    var created = this.createMobileTOC();
                    if (!created) {
                        utils.log(
                            "ERROR: Failed to create mobile TOC",
                            "error"
                        );
                        return false;
                    }
                    utils.log("✓ Mobile TOC created");

                    // Test 3: Check DOM elements exist
                    var button = document.querySelector(".floating-toc-button");
                    var panel = document.querySelector(".mobile-toc-panel");
                    var links = document.querySelectorAll(".mobile-toc-link");

                    if (!button) {
                        utils.log("ERROR: Floating button not found", "error");
                        return false;
                    }
                    utils.log("✓ Floating button exists");

                    if (!panel) {
                        utils.log("ERROR: Mobile panel not found", "error");
                        return false;
                    }
                    utils.log("✓ Mobile panel exists");

                    if (links.length !== this.state.headings.length) {
                        utils.log("ERROR: Link count mismatch", "error");
                        return false;
                    }
                    utils.log("✓ Navigation links created: " + links.length);

                    utils.log("=== ALL TESTS PASSED ===");
                    return true;
                },
                /**
                 * Bind Floating Button Interaction Events
                 *
                 * Establishes touch and click event handling for the floating action button.
                 * Optimizes for both touch and mouse interactions while providing immediate
                 * visual feedback and maintaining accessibility standards.
                 *
                 * @since 1.0.0
                 */
                bindFloatingButtonEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    var button = this.state.tocElements.floatingButton;
                    if (!button) return;

                    // Primary interaction handler
                    utils.addEventListener(button, "click", function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        self.openMobilePanel();
                    });

                    // Touch feedback for mobile devices
                    utils.addEventListener(
                        button,
                        "touchstart",
                        function (event) {
                            button.classList.add("button-pressed");
                        },
                        { passive: true }
                    );

                    utils.addEventListener(
                        button,
                        "touchend",
                        function (event) {
                            setTimeout(function () {
                                button.classList.remove("button-pressed");
                            }, 150);
                        },
                        { passive: true }
                    );

                    utils.log("Floating button events bound");
                },

                /**
                 * Bind Mobile Panel Interaction Events
                 *
                 * Establishes closing mechanisms for the mobile panel including overlay clicks,
                 * close button presses, and keyboard navigation support.
                 *
                 * @since 1.0.0
                 */
                bindMobilePanelEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    var panel = this.state.tocElements.mobilePanel;
                    if (!panel) return;

                    // Close button
                    var closeButton = panel.querySelector(".mobile-toc-close");
                    if (closeButton) {
                        utils.addEventListener(
                            closeButton,
                            "click",
                            function (event) {
                                event.preventDefault();
                                self.closeMobilePanel();
                            }
                        );
                    }

                    // Overlay click to close
                    this.bindSimpleOverlayClose();

                    // Escape key to close
                    utils.addEventListener(
                        document,
                        "keydown",
                        function (event) {
                            if (
                                event.key === "Escape" &&
                                panel.classList.contains("panel-open")
                            ) {
                                self.closeMobilePanel();
                            }
                        }
                    );
                    // Quick action buttons
                    var topButton = panel.querySelector(".quick-action-top");
                    var bottomButton = panel.querySelector(
                        ".quick-action-bottom"
                    );

                    if (topButton) {
                        utils.addEventListener(
                            topButton,
                            "click",
                            function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                utils.log("Quick action: scrolling to top");

                                // Smooth scroll to top
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });

                                // Close panel after short delay to show the action
                                setTimeout(function () {
                                    self.closeMobilePanel();
                                }, 300);
                            }
                        );

                        utils.log("Top button events bound");
                    }

                    if (bottomButton) {
                        utils.addEventListener(
                            bottomButton,
                            "click",
                            function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                utils.log("Quick action: scrolling to bottom");

                                // Smooth scroll to bottom
                                window.scrollTo({
                                    top: document.documentElement.scrollHeight,
                                    behavior: "smooth",
                                });

                                // Close panel after short delay to show the action
                                setTimeout(function () {
                                    self.closeMobilePanel();
                                }, 300);
                            }
                        );

                        utils.log("Bottom button events bound");
                    }

                    utils.log("Mobile panel events bound");
                },
                /**
                 * Bind Mobile Navigation Events for Touch-Optimized Interaction
                 *
                 * Establishes event handling for mobile navigation links including smooth scrolling
                 * to target sections and panel auto-closing after navigation. This method optimizes
                 * for touch interaction patterns while maintaining keyboard accessibility and
                 * providing appropriate visual feedback for user actions.
                 *
                 * @since 1.0.0
                 */
                bindMobileNavigationEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    // Find mobile navigation links instead of desktop ones
                    var mobilePanel = this.state.tocElements.mobilePanel;
                    if (!mobilePanel) {
                        utils.log(
                            "Mobile panel not available for navigation binding",
                            "warn"
                        );
                        return;
                    }

                    var navigationLinks =
                        mobilePanel.querySelectorAll(".mobile-toc-link");
                    if (navigationLinks.length === 0) {
                        utils.log("No mobile navigation links found", "warn");
                        return;
                    }

                    utils.log(
                        "Binding " +
                            navigationLinks.length +
                            " mobile navigation links"
                    );

                    // Bind click events to each navigation link
                    for (var i = 0; i < navigationLinks.length; i++) {
                        var link = navigationLinks[i];

                        utils.addEventListener(link, "click", function (event) {
                            event.preventDefault();

                            // Get target section ID from href attribute
                            var targetId = this.getAttribute("href");
                            if (targetId && targetId.startsWith("#")) {
                                var targetElement =
                                    document.querySelector(targetId);
                                if (targetElement) {
                                    // Smooth scroll to target section
                                    targetElement.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });

                                    // Close mobile panel after navigation (good UX pattern)
                                    setTimeout(function () {
                                        self.closeMobilePanel();
                                    }, 500); // Small delay allows users to see the selection

                                    utils.log(
                                        "Navigated to section: " + targetId
                                    );
                                } else {
                                    utils.log(
                                        "Target element not found: " + targetId,
                                        "warn"
                                    );
                                }
                            }
                        });
                    }

                    utils.log("Mobile navigation events bound successfully");
                },
                /**
                 * Open Mobile TOC Panel with Pure CSS Animation
                 *
                 * Opens the mobile TOC panel using CSS class-based animations without
                 * conflicting inline styles. This approach ensures smooth animations
                 * by leveraging optimized CSS transitions while maintaining proper
                 * accessibility and focus management.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if panel opened successfully
                 */
                openMobilePanel: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var panel = this.state.tocElements.mobilePanel;
                    var button = this.state.tocElements.floatingButton;

                    if (!panel) {
                        utils.log(
                            "Cannot open mobile panel - panel element not found",
                            "error"
                        );
                        return false;
                    }

                    utils.log("Opening mobile TOC panel with CSS animations");

                    // Remove any existing animation classes
                    panel.classList.remove("panel-closing");

                    // Update accessibility states
                    if (button) {
                        button.setAttribute("aria-expanded", "true");
                    }
                    panel.setAttribute("aria-hidden", "false");

                    // Add opening class - CSS handles the animation
                    panel.classList.add("panel-open");

                    // Focus management after animation
                    setTimeout(function () {
                        var firstLink = panel.querySelector(".mobile-toc-link");
                        if (firstLink) {
                            firstLink.focus();
                        }
                        document.body.style.overflow = "hidden";
                        utils.log("Mobile TOC panel opened successfully");
                    }, 400); // Wait for CSS animation to complete

                    return true;
                },

                /**
                 * Close Mobile TOC Panel with Pure CSS Animation
                 *
                 * Closes the mobile TOC panel using CSS class-based reverse animations
                 * while properly restoring page state and focus. This method coordinates
                 * with CSS transitions to provide smooth closing experience without
                 * JavaScript-CSS conflicts.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if panel closed successfully
                 */
                closeMobilePanel: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var panel = this.state.tocElements.mobilePanel;
                    var button = this.state.tocElements.floatingButton;

                    if (!panel) {
                        utils.log(
                            "Cannot close mobile panel - panel element not found",
                            "error"
                        );
                        return false;
                    }

                    utils.log("Closing mobile TOC panel with CSS animations");
                    panel.classList.remove("panel-open");

                    // Update accessibility states immediately
                    if (button) {
                        button.setAttribute("aria-expanded", "false");
                    }
                    panel.setAttribute("aria-hidden", "true");

                    // Cleanup after animation completes
                    setTimeout(function () {
                        panel.classList.remove("panel-closing");

                        // Restore page state
                        document.body.style.overflow = "";

                        if (button) {
                            button.focus();
                        }

                        utils.log("Mobile TOC panel closed successfully");
                    }, 350); // Wait for CSS animation to complete

                    return true;
                },
                /**
                 * Create SVG Progress Ring Using Existing CSS System
                 *
                 * Creates an SVG-based circular progress indicator that integrates with
                 * the existing CSS styling system. Uses stroke-dasharray and stroke-dashoffset
                 * for smooth, hardware-accelerated animations that provide precise progress
                 * visualization around the floating TOC button.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if progress ring created successfully
                 */
                createProgressRing: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var button = this.state.tocElements.floatingButton;

                    if (!button) {
                        utils.log(
                            "Cannot create progress ring - floating button not found",
                            "error"
                        );
                        return false;
                    }

                    // Check if progress ring already exists
                    var existingRing = button.querySelector(".progress-ring");
                    if (existingRing) {
                        utils.log("Progress ring already exists");
                        return true;
                    }

                    utils.log(
                        "Creating SVG progress ring using existing CSS system"
                    );

                    // Create progress ring container
                    var progressRing = document.createElement("div");
                    progressRing.className = "progress-ring";

                    // Create SVG element
                    var svg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    svg.setAttribute("class", "progress-svg");
                    svg.setAttribute("viewBox", "0 0 56 56");

                    // Calculate circle properties for stroke-dash animation
                    var radius = 26; // Slightly smaller than container to avoid clipping
                    var circumference = 2 * Math.PI * radius;

                    // Create background circle (subtle reference)
                    var backgroundCircle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    backgroundCircle.setAttribute(
                        "class",
                        "progress-background"
                    );
                    backgroundCircle.setAttribute("cx", "28");
                    backgroundCircle.setAttribute("cy", "28");
                    backgroundCircle.setAttribute("r", radius);
                    backgroundCircle.setAttribute("fill", "none");
                    backgroundCircle.setAttribute(
                        "stroke",
                        "rgba(102, 126, 234, 0.2)"
                    );
                    backgroundCircle.setAttribute("stroke-width", "2");

                    // Create progress circle (animated indicator)
                    var progressCircle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    progressCircle.setAttribute("class", "progress-circle");
                    progressCircle.setAttribute("cx", "28");
                    progressCircle.setAttribute("cy", "28");
                    progressCircle.setAttribute("r", radius);
                    progressCircle.setAttribute("fill", "none");
                    progressCircle.setAttribute("stroke", "#667eea");
                    progressCircle.setAttribute("stroke-width", "2.5");
                    progressCircle.setAttribute("stroke-linecap", "round");

                    // Set up stroke-dash properties for animation
                    progressCircle.setAttribute(
                        "stroke-dasharray",
                        circumference
                    );
                    progressCircle.setAttribute(
                        "stroke-dashoffset",
                        circumference
                    ); // Start fully hidden

                    // Assemble SVG structure
                    svg.appendChild(backgroundCircle);
                    svg.appendChild(progressCircle);
                    progressRing.appendChild(svg);

                    // Add ring to button
                    button.appendChild(progressRing);

                    // Store references for future updates
                    this.state.tocElements.progressRing = progressRing;
                    this.state.tocElements.progressCircle = progressCircle;
                    this.state.progressCircumference = circumference;

                    utils.log(
                        "SVG progress ring created successfully with circumference: " +
                            circumference
                    );
                    return true;
                },

                /**
                 * Update SVG Progress Ring with Smooth Animation
                 *
                 * Updates the stroke-dashoffset property of the SVG progress circle to
                 * represent current reading progress. Uses the existing CSS transition
                 * system for smooth animations and includes special states for completion
                 * and initialization phases.
                 *
                 * @since 1.0.0
                 * @param {number} progressValue - Progress value between 0 and 1
                 */
                updateProgressRing: function (progressValue) {
                    var utils = CloudSync.adaptivePages.utils;

                    if (this.state.currentMode !== "mobile") {
                        return; // Only show on mobile devices
                    }

                    var progressCircle = this.state.tocElements.progressCircle;
                    var progressRing = this.state.tocElements.progressRing;
                    var circumference = this.state.progressCircumference;

                    // Create ring if it doesn't exist yet
                    if (!progressCircle || !circumference) {
                        this.createProgressRing();
                        progressCircle = this.state.tocElements.progressCircle;
                        circumference = this.state.progressCircumference;
                    }

                    if (!progressCircle || !circumference) {
                        return; // Still couldn't create ring
                    }

                    try {
                        // Clamp progress value and convert to percentage
                        var clampedProgress = Math.max(
                            0,
                            Math.min(1, progressValue)
                        );
                        var progressPercentage = clampedProgress * 100;

                        // Calculate stroke-dashoffset for SVG circle animation
                        // When progress is 0, offset equals circumference (fully hidden)
                        // When progress is 1, offset equals 0 (fully visible)
                        var strokeOffset =
                            circumference - clampedProgress * circumference;

                        // Determine visibility threshold (show ring after 2% progress)
                        var shouldShowRing = progressPercentage > 2;

                        // Update stroke-dashoffset for progress animation
                        progressCircle.setAttribute(
                            "stroke-dashoffset",
                            strokeOffset
                        );

                        // Update ring visibility and color based on progress state
                        if (progressPercentage >= 100) {
                            // Completion state - green color and special effects
                            progressCircle.setAttribute("stroke", "#4ade80");
                            progressRing.style.opacity = "1";
                            progressRing.classList.add("progress-complete");
                        } else {
                            // Normal progress state - blue color
                            progressCircle.setAttribute("stroke", "#667eea");
                            progressRing.style.opacity = shouldShowRing
                                ? "0.8"
                                : "0";
                            progressRing.classList.remove("progress-complete");
                        }

                        // Debug logging for development (remove in production)
                        if (
                            utils.state &&
                            utils.state.debug &&
                            Math.random() < 0.1
                        ) {
                            // Log only 10% of updates
                            utils.log(
                                "Progress ring updated: " +
                                    progressPercentage.toFixed(1) +
                                    "% (offset: " +
                                    strokeOffset.toFixed(1) +
                                    ")"
                            );
                        }
                    } catch (error) {
                        utils.log(
                            "Error updating SVG progress ring",
                            "error",
                            error
                        );
                    }
                },

                /**
                 * Initialize SVG Progress Ring System
                 *
                 * Sets up the complete SVG progress ring system including creation, scroll
                 * event binding, and automatic updates. Integrates seamlessly with existing
                 * scroll tracking and provides smooth visual feedback for reading progress.
                 *
                 * @since 1.0.0
                 */
                initializeProgressRing: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    if (this.state.currentMode !== "mobile") {
                        return; // Only initialize on mobile devices
                    }

                    utils.log("Initializing SVG progress ring system");

                    // Create the initial SVG progress ring
                    this.createProgressRing();

                    // Set up throttled scroll handler for smooth performance
                    var updateRing = utils.throttle(function () {
                        var scrollProgress = self.getCurrentScrollProgress();
                        self.updateProgressRing(scrollProgress);
                    }, 50); // Update every 50ms for smooth visual feedback

                    // Bind scroll event with passive listening for performance
                    utils.addEventListener(window, "scroll", updateRing, {
                        passive: true,
                    });

                    // Initial update after system stabilization
                    setTimeout(function () {
                        var initialProgress = self.getCurrentScrollProgress();
                        self.updateProgressRing(initialProgress);
                    }, 800); // Longer delay to ensure all systems are ready

                    utils.log(
                        "SVG progress ring system initialized successfully"
                    );
                },
                /**
                 * Simple Overlay Close Handler
                 *
                 * This straightforward approach listens for clicks anywhere on the document
                 * and checks if the click happened outside the panel content area. If so,
                 * it removes the panel-open class to close the panel. This method is clean,
                 * reliable, and works regardless of the panel's internal structure.
                 *
                 * @since 1.0.0
                 */
                bindSimpleOverlayClose: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    // Listen for clicks anywhere on the document
                    utils.addEventListener(document, "click", function (event) {
                        var panel = self.state.tocElements.mobilePanel;

                        // Only proceed if panel exists and is currently open
                        if (!panel || !panel.classList.contains("panel-open")) {
                            return;
                        }

                        var content = panel.querySelector(
                            ".mobile-toc-content"
                        );
                        var button = self.state.tocElements.floatingButton;

                        // Check if click was outside the panel content and not on the button
                        var clickedOutside =
                            content && !content.contains(event.target);
                        var clickedButton =
                            button && button.contains(event.target);

                        if (clickedOutside && !clickedButton) {
                            utils.log(
                                "Clicked outside panel - removing panel-open class"
                            );
                            panel.classList.remove("panel-open");
                        }
                    });

                    utils.log("Simple overlay close handler bound to document");
                },
                /**
                 * ===================
                 * -----TESTS---------
                 * ===================
                 */
                /**
                 * Comprehensive Test Suite for Universal TOC Event System
                 *
                 * Performs thorough validation of the universal event binding system including
                 * mode detection, appropriate handler selection, DOM element verification, and
                 * actual event functionality. This test provides detailed feedback about each
                 * component of the system to ensure reliable operation across different devices
                 * and interaction patterns while maintaining accessibility and performance standards.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if all comprehensive tests pass successfully
                 */
                testUniversalTOCEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log(
                        "=== COMPREHENSIVE UNIVERSAL TOC EVENT TESTING ==="
                    );

                    try {
                        // Phase 1: Verify system state and readiness
                        utils.log("Phase 1: System State Verification");

                        if (!this.state.isInitialized) {
                            utils.log(
                                "ERROR: TOC module not initialized",
                                "error"
                            );
                            return false;
                        }
                        utils.log("✓ TOC module is properly initialized");

                        if (
                            !this.state.headings ||
                            this.state.headings.length === 0
                        ) {
                            utils.log(
                                "ERROR: No headings available for testing",
                                "error"
                            );
                            return false;
                        }
                        utils.log(
                            "✓ Headings data available: " +
                                this.state.headings.length +
                                " items"
                        );

                        // Phase 2: Verify current mode and interface elements
                        utils.log(
                            "Phase 2: Mode Detection and Interface Verification"
                        );

                        var currentMode = this.state.currentMode;
                        utils.log("Current mode detected as: " + currentMode);

                        if (currentMode === "mobile") {
                            if (!this.state.tocElements.mobileContainer) {
                                utils.log(
                                    "ERROR: Mobile mode active but mobile container missing",
                                    "error"
                                );
                                return false;
                            }
                            utils.log(
                                "✓ Mobile interface elements present and accessible"
                            );
                        } else if (currentMode === "desktop") {
                            if (!this.state.tocElements.desktopContainer) {
                                utils.log(
                                    "ERROR: Desktop mode active but desktop container missing",
                                    "error"
                                );
                                return false;
                            }
                            utils.log(
                                "✓ Desktop interface elements present and accessible"
                            );
                        } else {
                            utils.log(
                                "ERROR: Unknown or invalid mode: " +
                                    currentMode,
                                "error"
                            );
                            return false;
                        }

                        // Phase 3: Test universal event binding
                        utils.log("Phase 3: Universal Event Binding Test");

                        var bindingResult = this.bindEvents();
                        if (!bindingResult) {
                            utils.log(
                                "ERROR: Universal event binding failed",
                                "error"
                            );
                            return false;
                        }
                        utils.log(
                            "✓ Universal event binding completed successfully"
                        );

                        // Phase 4: Test mode-specific functionality
                        if (currentMode === "mobile") {
                            return this.testMobileSpecificEvents();
                        } else if (currentMode === "desktop") {
                            return this.testDesktopSpecificEvents();
                        }

                        utils.log(
                            "=== ALL UNIVERSAL TOC TESTS COMPLETED SUCCESSFULLY ==="
                        );
                        return true;
                    } catch (error) {
                        utils.log(
                            "CRITICAL ERROR during universal TOC testing",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Test Mobile-Specific Event Functionality
                 *
                 * Validates mobile interface event handling including floating button interactions,
                 * panel opening/closing mechanisms, and touch-optimized navigation. This test
                 * simulates user interactions and verifies that all mobile-specific features
                 * respond correctly while maintaining accessibility and performance standards.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if all mobile-specific tests pass
                 */
                testMobileSpecificEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log("Phase 4a: Mobile-Specific Event Testing");

                    try {
                        // Test 1: Verify floating button accessibility and interaction readiness
                        var floatingButton =
                            this.state.tocElements.floatingButton;
                        if (!floatingButton) {
                            utils.log(
                                "ERROR: Floating button element not found",
                                "error"
                            );
                            return false;
                        }

                        // Check that button has proper accessibility attributes
                        var ariaLabel =
                            floatingButton.getAttribute("aria-label");
                        var ariaExpanded =
                            floatingButton.getAttribute("aria-expanded");

                        if (!ariaLabel) {
                            utils.log(
                                "WARNING: Floating button missing aria-label",
                                "warn"
                            );
                        } else {
                            utils.log(
                                "✓ Floating button has accessibility label: " +
                                    ariaLabel
                            );
                        }

                        if (ariaExpanded === null) {
                            utils.log(
                                "WARNING: Floating button missing aria-expanded state",
                                "warn"
                            );
                        } else {
                            utils.log(
                                "✓ Floating button has proper ARIA state: " +
                                    ariaExpanded
                            );
                        }

                        // Test 2: Verify mobile panel structure and accessibility
                        var mobilePanel = this.state.tocElements.mobilePanel;
                        if (!mobilePanel) {
                            utils.log(
                                "ERROR: Mobile panel element not found",
                                "error"
                            );
                            return false;
                        }

                        var panelRole = mobilePanel.getAttribute("role");
                        var panelHidden =
                            mobilePanel.getAttribute("aria-hidden");

                        if (panelRole !== "dialog") {
                            utils.log(
                                "WARNING: Mobile panel missing proper dialog role",
                                "warn"
                            );
                        } else {
                            utils.log(
                                "✓ Mobile panel has correct dialog semantics"
                            );
                        }

                        // Test 3: Verify navigation links are properly created and accessible
                        var navigationLinks =
                            mobilePanel.querySelectorAll(".mobile-toc-link");
                        if (
                            navigationLinks.length !==
                            this.state.headings.length
                        ) {
                            utils.log(
                                "ERROR: Navigation link count mismatch",
                                "error"
                            );
                            utils.log(
                                "Expected: " +
                                    this.state.headings.length +
                                    ", Found: " +
                                    navigationLinks.length
                            );
                            return false;
                        }
                        utils.log(
                            "✓ All navigation links created correctly: " +
                                navigationLinks.length
                        );

                        // Test 4: Verify that all navigation links have proper href attributes
                        var linkTestsPassed = 0;
                        for (var i = 0; i < navigationLinks.length; i++) {
                            var link = navigationLinks[i];
                            var href = link.getAttribute("href");
                            var expectedId = this.state.headings[i].id;

                            if (href === "#" + expectedId) {
                                linkTestsPassed++;
                            } else {
                                utils.log(
                                    "WARNING: Link " +
                                        i +
                                        " has incorrect href: " +
                                        href,
                                    "warn"
                                );
                            }
                        }

                        if (linkTestsPassed === navigationLinks.length) {
                            utils.log(
                                "✓ All navigation links have correct href attributes"
                            );
                        } else {
                            utils.log(
                                "WARNING: " +
                                    (navigationLinks.length - linkTestsPassed) +
                                    " links have href issues",
                                "warn"
                            );
                        }

                        // Test 5: Simulate button interaction to test panel opening
                        utils.log(
                            "Testing mobile panel interaction simulation"
                        );

                        // Create a simple test for panel opening mechanism
                        var initialPanelState =
                            mobilePanel.classList.contains("panel-open");
                        if (initialPanelState) {
                            utils.log(
                                "Panel already open - this is unexpected for initial state",
                                "warn"
                            );
                        }

                        // Test the opening mechanism exists (we won't actually trigger it in automated test)
                        if (typeof this.openMobilePanel === "function") {
                            utils.log("✓ Panel opening mechanism available");
                        } else {
                            utils.log(
                                "ERROR: Panel opening mechanism not found",
                                "error"
                            );
                            return false;
                        }

                        if (typeof this.closeMobilePanel === "function") {
                            utils.log("✓ Panel closing mechanism available");
                        } else {
                            utils.log(
                                "ERROR: Panel closing mechanism not found",
                                "error"
                            );
                            return false;
                        }

                        utils.log(
                            "✓ All mobile-specific event tests passed successfully"
                        );
                        return true;
                    } catch (error) {
                        utils.log(
                            "ERROR during mobile-specific event testing",
                            "error",
                            error
                        );
                        return false;
                    }
                },
                /**
                 * Test Desktop-Specific Event Functionality
                 *
                 * Validates desktop interface event handling including hover states, collapse
                 * functionality, and mouse-optimized interactions. This test ensures that
                 * existing desktop functionality continues to work properly within the
                 * universal event system architecture.
                 *
                 * @since 1.0.0
                 * @returns {boolean} True if all desktop-specific tests pass
                 */
                testDesktopSpecificEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log("Phase 4b: Desktop-Specific Event Testing");

                    try {
                        // Test desktop container and its required elements
                        var desktopContainer =
                            this.state.tocElements.desktopContainer;
                        if (!desktopContainer) {
                            utils.log(
                                "ERROR: Desktop container not found",
                                "error"
                            );
                            return false;
                        }
                        utils.log(
                            "✓ Desktop TOC container located successfully"
                        );

                        // Verify collapse functionality is available
                        var collapseButton =
                            desktopContainer.querySelector(".toc-collapse");
                        if (!collapseButton) {
                            utils.log(
                                "WARNING: Desktop collapse button not found",
                                "warn"
                            );
                        } else {
                            utils.log(
                                "✓ Desktop collapse functionality available"
                            );
                        }

                        // Test navigation links in desktop mode
                        var desktopLinks =
                            desktopContainer.querySelectorAll(".toc-link");
                        if (desktopLinks.length > 0) {
                            utils.log(
                                "✓ Desktop navigation links found: " +
                                    desktopLinks.length
                            );
                        } else {
                            utils.log(
                                "WARNING: No desktop navigation links found",
                                "warn"
                            );
                        }

                        utils.log("✓ Desktop-specific event tests completed");
                        return true;
                    } catch (error) {
                        utils.log(
                            "ERROR during desktop-specific event testing",
                            "error",
                            error
                        );
                        return false;
                    }
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
        /**
         *
         * ==============================
         * ----------TESTS---------------
         * ==============================
         */
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
