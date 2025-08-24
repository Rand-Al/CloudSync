<?php

/**
 * The template for displaying 404 pages (not found)
 * 
 * Modern 404 error page with helpful navigation and search functionality.
 * Designed to keep users engaged and guide them back to relevant content
 * while maintaining the professional SaaS theme aesthetic.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header();
?>

<main class="error-404-page">
    <div class="container">
        <div class="error-404-content">

            <!-- Error Visual Section -->
            <div class="error-visual">
                <div class="error-number">
                    <span class="number-4">4</span>
                    <div class="number-0-container">
                        <div class="floating-icon">
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </div>
                    </div>
                    <span class="number-4">4</span>
                </div>

                <div class="error-animation">
                    <div class="floating-card error-card-1">
                        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    </div>
                    <div class="floating-card error-card-2">
                        <i class="fas fa-compass" aria-hidden="true"></i>
                    </div>
                    <div class="floating-card error-card-3">
                        <i class="fas fa-home" aria-hidden="true"></i>
                    </div>
                </div>
            </div>

            <!-- Error Message Section -->
            <div class="error-message">
                <h1 class="error-title">
                    <?php _e('Page Not Found', 'cloudsync'); ?>
                </h1>
                <p class="error-description">
                    <?php _e('Oops! The page you\'re looking for seems to have wandered off into the digital void. Don\'t worry, even the best explorers sometimes take a wrong turn.', 'cloudsync'); ?>
                </p>

                <!-- Helpful Suggestions -->
                <div class="error-suggestions">
                    <h3><?php _e('Here\'s what you can try:', 'cloudsync'); ?></h3>
                    <ul class="suggestions-list">
                        <li>
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <?php _e('Check the URL for any typos', 'cloudsync'); ?>
                        </li>
                        <li>
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <?php _e('Use the search box below to find what you need', 'cloudsync'); ?>
                        </li>
                        <li>
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <?php _e('Browse our main navigation menu', 'cloudsync'); ?>
                        </li>
                        <li>
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <?php _e('Return to our homepage and start fresh', 'cloudsync'); ?>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Search Section -->
            <div class="error-search-section">
                <h3><?php _e('Search Our Site', 'cloudsync'); ?></h3>
                <form role="search" method="get" class="error-search-form" action="<?php echo esc_url(home_url('/')); ?>">
                    <div class="search-input-group">
                        <input type="search"
                            class="search-field"
                            placeholder="<?php echo esc_attr_x('Search...', 'placeholder', 'cloudsync'); ?>"
                            value="<?php echo get_search_query(); ?>"
                            name="s"
                            title="<?php echo esc_attr_x('Search for:', 'label', 'cloudsync'); ?>"
                            aria-label="<?php echo esc_attr_x('Search for content', 'label', 'cloudsync'); ?>">
                        <button type="submit" class="search-submit">
                            <i class="fas fa-search" aria-hidden="true"></i>
                            <span class="sr-only"><?php _e('Search', 'cloudsync'); ?></span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Navigation Shortcuts -->
            <div class="error-navigation">
                <h3><?php _e('Popular Destinations', 'cloudsync'); ?></h3>
                <div class="nav-shortcuts">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="nav-shortcut">
                        <i class="fas fa-home" aria-hidden="true"></i>
                        <span><?php _e('Homepage', 'cloudsync'); ?></span>
                    </a>

                    <?php if (has_nav_menu('primary')) : ?>
                        <?php
                        $menu_items = wp_get_nav_menu_items(get_nav_menu_locations()['primary']);
                        if ($menu_items && count($menu_items) > 0) :
                            // Show first 3 menu items
                            $displayed = 0;
                            foreach ($menu_items as $menu_item) :
                                if ($displayed >= 3) break;
                                if ($menu_item->menu_item_parent == 0) : // Only top-level items
                        ?>
                                    <a href="<?php echo esc_url($menu_item->url); ?>" class="nav-shortcut">
                                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                                        <span><?php echo esc_html($menu_item->title); ?></span>
                                    </a>
                        <?php
                                    $displayed++;
                                endif;
                            endforeach;
                        endif;
                        ?>
                    <?php endif; ?>

                    <!-- Blog link if posts exist -->
                    <?php if (get_option('show_on_front') == 'page' && get_option('page_for_posts')) : ?>
                        <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>" class="nav-shortcut">
                            <i class="fas fa-blog" aria-hidden="true"></i>
                            <span><?php _e('Blog', 'cloudsync'); ?></span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="error-cta">
                <h3><?php _e('Ready to Get Started?', 'cloudsync'); ?></h3>
                <p><?php _e('Don\'t let a wrong turn stop your journey. Explore our platform and discover what we can do for you.', 'cloudsync'); ?></p>
                <div class="error-buttons">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="cta-btn">
                        <i class="fas fa-home" aria-hidden="true"></i>
                        <?php _e('Back to Homepage', 'cloudsync'); ?>
                    </a>

                    <?php
                    // Try to get CTA button URL from customizer
                    $cta_url = cloudsync_get_customizer_value('cloudsync_hero_primary_btn_url', '#contact');
                    $cta_text = cloudsync_get_customizer_value('cloudsync_hero_primary_btn_text', __('Get Started', 'cloudsync'));
                    ?>
                    <a href="<?php echo esc_url($cta_url); ?>" class="btn-secondary">
                        <i class="fas fa-rocket" aria-hidden="true"></i>
                        <?php echo esc_html($cta_text); ?>
                    </a>
                </div>
            </div>

            <!-- Help Section -->
            <div class="error-help">
                <div class="help-card">
                    <i class="fas fa-life-ring" aria-hidden="true"></i>
                    <h4><?php _e('Need Help?', 'cloudsync'); ?></h4>
                    <p><?php _e('Our support team is here to assist you. Get in touch and we\'ll help you find exactly what you\'re looking for.', 'cloudsync'); ?></p>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="help-link">
                        <?php _e('Contact Support', 'cloudsync'); ?>
                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </div>
            </div>

        </div>
    </div>
</main>

<!-- Add 404-specific styles -->
<style>
    /* 404 Page Specific Styles */
    .error-404-page {
        min-height: calc(100vh - 160px);
        padding: 4rem 0;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        position: relative;
        overflow: hidden;
    }

    .error-404-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23667eea" stroke-width="0.3" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        opacity: 0.3;
        pointer-events: none;
    }

    .error-404-content {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 2;
    }

    /* Error Visual */
    .error-visual {
        margin-bottom: 3rem;
        position: relative;
    }

    .error-number {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: clamp(4rem, 15vw, 8rem);
        font-weight: 900;
        color: #667eea;
        margin-bottom: 2rem;
        line-height: 1;
    }

    .number-0-container {
        position: relative;
        width: 1em;
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.1em solid #667eea;
        border-radius: 50%;
        background: rgba(102, 126, 234, 0.1);
    }

    .floating-icon {
        font-size: 0.4em;
        color: #667eea;
        animation: float 3s ease-in-out infinite;
    }

    .error-animation {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }

    .error-card-1,
    .error-card-2,
    .error-card-3 {
        position: absolute;
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #667eea;
        font-size: 1.5rem;
        border: 1px solid rgba(102, 126, 234, 0.2);
        backdrop-filter: blur(10px);
    }

    .error-card-1 {
        top: 20%;
        left: 10%;
        animation: float 3s ease-in-out infinite;
    }

    .error-card-2 {
        top: 30%;
        right: 15%;
        animation: float 3s ease-in-out infinite 1s;
    }

    .error-card-3 {
        bottom: 20%;
        left: 20%;
        animation: float 3s ease-in-out infinite 2s;
    }

    /* Error Message */
    .error-message {
        margin-bottom: 3rem;
    }

    .error-title {
        font-size: clamp(2rem, 5vw, 3rem);
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #ffffff 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .error-description {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    /* Suggestions */
    .error-suggestions {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 3rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .error-suggestions h3 {
        margin-bottom: 1.5rem;
        color: #ffffff;
    }

    .suggestions-list {
        list-style: none;
        text-align: left;
        max-width: 500px;
        margin: 0 auto;
    }

    .suggestions-list li {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        color: rgba(255, 255, 255, 0.8);
    }

    .suggestions-list i {
        color: #667eea;
        flex-shrink: 0;
    }

    /* Search Section */
    .error-search-section {
        margin-bottom: 3rem;
    }

    .error-search-section h3 {
        margin-bottom: 1.5rem;
        color: #ffffff;
    }

    .error-search-form {
        max-width: 400px;
        margin: 0 auto;
    }

    .search-input-group {
        display: flex;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50px;
        padding: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }

    .search-input-group:focus-within {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .search-field {
        flex: 1;
        background: none;
        border: none;
        color: #ffffff;
        padding: 1rem 1.5rem;
        font-size: 1rem;
        outline: none;
    }

    .search-field::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .search-submit {
        background: linear-gradient(45deg, #667eea, #764ba2);
        border: none;
        border-radius: 50px;
        padding: 1rem 1.5rem;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 60px;
    }

    .search-submit:hover {
        background: linear-gradient(45deg, #5a67d8, #6b46c1);
        transform: translateY(-2px);
    }

    /* Navigation Shortcuts */
    .error-navigation {
        margin-bottom: 3rem;
    }

    .error-navigation h3 {
        margin-bottom: 1.5rem;
        color: #ffffff;
    }

    .nav-shortcuts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .nav-shortcut {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s ease;
    }

    .nav-shortcut:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
        color: #ffffff;
        text-decoration: none;
        transform: translateY(-2px);
    }

    .nav-shortcut i {
        color: #667eea;
        flex-shrink: 0;
    }

    /* CTA Section */
    .error-cta {
        margin-bottom: 3rem;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 20px;
        padding: 3rem 2rem;
        border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .error-cta h3 {
        margin-bottom: 1rem;
        color: #ffffff;
    }

    .error-cta p {
        margin-bottom: 2rem;
        color: rgba(255, 255, 255, 0.8);
    }

    .error-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .error-buttons .cta-btn,
    .error-buttons .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    /* Help Section */
    .error-help {
        margin-top: 3rem;
    }

    .help-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .help-card i {
        font-size: 2rem;
        color: #667eea;
        margin-bottom: 1rem;
    }

    .help-card h4 {
        margin-bottom: 1rem;
        color: #ffffff;
    }

    .help-card p {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1.5rem;
    }

    .help-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s ease;
    }

    .help-link:hover {
        color: #764ba2;
        text-decoration: none;
    }

    /* Animations */
    @keyframes float {

        0%,
        100% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-10px);
        }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .error-404-page {
            padding: 2rem 0;
        }

        .error-number {
            gap: 0.5rem;
        }

        .error-buttons {
            flex-direction: column;
            align-items: center;
        }

        .error-buttons .cta-btn,
        .error-buttons .btn-secondary {
            width: 100%;
            max-width: 280px;
            justify-content: center;
        }

        .nav-shortcuts {
            grid-template-columns: 1fr;
        }

        .error-animation {
            display: none;
            /* Hide floating cards on mobile for cleaner look */
        }
    }
</style>

<?php
get_footer();
