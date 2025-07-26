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
                    <i class="fas fa-cloud"></i>
                </div>
                <h3><?php esc_html_e('Cloud Storage', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Unlimited storage with 99.99% uptime guarantee. Access your files from anywhere, anytime.', 'cloudsync'); ?></p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3><?php esc_html_e('Team Collaboration', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Real-time collaboration tools that keep your team synchronized and productive.', 'cloudsync'); ?></p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3><?php esc_html_e('Advanced Security', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Enterprise-grade encryption and security protocols to keep your data safe.', 'cloudsync'); ?></p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <h3><?php esc_html_e('API Integration', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Seamless integration with 500+ popular tools and services your team already uses.', 'cloudsync'); ?></p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <h3><?php esc_html_e('Mobile Apps', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Native iOS and Android apps for productivity on the go with offline sync.', 'cloudsync'); ?></p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">
                    <i class="fas fa-headset"></i>
                </div>
                <h3><?php esc_html_e('24/7 Support', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Round-the-clock customer support from our team of cloud experts.', 'cloudsync'); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- How It Works Section -->
<section class="how-it-works">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php esc_html_e('How It Works', 'cloudsync'); ?></h2>
            <p><?php esc_html_e('Get started in minutes with our simple 3-step process', 'cloudsync'); ?></p>
        </div>
        <div class="steps">
            <div class="step fade-in">
                <div class="step-number">1</div>
                <h3><?php esc_html_e('Sign Up', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Create your account in seconds with our streamlined onboarding process', 'cloudsync'); ?></p>
            </div>
            <div class="step fade-in">
                <div class="step-number">2</div>
                <h3><?php esc_html_e('Connect Tools', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Integrate your existing tools and import your data with one-click setup', 'cloudsync'); ?></p>
            </div>
            <div class="step fade-in">
                <div class="step-number">3</div>
                <h3><?php esc_html_e('Start Collaborating', 'cloudsync'); ?></h3>
                <p><?php esc_html_e('Invite your team and start experiencing the future of cloud computing', 'cloudsync'); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section class="pricing" id="pricing">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php esc_html_e('Simple, Transparent Pricing', 'cloudsync'); ?></h2>
            <p><?php esc_html_e('Choose the plan that\'s right for your team', 'cloudsync'); ?></p>
        </div>
        <div class="pricing-grid">
            <div class="pricing-card fade-in">
                <h3><?php esc_html_e('Starter', 'cloudsync'); ?></h3>
                <div class="price">$9<span><?php esc_html_e('/month', 'cloudsync'); ?></span></div>
                <ul class="features-list">
                    <li><i class="fas fa-check"></i><?php esc_html_e('5 Users', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('100GB Storage', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Basic Support', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Mobile Apps', 'cloudsync'); ?></li>
                </ul>
                <a href="#" class="cta-btn"><?php esc_html_e('Get Started', 'cloudsync'); ?></a>
            </div>
            <div class="pricing-card popular fade-in">
                <div class="popular-badge"><?php esc_html_e('Most Popular', 'cloudsync'); ?></div>
                <h3><?php esc_html_e('Professional', 'cloudsync'); ?></h3>
                <div class="price">$29<span><?php esc_html_e('/month', 'cloudsync'); ?></span></div>
                <ul class="features-list">
                    <li><i class="fas fa-check"></i><?php esc_html_e('25 Users', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('1TB Storage', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Priority Support', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Advanced Security', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('API Access', 'cloudsync'); ?></li>
                </ul>
                <a href="#" class="cta-btn"><?php esc_html_e('Get Started', 'cloudsync'); ?></a>
            </div>
            <div class="pricing-card fade-in">
                <h3><?php esc_html_e('Enterprise', 'cloudsync'); ?></h3>
                <div class="price">$99<span><?php esc_html_e('/month', 'cloudsync'); ?></span></div>
                <ul class="features-list">
                    <li><i class="fas fa-check"></i><?php esc_html_e('Unlimited Users', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Unlimited Storage', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('24/7 Support', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Custom Integrations', 'cloudsync'); ?></li>
                    <li><i class="fas fa-check"></i><?php esc_html_e('Dedicated Manager', 'cloudsync'); ?></li>
                </ul>
                <a href="#" class="cta-btn"><?php esc_html_e('Contact Sales', 'cloudsync'); ?></a>
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
