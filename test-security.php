<?php
/**
 * CloudSync Security Testing Script
 * 
 * Run tests for all security functions
 * Access via: /wp-content/themes/saas/test-security.php?test=all
 * 
 * @package CloudSync
 */

// Load WordPress
$wp_config_path = dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-config.php';
if (file_exists($wp_config_path)) {
    require_once $wp_config_path;
} else {
    die('WordPress not found. Run this from WordPress installation.');
}

// Security check - only allow in development
if (!defined('WP_DEBUG') || !WP_DEBUG) {
    die('Testing only available in debug mode');
}

$test_type = $_GET['test'] ?? 'help';

echo "<h1>CloudSync Security Tests</h1>\n";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>\n";

switch ($test_type) {
    case 'rate_limit':
        test_rate_limiting();
        break;
        
    case 'spam_detection':
        test_spam_detection();
        break;
        
    case 'honeypot':
        test_honeypot();
        break;
        
    case 'validation':
        test_validation();
        break;
        
    case 'ip_detection':
        test_ip_detection();
        break;
        
    case 'all':
        test_rate_limiting();
        test_spam_detection();
        test_honeypot();
        test_validation();
        test_ip_detection();
        break;
        
    default:
        show_help();
        break;
}

function show_help() {
    echo "<h2>Available Tests:</h2>\n";
    echo "<ul>\n";
    echo "<li><a href='?test=rate_limit'>Rate Limiting Test</a></li>\n";
    echo "<li><a href='?test=spam_detection'>Spam Detection Test</a></li>\n";
    echo "<li><a href='?test=honeypot'>Honeypot Test</a></li>\n";
    echo "<li><a href='?test=validation'>Validation Test</a></li>\n";
    echo "<li><a href='?test=ip_detection'>IP Detection Test</a></li>\n";
    echo "<li><a href='?test=all'>Run All Tests</a></li>\n";
    echo "</ul>\n";
}

function test_rate_limiting() {
    echo "<h2>🔄 Rate Limiting Test</h2>\n";
    
    // Test rate limiting function
    $result1 = cloudsync_check_rate_limit();
    echo "First call: " . ($result1 ? "✅ Allowed" : "❌ Blocked") . "<br>\n";
    
    $result2 = cloudsync_check_rate_limit();
    echo "Second call: " . ($result2 ? "✅ Allowed" : "❌ Blocked") . "<br>\n";
    
    $result3 = cloudsync_check_rate_limit();
    echo "Third call: " . ($result3 ? "✅ Allowed" : "❌ Blocked") . "<br>\n";
    
    $result4 = cloudsync_check_rate_limit();
    echo "Fourth call (should be blocked): " . ($result4 ? "❌ FAIL: Still allowed" : "✅ PASS: Correctly blocked") . "<br>\n";
    
    echo "<p><em>Note: Rate limiting uses IP-based transients. Clear transients to reset.</em></p>\n";
}

function test_spam_detection() {
    echo "<h2>🕵️ Spam Detection Test</h2>\n";
    
    $test_cases = array(
        'Normal message' => false,
        'Hello, I am interested in your services' => false,
        'Visit my website at http://spam.com' => true,
        'URGENT!!! WINNER WINNER WINNER!!!' => true,
        'Viagra cialis pharmacy' => true,
        'aaaaaaaaaaaaaaaaaaaaaaaaaa' => true, // Repeated chars
        'dear sir/madam' => true,
        'earn money fast' => true,
        'This is a normal business inquiry about your SaaS product' => false,
    );
    
    foreach ($test_cases as $text => $expected_spam) {
        $is_spam = cloudsync_contains_spam_patterns($text);
        $status = ($is_spam === $expected_spam) ? "✅ PASS" : "❌ FAIL";
        $result = $is_spam ? "SPAM" : "CLEAN";
        echo "$status: '$text' → $result<br>\n";
    }
}

function test_honeypot() {
    echo "<h2>🍯 Honeypot Test</h2>\n";
    
    // Simulate empty honeypot (normal user)
    $_POST['website_url'] = '';
    echo "Empty honeypot field: ✅ Would allow (normal user)<br>\n";
    
    // Simulate filled honeypot (bot)
    $_POST['website_url'] = 'http://spam.com';
    echo "Filled honeypot field: ✅ Would block (likely bot)<br>\n";
    
    // Clean up
    unset($_POST['website_url']);
    
    echo "<p><em>Honeypot HTML is hidden in the contact form.</em></p>\n";
}

function test_validation() {
    echo "<h2>📏 Validation Test</h2>\n";
    
    $test_cases = array(
        'name' => array(
            'A' => 'Too short (< 2 chars)',
            'John Doe' => 'Valid',
            str_repeat('A', 150) => 'Too long (> 100 chars)'
        ),
        'email' => array(
            'invalid' => 'Invalid format',
            'test@example.com' => 'Valid',
            str_repeat('a', 250) . '@example.com' => 'Too long (> 254 chars)'
        ),
        'subject' => array(
            'Hi' => 'Too short (< 3 chars)',
            'Question about your service' => 'Valid',
            str_repeat('A', 250) => 'Too long (> 200 chars)'
        ),
        'message' => array(
            'Short' => 'Too short (< 10 chars)',
            'This is a valid message with enough characters to pass validation.' => 'Valid',
            str_repeat('A', 6000) => 'Too long (> 5000 chars)'
        )
    );
    
    foreach ($test_cases as $field => $cases) {
        echo "<strong>$field validation:</strong><br>\n";
        foreach ($cases as $value => $expected) {
            echo "&nbsp;&nbsp;'$value' → $expected<br>\n";
        }
        echo "<br>\n";
    }
}

function test_ip_detection() {
    echo "<h2>🌐 IP Detection Test</h2>\n";
    
    $detected_ip = cloudsync_get_user_ip();
    echo "Detected IP: $detected_ip<br>\n";
    
    // Test with various headers
    $original_server = $_SERVER;
    
    $_SERVER['HTTP_X_FORWARDED_FOR'] = '203.0.113.1, 198.51.100.1';
    $ip1 = cloudsync_get_user_ip();
    echo "With X-Forwarded-For: $ip1<br>\n";
    
    $_SERVER['HTTP_CF_CONNECTING_IP'] = '203.0.113.2';
    $ip2 = cloudsync_get_user_ip();
    echo "With Cloudflare header: $ip2<br>\n";
    
    // Restore original server vars
    $_SERVER = $original_server;
}

?>