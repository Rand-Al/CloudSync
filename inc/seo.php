<?php

/**
 * CloudSync Essential SEO Module
 * 
 * Lightweight SEO functionality with only critical features:
 * - Open Graph meta tags for social sharing
 * - Basic meta descriptions with smart fallbacks
 * - Canonical URLs for duplicate content prevention
 * 
 * Compatible with popular SEO plugins (Yoast, RankMath, etc.)
 * 
 * @package CloudSync
 * @version 1.0.0
 * @since 1.0.0
 */

// Prevent direct access to this file for security
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Initialize essential SEO functionality
 * 
 * Only adds SEO features if no major SEO plugin is detected
 * 
 * @since 1.0.0
 */
function cloudsync_seo_init() {
    // Check if major SEO plugins are active
    if (cloudsync_has_seo_plugin()) {
        return; // Let SEO plugins handle everything
    }
    
    // Add essential meta tags with low priority to avoid conflicts
    add_action('wp_head', 'cloudsync_output_essential_meta_tags', 5);
    add_action('wp_head', 'cloudsync_output_canonical_url', 6);
}
add_action('init', 'cloudsync_seo_init');

/**
 * Check if major SEO plugins are active
 * 
 * @since 1.0.0
 * @return bool True if SEO plugin detected
 */
function cloudsync_has_seo_plugin() {
    // Check for popular SEO plugins
    $seo_plugins = array(
        'wordpress-seo/wp-seo.php',           // Yoast SEO
        'all-in-one-seo-pack/all_in_one_seo_pack.php', // AIOSEO
        'seo-by-rank-math/rank-math.php',     // RankMath
        'autodescription/autodescription.php', // The SEO Framework
        'wp-seopress/seopress.php'            // SEOPress
    );
    
    foreach ($seo_plugins as $plugin) {
        if (is_plugin_active($plugin)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Output essential meta tags only
 * 
 * Minimal SEO tags with smart fallbacks - only Open Graph and meta description
 * 
 * @since 1.0.0
 */
function cloudsync_output_essential_meta_tags() {
    
    // Skip on admin pages
    if (is_admin()) {
        return;
    }
    
    // Get basic data with simple fallbacks
    $title = cloudsync_get_simple_title();
    $description = cloudsync_get_simple_description();
    $image = cloudsync_get_simple_image();
    $url = cloudsync_get_canonical_url();
    
    echo "\n<!-- CloudSync Essential SEO -->\n";
    
    // Meta description
    if ($description) {
        echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
    }
    
    // Open Graph essentials for social sharing
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta property="og:type" content="' . (is_front_page() ? 'website' : 'article') . '">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '">' . "\n";
    
    if ($description) {
        echo '<meta property="og:description" content="' . esc_attr($description) . '">' . "\n";
    }
    
    if ($image) {
        echo '<meta property="og:image" content="' . esc_url($image) . '">' . "\n";
    }
    
    echo "<!-- /CloudSync Essential SEO -->\n\n";
}

/**
 * Get simple page title
 * 
 * @since 1.0.0
 * @return string Page title
 */
function cloudsync_get_simple_title() {
    if (function_exists('wp_get_document_title')) {
        return wp_get_document_title();
    }
    
    return get_the_title() ?: get_bloginfo('name');
}

/**
 * Get simple description
 * 
 * @since 1.0.0
 * @return string Page description
 */
function cloudsync_get_simple_description() {
    // Homepage description from customizer with proper default
    if (is_front_page()) {
        $description = cloudsync_get_customizer_value(
            'cloudsync_hero_description', 
            'CloudSync revolutionizes how teams collaborate with lightning-fast performance, enterprise-grade security, and seamless integration across all your favorite tools.'
        );
        if ($description) {
            return $description;
        }
    }
    
    // Post/page excerpt
    if (is_singular()) {
        $excerpt = get_the_excerpt();
        if ($excerpt) {
            return wp_strip_all_tags($excerpt);
        }
    }
    
    // Site description fallback - always ensure we have something
    $site_desc = get_bloginfo('description');
    if ($site_desc) {
        return $site_desc;
    }
    
    // Final fallback
    return 'Professional cloud computing solution for modern teams.';
}

/**
 * Get simple image for social sharing
 * 
 * @since 1.0.0
 * @return string Image URL
 */
function cloudsync_get_simple_image() {
    // Featured image first
    if (is_singular() && has_post_thumbnail()) {
        $image_url = wp_get_attachment_image_src(get_post_thumbnail_id(), 'large');
        if ($image_url) {
            return $image_url[0];
        }
    }
    
    // Site icon fallback
    return get_site_icon_url(512);
}

/**
 * Get canonical URL for current page
 * 
 * @since 1.0.0
 * @return string Canonical URL
 */
function cloudsync_get_canonical_url() {
    if (is_front_page()) {
        return home_url('/');
    }
    
    if (is_singular()) {
        return get_permalink();
    }
    
    global $wp;
    return home_url(add_query_arg(array(), $wp->request));
}

/**
 * Output canonical URL link tag
 * 
 * @since 1.0.0
 */
function cloudsync_output_canonical_url() {
    if (is_admin()) {
        return;
    }
    
    $canonical_url = cloudsync_get_canonical_url();
    if ($canonical_url) {
        echo '<link rel="canonical" href="' . esc_url($canonical_url) . '">' . "\n";
    }
}