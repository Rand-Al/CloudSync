<?php

/**
 * The main template file
 * 
 * This is the most generic template file in a WordPress theme and acts
 * as a fallback for all other template files. It can display posts,
 * pages, or any other content when no more specific template is available.
 * 
 * For the CloudSync theme, this serves as a fallback while the main
 * landing page functionality is handled by front-page.php
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header(); ?>

<main class="site-main">

    <!-- Content Header -->
    <section class="content-header">
        <div class="container">
            <div class="content-header-wrapper">

                <?php if (is_home() && !is_front_page()) : ?>
                    <!-- Blog page header -->
                    <header class="page-header">
                        <h1 class="page-title"><?php esc_html_e('Latest Posts', 'cloudsync'); ?></h1>
                        <p class="page-description"><?php esc_html_e('Stay updated with our latest news and insights', 'cloudsync'); ?></p>
                    </header>

                <?php elseif (is_search()) : ?>
                    <!-- Search results header -->
                    <header class="page-header">
                        <h1 class="page-title">
                            <?php
                            printf(
                                esc_html__('Search Results for: %s', 'cloudsync'),
                                '<span class="search-term">' . get_search_query() . '</span>'
                            );
                            ?>
                        </h1>
                    </header>

                <?php elseif (is_archive()) : ?>
                    <!-- Archive header -->
                    <header class="page-header">
                        <?php the_archive_title('<h1 class="page-title">', '</h1>'); ?>
                        <?php the_archive_description('<div class="archive-description">', '</div>'); ?>
                    </header>

                <?php else : ?>
                    <!-- Default header -->
                    <header class="page-header">
                        <h1 class="page-title"><?php esc_html_e('Blog', 'cloudsync'); ?></h1>
                    </header>
                <?php endif; ?>

            </div>
        </div>
    </section>

    <!-- Posts Content -->
    <section class="posts-content">
        <div class="container">
            <div class="posts-grid">

                <?php if (have_posts()) : ?>

                    <?php while (have_posts()) : the_post(); ?>

                        <!-- Post Card -->
                        <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>

                            <?php if (has_post_thumbnail()) : ?>
                                <div class="post-thumbnail">
                                    <a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                                        <?php the_post_thumbnail('medium_large', array('alt' => get_the_title())); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <div class="post-content">

                                <header class="post-header">
                                    <h2 class="post-title">
                                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    </h2>

                                    <div class="post-meta">
                                        <span class="post-date">
                                            <i class="fas fa-calendar" aria-hidden="true"></i>
                                            <?php echo get_the_date(); ?>
                                        </span>

                                        <?php if (get_the_author()) : ?>
                                            <span class="post-author">
                                                <i class="fas fa-user" aria-hidden="true"></i>
                                                <?php the_author(); ?>
                                            </span>
                                        <?php endif; ?>

                                        <?php if (get_the_category_list()) : ?>
                                            <span class="post-categories">
                                                <i class="fas fa-folder" aria-hidden="true"></i>
                                                <?php the_category(', '); ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                </header>

                                <div class="post-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>

                                <footer class="post-footer">
                                    <a href="<?php the_permalink(); ?>" class="read-more-btn">
                                        <?php esc_html_e('Read More', 'cloudsync'); ?>
                                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                                    </a>
                                </footer>

                            </div>

                        </article>

                    <?php endwhile; ?>

                    <!-- Pagination -->
                    <div class="posts-pagination">
                        <?php
                        the_posts_pagination(array(
                            'mid_size'  => 2,
                            'prev_text' => '<i class="fas fa-chevron-left"></i> ' . __('Previous', 'cloudsync'),
                            'next_text' => __('Next', 'cloudsync') . ' <i class="fas fa-chevron-right"></i>',
                        ));
                        ?>
                    </div>

                <?php else : ?>

                    <!-- No posts found -->
                    <div class="no-posts-found">
                        <div class="no-posts-content">
                            <i class="fas fa-search" aria-hidden="true"></i>
                            <h2><?php esc_html_e('Nothing Found', 'cloudsync'); ?></h2>

                            <?php if (is_search()) : ?>
                                <p><?php esc_html_e('Sorry, but nothing matched your search terms. Please try again with different keywords.', 'cloudsync'); ?></p>
                                <?php get_search_form(); ?>
                            <?php else : ?>
                                <p><?php esc_html_e('It seems we can\'t find what you\'re looking for. Perhaps searching can help.', 'cloudsync'); ?></p>
                                <?php get_search_form(); ?>
                            <?php endif; ?>
                        </div>
                    </div>

                <?php endif; ?>

            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
