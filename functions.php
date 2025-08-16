<?php

/**
 * CloudSync SaaS Landing Theme Functions
 * 
 * This file contains all the core functionality and setup for the CloudSync theme.
 * Built for international market with professional standards.
 * 
 * @package CloudSync
 * @version 1.0.0
 * @author Your Name
 * @since 1.0.0
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Theme Setup Function
 * 
 * Sets up core theme features and tells WordPress what our theme supports.
 * This runs after WordPress loads but before most other initialization.
 * 
 * @since 1.0.0
 */
function cloudsync_theme_setup() {

    // Add support for automatic RSS feed links in document head
    // This improves SEO and allows feed readers to discover your content
    add_theme_support('automatic-feed-links');
    // Enable support for Post Thumbnails (featured images)
    // This allows users to set featured images for posts and pages
    // Essential for blog functionality and social media sharing
    add_theme_support('post-thumbnails');

    // Set default post thumbnail size for optimal social media sharing
    // Width: 1200px, Height: 630px (perfect Facebook/Twitter ratio)
    set_post_thumbnail_size(1200, 630, true);

    // Add custom image sizes for different sections of our theme
    add_image_size('cloudsync-hero', 800, 600, true);     // Hero section images
    add_image_size('cloudsync-feature', 400, 300, true);  // Feature cards
    add_image_size('cloudsync-thumbnail', 300, 200, true); // Small thumbnails

    // Switch default core markup to output valid HTML5
    // This ensures our theme uses modern web standards
    add_theme_support('html5', array(
        'search-form',      // Search forms will use HTML5 structure
        'comment-form',     // Comment forms get proper HTML5 fields
        'comment-list',     // Comments display with HTML5 elements
        'gallery',          // WordPress galleries use HTML5
        'caption',          // Image captions use HTML5 figure/figcaption
        'style',            // Inline styles use HTML5 structure
        'script',           // Inline scripts use HTML5 structure
    ));

    // Register navigation menus
    // This creates menu locations that users can manage through WordPress admin
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'cloudsync'),      // Main header navigation
        'footer'    => __('Footer Menu', 'cloudsync'),       // Footer links menu
        'social'    => __('Social Links', 'cloudsync'),      // Social media links
    ));

    // Add support for custom logo upload
    // This enables the logo customization feature in WordPress Customizer
    // Perfect for SaaS companies that need to maintain brand consistency
    add_theme_support('custom-logo', array(
        'height'      => 100,                    // Maximum logo height in pixels
        'width'       => 300,                    // Maximum logo width in pixels  
        'flex-height' => true,                   // Allow flexible height scaling
        'flex-width'  => true,                   // Allow flexible width scaling
        'header-text' => array('site-title'),    // Elements to hide when logo is uploaded
        'unlink-homepage-logo' => false,         // Keep logo linked to homepage
    ));

    // Add support for custom background images and colors
    // This enables background customization in WordPress Customizer
    // Valuable for SaaS companies that want to incorporate brand elements
    add_theme_support('custom-background', array(
        'default-color'      => '0f0f23',        // Default background color (dark theme)
        'default-image'      => '',              // No default background image
        'default-preset'     => 'default',       // Use default styling preset
        'default-position-x' => 'left',          // Horizontal positioning
        'default-position-y' => 'top',           // Vertical positioning
        'default-size'       => 'auto',          // Image sizing behavior
        'default-repeat'     => 'repeat',        // Image repeat pattern
        'default-attachment' => 'scroll',        // Scroll behavior with page
        'wp-head-callback'   => '_custom_background_cb',  // WordPress default callback
    ));

    // Let WordPress manage the document title tag
    // This is crucial for SEO and eliminates the need for manual title management
    add_theme_support('title-tag');

    // Switch default core markup to output valid HTML5
    // This ensures our theme uses modern web standards
    add_theme_support('html5', array(
        'search-form',      // Search forms will use HTML5 structure
        'comment-form',     // Comment forms get proper HTML5 fields
        'comment-list',     // Comments display with HTML5 elements
        'gallery',          // WordPress galleries use HTML5
        'caption',          // Image captions use HTML5 figure/figcaption
        'style',            // Inline styles use HTML5 structure
        'script',           // Inline scripts use HTML5 structure
    ));

    // Let WordPress manage the document title tag
    // This is crucial for SEO and eliminates the need for manual title management
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'cloudsync_theme_setup');


/**
 * Enqueue scripts and styles
 * 
 * This function properly loads CSS and JavaScript files using WordPress
 * built-in system. This ensures proper loading order, dependency management,
 * and prevents conflicts with plugins and other themes.
 * 
 * @since 1.0.0
 */
function cloudsync_scripts() {

    // Enqueue main theme stylesheet
    // Using get_theme_version() ensures proper cache busting when theme updates
    wp_enqueue_style(
        'cloudsync-style',                    // Unique handle for this stylesheet
        get_stylesheet_uri(),                 // Path to style.css file
        array(),                              // Dependencies (none for main stylesheet)
        cloudsync_get_theme_version()        // Version number for cache busting
    );


    // Enqueue theme JavaScript with proper dependencies
    wp_enqueue_script(
        'cloudsync-theme-js',                        // Unique handle for this script
        get_template_directory_uri() . '/assets/js/theme.js',  // Path to JavaScript file
        array('jquery'),                             // Dependencies - requires jQuery
        cloudsync_get_theme_version(),               // Version for cache busting
        true                                         // Load in footer for better performance
    );

    // Enqueue Google Fonts for modern typography
    // Inter font family provides excellent readability and professional appearance
    wp_enqueue_style(
        'cloudsync-google-fonts',                    // Unique handle
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        array(),                                     // No dependencies
        null                                         // No version for external resources
    );

    // Enqueue Font Awesome for icons
    // Version 6.0.0 provides comprehensive icon library for modern web design
    wp_enqueue_style(
        'cloudsync-font-awesome',                    // Unique handle
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        array(),                                     // No dependencies
        '6.0.0'                                      // Specific version for reliability
    );
}
add_action('wp_enqueue_scripts', 'cloudsync_scripts');

/**
 * Register widget areas
 * 
 * This function creates widget-ready areas with descriptive names
 * that help users understand exactly where their content will appear.
 * 
 * @since 1.0.0
 */
function cloudsync_widgets_init() {

    // Footer Column 1 - Typically used for company info or logo
    register_sidebar(array(
        'name'          => __('Footer: Company Info', 'cloudsync'),
        'id'            => 'footer-1',
        'description'   => __('Left column of footer. Perfect for company logo, description, or contact details.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 2 - Navigation or quick links
    register_sidebar(array(
        'name'          => __('Footer: Quick Links', 'cloudsync'),
        'id'            => 'footer-2',
        'description'   => __('Second column of footer. Ideal for navigation menu, product links, or sitemap.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 3 - Support or resources
    register_sidebar(array(
        'name'          => __('Footer: Support & Resources', 'cloudsync'),
        'id'            => 'footer-3',
        'description'   => __('Third column of footer. Great for support links, documentation, or helpful resources.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Column 4 - Contact and social
    register_sidebar(array(
        'name'          => __('Footer: Contact & Social', 'cloudsync'),
        'id'            => 'footer-4',
        'description'   => __('Right column of footer. Perfect for contact information, social media links, or newsletter signup.', 'cloudsync'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'cloudsync_widgets_init');

/**
 * Get theme version for cache busting
 * 
 * This function retrieves the current theme version from style.css header
 * and uses it for enqueuing stylesheets and scripts. This ensures that
 * when users update the theme, browsers will load fresh files instead
 * of serving cached versions that might be outdated.
 * 
 * @since 1.0.0
 * @return string Theme version number
 */
function cloudsync_get_theme_version() {

    // Get current theme object
    $theme = wp_get_theme();

    // Return version number from style.css header
    // Falls back to current timestamp if version is not found
    return $theme->get('Version') ?: time();
}

/**
 * Process and display pricing plan features from textarea input
 * 
 * Takes a textarea string with features (one per line) and converts it
 * into HTML list items with checkmark icons. Handles empty lines gracefully
 * and sanitizes each feature for security.
 * 
 * @param string $features_text Raw textarea input from Customizer
 * @return string HTML list items ready for output
 */
function cloudsync_get_pricing_features($features_text) {
    // If no features provided, return empty string to avoid broken HTML
    if (empty($features_text)) {
        return '';
    }

    // Split the textarea content by line breaks into an array
    $features = explode("\n", $features_text);
    $output = '';

    // Process each line individually
    foreach ($features as $feature) {
        // Remove whitespace from beginning and end of each line
        $feature = trim($feature);

        // Skip empty lines - users might accidentally add blank lines
        if (!empty($feature)) {
            // Escape HTML for security and build the list item
            $output .= '<li><i class="fas fa-check"></i>' . esc_html($feature) . '</li>';
        }
    }

    return $output;
}

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

/**
 * Analyze page content and context to determine optimal styling approach
 * 
 * This intelligent system examines multiple aspects of a WordPress page including
 * content length, semantic meaning, visual elements, and structural characteristics
 * to automatically apply the most appropriate presentation styles. The function
 * serves as the brain of our adaptive page system, making decisions that would
 * typically require manual configuration from users.
 * 
 * The analysis covers several dimensions:
 * - Content volume classification (short/medium/long)
 * - Semantic page type detection (about/legal/product/contact/docs)
 * - Visual content analysis (images, multimedia elements)
 * - Structural complexity assessment
 * 
 * All classifications are returned as CSS classes that can be applied to page
 * containers, enabling sophisticated responsive design that adapts automatically
 * to content characteristics without user intervention.
 * 
 * @since 1.0.0
 * @return string Space-separated CSS classes for intelligent styling
 */
function cloudsync_analyze_page_context() {
    // === SECURITY AND CONTEXT VALIDATION ===
    // First, we ensure this function only runs on actual pages, not posts,
    // archives, or other WordPress content types. This prevents misclassification
    // and ensures our styling system only activates where it's intended to work.
    if (!is_page()) {
        return '';
    }

    // Verify we have access to the global post object and we're in the main query.
    // The main query check prevents our function from running in sidebars,
    // widgets, or other secondary content areas where it might interfere.
    global $post;
    if (!$post || !is_main_query()) {
        return '';
    }

    // Initialize our classification results array. This will collect all the
    // characteristics we discover about the page throughout our analysis.
    $classes = array();

    // === BASIC PAGE INFORMATION GATHERING ===
    // Extract fundamental page data that forms the basis of our analysis.
    // We get both the display title and the URL slug because users might
    // create different naming patterns for the same type of content.
    $title = get_the_title();
    $slug = $post->post_name;

    // === ADVANCED CONTENT PROCESSING ===
    // This is the most critical part of our analysis. We need to get the exact
    // same content that WordPress will display to users, including all processed
    // shortcodes, applied filters, and formatting. This ensures our word count
    // and content analysis matches what visitors actually see.
    $raw_content = $post->post_content;

    // Apply WordPress content filters to get fully processed content.
    // This is the same processing pipeline that the_content() uses when
    // displaying pages to visitors, ensuring our analysis is accurate.
    $processed_content = apply_filters('the_content', $raw_content);
    $processed_content = str_replace(']]>', ']]&gt;', $processed_content);

    // Implement fallback strategy for edge cases where content processing fails.
    // Some plugins or custom post types might interfere with content filters,
    // so we ensure we always have content to analyze.
    $final_content = $processed_content;
    if (empty(trim(wp_strip_all_tags($processed_content)))) {
        $final_content = $raw_content;
    }

    // === SOPHISTICATED WORD COUNTING SYSTEM ===
    // Standard PHP word counting functions often fail with WordPress content
    // due to HTML remnants, special characters, and formatting artifacts.
    // We implement a robust counting system that handles these challenges.
    $word_count = cloudsync_count_words_intelligently($final_content);

    // === CONTENT LENGTH CLASSIFICATION ===
    // Different content lengths require different presentation approaches.
    // Short content benefits from centered layouts with generous whitespace.
    // Medium content uses standard article formatting with balanced proportions.
    // Long content needs enhanced navigation, reading progress indicators,
    // and optimized typography for sustained reading sessions.
    if ($word_count < 200) {
        $classes[] = 'short-content';
    } elseif ($word_count > 1000) {
        $classes[] = 'long-content';
    } else {
        $classes[] = 'medium-content';
    }

    // === SEMANTIC PAGE TYPE DETECTION ===
    // We analyze both the page title and URL slug to determine the semantic
    // purpose of the page. This enables context-appropriate styling where
    // about pages get personal, storytelling-focused layouts while legal
    // pages receive document-optimized formatting.

    // Create combined text for analysis to catch different naming patterns
    $analysis_text = strtolower($title . ' ' . $slug);

    // About/Company pages detection - personal and brand storytelling content
    if (preg_match('/(about|team|story|company|founder|history|mission|vision|values|culture)/i', $analysis_text)) {
        $classes[] = 'page-type-about';
    }
    // Legal/Policy pages detection - formal documentation that requires
    // enhanced readability and navigation for lengthy legal text
    elseif (preg_match('/(privacy|terms|legal|policy|gdpr|cookie|disclaimer|agreement|compliance)/i', $analysis_text)) {
        $classes[] = 'page-type-legal';
    }
    // Contact/Support pages detection - action-oriented pages that should
    // encourage user engagement and provide clear communication pathways
    elseif (preg_match('/(contact|support|help|get-in-touch|reach-us|talk|chat|call)/i', $analysis_text)) {
        $classes[] = 'page-type-contact';
    }
    // Product/Service pages detection - conversion-focused content that
    // should highlight value propositions and encourage user action
    elseif (preg_match('/(features|product|service|solution|pricing|plans|offering|software)/i', $analysis_text)) {
        $classes[] = 'page-type-product';
    }
    // Documentation pages detection - technical content requiring enhanced
    // navigation, code formatting, and developer-friendly presentation
    elseif (preg_match('/(docs|documentation|api|guide|manual|tutorial|reference|developer)/i', $analysis_text)) {
        $classes[] = 'page-type-docs';
    }

    // === VISUAL CONTENT ANALYSIS ===
    // Pages with significant visual content need different layout approaches
    // to showcase images effectively while maintaining readability.

    // Check for featured image presence
    if (has_post_thumbnail()) {
        $classes[] = 'has-featured-image';
    }

    // Analyze image density in content to determine if this is a visual-heavy page
    // Pages with many images benefit from gallery-style layouts and enhanced
    // image presentation features like lightboxes and optimized spacing.
    $image_count = preg_match_all('/<img[^>]+>/i', $final_content);
    if ($image_count > 3) {
        $classes[] = 'image-rich';
    }

    // === ADVANCED CONTENT CHARACTERISTICS ===
    // Additional analysis for specialized content types that might need
    // specific presentation enhancements.

    // Detect form-heavy pages that need enhanced form styling
    $form_count = preg_match_all('/<form[^>]*>/i', $final_content);
    if ($form_count > 0) {
        $classes[] = 'has-forms';
    }

    // Detect code-heavy content that benefits from syntax highlighting
    // and developer-focused typography improvements
    $code_indicators = preg_match_all('/(<code[^>]*>|<pre[^>]*>|```|\$[a-zA-Z_]|\{[^}]*\}|function\s+[a-zA-Z_])/i', $final_content);
    if ($code_indicators > 5) {
        $classes[] = 'code-heavy';
    }


    // === RETURN CLASSIFICATION RESULTS ===
    // Convert our analysis results into a space-separated string of CSS classes
    // that can be applied to page containers for intelligent styling.
    return implode(' ', array_filter($classes));
}

/**
 * Intelligent word counting system for WordPress content
 * 
 * Standard PHP word counting functions often fail with WordPress content due to
 * HTML remnants, special characters, shortcode artifacts, and Unicode complexities.
 * This function implements a robust, multi-stage content processing pipeline that
 * accurately counts words in real-world WordPress content scenarios.
 * 
 * The processing pipeline includes:
 * 1. HTML entity decoding for special characters
 * 2. Shortcode remnant removal and cleanup  
 * 3. Unicode-aware whitespace normalization
 * 4. Intelligent word boundary detection
 * 5. Artifact filtering to exclude formatting remnants
 * 
 * @since 1.0.0
 * @param string $content Raw or processed WordPress content
 * @return int Accurate count of meaningful words in content
 */
function cloudsync_count_words_intelligently($content) {
    // === STAGE 1: HTML AND ENTITY CLEANUP ===
    // Remove all HTML tags while preserving text content and word boundaries
    $content = wp_strip_all_tags($content);

    // Decode HTML entities that might have been left behind. WordPress often
    // stores content with encoded entities that need to be converted back to
    // readable characters for accurate word counting.
    $content = html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // === STAGE 2: SHORTCODE AND WORDPRESS ARTIFACT REMOVAL ===
    // Remove any remaining shortcode patterns that might have survived processing.
    // These can appear as [shortcode] or {{variable}} patterns that shouldn't
    // be counted as words but might confuse standard counting algorithms.
    $content = preg_replace('/\[[^\]]*\]/', ' ', $content);
    $content = preg_replace('/\{\{[^}]*\}\}/', ' ', $content);

    // Remove WordPress-specific formatting artifacts like &nbsp; entities
    // and other invisible characters that can interfere with word boundaries.
    $content = str_replace(array('&nbsp;', '&ndash;', '&mdash;', '&hellip;'), ' ', $content);

    // === STAGE 3: CHARACTER SET NORMALIZATION ===
    // Use Unicode-aware regex to keep only legitimate word characters.
    // \p{L} matches any Unicode letter, \p{N} matches numbers, we also preserve
    // apostrophes and hyphens which are part of valid words in English.
    $content = preg_replace('/[^\p{L}\p{N}\s\-_\']/u', ' ', $content);

    // === STAGE 4: WHITESPACE NORMALIZATION ===
    // Convert all types of whitespace (including Unicode space characters,
    // tabs, newlines, etc.) into regular spaces, then collapse multiple
    // consecutive spaces into single spaces.
    $content = preg_replace('/[\s\p{Z}]+/u', ' ', $content);
    $content = trim($content);

    // === STAGE 5: EDGE CASE HANDLING ===
    // If content is completely empty after all cleanup, return zero to avoid
    // division by zero errors or other edge case problems.
    if (empty($content)) {
        return 0;
    }

    // === STAGE 6: INTELLIGENT WORD SPLITTING AND FILTERING ===
    // Split content into potential words using whitespace boundaries, filtering
    // out empty strings that might result from multiple consecutive spaces.
    $potential_words = preg_split('/\s+/', $content, -1, PREG_SPLIT_NO_EMPTY);

    // Filter out artifacts that look like words but aren't meaningful content.
    // This includes very short strings that are likely formatting remnants,
    // pure punctuation, and other non-word artifacts.
    $actual_words = array_filter($potential_words, function ($word) {
        $cleaned_word = trim($word, '-_\''); // Remove common word decorations

        // Exclude empty strings and pure punctuation
        if (empty($cleaned_word) || ctype_punct($cleaned_word)) {
            return false;
        }

        // Exclude single characters unless they're meaningful (like "I" or "a")
        if (strlen($cleaned_word) === 1 && !preg_match('/[aeiouAEIOU]/', $cleaned_word)) {
            return false;
        }

        // Include everything else as a valid word
        return true;
    });

    // Return the count of words that passed all our validation filters
    return count($actual_words);
}



function truncateWords($text, $wordLimit = 5) {
    // Убираем HTML теги
    $text = strip_tags($text);

    // Убираем лишние пробелы
    $text = trim(preg_replace('/\s+/', ' ', $text));

    // Разбиваем на слова
    $words = explode(' ', $text);

    if (count($words) > $wordLimit) {
        $truncated = implode(' ', array_slice($words, 0, $wordLimit));
        // Убираем знаки препинания в конце, если есть
        $truncated = rtrim($truncated, '.,!?;:');
        return $truncated . '...';
    }

    return $text;
}


require_once get_template_directory() . '/inc/customizer.php';
