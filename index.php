<?php

/**
 * The main template file
 * 
 * This template displays the CloudSync landing page design
 * integrated with WordPress functionality. It combines static
 * design elements with dynamic WordPress features.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

get_header(); ?>

<!-- Hero Section -->
<section class="hero" id="home">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <h1>
                    <?php bloginfo('name'); ?> -
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_main_title', 'The Future of Cloud Computing is Here')); ?>
                </h1>
                <p>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_description', 'CloudSync revolutionizes how teams collaborate with lightning-fast performance, enterprise-grade security, and seamless integration across all your favorite tools.')) ?>
                </p>
                <div class="hero-buttons">
                    <a href="<?php echo esc_url(cloudsync_get_customizer_value('cloudsync_hero_primary_btn_url', '#pricing')) ?>" class="cta-btn">
                        <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_primary_btn_text', 'Start Free Trial')) ?>
                    </a>
                    <a href="<?php echo esc_url(cloudsync_get_customizer_value('cloudsync_hero_secondary_btn_url', '#features')) ?>" class="btn-secondary">
                        <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_secondary_btn_text', 'Watch Demo')) ?>
                    </a>
                </div>
            </div>
            <div class="hero-visual">
                <div class="floating-card card-1">
                    <i class="<?php echo esc_attr(cloudsync_get_customizer_value('cloudsync_hero_card1_icon', 'fas fa-chart-line')) ?>" style="font-size: 2rem; color: #667eea;"></i>
                    <h4><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_card1_title', 'Analytics')) ?></h4>
                </div>
                <div class="floating-card card-2">
                    <i class="<?php echo esc_attr(cloudsync_get_customizer_value('cloudsync_hero_card2_icon', 'fas fa-shield-alt')); ?>" style="font-size: 2rem; color: #667eea;"></i>
                    <h4><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_card2_title', 'Security')); ?></h4>
                </div>
                <div class="floating-card card-3">
                    <i class="<?php echo esc_attr(cloudsync_get_customizer_value('cloudsync_hero_card3_icon', 'fas fa-rocket')); ?>" style="font-size: 2rem; color: #667eea;"></i>
                    <h4><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_hero_card3_title', 'Performance')); ?></h4>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features" id="features">
    <div class="container">
        <div class="section-header fade-in">
            <h2>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_features_main_title', 'Powerful Features for Modern Teams')); ?>
            </h2>
            <p>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_features_description', 'Everything you need to scale your business and streamline your workflow')); ?>
            </p>
        </div>
        <div class="features-grid">
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature1_icon', 'fas fa-cloud')); ?>"></i>
                </div>
                <h3><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature1_title', 'Cloud Storage')); ?></h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature1_description', 'Unlimited storage with 99.99% uptime guarantee. Access your files from anywhere, anytime.'));
                    ?>
                </p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature2_icon', 'fas fa-users')); ?>"></i>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature2_title', 'Team Collaboration')); ?>
                </h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature2_description', 'UReal-time collaboration tools that keep your team synchronized and productive.'));
                    ?>
                </p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature3_icon', 'fas fa-lock')); ?>"></i>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature3_title', 'Advanced Security')); ?>
                </h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature3_description', 'Enterprise-grade encryption and security protocols to keep your data safe'));
                    ?>
                </p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature4_icon', 'fas fa-cog')); ?>"></i>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature4_title', 'API Integration')); ?>
                </h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature4_description', 'Seamless integration with 500+ popular tools and services your team already uses.'));
                    ?>
                </p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature5_icon', 'fas fa-mobile-alt')); ?>"></i>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature5_title', 'Mobile Apps')); ?>
                </h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature5_description', 'Native iOS and Android apps for productivity on the go with offline sync.'));
                    ?>
                </p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="<?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature6_icon', 'fas fa-headset')); ?>"></i>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_feature6_title', '24/7 Support')); ?>
                </h3>
                <p>
                    <?php
                    echo esc_html(cloudsync_get_customizer_value('cloudsync_feature6_description', 'Round-the-clock customer support from our team of cloud experts.'));
                    ?>
                </p>
            </div>
        </div>
    </div>
</section>

<!-- How It Works Section -->
<section class="how-it-works">
    <div class="container">
        <div class="section-header fade-in">
            <h2>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_main_title', 'How It Works')); ?>
            </h2>
            <p>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_description', 'Get started in minutes with our simple 3-step process')); ?>
            </p>
        </div>
        <div class="steps">
            <div class="step fade-in">
                <div class="step-number">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step1_identifier', '1')); ?>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step1_title', 'Sign Up')); ?>
                </h3>
                <p>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step1_description', 'Create your account in seconds with our streamlined onboarding process')); ?>
                </p>
            </div>
            <div class="step fade-in">
                <div class="step-number">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step2_identifier', '2')); ?>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step2_title', 'Connect Tools')); ?>
                </h3>
                <p>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step2_description', 'Integrate your existing tools and import your data with one-click setup')); ?>

                </p>
            </div>
            <div class="step fade-in">
                <div class="step-number">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step3_identifier', '3')); ?>
                </div>
                <h3>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step3_title', 'Start Collaborating')); ?>
                </h3>
                <p>
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_how_it_works_step3_description', 'IInvite your team and start experiencing the future of cloud computing')); ?>
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section class="pricing" id="pricing">
    <div class="container">
        <div class="section-header fade-in">
            <h2>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_pricing_main_title', 'Simple, Transparent Pricing')); ?>
            </h2>
            <p>
                <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_pricing_description', 'Choose the plan that\'s right for your team')); ?>
            </p>
        </div>
        <div class="pricing-grid">
            <!-- Plan 1: Starter -->
            <div class="pricing-card fade-in">
                <h3><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan1_name', __('Starter', 'cloudsync'))); ?></h3>
                <div class="price">
                    $<span class="price-value"><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan1_price', '9')); ?></span>
                    <span><?php esc_html_e('/month', 'cloudsync'); ?></span>
                </div>
                <ul class="features-list">
                    <?php
                    $plan1_features = cloudsync_get_customizer_value('cloudsync_plan1_features', "5 Users\n100GB Storage\nBasic Support\nMobile Apps");
                    echo cloudsync_get_pricing_features($plan1_features);
                    ?>
                </ul>
                <a href="<?php echo esc_url(cloudsync_get_customizer_value('cloudsync_plan1_button_url', '#')); ?>" class="cta-btn">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan1_button_text', __('Get Started', 'cloudsync'))); ?>
                </a>
            </div>

            <!-- Plan 2: Professional -->
            <div class="pricing-card popular fade-in">
                <div class="popular-badge"><?php esc_html_e('Most Popular', 'cloudsync'); ?></div>
                <h3><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan2_name', __('Professional', 'cloudsync'))); ?></h3>
                <div class="price">
                    $<span class="price-value"><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan2_price', '29')); ?></span>
                    <span><?php esc_html_e('/month', 'cloudsync'); ?></span>
                </div>
                <ul class="features-list">
                    <?php
                    $plan2_features = cloudsync_get_customizer_value('cloudsync_plan2_features', "25 Users\n1TB Storage\nPriority Support\nAdvanced Security\nAPI Access");
                    echo cloudsync_get_pricing_features($plan2_features);
                    ?>
                </ul>
                <a href="<?php echo esc_url(cloudsync_get_customizer_value('cloudsync_plan2_button_url', '#')); ?>" class="cta-btn">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan2_button_text', __('Get Started', 'cloudsync'))); ?>
                </a>
            </div>

            <!-- Plan 3: Enterprise -->
            <div class="pricing-card fade-in">
                <h3><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan3_name', __('Enterprise', 'cloudsync'))); ?></h3>
                <div class="price">
                    $<span class="price-value"><?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan3_price', '99')); ?></span>
                    <span><?php esc_html_e('/month', 'cloudsync'); ?></span>
                </div>
                <ul class="features-list">
                    <?php
                    $plan3_features = cloudsync_get_customizer_value('cloudsync_plan3_features', "Unlimited Users\nUnlimited Storage\n24/7 Support\nCustom Integrations\nDedicated Manager");
                    echo cloudsync_get_pricing_features($plan3_features);
                    ?>
                </ul>
                <a href="<?php echo esc_url(cloudsync_get_customizer_value('cloudsync_plan3_button_url', '#')); ?>" class="cta-btn">
                    <?php echo esc_html(cloudsync_get_customizer_value('cloudsync_plan3_button_text', __('Contact Sales', 'cloudsync'))); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Final CTA Section -->
<section class="final-cta">
    <div class="container">
        <h2><?php esc_html_e('Ready to Transform Your Workflow?', 'cloudsync'); ?></h2>
        <p><?php esc_html_e('Join thousands of teams already using CloudSync to boost productivity', 'cloudsync'); ?></p>
        <a href="#" class="cta-btn" style="background: white; color: #667eea;"><?php esc_html_e('Start Your Free Trial', 'cloudsync'); ?></a>
    </div>
</section>

<?php get_footer(); ?>
