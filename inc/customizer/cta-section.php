<?php

/**
 * Register CTA Section settings and controls
 * 
 * This section handles the final call-to-action area that appears at the bottom
 * of the landing page to capture last-minute conversions. Provides customization
 * options for the compelling headline, persuasive supporting text, and 
 * conversion-focused button that encourages immediate action from visitors.
 * 
 * The CTA section serves as the final conversion opportunity, designed to
 * convert hesitant visitors into leads or customers before they leave the site.
 * All elements are optimized for maximum psychological impact and urgency creation.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_cta_section($wp_customize) {
    $wp_customize->add_section('cloudsync_cta_section', array(
        'title'       => __('CTA Section', 'cloudsync'),
        'description' => __('Customize the final call-to-action section that encourages immediate action from visitors. Configure the compelling headline, persuasive supporting text, and conversion-focused button to capture leads and drive signups at the bottom of your landing page.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 50, // Show right after pricing plans section
    ));

    // --- SECTION HEADER FIELDS ---

    // CTA title
    $wp_customize->add_setting('cloudsync_cta_title', array(
        'default'           => __('Ready to Transform Your Workflow?', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_cta_title', array(
        'label'       => __('Section Title', 'cloudsync'),
        'description' => __('The main heading for the final CTA section. This should create urgency and clearly communicate the immediate value of taking action now, encouraging visitors to convert before leaving your site.', 'cloudsync'),
        'section'     => 'cloudsync_cta_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // CTA description
    $wp_customize->add_setting('cloudsync_cta_description', array(
        'default'           => __("Join thousands of teams already using CloudSync to boost productivity", 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_cta_description', array(
        'label'       => __('Section Description', 'cloudsync'),
        'description' => __('Supporting text that appears below the CTA headline. Keep it concise and action-focused, highlighting the immediate benefits and creating urgency to encourage visitors to take the final step.', 'cloudsync'),
        'section'     => 'cloudsync_cta_section',
        'type'        => 'text',
        'priority'    => 20,
    ));
    // CTA button text
    $wp_customize->add_setting('cloudsync_cta_button_text', array(
        'default'           => __("Start Your Free Trial", 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_cta_button_text', array(
        'label'       => __('CTA button text', 'cloudsync'),
        'description' => __('Text for the main call-to-action button. Use urgent, action-oriented words that create immediate desire to click. Examples: "Start Free Trial", "Get Started Now", "Claim Your Spot".', 'cloudsync'),
        'section'     => 'cloudsync_cta_section',
        'type'        => 'text',
        'priority'    => 25,
    ));
    // CTA button url
    $wp_customize->add_setting('cloudsync_cta_button_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh', // URL changes require page refresh
    ));

    $wp_customize->add_control('cloudsync_cta_button_url', array(
        'label'       => __('CTA button URL', 'cloudsync'),
        'description' => __('Where should the CTA button lead? Use your primary conversion page - signup form, trial registration, or contact page. This is your final conversion opportunity.', 'cloudsync'),
        'section'     => 'cloudsync_cta_section',
        'type'        => 'url',
        'priority'    => 30,
    ));
}
