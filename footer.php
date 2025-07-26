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

    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-content">

                <!-- Copyright Information -->
                <p class="copyright">
                    <?php
                    printf(
                        esc_html__('Copyright &copy; %s %s. All rights reserved.', 'cloudsync'),
                        date('Y'),
                        get_bloginfo('name')
                    );
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
