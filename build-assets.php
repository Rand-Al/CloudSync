<?php
/**
 * CloudSync Asset Build Script
 * 
 * Minifies and combines CSS/JS files for production
 * Run via: php build-assets.php
 * 
 * @package CloudSync
 */

// Security check
if (php_sapi_name() !== 'cli') {
    die('This script can only be run from command line');
}

echo "CloudSync Asset Build Script\n";
echo "============================\n";

$theme_dir = __DIR__;
$css_modules_dir = $theme_dir . '/assets/css/modules';
$output_dir = $theme_dir . '/assets/dist';

// Create dist directory if it doesn't exist
if (!is_dir($output_dir)) {
    mkdir($output_dir, 0755, true);
    echo "Created dist directory\n";
}

/**
 * Minify CSS
 */
function minify_css($css) {
    // Remove comments
    $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
    
    // Remove whitespace
    $css = str_replace(["\r\n", "\r", "\n", "\t"], '', $css);
    $css = preg_replace('/\s+/', ' ', $css);
    $css = preg_replace('/\s*([{}|:;,>+~])\s*/', '$1', $css);
    
    // Remove trailing semicolon before closing brace
    $css = str_replace(';}', '}', $css);
    
    return trim($css);
}

/**
 * Minify JavaScript
 */
function minify_js($js) {
    // Basic JS minification (remove comments and excess whitespace)
    $js = preg_replace('/\/\*[\s\S]*?\*\//', '', $js); // Remove /* */ comments
    $js = preg_replace('/\/\/.*$/m', '', $js); // Remove // comments
    $js = preg_replace('/\s+/', ' ', $js); // Collapse whitespace
    $js = str_replace(['; ', ' ;'], ';', $js);
    $js = str_replace([', ', ' ,'], ',', $js);
    
    return trim($js);
}

// Build CSS files
echo "\nBuilding CSS files...\n";

$css_files = [
    'base.css',
    'layout.css',
    'components.css',
    'gutenberg.css',
    'contact.css'
];

$combined_css = '';
$file_count = 0;

foreach ($css_files as $file) {
    $file_path = $css_modules_dir . '/' . $file;
    if (file_exists($file_path)) {
        $css_content = file_get_contents($file_path);
        $minified_css = minify_css($css_content);
        
        // Save individual minified file
        $min_file = $output_dir . '/' . str_replace('.css', '.min.css', $file);
        file_put_contents($min_file, $minified_css);
        
        // Add to combined
        $combined_css .= "/* {$file} */\n" . $minified_css . "\n";
        
        $original_size = strlen($css_content);
        $minified_size = strlen($minified_css);
        $savings = round((($original_size - $minified_size) / $original_size) * 100, 1);
        
        echo "- {$file}: {$original_size}B → {$minified_size}B ({$savings}% smaller)\n";
        $file_count++;
    } else {
        echo "- {$file}: File not found\n";
    }
}

// Save combined CSS
$combined_file = $output_dir . '/cloudsync.min.css';
file_put_contents($combined_file, $combined_css);
echo "- Combined: cloudsync.min.css (" . strlen($combined_css) . "B)\n";

// Build Critical CSS
echo "\nBuilding Critical CSS...\n";
$critical_file = $theme_dir . '/assets/css/critical.css';
if (file_exists($critical_file)) {
    $critical_content = file_get_contents($critical_file);
    $minified_critical = minify_css($critical_content);
    
    $critical_output = $output_dir . '/critical.min.css';
    file_put_contents($critical_output, $minified_critical);
    
    $original_size = strlen($critical_content);
    $minified_size = strlen($minified_critical);
    $savings = round((($original_size - $minified_size) / $original_size) * 100, 1);
    
    echo "- critical.css: {$original_size}B → {$minified_size}B ({$savings}% smaller)\n";
} else {
    echo "- critical.css: File not found\n";
}

// Build JavaScript
echo "\nBuilding JavaScript files...\n";
$js_file = $theme_dir . '/assets/js/theme.js';
if (file_exists($js_file)) {
    $js_content = file_get_contents($js_file);
    $minified_js = minify_js($js_content);
    
    $js_output = $output_dir . '/theme.min.js';
    file_put_contents($js_output, $minified_js);
    
    $original_size = strlen($js_content);
    $minified_size = strlen($minified_js);
    $savings = round((($original_size - $minified_size) / $original_size) * 100, 1);
    
    echo "- theme.js: {$original_size}B → {$minified_size}B ({$savings}% smaller)\n";
} else {
    echo "- theme.js: File not found\n";
}

// Generate performance report
echo "\nPerformance Report\n";
echo "------------------\n";
echo "CSS modules processed: {$file_count}\n";
echo "Output directory: " . basename($output_dir) . "/\n";
echo "Files generated:\n";

$generated_files = glob($output_dir . '/*');
foreach ($generated_files as $file) {
    $size = filesize($file);
    $size_kb = round($size / 1024, 1);
    echo "- " . basename($file) . " ({$size_kb}KB)\n";
}

// Calculate total savings
$total_original = 0;
$total_minified = 0;

// Get original file sizes
foreach ($css_files as $file) {
    $file_path = $css_modules_dir . '/' . $file;
    if (file_exists($file_path)) {
        $total_original += filesize($file_path);
    }
}

if (file_exists($critical_file)) {
    $total_original += filesize($critical_file);
}

if (file_exists($js_file)) {
    $total_original += filesize($js_file);
}

// Get minified file sizes
$minified_files = glob($output_dir . '/*.min.*');
foreach ($minified_files as $file) {
    $total_minified += filesize($file);
}

if ($total_original > 0) {
    $total_savings = round((($total_original - $total_minified) / $total_original) * 100, 1);
    echo "\nTotal size reduction: " . round($total_original/1024, 1) . "KB → " . 
         round($total_minified/1024, 1) . "KB ({$total_savings}% smaller)\n";
}

echo "\n✅ Build completed successfully!\n";
echo "\nNext steps:\n";
echo "1. Update functions.php to use minified files in production\n";
echo "2. Configure server to serve compressed files\n";
echo "3. Test performance improvements\n";
?>