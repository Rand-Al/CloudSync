<?php

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
        'label'       => __('How it Works Description', 'cloudsync'),
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
