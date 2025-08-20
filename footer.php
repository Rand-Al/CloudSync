</div><!-- #content -->

<footer class="site-footer" id="colophon">

    <?php if (is_active_sidebar('footer-1') || is_active_sidebar('footer-2') || is_active_sidebar('footer-3') || is_active_sidebar('footer-4')) : ?>
        <div class="footer-content">
            <div class="container">
                <div class="footer-grid">

                    <?php if (is_active_sidebar('footer-1')) : ?>
                        <div class="footer-section">
                            <?php dynamic_sidebar('footer-1'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (is_active_sidebar('footer-2')) : ?>
                        <div class="footer-section">
                            <?php dynamic_sidebar('footer-2'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (is_active_sidebar('footer-3')) : ?>
                        <div class="footer-section">
                            <?php dynamic_sidebar('footer-3'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (is_active_sidebar('footer-4')) : ?>
                        <div class="footer-section">
                            <?php dynamic_sidebar('footer-4'); ?>
                        </div>
                    <?php endif; ?>

                </div>
            </div>
        </div>
    <?php endif; ?>

    <?php
    // Get customizer values for footer
    $company_address = cloudsync_get_customizer_value('cloudsync_footer_company_address');
    $company_phone = cloudsync_get_customizer_value('cloudsync_footer_company_phone');
    $company_email = cloudsync_get_customizer_value('cloudsync_footer_company_email');
    $footer_tagline = cloudsync_get_customizer_value('cloudsync_footer_tagline');
    $newsletter_text = cloudsync_get_customizer_value('cloudsync_footer_newsletter_text');

    // Social media links
    $twitter_url = cloudsync_get_customizer_value('cloudsync_footer_twitter_url');
    $linkedin_url = cloudsync_get_customizer_value('cloudsync_footer_linkedin_url');
    $github_url = cloudsync_get_customizer_value('cloudsync_footer_github_url');
    $youtube_url = cloudsync_get_customizer_value('cloudsync_footer_youtube_url');

    // Check if we have any customizer content to display
    $has_customizer_content = $company_address || $company_phone || $company_email || $footer_tagline || $newsletter_text || $twitter_url || $linkedin_url || $github_url || $youtube_url;
    ?>

    <?php if ($has_customizer_content) : ?>
        <div class="footer-customizer-content">
            <div class="container">
                <div class="footer-customizer-grid">

                    <!-- Company Information Column -->
                    <?php if ($footer_tagline || $company_address || $company_phone || $company_email) : ?>
                        <div class="footer-company-info">
                            <?php if ($footer_tagline) : ?>
                                <p class="footer-tagline"><?php echo esc_html($footer_tagline); ?></p>
                            <?php endif; ?>

                            <?php if ($company_address) : ?>
                                <div class="footer-contact-item">
                                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                                    <span><?php echo nl2br(esc_html($company_address)); ?></span>
                                </div>
                            <?php endif; ?>

                            <?php if ($company_phone) : ?>
                                <div class="footer-contact-item">
                                    <i class="fas fa-phone" aria-hidden="true"></i>
                                    <a href="tel:<?php echo esc_attr(str_replace(array(' ', '-', '(', ')'), '', $company_phone)); ?>">
                                        <?php echo esc_html($company_phone); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <?php if ($company_email) : ?>
                                <div class="footer-contact-item">
                                    <i class="fas fa-envelope" aria-hidden="true"></i>
                                    <a href="mailto:<?php echo esc_attr($company_email); ?>">
                                        <?php echo esc_html($company_email); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Social Media Links Column -->
                    <?php if ($twitter_url || $linkedin_url || $github_url || $youtube_url) : ?>
                        <div class="footer-social-media">
                            <h4><?php esc_html_e('Follow Us', 'cloudsync'); ?></h4>
                            <div class="social-links">
                                <?php if ($twitter_url) : ?>
                                    <a href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Follow us on Twitter', 'cloudsync'); ?>">
                                        <i class="fab fa-twitter" aria-hidden="true"></i>
                                    </a>
                                <?php endif; ?>

                                <?php if ($linkedin_url) : ?>
                                    <a href="<?php echo esc_url($linkedin_url); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Follow us on LinkedIn', 'cloudsync'); ?>">
                                        <i class="fab fa-linkedin" aria-hidden="true"></i>
                                    </a>
                                <?php endif; ?>

                                <?php if ($github_url) : ?>
                                    <a href="<?php echo esc_url($github_url); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Follow us on GitHub', 'cloudsync'); ?>">
                                        <i class="fab fa-github" aria-hidden="true"></i>
                                    </a>
                                <?php endif; ?>

                                <?php if ($youtube_url) : ?>
                                    <a href="<?php echo esc_url($youtube_url); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Follow us on YouTube', 'cloudsync'); ?>">
                                        <i class="fab fa-youtube" aria-hidden="true"></i>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Newsletter Signup Column -->
                    <?php if ($newsletter_text) : ?>
                        <div class="footer-newsletter">
                            <h4><?php esc_html_e('Stay Updated', 'cloudsync'); ?></h4>
                            <p><?php echo esc_html($newsletter_text); ?></p>
                            <div class="newsletter-signup">
                                <input type="email" placeholder="<?php esc_attr_e('Enter your email', 'cloudsync'); ?>" aria-label="<?php esc_attr_e('Email address for newsletter', 'cloudsync'); ?>">
                                <button type="submit"><?php esc_html_e('Subscribe', 'cloudsync'); ?></button>
                            </div>
                        </div>
                    <?php endif; ?>

                </div>
            </div>
        </div>
    <?php endif; ?>

    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-content">

                <!-- Copyright Information -->
                <p class="copyright">
                    <?php
                    $custom_copyright = cloudsync_get_customizer_value('cloudsync_footer_copyright_text');
                    if ($custom_copyright) {
                        echo esc_html($custom_copyright);
                    } else {
                        printf(
                            esc_html__('Copyright &copy; %s %s. All rights reserved.', 'cloudsync'),
                            date('Y'),
                            get_bloginfo('name')
                        );
                    }
                    ?>
                </p>

                <!-- Footer Menu -->
                <?php if (has_nav_menu('footer')) : ?>
                    <nav class="footer-navigation" role="navigation" aria-label="<?php esc_attr_e('Footer Menu', 'cloudsync'); ?>">
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'footer',
                            'menu_class'     => 'footer-menu',
                            'container'      => false,
                            'depth'          => 1, // Only top-level items
                            'fallback_cb'    => false,
                        ));
                        ?>
                    </nav>
                <?php endif; ?>

            </div>
        </div>
    </div>

</footer>

<?php wp_footer(); ?>

</body>

</html
