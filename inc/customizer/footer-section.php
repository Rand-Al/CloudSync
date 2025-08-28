<?php

/**
 * Register Footer Section settings and controls
 * 
 * This section handles footer content including copyright information,
 * social media links, contact details, and additional company information.
 * The footer is crucial for trust building, legal compliance, and providing
 * additional navigation options for users who scroll to the bottom.
 * 
 * Footer elements contribute to professional credibility and help with
 * SEO through consistent branding and additional internal linking opportunities.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_footer_section($wp_customize) {

    // Create the Footer section within our main theme panel
    $wp_customize->add_section('cloudsync_footer_section', array(
        'title'       => __('Footer Section', 'cloudsync'),
        'description' => __('Customize footer content including copyright text, company information, and contact details. The footer builds trust and provides essential business information that visitors expect to find.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 70, // Show after CTA section
    ));

    // --- FOOTER COPYRIGHT FIELD ---

    // Custom copyright text (overrides default auto-generated copyright)
    $wp_customize->add_setting('cloudsync_footer_copyright_text', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_copyright_text', array(
        'label'       => __('Custom Copyright Text', 'cloudsync'),
        'description' => __('Override the default copyright text. Leave empty to use auto-generated "Copyright © 2025 [Site Name]. All rights reserved." The year updates automatically.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // --- COMPANY CONTACT INFORMATION ---

    // Company address
    $wp_customize->add_setting('cloudsync_footer_company_address', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_company_address', array(
        'label'       => __('Company Address', 'cloudsync'),
        'description' => __('Your business address for legal compliance and trust building. This helps establish credibility and meets legal requirements for many business types.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'textarea',
        'priority'    => 20,
    ));

    // Company phone number
    $wp_customize->add_setting('cloudsync_footer_company_phone', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_company_phone', array(
        'label'       => __('Company Phone', 'cloudsync'),
        'description' => __('Business phone number for customer contact. Include country code for international businesses (e.g., +1-555-123-4567).', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'tel',
        'priority'    => 30,
    ));

    // Company email
    $wp_customize->add_setting('cloudsync_footer_company_email', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_email',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_company_email', array(
        'label'       => __('Company Email', 'cloudsync'),
        'description' => __('Primary business email address for customer inquiries and support requests.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'email',
        'priority'    => 40,
    ));

    // --- SOCIAL MEDIA LINKS ---

    // Twitter/X URL
    $wp_customize->add_setting('cloudsync_footer_twitter_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_twitter_url', array(
        'label'       => __('Twitter/X URL', 'cloudsync'),
        'description' => __('Your company Twitter/X profile URL. Leave empty to hide the Twitter icon.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'url',
        'priority'    => 50,
    ));

    // LinkedIn URL
    $wp_customize->add_setting('cloudsync_footer_linkedin_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_linkedin_url', array(
        'label'       => __('LinkedIn URL', 'cloudsync'),
        'description' => __('Your company LinkedIn profile URL. Essential for B2B credibility and professional networking.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'url',
        'priority'    => 60,
    ));

    // GitHub URL (for tech companies)
    $wp_customize->add_setting('cloudsync_footer_github_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_github_url', array(
        'label'       => __('GitHub URL', 'cloudsync'),
        'description' => __('Your company GitHub profile URL. Important for tech companies and SaaS businesses to show development activity.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'url',
        'priority'    => 70,
    ));

    // YouTube URL  
    $wp_customize->add_setting('cloudsync_footer_youtube_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_youtube_url', array(
        'label'       => __('YouTube URL', 'cloudsync'),
        'description' => __('Your company YouTube channel URL. Great for businesses that create tutorial videos, product demos, or educational content.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'url',
        'priority'    => 80,
    ));

    // --- ADDITIONAL FOOTER CONTENT ---

    // Footer tagline/description
    $wp_customize->add_setting('cloudsync_footer_tagline', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_tagline', array(
        'label'       => __('Footer Tagline', 'cloudsync'),
        'description' => __('Brief company description or tagline that appears in the footer. Keep it concise and focused on your core value proposition.', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'textarea',
        'priority'    => 90,
    ));

    // Newsletter signup text
    $wp_customize->add_setting('cloudsync_footer_newsletter_text', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_footer_newsletter_text', array(
        'label'       => __('Newsletter Signup Text', 'cloudsync'),
        'description' => __('Call-to-action text for newsletter signup. Example: "Subscribe to our newsletter for product updates and exclusive offers."', 'cloudsync'),
        'section'     => 'cloudsync_footer_section',
        'type'        => 'text',
        'priority'    => 100,
    ));
}
