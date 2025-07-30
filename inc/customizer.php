<?php

/**
 * CloudSync Theme Customizer Configuration
 * 
 * This file contains all WordPress Customizer panels, sections, settings, and controls
 * for the CloudSync SaaS landing page theme. The code is organized in logical sections
 * for easy navigation and maintenance.
 * 
 * SECTION ORGANIZATION:
 * =====================
 * 1. Main Panel & Initialization
 * 2. Hero Section Settings
 * 3. Features Section Settings (to be added)
 * 4. Pricing Section Settings (to be added)
 * 5. Footer Section Settings (to be added)
 * 6. Helper Functions & Utilities
 * 
 * Each section is clearly marked with comment headers for easy navigation.
 * All functions use the 'cloudsync_' prefix to prevent conflicts.
 * 
 * @package CloudSync
 * @since 1.0.0
 * @author CloudSync Theme
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/* =============================================================================
   1. MAIN PANEL & INITIALIZATION
   ============================================================================= */

/**
 * Initialize CloudSync Customizer functionality
 * 
 * This main function coordinates the registration of all Customizer components.
 * It's called by WordPress when the Customizer interface is loaded.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_customize_register($wp_customize) {

    // Register the main theme panel
    cloudsync_add_theme_panel($wp_customize);

    // Register all sections
    cloudsync_register_hero_section($wp_customize);
    cloudsync_register_hero_cards_section($wp_customize);
    cloudsync_register_features_section($wp_customize);
    cloudsync_register_features_cards_section($wp_customize);
    cloudsync_register_how_it_works_section($wp_customize);
    cloudsync_register_how_it_works_steps_section($wp_customize);
    // cloudsync_register_pricing_section($wp_customize);     // Coming later  
    // cloudsync_register_footer_section($wp_customize);      // Coming later
}

/**
 * Add main CloudSync theme panel
 * 
 * Creates a dedicated panel in the Customizer to house all theme-specific settings.
 * This keeps our options organized and separate from WordPress core settings.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_add_theme_panel($wp_customize) {

    $wp_customize->add_panel('cloudsync_theme_options', array(
        'title'       => __('CloudSync Theme Options', 'cloudsync'),
        'description' => __('Customize your SaaS landing page content and styling. All changes are previewed in real-time.', 'cloudsync'),
        'priority'    => 30,
    ));
}

/* =============================================================================
   2. HERO SECTION SETTINGS
   ============================================================================= */

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
/* =============================================================================
   3. FEATURES SECTION SETTINGS
   ============================================================================= */

/**
 * Register Features Section settings and controls
 * 
 * The Features section showcases six key product capabilities with icons,
 * titles, and descriptions. This section is crucial for communicating
 * value proposition and helping visitors understand product benefits.
 * 
 * Each feature card contains:
 * - FontAwesome icon class for visual representation
 * - Feature title (short, impactful phrase)
 * - Feature description (detailed explanation of benefit)
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_features_section($wp_customize) {

    // Create the Features section within our main theme panel
    $wp_customize->add_section('cloudsync_features_section', array(
        'title'       => __('Features Section', 'cloudsync'),
        'description' => __('Customize the six feature cards that highlight your product capabilities. Each card can have a custom icon, title, and description.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 20, // Show after Hero section
    ));

    // --- SECTION HEADER FIELDS ---

    // Features section main title
    $wp_customize->add_setting('cloudsync_features_main_title', array(
        'default'           => __('Powerful Features for Modern Teams', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_features_main_title', array(
        'label'       => __('Section Title', 'cloudsync'),
        'description' => __('The main heading for the features section. This should clearly communicate what the following features represent.', 'cloudsync'),
        'section'     => 'cloudsync_features_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // Features section description
    $wp_customize->add_setting('cloudsync_features_description', array(
        'default'           => __('Everything you need to scale your business and streamline your workflow', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_features_description', array(
        'label'       => __('Section Description', 'cloudsync'),
        'description' => __('Supporting text that appears below the section title. Keep it concise and focused on benefits.', 'cloudsync'),
        'section'     => 'cloudsync_features_section',
        'type'        => 'text',
        'priority'    => 20,
    ));
}

/**
 * Register Features Cards Section settings and controls
 * 
 * This dedicated section provides comprehensive customization options for the six
 * feature cards that showcase product capabilities. Separating these controls from
 * the main Features section creates a cleaner, more organized user interface while
 * allowing detailed customization of each feature presentation.
 * 
 * Each feature card represents a key product capability and contains three
 * customizable elements that work together to communicate value:
 * - FontAwesome icon class for immediate visual recognition
 * - Concise title that clearly states the benefit
 * - Detailed description that explains the value proposition
 * 
 * This organization follows UX best practices by grouping related functionality
 * while maintaining a logical hierarchy that guides users through the customization
 * process naturally and intuitively.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_features_cards_section($wp_customize) {

    // Create the Features Cards section within our main theme panel
    $wp_customize->add_section('cloudsync_features_cards_section', array(
        'title'       => __('Features - Cards', 'cloudsync'),
        'description' => __('Customize each of the six feature cards individually. Each card can have its own icon(available icons at fontawesome.com), title, and description to highlight specific product capabilities and benefits.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 25, // Show right after main Features section
    ));

    // --- FEATURE CARD 1: CLOUD STORAGE ---

    $wp_customize->add_setting('cloudsync_feature1_icon', array(
        'default'           => 'fas fa-cloud',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature1_icon', array(
        'label'       => __('Feature 1 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the first feature (e.g., fas fa-cloud). Choose an icon that immediately communicates the core benefit to users at a glance.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    $wp_customize->add_setting('cloudsync_feature1_title', array(
        'default'           => __('Cloud Storage', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature1_title', array(
        'label'       => __('Feature 1 - Title', 'cloudsync'),
        'description' => __('Concise, benefit-focused title for the first feature. Research shows that 2-3 word titles perform best for feature cards.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 20,
    ));

    $wp_customize->add_setting('cloudsync_feature1_description', array(
        'default'           => __('Unlimited storage with 99.99% uptime guarantee. Access your files from anywhere, anytime.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature1_description', array(
        'label'       => __('Feature 1 - Description', 'cloudsync'),
        'description' => __('Detailed explanation that converts interest into understanding. Focus on specific, measurable benefits rather than generic features.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 30,
    ));

    // --- FEATURE CARD 2: TEAM COLLABORATION ---

    $wp_customize->add_setting('cloudsync_feature2_icon', array(
        'default'           => 'fas fa-users',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature2_icon', array(
        'label'       => __('Feature 2 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the second feature (e.g., fas fa-users for collaboration). Icons should be universally recognizable symbols.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 40,
    ));

    $wp_customize->add_setting('cloudsync_feature2_title', array(
        'default'           => __('Team Collaboration', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature2_title', array(
        'label'       => __('Feature 2 - Title', 'cloudsync'),
        'description' => __('Action-oriented title that communicates the collaborative benefit. Focus on outcomes rather than process.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 50,
    ));

    $wp_customize->add_setting('cloudsync_feature2_description', array(
        'default'           => __('Real-time collaboration tools that keep your team synchronized and productive.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature2_description', array(
        'label'       => __('Feature 2 - Description', 'cloudsync'),
        'description' => __('Explain how this feature solves real team communication and coordination challenges that prospects face daily.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 60,
    ));

    // --- FEATURE CARD 3: ADVANCED SECURITY ---

    $wp_customize->add_setting('cloudsync_feature3_icon', array(
        'default'           => 'fas fa-lock',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature3_icon', array(
        'label'       => __('Feature 3 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the third feature (e.g., fas fa-lock for security). Security icons should convey trust and protection.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 70,
    ));

    $wp_customize->add_setting('cloudsync_feature3_title', array(
        'default'           => __('Advanced Security', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature3_title', array(
        'label'       => __('Feature 3 - Title', 'cloudsync'),
        'description' => __('Security-focused title that builds immediate trust and addresses prospect concerns about data protection.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 80,
    ));

    $wp_customize->add_setting('cloudsync_feature3_description', array(
        'default'           => __('Enterprise-grade encryption and security protocols to keep your data safe.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature3_description', array(
        'label'       => __('Feature 3 - Description', 'cloudsync'),
        'description' => __('Specify concrete security measures and compliance standards. Use terms like "enterprise-grade" and "compliance" to build credibility.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 90,
    ));

    // --- FEATURE CARD 4: API INTEGRATION ---

    $wp_customize->add_setting('cloudsync_feature4_icon', array(
        'default'           => 'fas fa-cog',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature4_icon', array(
        'label'       => __('Feature 4 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the fourth feature (e.g., fas fa-cog for integrations). Technical features benefit from gear, connection, or puzzle piece icons.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 100,
    ));

    $wp_customize->add_setting('cloudsync_feature4_title', array(
        'default'           => __('API Integration', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature4_title', array(
        'label'       => __('Feature 4 - Title', 'cloudsync'),
        'description' => __('Integration-focused title that emphasizes connectivity and workflow efficiency. Technical prospects value seamless tool integration.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 110,
    ));

    $wp_customize->add_setting('cloudsync_feature4_description', array(
        'default'           => __('Seamless integration with 500+ popular tools and services your team already uses.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature4_description', array(
        'label'       => __('Feature 4 - Description', 'cloudsync'),
        'description' => __('Highlight the breadth of integrations and emphasize that users can keep their existing workflow. Include specific numbers for credibility.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 120,
    ));

    // --- FEATURE CARD 5: MOBILE APPS ---

    $wp_customize->add_setting('cloudsync_feature5_icon', array(
        'default'           => 'fas fa-mobile-alt',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature5_icon', array(
        'label'       => __('Feature 5 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the fifth feature (e.g., fas fa-mobile-alt for mobile apps). Mobile icons should clearly represent cross-device accessibility.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 130,
    ));

    $wp_customize->add_setting('cloudsync_feature5_title', array(
        'default'           => __('Mobile Apps', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature5_title', array(
        'label'       => __('Feature 5 - Title', 'cloudsync'),
        'description' => __('Mobile-focused title that communicates accessibility and flexibility. Modern teams expect full mobile functionality, not just responsive web design.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 140,
    ));

    $wp_customize->add_setting('cloudsync_feature5_description', array(
        'default'           => __('Native iOS and Android apps for productivity on the go with offline sync.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature5_description', array(
        'label'       => __('Feature 5 - Description', 'cloudsync'),
        'description' => __('Emphasize native app quality and offline functionality. Mobile workers need assurance that they can be productive without constant internet connection.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 150,
    ));

    // --- FEATURE CARD 6: 24/7 SUPPORT ---

    $wp_customize->add_setting('cloudsync_feature6_icon', array(
        'default'           => 'fas fa-headset',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature6_icon', array(
        'label'       => __('Feature 6 - Icon Class', 'cloudsync'),
        'description' => __('FontAwesome icon class for the sixth feature (e.g., fas fa-headset for support). Support icons should convey human assistance and reliability.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 160,
    ));

    $wp_customize->add_setting('cloudsync_feature6_title', array(
        'default'           => __('24/7 Support', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature6_title', array(
        'label'       => __('Feature 6 - Title', 'cloudsync'),
        'description' => __('Support-focused title that builds confidence in post-purchase experience. Enterprise customers especially value guaranteed support availability.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'text',
        'priority'    => 170,
    ));

    $wp_customize->add_setting('cloudsync_feature6_description', array(
        'default'           => __('Round-the-clock customer support from our team of cloud experts.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_feature6_description', array(
        'label'       => __('Feature 6 - Description', 'cloudsync'),
        'description' => __('Emphasize expertise and availability. Prospects need confidence that they will receive knowledgeable help when they need it most.', 'cloudsync'),
        'section'     => 'cloudsync_features_cards_section',
        'type'        => 'textarea',
        'priority'    => 180,
    ));
}

/* =============================================================================
    4. HOW IT WORKS SECTION SETTINGS
   ============================================================================= */

/**
 * Register How It Works Section settings and controls
 * 
 * The How It Works section reduces user anxiety by demonstrating that your
 * product implementation is simple and straightforward. This section builds
 * confidence and moves visitors closer to conversion by addressing concerns
 * about complexity and showing a clear path to getting started.
 * 
 * Fields included:
 * - Section main headline
 * - Section description text
 * - Step 1: number, title, and description
 * - Step 2: number, title, and description  
 * - Step 3: number, title, and description
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_how_it_works_section($wp_customize) {

    // Create the How it works section within our main theme panel
    $wp_customize->add_section('cloudsync_how_it_works_section', array(
        'title'       => __('How It Works Section', 'cloudsync'),
        'description' => __('Explain your simple 3-step process that shows visitors exactly how to get started. This section reduces user anxiety by demonstrating that your product is easy to implement and use, directly improving signup conversion rates.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 30,
    ));

    // --- How It Works CONTENT FIELDS ---

    // How It Works Main Headline - the primary message visitors see
    $wp_customize->add_setting('cloudsync_how_it_works_main_title', array(
        'default'           => __('How It Works', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_main_title', array(
        'label'       => __('Main Headline', 'cloudsync'),
        'description' => __("The section title that promises simplicity and clarity. Use words like 'Simple Steps' or 'Easy Process' to reduce user anxiety about implementation complexity and encourage them to continue reading.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    // How It Works Description - supporting text that explains the process benefits
    $wp_customize->add_setting('cloudsync_how_it_works_description', array(
        'default'           => __('Get started in minutes with our simple 3-step process', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_description', array(
        'label'       => __('Рow it Works Description', 'cloudsync'),
        'description' => __('Supporting text that explains why your process is simple and efficient. Keep it concise and focus on reducing implementation concerns that might prevent signups.', 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_section',
        'type'        => 'textarea',
        'priority'    => 20,
    ));

    // --- How It Works Steps fields ---


}
/**
 * Register How It Works Steps Section settings and controls
 * 
 * This dedicated section provides detailed customization options for the three
 * process steps that demonstrate implementation simplicity. Separating step
 * controls from the main How It Works section creates a focused interface
 * that allows users to craft each step with precision while maintaining
 * clear visual organization in the Customizer panel.
 * 
 * Each step represents a crucial stage in the user journey and contains
 * customizable elements designed to reduce implementation anxiety:
 * - Step number or identifier for clear progression indication
 * - Compelling step title that emphasizes simplicity and clarity
 * - Detailed description that addresses specific user concerns at each stage
 * 
 * This separation follows established UX principles by isolating complex
 * multi-element configuration tasks into dedicated spaces, preventing
 * cognitive overload while enabling thorough customization of this
 * conversion-critical section that directly impacts signup rates.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */

function cloudsync_register_how_it_works_steps_section($wp_customize) {

    // Create the How It Works steps section within our main theme panel
    $wp_customize->add_section('cloudsync_how_it_works_steps_section', array(
        'title'       => __('How it works - Steps', 'cloudsync'),
        'description' => __('Customize each of the three process steps individually. Each step can have its own number/identifier, compelling title, and detailed description to demonstrate that your implementation process is straightforward and manageable, directly addressing user concerns about complexity.', 'cloudsync'),
        'panel'       => 'cloudsync_theme_options',
        'priority'    => 35, // Show right after main How It Works section
    ));

    // --- PROCESS STEP 1: SIGN UP ---

    $wp_customize->add_setting('cloudsync_how_it_works_step1_identifier', array(
        'default'           => '1',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step1_identifier', array(
        'label'       => __('Step 1 - Identifier', 'cloudsync'),
        'description' => __("Step number or identifier that creates visual progression and helps users track their position in the process. Usually '1', '2', '3' for numbered sequence, but you can use 'A', 'B', 'C' or custom labels like 'Phase 1' to match your brand style and methodology.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 10,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step1_title', array(
        'default'           => __('Sign Up', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step1_title', array(
        'label'       => __('Step 1 - Title', 'cloudsync'),
        'description' => __("Action-oriented title that emphasizes simplicity and speed. Use motivating words like 'Create', 'Connect', or 'Start' rather than technical terms. Keep it under 4-5 words while focusing on ease of completion rather than technical complexity.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 20,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step1_description', array(
        'default'           => __('Create your account in seconds with our streamlined onboarding process', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step1_description', array(
        'label'       => __('Step 1 - Description', 'cloudsync'),
        'description' => __('Clear explanation that reduces anxiety about this step and demonstrates its simplicity. Address potential user concerns, mention time required, and emphasize ease of completion. Use reassuring language that builds confidence rather than technical details that might create doubt.', 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'textarea',
        'priority'    => 25,
    ));
    // --- PROCESS STEP 2: SETUP ---

    $wp_customize->add_setting('cloudsync_how_it_works_step2_identifier', array(
        'default'           => '2',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step2_identifier', array(
        'label'       => __('Step 2 - Identifier', 'cloudsync'),
        'description' => __("Step number or identifier for the second stage of your process. Maintains visual consistency with step 1 while clearly indicating progression. Use '2' for standard numbering, 'B' for alphabetical sequence, or 'Phase 2' for more descriptive labeling that aligns with your business methodology.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 30,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step2_title', array(
        'default'           => __('Connect Tools', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step2_title', array(
        'label'       => __('Step 2 - Title', 'cloudsync'),
        'description' => __("Action-oriented title that emphasizes the logical progression from step 1. Use words that show forward movement like 'Connect', 'Import', or 'Configure' to build momentum. Focus on demonstrating that the second step flows naturally from the first, maintaining the impression of an effortless, sequential process.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 35,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step2_description', array(
        'default'           => __('Integrate your existing tools and import your data with one-click setup', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step2_description', array(
        'label'       => __('Step 2 - Description', 'cloudsync'),
        'description' => __('Clear explanation that demonstrates how this step builds upon the first one and maintains the process momentum. Address concerns about integration complexity, specify the short time required, and emphasize that existing workflows remain unchanged. Use reassuring language that shows progression rather than technical jargon that might create confusion.', 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'textarea',
        'priority'    => 40,
    ));
    // --- PROCESS STEP 3: LAUNCH ---

    $wp_customize->add_setting('cloudsync_how_it_works_step3_identifier', array(
        'default'           => '3',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step3_identifier', array(
        'label'       => __('Step 3 - Identifier', 'cloudsync'),
        'description' => __("Step number or identifier for the third and final stage of your process. Completes the logical progression from setup to active usage. Maintains visual consistency with steps 1 and 2 while signaling the culmination of the onboarding journey. Use '3' for standard numbering, 'C' for alphabetical sequence, or 'Phase 3' for more descriptive labeling that aligns with your business methodology and indicates full product activation.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 45,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step3_title', array(
        'default'           => __('Start Collaborating', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step3_title', array(
        'label'       => __('Step 3 - Title', 'cloudsync'),
        'description' => __("Action-oriented title that emphasizes completion and achievement after the logical progression from steps 1 and 2. Use words that show successful implementation like 'Launch', 'Deploy', 'Activate', or 'Go Live' to demonstrate the culmination of the process. Focus on conveying that the third step represents the reward - the moment when everything comes together and users begin experiencing the full value of your solution.", 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'text',
        'priority'    => 50,
    ));

    $wp_customize->add_setting('cloudsync_how_it_works_step3_description', array(
        'default'           => __('Invite your team and start experiencing the future of cloud computing', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_how_it_works_step3_description', array(
        'label'       => __('Step 3 - Description', 'cloudsync'),
        'description' => __('Clear explanation that demonstrates how this step builds upon the previous two and delivers the promised outcome. Address any final concerns about complexity or time investment, specify the immediate benefits users will experience, and emphasize that the process concludes with tangible results. Use confident, achievement-focused language that shows successful completion rather than ongoing effort, creating excitement about the transformation achieved through the simple three-step process.', 'cloudsync'),
        'section'     => 'cloudsync_how_it_works_steps_section',
        'type'        => 'textarea',
        'priority'    => 55,
    ));
}
/* =============================================================================
   4. PRICING SECTION SETTINGS (COMING LATER)
   ============================================================================= */

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
    // To be implemented in future iteration
}

/* =============================================================================
   5. FOOTER SECTION SETTINGS (COMING LATER)
   ============================================================================= */

/**
 * Register Footer Section settings and controls
 * 
 * This section will handle footer content including contact information,
 * social media links, and additional navigation options.
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_footer_section($wp_customize) {
    // To be implemented in future iteration
}

/* =============================================================================
   6. HELPER FUNCTIONS & UTILITIES
   ============================================================================= */

/**
 * Helper function to safely retrieve Customizer values
 * 
 * This utility function provides a safe way to get theme modification values
 * with fallback defaults. It prevents errors if settings don't exist and
 * ensures consistent data retrieval throughout the theme.
 * 
 * @since 1.0.0
 * @param string $setting_name The name of the setting to retrieve
 * @param mixed  $default      The default value if setting doesn't exist
 * @return mixed               The setting value or default
 */
function cloudsync_get_customizer_value($setting_name, $default = '') {
    return get_theme_mod($setting_name, $default);
}
// Hook our initialization function into WordPress
add_action('customize_register', 'cloudsync_customize_register');

/**
 * Enqueue Customizer live preview JavaScript
 * 
 * This function loads our vanilla JavaScript file that handles real-time
 * preview of customizer changes. The script only loads in the Customizer
 * preview context to avoid unnecessary overhead on the frontend.
 * 
 * The 'customize_preview_init' action ensures that this script loads
 * only when the Customizer preview iframe is being initialized, not
 * on regular frontend page loads.
 * 
 * @since 1.0.0
 */
function cloudsync_customizer_live_preview() {
    wp_enqueue_script(
        'cloudsync-customizer-live-preview',
        get_template_directory_uri() . '/assets/js/customizer.js',
        array('customize-preview'),
        '1.0.0',
        true
    );
}
add_action('customize_preview_init', 'cloudsync_customizer_live_preview');

/**
 * Add site data to body for JavaScript access

 * This corrected version ensures that the site name data is set only after
 * the DOM is fully ready, preventing the "Cannot read properties of null" error.
 * We use a deferred approach that waits for the body element to be available.
 * 
 * @since 1.0.0
 */
function cloudsync_add_site_data_to_body() {
    // Only add this data in Customizer preview context
    if (is_customize_preview()) {
        $site_name = get_bloginfo('name');
?>
        <script>
            (function() {
                'use strict';

                /**
                 * Function to safely set the site name dataset
                 * This function includes error checking and waits for DOM readiness
                 */
                function setSiteNameData() {
                    try {
                        if (document.body) {
                            document.body.dataset.siteName = "<?php echo esc_js($site_name); ?>";
                            console.log('[CloudSync] Site name successfully set:', document.body.dataset.siteName);
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error('[CloudSync] Error setting site name:', error);
                        return false;
                    }
                }

                // Try to set the data immediately if body is already available
                if (document.body) {
                    setSiteNameData();
                } else {
                    // If body is not ready, wait for DOM content to load
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', function() {
                            setSiteNameData();
                        });
                    } else {
                        // Document is already loaded, but body might still be null
                        // This can happen in some edge cases, so we use a small delay
                        setTimeout(function() {
                            if (!setSiteNameData()) {
                                console.warn('[CloudSync] Failed to set site name data after timeout');
                            }
                        }, 10);
                    }
                }
            })();
        </script>
<?php
    }
}
add_action('wp_head', 'cloudsync_add_site_data_to_body');
