<?php

/**
 * Template for displaying single pages with intelligent content adaptation
 * 
 * This template automatically adapts its presentation based on page content,
 * type, and characteristics. It provides optimal user experience for different
 * types of SaaS company pages without requiring manual configuration.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header();

// Analyze page context for intelligent styling
$page_context = cloudsync_analyze_page_context();
?>

<main class="site-main <?php echo esc_attr($page_context); ?>">

    <?php while (have_posts()) : the_post(); ?>

        <!-- Adaptive Page Hero Section -->
        <section class="page-hero">
            <div class="container">
                <div class="page-hero-content">

                    <!-- Breadcrumbs Navigation -->
                    <nav class="breadcrumbs" aria-label="<?php esc_attr_e('Breadcrumb Navigation', 'cloudsync'); ?>">
                        <ol class="breadcrumb-list">
                            <li class="breadcrumb-item">
                                <a href="<?php echo esc_url(home_url('/')); ?>">
                                    <i class="fas fa-home" aria-hidden="true"></i>
                                    <?php esc_html_e('Home', 'cloudsync'); ?>
                                </a>
                            </li>
                            <li class="breadcrumb-item breadcrumb-separator" aria-hidden="true">
                                <i class="fas fa-chevron-right"></i>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                <?php the_title(); ?>
                            </li>
                        </ol>
                    </nav>

                    <!-- Adaptive Page Header -->
                    <header class="page-header">
                        <h1 class="page-title"><?php the_title(); ?></h1>

                        <?php if (get_the_excerpt()) : ?>
                            <div class="page-subtitle">
                                <?php the_excerpt(); ?>
                            </div>
                        <?php endif; ?>

                        <!-- Context-sensitive meta information -->
                        <?php if (strpos($page_context, 'page-type-legal') !== false) : ?>
                            <div class="legal-meta">
                                <p class="last-updated">
                                    <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                                    <?php printf(__('Last updated: %s', 'cloudsync'), get_the_modified_date()); ?>
                                </p>
                            </div>
                        <?php endif; ?>
                    </header>

                </div>
            </div>
        </section>

        <!-- Featured Image (context-dependent display) -->
        <?php if (has_post_thumbnail()) : ?>
            <section class="page-featured-image">
                <div class="container">
                    <div class="featured-image-wrapper">
                        <?php the_post_thumbnail('large', array(
                            'class' => 'page-thumbnail',
                            'alt'   => get_the_title()
                        )); ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- Main Content Section with Adaptive Components -->
        <section class="page-content-section">
            <div class="container">
                <div class="page-content-wrapper">

                    <!-- Table of Contents for long content -->


                    <!-- Main Content -->
                    <article class="page-content" id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                        <div class="entry-content">
                            <?php
                            the_content();

                            // Handle pagination for pages with <!--nextpage--> tags
                            wp_link_pages(array(
                                'before'      => '<div class="page-pagination"><span class="page-links-title">' . __('Pages:', 'cloudsync') . '</span>',
                                'after'       => '</div>',
                                'link_before' => '<span class="page-number">',
                                'link_after'  => '</span>',
                                'pagelink'    => '<span class="screen-reader-text">' . __('Page', 'cloudsync') . ' </span>%',
                                'separator'   => '<span class="screen-reader-text">, </span>',
                            ));
                            ?>
                        </div>

                        <!-- Context-sensitive footer elements -->
                        <footer class="entry-footer">

                            <!-- Contact CTA for product pages -->
                            <?php if (strpos($page_context, 'page-type-product') !== false) : ?>
                                <div class="product-cta">
                                    <h3><?php esc_html_e('Ready to get started?', 'cloudsync'); ?></h3>
                                    <p><?php esc_html_e('Contact our team to learn more about this solution.', 'cloudsync'); ?></p>
                                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>" class="cta-btn">
                                        <?php esc_html_e('Get in Touch', 'cloudsync'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <!-- Last modified for legal pages -->
                            <?php if (strpos($page_context, 'page-type-legal') !== false) : ?>
                                <div class="legal-footer">
                                    <p class="modification-date">
                                        <?php printf(__('This document was last modified on %s', 'cloudsync'), get_the_modified_date('F j, Y')); ?>
                                    </p>
                                </div>
                            <?php endif; ?>

                            <!-- Edit link for logged in users -->
                            <?php if (get_edit_post_link()) : ?>
                                <div class="edit-link">
                                    <?php
                                    edit_post_link(
                                        sprintf(
                                            wp_kses(
                                                __('Edit <span class="screen-reader-text">%s</span>', 'cloudsync'),
                                                array('span' => array('class' => array()))
                                            ),
                                            get_the_title()
                                        ),
                                        '<div class="edit-post-link">',
                                        '</div>'
                                    );
                                    ?>
                                </div>
                            <?php endif; ?>

                        </footer>

                    </article>

                </div>
            </div>
        </section>

        <!-- Reading Progress Bar for long content -->
        <?php if (strpos($page_context, 'long-content') !== false) : ?>
            <div class="reading-progress">
                <div class="progress-bar" id="reading-progress-bar"></div>
            </div>
        <?php endif; ?>

        <!-- Comments Section (if enabled for pages) -->
        <?php if (comments_open() || get_comments_number()) : ?>
            <section class="page-comments-section">
                <div class="container">
                    <div class="comments-wrapper">
                        <?php comments_template(); ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
