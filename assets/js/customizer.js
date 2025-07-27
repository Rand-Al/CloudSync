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

    function updateFeatureCardIcon(cardIndex, newValue) {
        /**
         * Universal function for updating feature card icons with comprehensive error handling
         * Integrates with the theme's centralized debug logging system
         *
         * @param {number} cardIndex - Zero-based index (0-5) for the six feature cards
         * @param {string} newValue - New FontAwesome CSS class for the icon
         * @returns {boolean} - Success status of the update operation
         */

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
})();
