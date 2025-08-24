<?php

/**
 * CloudSync Performance Module
 * 
 * Performance optimizations including critical CSS inlining,
 * lazy loading, asset optimization, and caching
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
 * Initialize performance optimizations
 * 
 * @since 1.0.0
 */
function cloudsync_performance_init() {
    // Inline critical CSS
    add_action('wp_head', 'cloudsync_inline_critical_css', 5);
    
    // Preload critical resources
    add_action('wp_head', 'cloudsync_preload_critical_resources', 4);
    
    // Use minified assets in production
    add_filter('cloudsync_use_minified_assets', 'cloudsync_should_use_minified_assets');
    
    // Defer non-critical CSS
    add_filter('style_loader_tag', 'cloudsync_defer_non_critical_css', 10, 4);
    
    // Add lazy loading to images
    add_filter('wp_get_attachment_image_attributes', 'cloudsync_add_lazy_loading', 10, 3);
    add_filter('the_content', 'cloudsync_add_lazy_loading_to_content');
    
    // Optimize JavaScript loading
    add_filter('script_loader_tag', 'cloudsync_optimize_script_loading', 10, 3);
    
    // Add WebP support
    add_filter('wp_get_attachment_image_src', 'cloudsync_webp_support', 10, 4);
    
    // Remove unnecessary WordPress features for performance
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    
    // Optimize database queries
    add_action('pre_get_posts', 'cloudsync_optimize_queries');
}
add_action('init', 'cloudsync_performance_init');

/**
 * Determine if minified assets should be used
 * 
 * @since 1.0.0
 * @return bool
 */
function cloudsync_should_use_minified_assets() {
    // Use minified in production (when WP_DEBUG is false)
    return !defined('WP_DEBUG') || !WP_DEBUG;
}

/**
 * Inline critical CSS in head
 * 
 * @since 1.0.0
 */
function cloudsync_inline_critical_css() {
    $use_minified = apply_filters('cloudsync_use_minified_assets', cloudsync_should_use_minified_assets());
    
    if ($use_minified) {
        $critical_css_path = get_template_directory() . '/assets/dist/critical.min.css';
    } else {
        $critical_css_path = get_template_directory() . '/assets/css/critical.css';
    }
    
    if (file_exists($critical_css_path)) {
        $critical_css = file_get_contents($critical_css_path);
        
        if ($critical_css) {
            // Minify CSS if not already minified
            if (!$use_minified) {
                $critical_css = cloudsync_minify_css($critical_css);
            }
            
            echo '<style id="critical-css">' . $critical_css . '</style>' . "\n";
            
            // Load remaining CSS asynchronously
            $main_css_url = $use_minified 
                ? get_template_directory_uri() . '/assets/dist/cloudsync.min.css?v=' . cloudsync_get_theme_version()
                : get_stylesheet_uri() . '?v=' . cloudsync_get_theme_version();
            
            ?>
            <script>
            (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '<?php echo $main_css_url; ?>';
                link.media = 'print';
                link.onload = function() { this.media = 'all'; this.onload = null; };
                link.onerror = function() { this.media = 'all'; };
                document.head.appendChild(link);
                
                // Fallback for older browsers
                setTimeout(function() {
                    if (link.media === 'print') {
                        link.media = 'all';
                    }
                }, 3000);
            })();
            </script>
            <noscript>
                <link rel='stylesheet' href='<?php echo $main_css_url; ?>'>
            </noscript>
            <?php
        }
    }
}

/**
 * Preload critical resources
 * 
 * @since 1.0.0
 */
function cloudsync_preload_critical_resources() {
    // Preload Inter font
    echo '<link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" as="font" type="font/woff2" crossorigin>' . "\n";
    
    // Preload critical JavaScript
    echo '<link rel="preload" href="' . get_template_directory_uri() . '/assets/js/theme.js?v=' . cloudsync_get_theme_version() . '" as="script">' . "\n";
    
    // Preconnect to external domains
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    echo '<link rel="preconnect" href="https://cdnjs.cloudflare.com">' . "\n";
}

/**
 * Defer non-critical CSS
 * 
 * @since 1.0.0
 * @param string $html
 * @param string $handle
 * @param string $href
 * @param string $media
 * @return string
 */
function cloudsync_defer_non_critical_css($html, $handle, $href, $media) {
    // Don't defer admin styles or critical styles
    if (is_admin() || strpos($handle, 'critical') !== false) {
        return $html;
    }
    
    // Defer non-critical stylesheets
    $non_critical_handles = array(
        'cloudsync-components',
        'cloudsync-gutenberg',
        'cloudsync-contact',
        'cloudsync-font-awesome'
    );
    
    if (in_array($handle, $non_critical_handles)) {
        return str_replace(
            "rel='stylesheet'",
            "rel='preload' as='style' onload=\"this.onload=null;this.rel='stylesheet'\"",
            $html
        );
    }
    
    return $html;
}

/**
 * Add lazy loading to images
 * 
 * @since 1.0.0
 * @param array $attr
 * @param WP_Post $attachment
 * @param string $size
 * @return array
 */
function cloudsync_add_lazy_loading($attr, $attachment, $size) {
    // Don't lazy load if already has loading attribute
    if (isset($attr['loading'])) {
        return $attr;
    }
    
    // Add lazy loading and placeholder
    $attr['loading'] = 'lazy';
    $attr['data-src'] = $attr['src'];
    
    // Add low-quality placeholder
    $attr['src'] = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    
    // Add class for styling
    $attr['class'] = (isset($attr['class']) ? $attr['class'] . ' ' : '') . 'lazy-load';
    
    return $attr;
}

/**
 * Add lazy loading to content images
 * 
 * @since 1.0.0
 * @param string $content
 * @return string
 */
function cloudsync_add_lazy_loading_to_content($content) {
    // Don't process in admin or feeds
    if (is_admin() || is_feed() || is_preview()) {
        return $content;
    }
    
    // Add lazy loading to img tags
    $content = preg_replace_callback('/<img([^>]+)>/i', function($matches) {
        $img_tag = $matches[0];
        
        // Skip if already has loading attribute
        if (strpos($img_tag, 'loading=') !== false) {
            return $img_tag;
        }
        
        // Add lazy loading
        $img_tag = str_replace('<img', '<img loading="lazy"', $img_tag);
        
        return $img_tag;
    }, $content);
    
    return $content;
}

/**
 * Optimize script loading
 * 
 * @since 1.0.0
 * @param string $tag
 * @param string $handle
 * @param string $src
 * @return string
 */
function cloudsync_optimize_script_loading($tag, $handle, $src) {
    // Don't modify admin scripts
    if (is_admin()) {
        return $tag;
    }
    
    // Add defer to non-critical scripts
    $defer_scripts = array(
        'cloudsync-theme-js',
        'cloudsync-font-awesome'
    );
    
    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }
    
    return $tag;
}

/**
 * WebP support for images
 * 
 * @since 1.0.0
 * @param array $image
 * @param int $attachment_id
 * @param string $size
 * @param bool $icon
 * @return array
 */
function cloudsync_webp_support($image, $attachment_id, $size, $icon) {
    if (!$image) {
        return $image;
    }
    
    $upload_dir = wp_upload_dir();
    $image_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $image[0]);
    $webp_path = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image_path);
    $webp_url = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image[0]);
    
    // Check if WebP version exists
    if (file_exists($webp_path)) {
        $image[0] = $webp_url;
    }
    
    return $image;
}

/**
 * Minify CSS
 * 
 * @since 1.0.0
 * @param string $css
 * @return string
 */
function cloudsync_minify_css($css) {
    // Remove comments
    $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
    
    // Remove whitespace
    $css = str_replace(array("\r\n", "\r", "\n", "\t"), '', $css);
    $css = preg_replace('/\s+/', ' ', $css);
    $css = preg_replace('/\s*([{}|:;,>+~])\s*/', '$1', $css);
    
    // Remove trailing semicolon before closing brace
    $css = str_replace(';}', '}', $css);
    
    return trim($css);
}

/**
 * Optimize database queries
 * 
 * @since 1.0.0
 * @param WP_Query $query
 */
function cloudsync_optimize_queries($query) {
    // Don't modify admin queries
    if (is_admin() || !$query->is_main_query()) {
        return;
    }
    
    // Optimize front page queries
    if (is_front_page()) {
        // Limit posts if not needed
        $query->set('posts_per_page', 1);
        
        // Remove unnecessary meta queries
        $query->set('no_found_rows', true);
        $query->set('update_post_meta_cache', false);
        $query->set('update_post_term_cache', false);
    }
}

/**
 * Generate WebP images (if GD library supports it)
 * 
 * @since 1.0.0
 * @param string $file_path
 * @return bool
 */
function cloudsync_generate_webp($file_path) {
    if (!function_exists('imagewebp')) {
        return false;
    }
    
    $info = pathinfo($file_path);
    $webp_path = $info['dirname'] . '/' . $info['filename'] . '.webp';
    
    // Skip if WebP already exists
    if (file_exists($webp_path)) {
        return true;
    }
    
    $image = null;
    
    switch (strtolower($info['extension'])) {
        case 'jpg':
        case 'jpeg':
            $image = imagecreatefromjpeg($file_path);
            break;
        case 'png':
            $image = imagecreatefrompng($file_path);
            break;
        default:
            return false;
    }
    
    if ($image) {
        $result = imagewebp($image, $webp_path, 85);
        imagedestroy($image);
        return $result;
    }
    
    return false;
}

/**
 * Cache performance data
 * 
 * @since 1.0.0
 * @param string $key
 * @param mixed $data
 * @param int $expiration
 * @return bool
 */
function cloudsync_cache_set($key, $data, $expiration = HOUR_IN_SECONDS) {
    return set_transient('cloudsync_cache_' . $key, $data, $expiration);
}

/**
 * Get cached performance data
 * 
 * @since 1.0.0
 * @param string $key
 * @return mixed
 */
function cloudsync_cache_get($key) {
    return get_transient('cloudsync_cache_' . $key);
}

/**
 * Clear performance cache
 * 
 * @since 1.0.0
 */
function cloudsync_clear_performance_cache() {
    global $wpdb;
    
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_cloudsync_cache_%' 
         OR option_name LIKE '_transient_timeout_cloudsync_cache_%'"
    );
}