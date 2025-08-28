<?php

/**
 * Register Pricing Section settings and controls
 * 
 * This section will handle the pricing plans with customizable
 * plan names, prices, features lists, and button configurations.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_pricing_section($wp_customize) {
    $wp_customize->add_section('cloudsync_pricing_section', array(
        'title'       => __('Pricing Section', 'cloudsync'),
        'description' => __('Configure your pricing tiers to maximize conversions. Customize plan names, prices, feature lists, and buttons for each tier. Perfect for SaaS businesses, agencies, or any service-based offering.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 40, // Show right after main How It Works section
    ));

    // --- SECTION HEADER FIELDS ---

    // Pricing section main title
    $wp_customize->add_setting('cloudsync_pricing_main_title', array(
        'default'           => __('Simple, Transparent Pricing', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_pricing_main_title', array(
        'label'       => __('Section Title', 'cloudsync'),
        'description' => __('The main heading for the pricing section. This should clearly communicate your value proposition and encourage visitors to compare your plans and choose the option that best fits their needs.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // Pricing section description
    $wp_customize->add_setting('cloudsync_pricing_description', array(
        'default'           => __("Choose the plan that's right for your team", 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_pricing_description', array(
        'label'       => __('Section Description', 'cloudsync'),
        'description' => __('Supporting text that appears below the section title. Keep it concise and focused on value, highlighting why your pricing is competitive and what customers gain from choosing your service.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_section',
        'type'        => 'text',
        'priority'    => 20,
    ));
}

/**
 * Register Pricing Plans Section settings and controls
 * 
 * This dedicated section provides comprehensive customization options for the three
 * pricing tiers that drive conversions and revenue generation. Separating pricing
 * controls from the main Pricing section creates a focused interface that allows
 * users to optimize each plan with precision while maintaining clear visual
 * organization in the Customizer panel for maximum conversion impact.
 * 
 * Each pricing plan represents a strategic revenue opportunity and contains
 * customizable elements designed to maximize subscription conversions:
 * - Plan name and positioning for clear value differentiation
 * - Compelling pricing display with promotional flexibility
 * - Feature lists that highlight value propositions at each tier
 * - Call-to-action buttons optimized for conversion psychology
 * 
 * This separation follows established UX principles by isolating complex
 * multi-element pricing configuration into dedicated spaces, preventing
 * cognitive overload while enabling thorough optimization of this
 * revenue-critical section that directly impacts subscription rates and MRR.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */

function cloudsync_register_pricing_plans_section($wp_customize) {

    // Create the Pricing Plans section within our main theme panel
    $wp_customize->add_section('cloudsync_pricing_plans_section', array(
        'title'       => __('Pricing - Pricing Plans', 'cloudsync'),
        'description' => __('Customize each of the three pricing plans individually. Each plan can have its own name, price point, feature list, and call-to-action button to maximize conversions and clearly demonstrate the value proposition at each tier, directly addressing customer budget concerns and feature requirements.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 45, // Show right after main Pricing section
    ));

    // --- PRICING PLAN 1: STARTER TIER ---
    // Entry-level plan designed for small teams and individual users
    // Includes essential features at an accessible price point

    $wp_customize->add_setting('cloudsync_plan1_name', array(
        'default'           => __('Starter', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan1_name', array(
        'label'       => __('Plan 1 - Name', 'cloudsync'),
        'description' => __('The display name for your first pricing tier. Keep it short and descriptive - "Starter", "Basic", "Essential" work well.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    $wp_customize->add_setting('cloudsync_plan1_price', array(
        'default'           => '9',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan1_price', array(
        'label'       => __('Plan 1 - Price', 'cloudsync'),
        'description' => __('Enter just the number (e.g., "9" for $9). The currency symbol is added automatically.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 15,
    ));

    $wp_customize->add_setting('cloudsync_plan1_features', array(
        'default'           => "5 Users\n100GB Storage\nBasic Support\nMobile Apps",
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan1_features', array(
        'label'       => __('Plan 1 - Features List', 'cloudsync'),
        'description' => __('Enter each feature on a new line. Empty lines will be ignored. Each feature will display with a checkmark icon.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'textarea',
        'priority'    => 20,
    ));

    $wp_customize->add_setting('cloudsync_plan1_button_text', array(
        'default'           => __('Get Started', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan1_button_text', array(
        'label'       => __('Plan 1 - Button Text', 'cloudsync'),
        'description' => __('Call-to-action text for this plan. Use action words like "Get Started", "Choose Plan", "Sign Up".', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 25,
    ));

    $wp_customize->add_setting('cloudsync_plan1_button_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh', // URL changes require page refresh
    ));

    $wp_customize->add_control('cloudsync_plan1_button_url', array(
        'label'       => __('Plan 1 - Button URL', 'cloudsync'),
        'description' => __('Where should this button lead? Use your signup page URL or contact form.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'url',
        'priority'    => 30,
    ));
    // --- PRICING PLAN 2: PROFESSIONAL ---
    // The middle tier - typically the most popular choice for growing businesses
    // Often highlighted with "Most Popular" or "Recommended" badges

    $wp_customize->add_setting('cloudsync_plan2_name', array(
        'default'           => __('Professional', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan2_name', array(
        'label'       => __('Plan 2 - Name', 'cloudsync'),
        'description' => __('The display name for your second pricing tier. This is often the "recommended" or most popular plan - "Professional", "Premium", "Growth" are effective choices.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 35,
    ));

    $wp_customize->add_setting('cloudsync_plan2_price', array(
        'default'           => '29',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan2_price', array(
        'label'       => __('Plan 2 - Price', 'cloudsync'),
        'description' => __('Price for the professional tier. Typically 3-4x the starter price to create clear value progression.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 40,
    ));

    $wp_customize->add_setting('cloudsync_plan2_features', array(
        'default'           => "25 Users\n1TB Storage\nPriority Support\nAdvanced Security\nAPI Access",
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan2_features', array(
        'label'       => __('Plan 2 - Features List', 'cloudsync'),
        'description' => __('Features for the professional plan. Include more advanced capabilities that justify the higher price point.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'textarea',
        'priority'    => 45,
    ));

    $wp_customize->add_setting('cloudsync_plan2_button_text', array(
        'default'           => __('Get Started', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan2_button_text', array(
        'label'       => __('Plan 2 - Button Text', 'cloudsync'),
        'description' => __('Call-to-action for the professional plan. Consider using "Start Trial" or "Upgrade Now" to differentiate from the starter plan.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 50,
    ));

    $wp_customize->add_setting('cloudsync_plan2_button_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_plan2_button_url', array(
        'label'       => __('Plan 2 - Button URL', 'cloudsync'),
        'description' => __('Destination URL for the professional plan signup or contact form.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'url',
        'priority'    => 55,
    ));

    // --- PRICING PLAN 3: ENTERPRISE ---
    // The premium tier designed for large organizations and high-volume users
    // Often includes custom features, dedicated support, and enterprise-grade security

    $wp_customize->add_setting('cloudsync_plan3_name', array(
        'default'           => __('Enterprise', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan3_name', array(
        'label'       => __('Plan 3 - Name', 'cloudsync'),
        'description' => __('The display name for your highest pricing tier. "Enterprise", "Business", "Custom" work well for premium offerings.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 60,
    ));

    $wp_customize->add_setting('cloudsync_plan3_price', array(
        'default'           => '99',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan3_price', array(
        'label'       => __('Plan 3 - Price', 'cloudsync'),
        'description' => __('Enterprise tier pricing. Consider using "Custom" or "Contact Us" for enterprise plans instead of fixed pricing.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 65,
    ));

    $wp_customize->add_setting('cloudsync_plan3_features', array(
        'default'           => "Unlimited Users\nUnlimited Storage\n24/7 Support\nCustom Integrations\nDedicated Manager",
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan3_features', array(
        'label'       => __('Plan 3 - Features List', 'cloudsync'),
        'description' => __('Premium features that justify enterprise pricing. Focus on scalability, security, and dedicated support.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'textarea',
        'priority'    => 70,
    ));

    $wp_customize->add_setting('cloudsync_plan3_button_text', array(
        'default'           => __('Contact Sales', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_plan3_button_text', array(
        'label'       => __('Plan 3 - Button Text', 'cloudsync'),
        'description' => __('Enterprise plans often use "Contact Sales", "Get Quote", or "Talk to Expert" instead of direct signup.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'text',
        'priority'    => 75,
    ));

    $wp_customize->add_setting('cloudsync_plan3_button_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_plan3_button_url', array(
        'label'       => __('Plan 3 - Button URL', 'cloudsync'),
        'description' => __('URL for enterprise inquiries - typically a contact form or sales team email.', 'cloudsync'),
        'section'     => 'cloudsync_pricing_plans_section',
        'type'        => 'url',
        'priority'    => 80,
    ));
}
