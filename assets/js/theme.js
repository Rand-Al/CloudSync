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

    /**
     * =====================================================
     * SECTION 1: CORE THEME FUNCTIONALITY
     * =====================================================
     *
     * This section contains the main CloudSync object with
     * essential theme functions including smooth scrolling,
     * mobile menu, scroll animations, parallax effects,
     * interactive cards, and copy link functionality.
     */

    // Main theme object containing all functionality
    var CloudSync = {
        /**
         * Initialize all theme functions
         * This method orchestrates the setup of all interactive features
         */
        init: function () {
            // Core functionality
            this.smoothScrolling();
            this.mobileMenu();
            this.scrollAnimations();
            this.parallaxCards();
            this.interactiveCards();
            this.initCopyLinkButton();
            this.contactForm.init();
            this.adaptivePages.init();
            this.smartHeader.init();
            
            // Performance optimizations
            this.lazyLoading.init();
            this.performance.init();
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

                    /**
                     * Show copy success feedback to user
                     * Updates button appearance and text temporarily
                     *
                     * @private
                     * @function showCopySuccess
                     * @description Provides visual feedback when URL is successfully copied
                     * @since 1.0.0
                     */
                    function showCopySuccess() {
                        button.classList.add("copied");
                        buttonText.textContent = "Copied!";

                        setTimeout(function () {
                            button.classList.remove("copied");
                            buttonText.textContent = originalText;
                        }, 2000);
                    }

                    /**
                     * Fallback copy method for older browsers
                     * Uses document.execCommand for browsers without Clipboard API
                     *
                     * @private
                     * @function fallbackCopyTextToClipboard
                     * @param {string} text - Text to copy to clipboard
                     * @description Creates temporary textarea element for copy operation
                     * @since 1.0.0
                     */
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
         * Contact Form AJAX Handler
         * Handles form submission without page reload
         */
        contactForm: {
            init: function () {
                var form = document.getElementById('cloudsync-contact-form');
                if (!form) return;

                form.addEventListener('submit', this.handleSubmit.bind(this));
            },

            handleSubmit: function (e) {
                e.preventDefault();
                
                var form = e.target;
                var submitBtn = form.querySelector('.form-submit-btn');
                var responseDiv = form.querySelector('.form-response') || this.createResponseDiv(form);
                
                // Disable submit button and show loading state
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                submitBtn.querySelector('.btn-text').textContent = cloudsync_ajax.strings.sending;
                
                // Prepare form data
                var formData = new FormData();
                formData.append('action', 'cloudsync_contact_form');
                formData.append('nonce', cloudsync_ajax.nonce);
                formData.append('name', form.name.value);
                formData.append('email', form.email.value);
                formData.append('subject', form.subject.value);
                formData.append('message', form.message.value);
                
                // Submit via AJAX
                fetch(cloudsync_ajax.ajax_url, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    this.handleResponse(data, form, submitBtn, responseDiv);
                })
                .catch(error => {
                    this.handleError(error, submitBtn, responseDiv);
                });
            },

            handleResponse: function (data, form, submitBtn, responseDiv) {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('.btn-text').textContent = 'Send Message';
                
                // Show response message
                responseDiv.textContent = data.data.message;
                responseDiv.className = 'form-response show ' + (data.success ? 'success' : 'error');
                
                // Clear form on success
                if (data.success) {
                    form.reset();
                }
                
                // Hide response after 5 seconds
                setTimeout(() => {
                    responseDiv.classList.remove('show');
                }, 5000);
            },

            handleError: function (error, submitBtn, responseDiv) {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('.btn-text').textContent = 'Send Message';
                
                // Show error message
                responseDiv.textContent = cloudsync_ajax.strings.error;
                responseDiv.className = 'form-response show error';
                
                console.error('Contact form error:', error);
            },

            createResponseDiv: function (form) {
                var div = document.createElement('div');
                div.className = 'form-response';
                form.appendChild(div);
                return div;
            }
        },

        /**
         * =====================================================
         * SECTION 2: SMART HEADER SYSTEM
         * =====================================================
         *
         * Intelligent header behavior that hides/shows based on
         * scroll direction. Enhances user experience by maximizing
         * content visibility while maintaining easy access to
         * navigation when needed.
         */

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
     * =====================================================
     * SECTION 3: ADAPTIVE PAGES SYSTEM
     * =====================================================
     *
     * Comprehensive system that automatically enhances pages
     * based on content analysis, providing intelligent navigation,
     * reading progress, and interactive features. Built with
     * modular architecture for maintainability and extensibility.
     */

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

                    // Breakpoint transition state
                    pageLoadTime: null, // When page was initially loaded
                    preservedScrollPosition: null, // Scroll position during mode transitions
                    lastKnownScrollPosition: 0, // Continuously updated scroll position

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

                        // Record initial page load time for proper visibility timing
                        this.state.pageLoadTime = Date.now();

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
                 * Get range of heading levels found in document
                 * Analyzes processed headings to determine level range for debugging
                 *
                 * @function getHeadingLevelsRange
                 * @memberof CloudSync.adaptivePages.modules.tableOfContents
                 * @returns {string} Formatted range string (e.g., "H1-H3", "H2", or "none")
                 * @since 1.0.0
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
                bindEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this; // Store reference for use in event handlers

                    utils.log("Setting up TOC event handlers");

                    // Check current mode and bind appropriate events
                    if (this.state.currentMode === "desktop") {
                        // Verify that required desktop elements exist
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

                        utils.log(
                            "Desktop TOC event handlers bound successfully"
                        );
                    } else if (this.state.currentMode === "mobile") {
                        // Mobile mode - events are already bound in createMobileTOC
                        utils.log(
                            "Mobile TOC events already bound during creation"
                        );
                    }

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

                    // Early return if desktop container is not available
                    if (!this.state.tocElements.desktopContainer) {
                        return false;
                    }

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

                            // Always update last known scroll position for breakpoint transitions
                            self.state.lastKnownScrollPosition = currentScroll;
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

                    utils.log(
                        "DEBUG: updateActiveHighlight called: " +
                            previousActiveId +
                            " → " +
                            newActiveId
                    );

                    // Early return if TOC elements are not available (e.g., during breakpoint transitions)
                    if (!this.state.tocElements.tocList) {
                        utils.log(
                            "DEBUG: tocList not available, skipping highlight update"
                        );
                        return;
                    }

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

                    // Early return if desktop container is not available (e.g., during breakpoint transitions)
                    if (!this.state.tocElements.desktopContainer) {
                        return;
                    }

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

                    /**
                     * Recalculate document dimensions for accurate progress tracking
                     * Updates cached height values used in progress calculations
                     *
                     * @private
                     * @function updateDocumentDimensions
                     * @description Updates progressState with current document and viewport heights
                     * @since 1.0.0
                     */
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
                /**
                 * Quadratic easing function for smooth animation curves
                 * Creates natural acceleration and deceleration in progress changes
                 *
                 * @function easeInOutQuad
                 * @memberof CloudSync.adaptivePages.modules.tableOfContents
                 * @param {number} t - Time parameter between 0 and 1
                 * @returns {number} Eased value between 0 and 1
                 * @since 1.0.0
                 */
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

                    // Silently return if progress bar is not available (e.g., during breakpoint transitions)
                    if (!progressBar) {
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
                    var existingFloatingButton = document.querySelector(
                        ".floating-toc-button"
                    );
                    var existingMobilePanel =
                        document.querySelector(".mobile-toc-panel");

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
                    floatingButton.setAttribute(
                        "aria-label",
                        "Open table of contents"
                    );
                    floatingButton.setAttribute("tabindex", "0");

                    // Create progress ring container
                    var progressRing = document.createElement("div");
                    progressRing.className = "progress-ring";

                    // Create progress circle SVG
                    var progressSvg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    progressSvg.setAttribute("class", "progress-circle");
                    progressSvg.setAttribute("width", "56");
                    progressSvg.setAttribute("height", "56");
                    progressSvg.setAttribute("viewBox", "0 0 56 56");

                    // Background circle (full ring)
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
                    backgroundCircle.setAttribute("r", "24");
                    backgroundCircle.setAttribute("fill", "none");
                    backgroundCircle.setAttribute(
                        "stroke",
                        "rgba(255, 255, 255, 0.1)"
                    );
                    backgroundCircle.setAttribute("stroke-width", "2.5");

                    // Progress circle (animated progress)
                    var progressCircle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    progressCircle.setAttribute("cx", "28");
                    progressCircle.setAttribute("cy", "28");
                    progressCircle.setAttribute("r", "24");
                    progressCircle.setAttribute("fill", "none");
                    progressCircle.setAttribute(
                        "stroke",
                        "rgba(102, 126, 234, 0.8)"
                    );
                    progressCircle.setAttribute("stroke-width", "2.5");
                    progressCircle.setAttribute("stroke-linecap", "round");
                    progressCircle.setAttribute("stroke-dasharray", "150.80"); // 2 * π * 24
                    progressCircle.setAttribute("stroke-dashoffset", "150.80");
                    progressCircle.setAttribute(
                        "transform",
                        "rotate(-90 28 28)"
                    );

                    progressSvg.appendChild(backgroundCircle);
                    progressSvg.appendChild(progressCircle);
                    progressRing.appendChild(progressSvg);

                    utils.log(
                        "Created progress circle SVG with circumference: 150.80"
                    );

                    // Create button icon
                    var buttonIcon = document.createElement("i");
                    buttonIcon.className = "toc-button-icon fas fa-list-ul";
                    buttonIcon.setAttribute("aria-hidden", "true");

                    // Create pulse effect element
                    var buttonPulse = document.createElement("div");
                    buttonPulse.className = "button-pulse";

                    // Assemble floating button
                    floatingButton.appendChild(progressRing);
                    floatingButton.appendChild(buttonIcon);
                    floatingButton.appendChild(buttonPulse);

                    // Create mobile TOC panel
                    var mobilePanel = document.createElement("div");
                    mobilePanel.className = "mobile-toc-panel";
                    mobilePanel.setAttribute("role", "dialog");
                    mobilePanel.setAttribute("aria-modal", "true");
                    mobilePanel.setAttribute(
                        "aria-labelledby",
                        "mobile-toc-title"
                    );

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
                    closeButton.setAttribute(
                        "aria-label",
                        "Close table of contents"
                    );
                    closeButton.innerHTML =
                        '<i class="fas fa-times" aria-hidden="true"></i>';

                    panelHeader.appendChild(panelTitle);
                    panelHeader.appendChild(panelProgress);
                    panelHeader.appendChild(closeButton);

                    // Panel navigation area
                    var panelNavigation = document.createElement("div");
                    panelNavigation.className = "mobile-toc-navigation";

                    var tocList = document.createElement("ul");
                    tocList.className = "mobile-toc-list";

                    // Generate navigation items from headings
                    this.state.headings.forEach(function (heading, index) {
                        var listItem = document.createElement("li");
                        listItem.className =
                            "mobile-toc-item toc-h" + heading.level;

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
                    bottomButton.innerHTML =
                        '<i class="fas fa-arrow-down"></i> Bottom';
                    bottomButton.setAttribute(
                        "aria-label",
                        "Go to bottom of page"
                    );

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
                    this.state.tocElements.mobileProgressCircle =
                        progressCircle;
                    this.state.tocElements.mobilePanelProgress = panelProgress;
                    this.state.tocElements.mobileList = tocList;

                    // Bind event handlers
                    this.bindMobileEvents();

                    // Initialize progress to current scroll position
                    var initialScrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop;
                    var initialDocumentHeight =
                        document.documentElement.scrollHeight -
                        window.innerHeight;
                    var initialScrollProgress =
                        initialDocumentHeight > 0
                            ? initialScrollTop / initialDocumentHeight
                            : 0;
                    this.updateMobileProgress(
                        Math.min(Math.max(initialScrollProgress, 0), 1)
                    );

                    utils.log("Mobile TOC interface created successfully");
                    return true;
                },
                updateMobileProgress: function (progressValue) {
                    var utils = CloudSync.adaptivePages.utils;

                    if (
                        !this.state.tocElements.mobileProgressCircle ||
                        !this.state.tocElements.mobilePanelProgress
                    ) {
                        utils.log(
                            "Mobile progress elements not found",
                            "error"
                        );
                        return;
                    }

                    // Update circular progress indicator
                    var circumference = 150.8; // 2 * π * r (r=24)
                    var offset = circumference - progressValue * circumference;

                    this.state.tocElements.mobileProgressCircle.setAttribute(
                        "stroke-dashoffset",
                        offset
                    );

                    // Update panel progress text
                    var progressPercentage = Math.round(progressValue * 100);
                    this.state.tocElements.mobilePanelProgress.textContent =
                        progressPercentage + "% Complete";

                    // Add visual feedback for completion milestones
                    var button = this.state.tocElements.mobileButton;
                    if (progressPercentage >= 100) {
                        button.classList.add("progress-complete");
                    } else {
                        button.classList.remove("progress-complete");
                    }

                    utils.log(
                        "Mobile progress updated to " + progressPercentage + "%"
                    );
                },
                toggleMobilePanel: function (forceState) {
                    var utils = CloudSync.adaptivePages.utils;

                    if (!this.state.tocElements.mobilePanel) {
                        utils.log(
                            "Mobile panel not found, cannot toggle",
                            "error"
                        );
                        return false;
                    }

                    var panel = this.state.tocElements.mobilePanel;
                    var isCurrentlyOpen =
                        panel.classList.contains("panel-open");
                    var shouldOpen =
                        forceState !== undefined
                            ? forceState
                            : !isCurrentlyOpen;

                    if (shouldOpen && !isCurrentlyOpen) {
                        // Opening panel
                        utils.log("Opening mobile TOC panel");

                        // Show panel immediately for CSS transitions
                        panel.style.display = "block";
                        panel.style.visibility = "visible";
                        panel.style.opacity = "1";

                        // Trigger reflow to ensure display change is applied
                        panel.offsetHeight;

                        // Add opening state classes
                        panel.classList.add("panel-opening", "panel-open");

                        // Prevent body scrolling when panel is open
                        document.body.style.overflow = "hidden";

                        // Focus management for accessibility
                        var closeButton =
                            panel.querySelector(".mobile-toc-close");
                        if (closeButton) {
                            closeButton.focus();
                        }

                        // Track state
                        this.state.mobilePanel = { isOpen: true };

                        // Dispatch custom event for other modules
                        var openEvent = new CustomEvent("mobileTOCOpened", {
                            detail: { panel: panel },
                        });
                        document.dispatchEvent(openEvent);
                    } else if (!shouldOpen && isCurrentlyOpen) {
                        // Closing panel
                        utils.log("Closing mobile TOC panel");

                        // Remove open class to start closing animation
                        panel.classList.remove("panel-open", "panel-opening");

                        // Reset inline styles to let CSS transitions work
                        panel.style.opacity = "";
                        panel.style.visibility = "";

                        // Restore body scrolling
                        document.body.style.overflow = "";

                        // Wait for animation to complete before hiding
                        setTimeout(function () {
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
                            detail: { panel: panel },
                        });
                        document.dispatchEvent(closeEvent);
                    }

                    return shouldOpen;
                },
                bindMobileEvents: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log("Binding mobile TOC event handlers");

                    if (
                        !this.state.tocElements.mobileButton ||
                        !this.state.tocElements.mobilePanel
                    ) {
                        utils.log(
                            "Mobile TOC elements not found, cannot bind events",
                            "error"
                        );
                        return false;
                    }

                    var button = this.state.tocElements.mobileButton;
                    var panel = this.state.tocElements.mobilePanel;

                    /**
                     * Handle mobile TOC button click/tap events
                     * Toggles mobile panel visibility when button is clicked
                     *
                     * @private
                     * @function buttonClickHandler
                     * @param {Event} event - Click event object
                     * @description Prevents default behavior and toggles mobile panel
                     * @since 1.0.0
                     */
                    var buttonClickHandler = function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        self.toggleMobilePanel();
                        utils.log("Mobile TOC button clicked");
                    };

                    /**
                     * Handle keyboard navigation for mobile TOC button
                     * Provides accessibility support for mobile TOC button
                     *
                     * @private
                     * @function buttonKeyHandler
                     * @param {KeyboardEvent} event - Keyboard event object
                     * @description Handles Enter, Space, and Escape key interactions
                     * @since 1.0.0
                     */
                    var buttonKeyHandler = function (event) {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            self.toggleMobilePanel();
                            utils.log(
                                "Mobile TOC button activated via keyboard"
                            );
                        } else if (event.key === "Escape") {
                            self.toggleMobilePanel(false);
                        }
                    };

                    /**
                     * Handle mobile TOC panel close button click
                     * Closes mobile panel when close button is clicked
                     *
                     * @private
                     * @function closeButtonHandler
                     * @param {Event} event - Click event object
                     * @description Prevents default behavior and closes mobile panel
                     * @since 1.0.0
                     */
                    var closeButtonHandler = function (event) {
                        event.preventDefault();
                        self.toggleMobilePanel(false);
                        utils.log("Mobile TOC panel closed via close button");
                    };

                    /**
                     * Handle mobile TOC panel overlay click
                     * Closes panel when user clicks outside panel content area
                     *
                     * @private
                     * @function overlayClickHandler
                     * @param {Event} event - Click event object
                     * @description Implements backdrop click to close functionality
                     * @since 1.0.0
                     */
                    var overlayClickHandler = function (event) {
                        // Close if clicked on overlay or anywhere outside panel content
                        var panelContent = panel.querySelector(
                            ".mobile-toc-content"
                        );
                        var isClickOutsideContent = !panelContent.contains(
                            event.target
                        );
                        var isClickOnOverlay =
                            event.target.classList.contains(
                                "mobile-toc-overlay"
                            );

                        if (isClickOnOverlay || isClickOutsideContent) {
                            self.toggleMobilePanel(false);
                            utils.log(
                                "Mobile TOC panel closed via overlay click"
                            );
                        }
                    };

                    // Document click handler to close panel when clicking outside
                    var documentClickHandler = function (event) {
                        // Check if panel is open
                        if (!panel.classList.contains("panel-open")) {
                            return;
                        }

                        // Don't close if clicking on the floating button
                        if (button.contains(event.target)) {
                            return;
                        }

                        // Don't close if clicking inside panel content
                        var panelContent = panel.querySelector(
                            ".mobile-toc-content"
                        );
                        if (
                            panelContent &&
                            panelContent.contains(event.target)
                        ) {
                            return;
                        }

                        // Close panel for any other click
                        self.toggleMobilePanel(false);
                        utils.log("Mobile TOC panel closed via document click");
                    };

                    // Navigation link click handlers
                    var linkClickHandler = function (event) {
                        event.preventDefault();

                        var targetId = this.getAttribute("href");

                        // Update active state
                        var allLinks =
                            panel.querySelectorAll(".mobile-toc-link");
                        allLinks.forEach(function (link) {
                            link.parentElement.classList.remove(
                                "active-section"
                            );
                        });
                        this.parentElement.classList.add("active-section");

                        // Smooth scroll to target
                        var targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            var headerOffset = 100;

                            // Use getBoundingClientRect for accurate mobile positioning
                            var rect = targetElement.getBoundingClientRect();
                            var currentScrollTop =
                                window.pageYOffset ||
                                document.documentElement.scrollTop;
                            var targetPosition =
                                rect.top + currentScrollTop - headerOffset;

                            window.scrollTo({
                                top: targetPosition,
                                behavior: "smooth",
                            });

                            // Close panel after navigation
                            setTimeout(function () {
                                self.toggleMobilePanel(false);
                            }, 300);

                            utils.log("Navigated to section: " + targetId);
                        }
                    };

                    // Quick action handlers
                    var topButtonHandler = function (event) {
                        event.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        self.toggleMobilePanel(false);
                        utils.log("Navigated to top of page");
                    };

                    var bottomButtonHandler = function (event) {
                        event.preventDefault();
                        var documentHeight = Math.max(
                            document.body.scrollHeight,
                            document.body.offsetHeight,
                            document.documentElement.clientHeight,
                            document.documentElement.scrollHeight,
                            document.documentElement.offsetHeight
                        );
                        window.scrollTo({
                            top: documentHeight,
                            behavior: "smooth",
                        });
                        self.toggleMobilePanel(false);
                        utils.log("Navigated to bottom of page");
                    };

                    // Global keyboard handler for escape key
                    var globalKeyHandler = function (event) {
                        if (
                            event.key === "Escape" &&
                            panel.classList.contains("panel-open")
                        ) {
                            self.toggleMobilePanel(false);
                        }
                    };

                    // Bind all events
                    button.addEventListener("click", buttonClickHandler);
                    button.addEventListener("keydown", buttonKeyHandler);

                    var closeButton = panel.querySelector(".mobile-toc-close");
                    if (closeButton) {
                        closeButton.addEventListener(
                            "click",
                            closeButtonHandler
                        );
                    }

                    var overlay = panel.querySelector(".mobile-toc-overlay");
                    if (overlay) {
                        overlay.addEventListener("click", overlayClickHandler);
                    }

                    var navigationLinks =
                        panel.querySelectorAll(".mobile-toc-link");
                    navigationLinks.forEach(function (link) {
                        link.addEventListener("click", linkClickHandler);
                    });

                    var topButton = panel.querySelector(".quick-action-btn");
                    var bottomButton =
                        panel.querySelectorAll(".quick-action-btn")[1];
                    if (topButton) {
                        topButton.addEventListener("click", topButtonHandler);
                    }
                    if (bottomButton) {
                        bottomButton.addEventListener(
                            "click",
                            bottomButtonHandler
                        );
                    }

                    document.addEventListener("keydown", globalKeyHandler);
                    document.addEventListener("click", documentClickHandler);

                    // Store event handlers for cleanup
                    this.state.mobileEventHandlers = {
                        buttonClick: buttonClickHandler,
                        buttonKey: buttonKeyHandler,
                        closeButton: closeButtonHandler,
                        overlayClick: overlayClickHandler,
                        documentClick: documentClickHandler,
                        linkClick: linkClickHandler,
                        topButton: topButtonHandler,
                        bottomButton: bottomButtonHandler,
                        globalKey: globalKeyHandler,
                    };

                    // Create mobile progress scroll handler
                    var mobileProgressHandler = function () {
                        // Calculate scroll progress
                        var scrollTop =
                            window.pageYOffset ||
                            document.documentElement.scrollTop;
                        var documentHeight =
                            document.documentElement.scrollHeight -
                            window.innerHeight;
                        var scrollProgress =
                            documentHeight > 0 ? scrollTop / documentHeight : 0;

                        // Update mobile progress
                        self.updateMobileProgress(
                            Math.min(Math.max(scrollProgress, 0), 1)
                        );
                    };

                    // Set up scroll handler for mobile progress
                    var throttledMobileScrollHandler = utils.throttle(
                        mobileProgressHandler,
                        16
                    );
                    window.addEventListener(
                        "scroll",
                        throttledMobileScrollHandler,
                        { passive: true }
                    );

                    // Store handler for cleanup
                    if (!this.state.eventHandlers) {
                        this.state.eventHandlers = {};
                    }
                    this.state.mobileScrollHandler =
                        throttledMobileScrollHandler;

                    utils.log("Mobile TOC event handlers bound successfully");
                    return true;
                },
                handleBreakpointChange: function (
                    oldBreakpoint,
                    newBreakpoint
                ) {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "TOC handling breakpoint change: " +
                            oldBreakpoint +
                            " → " +
                            newBreakpoint
                    );

                    // Determine new mode based on breakpoint (tablet is treated as mobile for TOC)
                    var newMode =
                        newBreakpoint === "desktop" ? "desktop" : "mobile";
                    var oldMode = this.state.currentMode;

                    // Only recreate if mode actually changed
                    if (oldMode !== newMode) {
                        utils.log(
                            "TOC mode changing from " +
                                oldMode +
                                " to " +
                                newMode
                        );

                        // Debug: Log all scroll position methods
                        var scrollY = window.scrollY;
                        var pageYOffset = window.pageYOffset;
                        var docElementScrollTop =
                            document.documentElement.scrollTop;
                        var bodyScrollTop = document.body.scrollTop;

                        utils.log(
                            "DEBUG scroll methods: scrollY=" +
                                scrollY +
                                ", pageYOffset=" +
                                pageYOffset +
                                ", docElement.scrollTop=" +
                                docElementScrollTop +
                                ", body.scrollTop=" +
                                bodyScrollTop
                        );

                        // Preserve scroll position during transition - capture early with multiple fallbacks
                        var capturedScroll =
                            scrollY ||
                            pageYOffset ||
                            docElementScrollTop ||
                            bodyScrollTop ||
                            0;

                        // If all methods return 0, use lastKnownScrollPosition as backup
                        this.state.preservedScrollPosition =
                            capturedScroll > 0
                                ? capturedScroll
                                : this.state.lastKnownScrollPosition;

                        utils.log(
                            "Preserving scroll position: " +
                                this.state.preservedScrollPosition +
                                "px" +
                                " (captured=" +
                                capturedScroll +
                                ", backup=" +
                                this.state.lastKnownScrollPosition +
                                ")"
                        );

                        // Clean up existing TOC interface
                        this.cleanup();

                        // Update current mode
                        this.state.currentMode = newMode;

                        // Create new TOC interface for the new mode
                        var interfaceCreated = false;
                        if (newMode === "desktop") {
                            interfaceCreated = this.createDesktopTOC();
                            if (interfaceCreated) {
                                // IMPORTANT: Recalculate heading positions after layout change
                                this.recalculateHeadingPositions();

                                // Setup all desktop TOC functionality in correct order
                                this.setupSmartVisibility();
                                this.setupNavigationHandlers();
                                this.setupCollapseHandlers();
                                this.setupScrollTracking();
                                this.setupProgressTracking();
                                utils.log(
                                    "Desktop TOC fully initialized with all handlers"
                                );
                            }
                        } else if (newMode === "mobile") {
                            interfaceCreated = this.createMobileTOC();
                            // Note: createMobileTOC already calls bindMobileEvents internally
                            // No need to call it again here
                        }

                        if (interfaceCreated) {
                            utils.log(
                                "TOC successfully switched to " +
                                    newMode +
                                    " mode"
                            );

                            // Restore preserved scroll position
                            if (this.state.preservedScrollPosition !== null) {
                                // Use longer delay to ensure mobile layout is fully formed
                                setTimeout(function () {
                                    var targetScroll =
                                        self.state.preservedScrollPosition;

                                    // Check if target position is valid for new layout
                                    var maxScroll =
                                        document.documentElement.scrollHeight -
                                        window.innerHeight;
                                    if (targetScroll > maxScroll) {
                                        targetScroll = maxScroll;
                                        utils.log(
                                            "DEBUG: Adjusted scroll position from " +
                                                self.state
                                                    .preservedScrollPosition +
                                                "px to " +
                                                targetScroll +
                                                "px (max available)"
                                        );
                                    }

                                    window.scrollTo(0, targetScroll);
                                    utils.log(
                                        "Restored scroll position to: " +
                                            targetScroll +
                                            "px"
                                    );
                                    self.state.preservedScrollPosition = null;
                                }, 300); // Increased delay for mobile layout completion
                            }
                        } else {
                            utils.log(
                                "Failed to create " +
                                    newMode +
                                    " TOC interface",
                                "error"
                            );
                        }
                    } else {
                        utils.log(
                            "TOC mode unchanged (" +
                                newMode +
                                "), no action needed"
                        );
                    }
                },
                setupSmartVisibility: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    var self = this;

                    utils.log(
                        "Setting up intelligent TOC visibility management"
                    );

                    // Configuration for smart visibility behavior
                    var visibilityConfig = {
                        scrollThreshold: 0.1, // Show TOC after 10% of content scrolled
                        timeThreshold: 5000, // Minimum time on page (5 seconds)
                        hideOnTop: true, // Hide when user returns to top
                        topThreshold: 0.05, // Consider "top" as first 5% of content
                        // Relaxed thresholds for mode switches
                        modeSwitchTimeThreshold: 2000, // Only 2 seconds for mode switches
                        modeSwitchScrollThreshold: 0.05, // Only 5% scroll for mode switches
                    };

                    // State tracking for user behavior analysis
                    var behaviorState = {
                        pageLoadTime: this.state.pageLoadTime, // Use actual page load time, not current time
                        isVisible: false, // Current TOC visibility state
                        hasBeenVisible: false, // Whether TOC has ever been shown
                        lastScrollPosition: 0, // Previous scroll position for direction detection
                        scrollDirection: "down", // Current scroll direction
                        isModeSwitch:
                            Date.now() - this.state.pageLoadTime > 1000, // Is this a mode switch vs initial load?
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

                    // Perform initial visibility check immediately (important for mode switches)
                    setTimeout(function () {
                        utils.log(
                            "DEBUG: Running initial visibility check after mode switch"
                        );
                        scrollHandler();
                    }, 100);

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
                    var utils = CloudSync.adaptivePages.utils;

                    // Use relaxed thresholds for mode switches, stricter for initial page load
                    var timeThreshold = behaviorState.isModeSwitch
                        ? visibilityConfig.modeSwitchTimeThreshold
                        : visibilityConfig.timeThreshold;
                    var scrollThreshold = behaviorState.isModeSwitch
                        ? visibilityConfig.modeSwitchScrollThreshold
                        : visibilityConfig.scrollThreshold;

                    // Check if user has spent enough time on page to warrant TOC assistance
                    var hasMinimumTimeInvestment = timeOnPage >= timeThreshold;

                    // Check if user has scrolled enough to indicate serious reading intent
                    var hasScrolledSufficientDistance =
                        scrollPercent >= scrollThreshold;

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
                    var result = primaryCondition && !overrideCondition;

                    // Debug logging for visibility decision
                    utils.log(
                        "DEBUG TOC visibility: scrollPercent=" +
                            Math.round(scrollPercent * 100) +
                            "%" +
                            ", timeOnPage=" +
                            Math.round(timeOnPage / 1000) +
                            "s" +
                            ", timeThreshold=" +
                            timeThreshold / 1000 +
                            "s" +
                            ", scrollThreshold=" +
                            Math.round(scrollThreshold * 100) +
                            "%" +
                            ", isModeSwitch=" +
                            behaviorState.isModeSwitch +
                            ", hasMinTime=" +
                            hasMinimumTimeInvestment +
                            ", hasScrolled=" +
                            hasScrolledSufficientDistance +
                            ", shouldShow=" +
                            result
                    );

                    return result;
                },
                updateTOCVisibility: function (shouldBeVisible, behaviorState) {
                    var utils = CloudSync.adaptivePages.utils;

                    // Get reference to the TOC container for state manipulation
                    var tocContainer = this.state.tocElements.desktopContainer;
                    // Silently return if container is not available (e.g., during breakpoint transitions)
                    if (!tocContainer) {
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

                    // Early return if TOC list is not available
                    if (!this.state.tocElements.tocList) {
                        return;
                    }

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

                                utils.log(
                                    "DEBUG: TOC link clicked, target: " +
                                        targetId
                                );

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

                recalculateHeadingPositions: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "Recalculating heading positions after layout change"
                    );

                    // Use requestAnimationFrame to ensure layout is complete
                    var self = this;
                    requestAnimationFrame(function () {
                        for (var i = 0; i < self.state.headings.length; i++) {
                            var heading = self.state.headings[i];
                            var oldPosition = heading.offsetTop;
                            heading.offsetTop = heading.element.offsetTop;

                            utils.log(
                                'Updated heading "' +
                                    heading.text +
                                    '" position: ' +
                                    oldPosition +
                                    "px → " +
                                    heading.offsetTop +
                                    "px"
                            );
                        }
                        utils.log(
                            "Heading positions recalculated successfully"
                        );
                    });
                },

                cleanup: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("Cleaning up TOC module");

                    // Remove desktop TOC elements
                    if (this.state.tocElements.desktopContainer) {
                        var desktopContainer =
                            this.state.tocElements.desktopContainer;
                        if (desktopContainer.parentNode) {
                            desktopContainer.parentNode.removeChild(
                                desktopContainer
                            );
                        }
                        this.state.tocElements.desktopContainer = null;
                        utils.log("Removed desktop TOC container");
                    }

                    // Remove mobile TOC elements
                    if (this.state.tocElements.mobileButton) {
                        var mobileButton = this.state.tocElements.mobileButton;
                        if (mobileButton.parentNode) {
                            mobileButton.parentNode.removeChild(mobileButton);
                        }
                        this.state.tocElements.mobileButton = null;
                        utils.log("Removed mobile TOC button");
                    }

                    if (this.state.tocElements.mobilePanel) {
                        var mobilePanel = this.state.tocElements.mobilePanel;
                        if (mobilePanel.parentNode) {
                            mobilePanel.parentNode.removeChild(mobilePanel);
                        }
                        this.state.tocElements.mobilePanel = null;
                        utils.log("Removed mobile TOC panel");
                    }

                    // Clean up intersection observer
                    if (this.state.observer) {
                        this.state.observer.disconnect();
                        this.state.observer = null;
                        utils.log("Disconnected intersection observer");
                    }

                    // Clean up mobile event handlers
                    if (this.state.mobileScrollHandler) {
                        window.removeEventListener(
                            "scroll",
                            this.state.mobileScrollHandler
                        );
                        this.state.mobileScrollHandler = null;
                        utils.log("Removed mobile scroll handler");
                    }

                    // Clean up stored mobile event handlers
                    if (this.state.mobileEventHandlers) {
                        if (this.state.mobileEventHandlers.globalKey) {
                            document.removeEventListener(
                                "keydown",
                                this.state.mobileEventHandlers.globalKey
                            );
                            utils.log("Removed mobile global key handler");
                        }
                        if (this.state.mobileEventHandlers.documentClick) {
                            document.removeEventListener(
                                "click",
                                this.state.mobileEventHandlers.documentClick
                            );
                            utils.log("Removed mobile document click handler");
                        }
                        this.state.mobileEventHandlers = null;
                    }

                    // Clean up all scroll event handlers to prevent errors
                    if (this.state.eventHandlers) {
                        if (this.state.eventHandlers.scroll) {
                            window.removeEventListener(
                                "scroll",
                                this.state.eventHandlers.scroll
                            );
                            this.state.eventHandlers.scroll = null;
                            utils.log("Removed desktop scroll handler");
                        }
                        if (this.state.eventHandlers.resize) {
                            window.removeEventListener(
                                "resize",
                                this.state.eventHandlers.resize
                            );
                            this.state.eventHandlers.resize = null;
                            utils.log("Removed resize handler");
                        }
                    }

                    // Reset other state elements
                    this.state.tocElements.progressBar = null;
                    this.state.tocElements.tocList = null;
                    this.state.tocElements.mobileProgressCircle = null;
                    this.state.tocElements.mobilePanelProgress = null;
                    this.state.tocElements.mobileList = null;

                    // Reset mobile panel state
                    if (this.state.mobilePanel) {
                        this.state.mobilePanel = null;
                    }

                    // Re-enable body scrolling in case mobile panel was open
                    document.body.style.overflow = "";

                    utils.log("TOC cleanup completed");
                },
            },

            /**
             * Image Lightbox Module
             *
             * Provides enhanced image viewing experience with modal lightbox functionality.
             * This is currently a placeholder implementation that will be expanded based on
             * specific requirements for image display and user interaction patterns.
             *
             * Features to be implemented:
             * - Modal image viewer with overlay
             * - Image zoom and pan functionality
             * - Keyboard navigation (arrow keys, escape)
             * - Touch/swipe support for mobile devices
             * - Gallery mode for multiple images
             * - Responsive image loading and sizing
             *
             * @since 1.0.0
             */
            imageLightbox: {
                /**
                 * Configuration options for lightbox behavior
                 */
                config: {
                    // Selectors for lightbox-enabled images
                    imageSelector:
                        ".entry-content img, .gallery img, .wp-block-image img",

                    // Animation settings
                    animationDuration: 300,
                    fadeInClass: "lightbox-fade-in",
                    fadeOutClass: "lightbox-fade-out",

                    // Lightbox behavior
                    closeOnClickOutside: true,
                    closeOnEscape: true,
                    showNavigation: true,
                    showCounter: true,

                    // Performance settings
                    preloadAdjacent: true,
                    maxZoomLevel: 3,
                },

                /**
                 * Internal state management
                 */
                state: {
                    isInitialized: false,
                    isOpen: false,
                    currentIndex: 0,
                    images: [],

                    // DOM references
                    lightboxContainer: null,
                    imageElement: null,
                    overlayElement: null,

                    // Event handlers for cleanup
                    eventHandlers: {
                        keydown: null,
                        click: [],
                        resize: null,
                    },
                },

                /**
                 * Initialize the lightbox module
                 *
                 * Sets up event listeners and prepares DOM structure for lightbox functionality.
                 * Creates the lightbox HTML structure and binds all necessary events.
                 *
                 * @returns {boolean} Success status of initialization
                 */
                init: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("🖼️ Starting ImageLightbox initialization...");
                    utils.log(
                        "🔍 Looking for images with selector: " +
                            this.config.imageSelector
                    );

                    if (this.state.isInitialized) {
                        utils.log("ImageLightbox already initialized");
                        return true;
                    }

                    try {
                        // Find lightbox-enabled images
                        var images = document.querySelectorAll(
                            this.config.imageSelector
                        );

                        utils.log(
                            "📊 Found " +
                                images.length +
                                " images matching selector"
                        );

                        if (images.length === 0) {
                            utils.log(
                                "No lightbox-enabled images found on page"
                            );
                            return false;
                        }

                        // Create lightbox HTML structure
                        this.createLightboxHTML();

                        // Store image references
                        this.state.images = Array.from(images);

                        // Bind events
                        this.bindEvents();

                        // Add creative UX enhancements
                        this.addTouchSupport();
                        this.addZoomSupport();

                        utils.log(
                            "ImageLightbox module initialized successfully",
                            "info"
                        );
                        utils.log(
                            "Found " +
                                images.length +
                                " lightbox-enabled images"
                        );
                        utils.log("Touch/swipe and zoom features enabled");

                        this.state.isInitialized = true;
                        return true;
                    } catch (error) {
                        utils.log(
                            "ImageLightbox initialization failed",
                            "error",
                            error
                        );
                        return false;
                    }
                },

                /**
                 * Create the lightbox HTML structure and inject it into the DOM
                 */
                createLightboxHTML: function () {
                    // Create main lightbox container
                    var lightbox = document.createElement("div");
                    lightbox.id = "cloudsync-lightbox";
                    lightbox.className = "cloudsync-lightbox";
                    lightbox.setAttribute("role", "dialog");
                    lightbox.setAttribute("aria-modal", "true");
                    lightbox.setAttribute("aria-hidden", "true");
                    lightbox.setAttribute("aria-labelledby", "lightbox-title");

                    lightbox.innerHTML =
                        '<div class="lightbox-overlay" role="presentation"></div>' +
                        '<div class="lightbox-container">' +
                        '<button class="lightbox-close" type="button" aria-label="Close lightbox">' +
                        '<i class="fas fa-times" aria-hidden="true"></i>' +
                        "</button>" +
                        '<div class="lightbox-counter" aria-live="polite">' +
                        '<span class="current">1</span> / <span class="total">1</span>' +
                        "</div>" +
                        '<div class="lightbox-image-wrapper">' +
                        '<div class="lightbox-loading">' +
                        '<div class="lightbox-spinner" role="status" aria-label="Loading image"></div>' +
                        "</div>" +
                        '<img class="lightbox-image" alt="" role="img" />' +
                        "</div>" +
                        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">' +
                        '<i class="fas fa-chevron-left" aria-hidden="true"></i>' +
                        "</button>" +
                        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">' +
                        '<i class="fas fa-chevron-right" aria-hidden="true"></i>' +
                        "</button>" +
                        '<div class="lightbox-info" id="lightbox-title">' +
                        '<div class="lightbox-title"></div>' +
                        '<div class="lightbox-meta"></div>' +
                        "</div>" +
                        "</div>";

                    // Inject into body
                    document.body.appendChild(lightbox);

                    // Store DOM references
                    this.state.lightboxContainer = lightbox;
                    this.state.imageElement =
                        lightbox.querySelector(".lightbox-image");
                    this.state.overlayElement =
                        lightbox.querySelector(".lightbox-overlay");
                },

                /**
                 * Bind all event listeners for lightbox functionality
                 */
                bindEvents: function () {
                    var self = this;
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log(
                        "🔗 Binding click events to " +
                            this.state.images.length +
                            " images"
                    );

                    // Image click events
                    this.state.images.forEach(function (image, index) {
                        var handler = function (e) {
                            utils.log(
                                "🖱️ Image click detected! Index: " +
                                    index +
                                    ", Image src: " +
                                    image.src
                            );
                            e.preventDefault();
                            self.open(index);
                        };

                        utils.log(
                            "📎 Adding click handler to image " +
                                (index + 1) +
                                ": " +
                                (image.src || "no src")
                        );

                        image.addEventListener("click", handler);
                        image.style.cursor = "zoom-in";

                        // Store handler reference for cleanup
                        self.state.eventHandlers.click.push({
                            element: image,
                            handler: handler,
                        });

                        utils.log(
                            "✅ Click handler successfully added to image " +
                                (index + 1)
                        );
                    });

                    utils.log(
                        "🎯 Total click handlers bound: " +
                            this.state.eventHandlers.click.length
                    );

                    // Close button
                    var closeBtn =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-close"
                        );
                    closeBtn.addEventListener("click", function () {
                        self.close();
                    });

                    // Navigation buttons
                    var prevBtn =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-prev"
                        );
                    var nextBtn =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-next"
                        );

                    prevBtn.addEventListener("click", function () {
                        self.previous();
                    });

                    nextBtn.addEventListener("click", function () {
                        self.next();
                    });

                    // Overlay click to close
                    this.state.overlayElement.addEventListener(
                        "click",
                        function () {
                            if (self.config.closeOnClickOutside) {
                                self.close();
                            }
                        }
                    );

                    // Keyboard events
                    var keyHandler = function (e) {
                        if (!self.state.isOpen) return;

                        switch (e.key) {
                            case "Escape":
                                if (self.config.closeOnEscape) {
                                    self.close();
                                }
                                break;
                            case "ArrowLeft":
                                e.preventDefault();
                                self.previous();
                                break;
                            case "ArrowRight":
                                e.preventDefault();
                                self.next();
                                break;
                            case " ":
                                e.preventDefault();
                                self.next();
                                break;
                        }
                    };

                    document.addEventListener("keydown", keyHandler);
                    this.state.eventHandlers.keydown = keyHandler;

                    // Resize handler for responsive updates
                    var resizeHandler = utils.throttle(function () {
                        if (self.state.isOpen) {
                            self.updateLayout();
                        }
                    }, 250);

                    window.addEventListener("resize", resizeHandler);
                    this.state.eventHandlers.resize = resizeHandler;
                },

                /**
                 * Open lightbox for specified image
                 *
                 * @param {number} index - Index of image to display
                 * @returns {boolean} Success status
                 */
                open: function (index) {
                    var utils = CloudSync.adaptivePages.utils;
                    utils.log("🚀 Opening lightbox for image index: " + index);

                    if (!this.state.isInitialized || this.state.isOpen) {
                        utils.log(
                            "❌ Lightbox open failed - not initialized or already open"
                        );
                        return false;
                    }

                    if (index < 0 || index >= this.state.images.length) {
                        utils.log("Invalid image index: " + index, "error");
                        return false;
                    }

                    try {
                        this.state.currentIndex = index;
                        this.state.isOpen = true;

                        // Prevent body scrolling
                        document.body.style.overflow = "hidden";

                        // Show lightbox
                        this.state.lightboxContainer.classList.add(
                            "lightbox-open"
                        );
                        this.state.lightboxContainer.setAttribute(
                            "aria-hidden",
                            "false"
                        );

                        // Show current image
                        this.showImage(index);

                        // Update counter and navigation
                        this.updateCounter();
                        this.updateNavigation();

                        // Focus management
                        var closeBtn =
                            this.state.lightboxContainer.querySelector(
                                ".lightbox-close"
                            );
                        if (closeBtn) {
                            closeBtn.focus();
                        }

                        utils.log("Lightbox opened for image " + (index + 1));
                        return true;
                    } catch (error) {
                        utils.log("Failed to open lightbox", "error", error);
                        return false;
                    }
                },

                /**
                 * Close the lightbox
                 *
                 * @returns {boolean} Success status
                 */
                close: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    if (!this.state.isOpen) {
                        return false;
                    }

                    try {
                        this.state.isOpen = false;

                        // Hide lightbox
                        this.state.lightboxContainer.classList.remove(
                            "lightbox-open"
                        );
                        this.state.lightboxContainer.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        // Restore body scrolling
                        document.body.style.overflow = "";

                        // Clear image
                        this.state.imageElement.src = "";
                        this.state.imageElement.alt = "";
                        this.state.imageElement.classList.remove("loaded");

                        // Hide info panel
                        var infoPanel =
                            this.state.lightboxContainer.querySelector(
                                ".lightbox-info"
                            );
                        if (infoPanel) {
                            infoPanel.classList.remove("visible");
                        }

                        utils.log("Lightbox closed");
                        return true;
                    } catch (error) {
                        utils.log("Failed to close lightbox", "error", error);
                        return false;
                    }
                },

                /**
                 * Navigate to next image in gallery
                 *
                 * @returns {boolean} Success status
                 */
                next: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    if (!this.state.isOpen || this.state.images.length <= 1) {
                        return false;
                    }

                    var nextIndex =
                        (this.state.currentIndex + 1) %
                        this.state.images.length;
                    this.showImage(nextIndex);
                    this.state.currentIndex = nextIndex;
                    this.updateCounter();
                    this.updateNavigation();

                    utils.log("Navigated to next image: " + (nextIndex + 1));
                    return true;
                },

                /**
                 * Navigate to previous image in gallery
                 *
                 * @returns {boolean} Success status
                 */
                previous: function () {
                    var utils = CloudSync.adaptivePages.utils;
                    if (!this.state.isOpen || this.state.images.length <= 1) {
                        return false;
                    }

                    var prevIndex = this.state.currentIndex - 1;
                    if (prevIndex < 0) {
                        prevIndex = this.state.images.length - 1;
                    }

                    this.showImage(prevIndex);
                    this.state.currentIndex = prevIndex;
                    this.updateCounter();
                    this.updateNavigation();

                    utils.log(
                        "Navigated to previous image: " + (prevIndex + 1)
                    );
                    return true;
                },

                /**
                 * Show specific image in the lightbox
                 *
                 * @param {number} index - Image index to show
                 */
                showImage: function (index) {
                    var utils = CloudSync.adaptivePages.utils;
                    if (index < 0 || index >= this.state.images.length) {
                        return;
                    }

                    var targetImage = this.state.images[index];
                    var lightboxImage = this.state.imageElement;
                    var loadingSpinner =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-loading"
                        );
                    var infoPanel =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-info"
                        );

                    // Show loading spinner
                    if (loadingSpinner) {
                        loadingSpinner.classList.remove("hidden");
                    }

                    // Hide previous image
                    lightboxImage.classList.remove("loaded");

                    // Preload new image
                    var img = new Image();
                    img.onload = function () {
                        // Set image source and attributes
                        lightboxImage.src = targetImage.src;
                        lightboxImage.alt = targetImage.alt || "";
                        lightboxImage.classList.add("loaded");

                        // Hide loading spinner
                        if (loadingSpinner) {
                            loadingSpinner.classList.add("hidden");
                        }

                        // Update info panel
                        var titleElement =
                            infoPanel.querySelector(".lightbox-title");
                        var metaElement =
                            infoPanel.querySelector(".lightbox-meta");

                        if (titleElement && metaElement) {
                            var title =
                                targetImage.getAttribute("data-title") ||
                                targetImage.title ||
                                targetImage.alt ||
                                "Image " + (index + 1);

                            var meta = "";
                            if (
                                targetImage.naturalWidth &&
                                targetImage.naturalHeight
                            ) {
                                meta =
                                    targetImage.naturalWidth +
                                    " × " +
                                    targetImage.naturalHeight;
                            }

                            titleElement.textContent = title;
                            metaElement.textContent = meta;

                            // Show info panel with delay
                            setTimeout(function () {
                                if (infoPanel) {
                                    infoPanel.classList.add("visible");
                                }
                            }, 300);
                        }
                    };

                    img.onerror = function () {
                        utils.log(
                            "Failed to load image: " + targetImage.src,
                            "error"
                        );
                        if (loadingSpinner) {
                            loadingSpinner.classList.add("hidden");
                        }
                    };

                    img.src = targetImage.src;

                    // Preload adjacent images for better UX
                    if (this.config.preloadAdjacent) {
                        this.preloadAdjacentImages(index);
                    }
                },

                /**
                 * Preload adjacent images for smoother navigation
                 *
                 * @param {number} currentIndex - Current image index
                 */
                preloadAdjacentImages: function (currentIndex) {
                    var imagesToPreload = [];

                    // Previous image
                    var prevIndex = currentIndex - 1;
                    if (prevIndex < 0) {
                        prevIndex = this.state.images.length - 1;
                    }
                    if (prevIndex !== currentIndex) {
                        imagesToPreload.push(prevIndex);
                    }

                    // Next image
                    var nextIndex =
                        (currentIndex + 1) % this.state.images.length;
                    if (nextIndex !== currentIndex) {
                        imagesToPreload.push(nextIndex);
                    }

                    // Preload images
                    var self = this;
                    imagesToPreload.forEach(function (index) {
                        if (index >= 0 && index < self.state.images.length) {
                            self.preloadImage(self.state.images[index].src);
                        }
                    });
                },

                /**
                 * Preload a single image
                 *
                 * @param {string} src - Image source URL
                 */
                preloadImage: function (src) {
                    var img = new Image();
                    img.src = src;
                },

                /**
                 * Update the counter display
                 */
                updateCounter: function () {
                    var counter =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-counter"
                        );
                    if (counter && this.state.images.length > 1) {
                        var current = counter.querySelector(".current");
                        var total = counter.querySelector(".total");

                        if (current && total) {
                            current.textContent = this.state.currentIndex + 1;
                            total.textContent = this.state.images.length;
                        }

                        counter.style.display = "block";
                    } else if (counter) {
                        counter.style.display = "none";
                    }
                },

                /**
                 * Update navigation buttons state
                 */
                updateNavigation: function () {
                    var prevBtn =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-prev"
                        );
                    var nextBtn =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-next"
                        );

                    if (this.state.images.length <= 1) {
                        if (prevBtn) prevBtn.style.display = "none";
                        if (nextBtn) nextBtn.style.display = "none";
                    } else {
                        if (prevBtn) prevBtn.style.display = "flex";
                        if (nextBtn) nextBtn.style.display = "flex";
                    }
                },

                /**
                 * Update layout for responsive changes
                 */
                updateLayout: function () {
                    // Handle responsive layout updates if needed
                    // This method can be expanded for advanced responsive features
                    utils.log("Lightbox layout updated for viewport change");
                },

                /**
                 * Clean up lightbox resources and event listeners
                 */
                cleanup: function () {
                    if (!this.state.isInitialized) {
                        return;
                    }

                    try {
                        // Close lightbox if open
                        if (this.state.isOpen) {
                            this.close();
                        }

                        // Remove event listeners
                        if (this.state.eventHandlers.keydown) {
                            document.removeEventListener(
                                "keydown",
                                this.state.eventHandlers.keydown
                            );
                        }

                        if (this.state.eventHandlers.resize) {
                            window.removeEventListener(
                                "resize",
                                this.state.eventHandlers.resize
                            );
                        }

                        // Clean up image event listeners
                        this.state.eventHandlers.click.forEach(function (
                            handlerInfo
                        ) {
                            handlerInfo.element.removeEventListener(
                                "click",
                                handlerInfo.handler
                            );
                            handlerInfo.element.style.cursor = "";
                        });
                        this.state.eventHandlers.click = [];

                        // Remove DOM elements
                        if (
                            this.state.lightboxContainer &&
                            this.state.lightboxContainer.parentNode
                        ) {
                            this.state.lightboxContainer.parentNode.removeChild(
                                this.state.lightboxContainer
                            );
                        }

                        // Reset state
                        this.state.isInitialized = false;
                        this.state.isOpen = false;
                        this.state.currentIndex = 0;
                        this.state.images = [];
                        this.state.lightboxContainer = null;
                        this.state.imageElement = null;
                        this.state.overlayElement = null;
                        this.state.eventHandlers = {
                            keydown: null,
                            click: null,
                            resize: null,
                        };

                        utils.log(
                            "ImageLightbox cleanup completed successfully"
                        );
                    } catch (error) {
                        utils.log(
                            "ImageLightbox cleanup encountered errors",
                            "error",
                            error
                        );
                    }
                },

                /**
                 * Add touch/swipe support for mobile navigation
                 * This is a bonus UX feature for mobile devices
                 */
                addTouchSupport: function () {
                    if (!this.state.lightboxContainer) {
                        return;
                    }

                    var self = this;
                    var startX = 0;
                    var startY = 0;
                    var distX = 0;
                    var distY = 0;
                    var threshold = 50; // minimum distance for swipe
                    var restraint = 100; // maximum perpendicular distance
                    var allowedTime = 300; // maximum time allowed to travel that distance
                    var startTime = 0;

                    var imageWrapper =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-image-wrapper"
                        );
                    if (!imageWrapper) return;

                    // Touch start
                    imageWrapper.addEventListener(
                        "touchstart",
                        function (e) {
                            if (!self.state.isOpen) return;

                            var touchObj = e.changedTouches[0];
                            startX = touchObj.pageX;
                            startY = touchObj.pageY;
                            startTime = new Date().getTime();
                            e.preventDefault();
                        },
                        { passive: false }
                    );

                    // Touch move - provide visual feedback
                    imageWrapper.addEventListener(
                        "touchmove",
                        function (e) {
                            if (!self.state.isOpen) return;

                            var touchObj = e.changedTouches[0];
                            distX = touchObj.pageX - startX;
                            distY = touchObj.pageY - startY;

                            // Visual feedback for swipe
                            if (Math.abs(distX) > 20) {
                                imageWrapper.classList.add("swiping");
                                imageWrapper.style.transform =
                                    "translateX(" + distX * 0.3 + "px)";
                            }

                            e.preventDefault();
                        },
                        { passive: false }
                    );

                    // Touch end
                    imageWrapper.addEventListener(
                        "touchend",
                        function (e) {
                            if (!self.state.isOpen) return;

                            var elapsedTime = new Date().getTime() - startTime;

                            // Reset visual feedback
                            imageWrapper.classList.remove("swiping");
                            imageWrapper.style.transform = "";

                            // Check if swipe meets criteria
                            if (elapsedTime <= allowedTime) {
                                if (
                                    Math.abs(distX) >= threshold &&
                                    Math.abs(distY) <= restraint
                                ) {
                                    if (distX > 0) {
                                        // Swipe right - previous image
                                        self.previous();
                                    } else {
                                        // Swipe left - next image
                                        self.next();
                                    }
                                } else if (
                                    Math.abs(distY) >= threshold &&
                                    Math.abs(distX) <= restraint
                                ) {
                                    if (distY > 0) {
                                        // Swipe down - close lightbox
                                        self.close();
                                    }
                                }
                            }

                            e.preventDefault();
                        },
                        { passive: false }
                    );
                },

                /**
                 * Add zoom functionality with mouse wheel and touch pinch
                 * This is a creative UX enhancement
                 */
                addZoomSupport: function () {
                    if (!this.state.imageElement) {
                        return;
                    }

                    var self = this;
                    var currentZoom = 1;
                    var maxZoom = this.config.maxZoomLevel || 3;
                    var minZoom = 1;
                    var zoomIndicator =
                        this.state.lightboxContainer.querySelector(
                            ".lightbox-zoom-indicator"
                        );

                    // Create zoom indicator if it doesn't exist
                    if (!zoomIndicator) {
                        zoomIndicator = document.createElement("div");
                        zoomIndicator.className = "lightbox-zoom-indicator";
                        zoomIndicator.textContent = "100%";
                        this.state.lightboxContainer.appendChild(zoomIndicator);
                    }

                    // Mouse wheel zoom
                    this.state.imageElement.addEventListener(
                        "wheel",
                        function (e) {
                            if (!self.state.isOpen) return;

                            e.preventDefault();

                            var delta = e.deltaY > 0 ? -0.1 : 0.1;
                            currentZoom = Math.max(
                                minZoom,
                                Math.min(maxZoom, currentZoom + delta)
                            );

                            self.state.imageElement.style.transform =
                                "scale(" + currentZoom + ")";

                            // Update cursor
                            if (currentZoom > 1) {
                                self.state.imageElement.classList.add("zoomed");
                            } else {
                                self.state.imageElement.classList.remove(
                                    "zoomed"
                                );
                            }

                            // Show zoom indicator
                            zoomIndicator.textContent =
                                Math.round(currentZoom * 100) + "%";
                            zoomIndicator.classList.add("visible");

                            // Hide zoom indicator after delay
                            clearTimeout(self.zoomIndicatorTimeout);
                            self.zoomIndicatorTimeout = setTimeout(function () {
                                zoomIndicator.classList.remove("visible");
                            }, 1000);
                        },
                        { passive: false }
                    );

                    // Click to zoom toggle
                    this.state.imageElement.addEventListener(
                        "click",
                        function (e) {
                            if (!self.state.isOpen) return;

                            e.stopPropagation();

                            if (currentZoom > 1) {
                                // Reset zoom
                                currentZoom = 1;
                                self.state.imageElement.style.transform =
                                    "scale(1)";
                                self.state.imageElement.classList.remove(
                                    "zoomed"
                                );
                            } else {
                                // Zoom in
                                currentZoom = 2;
                                self.state.imageElement.style.transform =
                                    "scale(2)";
                                self.state.imageElement.classList.add("zoomed");
                            }

                            // Update zoom indicator
                            zoomIndicator.textContent =
                                Math.round(currentZoom * 100) + "%";
                            zoomIndicator.classList.add("visible");

                            clearTimeout(self.zoomIndicatorTimeout);
                            self.zoomIndicatorTimeout = setTimeout(function () {
                                zoomIndicator.classList.remove("visible");
                            }, 1000);
                        }
                    );

                    // Reset zoom when changing images
                    var originalShowImage = this.showImage;
                    this.showImage = function (index) {
                        currentZoom = 1;
                        self.state.imageElement.style.transform = "scale(1)";
                        self.state.imageElement.classList.remove("zoomed");
                        zoomIndicator.classList.remove("visible");

                        originalShowImage.call(self, index);
                    };
                },

                /**
                 * Test function for debugging lightbox functionality
                 * Call from browser console: CloudSync.adaptivePages.modules.imageLightbox.testLightbox()
                 */
                testLightbox: function () {
                    var utils = CloudSync.adaptivePages.utils;

                    utils.log("🧪 LIGHTBOX DIAGNOSTIC TEST");
                    utils.log("========================");
                    utils.log(
                        "Module initialized: " + this.state.isInitialized
                    );
                    utils.log("Lightbox is open: " + this.state.isOpen);
                    utils.log("Image selector: " + this.config.imageSelector);

                    var foundImages = document.querySelectorAll(
                        this.config.imageSelector
                    );
                    utils.log(
                        "Images found with selector: " + foundImages.length
                    );

                    if (foundImages.length > 0) {
                        utils.log(
                            "First image src: " +
                                (foundImages[0].src || "no src")
                        );
                        utils.log(
                            "First image classes: " + foundImages[0].className
                        );
                        utils.log(
                            "First image parent: " +
                                foundImages[0].parentElement.tagName
                        );
                    }

                    utils.log(
                        "Stored images in state: " + this.state.images.length
                    );
                    utils.log(
                        "Event handlers bound: " +
                            this.state.eventHandlers.click.length
                    );

                    if (foundImages.length > 0 && this.state.isInitialized) {
                        utils.log(
                            "🚀 Testing manual lightbox open for first image..."
                        );
                        this.open(0);
                    }

                    return {
                        initialized: this.state.isInitialized,
                        imagesFound: foundImages.length,
                        imagesStored: this.state.images.length,
                        handlersbound: this.state.eventHandlers.click.length,
                    };
                },
            },
        },

        /**
         * =====================================================
         * SECTION 4: UTILITY FUNCTIONS
         * =====================================================
         *
         * Core utilities that provide shared functionality across
         * all modules. Think of this as the "standard library"
         * for our adaptive pages system including logging,
         * DOM manipulation, throttling, and helper functions.
         */

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
         * =====================================================
         * SECTION 5: SYSTEM INITIALIZATION & COORDINATION
         * =====================================================
         *
         * Main initialization coordinator and system orchestration
         * functions. Handles module initialization, page analysis,
         * breakpoint detection, and global event management.
         */

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

            // Create wrapper that saves scroll position BEFORE debounced handler
            var resizeWrapper = function () {
                // Save current scroll position immediately on ANY resize event
                // This captures scroll position before any layout changes occur
                var currentScroll =
                    window.scrollY ||
                    window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0;

                // Store in TOC module if it exists and is active
                if (
                    self.state.activeModules.indexOf("tableOfContents") !==
                        -1 &&
                    self.modules.tableOfContents &&
                    self.modules.tableOfContents.state
                ) {
                    self.modules.tableOfContents.state.lastKnownScrollPosition =
                        currentScroll;
                    self.utils.log(
                        "DEBUG: Saved scroll position on resize: " +
                            currentScroll +
                            "px"
                    );
                }

                // Call the debounced handler
                resizeHandler();
            };

            this.utils.addEventListener(window, "resize", resizeWrapper, {
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
         * =====================================================
         * SECTION 6: DEVELOPMENT & TESTING
         * =====================================================
         *
         * Debug functions, testing utilities, and development
         * helpers for system monitoring, troubleshooting,
         * and quality assurance. Should be removed or
         * disabled in production builds.
         */

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
         * Temporary testing function for TOC module development
         * Provides comprehensive testing and debugging for table of contents functionality
         *
         * @function testTOCModule
         * @memberof CloudSync.adaptivePages
         * @returns {boolean} True if initialization successful, false otherwise
         * @since 1.0.0
         * @todo Remove in production builds
         */
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

        /**
         * =====================================================
         * PERFORMANCE: LAZY LOADING MODULE
         * =====================================================
         */
        lazyLoading: {
            init: function() {
                this.setupIntersectionObserver();
                this.loadCriticalImages();
                utils.log('Lazy loading initialized');
            },

            setupIntersectionObserver: function() {
                // Check for IntersectionObserver support
                if (!('IntersectionObserver' in window)) {
                    this.fallbackLoading();
                    return;
                }

                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                // Observe all lazy images
                document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
                    imageObserver.observe(img);
                });
            },

            loadImage: function(img) {
                if (img.dataset.src) {
                    // Show loading placeholder
                    img.style.filter = 'blur(5px)';
                    img.style.transition = 'filter 0.3s ease';
                    
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.style.filter = 'none';
                        img.classList.add('loaded');
                    };
                    img.onerror = () => {
                        img.classList.add('error');
                        utils.log('Failed to load image: ' + img.dataset.src);
                    };
                    
                    delete img.dataset.src;
                }
            },

            loadCriticalImages: function() {
                // Immediately load above-the-fold images
                const heroImages = document.querySelectorAll('.hero-section img, .header img');
                heroImages.forEach(img => {
                    if (img.dataset.src) {
                        this.loadImage(img);
                    }
                });
            },

            fallbackLoading: function() {
                // Fallback for browsers without IntersectionObserver
                document.querySelectorAll('img[data-src]').forEach(img => {
                    this.loadImage(img);
                });
            }
        },

        /**
         * =====================================================
         * PERFORMANCE: RESOURCE OPTIMIZATION
         * =====================================================
         */
        performance: {
            init: function() {
                this.optimizeScripts();
                this.setupResourceHints();
                this.monitorPerformance();
                utils.log('Performance optimizations initialized');
            },

            optimizeScripts: function() {
                // Defer non-critical scripts
                const scripts = document.querySelectorAll('script[data-defer]');
                scripts.forEach(script => {
                    if (script.src) {
                        const newScript = document.createElement('script');
                        newScript.src = script.src;
                        newScript.defer = true;
                        document.head.appendChild(newScript);
                        script.remove();
                    }
                });
            },

            setupResourceHints: function() {
                // Add dns-prefetch for external resources
                const prefetchDomains = [
                    'fonts.googleapis.com',
                    'fonts.gstatic.com',
                    'cdnjs.cloudflare.com'
                ];

                prefetchDomains.forEach(domain => {
                    if (!document.querySelector(`link[href*="${domain}"]`)) {
                        const link = document.createElement('link');
                        link.rel = 'dns-prefetch';
                        link.href = `//${domain}`;
                        document.head.appendChild(link);
                    }
                });
            },

            monitorPerformance: function() {
                // Monitor Core Web Vitals
                if ('performance' in window && 'PerformanceObserver' in window) {
                    try {
                        const observer = new PerformanceObserver((list) => {
                            for (const entry of list.getEntries()) {
                                if (entry.entryType === 'largest-contentful-paint') {
                                    utils.log('LCP: ' + entry.startTime + 'ms');
                                }
                                if (entry.entryType === 'first-input') {
                                    utils.log('FID: ' + entry.processingStart - entry.startTime + 'ms');
                                }
                                if (entry.entryType === 'layout-shift') {
                                    utils.log('CLS: ' + entry.value);
                                }
                            }
                        });

                        observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
                    } catch (e) {
                        utils.log('Performance monitoring not supported');
                    }
                }
            }
        }
    };

    // Временно делаем CloudSync глобальным для отладки
    // Удалить в продакшене
    if (typeof window !== "undefined") {
        window.CloudSync = CloudSync;
    }
})();
