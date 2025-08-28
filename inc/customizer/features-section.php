<?php

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
