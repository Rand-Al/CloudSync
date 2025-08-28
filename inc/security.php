<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Basic security improvements for CloudSync theme
 */
function cloudsync_basic_security() {
    // Remove WordPress version from head (security through obscurity)
    remove_action('wp_head', 'wp_generator');

    // Disable XML-RPC (reduces attack surface)
    add_filter('xmlrpc_enabled', '__return_false');

    // Remove unnecessary meta tags
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
}
add_action('init', 'cloudsync_basic_security');

/**
 * Enhanced sanitization for theme forms
 */
function cloudsync_sanitize_input($input, $type = 'text') {
    switch ($type) {
        case 'email':
            return sanitize_email($input);
        case 'textarea':
            return sanitize_textarea_field($input);
        default:
            return sanitize_text_field($input);
    }
}
