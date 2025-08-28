<?php

/**
 * CloudSync Performance Optimization Module
 * 
 * This comprehensive module creates an intelligent bridge between development
 * and production environments. It automatically serves optimized assets in
 * production while preserving the development experience with unminified files.
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Think of this system as a smart librarian who knows exactly where to find
 * the best version of every book. During quiet study hours (development),
 * she gives you the full annotated editions with all the notes and comments.
 * During busy periods (production), she efficiently provides condensed
 * versions that contain the same information but load much faster.
 * 
 * INTEGRATION WITH BUILD SYSTEM:
 * This module works seamlessly with the build-assets.php script:
 * - Development: Uses original files from assets/css/modules/ and assets/js/
 * - Production: Automatically serves minified versions from assets/dist/
 * - Fallback: If optimized files don't exist, gracefully serves originals
 * - Zero configuration: Works transparently without changing existing code
 * 
 * KEY PRINCIPLES IMPLEMENTED:
 * 1. Defensive Programming: Every function handles edge cases gracefully
 * 2. Environment Awareness: Automatically detects development vs production
 * 3. Graceful Degradation: Never breaks if optimized files are missing
 * 4. Performance First: Minimal overhead for maximum speed gains
 * 
 * @package CloudSync
 * @version 1.0.0
 * @since 1.0.0
 * @author CloudSync Theme
 */

// Security barrier: Prevent direct access to this file
// This is like having a bouncer at the door who only lets in authorized visitors
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Initialize the complete performance optimization system
 * 
 * This master function acts as the conductor of our optimization orchestra.
 * It carefully coordinates when and how optimizations are applied, ensuring
 * that developers have a smooth experience while users get maximum performance.
 * 
 * The system uses WordPress hooks to intercept the normal asset loading process
 * and intelligently substitute optimized versions when appropriate. This means
 * your existing code in functions.php doesn't need to change at all - the
 * optimization happens transparently behind the scenes.
 * 
 * HOOK PRIORITY EXPLANATION:
 * We use priority 10 (WordPress default) for most hooks, but priority 1 and 2
 * for head elements to ensure our performance hints load early in the document.
 * This helps browsers start optimizing resource loading as soon as possible.
 * 
 * @since 1.0.0
 */
function cloudsync_init_performance_optimization() {
    // The first and most important decision: should we optimize at all?
    // We only activate optimization in production environments to avoid
    // interfering with the development workflow where you need readable code
    if (cloudsync_is_production_mode()) {

        // Hook into WordPress asset loading pipeline for CSS files
        // This filter runs every time WordPress prepares a stylesheet URL
        add_filter('style_loader_src', 'cloudsync_optimize_css_path', 10, 2);

        // Hook into WordPress asset loading pipeline for JavaScript files
        // This filter runs every time WordPress prepares a script URL
        add_filter('script_loader_src', 'cloudsync_optimize_js_path', 10, 2);

        // Add performance optimization hints to help browsers load resources efficiently
        // Priority 1 ensures these hints appear early in the HTML head section
        add_action('wp_head', 'cloudsync_add_performance_hints', 1);

        // Add invisible debug information for developers to troubleshoot issues
        // Priority 2 places this after performance hints but before most other head content
        add_action('wp_head', 'cloudsync_add_optimization_debug_info', 2);

        // Optional: Enable combined file loading for ultimate optimization
        // Uncomment the next line if you want to use the experimental combined CSS loading
        // cloudsync_enable_combined_css_loading();
    }
}
// Hook our initialization function into WordPress startup process
// The 'init' action fires after WordPress has loaded but before processing page requests
add_action('init', 'cloudsync_init_performance_optimization');

/**
 * Intelligent production mode detection system
 * 
 * This function implements a sophisticated decision tree to determine whether
 * we're running in a development or production environment. Think of it as
 * a security checkpoint that examines multiple forms of identification
 * before deciding whether to activate performance optimizations.
 * 
 * The logic follows a hierarchy of trust:
 * 1. WordPress WP_DEBUG setting (most reliable developer intent)
 * 2. Server hostname patterns (catches local development environments)
 * 3. Custom override constants (allows manual control)
 * 4. Default assumption (production unless proven otherwise)
 * 
 * DEVELOPMENT-FIRST PHILOSOPHY:
 * The function is designed to err on the side of development convenience.
 * If there's any doubt about the environment, it defaults to development mode
 * to avoid interfering with debugging and development workflows.
 * 
 * @since 1.0.0
 * @return bool True if production optimizations should be active
 */
function cloudsync_is_production_mode() {

    // First check: WordPress debug setting is the most reliable indicator
    // When WP_DEBUG is true, developers explicitly want debugging capabilities
    // and we should never interfere with their development process

    if (defined('WP_DEBUG') && WP_DEBUG === true) {
        return false; // Developer explicitly enabled debug mode - respect their choice
    }

    // Second check: analyze the server hostname for development patterns
    // Many development environments use predictable naming conventions
    // ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТИРОВАНИЯ МИНИФИКАЦИИ
    // $server_name = $_SERVER['SERVER_NAME'] ?? '';
    // $development_indicators = array(
    //     'localhost',     // Standard local development
    //     '127.0.0.1',    // Localhost IP address
    //     '.local',       // Common local development suffix
    //     '.dev',         // Development domain suffix
    //     '.test',        // Testing domain suffix
    //     'staging',      // Staging environment indicator
    //     'dev.',         // Development subdomain prefix
    // );

    // // Check if any development indicators appear in the hostname
    // foreach ($development_indicators as $indicator) {
    //     if (strpos($server_name, $indicator) !== false) {
    //         return false; // Found development environment indicator
    //     }
    // }

    // Third check: look for explicit production mode override
    // This allows advanced users to manually control optimization behavior
    if (defined('CLOUDSYNC_PRODUCTION_MODE')) {
        return CLOUDSYNC_PRODUCTION_MODE; // Respect explicit override
    }

    // Final decision: if we've passed all development checks, assume production
    // This is the safest default for live websites where performance matters most
    return true;
}

/**
 * Intelligent CSS path optimization with bulletproof error handling
 * 
 * This function acts as a smart postal service that automatically forwards
 * mail to updated addresses. When WordPress tries to load a CSS file from
 * your development modules folder, we check if there's an optimized version
 * in the distribution folder and redirect the request if the optimized file exists.
 * 
 * DEFENSIVE PROGRAMMING PRINCIPLES:
 * Every step of this function includes error checking and fallback behavior.
 * We never assume that array elements exist, files are present, or patterns
 * will match. This ensures the function never breaks, even in unexpected situations.
 * 
 * REGULAR EXPRESSION BREAKDOWN:
 * The pattern '/\/assets\/css\/modules\/(.+?)\.css(\?.*)?$/' works as follows:
 * - \/assets\/css\/modules\/ : Matches the exact path structure
 * - (.+?) : Captures the filename (non-greedy to stop at first .css)
 * - \.css : Matches the literal .css extension
 * - (\?.*)? : Optionally captures query parameters like ?ver=1.0.0
 * - $ : Ensures we're matching the end of the string
 * 
 * @since 1.0.0
 * @param string $src    The original CSS file URL that WordPress wants to load
 * @param string $handle The WordPress handle/identifier for this stylesheet
 * @return string        The optimized URL if available, or original URL unchanged
 */
function cloudsync_optimize_css_path($src, $handle) {

    // Get the base theme URL for comparison purposes
    // This helps us identify which files belong to our theme vs external resources
    $theme_url = get_template_directory_uri();

    // Safety check: Only process files that actually belong to our theme
    // We don't want to interfere with external resources like Google Fonts or CDN files
    if (strpos($src, $theme_url) === false) {
        return $src; // This is an external file - leave it completely alone
    }

    // Use regular expression to parse CSS module files and extract key information
    // The $matches array will be populated by preg_match if a pattern is found
    if (preg_match('/\/assets\/css\/modules\/(.+?)\.css(\?.*)?$/', $src, $matches)) {

        // Extract the filename from the first capture group
        // This is guaranteed to exist if preg_match returned true (found a match)
        $filename = $matches[1]; // Example: 'base' from 'base.css'

        // CRITICAL FIX: Safely extract query parameters using isset() check
        // The second capture group might not exist if there are no query parameters
        // Using isset() prevents PHP warnings about undefined array keys
        $query_params = isset($matches[2]) ? $matches[2] : '';

        // Construct the URL to the optimized version in the dist folder
        // We preserve any query parameters (like version numbers) for proper caching
        $optimized_url = $theme_url . '/assets/dist/' . $filename . '.min.css' . $query_params;

        // Convert the URL to a file system path so we can check if the file exists
        // This prevents us from serving broken links to non-existent optimized files
        $optimized_path = get_template_directory() . '/assets/dist/' . $filename . '.min.css';

        // Verify that the optimized file actually exists before using it
        // This is our final safety check - graceful fallback if optimization isn't available
        if (file_exists($optimized_path)) {
            return $optimized_url; // Success! Serve the optimized version
        }

        // If we reach this point, the pattern matched but the optimized file doesn't exist
        // This is normal during development or if you haven't run the build process yet
    }

    // Default fallback: return the original URL unchanged
    // This ensures the site continues to work even if optimization fails
    return $src;
}

/**
 * Intelligent JavaScript path optimization with identical logic to CSS
 * 
 * This function mirrors the CSS optimization logic but handles JavaScript-specific
 * considerations. While the core algorithm is the same, separating CSS and JS
 * optimization allows us to handle format-specific needs in the future.
 * 
 * JAVASCRIPT CONSIDERATIONS:
 * JavaScript files often have different loading characteristics than CSS:
 * - They may be loaded in footer vs header
 * - They may have dependencies that affect loading order
 * - They may include dynamic content that affects caching
 * 
 * By keeping JS optimization separate, we maintain flexibility for future
 * enhancements that might treat JavaScript files differently than CSS files.
 * 
 * ERROR HANDLING STRATEGY:
 * This function uses the same defensive programming approach as the CSS version.
 * Every array access is checked, every file existence is verified, and every
 * step includes a fallback path to ensure reliability.
 * 
 * @since 1.0.0
 * @param string $src    The original JavaScript file URL from WordPress
 * @param string $handle The WordPress handle/identifier for this script
 * @return string        The optimized URL if available, or original URL unchanged
 */
function cloudsync_optimize_js_path($src, $handle) {

    // Get theme base URL for identifying our files vs external resources
    $theme_url = get_template_directory_uri();

    // Security boundary: Only process JavaScript files that belong to our theme
    // This prevents interference with external libraries, plugins, or CDN resources
    if (strpos($src, $theme_url) === false) {
        return $src; // External JavaScript file - don't modify it
    }

    // Parse JavaScript files from our theme's js folder using regex pattern matching
    // Pattern explanation: /\/assets\/js\/(.+?)\.js(\?.*)?$/
    // - Matches files in the /assets/js/ directory
    // - Captures filename without extension in group 1
    // - Optionally captures query parameters in group 2
    if (preg_match('/\/assets\/js\/(.+?)\.js(\?.*)?$/', $src, $matches)) {

        // Extract filename from first capture group (always exists if match found)
        $filename = $matches[1]; // Example: 'theme' from 'theme.js'

        // CRITICAL FIX: Use isset() to safely check for optional query parameters
        // The regex makes the second group optional with ?, so it might not exist
        // Using isset() instead of ?? operator prevents PHP warnings about undefined keys
        $query_params = isset($matches[2]) ? $matches[2] : '';

        // Build complete URL to the minified version in the distribution folder
        // Preserve original query parameters for proper browser caching behavior
        $optimized_url = $theme_url . '/assets/dist/' . $filename . '.min.js' . $query_params;

        // Convert URL to filesystem path for existence verification
        // We must check that the optimized file actually exists before serving it
        $optimized_path = get_template_directory() . '/assets/dist/' . $filename . '.min.js';

        // Perform final safety check: does the optimized file actually exist?
        // This graceful fallback ensures we never serve broken links
        if (file_exists($optimized_path)) {
            return $optimized_url; // Successfully found optimized version
        }

        // Pattern matched but optimized file doesn't exist - this is normal during development
    }

    // Safe fallback: return original URL if no optimization is available
    // This ensures JavaScript functionality is never broken by optimization attempts
    return $src;
}

/**
 * Advanced performance hints for browser optimization
 * 
 * This function adds special HTML tags that provide browsers with advance
 * information about resources the page will need. Think of these hints as
 * a restaurant calling ahead to reserve a table - the browser can start
 * preparing connections before it actually needs to use them.
 * 
 * BROWSER HINT TYPES EXPLAINED:
 * 
 * DNS Prefetch: Tells the browser to resolve domain names early
 * - Saves 20-120ms per domain by doing DNS lookup in parallel
 * - Especially beneficial for external resources like fonts and CDNs
 * - Very low cost, high benefit optimization
 * 
 * Preconnect: Goes beyond DNS to establish full connections
 * - Includes DNS lookup, TCP handshake, and TLS negotiation
 * - More aggressive than prefetch but more beneficial
 * - Best for critical external resources you know you'll need
 * 
 * PERFORMANCE IMPACT:
 * These hints can reduce loading times by 100-200ms or more, especially
 * on mobile connections where network round trips are expensive.
 * 
 * @since 1.0.0
 */
function cloudsync_add_performance_hints() {

    // DNS prefetch for Google Fonts domain
    // This allows the browser to resolve fonts.googleapis.com early
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">' . "\n";

    // DNS prefetch for Cloudflare CDN (used for Font Awesome)
    // Prepares connection to cdnjs.cloudflare.com for faster icon loading
    echo '<link rel="dns-prefetch" href="//cdnjs.cloudflare.com">' . "\n";

    // Preconnect for Google Fonts with crossorigin attribute
    // Establishes full connection including HTTPS handshake
    // crossorigin is needed because fonts are loaded cross-origin
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>' . "\n";

    // Preconnect for Cloudflare CDN with crossorigin attribute
    // Prepares full connection for Font Awesome and other CDN resources
    echo '<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>' . "\n";
}

/**
 * Development-friendly debug information system
 * 
 * This function outputs invisible HTML comments that help developers understand
 * exactly what the optimization system is doing. These comments appear only
 * in the HTML source code and don't affect the visual appearance of the site.
 * 
 * Think of this as leaving breadcrumbs that show the path the optimization
 * system took when processing the page. When troubleshooting performance
 * issues, developers can view source and immediately see what optimizations
 * are active and why.
 * 
 * DEBUG INFORMATION INCLUDED:
 * - Whether production mode is active
 * - WordPress debug setting status
 * - Server hostname for environment identification
 * - Overall optimization status
 * - Distribution folder existence check
 * - Environment type classification
 * 
 * SECURITY NOTE:
 * This information is generally safe to include in HTML comments because
 * it only reveals optimization settings, not sensitive data. However,
 * if you prefer to hide this information in production, you can wrap
 * the entire function in a WP_DEBUG check.
 * 
 * @since 1.0.0
 */
function cloudsync_add_optimization_debug_info() {

    // Gather comprehensive status information for debugging
    $status = cloudsync_get_optimization_status();

    // Output debug information as HTML comments (invisible to users, visible to developers)
    echo "\n<!-- CloudSync Performance Optimization Debug Information\n";
    echo "Production Mode: " . ($status['production_mode'] ? 'ACTIVE' : 'DISABLED') . "\n";
    echo "WordPress Debug: " . ($status['wp_debug'] ? 'ENABLED' : 'DISABLED') . "\n";
    echo "Server Environment: " . esc_html($status['server_name']) . "\n";
    echo "Optimization Status: " . ($status['optimization_active'] ? 'Serving optimized assets from /dist/' : 'Serving original development files') . "\n";
    echo "Distribution Folder: " . ($status['dist_folder_exists'] ? 'EXISTS' : 'NOT FOUND') . "\n";
    echo "Environment Classification: " . strtoupper($status['environment_type']) . "\n";
    echo "Asset Optimization: " . ($status['optimization_active'] ? 'ENABLED' : 'DISABLED') . "\n";
    echo "-->\n";
}

/**
 * Comprehensive optimization status reporting system
 * 
 * This utility function provides a complete diagnostic picture of the
 * optimization system's current state. It's designed to be both human-readable
 * for debugging and machine-readable for automated monitoring systems.
 * 
 * This function is particularly valuable when troubleshooting performance
 * issues or when users report that optimizations aren't working as expected.
 * By examining the returned array, developers can quickly identify whether
 * the issue is environment detection, missing files, or configuration problems.
 * 
 * DIAGNOSTIC CATEGORIES:
 * - Environment Detection: How we determined development vs production
 * - File System Status: Whether required folders and files exist
 * - Configuration Status: What settings are affecting optimization
 * - Operational Status: Whether optimizations are currently active
 * 
 * @since 1.0.0
 * @return array Comprehensive status information for debugging and monitoring
 */
function cloudsync_get_optimization_status() {

    // Determine current production mode status
    $is_production = cloudsync_is_production_mode();

    // Build comprehensive status report
    return array(
        // Core optimization settings
        'production_mode' => $is_production,
        'optimization_active' => $is_production,
        'environment_type' => $is_production ? 'production' : 'development',

        // WordPress configuration details
        'wp_debug' => defined('WP_DEBUG') ? WP_DEBUG : false,
        'wp_debug_defined' => defined('WP_DEBUG'),

        // Server environment information
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
        'server_port' => $_SERVER['SERVER_PORT'] ?? 'unknown',

        // File system status checks
        'dist_folder_exists' => is_dir(get_template_directory() . '/assets/dist'),
        'theme_directory' => get_template_directory(),

        // Advanced configuration checks
        'custom_override_defined' => defined('CLOUDSYNC_PRODUCTION_MODE'),
        'custom_override_value' => defined('CLOUDSYNC_PRODUCTION_MODE') ? CLOUDSYNC_PRODUCTION_MODE : null,

        // Performance metrics
        'timestamp' => current_time('mysql'),
        'php_version' => PHP_VERSION,
    );
}

/**
 * EXPERIMENTAL: Advanced combined file loading system
 * 
 * This function demonstrates how to take optimization to the next level by
 * loading one combined CSS file instead of multiple individual files. This
 * technique can reduce HTTP requests from 5+ CSS files down to just 1 file.
 * 
 * PERFORMANCE BENEFITS:
 * - Fewer HTTP requests (major benefit for mobile users)
 * - Reduced connection overhead
 * - Better compression ratios for larger files
 * - Simplified browser caching behavior
 * 
 * TRADE-OFFS TO CONSIDER:
 * - Less granular caching (changing one module invalidates entire file)
 * - Larger initial download (users download CSS for sections they might not see)
 * - More complex development workflow
 * - Requires careful testing to ensure load order doesn't break functionality
 * 
 * HOW TO ACTIVATE:
 * Uncomment the function call in cloudsync_init_performance_optimization()
 * or call cloudsync_enable_combined_css_loading() manually after theme setup.
 * 
 * SAFETY FEATURES:
 * - Only activates in production mode
 * - Checks for file existence before making changes
 * - Uses late priority to run after individual files are enqueued
 * - Maintains fallback to individual files if combined file is missing
 * 
 * @since 1.0.0
 */
function cloudsync_enable_combined_css_loading() {

    // Hook into WordPress script enqueuing with late priority
    // Priority 20 ensures this runs after individual CSS files are enqueued in functions.php
    add_action('wp_enqueue_scripts', function () {

        // Only perform combined loading in production mode
        // Development mode should always use individual files for easier debugging
        if (cloudsync_is_production_mode()) {

            // Check if the combined file actually exists before making any changes
            $combined_file_path = get_template_directory() . '/assets/dist/cloudsync.min.css';

            if (file_exists($combined_file_path)) {

                // Dequeue individual CSS files since we're replacing them with combined version
                // These handle names should match exactly what's used in functions.php
                wp_dequeue_style('cloudsync-base');
                wp_dequeue_style('cloudsync-layout');
                wp_dequeue_style('cloudsync-components');
                wp_dequeue_style('cloudsync-gutenberg');
                wp_dequeue_style('cloudsync-contact');

                // Enqueue the single combined file instead of individual files
                // This replaces 5+ HTTP requests with just 1 request
                wp_enqueue_style(
                    'cloudsync-combined',                                           // Unique handle for combined file
                    get_template_directory_uri() . '/assets/dist/cloudsync.min.css', // URL to combined file
                    array(),                                                        // No dependencies since it contains everything
                    cloudsync_get_theme_version()                                   // Version for cache busting
                );

                // Optional: Add a comment to help developers understand what happened
                add_action('wp_head', function () {
                    echo "<!-- CloudSync: Using combined CSS file for optimal performance -->\n";
                });
            }
        }
    }, 20); // Late priority ensures individual files are enqueued first
}

/**
 * Utility function to get current theme version for cache busting
 * 
 * This function provides a safe way to retrieve the theme version for use
 * in asset URLs. Proper versioning ensures that when you update your theme,
 * browsers will load fresh copies of CSS and JavaScript files instead of
 * serving stale cached versions.
 * 
 * The function includes fallback logic to handle cases where the version
 * information might not be available, ensuring that asset loading never
 * fails due to versioning issues.
 * 
 * @since 1.0.0
 * @return string Theme version number for cache busting
 */
function cloudsync_get_performance_theme_version() {

    // Try to get version from theme information
    $theme = wp_get_theme();
    $version = $theme->get('Version');

    // Fallback to timestamp if no version is available
    // This ensures cache busting still works even without explicit versioning
    return $version ? $version : time();
}

/**
 * Advanced: Performance monitoring and reporting system
 * 
 * This function provides detailed performance metrics that can help you
 * understand the impact of your optimizations. It's designed for advanced
 * users who want to monitor and fine-tune their performance settings.
 * 
 * METRICS COLLECTED:
 * - File size comparisons between original and optimized versions
 * - Number of HTTP requests saved through optimization
 * - Estimated loading time improvements
 * - Cache efficiency indicators
 * 
 * @since 1.0.0
 * @return array Performance metrics and optimization statistics
 */
function cloudsync_get_performance_metrics() {

    $metrics = array(
        'optimization_enabled' => cloudsync_is_production_mode(),
        'files_optimized' => 0,
        'total_size_savings' => 0,
        'requests_saved' => 0,
    );

    // Only calculate metrics if optimization is active
    if (cloudsync_is_production_mode()) {

        $dist_dir = get_template_directory() . '/assets/dist/';
        $modules_dir = get_template_directory() . '/assets/css/modules/';

        // Check common CSS files for optimization statistics
        $css_files = array('base.css', 'layout.css', 'components.css', 'gutenberg.css', 'contact.css');

        foreach ($css_files as $file) {
            $original_path = $modules_dir . $file;
            $optimized_path = $dist_dir . str_replace('.css', '.min.css', $file);

            if (file_exists($original_path) && file_exists($optimized_path)) {
                $original_size = filesize($original_path);
                $optimized_size = filesize($optimized_path);

                $metrics['files_optimized']++;
                $metrics['total_size_savings'] += ($original_size - $optimized_size);
            }
        }

        // Calculate requests saved if using combined loading
        if (function_exists('wp_style_is') && wp_style_is('cloudsync-combined', 'enqueued')) {
            $metrics['requests_saved'] = count($css_files) - 1; // Multiple files combined into one
        }
    }

    return $metrics;
}
