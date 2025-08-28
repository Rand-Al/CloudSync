<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

    <?php wp_body_open(); ?>

    <header class="site-header" id="masthead">
        <nav class="container">
            <div class="header-content">

                <!-- Logo/Site Title Section -->
                <div class="site-branding">
                    <?php
                    // Display custom logo if available, otherwise show site title
                    if (has_custom_logo()) {
                        the_custom_logo();
                    } else {
                    ?>
                        <h1 class="site-title">
                            <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                                <?php bloginfo('name'); ?>
                            </a>
                        </h1>
                        <?php
                        $description = get_bloginfo('description', 'display');
                        if ($description || is_customize_preview()) {
                        ?>
                            <p class="site-description"><?php echo $description; ?></p>
                    <?php
                        }
                    }
                    ?>
                </div>

                <!-- Primary Navigation -->
                <?php if (has_nav_menu('primary')) : ?>
                    <nav class="main-navigation" role="navigation" aria-label="<?php esc_attr_e('Primary Menu', 'cloudsync'); ?>">
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'primary',
                            'menu_class'     => 'primary-menu',
                            'container'      => false,
                            'fallback_cb'    => false,
                        ));
                        ?>
                    </nav>
                <?php endif; ?>


                <!-- CTA Button -->
                <a href="#contact" class="cta-btn header-cta">
                    <?php esc_html_e('Get Started', 'cloudsync'); ?>
                </a>

                <!-- Mobile Menu Toggle -->
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span class="sr-only"><?php esc_html_e('Menu', 'cloudsync'); ?></span>
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </nav>
    </header>

    <div id="content" class="site-content">
