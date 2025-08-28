<?php

/**
 * CloudSync Forms Handler Module
 * 
 * This module handles all form processing functionality for the CloudSync theme.
 * It focuses specifically on contact form validation, processing, and email delivery
 * while relying on the base security module for fundamental security operations.
 * 
 * ARCHITECTURAL PRINCIPLE:
 * This is a SPECIALIZED module that depends on the base security module.
 * It provides form-specific functionality while using shared security utilities.
 * Think of it as the kitchen of a house - it has specific equipment for cooking,
 * but it relies on the house's electrical and plumbing infrastructure.
 * 
 * DEPENDENCIES:
 * - Requires inc/security.php to be loaded first
 * - Uses functions: cloudsync_get_user_ip(), cloudsync_check_rate_limit(), 
 *   cloudsync_sanitize_input(), cloudsync_validate_honeypot(), cloudsync_detect_spam_patterns()
 * 
 * FEATURES PROVIDED:
 * - AJAX contact form processing with full validation
 * - Email composition and delivery
 * - Form-specific spam protection
 * - User-friendly error messaging
 * - Development-friendly debugging
 * 
 * @package CloudSync
 * @version 1.0.0
 * @since 1.0.0
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Initialize form handling functionality
 * 
 * This function registers all the WordPress hooks needed for form processing.
 * It sets up AJAX handlers for both logged-in and non-logged-in users, ensuring
 * the contact form works regardless of the visitor's authentication status.
 * 
 * WordPress AJAX system requires separate hooks for different user types:
 * - wp_ajax_{action} = for logged-in users
 * - wp_ajax_nopriv_{action} = for non-logged-in users (most website visitors)
 * 
 * @since 1.0.0
 */
function cloudsync_init_forms() {

    // Register AJAX handlers for contact form submission
    // Both hooks point to the same function for consistent behavior
    add_action('wp_ajax_cloudsync_contact_form', 'cloudsync_handle_contact_form');
    add_action('wp_ajax_nopriv_cloudsync_contact_form', 'cloudsync_handle_contact_form');

    // Initialize contact form scripts and styles
    add_action('wp_enqueue_scripts', 'cloudsync_enqueue_form_assets');
}
add_action('init', 'cloudsync_init_forms');

/**
 * Enqueue form-specific JavaScript and localization data
 * 
 * This function ensures that the contact form has all the JavaScript functionality
 * and server-side data it needs to work properly. It only loads these resources
 * when actually needed to optimize performance.
 * 
 * LOCALIZATION DATA INCLUDES:
 * - AJAX URL for form submission
 * - Security nonce for WordPress CSRF protection  
 * - User-facing text strings for internationalization
 * 
 * @since 1.0.0
 */
function cloudsync_enqueue_form_assets() {

    // Only enqueue form assets on pages that actually have forms
    // This optimization prevents unnecessary HTTP requests on other pages
    if (is_front_page() || is_page_template('page-contact.php')) {

        // Localize AJAX data for the contact form JavaScript
        // This makes server-side data available to client-side scripts
        wp_localize_script(
            'cloudsync-theme-js',  // Script handle (defined in functions.php)
            'cloudsync_ajax',      // JavaScript object name
            array(
                'ajax_url' => admin_url('admin-ajax.php'),                    // WordPress AJAX endpoint
                'nonce'    => wp_create_nonce('cloudsync_contact_nonce'),     // Security token
                'strings'  => array(
                    'sending'    => __('Sending...', 'cloudsync'),
                    'sent'       => __('Message sent successfully!', 'cloudsync'),
                    'error'      => __('An error occurred. Please try again.', 'cloudsync'),
                    'validation' => __('Please check your input and try again.', 'cloudsync'),
                ),
            )
        );
    }
}

/**
 * Main AJAX handler for contact form submissions
 * 
 * This is the heart of the contact form system. It processes form data through
 * multiple security and validation layers before attempting to send the email.
 * The function uses a defensive programming approach - it assumes the input
 * could be malicious and validates everything thoroughly.
 * 
 * PROCESSING FLOW:
 * 1. Security validation (nonce, rate limiting, honeypot)
 * 2. Input sanitization and validation
 * 3. Spam detection analysis
 * 4. Email composition and delivery
 * 5. Response generation (success or error)
 * 
 * ERROR HANDLING PHILOSOPHY:
 * We provide specific error messages to help legitimate users fix problems,
 * but we avoid giving detailed information that could help attackers.
 * 
 * @since 1.0.0
 */
function cloudsync_handle_contact_form() {

    // === SECURITY VALIDATION LAYER ===

    // First line of defense: verify the WordPress nonce
    // This prevents Cross-Site Request Forgery (CSRF) attacks where malicious
    // sites try to submit forms on behalf of users without their knowledge
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'cloudsync_contact_nonce')) {
        wp_send_json_error(array(
            'message' => __('Security verification failed. Please refresh the page and try again.', 'cloudsync')
        ));
        wp_die();
    }

    // Second line of defense: rate limiting
    // Prevent spam attacks by limiting how often the same IP can submit forms
    // Uses the base security function with contact-form-specific parameters
    if (!cloudsync_check_rate_limit('contact_form', 300, 3)) { // 3 attempts per 5 minutes
        wp_send_json_error(array(
            'message' => __('Too many requests. Please wait a few minutes before submitting again.', 'cloudsync')
        ));
        wp_die();
    }

    // Third line of defense: honeypot validation
    // Check the invisible spam trap field that bots typically fill out
    $honeypot = isset($_POST['website_url']) ? $_POST['website_url'] : '';
    if (!cloudsync_validate_honeypot($honeypot)) {
        // Don't give specific error messages to potential spammers
        // Log the attempt for analysis but respond generically
        error_log('CloudSync: Honeypot spam detected from IP: ' . cloudsync_get_user_ip());
        wp_send_json_error(array(
            'message' => __('Message could not be processed. Please try again.', 'cloudsync')
        ));
        wp_die();
    }

    // === INPUT SANITIZATION AND VALIDATION ===

    // Sanitize all form inputs using our enhanced security functions
    // wp_unslash() removes WordPress's automatic slashing of form data
    $name = cloudsync_sanitize_input(wp_unslash($_POST['name'] ?? ''), 'text');
    $email = cloudsync_sanitize_input(wp_unslash($_POST['email'] ?? ''), 'email');
    $subject = cloudsync_sanitize_input(wp_unslash($_POST['subject'] ?? ''), 'text');
    $message = cloudsync_sanitize_input(wp_unslash($_POST['message'] ?? ''), 'textarea');

    // Perform comprehensive validation with user-friendly error messages
    $validation_errors = cloudsync_validate_contact_data($name, $email, $subject, $message);

    // If validation fails, return specific errors to help the user fix the problems
    if (!empty($validation_errors)) {
        wp_send_json_error(array(
            'message' => implode('<br>', $validation_errors),
            'field_errors' => $validation_errors // For field-specific highlighting
        ));
        wp_die();
    }

    // === SPAM DETECTION ANALYSIS ===

    // Analyze message content for spam patterns
    // Combine all text fields for comprehensive analysis
    $combined_content = $name . ' ' . $subject . ' ' . $message;
    if (cloudsync_detect_spam_patterns($combined_content)) {

        // Log potential spam for analysis (helps improve detection)
        error_log(sprintf(
            'CloudSync: Potential spam detected from %s - Subject: %s',
            cloudsync_get_user_ip(),
            substr($subject, 0, 50)
        ));

        // Return generic error - don't tell spammers their content was flagged
        wp_send_json_error(array(
            'message' => __('Message could not be processed. Please review your content and try again.', 'cloudsync')
        ));
        wp_die();
    }

    // === EMAIL COMPOSITION AND DELIVERY ===

    // If we've made it this far, the submission appears legitimate
    // Compose and send the email notification
    $email_sent = cloudsync_send_contact_email($name, $email, $subject, $message);

    // Return appropriate response based on email delivery result
    if ($email_sent) {
        wp_send_json_success(array(
            'message' => __('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'cloudsync')
        ));
    } else {
        // Email delivery failed - this could be a server configuration issue
        // Log the failure for troubleshooting
        error_log(sprintf(
            'CloudSync: Email delivery failed for contact form submission from %s',
            cloudsync_get_user_ip()
        ));

        wp_send_json_error(array(
            'message' => __('Sorry, there was a problem sending your message. Please try again or contact us directly.', 'cloudsync')
        ));
    }

    wp_die(); // Always end AJAX handlers with wp_die()
}

/**
 * Comprehensive validation for contact form data
 * 
 * This function performs detailed validation of all contact form fields,
 * providing specific, actionable error messages that help users fix problems.
 * It balances security requirements with user experience.
 * 
 * VALIDATION CHECKS:
 * - Required field validation
 * - Length limits (prevent DoS and ensure reasonable content)
 * - Format validation (email structure, character restrictions)
 * - Content quality checks (meaningful input, not just gibberish)
 * 
 * @since 1.0.0
 * @param string $name    Sanitized name input
 * @param string $email   Sanitized email input  
 * @param string $subject Sanitized subject input
 * @param string $message Sanitized message input
 * @return array Array of validation error messages (empty if validation passes)
 */
function cloudsync_validate_contact_data($name, $email, $subject, $message) {

    $errors = array();

    // === NAME VALIDATION ===

    if (empty($name)) {
        $errors[] = __('Please enter your name.', 'cloudsync');
    } elseif (strlen($name) < 2) {
        $errors[] = __('Name must be at least 2 characters long.', 'cloudsync');
    } elseif (strlen($name) > 100) {
        $errors[] = __('Name must be less than 100 characters long.', 'cloudsync');
    } elseif (preg_match('/[^a-zA-Z\s\-\.\']/', $name)) {
        // Allow letters, spaces, hyphens, periods, and apostrophes
        $errors[] = __('Name contains invalid characters. Please use only letters, spaces, hyphens, and apostrophes.', 'cloudsync');
    }

    // === EMAIL VALIDATION ===

    if (empty($email)) {
        $errors[] = __('Please enter your email address.', 'cloudsync');
    } elseif (!is_email($email)) {
        // WordPress function for comprehensive email validation
        $errors[] = __('Please enter a valid email address.', 'cloudsync');
    } elseif (strlen($email) > 254) {
        // RFC 5321 maximum email length
        $errors[] = __('Email address is too long.', 'cloudsync');
    }

    // === SUBJECT VALIDATION ===

    if (empty($subject)) {
        $errors[] = __('Please enter a subject for your message.', 'cloudsync');
    } elseif (strlen($subject) < 3) {
        $errors[] = __('Subject must be at least 3 characters long.', 'cloudsync');
    } elseif (strlen($subject) > 200) {
        $errors[] = __('Subject must be less than 200 characters long.', 'cloudsync');
    } elseif (trim($subject) !== $subject) {
        $errors[] = __('Subject has excessive whitespace. Please clean it up.', 'cloudsync');
    }

    // === MESSAGE VALIDATION ===

    if (empty($message)) {
        $errors[] = __('Please enter your message.', 'cloudsync');
    } elseif (strlen($message) < 10) {
        $errors[] = __('Message must be at least 10 characters long.', 'cloudsync');
    } elseif (strlen($message) > 5000) {
        $errors[] = __('Message must be less than 5000 characters long.', 'cloudsync');
    } elseif (cloudsync_is_gibberish($message)) {
        $errors[] = __('Please enter a meaningful message.', 'cloudsync');
    }

    return $errors;
}

/**
 * Detect gibberish or meaningless input in message content
 * 
 * This function performs basic content quality analysis to detect messages
 * that are likely spam, testing, or otherwise meaningless. It uses simple
 * heuristics that catch common patterns without being overly restrictive.
 * 
 * DETECTION METHODS:
 * - Excessive repetition of the same character or word
 * - Messages consisting entirely of numbers or symbols
 * - Random character sequences that don't form words
 * - Messages that are just keyboard mashing
 * 
 * @since 1.0.0
 * @param string $text Message content to analyze
 * @return bool True if content appears to be gibberish, false if it seems legitimate
 */
function cloudsync_is_gibberish($text) {

    // Remove whitespace for analysis
    $clean_text = preg_replace('/\s+/', '', strtolower($text));

    // Check for excessive repetition of single characters
    // Example: "aaaaaaaaaa" or "111111111"
    if (preg_match('/(.)\1{20,}/', $clean_text)) {
        return true;
    }

    // Check for messages that are mostly numbers
    $letter_count = preg_match_all('/[a-z]/', $clean_text);
    $total_count = strlen($clean_text);

    if ($total_count > 0 && ($letter_count / $total_count) < 0.3) {
        // Less than 30% letters suggests it's mostly numbers/symbols
        return true;
    }

    // Check for excessive repetition of short sequences
    // Example: "abcabcabcabc" or "123123123"
    if (preg_match('/(.{2,5})\1{5,}/', $clean_text)) {
        return true;
    }

    return false;
}

/**
 * Compose and send contact form email notification
 * 
 * This function handles the actual email composition and delivery for contact
 * form submissions. It creates professional, well-formatted email notifications
 * that provide all necessary information to the site administrator.
 * 
 * EMAIL FEATURES:
 * - Professional formatting with clear information hierarchy
 * - Proper headers including Reply-To for easy response
 * - Security information for administration (IP address, timestamp)
 * - Development-friendly logging when in debug mode
 * 
 * @since 1.0.0
 * @param string $name    Validated sender name
 * @param string $email   Validated sender email
 * @param string $subject Validated message subject
 * @param string $message Validated message content
 * @return bool True if email was sent successfully, false on failure
 */
function cloudsync_send_contact_email($name, $email, $subject, $message) {

    // Get site information for email composition
    $site_name = get_bloginfo('name');
    $admin_email = get_option('admin_email');
    $site_url = home_url();

    // Compose the email subject with site branding
    $email_subject = sprintf(
        '[%s] Contact Form: %s',
        $site_name,
        $subject
    );

    // Build comprehensive email body with all relevant information
    $email_body = sprintf(
        "New contact form submission received:\n\n" .
            "CONTACT INFORMATION:\n" .
            "Name: %s\n" .
            "Email: %s\n" .
            "Subject: %s\n\n" .
            "MESSAGE:\n" .
            "%s\n\n" .
            "SUBMISSION DETAILS:\n" .
            "Website: %s\n" .
            "Date: %s\n" .
            "IP Address: %s\n" .
            "User Agent: %s\n\n" .
            "---\n" .
            "This email was automatically generated by the contact form on %s\n" .
            "To reply to this message, simply reply to this email.",

        $name,
        $email,
        $subject,
        $message,
        $site_url,
        current_time('mysql'),
        cloudsync_get_user_ip(),
        isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown',
        $site_name
    );

    // Set up email headers for proper delivery and formatting
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('From: %s <%s>', $site_name, $admin_email),
        sprintf('Reply-To: %s <%s>', $name, $email),
    );

    // Handle email sending based on environment
    if (defined('WP_DEBUG') && WP_DEBUG) {

        // Development mode: log email instead of sending
        // This prevents test emails from cluttering your inbox during development
        error_log("=== CONTACT FORM EMAIL (DEBUG MODE) ===\n" .
            "To: " . $admin_email . "\n" .
            "Subject: " . $email_subject . "\n\n" .
            $email_body . "\n" .
            "==========================================");

        return true; // Simulate successful sending for development

    } else {

        // Production mode: actually send the email
        return wp_mail($admin_email, $email_subject, $email_body, $headers);
    }
}
