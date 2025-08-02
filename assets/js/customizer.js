/**
 * CloudSync Customizer Live Preview
 *
 * This file handles real-time preview of customizer changes using modern
 * vanilla JavaScript. When users modify settings in the Customizer panel,
 * they see changes immediately in the preview pane without page refresh.
 *
 * The WordPress Customizer API provides the wp.customize object which
 * allows us to listen for changes to specific settings and react
 * immediately by updating the preview pane elements.
 *
 * @package CloudSync
 * @since 1.0.0
 */

(function () {
    "use strict";

    // Debug flag - set to true during development, false for production
    const DEBUG = true;

    /**
     * Debug logging function for development and troubleshooting
     *
     * This function provides a centralized way to log debug information
     * during development. When DEBUG is set to false, all debug messages
     * are automatically suppressed, keeping the production code clean.
     *
     * @param {string} message The main debug message
     * @param {*} data Optional additional data to log
     */
    function debugLog(message, data) {
        if (DEBUG && typeof console !== "undefined" && console.log) {
            if (data !== undefined) {
                console.log("[CloudSync Customizer]", message, data);
            } else {
                console.log("[CloudSync Customizer]", message);
            }
        }
    }
    /**
     * Initialize live preview functionality when DOM is ready
     *
     * We use DOMContentLoaded to ensure all elements exist before
     * we try to bind our preview functionality to them.
     */
    document.addEventListener("DOMContentLoaded", function () {
        // Verify that WordPress Customizer API is available
        // This prevents errors if this script somehow loads outside the Customizer
        if (typeof wp === "undefined" || typeof wp.customize === "undefined") {
            return;
        }

        // Initialize hero section live preview
        initializeHeroSectionPreview();
        // Initialize features section live preview
        initializeFeaturesSectionPreview();
        // Initialize how it works section live preview
        initializeHowItWorksPreview();
        // Initialize pricing section live preview
        initializePricingPreview();
    });

    /**
     * Initialize live preview for hero section elements
     *
     * This function sets up real-time preview for all hero section fields.
     * Each field gets its own listener that updates the corresponding
     * DOM element when the user changes the value in Customizer.
     */
    function initializeHeroSectionPreview() {
        // Hero Main Title live preview
        // When user changes the headline, update it immediately in preview
        wp.customize("cloudsync_hero_main_title", function (value) {
            value.bind(function (newValue) {
                updateHeroTitle(newValue);
            });
        });

        // Hero Description live preview
        wp.customize("cloudsync_hero_description", (value) => {
            value.bind((newValue) => {
                updateHeroDescription(newValue);
            });
        });

        // Primary Button Text live preview
        wp.customize("cloudsync_hero_primary_btn_text", function (value) {
            value.bind(function (newValue) {
                debugLog("Primary button text changed to:", newValue);
                updatePrimaryButtonText(newValue);
            });
        });

        // Secondary Button Text live preview
        wp.customize("cloudsync_hero_secondary_btn_text", function (value) {
            value.bind(function (newValue) {
                updateSecondaryButtonText(newValue);
            });
        });

        // Floating Cards live preview - Card 1
        // These listeners handle real-time updates for the first floating card
        // when users change the icon class or title in the Customizer
        wp.customize("cloudsync_hero_card1_icon", function (value) {
            debugLog("Setting up live preview for floating card 1 icon");

            value.bind(function (newValue) {
                debugLog("Card 1 icon changed to:", newValue);
                updateFloatingCardIcon(1, newValue);
            });
        });

        wp.customize("cloudsync_hero_card1_title", function (value) {
            debugLog("Setting up live preview for floating card 1 title");

            value.bind(function (newValue) {
                debugLog("Card 1 title changed to:", newValue);
                updateFloatingCardTitle(1, newValue);
            });
        });

        // Floating Cards live preview - Card 2
        // Similar structure for the second floating card
        wp.customize("cloudsync_hero_card2_icon", function (value) {
            debugLog("Setting up live preview for floating card 2 icon");

            value.bind(function (newValue) {
                debugLog("Card 2 icon changed to:", newValue);
                updateFloatingCardIcon(2, newValue);
            });
        });

        wp.customize("cloudsync_hero_card2_title", function (value) {
            debugLog("Setting up live preview for floating card 2 title");

            value.bind(function (newValue) {
                debugLog("Card 2 title changed to:", newValue);
                updateFloatingCardTitle(2, newValue);
            });
        });

        // Floating Cards live preview - Card 3
        // Structure for the third floating card
        wp.customize("cloudsync_hero_card3_icon", function (value) {
            debugLog("Setting up live preview for floating card 3 icon");

            value.bind(function (newValue) {
                debugLog("Card 3 icon changed to:", newValue);
                updateFloatingCardIcon(3, newValue);
            });
        });

        wp.customize("cloudsync_hero_card3_title", function (value) {
            debugLog("Setting up live preview for floating card 3 title");

            value.bind(function (newValue) {
                debugLog("Card 3 title changed to:", newValue);
                updateFloatingCardTitle(3, newValue);
            });
        });
    }

    /**
     * Initialize live preview for features section elements
     *
     * This function sets up real-time preview for all features section fields.
     * Each field gets its own listener that updates the corresponding
     * DOM element when the user changes the value in Customizer.
     * Handles both section header content and individual feature card updates.
     */
    function initializeFeaturesSectionPreview() {
        // Features title live preview
        wp.customize("cloudsync_features_main_title", function (value) {
            value.bind(function (newValue) {
                updateFeaturesTitle(newValue);
            });
        });

        // Features description live preview
        wp.customize("cloudsync_features_description", (value) => {
            value.bind((newValue) => {
                updateFeaturesDescription(newValue);
            });
        });
        /**
         * ==============================
         *  Features cards live preview
         * ==============================
         */
        /**
         * ==============================
         *  Icons
         * ==============================
         */
        // Feature Card 1 - Icon live preview
        wp.customize("cloudsync_feature1_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(0, newValue);
            });
        });
        // Feature Card 2 - Icon live preview
        wp.customize("cloudsync_feature2_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(1, newValue);
            });
        });
        // Feature Card 3 - Icon live preview
        wp.customize("cloudsync_feature3_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(2, newValue);
            });
        });
        // Feature Card 4 - Icon live preview
        wp.customize("cloudsync_feature4_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(3, newValue);
            });
        });
        // Feature Card 5 - Icon live preview
        wp.customize("cloudsync_feature5_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(4, newValue);
            });
        });
        // Feature Card 6 - Icon live preview
        wp.customize("cloudsync_feature6_icon", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardIcon(5, newValue);
            });
        });

        /**
         * ==============================
         *  Title
         * ==============================
         */
        // Feature Card 1 - Title live preview
        wp.customize("cloudsync_feature1_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(0, newValue);
            });
        });
        // Feature Card 2 - Title live preview
        wp.customize("cloudsync_feature2_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(1, newValue);
            });
        });
        // Feature Card 3 - Title live preview
        wp.customize("cloudsync_feature3_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(2, newValue);
            });
        });
        // Feature Card 4 - Title live preview
        wp.customize("cloudsync_feature4_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(3, newValue);
            });
        });
        // Feature Card 5 - Title live preview
        wp.customize("cloudsync_feature5_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(4, newValue);
            });
        });
        // Feature Card 6 - Title live preview
        wp.customize("cloudsync_feature6_title", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardTitle(5, newValue);
            });
        });
        /**
         * ==============================
         *  Description
         * ==============================
         */
        // Feature Card 1 - Description live preview
        wp.customize("cloudsync_feature1_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(0, newValue);
            });
        });
        // Feature Card 2 - Description live preview
        wp.customize("cloudsync_feature2_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(1, newValue);
            });
        });
        // Feature Card 3 - Description live preview
        wp.customize("cloudsync_feature3_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(2, newValue);
            });
        });
        // Feature Card 4 - Description live preview
        wp.customize("cloudsync_feature4_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(3, newValue);
            });
        });
        // Feature Card 5 - Description live preview
        wp.customize("cloudsync_feature5_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(4, newValue);
            });
        });
        // Feature Card 6 - Description live preview
        wp.customize("cloudsync_feature6_description", function (value) {
            value.bind(function (newValue) {
                updateFeatureCardDescription(5, newValue);
            });
        });
    }

    /**
     * Initialize live preview for How it works section elements
     *
     * This function sets up real-time preview for all How it works section fields.
     * Each field gets its own listener that updates the corresponding
     * DOM element when the user changes the value in Customizer.
     * Handles both section header content and individual steps element updates.
     */
    function initializeHowItWorksPreview() {
        // HowItWorks title live preview
        wp.customize("cloudsync_how_it_works_main_title", function (value) {
            value.bind(function (newValue) {
                updateHowItWorksTitle(newValue);
            });
        });

        // HowItWorks description live preview
        wp.customize("cloudsync_how_it_works_description", (value) => {
            value.bind((newValue) => {
                updateHowItWorksDescription(newValue);
            });
        });
        /**
         * ==============================
         *  HOW IT WORKS STEPS LIVE PREVIEW
         * ==============================
         */
        /**
         * ==============================
         *  Identifier
         * ==============================
         */
        // Step 1 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step1_identifier",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsIdentifier(0, newValue);
                });
            }
        );
        // Step 2 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step2_identifier",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsIdentifier(1, newValue);
                });
            }
        );
        // Step 3 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step3_identifier",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsIdentifier(2, newValue);
                });
            }
        );

        /**
         * ==============================
         *  Title
         * ==============================
         */
        // Step 1 - Identifier live preview
        wp.customize("cloudsync_how_it_works_step1_title", function (value) {
            value.bind(function (newValue) {
                updateHowItWorksStepsTitle(0, newValue);
            });
        });
        // Step 2 - Identifier live preview
        wp.customize("cloudsync_how_it_works_step2_title", function (value) {
            value.bind(function (newValue) {
                updateHowItWorksStepsTitle(1, newValue);
            });
        });
        // Step 3 - Identifier live preview
        wp.customize("cloudsync_how_it_works_step3_title", function (value) {
            value.bind(function (newValue) {
                updateHowItWorksStepsTitle(2, newValue);
            });
        });
        /**
         * ==============================
         *  Description
         * ==============================
         */
        // Step 1 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step1_description",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsDescription(0, newValue);
                });
            }
        );
        // Step 2 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step2_description",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsDescription(1, newValue);
                });
            }
        );
        // Step 3 - Identifier live preview
        wp.customize(
            "cloudsync_how_it_works_step3_description",
            function (value) {
                value.bind(function (newValue) {
                    updateHowItWorksStepsDescription(2, newValue);
                });
            }
        );
    }

    /**
     * Initialize live preview for pricing section elements
     *
     * This function sets up real-time preview for the header section fields of pricing section.
     * Each field gets its own listener that updates the corresponding
     * DOM element when the user changes the value in Customizer.
     */

    function initializePricingPreview() {
        // Pricing title live preview
        wp.customize("cloudsync_pricing_main_title", function (value) {
            value.bind(function (newValue) {
                updatePricingTitle(newValue);
            });
        });
        // Pricing description live preview
        wp.customize("cloudsync_pricing_description", (value) => {
            value.bind((newValue) => {
                updatePricingDescription(newValue);
            });
        });
        /**
         * ==============================
         *  PRICING ELEMENTS LIVE PREVIEW
         * ==============================
         */
        /**
         * ==============================
         *  Name
         * ==============================
         */
        // PRICING PLAN 1 - Name live preview
        wp.customize("cloudsync_plan1_name", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanName(0, newValue);
            });
        });
        // PRICING PLAN 2 - Name live preview
        wp.customize("cloudsync_plan2_name", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanName(1, newValue);
            });
        });
        // PRICING PLAN 3 - Name live preview
        wp.customize("cloudsync_plan3_name", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanName(2, newValue);
            });
        });
        /**
         * ==============================
         *  Price
         * ==============================
         */
        // PRICING PLAN 1 - Price live preview
        wp.customize("cloudsync_plan1_price", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanPrice(0, newValue);
            });
        });
        // PRICING PLAN 2 - Price live preview
        wp.customize("cloudsync_plan2_price", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanPrice(1, newValue);
            });
        });
        // PRICING PLAN 3 - Price live preview
        wp.customize("cloudsync_plan3_price", function (value) {
            value.bind(function (newValue) {
                updatePricingPlanPrice(2, newValue);
            });
        });
    }

    /**
     * =============================================
     *    1) Helper functions to update Hero section
     * =============================================
     * */
    /**
     * Update hero title in the preview
     *
     * This function finds the hero title element and updates only the
     * customizable part while preserving the site name structure.
     *
     * @param {string} newTitle The new title text from Customizer
     */
    function updateHeroTitle(newTitle) {
        // Find the hero title element
        const heroTitle = document.querySelector(".hero h1");

        if (heroTitle) {
            // Get the site name from WordPress (it's already in the page)
            // We need to preserve the "Site Name - " part and only update the description
            const siteName = document.body.dataset.siteName || "";

            // If we have site name data, construct the full title
            if (siteName) {
                heroTitle.textContent = siteName + " - " + newTitle;
            } else {
                // Fallback: try to extract site name from current title
                const currentText = heroTitle.textContent;
                const dashIndex = currentText.indexOf(" - ");

                if (dashIndex !== -1) {
                    const extractedSiteName = currentText.substring(
                        0,
                        dashIndex
                    );
                    heroTitle.textContent =
                        extractedSiteName + " - " + newTitle;
                } else {
                    // Last resort: just update with new title
                    heroTitle.textContent = newTitle;
                }
            }
        }
    }
    /**
     * Update hero description in the preview
     *
     * This function finds the hero description paragraph and updates
     * its content with the new text from Customizer.
     *
     * @param {string} newDescription The new description text from Customizer
     */
    function updateHeroDescription(newDescription) {
        debugLog("Updating hero description with:", newDescription);

        const heroDescription = document.querySelector(".hero-text p");

        if (heroDescription) {
            heroDescription.textContent = newDescription;
            debugLog("Hero description updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find hero description element with selector ".hero-text p"'
            );
        }
    }

    /**
     * Update primary button text in the preview
     *
     * @param {string} newText The new button text from Customizer
     */
    function updatePrimaryButtonText(newText) {
        debugLog("Updating primary button text with:", newText);

        const primaryButton = document.querySelector(".hero-buttons .cta-btn");

        if (primaryButton) {
            primaryButton.textContent = newText;
            debugLog("Primary button text updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find primary button element with selector ".hero-buttons .cta-btn"'
            );
        }
    }

    /**
     * Update secondary button text in the preview
     *
     * @param {string} newText The new button text from Customizer
     */
    function updateSecondaryButtonText(newText) {
        debugLog("Updating secondary button text with:", newText);

        const secondaryButton = document.querySelector(
            ".hero-buttons .btn-secondary"
        );

        if (secondaryButton) {
            secondaryButton.textContent = newText;
            debugLog("Secondary button text updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find secondary button element with selector ".hero-buttons .btn-secondary"'
            );
        }
    }

    /**
     * Update floating card icon class in the preview
     *
     * This function handles the complex task of updating FontAwesome icon classes
     * while preserving the existing inline styles and other attributes of the icon element.
     *
     * FontAwesome classes follow a specific pattern (e.g., 'fas fa-chart-line') where
     * the first part ('fas') defines the icon style and the second part ('fa-chart-line')
     * defines the specific icon. We need to replace the entire class string to ensure
     * proper icon display.
     *
     * @param {number} cardNumber The card number (1, 2, or 3)
     * @param {string} newIconClass The new FontAwesome icon class
     */
    function updateFloatingCardIcon(cardNumber, newIconClass) {
        debugLog(
            "Updating floating card " + cardNumber + " icon with:",
            newIconClass
        );

        // Find the specific floating card using the card number
        const card = document.querySelector(
            ".floating-card.card-" + cardNumber
        );

        if (!card) {
            debugLog("ERROR: Could not find floating card " + cardNumber);
            return;
        }

        // Find the icon element within this specific card
        const iconElement = card.querySelector("i");

        if (!iconElement) {
            debugLog(
                "ERROR: Could not find icon element in floating card " +
                    cardNumber
            );
            return;
        }

        // Store the current style attribute to preserve inline styles
        const currentStyle = iconElement.getAttribute("style");

        // Replace the entire className with the new FontAwesome classes
        // This ensures that old icon classes are completely removed
        iconElement.className = newIconClass;

        // Restore the inline styles that control size and color
        if (currentStyle) {
            iconElement.setAttribute("style", currentStyle);
        }

        debugLog(
            "Successfully updated card " + cardNumber + " icon to:",
            newIconClass
        );
    }

    /**
     * Update floating card title text in the preview
     *
     * This function updates the title text of a floating card while maintaining
     * all the existing HTML structure and styling. It's simpler than icon updates
     * because we only need to change text content, not class attributes.
     *
     * @param {number} cardNumber The card number (1, 2, or 3)
     * @param {string} newTitle The new title text
     */
    function updateFloatingCardTitle(cardNumber, newTitle) {
        debugLog(
            "Updating floating card " + cardNumber + " title with:",
            newTitle
        );

        // Find the specific floating card using the card number
        const card = document.querySelector(
            ".floating-card.card-" + cardNumber
        );

        if (!card) {
            debugLog("ERROR: Could not find floating card " + cardNumber);
            return;
        }

        // Find the title element (h4) within this specific card
        const titleElement = card.querySelector("h4");

        if (!titleElement) {
            debugLog(
                "ERROR: Could not find title element in floating card " +
                    cardNumber
            );
            return;
        }

        // Update the text content with the new title
        // Using textContent instead of innerHTML for security and performance
        titleElement.textContent = newTitle;

        debugLog(
            "Successfully updated card " + cardNumber + " title to:",
            newTitle
        );
    }

    /**
     * ==================================================
     *    2) Helper functions to update Features section
     * ==================================================
     * */
    /**
     * Update features title in the preview
     *
     * This function finds the features title element and updates it
     *
     * @param {string} newTitle The new title text from Customizer
     */
    function updateFeaturesTitle(newTitle) {
        // Find the features title element
        const featuresTitle = document.querySelector(".features h2");
        // Update the features title element
        featuresTitle.textContent = newTitle;
    }

    /**
     * Update features description in the preview
     *
     * This function finds the features description paragraph and updates
     * its content with the new text from Customizer.
     *
     * @param {string} newDescription The new description text from Customizer
     */
    function updateFeaturesDescription(newDescription) {
        // Find the features paragraph element
        const featuresDescription = document.querySelector(
            ".features .section-header p"
        );
        // Update the features description element
        featuresDescription.textContent = newDescription;
    }

    /**
     * Features Cards
     */

    /**
     * Universal function for updating feature card icons with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} cardIndex - Zero-based index (0-5) for the six feature cards
     * @param {string} newValue - New FontAwesome CSS class for the icon
     * @returns {boolean} - Success status of the update operation
     */
    function updateFeatureCardIcon(cardIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performIconUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof cardIndex !== "number" ||
                cardIndex < 0 ||
                cardIndex > 5
            ) {
                debugLog("Invalid card index provided. Expected: 0-5", {
                    provided: cardIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid CSS class string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid icon class provided", { value: newValue });
                return false;
            }

            // Query all feature cards from the DOM
            const featureCards = document.querySelectorAll(".feature-card");

            // Check if we found any feature cards at all
            if (featureCards.length === 0) {
                debugLog("No feature cards found in DOM");
                return false;
            }

            // Check if the requested card index exists in our NodeList
            if (cardIndex >= featureCards.length) {
                debugLog("Card index not found", {
                    requested: cardIndex,
                    available: featureCards.length,
                });
                return false;
            }

            // Get the specific feature card we want to update
            const targetCard = featureCards[cardIndex];

            // Additional safety check for the target card
            if (!targetCard) {
                debugLog("Feature card is null or undefined", {
                    index: cardIndex,
                });
                return false;
            }

            // Find the icon element within the target card using the established HTML structure
            const iconElement = targetCard.querySelector(".feature-icon i");

            // Verify that the icon element exists within this card
            if (!iconElement) {
                debugLog(
                    "Icon element not found in feature card. Check HTML structure.",
                    {
                        cardIndex: cardIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanIconClass = newValue.trim();

            // Perform the actual icon class update
            iconElement.className = cleanIconClass;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card icon", {
                cardIndex: cardIndex,
                newClass: cleanIconClass,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performIconUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            cardIndex: cardIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performIconUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update feature card icon after delay", {
                    cardIndex: cardIndex,
                    iconClass: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }
    /**
     * Universal function for updating feature card title with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} cardIndex - Zero-based index (0-5) for the six feature cards
     * @param {string} newValue - New title value
     * @returns {boolean} - Success status of the update operation
     */
    function updateFeatureCardTitle(cardIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performTitleUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof cardIndex !== "number" ||
                cardIndex < 0 ||
                cardIndex > 5
            ) {
                debugLog("Invalid card index provided. Expected: 0-5", {
                    provided: cardIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid title string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid icon class provided", { value: newValue });
                return false;
            }

            // Query all feature cards from the DOM
            const featureCards = document.querySelectorAll(".feature-card");

            // Check if we found any feature cards at all
            if (featureCards.length === 0) {
                debugLog("No feature cards found in DOM");
                return false;
            }

            // Check if the requested card index exists in our NodeList
            if (cardIndex >= featureCards.length) {
                debugLog("Card index not found", {
                    requested: cardIndex,
                    available: featureCards.length,
                });
                return false;
            }

            // Get the specific feature card we want to update
            const targetCard = featureCards[cardIndex];

            // Additional safety check for the target card
            if (!targetCard) {
                debugLog("Feature card is null or undefined", {
                    index: cardIndex,
                });
                return false;
            }

            // Find the icon element within the target card using the established HTML structure
            const titleElement = targetCard.querySelector("h3");

            // Verify that the title element exists within this card
            if (!titleElement) {
                debugLog(
                    "Icon element not found in feature card. Check HTML structure.",
                    {
                        cardIndex: cardIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanTitle = newValue.trim();

            // Perform the actual icon class update
            titleElement.innerText = cleanTitle;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card title", {
                cardIndex: cardIndex,
                newClass: cleanTitle,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performTitleUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            cardIndex: cardIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performTitleUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update feature card title after delay", {
                    cardIndex: cardIndex,
                    iconClass: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }
    /**
     * Universal function for updating feature card title with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} cardIndex - Zero-based index (0-5) for the six feature cards
     * @param {string} newValue - New description value
     * @returns {boolean} - Success status of the update operation
     */
    function updateFeatureCardDescription(cardIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performDescriptionUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof cardIndex !== "number" ||
                cardIndex < 0 ||
                cardIndex > 5
            ) {
                debugLog("Invalid card index provided. Expected: 0-5", {
                    provided: cardIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid title string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid icon class provided", { value: newValue });
                return false;
            }

            // Query all feature cards from the DOM
            const featureCards = document.querySelectorAll(".feature-card");

            // Check if we found any feature cards at all
            if (featureCards.length === 0) {
                debugLog("No feature cards found in DOM");
                return false;
            }

            // Check if the requested card index exists in our NodeList
            if (cardIndex >= featureCards.length) {
                debugLog("Card index not found", {
                    requested: cardIndex,
                    available: featureCards.length,
                });
                return false;
            }

            // Get the specific feature card we want to update
            const targetCard = featureCards[cardIndex];

            // Additional safety check for the target card
            if (!targetCard) {
                debugLog("Feature card is null or undefined", {
                    index: cardIndex,
                });
                return false;
            }

            // Find the description element within the target card using the established HTML structure
            const descriptionElement = targetCard.querySelector("p");

            // Verify that the title element exists within this card
            if (!descriptionElement) {
                debugLog(
                    "Icon element not found in feature card. Check HTML structure.",
                    {
                        cardIndex: cardIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanDescription = newValue.trim();

            // Perform the actual icon class update
            descriptionElement.innerText = cleanDescription;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card description", {
                cardIndex: cardIndex,
                newDescription: cleanDescription,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performDescriptionUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            cardIndex: cardIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performDescriptionUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog(
                    "Failed to update feature card description after delay",
                    {
                        cardIndex: cardIndex,
                        iconDescription: newValue,
                    }
                );
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }

    /**
     * ==================================================
     *    3) Helper functions to update How it works section
     * ==================================================
     * */
    /**
     * Update how it works title in the preview
     *
     * This function finds the how it works title element and updates it
     *
     * @param {string} newTitle The new title text from Customizer
     */
    function updateHowItWorksTitle(newTitle) {
        debugLog("Updating how it works title with:", newTitle);
        // Find the features title element
        const howItWorksTitle = document.querySelector(".how-it-works h2");
        if (howItWorksTitle) {
            // Update the features title element
            howItWorksTitle.textContent = newTitle;
            debugLog("How it works title updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find How it works title element with selector ".how-it-works h2"'
            );
        }
    }

    /**
     * Update how it works description in the preview
     *
     * This function finds the how it works description paragraph and updates
     * its content with the new text from Customizer.
     *
     * @param {string} newDescription The new description text from Customizer
     */
    function updateHowItWorksDescription(newDescription) {
        debugLog("Updating how it works description with:", newDescription);

        const howItWorksDescription = document.querySelector(".how-it-works p");

        if (howItWorksDescription) {
            howItWorksDescription.textContent = newDescription;
            debugLog("how it works description updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find how it works description element with selector ".hero-text p"'
            );
        }
    }

    /**
     ************* Steps *************
     */

    /**
     * Universal function for updating how it works identifier with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} stepIndex - Zero-based index (0-2) for the three steps elements
     * @param {string} newValue - New value for identifier
     * @returns {boolean} - Success status of the update operation
     */
    function updateHowItWorksStepsIdentifier(stepIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performIdentifierUpdate() {
            // Validate stepIndex parameter before proceeding
            if (
                typeof stepIndex !== "number" ||
                stepIndex < 0 ||
                stepIndex > 2
            ) {
                debugLog("Invalid step index provided. Expected: 0-5", {
                    provided: stepIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid value provided", { value: newValue });
                return false;
            }

            // Query all steps elements from the DOM
            const stepsElements = document.querySelectorAll(".step");
            // Check if we found any steps elements at all
            if (stepsElements.length === 0) {
                debugLog("No steps elements found in DOM");
                return false;
            }

            // Check if the requested steps element index exists in our NodeList
            if (stepIndex >= stepsElements.length) {
                debugLog("Steps element index not found", {
                    requested: stepIndex,
                    available: stepsElements.length,
                });
                return false;
            }

            // Get the specific step element we want to update
            const targetStep = stepsElements[stepIndex];

            // Additional safety check for the target step element
            if (!targetStep) {
                debugLog("Step element is null or undefined", {
                    index: stepIndex,
                });
                return false;
            }

            // Find the identifier element within the target steps element using the established HTML structure
            const identifierElement =
                targetStep.querySelector(".step .step-number");

            // Verify that the icon element exists within this card
            if (!identifierElement) {
                debugLog(
                    "Identifier element not found in step element. Check HTML structure.",
                    {
                        stepIndex: stepIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanIdentifierValue = newValue.trim();

            // Perform the actual icon class update
            identifierElement.innerText = cleanIdentifierValue;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card icon", {
                stepIndex: stepIndex,
                newValue: cleanIdentifierValue,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performIdentifierUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            stepIndex: stepIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performIdentifierUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update step index after delay", {
                    Index: stepIndex,
                    titleValue: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }
    /**
     * Universal function for updating how it works step's title with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} stepIndex - Zero-based index (0-2) for the three steps
     * @param {string} newValue - New title value
     * @returns {boolean} - Success status of the update operation
     */
    function updateHowItWorksStepsTitle(stepIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performTitleUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof stepIndex !== "number" ||
                stepIndex < 0 ||
                stepIndex > 2
            ) {
                debugLog("Invalid card index provided. Expected: 0-2", {
                    provided: stepIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid title string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid title provided", { value: newValue });
                return false;
            }

            // Query all steps element from the DOM
            const howItWorksSteps = document.querySelectorAll(".step");

            // Check if we found any steps element at all
            if (howItWorksSteps.length === 0) {
                debugLog("No steps elements found in DOM");
                return false;
            }

            // Check if the requested step element index exists in our NodeList
            if (stepIndex >= howItWorksSteps.length) {
                debugLog("Card index not found", {
                    requested: stepIndex,
                    available: howItWorksSteps.length,
                });
                return false;
            }

            // Get the specific step element we want to update
            const targetStep = howItWorksSteps[stepIndex];

            // Additional safety check for the target step element
            if (!targetStep) {
                debugLog("Step element is null or undefined", {
                    index: stepIndex,
                });
                return false;
            }

            // Find the title element within the target step element using the established HTML structure
            const titleElement = targetStep.querySelector("h3");

            // Verify that the title element exists within this step element
            if (!titleElement) {
                debugLog(
                    "Title element not found in feature card. Check HTML structure.",
                    {
                        stepIndex: stepIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanTitle = newValue.trim();

            // Perform the actual title element update
            titleElement.innerText = cleanTitle;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card title", {
                stepIndex: stepIndex,
                newTitle: cleanTitle,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performTitleUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            stepIndex: stepIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performTitleUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update feature card title after delay", {
                    stepIndex: stepIndex,
                    newTitle: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }
    /**
     * Universal function for updating how it works step's title with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} stepIndex - Zero-based index (0-2) for the three steps
     * @param {string} newValue - New title value
     * @returns {boolean} - Success status of the update operation
     */
    function updateHowItWorksStepsDescription(stepIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performDescriptionUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof stepIndex !== "number" ||
                stepIndex < 0 ||
                stepIndex > 2
            ) {
                debugLog("Invalid step index provided. Expected: 0-2", {
                    provided: stepIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid description string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid description provided", { value: newValue });
                return false;
            }

            // Query all steps element from the DOM
            const howItWorksSteps = document.querySelectorAll(".step");

            // Check if we found any steps element at all
            if (howItWorksSteps.length === 0) {
                debugLog("No steps elements found in DOM");
                return false;
            }

            // Check if the requested step element index exists in our NodeList
            if (stepIndex >= howItWorksSteps.length) {
                debugLog("Card index not found", {
                    requested: stepIndex,
                    available: howItWorksSteps.length,
                });
                return false;
            }

            // Get the specific step element we want to update
            const targetStep = howItWorksSteps[stepIndex];

            // Additional safety check for the target step element
            if (!targetStep) {
                debugLog("Step element is null or undefined", {
                    index: stepIndex,
                });
                return false;
            }

            // Find the description element within the target step element using the established HTML structure
            const descriptionElement = targetStep.querySelector("p");

            // Verify that the description element exists within this step element
            if (!descriptionElement) {
                debugLog(
                    "description element not found in step element. Check HTML structure.",
                    {
                        stepIndex: stepIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanDescription = newValue.trim();

            // Perform the actual description element update
            descriptionElement.innerText = cleanDescription;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card title", {
                stepIndex: stepIndex,
                newTitle: cleanDescription,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performDescriptionUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            stepIndex: stepIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performDescriptionUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog(
                    "Failed to update step element description after delay",
                    {
                        stepIndex: stepIndex,
                        newTitle: newValue,
                    }
                );
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }

    /**
     * ==================================================
     *    4) Helper functions to update Pricing section
     * ==================================================
     * */

    /**
     * Update pricing title in the preview
     *
     * This function finds the pricing title element and updates it
     *
     * @param {string} newTitle The new title text from Customizer
     */
    function updatePricingTitle(newTitle) {
        debugLog("Updating pricing title with:", newTitle);
        // Find the pricing title element
        const pricingTitle = document.querySelector(".pricing h2");
        if (pricingTitle) {
            // Update the pricing title element
            pricingTitle.textContent = newTitle;
            debugLog("Pricing title updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find pricing title element with selector ".pricing h2"'
            );
        }
    }
    /**
     * Update pricing description in the preview
     *
     * This function finds the pricing description paragraph and updates
     * its content with the new text from Customizer.
     *
     * @param {string} newDescription The new description text from Customizer
     */
    function updatePricingDescription(newDescription) {
        debugLog("Updating pricing description with:", newDescription);

        const pricingDescription = document.querySelector(".pricing p");

        if (pricingDescription) {
            pricingDescription.textContent = newDescription;
            debugLog("Pricing description updated successfully");
        } else {
            debugLog(
                'ERROR: Could not find Pricing description element with selector ".pricing p"'
            );
        }
    }

    /**
     * Universal function for updating pricing plan  with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} planIndex - Zero-based index (0-2) for the three plans elements
     * @param {string} newValue - New value for identifier
     * @returns {boolean} - Success status of the update operation
     */
    function updatePricingPlanName(planIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performNameUpdate() {
            // Validate stepIndex parameter before proceeding
            if (
                typeof planIndex !== "number" ||
                planIndex < 0 ||
                planIndex > 2
            ) {
                debugLog("Invalid step index provided. Expected: 0-5", {
                    provided: planIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid value provided", { value: newValue });
                return false;
            }

            // Query all steps elements from the DOM
            const pricingPlans = document.querySelectorAll(".pricing-card");
            // Check if we found any steps elements at all
            if (pricingPlans.length === 0) {
                debugLog("No steps elements found in DOM");
                return false;
            }

            // Check if the requested steps element index exists in our NodeList
            if (planIndex >= pricingPlans.length) {
                debugLog("pricing plan index not found", {
                    requested: planIndex,
                    available: pricingPlans.length,
                });
                return false;
            }

            // Get the specific step element we want to update
            const targetPlan = pricingPlans[planIndex];

            // Additional safety check for the target step element
            if (!targetPlan) {
                debugLog("Plan element is null or undefined", {
                    index: planIndex,
                });
                return false;
            }

            // Find the identifier element within the target steps element using the established HTML structure
            const nameElement = targetPlan.querySelector("h3");

            // Verify that the icon element exists within this card
            if (!nameElement) {
                debugLog(
                    "Name element not found in plan element. Check HTML structure.",
                    {
                        stepIndex: planIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanNameValue = newValue.trim();

            // Perform the actual icon class update
            nameElement.innerText = cleanNameValue;

            // Log successful update for debugging purposes
            debugLog("Successfully updated pricing plan name", {
                planIndex: planIndex,
                newValue: cleanNameValue,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performNameUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            planIndex: planIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performNameUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update pricing plan name after delay", {
                    Index: planIndex,
                    nameValue: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }

    /**
     * Universal function for updating pricing plan price with comprehensive error handling
     * Integrates with the theme's centralized debug logging system
     *
     * @param {number} planIndex - Zero-based index (0-2) for the three steps
     * @param {string} newValue - New title value
     * @returns {boolean} - Success status of the update operation
     */
    function updatePricingPlanPrice(planIndex, newValue) {
        // Inner function that performs the actual DOM update
        function performPlanPriceUpdate() {
            // Validate cardIndex parameter before proceeding
            if (
                typeof planIndex !== "number" ||
                planIndex < 0 ||
                planIndex > 2
            ) {
                debugLog("Invalid plan index provided. Expected: 0-2", {
                    provided: planIndex,
                });
                return false;
            }

            // Validate newValue parameter to ensure it's a valid title string
            if (
                !newValue ||
                typeof newValue !== "string" ||
                newValue.trim() === ""
            ) {
                debugLog("Invalid price provided", { value: newValue });
                return false;
            }

            // Query all steps elements from the DOM
            const pricingPlans = document.querySelectorAll(".pricing-card");
            // Check if we found any steps elements at all
            if (pricingPlans.length === 0) {
                debugLog("No pricing plans elements found in DOM");
                return false;
            }

            // Check if the requested steps element index exists in our NodeList
            if (planIndex >= pricingPlans.length) {
                debugLog("Pricing plan index not found", {
                    requested: planIndex,
                    available: pricingPlans.length,
                });
                return false;
            }

            // Get the specific step element we want to update
            const targetPlan = pricingPlans[planIndex];

            // Additional safety check for the target step element
            if (!targetPlan) {
                debugLog("Plan element is null or undefined", {
                    index: planIndex,
                });
                return false;
            }

            // Find the title element within the target step element using the established HTML structure
            const priceElement = targetPlan.querySelector(".price-value");

            // Verify that the title element exists within this step element
            if (!priceElement) {
                debugLog(
                    "Price element not found in pricing plan. Check HTML structure.",
                    {
                        planIndex: planIndex,
                    }
                );
                return false;
            }

            // Clean the new value to remove any potential whitespace issues
            const cleanPrice = newValue.trim();

            // Perform the actual title element update
            priceElement.innerText = cleanPrice;

            // Log successful update for debugging purposes
            debugLog("Successfully updated feature card title", {
                planIndex: planIndex,
                newPrice: cleanPrice,
            });

            return true;
        }

        // Attempt immediate update first (most common success case)
        if (performPlanPriceUpdate()) {
            return true; // Success on first attempt, exit early
        }

        // If immediate update failed, the DOM might not be ready yet
        debugLog("Immediate update failed, attempting delayed update...", {
            planIndex: planIndex,
        });

        // Schedule a retry after a short delay to allow DOM to fully load
        setTimeout(() => {
            if (!performPlanPriceUpdate()) {
                // If even the delayed attempt fails, log an error for debugging
                debugLog("Failed to update feature card title after delay", {
                    planIndex: planIndex,
                    newTitle: newValue,
                });
            }
        }, 500);

        // Return false for immediate attempt (delayed attempt status is handled in callback)
        return false;
    }
})();
