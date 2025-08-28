<?php

/**
 * CloudSync Theme Template Functions
 * 
 * Template helper functions and utilities for the CloudSync theme.
 * These functions provide enhanced functionality for displaying content,
 * content processing, and other template-related features.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
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

/**
 * Truncate text to specified word limit with ellipsis
 * 
 * Helper function to truncate text to a specified number of words,
 * removing HTML tags and extra whitespace, with proper punctuation handling.
 * 
 * @since 1.0.0
 * @param string $text Text to truncate
 * @param int $wordLimit Maximum number of words
 * @return string Truncated text with ellipsis if needed
 */
function truncateWords($text, $wordLimit = 5) {
    // Remove HTML tags
    $text = strip_tags($text);

    // Remove extra whitespace
    $text = trim(preg_replace('/\s+/', ' ', $text));

    // Split into words
    $words = explode(' ', $text);

    if (count($words) > $wordLimit) {
        $truncated = implode(' ', array_slice($words, 0, $wordLimit));
        // Remove trailing punctuation marks
        $truncated = rtrim($truncated, '.,!?;:');
        return $truncated . '...';
    }

    return $text;
}

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
