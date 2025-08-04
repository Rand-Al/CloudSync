<?php

/**
 * Template for displaying single posts
 * 
 * This template is used for individual blog posts. It provides a clean,
 * readable layout optimized for long-form content while maintaining
 * the theme's visual identity.
 * 
 * Features:
 * - Optimized typography for reading
 * - Social sharing buttons
 * - Author bio section
 * - Post navigation
 * - Comments integration
 * - SEO-friendly markup
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header(); ?>

<main class="site-main">

    <?php while (have_posts()) : the_post(); ?>

        <!-- Post Hero Section -->
        <section class="post-hero">
            <div class="container">
                <div class="post-hero-content">

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
                            <li class="breadcrumb-item">
                                <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">
                                    <?php esc_html_e('Blog', 'cloudsync'); ?>
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

                    <!-- Post Header -->
                    <header class="post-header">
                        <h1 class="post-title"><?php the_title(); ?></h1>

                        <!-- Post Meta -->
                        <div class="post-meta">
                            <div class="post-meta-item post-date">
                                <i class="fas fa-calendar" aria-hidden="true"></i>
                                <time datetime="<?php echo get_the_date('c'); ?>" itemprop="datePublished">
                                    <?php echo get_the_date(); ?>
                                </time>
                            </div>

                            <?php if (get_the_author()) : ?>
                                <div class="post-meta-item post-author">
                                    <i class="fas fa-user" aria-hidden="true"></i>
                                    <span itemprop="author"><?php the_author(); ?></span>
                                </div>
                            <?php endif; ?>

                            <?php if (get_the_category_list()) : ?>
                                <div class="post-meta-item post-categories">
                                    <i class="fas fa-folder" aria-hidden="true"></i>
                                    <?php the_category(', '); ?>
                                </div>
                            <?php endif; ?>

                            <?php if (get_comments_number() > 0) : ?>
                                <div class="post-meta-item post-comments">
                                    <i class="fas fa-comments" aria-hidden="true"></i>
                                    <a href="#comments">
                                        <?php
                                        printf(
                                            _n('%s Comment', '%s Comments', get_comments_number(), 'cloudsync'),
                                            get_comments_number()
                                        );
                                        ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <!-- Reading Time Estimate -->
                            <div class="post-meta-item reading-time">
                                <i class="fas fa-clock" aria-hidden="true"></i>
                                <?php
                                $word_count = str_word_count(strip_tags(get_the_content()));
                                $reading_time = ceil($word_count / 200); // Average reading speed
                                printf(
                                    _n('%s min read', '%s min read', $reading_time, 'cloudsync'),
                                    $reading_time
                                );
                                ?>
                            </div>
                        </div>
                    </header>

                </div>
            </div>
        </section>

        <!-- Featured Image -->
        <?php if (has_post_thumbnail()) : ?>
            <section class="post-featured-image">
                <div class="container">
                    <div class="featured-image-wrapper">
                        <?php
                        the_post_thumbnail('large', array(
                            'class' => 'post-thumbnail',
                            'alt'   => get_the_title(),
                            'itemprop' => 'image'
                        ));
                        ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- Post Content -->
        <article class="post-content-section" id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="container">
                <div class="post-content-wrapper">

                    <!-- Main Content -->
                    <div class="entry-content" itemprop="articleBody">
                        <?php
                        the_content();

                        // Handle pagination for posts with <!--nextpage--> tags  
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

                    <!-- Post Footer -->
                    <footer class="entry-footer">

                        <!-- Tags -->
                        <?php if (has_tag()) : ?>
                            <div class="post-tags">
                                <h3 class="tags-title">
                                    <i class="fas fa-tags" aria-hidden="true"></i>
                                    <?php esc_html_e('Tags:', 'cloudsync'); ?>
                                </h3>
                                <div class="tags-list">
                                    <?php the_tags('', ' ', ''); ?>
                                </div>
                            </div>
                        <?php endif; ?>

                        <!-- Social Share -->
                        <div class="social-share">
                            <h3 class="share-title">
                                <i class="fas fa-share-alt" aria-hidden="true"></i>
                                <?php esc_html_e('Share this post:', 'cloudsync'); ?>
                            </h3>
                            <div class="share-buttons">

                                <!-- Twitter -->
                                <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="share-btn share-twitter"
                                    aria-label="<?php esc_attr_e('Share on Twitter', 'cloudsync'); ?>">
                                    <i class="fab fa-twitter"></i>
                                    <span><?php esc_html_e('Twitter', 'cloudsync'); ?></span>
                                </a>

                                <!-- Facebook -->
                                <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="share-btn share-facebook"
                                    aria-label="<?php esc_attr_e('Share on Facebook', 'cloudsync'); ?>">
                                    <i class="fab fa-facebook-f"></i>
                                    <span><?php esc_html_e('Facebook', 'cloudsync'); ?></span>
                                </a>

                                <!-- LinkedIn -->
                                <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo urlencode(get_permalink()); ?>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="share-btn share-linkedin"
                                    aria-label="<?php esc_attr_e('Share on LinkedIn', 'cloudsync'); ?>">
                                    <i class="fab fa-linkedin-in"></i>
                                    <span><?php esc_html_e('LinkedIn', 'cloudsync'); ?></span>
                                </a>

                                <!-- Copy Link -->
                                <button type="button"
                                    class="share-btn share-copy"
                                    data-url="<?php echo esc_attr(get_permalink()); ?>"
                                    aria-label="<?php esc_attr_e('Copy link', 'cloudsync'); ?>">
                                    <i class="fas fa-link"></i>
                                    <span><?php esc_html_e('Copy Link', 'cloudsync'); ?></span>
                                </button>

                            </div>
                        </div>

                        <!-- Edit Link (for logged in users) -->
                        <?php if (get_edit_post_link()) : ?>
                            <div class="edit-link">
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
                                    '<div class="edit-post-link">',
                                    '</div>'
                                );
                                ?>
                            </div>
                        <?php endif; ?>

                    </footer>

                </div>
            </div>
        </article>

        <!-- Author Bio -->
        <?php if (get_the_author_meta('description')) : ?>
            <section class="author-bio">
                <div class="container">
                    <div class="author-bio-wrapper">
                        <div class="author-avatar">
                            <?php echo get_avatar(get_the_author_meta('ID'), 80, '', get_the_author_meta('display_name')); ?>
                        </div>
                        <div class="author-info">
                            <h3 class="author-name">
                                <?php printf(__('About %s', 'cloudsync'), get_the_author_meta('display_name')); ?>
                            </h3>
                            <div class="author-description">
                                <?php echo wp_kses_post(get_the_author_meta('description')); ?>
                            </div>
                            <?php if (get_the_author_meta('url')) : ?>
                                <div class="author-website">
                                    <a href="<?php echo esc_url(get_the_author_meta('url')); ?>" target="_blank" rel="noopener noreferrer">
                                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                                        <?php esc_html_e('Visit Website', 'cloudsync'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- Post Navigation -->
        <?php
        $prev_post = get_previous_post();
        $next_post = get_next_post();
        if ($prev_post || $next_post) :
        ?>
            <section class="post-navigation">
                <div class="container">
                    <div class="post-nav-wrapper">

                        <?php if ($prev_post) : ?>
                            <div class="nav-previous">
                                <a href="<?php echo get_permalink($prev_post); ?>" class="nav-link">
                                    <div class="nav-direction">
                                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                        <?php esc_html_e('Previous Post', 'cloudsync'); ?>
                                    </div>
                                    <div class="nav-title"><?php echo get_the_title($prev_post); ?></div>
                                </a>
                            </div>
                        <?php endif; ?>

                        <?php if ($next_post) : ?>
                            <div class="nav-next">
                                <a href="<?php echo get_permalink($next_post); ?>" class="nav-link">
                                    <div class="nav-direction">
                                        <?php esc_html_e('Next Post', 'cloudsync'); ?>
                                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                                    </div>
                                    <div class="nav-title"><?php echo get_the_title($next_post); ?></div>
                                </a>
                            </div>
                        <?php endif; ?>

                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- Comments Section -->
        <?php if (comments_open() || get_comments_number()) : ?>
            <section class="post-comments-section" id="comments">
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
