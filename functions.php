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

    // Add support for Gutenberg/Block Editor
    // This enables modern WordPress editing experience for additional pages
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');

    // Add support for custom color palette matching theme design
    add_theme_support('editor-color-palette', array(
        array(
            'name'  => __('Primary Purple', 'cloudsync'),
            'slug'  => 'primary',
            'color' => '#667eea',
        ),
        array(
            'name'  => __('Secondary Purple', 'cloudsync'),
            'slug'  => 'secondary',
            'color' => '#764ba2',
        ),
        array(
            'name'  => __('White', 'cloudsync'),
            'slug'  => 'white',
            'color' => '#ffffff',
        ),
        array(
            'name'  => __('Light Gray', 'cloudsync'),
            'slug'  => 'light-gray',
            'color' => '#b8b8d4',
        ),
        array(
            'name'  => __('Dark Background', 'cloudsync'),
            'slug'  => 'dark-bg',
            'color' => '#0f0f23',
        ),
    ));

    // Add support for custom font sizes consistent with theme typography
    add_theme_support('editor-font-sizes', array(
        array(
            'name' => __('Small', 'cloudsync'),
            'size' => 14,
            'slug' => 'small'
        ),
        array(
            'name' => __('Normal', 'cloudsync'),
            'size' => 16,
            'slug' => 'normal'
        ),
        array(
            'name' => __('Medium', 'cloudsync'),
            'size' => 20,
            'slug' => 'medium'
        ),
        array(
            'name' => __('Large', 'cloudsync'),
            'size' => 24,
            'slug' => 'large'
        ),
        array(
            'name' => __('Extra Large', 'cloudsync'),
            'size' => 32,
            'slug' => 'extra-large'
        ),
    ));
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

    // Performance optimization: Use critical CSS inline for above-the-fold content
    // Non-critical CSS is loaded asynchronously via performance module

    // Only enqueue base CSS for immediate loading (contains critical layout)
    wp_enqueue_style(
        'cloudsync-base',
        get_template_directory_uri() . '/assets/css/modules/base.css',
        array(),
        cloudsync_get_theme_version()
    );

    // Layout CSS - critical for structure
    wp_enqueue_style(
        'cloudsync-layout',
        get_template_directory_uri() . '/assets/css/modules/layout.css',
        array('cloudsync-base'),
        cloudsync_get_theme_version()
    );

    // Non-critical CSS files - these will be deferred by performance module
    wp_enqueue_style(
        'cloudsync-components',
        get_template_directory_uri() . '/assets/css/modules/components.css',
        array('cloudsync-base'),
        cloudsync_get_theme_version()
    );

    wp_enqueue_style(
        'cloudsync-gutenberg',
        get_template_directory_uri() . '/assets/css/modules/gutenberg.css',
        array('cloudsync-base'),
        cloudsync_get_theme_version()
    );

    wp_enqueue_style(
        'cloudsync-contact',
        get_template_directory_uri() . '/assets/css/modules/contact.css',
        array('cloudsync-base'),
        cloudsync_get_theme_version()
    );

    wp_enqueue_style(
        'cloudsync-404',
        get_template_directory_uri() . '/assets/css/modules/404.css',
        array('cloudsync-base'),
        cloudsync_get_theme_version()
    );

    // Main theme stylesheet - combines all sections
    wp_enqueue_style(
        'cloudsync-style',
        get_stylesheet_uri(),
        array('cloudsync-base', 'cloudsync-layout'),
        cloudsync_get_theme_version()
    );


    // Enqueue theme JavaScript with proper dependencies
    wp_enqueue_script(
        'cloudsync-theme-js',                        // Unique handle for this script
        get_template_directory_uri() . '/assets/js/theme.js',  // Path to JavaScript file
        array('jquery'),                             // Dependencies - requires jQuery
        cloudsync_get_theme_version(),               // Version for cache busting
        true                                         // Load in footer for better performance
    );

    // Localize AJAX data for contact form
    wp_localize_script(
        'cloudsync-theme-js',
        'cloudsync_ajax',
        array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('cloudsync_contact_nonce'),
            'strings'  => array(
                'sending'  => __('Sending...', 'cloudsync'),
                'error'    => __('An error occurred. Please try again.', 'cloudsync')
            )
        )
    );

    // Performance optimized Google Fonts loading
    // Preconnect is handled in performance module
    wp_enqueue_style(
        'cloudsync-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    // Font Awesome - will be deferred by performance module
    wp_enqueue_style(
        'cloudsync-font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        array(),
        '6.0.0'
    );
}
add_action('wp_enqueue_scripts', 'cloudsync_scripts');


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


/**
 * Handle AJAX contact form submission
 * 
 * Processes contact form data via AJAX, validates input,
 * sends email notification, and returns JSON response
 * Enhanced with rate limiting and security measures
 * 
 * @since 1.0.0
 */
function cloudsync_handle_contact_form() {

    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'], 'cloudsync_contact_nonce')) {
        wp_send_json_error(array('message' => __('Security verification failed', 'cloudsync')));
        wp_die();
    }

    // Rate limiting check
    if (!cloudsync_check_rate_limit()) {
        wp_send_json_error(array('message' => __('Too many requests. Please wait before submitting again.', 'cloudsync')));
        wp_die();
    }

    // Check honeypot field (anti-spam)
    if (!empty($_POST['website_url'])) {
        // Honeypot field filled - likely spam
        wp_send_json_error(array('message' => __('Spam detected', 'cloudsync')));
        wp_die();
    }

    // Sanitize and validate form data with enhanced security
    $name = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $subject = sanitize_text_field(wp_unslash($_POST['subject'] ?? ''));
    $message = sanitize_textarea_field(wp_unslash($_POST['message'] ?? ''));

    // Additional XSS protection - strip all HTML tags
    $name = wp_strip_all_tags($name);
    $subject = wp_strip_all_tags($subject);
    $message = wp_strip_all_tags($message);

    // Enhanced validation with length limits
    $errors = array();

    if (empty($name)) {
        $errors[] = __('Name is required', 'cloudsync');
    } elseif (strlen($name) < 2) {
        $errors[] = __('Name must be at least 2 characters long', 'cloudsync');
    } elseif (strlen($name) > 100) {
        $errors[] = __('Name must be less than 100 characters', 'cloudsync');
    }

    if (empty($email) || !is_email($email)) {
        $errors[] = __('Valid email is required', 'cloudsync');
    } elseif (strlen($email) > 254) {
        $errors[] = __('Email address is too long', 'cloudsync');
    }

    if (empty($subject)) {
        $errors[] = __('Subject is required', 'cloudsync');
    } elseif (strlen($subject) < 3) {
        $errors[] = __('Subject must be at least 3 characters long', 'cloudsync');
    } elseif (strlen($subject) > 200) {
        $errors[] = __('Subject must be less than 200 characters', 'cloudsync');
    }

    if (empty($message)) {
        $errors[] = __('Message is required', 'cloudsync');
    } elseif (strlen($message) < 10) {
        $errors[] = __('Message must be at least 10 characters long', 'cloudsync');
    } elseif (strlen($message) > 5000) {
        $errors[] = __('Message must be less than 5000 characters', 'cloudsync');
    }

    // Check for suspicious patterns (basic spam detection)
    if (cloudsync_contains_spam_patterns($name . ' ' . $subject . ' ' . $message)) {
        $errors[] = __('Message contains suspicious content', 'cloudsync');
    }

    // Return validation errors
    if (!empty($errors)) {
        wp_send_json_error(array('message' => implode('<br>', $errors)));
        wp_die();
    }

    // Prepare email
    $admin_email = get_option('admin_email');
    $site_name = get_bloginfo('name');

    $email_subject = sprintf('[%s] Contact Form: %s', $site_name, $subject);
    $email_message = sprintf(
        "New contact form submission from %s:\n\n" .
            "Name: %s\n" .
            "Email: %s\n" .
            "Subject: %s\n\n" .
            "Message:\n%s\n\n" .
            "---\n" .
            "This email was sent from the contact form on %s",
        $site_name,
        $name,
        $email,
        $subject,
        $message,
        home_url()
    );

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('From: %s <%s>', $site_name, $admin_email),
        sprintf('Reply-To: %s <%s>', $name, $email)
    );

    // Send email (or log for development)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        // Development mode - log email instead of sending
        error_log("CONTACT FORM EMAIL:\n" . $email_message);
        $email_sent = true; // Simulate success for testing
    } else {
        // Production mode - actually send email
        $email_sent = wp_mail($admin_email, $email_subject, $email_message, $headers);
    }

    if ($email_sent) {
        wp_send_json_success(array(
            'message' => __('Thank you! Your message has been sent successfully.', 'cloudsync')
        ));
    } else {
        wp_send_json_error(array(
            'message' => __('Sorry, there was an error sending your message. Please try again.', 'cloudsync')
        ));
    }

    wp_die();
}

// Register AJAX handlers for both logged-in and non-logged-in users
add_action('wp_ajax_cloudsync_contact_form', 'cloudsync_handle_contact_form');
add_action('wp_ajax_nopriv_cloudsync_contact_form', 'cloudsync_handle_contact_form');


/**
 * Rate limiting for contact form submissions
 * 
 * @since 1.0.0
 * @return bool True if request is allowed, false if rate limited
 */
function cloudsync_check_rate_limit() {
    $user_ip = cloudsync_get_user_ip();
    $transient_key = 'cloudsync_rate_limit_' . md5($user_ip);

    $submission_count = get_transient($transient_key);

    if ($submission_count === false) {
        // First submission in the time window
        set_transient($transient_key, 1, 5 * MINUTE_IN_SECONDS); // 5 minutes
        return true;
    }

    if ($submission_count >= 3) {
        // Too many submissions
        return false;
    }

    // Increment counter
    set_transient($transient_key, $submission_count + 1, 5 * MINUTE_IN_SECONDS);
    return true;
}

/**
 * Get user IP address safely
 * 
 * @since 1.0.0
 * @return string User IP address
 */
function cloudsync_get_user_ip() {
    // Check for various IP headers (for load balancers, proxies, etc.)
    $ip_headers = array(
        'HTTP_CF_CONNECTING_IP',     // Cloudflare
        'HTTP_CLIENT_IP',            // Proxy
        'HTTP_X_FORWARDED_FOR',      // Load balancer/proxy
        'HTTP_X_FORWARDED',          // Proxy
        'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
        'HTTP_FORWARDED_FOR',        // Proxy
        'HTTP_FORWARDED',            // Proxy
        'REMOTE_ADDR'                // Standard
    );

    foreach ($ip_headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Handle comma-separated list (X-Forwarded-For can contain multiple IPs)
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Validate IP address
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }

    return '0.0.0.0'; // Fallback
}

/**
 * Check for spam patterns in text
 * 
 * @since 1.0.0
 * @param string $text Text to check
 * @return bool True if spam patterns found
 */
function cloudsync_contains_spam_patterns($text) {
    $text = strtolower($text);

    // Common spam patterns
    $spam_patterns = array(
        // URLs and links
        'http://',
        'https://',
        'www.',
        '.com',
        '.org',
        '.net',

        // Common spam words
        'viagra',
        'cialis',
        'pharmacy',
        'casino',
        'poker',
        'lottery',
        'winner',
        'congratulations',
        'earn money',
        'make money',
        'work from home',
        'click here',
        'free offer',
        'limited time',

        // Suspicious patterns
        'dear sir/madam',
        'dear sir',
        'dear madam',
    );

    foreach ($spam_patterns as $pattern) {
        if (strpos($text, $pattern) !== false) {
            return true;
        }
    }

    // Check for excessive repeated characters
    if (preg_match('/(.)\1{10,}/', $text)) {
        return true;
    }

    // Check for excessive capitalization
    $caps_ratio = strlen(preg_replace('/[^A-Z]/', '', $text)) / max(strlen($text), 1);
    if ($caps_ratio > 0.7 && strlen($text) > 10) {
        return true;
    }

    return false;
}

// Include additional theme functionality files
require_once get_template_directory() . '/inc/template-functions.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/seo.php';
require_once get_template_directory() . '/inc/security.php';
require_once get_template_directory() . '/inc/performance.php';
