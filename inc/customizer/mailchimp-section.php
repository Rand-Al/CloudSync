<?php
/**
 * Mailchimp Integration Customizer Settings
 * 
 * WordPress Customizer settings for Mailchimp API configuration
 * 
 * @package CloudSync
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Register Mailchimp Integration section
 */
function cloudsync_register_mailchimp_section($wp_customize) {
    
    // Add Mailchimp section
    $wp_customize->add_section('cloudsync_mailchimp_section', array(
        'title'    => __('Mailchimp Integration', 'cloudsync'),
        'description' => __('Configure Mailchimp API integration for newsletter subscriptions. Get your API key from Mailchimp Account > Extras > API keys.', 'cloudsync'),
        'panel'    => 'cloudsync_theme_options',
        'priority' => 80,
    ));

    //=============================================================================
    // API CONFIGURATION
    //=============================================================================

    // Mailchimp API Key
    $wp_customize->add_setting('cloudsync_mailchimp_api_key', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_mailchimp_api_key_control', array(
        'label'       => __('Mailchimp API Key', 'cloudsync'),
        'description' => __('Enter your Mailchimp API key (format: key-us1). Found in Account > Extras > API keys.', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_api_key',
        'type'        => 'password',
        'input_attrs' => array(
            'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1',
        ),
    ));

    // Mailchimp List ID (Audience ID)
    $wp_customize->add_setting('cloudsync_mailchimp_list_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_mailchimp_list_id_control', array(
        'label'       => __('Mailchimp List ID (Audience ID)', 'cloudsync'),
        'description' => __('Enter your Mailchimp Audience ID. Found in Audience > Settings > Audience name and defaults.', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_list_id',
        'type'        => 'text',
        'input_attrs' => array(
            'placeholder' => 'xxxxxxxxxx',
        ),
    ));

    //=============================================================================
    // INTEGRATION OPTIONS
    //=============================================================================

    // Enable Mailchimp Integration
    $wp_customize->add_setting('cloudsync_mailchimp_enabled', array(
        'default'           => false,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_mailchimp_enabled_control', array(
        'label'       => __('Enable Mailchimp Integration', 'cloudsync'),
        'description' => __('When enabled, newsletter subscriptions will be sent to Mailchimp instead of local database.', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_enabled',
        'type'        => 'checkbox',
    ));

    // Double Opt-in
    $wp_customize->add_setting('cloudsync_mailchimp_double_optin', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_mailchimp_double_optin_control', array(
        'label'       => __('Double Opt-in', 'cloudsync'),
        'description' => __('Require subscribers to confirm their email address via confirmation email.', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_double_optin',
        'type'        => 'checkbox',
    ));

    //=============================================================================
    // SUBSCRIBER TAGS AND MERGE FIELDS
    //=============================================================================

    // Default Tags
    $wp_customize->add_setting('cloudsync_mailchimp_tags', array(
        'default'           => 'WordPress, CloudSync',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_mailchimp_tags_control', array(
        'label'       => __('Default Tags', 'cloudsync'),
        'description' => __('Tags to add to new subscribers (comma-separated). Example: WordPress, Landing Page', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_tags',
        'type'        => 'text',
        'input_attrs' => array(
            'placeholder' => 'WordPress, CloudSync',
        ),
    ));

    //=============================================================================
    // CONNECTION TEST AND MIGRATION
    //=============================================================================

    // Show migration section only if local subscribers exist
    $local_subscribers = get_option('cloudsync_newsletter_subscribers', array());
    
    // Test Connection Button
    $wp_customize->add_setting('cloudsync_mailchimp_test', array(
        'default'           => '',
        'sanitize_callback' => '__return_empty_string',
        'transport'         => 'refresh',
    ));

    // Add simple description control for connection test
    $wp_customize->add_control('cloudsync_mailchimp_test_control', array(
        'label'       => __('Test Connection', 'cloudsync'),
        'description' => __('Save your settings first, then use the test button in the WordPress Admin under Tools > Newsletter to test the Mailchimp connection.', 'cloudsync'),
        'section'     => 'cloudsync_mailchimp_section',
        'settings'    => 'cloudsync_mailchimp_test',
        'type'        => 'textarea',
        'input_attrs' => array(
            'readonly' => 'readonly',
            'rows' => 3,
            'style' => 'background: #f0f0f1; color: #646970;'
        ),
    ));

    if (!empty($local_subscribers)) {
        // Migration information
        $wp_customize->add_setting('cloudsync_mailchimp_migrate_info', array(
            'default'           => '',
            'sanitize_callback' => '__return_empty_string',
            'transport'         => 'refresh',
        ));

        $wp_customize->add_control('cloudsync_mailchimp_migrate_info_control', array(
            'label'       => __('Local Subscribers Migration', 'cloudsync'),
            'description' => sprintf(__('You have %d local subscribers. After configuring Mailchimp, use Tools > Newsletter to migrate them.', 'cloudsync'), count($local_subscribers)),
            'section'     => 'cloudsync_mailchimp_section',
            'settings'    => 'cloudsync_mailchimp_migrate_info',
            'type'        => 'textarea',
            'input_attrs' => array(
                'readonly' => 'readonly',
                'rows' => 2,
                'style' => 'background: #fff3cd; color: #664d03; border: 1px solid #f0e68c;'
            ),
        ));
    }
}