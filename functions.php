<?php

/**
 * CloudSync SaaS Landing Theme Functions
 * 
 * This file contains all the core functionality and setup for the CloudSync theme.
 * Built for international market with professional standards.
 * 
 * @package CloudSync
 * @version 1.0.0
 * @author Your Name
 * @since 1.0.0
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Theme Setup Function
 * 
 * Sets up core theme features and tells WordPress what our theme supports.
 * This runs after WordPress loads but before most other initialization.
 * 
 * @since 1.0.0
 */
function cloudsync_theme_setup() {

    // Add support for automatic RSS feed links in document head
    // This improves SEO and allows feed readers to discover your content
    add_theme_support('automatic-feed-links');
    // Enable support for Post Thumbnails (featured images)
    // This allows users to set featured images for posts and pages
    // Essential for blog functionality and social media sharing
    add_theme_support('post-thumbnails');

    // Set default post thumbnail size for optimal social media sharing
    // Width: 1200px, Height: 630px (perfect Facebook/Twitter ratio)
    set_post_thumbnail_size(1200, 630, true);

    // Add custom image sizes for different sections of our theme
    add_image_size('cloudsync-hero', 800, 600, true);     // Hero section images
    add_image_size('cloudsync-feature', 400, 300, true);  // Feature cards
    add_image_size('cloudsync-thumbnail', 300, 200, true); // Small thumbnails

    // Switch default core markup to output valid HTML5
    // This ensures our theme uses modern web standards
    add_theme_support('html5', array(
        'search-form',      // Search forms will use HTML5 structure
        'comment-form',     // Comment forms get proper HTML5 fields
        'comment-list',     // Comments display with HTML5 elements
        'gallery',          // WordPress galleries use HTML5
        'caption',          // Image captions use HTML5 figure/figcaption
        'style',            // Inline styles use HTML5 structure
        'script',           // Inline scripts use HTML5 structure
    ));

    // Register navigation menus
    // This creates menu locations that users can manage through WordPress admin
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'cloudsync'),      // Main header navigation
        'footer'    => __('Footer Menu', 'cloudsync'),       // Footer links menu
        'social'    => __('Social Links', 'cloudsync'),      // Social media links
    ));

    // Add support for custom logo upload
    // This enables the logo customization feature in WordPress Customizer
    // Perfect for SaaS companies that need to maintain brand consistency
    add_theme_support('custom-logo', array(
        'height'      => 100,                    // Maximum logo height in pixels
        'width'       => 300,                    // Maximum logo width in pixels  
        'flex-height' => true,                   // Allow flexible height scaling
        'flex-width'  => true,                   // Allow flexible width scaling
        'header-text' => array('site-title'),    // Elements to hide when logo is uploaded
        'unlink-homepage-logo' => false,         // Keep logo linked to homepage
    ));

    // Add support for custom background images and colors
    // This enables background customization in WordPress Customizer
    // Valuable for SaaS companies that want to incorporate brand elements
    add_theme_support('custom-background', array(
        'default-color'      => '0f0f23',        // Default background color (dark theme)
        'default-image'      => '',              // No default background image
        'default-preset'     => 'default',       // Use default styling preset
        'default-position-x' => 'left',          // Horizontal positioning
        'default-position-y' => 'top',           // Vertical positioning
        'default-size'       => 'auto',          // Image sizing behavior
        'default-repeat'     => 'repeat',        // Image repeat pattern
        'default-attachment' => 'scroll',        // Scroll behavior with page
        'wp-head-callback'   => '_custom_background_cb',  // WordPress default callback
    ));

    // Let WordPress manage the document title tag
    // This is crucial for SEO and eliminates the need for manual title management
    add_theme_support('title-tag');

    // Switch default core markup to output valid HTML5
    // This ensures our theme uses modern web standards
    add_theme_support('html5', array(
        'search-form',      // Search forms will use HTML5 structure
        'comment-form',     // Comment forms get proper HTML5 fields
        'comment-list',     // Comments display with HTML5 elements
        'gallery',          // WordPress galleries use HTML5
        'caption',          // Image captions use HTML5 figure/figcaption
        'style',            // Inline styles use HTML5 structure
        'script',           // Inline scripts use HTML5 structure
    ));

    // Let WordPress manage the document title tag
    // This is crucial for SEO and eliminates the need for manual title management
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'cloudsync_theme_setup');


/**
 * Enqueue scripts and styles
 * 
 * This function properly loads CSS and JavaScript files using WordPress
 * built-in system. This ensures proper loading order, dependency management,
 * and prevents conflicts with plugins and other themes.
 * 
 * @since 1.0.0
 */
function cloudsync_scripts() {

    // Enqueue main theme stylesheet
    // Using get_theme_version() ensures proper cache busting when theme updates
    wp_enqueue_style(
        'cloudsync-style',                    // Unique handle for this stylesheet
        get_stylesheet_uri(),                 // Path to style.css file
        array(),                              // Dependencies (none for main stylesheet)
        cloudsync_get_theme_version()        // Version number for cache busting
    );

    // Enqueue theme JavaScript with proper dependencies
    wp_enqueue_script(
        'cloudsync-theme-js',                        // Unique handle for this script
        get_template_directory_uri() . '/assets/js/theme.js',  // Path to JavaScript file
        array('jquery'),                             // Dependencies - requires jQuery
        cloudsync_get_theme_version(),               // Version for cache busting
        true                                         // Load in footer for better performance
    );

    // Enqueue Google Fonts for modern typography
    // Inter font family provides excellent readability and professional appearance
    wp_enqueue_style(
        'cloudsync-google-fonts',                    // Unique handle
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        array(),                                     // No dependencies
        null                                         // No version for external resources
    );

    // Enqueue Font Awesome for icons
    // Version 6.0.0 provides comprehensive icon library for modern web design
    wp_enqueue_style(
        'cloudsync-font-awesome',                    // Unique handle
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        array(),                                     // No dependencies
        '6.0.0'                                      // Specific version for reliability
    );
}
add_action('wp_enqueue_scripts', 'cloudsync_scripts');

/**
 * Register widget areas
 * 
 * This function creates widget-ready areas with descriptive names
 * that help users understand exactly where their content will appear.
 * 
 * @since 1.0.0
 */
function cloudsync_widgets_init() {

    // Footer Column 1 - Typically used for company info or logo
    register_sidebar(array(
        'name'          => __('Footer: Company Info', 'cloudsync'),
        'id'            => 'footer-1',
        'description'   => __('Left column of footer. Perfect for company logo, description, or contact details.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 2 - Navigation or quick links
    register_sidebar(array(
        'name'          => __('Footer: Quick Links', 'cloudsync'),
        'id'            => 'footer-2',
        'description'   => __('Second column of footer. Ideal for navigation menu, product links, or sitemap.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 3 - Support or resources
    register_sidebar(array(
        'name'          => __('Footer: Support & Resources', 'cloudsync'),
        'id'            => 'footer-3',
        'description'   => __('Third column of footer. Great for support links, documentation, or helpful resources.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 4 - Contact and social
    register_sidebar(array(
        'name'          => __('Footer: Contact & Social', 'cloudsync'),
        'id'            => 'footer-4',
        'description'   => __('Right column of footer. Perfect for contact information, social media links, or newsletter signup.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'cloudsync_widgets_init');

/**
 * Get theme version for cache busting
 * 
 * This function retrieves the current theme version from style.css header
 * and uses it for enqueuing stylesheets and scripts. This ensures that
 * when users update the theme, browsers will load fresh files instead
 * of serving cached versions that might be outdated.
 * 
 * @since 1.0.0
 * @return string Theme version number
 */
function cloudsync_get_theme_version() {

    // Get current theme object
    $theme = wp_get_theme();

    // Return version number from style.css header
    // Falls back to current timestamp if version is not found
    return $theme->get('Version') ?: time();
}

/**
 * Process and display pricing plan features from textarea input
 * 
 * Takes a textarea string with features (one per line) and converts it
 * into HTML list items with checkmark icons. Handles empty lines gracefully
 * and sanitizes each feature for security.
 * 
 * @param string $features_text Raw textarea input from Customizer
 * @return string HTML list items ready for output
 */
function cloudsync_get_pricing_features($features_text) {
    // If no features provided, return empty string to avoid broken HTML
    if (empty($features_text)) {
        return '';
    }

    // Split the textarea content by line breaks into an array
    $features = explode("\n", $features_text);
    $output = '';

    // Process each line individually
    foreach ($features as $feature) {
        // Remove whitespace from beginning and end of each line
        $feature = trim($feature);

        // Skip empty lines - users might accidentally add blank lines
        if (!empty($feature)) {
            // Escape HTML for security and build the list item
            $output .= '<li><i class="fas fa-check"></i>' . esc_html($feature) . '</li>';
        }
    }

    return $output;
}

/**
 * Helper function to safely retrieve Customizer values
 * 
 * This utility function provides a safe way to get theme modification values
 * with fallback defaults. It prevents errors if settings don't exist and
 * ensures consistent data retrieval throughout the theme.
 * 
 * @since 1.0.0
 * @param string $setting_name The name of the setting to retrieve
 * @param mixed  $default      The default value if setting doesn't exist
 * @return mixed               The setting value or default
 */
function cloudsync_get_customizer_value($setting_name, $default = '') {
    return get_theme_mod($setting_name, $default);
}


require_once get_template_directory() . '/inc/customizer.php';
