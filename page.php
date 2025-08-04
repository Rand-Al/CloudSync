<?php

/**
 * Template for displaying single pages
 * 
 * This template is used for all individual pages that are not the homepage.
 * It provides a clean, professional layout for content pages like About,
 * Contact, Privacy Policy, Terms of Service, etc.
 * 
 * Unlike the homepage (index.php), this template focuses on readability
 * and content presentation rather than conversion elements.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header(); ?>

<main class="site-main">

    <?php while (have_posts()) : the_post(); ?>

        <!-- Page Hero Section - Compact header for internal pages -->
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

                    <!-- Page Title -->
                    <header class="page-header">
                        <h1 class="page-title"><?php the_title(); ?></h1>

                        <?php if (get_the_excerpt()) : ?>
                            <div class="page-subtitle">
                                <?php the_excerpt(); ?>
                            </div>
                        <?php endif; ?>
                    </header>

                </div>
            </div>
        </section>

        <!-- Main Content Section -->
        <section class="page-content-section">
            <div class="container">
                <div class="page-content-wrapper">

                    <!-- Featured Image (if set) -->
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="page-featured-image">
                            <?php the_post_thumbnail('large', array(
                                'class' => 'page-thumbnail',
                                'alt'   => get_the_title()
                            )); ?>
                        </div>
                    <?php endif; ?>

                    <!-- Page Content -->
                    <article class="page-content" id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                        <div class="entry-content">
                            <?php
                            // Output the main page content
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

                        <!-- Page Meta Information -->
                        <?php if (get_edit_post_link()) : ?>
                            <div class="entry-footer">
                                <?php
                                edit_post_link(
                                    sprintf(
                                        wp_kses(
                                            __('Edit <span class="screen-reader-text">%s</span>', 'cloudsync'),
                                            array(
                                                'span' => array(
                                                    'class' => array(),
                                                ),
                                            )
                                        ),
                                        get_the_title()
                                    ),
                                    '<div class="edit-link">',
                                    '</div>'
                                );
                                ?>
                            </div>
                        <?php endif; ?>

                    </article>

                </div>
            </div>
        </section>

        <!-- Comments Section (if enabled for pages) -->
        <?php
        // Only show comments if they are enabled for this page
        if (comments_open() || get_comments_number()) :
        ?>
            <section class="page-comments-section">
                <div class="container">
                    <div class="comments-wrapper">
                        <?php comments_template(); ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

    <?php endwhile; // End of the loop 
    ?>

</main>

<?php get_footer(); ?>
