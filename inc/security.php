<?php

/**
 * CloudSync Security Module
 * 
 * Enhanced security features including Content Security Policy,
 * additional XSS protection, and security headers
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
 * Initialize security features
 * 
 * @since 1.0.0
 */
function cloudsync_security_init() {
    // Add security headers
    add_action('send_headers', 'cloudsync_add_security_headers');
    
    // Add Content Security Policy
    add_action('wp_head', 'cloudsync_add_csp_header', 1);
    
    // Enhanced login security
    add_filter('authenticate', 'cloudsync_limit_login_attempts', 30, 3);
    
    // Remove WordPress version from head
    remove_action('wp_head', 'wp_generator');
    
    // Disable XML-RPC if not needed
    add_filter('xmlrpc_enabled', '__return_false');
    
    // Remove unnecessary header information
    add_filter('wp_headers', 'cloudsync_remove_unnecessary_headers');
}
add_action('init', 'cloudsync_security_init');

/**
 * Add security headers
 * 
 * @since 1.0.0
 */
function cloudsync_add_security_headers() {
    // Prevent the site from being embedded in frames (clickjacking protection)
    if (!headers_sent()) {
        header('X-Frame-Options: SAMEORIGIN');
        
        // Prevent MIME type sniffing
        header('X-Content-Type-Options: nosniff');
        
        // Enable XSS filtering in browsers
        header('X-XSS-Protection: 1; mode=block');
        
        // Enforce HTTPS (if site is using HTTPS)
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }
        
        // Referrer policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Feature policy (limit browser features)
        header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');
    }
}

/**
 * Add Content Security Policy header
 * 
 * @since 1.0.0
 */
function cloudsync_add_csp_header() {
    // Build CSP policy
    $csp_directives = array(
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
        "img-src 'self' data: https:",
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    );
    
    $csp_policy = implode('; ', $csp_directives);
    
    // Output as meta tag (header method may conflict with some setups)
    echo '<meta http-equiv="Content-Security-Policy" content="' . esc_attr($csp_policy) . '">' . "\n";
}

/**
 * Remove unnecessary headers that reveal information
 * 
 * @since 1.0.0
 * @param array $headers HTTP headers
 * @return array Modified headers
 */
function cloudsync_remove_unnecessary_headers($headers) {
    // Remove Server header if possible
    unset($headers['Server']);
    
    // Remove X-Powered-By if present
    unset($headers['X-Powered-By']);
    
    return $headers;
}

/**
 * Limit login attempts (basic protection)
 * 
 * @since 1.0.0
 * @param WP_User|WP_Error|null $user
 * @param string $username
 * @param string $password
 * @return WP_User|WP_Error
 */
function cloudsync_limit_login_attempts($user, $username, $password) {
    if (!empty($username) && !empty($password)) {
        $user_ip = cloudsync_get_user_ip();
        $transient_key = 'cloudsync_login_attempts_' . md5($user_ip);
        
        $attempts = get_transient($transient_key);
        
        if ($attempts === false) {
            $attempts = 0;
        }
        
        // If too many attempts, block the login
        if ($attempts >= 5) {
            return new WP_Error(
                'too_many_attempts',
                __('Too many failed login attempts. Please try again later.', 'cloudsync'),
                array('status' => 429)
            );
        }
        
        // If authentication fails, increment attempts
        if (is_wp_error($user)) {
            set_transient($transient_key, $attempts + 1, 15 * MINUTE_IN_SECONDS);
        } else {
            // If login successful, clear attempts
            delete_transient($transient_key);
        }
    }
    
    return $user;
}

/**
 * Enhanced sanitization for form inputs
 * 
 * @since 1.0.0
 * @param string $input Input to sanitize
 * @param string $type Type of input (text, email, textarea)
 * @return string Sanitized input
 */
function cloudsync_enhanced_sanitize($input, $type = 'text') {
    // Remove any null bytes
    $input = str_replace(chr(0), '', $input);
    
    // Remove control characters except tab, newline, and carriage return
    $input = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $input);
    
    switch ($type) {
        case 'email':
            $input = sanitize_email($input);
            break;
            
        case 'textarea':
            $input = sanitize_textarea_field($input);
            // Additional filtering for textarea content
            $input = wp_kses($input, array());
            break;
            
        case 'text':
        default:
            $input = sanitize_text_field($input);
            // Strip all HTML tags
            $input = wp_strip_all_tags($input);
            break;
    }
    
    return $input;
}

/**
 * Check if input contains potentially dangerous content
 * 
 * @since 1.0.0
 * @param string $input Input to check
 * @return bool True if dangerous content found
 */
function cloudsync_contains_dangerous_content($input) {
    $dangerous_patterns = array(
        // Script injection attempts
        '<script',
        '</script>',
        'javascript:',
        'vbscript:',
        'onload=',
        'onerror=',
        'onclick=',
        'onmouseover=',
        
        // SQL injection attempts
        'union select',
        'drop table',
        'delete from',
        'insert into',
        'update set',
        
        // File inclusion attempts
        '../',
        '..\\',
        '/etc/passwd',
        '/windows/system32',
        
        // Other suspicious patterns
        'eval(',
        'base64_decode',
        'file_get_contents',
        'fopen(',
        'fwrite(',
        'system(',
        'exec(',
        'shell_exec',
        'passthru(',
    );
    
    $input_lower = strtolower($input);
    
    foreach ($dangerous_patterns as $pattern) {
        if (strpos($input_lower, $pattern) !== false) {
            return true;
        }
    }
    
    return false;
}

/**
 * Log security events
 * 
 * @since 1.0.0
 * @param string $event Event type
 * @param string $details Event details
 * @param string $severity Severity level (low, medium, high)
 */
function cloudsync_log_security_event($event, $details, $severity = 'medium') {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        $user_ip = cloudsync_get_user_ip();
        $timestamp = current_time('mysql');
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';
        
        $log_entry = sprintf(
            "[%s] SECURITY [%s] %s - %s (IP: %s, User-Agent: %s)\n",
            $timestamp,
            strtoupper($severity),
            $event,
            $details,
            $user_ip,
            $user_agent
        );
        
        error_log($log_entry);
    }
}

/**
 * Validate file upload security (if file uploads are added later)
 * 
 * @since 1.0.0
 * @param array $file File array from $_FILES
 * @return bool|WP_Error True if valid, WP_Error if invalid
 */
function cloudsync_validate_file_upload($file) {
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return new WP_Error('file_too_large', __('File size too large. Maximum 5MB allowed.', 'cloudsync'));
    }
    
    // Allowed file types
    $allowed_types = array('jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx');
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file_extension, $allowed_types)) {
        return new WP_Error('invalid_file_type', __('Invalid file type. Only images and documents allowed.', 'cloudsync'));
    }
    
    // Check MIME type matches extension
    $allowed_mimes = array(
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'gif'  => 'image/gif',
        'pdf'  => 'application/pdf',
        'doc'  => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (isset($allowed_mimes[$file_extension]) && $file['type'] !== $allowed_mimes[$file_extension]) {
        return new WP_Error('mime_mismatch', __('File type does not match extension.', 'cloudsync'));
    }
    
    return true;
}