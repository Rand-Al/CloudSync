<?php
/**
 * Mailchimp API Integration
 * 
 * Handles Mailchimp API communication for newsletter subscriptions
 * 
 * @package CloudSync
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Mailchimp Integration Class
 */
class CloudSync_Mailchimp_Integration {
    
    /**
     * Mailchimp API endpoint
     */
    private $api_endpoint = 'https://{dc}.api.mailchimp.com/3.0/';
    
    /**
     * API Key
     */
    private $api_key;
    
    /**
     * Data Center
     */
    private $data_center;
    
    /**
     * List ID
     */
    private $list_id;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->api_key = get_theme_mod('cloudsync_mailchimp_api_key', '');
        $this->list_id = get_theme_mod('cloudsync_mailchimp_list_id', '');
        
        if (!empty($this->api_key)) {
            // Extract data center from API key (format: key-dc)
            $parts = explode('-', $this->api_key);
            $this->data_center = end($parts);
            $this->api_endpoint = str_replace('{dc}', $this->data_center, $this->api_endpoint);
        }
    }
    
    /**
     * Check if Mailchimp is properly configured
     */
    public function is_configured() {
        return !empty($this->api_key) && !empty($this->list_id);
    }
    
    /**
     * Test API connection
     */
    public function test_connection() {
        if (!$this->is_configured()) {
            return array(
                'success' => false,
                'message' => __('Mailchimp not configured', 'cloudsync')
            );
        }
        
        $response = $this->make_request('ping');
        
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => $response->get_error_message()
            );
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['health_status']) && $data['health_status'] === 'Everything\'s Chimpy!') {
            return array(
                'success' => true,
                'message' => __('Connection successful', 'cloudsync')
            );
        }
        
        return array(
            'success' => false,
            'message' => __('Connection failed', 'cloudsync')
        );
    }
    
    /**
     * Subscribe email to Mailchimp list
     */
    public function subscribe_email($email, $merge_fields = array(), $interests = array()) {
        if (!$this->is_configured()) {
            return array(
                'success' => false,
                'message' => __('Mailchimp not configured', 'cloudsync')
            );
        }
        
        // Prepare subscriber data
        $subscriber_data = array(
            'email_address' => $email,
            'status' => 'subscribed',
            'merge_fields' => $merge_fields,
            'interests' => $interests,
            'timestamp_signup' => current_time('mysql'),
            'ip_signup' => $this->get_client_ip(),
            'tags' => array('WordPress', 'CloudSync')
        );
        
        // Generate subscriber hash (MD5 of lowercase email)
        $subscriber_hash = md5(strtolower($email));
        
        // Use PUT to add or update subscriber
        $endpoint = "lists/{$this->list_id}/members/{$subscriber_hash}";
        $response = $this->make_request($endpoint, 'PUT', $subscriber_data);
        
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => $response->get_error_message()
            );
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if ($response_code === 200) {
            return array(
                'success' => true,
                'message' => __('Successfully subscribed to newsletter', 'cloudsync'),
                'data' => $data
            );
        } elseif ($response_code === 400 && isset($data['title']) && $data['title'] === 'Member Exists') {
            return array(
                'success' => false,
                'message' => __('Email already subscribed', 'cloudsync'),
                'code' => 'already_subscribed'
            );
        } else {
            $error_message = isset($data['detail']) ? $data['detail'] : __('Unknown error occurred', 'cloudsync');
            return array(
                'success' => false,
                'message' => $error_message
            );
        }
    }
    
    /**
     * Unsubscribe email from Mailchimp list
     */
    public function unsubscribe_email($email) {
        if (!$this->is_configured()) {
            return false;
        }
        
        $subscriber_hash = md5(strtolower($email));
        $endpoint = "lists/{$this->list_id}/members/{$subscriber_hash}";
        
        $subscriber_data = array(
            'status' => 'unsubscribed'
        );
        
        $response = $this->make_request($endpoint, 'PATCH', $subscriber_data);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        return $response_code === 200;
    }
    
    /**
     * Get subscriber info
     */
    public function get_subscriber($email) {
        if (!$this->is_configured()) {
            return false;
        }
        
        $subscriber_hash = md5(strtolower($email));
        $endpoint = "lists/{$this->list_id}/members/{$subscriber_hash}";
        
        $response = $this->make_request($endpoint);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code === 200) {
            $body = wp_remote_retrieve_body($response);
            return json_decode($body, true);
        }
        
        return false;
    }
    
    /**
     * Get list information
     */
    public function get_list_info() {
        if (!$this->is_configured()) {
            return false;
        }
        
        $endpoint = "lists/{$this->list_id}";
        $response = $this->make_request($endpoint);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code === 200) {
            $body = wp_remote_retrieve_body($response);
            return json_decode($body, true);
        }
        
        return false;
    }
    
    /**
     * Batch import subscribers from local database
     */
    public function batch_import_subscribers($subscribers) {
        if (!$this->is_configured() || empty($subscribers)) {
            return array(
                'success' => false,
                'message' => __('Invalid configuration or no subscribers', 'cloudsync')
            );
        }
        
        $members = array();
        
        foreach ($subscribers as $email => $data) {
            $member = array(
                'email_address' => $email,
                'status' => 'subscribed',
                'merge_fields' => array(),
                'interests' => array(),
                'tags' => array('WordPress-Import', 'CloudSync')
            );
            
            // Add timestamp if available
            if (is_array($data) && isset($data['subscribed_at'])) {
                $member['timestamp_signup'] = $data['subscribed_at'];
            }
            
            // Add IP if available
            if (is_array($data) && isset($data['ip_address'])) {
                $member['ip_signup'] = $data['ip_address'];
            }
            
            $members[] = $member;
        }
        
        // Batch operations
        $batch_data = array(
            'members' => $members,
            'update_existing' => true
        );
        
        $endpoint = "lists/{$this->list_id}";
        $response = $this->make_request($endpoint, 'POST', $batch_data);
        
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => $response->get_error_message()
            );
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if ($response_code === 200) {
            return array(
                'success' => true,
                'message' => sprintf(__('Successfully imported %d subscribers', 'cloudsync'), count($members)),
                'data' => $data
            );
        } else {
            $error_message = isset($data['detail']) ? $data['detail'] : __('Batch import failed', 'cloudsync');
            return array(
                'success' => false,
                'message' => $error_message
            );
        }
    }
    
    /**
     * Make API request to Mailchimp
     */
    private function make_request($endpoint, $method = 'GET', $body = null) {
        $url = $this->api_endpoint . $endpoint;
        
        $args = array(
            'method' => $method,
            'headers' => array(
                'Authorization' => 'Basic ' . base64_encode('apikey:' . $this->api_key),
                'Content-Type' => 'application/json',
            ),
            'timeout' => 30
        );
        
        if ($body !== null) {
            $args['body'] = json_encode($body);
        }
        
        return wp_remote_request($url, $args);
    }
    
    /**
     * Get client IP address
     */
    private function get_client_ip() {
        $ip_keys = array('HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
        
        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = explode(',', $ip)[0];
                }
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    }
}

/**
 * Initialize Mailchimp integration
 */
function cloudsync_mailchimp() {
    static $mailchimp = null;
    
    if ($mailchimp === null) {
        $mailchimp = new CloudSync_Mailchimp_Integration();
    }
    
    return $mailchimp;
}

/**
 * AJAX handler for testing Mailchimp connection
 */
function cloudsync_test_mailchimp_connection() {
    // Security check
    if (!wp_verify_nonce($_POST['nonce'], 'cloudsync_mailchimp_test')) {
        wp_send_json_error(__('Security check failed', 'cloudsync'));
    }
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error(__('Insufficient permissions', 'cloudsync'));
    }
    
    $mailchimp = cloudsync_mailchimp();
    $result = $mailchimp->test_connection();
    
    if ($result['success']) {
        wp_send_json_success($result['message']);
    } else {
        wp_send_json_error($result['message']);
    }
}
add_action('wp_ajax_test_mailchimp_connection', 'cloudsync_test_mailchimp_connection');

/**
 * AJAX handler for migrating local subscribers to Mailchimp
 */
function cloudsync_migrate_to_mailchimp() {
    // Security check
    if (!wp_verify_nonce($_POST['nonce'], 'cloudsync_mailchimp_migrate')) {
        wp_send_json_error(__('Security check failed', 'cloudsync'));
    }
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error(__('Insufficient permissions', 'cloudsync'));
    }
    
    // Get local subscribers
    $local_subscribers = get_option('cloudsync_newsletter_subscribers', array());
    
    if (empty($local_subscribers)) {
        wp_send_json_error(__('No local subscribers found', 'cloudsync'));
    }
    
    $mailchimp = cloudsync_mailchimp();
    
    if (!$mailchimp->is_configured()) {
        wp_send_json_error(__('Mailchimp is not properly configured', 'cloudsync'));
    }
    
    // Filter active subscribers only
    $active_subscribers = array();
    foreach ($local_subscribers as $email => $data) {
        if (is_array($data) && isset($data['status']) && $data['status'] === 'active') {
            $active_subscribers[$email] = $data;
        } elseif (!is_array($data)) {
            // Old format - assume active
            $active_subscribers[$email] = array(
                'status' => 'active',
                'subscribed_at' => current_time('mysql')
            );
        }
    }
    
    if (empty($active_subscribers)) {
        wp_send_json_error(__('No active subscribers found', 'cloudsync'));
    }
    
    // Perform batch migration
    $result = $mailchimp->batch_import_subscribers($active_subscribers);
    
    if ($result['success']) {
        wp_send_json_success($result['message']);
    } else {
        wp_send_json_error($result['message']);
    }
}
add_action('wp_ajax_migrate_to_mailchimp', 'cloudsync_migrate_to_mailchimp');