<?php

/**
 * Handle AJAX contact form submission
 * 
 * Processes contact form data via AJAX, validates input,
 * sends email notification, and returns JSON response
 * Enhanced with rate limiting and security measures
 * 
 * @since 1.0.0
 * @uses $_POST Superglobal containing form data
 */
function cloudsync_handle_contact_form() {
    // Declare superglobals for IDE recognition
    global $_POST;

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
 * Handle AJAX newsletter subscription
 * 
 * Processes newsletter subscription via AJAX, validates email,
 * stores subscription data, and returns JSON response
 * Enhanced with rate limiting and security measures
 * 
 * @since 1.0.0
 * @uses $_POST Superglobal containing form data
 */
function cloudsync_handle_newsletter_form() {
    // Declare superglobals for IDE recognition
    global $_POST;

    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'], 'cloudsync_newsletter_nonce')) {
        wp_send_json_error(array('message' => __('Security verification failed', 'cloudsync')));
        wp_die();
    }

    // Rate limiting check
    if (!cloudsync_check_newsletter_rate_limit()) {
        wp_send_json_error(array('message' => __('Too many subscription requests. Please wait before trying again.', 'cloudsync')));
        wp_die();
    }

    // Check honeypot field (anti-spam)
    if (!empty($_POST['website_url'])) {
        // Honeypot field filled - likely spam
        wp_send_json_error(array('message' => __('Spam detected', 'cloudsync')));
        wp_die();
    }

    // Sanitize and validate form data
    $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $consent = !empty($_POST['consent']) ? true : false;

    // Enhanced validation
    $errors = array();

    if (empty($email) || !is_email($email)) {
        $errors[] = __('Valid email is required', 'cloudsync');
    } elseif (strlen($email) > 254) {
        $errors[] = __('Email address is too long', 'cloudsync');
    }

    if (!$consent) {
        $errors[] = __('Please agree to subscribe to our newsletter', 'cloudsync');
    }

    // Check if email is already subscribed
    if (cloudsync_is_email_subscribed($email)) {
        $errors[] = __('This email is already subscribed to our newsletter', 'cloudsync');
    }

    // Return validation errors
    if (!empty($errors)) {
        wp_send_json_error(array('message' => implode('<br>', $errors)));
        wp_die();
    }

    // Check if Mailchimp integration is enabled
    $mailchimp_enabled = get_theme_mod('cloudsync_mailchimp_enabled', false);
    
    if ($mailchimp_enabled && function_exists('cloudsync_mailchimp')) {
        // Use Mailchimp integration
        $mailchimp = cloudsync_mailchimp();
        
        if ($mailchimp->is_configured()) {
            $subscription_result = $mailchimp->subscribe_email($email);
            
            if ($subscription_result['success']) {
                // Log successful Mailchimp subscription
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    cloudsync_log_newsletter_event("MAILCHIMP SUBSCRIPTION SUCCESS:\n" .
                        "Email: $email\n" .
                        "Time: " . current_time('mysql') . "\n" .
                        "IP: " . cloudsync_get_user_ip() . "\n" .
                        "Service: Mailchimp\n" .
                        str_repeat('-', 50));
                }
                
                wp_send_json_success(array(
                    'message' => $subscription_result['message']
                ));
            } else {
                // Handle Mailchimp errors
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    cloudsync_log_newsletter_event("MAILCHIMP SUBSCRIPTION ERROR:\n" .
                        "Email: $email\n" .
                        "Time: " . current_time('mysql') . "\n" .
                        "Error: " . $subscription_result['message'] . "\n" .
                        str_repeat('-', 50));
                }
                
                wp_send_json_error(array(
                    'message' => $subscription_result['message']
                ));
            }
        } else {
            wp_send_json_error(array(
                'message' => __('Mailchimp is not properly configured.', 'cloudsync')
            ));
        }
    } else {
        // Use local database storage (fallback)
        $subscription_result = cloudsync_add_newsletter_subscriber($email);

        if ($subscription_result) {
            // Log successful local subscription
            if (defined('WP_DEBUG') && WP_DEBUG) {
                cloudsync_log_newsletter_event("LOCAL SUBSCRIPTION SUCCESS:\n" .
                    "Email: $email\n" .
                    "Time: " . current_time('mysql') . "\n" .
                    "IP: " . cloudsync_get_user_ip() . "\n" .
                    "Service: Local Database\n" .
                    str_repeat('-', 50));
            }

            wp_send_json_success(array(
                'message' => __('Thank you! You have been successfully subscribed to our newsletter.', 'cloudsync')
            ));
        } else {
            // Log local subscription error
            if (defined('WP_DEBUG') && WP_DEBUG) {
                cloudsync_log_newsletter_event("LOCAL SUBSCRIPTION ERROR:\n" .
                    "Email: $email\n" .
                    "Time: " . current_time('mysql') . "\n" .
                    "Error: Failed to save subscriber to local database\n" .
                    str_repeat('-', 50));
            }

            wp_send_json_error(array(
                'message' => __('Sorry, there was an error with your subscription. Please try again.', 'cloudsync')
            ));
        }
    }

    wp_die();
}

// Register AJAX handlers for newsletter subscription
add_action('wp_ajax_cloudsync_newsletter_form', 'cloudsync_handle_newsletter_form');
add_action('wp_ajax_nopriv_cloudsync_newsletter_form', 'cloudsync_handle_newsletter_form');


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
 * @uses $_SERVER Superglobal containing server information
 * @return string User IP address
 */
function cloudsync_get_user_ip() {
    // Declare superglobals for IDE recognition
    global $_SERVER;

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

/**
 * Rate limiting for newsletter subscription submissions
 * 
 * @since 1.0.0
 * @return bool True if request is allowed, false if rate limited
 */
function cloudsync_check_newsletter_rate_limit() {
    $user_ip = cloudsync_get_user_ip();
    $transient_key = 'cloudsync_newsletter_rate_limit_' . md5($user_ip);

    $submission_count = get_transient($transient_key);

    if ($submission_count === false) {
        // First submission in the time window
        set_transient($transient_key, 1, 10 * MINUTE_IN_SECONDS); // 10 minutes
        return true;
    }

    if ($submission_count >= 455) {
        // Too many newsletter subscription attempts
        return false;
    }

    // Increment counter
    set_transient($transient_key, $submission_count + 1, 10 * MINUTE_IN_SECONDS);
    return true;
}

/**
 * Check if email is already subscribed to newsletter
 * 
 * @since 1.0.0
 * @param string $email Email address to check
 * @return bool True if already subscribed, false otherwise
 */
function cloudsync_is_email_subscribed($email) {
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());
    $email = strtolower($email);

    if (isset($subscribers[$email])) {
        $subscriber = $subscribers[$email];

        // New format (array with status)
        if (is_array($subscriber)) {
            return isset($subscriber['status']) && $subscriber['status'] === 'active';
        } else {
            // Old format (just email string) - consider as active
            return true;
        }
    }

    // Also check in old format (indexed array with email strings)
    return in_array($email, $subscribers, true);
}

/**
 * Add newsletter subscriber
 * 
 * @since 1.0.0
 * @param string $email Email address to add
 * @return bool True on success, false on failure
 */
function cloudsync_add_newsletter_subscriber($email) {
    $email = strtolower($email);
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());

    // Generate confirmation token
    $token = wp_generate_password(32, false);

    // Add subscriber data
    $subscribers[$email] = array(
        'email' => $email,
        'subscribed_at' => current_time('mysql'),
        'ip_address' => cloudsync_get_user_ip(),
        'status' => 'active',
        'confirmation_token' => $token,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    );

    // Save to database
    $result = update_option('cloudsync_newsletter_subscribers', $subscribers);

    // Log subscription for development/debugging
    if (defined('WP_DEBUG') && WP_DEBUG) {
        cloudsync_log_newsletter_event("Newsletter subscriber added: $email at " . current_time('mysql'));
    }

    return $result;
}

/**
 * Remove newsletter subscriber (unsubscribe)
 * 
 * @since 1.0.0
 * @param string $email Email address to remove
 * @return bool True on success, false on failure
 */
function cloudsync_remove_newsletter_subscriber($email) {
    $email = strtolower($email);
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());

    if (isset($subscribers[$email])) {
        // New format (array with status)
        if (is_array($subscribers[$email])) {
            $subscribers[$email]['status'] = 'unsubscribed';
            $subscribers[$email]['unsubscribed_at'] = current_time('mysql');
        } else {
            // Old format - convert to new format and unsubscribe
            $subscribers[$email] = array(
                'email' => $email,
                'subscribed_at' => 'unknown',
                'ip_address' => 'unknown',
                'status' => 'unsubscribed',
                'unsubscribed_at' => current_time('mysql'),
                'confirmation_token' => wp_generate_password(32, false),
                'user_agent' => 'unknown'
            );
        }

        return update_option('cloudsync_newsletter_subscribers', $subscribers);
    }

    // Check old format (indexed array with email strings)
    $key = array_search($email, $subscribers, true);
    if ($key !== false) {
        // Convert to new format
        unset($subscribers[$key]);
        $subscribers[$email] = array(
            'email' => $email,
            'subscribed_at' => 'unknown',
            'ip_address' => 'unknown',
            'status' => 'unsubscribed',
            'unsubscribed_at' => current_time('mysql'),
            'confirmation_token' => wp_generate_password(32, false),
            'user_agent' => 'unknown'
        );
        return update_option('cloudsync_newsletter_subscribers', $subscribers);
    }

    return false;
}

/**
 * Get all newsletter subscribers
 * 
 * @since 1.0.0
 * @param string $status Filter by status (active, unsubscribed, all)
 * @return array Array of subscribers
 */
function cloudsync_get_newsletter_subscribers($status = 'active') {
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());

    if ($status === 'all') {
        return $subscribers;
    }

    return array_filter($subscribers, function ($subscriber) use ($status) {
        // Handle old format (just email strings) and new format (arrays)
        if (is_array($subscriber)) {
            return isset($subscriber['status']) && $subscriber['status'] === $status;
        } else {
            // Old format - treat as active subscriber
            return $status === 'active';
        }
    });
}

/**
 * Log newsletter events to custom file in project root
 * 
 * @since 1.0.0
 * @param string $message Message to log
 */
function cloudsync_log_newsletter_event($message) {
    // Get WordPress root directory
    $log_file = ABSPATH . 'newsletter.log';

    // Prepare log entry with timestamp
    $timestamp = current_time('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message\n\n";

    // Write to log file (create if doesn't exist)
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

/**
 * Clean up old newsletter subscriber format (numeric keys)
 * Call this function once to remove old indexed entries
 * 
 * @since 1.0.0
 * @return bool True on success
 */
function cloudsync_cleanup_old_newsletter_subscribers() {
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());
    $cleaned_subscribers = array();

    foreach ($subscribers as $key => $value) {
        // Keep only entries with email keys (not numeric)
        if (!is_numeric($key) && is_string($key) && strpos($key, '@') !== false) {
            $cleaned_subscribers[$key] = $value;
        }
    }

    return update_option('cloudsync_newsletter_subscribers', $cleaned_subscribers);
}

// Auto-cleanup old entries on admin init (run once)
add_action('admin_init', function () {
    if (!get_option('cloudsync_newsletter_cleanup_done', false)) {
        cloudsync_cleanup_old_newsletter_subscribers();
        update_option('cloudsync_newsletter_cleanup_done', true);
    }
});
