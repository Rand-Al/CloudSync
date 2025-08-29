<?php

/**
 * CloudSync Theme Customizer Configuration
 * 
 * This file contains all WordPress Customizer panels, sections, settings, and controls
 * for the CloudSync SaaS landing page theme. The code is organized in logical sections
 * for easy navigation and maintenance.
 * 
 * SECTION ORGANIZATION:
 * =====================
 * 1. Main Panel & Initialization
 * 2. Hero Section Settings
 * 3. Features Section Settings (to be added)
 * 4. Pricing Section Settings (to be added)
 * 5. Footer Section Settings (to be added)
 * 6. Helper Functions & Utilities
 * 
 * Each section is clearly marked with comment headers for easy navigation.
 * All functions use the 'cloudsync_' prefix to prevent conflicts.
 * 
 * @package CloudSync
 * @since 1.0.0
 * @author CloudSync Theme
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

//=============================================================================
// 1. MAIN PANEL & INITIALIZATION
//============================================================================= */

/**
 * Initialize CloudSync Customizer functionality
 * 
 * This main function coordinates the registration of all Customizer components.
 * It's called by WordPress when the Customizer interface is loaded.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_customize_register($wp_customize) {

    // Register the main theme panel
    cloudsync_add_theme_panel($wp_customize);

    // Register all sections
    cloudsync_register_hero_section($wp_customize);
    cloudsync_register_hero_cards_section($wp_customize);
    cloudsync_register_features_section($wp_customize);
    cloudsync_register_features_cards_section($wp_customize);
    cloudsync_register_how_it_works_section($wp_customize);
    cloudsync_register_how_it_works_steps_section($wp_customize);
    cloudsync_register_pricing_section($wp_customize);
    cloudsync_register_pricing_plans_section($wp_customize);
    cloudsync_register_cta_section($wp_customize);
    cloudsync_register_contact_section($wp_customize);
    cloudsync_register_mailchimp_section($wp_customize);
    cloudsync_register_footer_section($wp_customize);
}

/**
 * Add main CloudSync theme panel
 * 
 * Creates a dedicated panel in the Customizer to house all theme-specific settings.
 * This keeps our options organized and separate from WordPress core settings.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_add_theme_panel($wp_customize) {

    $wp_customize->add_panel('cloudsync_theme_options', array(
        'title'       => __('CloudSync Theme Options', 'cloudsync'),
        'description' => __('Customize your SaaS landing page content and styling. All changes are previewed in real-time.', 'cloudsync'),
        'priority'    => 30,
    ));
}
//=============================================================================
// 2. HERO SECTION SETTINGS
//============================================================================= */
require_once get_template_directory() . '/inc/customizer/hero-section.php';

// =============================================================================
// 3. FEATURES SECTION SETTINGS
// ============================================================================= */

require_once get_template_directory() . '/inc/customizer/features-section.php';

//=============================================================================
//  4. HOW IT WORKS SECTION SETTINGS
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/how-it-works-section.php';

//=============================================================================
//4. PRICING SECTION SETTINGS 
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/pricing-section.php';
//=============================================================================
// 5. CTA SECTION SETTINGS
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/cta-section.php';

// =============================================================================
// 6. CONTACT SECTION SETTINGS
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/contact-section.php';

//=============================================================================
// 7. MAILCHIMP INTEGRATION SETTINGS
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/mailchimp-section.php';

//=============================================================================
// 8. FOOTER SECTION SETTINGS
//============================================================================= */

require_once get_template_directory() . '/inc/customizer/footer-section.php';
/* =============================================================================
   6. HELPER FUNCTIONS & UTILITIES
   ============================================================================= */


// Hook our initialization function into WordPress
add_action('customize_register', 'cloudsync_customize_register');

/**
 * Enqueue Customizer live preview JavaScript
 * 
 * This function loads our vanilla JavaScript file that handles real-time
 * preview of customizer changes. The script only loads in the Customizer
 * preview context to avoid unnecessary overhead on the frontend.
 * 
 * The 'customize_preview_init' action ensures that this script loads
 * only when the Customizer preview iframe is being initialized, not
 * on regular frontend page loads.
 * 
 * @since 1.0.0
 */
function cloudsync_customizer_live_preview() {
    wp_enqueue_script(
        'cloudsync-customizer-live-preview',
        get_template_directory_uri() . '/assets/js/customizer.js',
        array('customize-preview'),
        '1.0.0',
        true
    );
}
add_action('customize_preview_init', 'cloudsync_customizer_live_preview');

/**
 * Add site data to body for JavaScript access

 * This corrected version ensures that the site name data is set only after
 * the DOM is fully ready, preventing the "Cannot read properties of null" error.
 * We use a deferred approach that waits for the body element to be available.
 * 
 * @since 1.0.0
 */
function cloudsync_add_site_data_to_body() {
    // Only add this data in Customizer preview context
    if (is_customize_preview()) {
        $site_name = get_bloginfo('name');
?>
        <script>
            (function() {
                'use strict';

                /**
                 * Function to safely set the site name dataset
                 * This function includes error checking and waits for DOM readiness
                 */
                function setSiteNameData() {
                    try {
                        if (document.body) {
                            document.body.dataset.siteName = "<?php echo esc_js($site_name); ?>";
                            console.log('[CloudSync] Site name successfully set:', document.body.dataset.siteName);
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error('[CloudSync] Error setting site name:', error);
                        return false;
                    }
                }

                // Try to set the data immediately if body is already available
                if (document.body) {
                    setSiteNameData();
                } else {
                    // If body is not ready, wait for DOM content to load
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', function() {
                            setSiteNameData();
                        });
                    } else {
                        // Document is already loaded, but body might still be null
                        // This can happen in some edge cases, so we use a small delay
                        setTimeout(function() {
                            if (!setSiteNameData()) {
                                console.warn('[CloudSync] Failed to set site name data after timeout');
                            }
                        }, 10);
                    }
                }
            })();
        </script>
<?php
    }
}
add_action('wp_head', 'cloudsync_add_site_data_to_body');
