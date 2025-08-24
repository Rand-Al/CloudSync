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

<?php
get_footer();
