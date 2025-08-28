<?php

/**
 * Register Contact Section settings and controls
 * 
 * The Contact section provides multiple ways for visitors to get in touch:
 * - Contact information (email, phone, address)
 * - Contact form with validation
 * - Customizable labels and content
 * 
 * @since 1.0.0
 * @param WP_Customize_Manager $wp_customize WordPress Customizer Manager instance
 */
function cloudsync_register_contact_section($wp_customize) {

    // Contact Section
    $wp_customize->add_section('cloudsync_contact_section', array(
        'title'    => __('Contact Section', 'cloudsync'),
        'panel'    => 'cloudsync_theme_options',
        'priority' => 60,
    ));

    // Contact Title
    $wp_customize->add_setting('cloudsync_contact_title', array(
        'default'           => __('Get Started Today', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_title', array(
        'label'       => __('Section Title', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Main heading for the contact section', 'cloudsync'),
    ));

    // Contact Description
    $wp_customize->add_setting('cloudsync_contact_description', array(
        'default'           => __('Ready to transform your workflow? Get in touch with our team and discover how CloudSync can revolutionize your business.', 'cloudsync'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_description', array(
        'label'       => __('Section Description', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'textarea',
        'description' => __('Brief description text below the section title', 'cloudsync'),
    ));

    // Contact Email
    $wp_customize->add_setting('cloudsync_contact_email', array(
        'default'           => 'hello@cloudsync.com',
        'sanitize_callback' => 'sanitize_email',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_email', array(
        'label'       => __('Contact Email', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'email',
        'description' => __('Email address for contact inquiries', 'cloudsync'),
    ));

    // Contact Email Label
    $wp_customize->add_setting('cloudsync_contact_email_label', array(
        'default'           => __('Email Us', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_email_label', array(
        'label'       => __('Email Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for email contact method', 'cloudsync'),
    ));

    // Contact Phone
    $wp_customize->add_setting('cloudsync_contact_phone', array(
        'default'           => '+1 (555) 123-4567',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_phone', array(
        'label'       => __('Contact Phone', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Phone number for contact inquiries', 'cloudsync'),
    ));

    // Contact Phone Label
    $wp_customize->add_setting('cloudsync_contact_phone_label', array(
        'default'           => __('Call Us', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_phone_label', array(
        'label'       => __('Phone Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for phone contact method', 'cloudsync'),
    ));

    // Contact Address
    $wp_customize->add_setting('cloudsync_contact_address', array(
        'default'           => '123 Tech Street, San Francisco, CA 94105',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_address', array(
        'label'       => __('Contact Address', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'textarea',
        'description' => __('Physical address or location', 'cloudsync'),
    ));

    // Contact Address Label
    $wp_customize->add_setting('cloudsync_contact_address_label', array(
        'default'           => __('Visit Us', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_contact_address_label', array(
        'label'       => __('Address Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for address contact method', 'cloudsync'),
    ));

    // Form Fields
    $wp_customize->add_setting('cloudsync_form_name_label', array(
        'default'           => __('Your Name', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_name_label', array(
        'label'       => __('Name Field Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for the name input field', 'cloudsync'),
    ));
    $wp_customize->add_setting('cloudsync_form_name_placeholder', array(
        'default'           => __(' ', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_name_placeholder', array(
        'label'       => __('Name Field Placeholder', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Placeholder for the name input field', 'cloudsync'),
    ));

    $wp_customize->add_setting('cloudsync_form_email_label', array(
        'default'           => __('Email Address', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_email_label', array(
        'label'       => __('Email Field Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for the email input field', 'cloudsync'),
    ));
    $wp_customize->add_setting('cloudsync_form_email_placeholder', array(
        'default'           => __('', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_email_placeholder', array(
        'label'       => __('Email Address Placeholder', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Placeholder for the email input field', 'cloudsync'),
    ));

    $wp_customize->add_setting('cloudsync_form_company_label', array(
        'default'           => __('Company (Optional)', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_company_label', array(
        'label'       => __('Company Field Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for the company input field', 'cloudsync'),
    ));
    $wp_customize->add_setting('cloudsync_form_company_placeholder', array(
        'default'           => __(' ', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_company_placeholder', array(
        'label'       => __('Company Field Placeholder', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Placeholder for the company input field', 'cloudsync'),
    ));

    $wp_customize->add_setting('cloudsync_form_message_label', array(
        'default'           => __('Message', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    $wp_customize->add_control('cloudsync_form_message_label', array(
        'label'       => __('Message Field Label', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Label for the message textarea field', 'cloudsync'),
    ));


    $wp_customize->add_setting('cloudsync_form_message_placeholder', array(
        'default'           => __(' ', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_message_placeholder', array(
        'label'       => __('Message Field Placeholder', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('cloudsync_form_message_placeholder for the message textarea field', 'cloudsync'),
    ));

    $wp_customize->add_setting('cloudsync_form_submit_text', array(
        'default'           => __('Send Message', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_submit_text', array(
        'label'       => __('Submit Button Text', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Text for the form submit button', 'cloudsync'),
    ));

    $wp_customize->add_setting('cloudsync_form_loading_text', array(
        'default'           => __('Sending...', 'cloudsync'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('cloudsync_form_loading_text', array(
        'label'       => __('Loading Button Text', 'cloudsync'),
        'section'     => 'cloudsync_contact_section',
        'type'        => 'text',
        'description' => __('Text shown while form is being submitted', 'cloudsync'),
    ));
}
