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
            this.initAdaptivePages();
            this.smartHeader.init();
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
         * Handles hamburger menu toggle, accessibility, and scroll lock
         */
        mobileMenu: function () {
            var menuToggle = document.querySelector(".menu-toggle");
            var navigation = document.querySelector(".main-navigation ul");

            if (!menuToggle || !navigation) return;

            /**
             * Lock page scroll when mobile menu is open
             * Prevents background content from scrolling on mobile devices
             */
            var lockScroll = function () {
                document.body.style.overflow = "hidden";
            };

            /**
             * Unlock page scroll when mobile menu is closed
             * Restores normal scrolling behavior
             */
            var unlockScroll = function () {
                document.body.style.overflow = "";
            };

            /**
             * Close mobile menu and restore scroll
             * Centralizes menu closing logic to ensure consistent behavior
             */
            var closeMenu = function () {
                navigation.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
                unlockScroll(); // Always unlock scroll when closing menu

                var icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            };

            /**
             * Open mobile menu and lock scroll
             * Centralizes menu opening logic
             */
            var openMenu = function () {
                navigation.classList.add("show");
                menuToggle.setAttribute("aria-expanded", "true");
                lockScroll(); // Lock scroll when opening menu

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

                // Only close if menu is currently open
                var isMenuOpen = navigation.classList.contains("show");

                if (!isClickInside && isMenuOpen) {
                    closeMenu();
                }
            });

            // Close menu on window resize to desktop size
            // This prevents issues when users rotate devices or resize browser
            window.addEventListener("resize", function () {
                var isMenuOpen = navigation.classList.contains("show");

                // Close menu if screen becomes desktop size
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
         * Initialize adaptive page functionality for intelligent content presentation
         * This system automatically enhances pages based on their content characteristics
         * without requiring manual configuration from users
         */
        initAdaptivePages: function () {
            // Only run on actual pages, not posts or archives
            if (!document.body.classList.contains("page")) return;

            this.initTableOfContents();
            this.setupReadingProgress();
            this.setupLegalPageNavigation();
            this.setupImageLightbox();
        },

        /**
         * Automatically generate table of contents for long-form content
         * Creates navigation based on page headings for improved user experience
         * and accessibility compliance
         */
        /**
         * Advanced Table of Contents with progressive enhancement
         * Creates an intelligent, adaptive navigation system for long-form content
         */
        initTableOfContents: function () {
            // Сначала проверяем, подходит ли страница для отображения TOC
            var contentContainer = document.querySelector(
                ".entry-content, .page-content"
            );
            if (!contentContainer) {
                return; // Выходим если нет основного контента
            }

            // Собираем все заголовки от H1 до H6 для максимальной гибкости
            var headings = contentContainer.querySelectorAll(
                "h1, h2, h3, h4, h5, h6"
            );

            // Применяем интеллектуальную логику: нужно минимум 3 заголовка
            // Это предотвращает появление TOC на коротких страницах
            if (headings.length < 3) {
                return;
            }

            // Проверяем размер экрана - на мобильных устройствах TOC работает по-другому
            if (window.innerWidth < 1200) {
                this.createMobileTOC(headings, contentContainer);
            } else {
                this.createDesktopTOC(headings);
            }

            // Добавляем обработчик изменения размера окна для динамической адаптации
            this.handleTOCResize(headings, contentContainer);
        },

        /**
         * Creates desktop floating TOC with advanced features
         * Uses modern CSS features like backdrop-filter and smooth animations
         */
        createDesktopTOC: function (headings) {
            // Создаем основную структуру TOC с семантической разметкой
            var tocContainer = document.createElement("div");
            tocContainer.className = "advanced-toc";
            tocContainer.setAttribute("role", "navigation");
            tocContainer.setAttribute("aria-label", "Table of Contents");

            // Используем template literal для чистого и читаемого HTML
            tocContainer.innerHTML = `
        <div class="toc-header">
            <div class="toc-title">
                <i class="fas fa-list-ul" aria-hidden="true"></i>
                <span>Contents</span>
            </div>
            <div class="toc-controls">
                <button class="toc-collapse" aria-label="Collapse table of contents" title="Collapse">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
        </div>
        <div class="toc-progress">
            <div class="toc-progress-bar"></div>
        </div>
        <nav class="toc-navigation">
            <ul class="toc-list" role="list"></ul>
        </nav>
    `;

            // Генерируем навигационные элементы с умной обработкой иерархии
            this.generateTOCItems(
                headings,
                tocContainer.querySelector(".toc-list")
            );

            // Добавляем в DOM и запускаем все интерактивные функции
            document.body.appendChild(tocContainer);

            // Запускаем все подсистемы TOC
            this.initTOCCollapse(tocContainer);
            this.initTOCSmoothScroll(tocContainer);
            this.initTOCProgressTracking(tocContainer, headings);

            // Анимированное появление через небольшую задержку для лучшего UX
            setTimeout(function () {
                tocContainer.classList.add("visible");
            }, 800);
        },

        /**
         * Creates mobile-optimized TOC that appears within content
         * Follows mobile-first principles for optimal user experience
         */
        createMobileTOC: function (headings, contentContainer) {
            var mobileTOC = document.createElement("div");
            mobileTOC.className = "mobile-toc";
            mobileTOC.setAttribute("role", "navigation");
            mobileTOC.setAttribute("aria-label", "Table of Contents");

            mobileTOC.innerHTML = `
        <div class="mobile-toc-header">
            <h3>
                <i class="fas fa-list-ul"></i>
                Table of Contents
            </h3>
            <button class="mobile-toc-toggle" aria-expanded="false">
                <span>Show</span>
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
        <nav class="mobile-toc-content">
            <ul class="mobile-toc-list"></ul>
        </nav>
    `;

            this.generateTOCItems(
                headings,
                mobileTOC.querySelector(".mobile-toc-list")
            );

            // Вставляем мобильный TOC в начало контента
            contentContainer.insertBefore(
                mobileTOC,
                contentContainer.firstChild
            );

            this.initMobileTOCToggle(mobileTOC);
            this.initTOCSmoothScroll(mobileTOC);
        },

        /**
         * Generates TOC items with intelligent hierarchy detection
         * Creates proper nested structure based on heading levels
         */
        generateTOCItems: function (headings, tocList) {
            var self = this;

            headings.forEach(function (heading, index) {
                // Генерируем уникальный и SEO-friendly ID
                if (!heading.id) {
                    var headingText = heading.textContent.trim();
                    var baseId =
                        "toc-" +
                        headingText
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .substring(0, 40);

                    heading.id = self.ensureUniqueId(baseId);
                }

                // Определяем уровень заголовка для правильного стилирования
                var headingLevel = heading.tagName.toLowerCase();
                var listItem = document.createElement("li");
                listItem.className = "toc-item toc-" + headingLevel;

                var link = document.createElement("a");
                link.href = "#" + heading.id;
                link.className = "toc-link";
                link.textContent = heading.textContent;
                link.setAttribute("data-heading-id", heading.id);

                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
        },

        /**
         * Ensures ID uniqueness across the document
         * Prevents conflicts with existing IDs
         */
        ensureUniqueId: function (baseId) {
            var currentId = baseId;
            var counter = 1;

            while (document.getElementById(currentId)) {
                currentId = baseId + "-" + counter;
                counter++;
            }

            return currentId;
        },

        /**
         * Initializes collapse/expand functionality
         * Provides users control over TOC visibility
         */
        initTOCCollapse: function (tocContainer) {
            var collapseButton = tocContainer.querySelector(".toc-collapse");
            var navigation = tocContainer.querySelector(".toc-navigation");
            var title = tocContainer.querySelector(".toc-title span");

            collapseButton.addEventListener("click", function () {
                var isCollapsed = tocContainer.classList.contains("collapsed");
                var icon = this.querySelector("i");

                if (isCollapsed) {
                    // Разворачиваем TOC
                    tocContainer.classList.remove("collapsed");
                    icon.classList.remove("fa-chevron-right");
                    icon.classList.add("fa-chevron-left");
                    this.setAttribute(
                        "aria-label",
                        "Collapse table of contents"
                    );
                    this.setAttribute("title", "Collapse");
                } else {
                    // Сворачиваем TOC
                    tocContainer.classList.add("collapsed");
                    icon.classList.remove("fa-chevron-left");
                    icon.classList.add("fa-chevron-right");
                    this.setAttribute("aria-label", "Expand table of contents");
                    this.setAttribute("title", "Expand");
                }
            });
        },

        /**
         * Initializes mobile TOC toggle functionality
         * Handles accordion-style behavior on mobile devices
         */
        initMobileTOCToggle: function (mobileTOC) {
            var toggleButton = mobileTOC.querySelector(".mobile-toc-toggle");
            var content = mobileTOC.querySelector(".mobile-toc-content");
            var buttonText = toggleButton.querySelector("span");
            var icon = toggleButton.querySelector("i");

            toggleButton.addEventListener("click", function () {
                var isExpanded = this.getAttribute("aria-expanded") === "true";

                if (isExpanded) {
                    // Скрываем контент
                    content.style.maxHeight = "0";
                    this.setAttribute("aria-expanded", "false");
                    buttonText.textContent = "Show";
                    icon.classList.remove("fa-chevron-up");
                    icon.classList.add("fa-chevron-down");
                } else {
                    // Показываем контент с плавной анимацией
                    content.style.maxHeight = content.scrollHeight + "px";
                    this.setAttribute("aria-expanded", "true");
                    buttonText.textContent = "Hide";
                    icon.classList.remove("fa-chevron-down");
                    icon.classList.add("fa-chevron-up");
                }
            });
        },

        /**
         * Enhanced smooth scrolling with header offset calculation
         * Provides perfect scroll positioning regardless of header height
         */
        initTOCSmoothScroll: function (tocContainer) {
            var tocLinks = tocContainer.querySelectorAll(".toc-link");

            tocLinks.forEach(function (link) {
                link.addEventListener("click", function (e) {
                    e.preventDefault();

                    var targetId = this.getAttribute("href");
                    var targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // Динамически рассчитываем высоту header'а
                        var header = document.querySelector(".site-header");
                        var headerHeight = header
                            ? header.offsetHeight + 20
                            : 100;

                        var targetPosition =
                            targetElement.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth",
                        });

                        // Добавляем временную подсветку целевого заголовка
                        targetElement.classList.add("toc-target-highlight");
                        setTimeout(function () {
                            targetElement.classList.remove(
                                "toc-target-highlight"
                            );
                        }, 2000);
                    }
                });
            });
        },

        /**
         * Advanced progress tracking with smooth transitions
         * Shows reading progress and highlights current section
         */
        initTOCProgressTracking: function (tocContainer, headings) {
            var tocLinks = tocContainer.querySelectorAll(".toc-link");
            var progressBar = tocContainer.querySelector(".toc-progress-bar");
            var headingsData = [];

            // Собираем данные о всех заголовках для эффективного трекинга
            headings.forEach(function (heading, index) {
                var tocLink = tocContainer.querySelector(
                    '[data-heading-id="' + heading.id + '"]'
                );
                if (tocLink) {
                    headingsData.push({
                        element: heading,
                        link: tocLink,
                        top: heading.offsetTop,
                    });
                }
            });

            // Оптимизированная функция обновления активного состояния
            function updateProgress() {
                var scrollTop = window.pageYOffset;
                var docHeight =
                    document.documentElement.scrollHeight - window.innerHeight;
                var scrollPercent = (scrollTop / docHeight) * 100;

                // Обновляем прогресс-бар
                if (progressBar) {
                    progressBar.style.width =
                        Math.min(scrollPercent, 100) + "%";
                }

                // Находим активный заголовок
                var activeHeading = null;
                var offset = 150; // Отступ для лучшего UX

                for (var i = headingsData.length - 1; i >= 0; i--) {
                    if (scrollTop + offset >= headingsData[i].top) {
                        activeHeading = headingsData[i];
                        break;
                    }
                }

                // Обновляем активные состояния
                tocLinks.forEach(function (link) {
                    link.classList.remove("active");
                });

                if (activeHeading) {
                    activeHeading.link.classList.add("active");
                }
            }

            // Используем requestAnimationFrame для плавности и производительности
            var ticking = false;
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateProgress);
                    ticking = true;
                    setTimeout(function () {
                        ticking = false;
                    }, 16); // ~60fps
                }
            }

            window.addEventListener("scroll", requestTick);
            window.addEventListener("resize", function () {
                // Пересчитываем позиции при изменении размера окна
                headingsData.forEach(function (item) {
                    item.top = item.element.offsetTop;
                });
                requestTick();
            });

            // Инициализация
            updateProgress();
        },

        /**
         * Handles responsive behavior on window resize
         * Dynamically switches between desktop and mobile TOC
         */
        handleTOCResize: function (headings, contentContainer) {
            var self = this;
            var resizeTimeout;

            window.addEventListener("resize", function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    var currentWidth = window.innerWidth;
                    var desktopTOC = document.querySelector(".advanced-toc");
                    var mobileTOC = document.querySelector(".mobile-toc");

                    if (currentWidth >= 1200 && !desktopTOC && mobileTOC) {
                        // Переключаемся на desktop версию
                        mobileTOC.remove();
                        self.createDesktopTOC(headings);
                    } else if (
                        currentWidth < 1200 &&
                        desktopTOC &&
                        !mobileTOC
                    ) {
                        // Переключаемся на mobile версию
                        desktopTOC.remove();
                        self.createMobileTOC(headings, contentContainer);
                    }
                }, 250); // Debounce для производительности
            });
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
