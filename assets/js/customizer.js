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
    const DEBUG = false;

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
        wp.customize("cloudsync_features_main_title", function (value) {
            value.bind(function (newValue) {
                updateFeaturesTitle(newValue);
            });
        });

        // Hero Description live preview
        wp.customize("cloudsync_features_description", (value) => {
            value.bind((newValue) => {
                updateFeaturesDescription(newValue);
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
     *    1) Helper functions to update Features section
     * ==================================================
     * */
    /**
     * Update hero title in the preview
     *
     * This function finds the hero title element and updates only the
     * customizable part while preserving the site name structure.
     *
     * @param {string} newTitle The new title text from Customizer
     */
    function updateFeaturesTitle(newTitle) {
        // Find the features title element
        const featuresTitle = document.querySelector(".features h2");
        featuresTitle.textContent = newTitle;
    }
})();
