<?php

/**
 * Register Hero Section settings and controls
 * 
 * The Hero section is the most critical part of any landing page as it's the first
 * thing visitors see. This section provides comprehensive customization options
 * for headlines, descriptions, call-to-action buttons, and visual elements.
 * 
 * Fields included:
 * - Main headline text
 * - Hero description text
 * - Primary CTA button text and URL
 * - Secondary CTA button text and URL
 * - Floating cards (to be added later)
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_hero_section($wp_customize) {

    // Create the Hero section within our main theme panel
    $wp_customize->add_section('cloudsync_hero_section', array(
        'title'       => __('Hero Section', 'cloudsync'),
        'description' => __('Customize the main hero area that visitors see first. This is crucial for conversions and engagement.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 10,
    ));

    // --- HERO CONTENT FIELDS ---

    // Hero Main Headline - the primary message visitors see
    $wp_customize->add_setting('cloudsync_hero_main_title', array(
        'default'           => __('The Future of Cloud Computing is Here', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_main_title', array(
        'label'       => __('Main Headline', 'cloudsync'),
        'description' => __('The primary headline that appears in large text. Make it compelling and clear - this determines if visitors stay or leave.', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // Hero Description - supporting text that explains the value proposition
    $wp_customize->add_setting('cloudsync_hero_description', array(
        'default'           => __('CloudSync revolutionizes how teams collaborate with lightning-fast performance, enterprise-grade security, and seamless integration across all your favorite tools.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_description', array(
        'label'       => __('Hero Description', 'cloudsync'),
        'description' => __('Supporting text that explains your value proposition. Keep it concise but informative - around 150-200 characters works best for readability and impact.', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'textarea',
        'priority'    => 20,
    ));

    // --- CALL-TO-ACTION BUTTONS ---

    // Primary CTA Button Text - the main action we want visitors to take
    $wp_customize->add_setting('cloudsync_hero_primary_btn_text', array(
        'default'           => __('Start Free Trial', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_primary_btn_text', array(
        'label'       => __('Primary Button Text', 'cloudsync'),
        'description' => __('Text for your main call-to-action button. Use action words that create urgency. Examples: "Start Free Trial", "Get Started Today", "Sign Up Now".', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'text',
        'priority'    => 30,
    ));

    // Primary CTA Button URL - where the primary button should lead
    $wp_customize->add_setting('cloudsync_hero_primary_btn_url', array(
        'default'           => '#pricing',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_hero_primary_btn_url', array(
        'label'       => __('Primary Button URL', 'cloudsync'),
        'description' => __('Where should the primary button lead? Use full URL (https://yoursite.com/signup) or anchor link (#pricing). This should typically lead to your signup or trial page.', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'url',
        'priority'    => 40,
    ));

    // Secondary CTA Button Text - alternative action for hesitant visitors
    $wp_customize->add_setting('cloudsync_hero_secondary_btn_text', array(
        'default'           => __('Watch Demo', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_secondary_btn_text', array(
        'label'       => __('Secondary Button Text', 'cloudsync'),
        'description' => __('Text for the secondary action button. Usually for learning more, watching demos, or less committed actions. Examples: "Watch Demo", "Learn More", "See How It Works".', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'text',
        'priority'    => 50,
    ));

    // Secondary CTA Button URL - destination for the secondary action
    $wp_customize->add_setting('cloudsync_hero_secondary_btn_url', array(
        'default'           => '#features',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('cloudsync_hero_secondary_btn_url', array(
        'label'       => __('Secondary Button URL', 'cloudsync'),
        'description' => __('Destination for the secondary button. Often links to demo videos, feature explanations, or contact pages.', 'cloudsync'),
        'section'     => 'cloudsync_hero_section',
        'type'        => 'url',
        'priority'    => 60,
    ));
}

// --- FLOATING CARDS  ---
/**
 * Register Hero Floating Cards Section settings and controls
 * 
 * This separate section provides dedicated interface for customizing the three
 * floating cards that appear in the hero area. Separating these controls into
 * their own section keeps the main hero section focused on core content while
 * providing detailed customization options for the visual elements.
 * 
 * Each floating card can be customized with:
 * - FontAwesome icon class for visual representation
 * - Short, impactful title that communicates the benefit
 * - Custom color for the icon (future enhancement)
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_hero_cards_section($wp_customize) {

    // Create the Hero Floating Cards section within our main theme panel
    $wp_customize->add_section('cloudsync_hero_cards_section', array(
        'title'       => __('Hero - Floating Cards', 'cloudsync'),
        'description' => __('Customize the three animated floating cards that add visual interest to your hero section. These cards help highlight your key features or benefits at a glance.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 15, // Show right after main Hero section
    ));

    // --- FLOATING CARD 1 ---

    $wp_customize->add_setting('cloudsync_hero_card1_icon', array(
        'default'           => 'fas fa-chart-line',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card1_icon', array(
        'label'       => __('Card 1 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class (e.g., fas fa-chart-line). Browse all available icons at fontawesome.com. Choose icons that clearly represent your key benefits.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    $wp_customize->add_setting('cloudsync_hero_card1_title', array(
        'default'           => __('Analytics', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card1_title', array(
        'label'       => __('Card 1 - Title', 'cloudsync'),
        'description' => __('Short, powerful title for the first card. One or two words work best for visual impact and quick comprehension.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 20,
    ));

    // --- FLOATING CARD 2 ---

    $wp_customize->add_setting('cloudsync_hero_card2_icon', array(
        'default'           => 'fas fa-shield-alt',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card2_icon', array(
        'label'       => __('Card 2 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the second floating card.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 30,
    ));

    $wp_customize->add_setting('cloudsync_hero_card2_title', array(
        'default'           => __('Security', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card2_title', array(
        'label'       => __('Card 2 - Title', 'cloudsync'),
        'description' => __('Short, powerful title for the second card.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 40,
    ));

    // --- FLOATING CARD 3 ---

    $wp_customize->add_setting('cloudsync_hero_card3_icon', array(
        'default'           => 'fas fa-rocket',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card3_icon', array(
        'label'       => __('Card 3 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the third floating card.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 50,
    ));

    $wp_customize->add_setting('cloudsync_hero_card3_title', array(
        'default'           => __('Performance', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_hero_card3_title', array(
        'label'       => __('Card 3 - Title', 'cloudsync'),
        'description' => __('Short, powerful title for the third card.', 'cloudsync'),
        'section'     => 'cloudsync_hero_cards_section',
        'type'        => 'text',
        'priority'    => 60,
    ));
}
