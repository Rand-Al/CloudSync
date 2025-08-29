<?php
/**
 * Newsletter Admin Page
 * 
 * Provides admin interface for managing newsletter subscribers
 * 
 * @package CloudSync
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

/**
 * Add newsletter admin menu page
 */
function cloudsync_add_newsletter_admin_menu() {
    add_management_page(
        __('Newsletter Subscribers', 'cloudsync'),     // Page title
        __('Newsletter', 'cloudsync'),                 // Menu title
        'manage_options',                              // Capability
        'cloudsync-newsletter',                        // Menu slug
        'cloudsync_newsletter_admin_page'              // Callback function
    );
}
add_action('admin_menu', 'cloudsync_add_newsletter_admin_menu');

/**
 * Newsletter admin page content
 */
function cloudsync_newsletter_admin_page() {
    // Handle actions
    if (isset($_GET['action']) && isset($_GET['email']) && wp_verify_nonce($_GET['_wpnonce'], 'newsletter_action')) {
        $email = sanitize_email($_GET['email']);
        $action = sanitize_text_field($_GET['action']);
        
        if ($action === 'unsubscribe') {
            cloudsync_remove_newsletter_subscriber($email);
            echo '<div class="notice notice-success"><p>' . __('Subscriber removed successfully.', 'cloudsync') . '</p></div>';
        } elseif ($action === 'reactivate') {
            cloudsync_reactivate_newsletter_subscriber($email);
            echo '<div class="notice notice-success"><p>' . __('Subscriber reactivated successfully.', 'cloudsync') . '</p></div>';
        }
    }
    
    // Handle bulk export
    if (isset($_POST['export_subscribers']) && wp_verify_nonce($_POST['_wpnonce'], 'export_subscribers')) {
        cloudsync_export_newsletter_subscribers();
        return;
    }
    
    // Get subscribers
    $all_subscribers = cloudsync_get_newsletter_subscribers('all');
    $active_subscribers = cloudsync_get_newsletter_subscribers('active');
    $unsubscribed = cloudsync_get_newsletter_subscribers('unsubscribed');
    
    // Current tab
    $current_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'active';
    
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Newsletter Subscribers', 'cloudsync'); ?></h1>
        
        <!-- Stats -->
        <div class="newsletter-stats" style="margin: 20px 0;">
            <div style="display: flex; gap: 20px;">
                <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #00a32a;">
                    <h3 style="margin: 0;"><?php echo count($active_subscribers); ?></h3>
                    <p style="margin: 5px 0 0 0;"><?php esc_html_e('Active Subscribers', 'cloudsync'); ?></p>
                </div>
                <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #dba617;">
                    <h3 style="margin: 0;"><?php echo count($unsubscribed); ?></h3>
                    <p style="margin: 5px 0 0 0;"><?php esc_html_e('Unsubscribed', 'cloudsync'); ?></p>
                </div>
                <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #0073aa;">
                    <h3 style="margin: 0;"><?php echo count($all_subscribers); ?></h3>
                    <p style="margin: 5px 0 0 0;"><?php esc_html_e('Total', 'cloudsync'); ?></p>
                </div>
            </div>
        </div>
        
        <!-- Tabs -->
        <nav class="nav-tab-wrapper">
            <a href="?page=cloudsync-newsletter&tab=active" class="nav-tab <?php echo $current_tab === 'active' ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e('Active', 'cloudsync'); ?> (<?php echo count($active_subscribers); ?>)
            </a>
            <a href="?page=cloudsync-newsletter&tab=unsubscribed" class="nav-tab <?php echo $current_tab === 'unsubscribed' ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e('Unsubscribed', 'cloudsync'); ?> (<?php echo count($unsubscribed); ?>)
            </a>
            <a href="?page=cloudsync-newsletter&tab=all" class="nav-tab <?php echo $current_tab === 'all' ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e('All', 'cloudsync'); ?> (<?php echo count($all_subscribers); ?>)
            </a>
        </nav>
        
        <!-- Export and Mailchimp Actions -->
        <div style="margin: 20px 0;">
            <form method="post" style="display: inline-block;">
                <?php wp_nonce_field('export_subscribers'); ?>
                <input type="submit" name="export_subscribers" class="button" value="<?php esc_attr_e('Export to CSV', 'cloudsync'); ?>">
            </form>
            
            <?php if (function_exists('cloudsync_mailchimp')): ?>
                <button type="button" id="test-mailchimp" class="button button-secondary" style="margin-left: 10px;">
                    <?php esc_html_e('Test Mailchimp Connection', 'cloudsync'); ?>
                </button>
                
                <?php if (!empty($active_subscribers)): ?>
                    <button type="button" id="migrate-mailchimp" class="button button-primary" style="margin-left: 10px;">
                        <?php printf(esc_html__('Migrate %d Subscribers to Mailchimp', 'cloudsync'), count($active_subscribers)); ?>
                    </button>
                <?php endif; ?>
            <?php endif; ?>
            
            <div id="mailchimp-results" style="margin-top: 15px;"></div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            // Test Mailchimp connection
            $('#test-mailchimp').on('click', function() {
                var button = $(this);
                var resultsDiv = $('#mailchimp-results');
                
                button.prop('disabled', true).text('<?php esc_html_e('Testing...', 'cloudsync'); ?>');
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'test_mailchimp_connection',
                        nonce: '<?php echo wp_create_nonce('cloudsync_mailchimp_test'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            resultsDiv.html('<div class="notice notice-success"><p>✓ ' + response.data + '</p></div>');
                        } else {
                            resultsDiv.html('<div class="notice notice-error"><p>✗ ' + response.data + '</p></div>');
                        }
                    },
                    error: function() {
                        resultsDiv.html('<div class="notice notice-error"><p><?php esc_html_e('Connection test failed', 'cloudsync'); ?></p></div>');
                    },
                    complete: function() {
                        button.prop('disabled', false).text('<?php esc_html_e('Test Mailchimp Connection', 'cloudsync'); ?>');
                    }
                });
            });
            
            // Migrate to Mailchimp
            $('#migrate-mailchimp').on('click', function() {
                if (!confirm('<?php esc_html_e('Are you sure you want to migrate all active subscribers to Mailchimp?', 'cloudsync'); ?>')) {
                    return;
                }
                
                var button = $(this);
                var resultsDiv = $('#mailchimp-results');
                
                button.prop('disabled', true).text('<?php esc_html_e('Migrating...', 'cloudsync'); ?>');
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'migrate_to_mailchimp',
                        nonce: '<?php echo wp_create_nonce('cloudsync_mailchimp_migrate'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            resultsDiv.html('<div class="notice notice-success"><p>✓ ' + response.data + '</p></div>');
                        } else {
                            resultsDiv.html('<div class="notice notice-error"><p>✗ ' + response.data + '</p></div>');
                        }
                    },
                    error: function() {
                        resultsDiv.html('<div class="notice notice-error"><p><?php esc_html_e('Migration failed', 'cloudsync'); ?></p></div>');
                    },
                    complete: function() {
                        button.prop('disabled', false).text('<?php printf(esc_html__('Migrate %d Subscribers to Mailchimp', 'cloudsync'), count($active_subscribers)); ?>');
                    }
                });
            });
        });
        </script>
        
        <!-- Subscribers Table -->
        <?php
        $subscribers_to_show = ($current_tab === 'all') ? $all_subscribers : (($current_tab === 'unsubscribed') ? $unsubscribed : $active_subscribers);
        cloudsync_display_subscribers_table($subscribers_to_show, $current_tab);
        ?>
    </div>
    <?php
}

/**
 * Display subscribers table
 */
function cloudsync_display_subscribers_table($subscribers, $current_tab) {
    if (empty($subscribers)) {
        echo '<p>' . __('No subscribers found.', 'cloudsync') . '</p>';
        return;
    }
    
    ?>
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th><?php esc_html_e('Email', 'cloudsync'); ?></th>
                <th><?php esc_html_e('Status', 'cloudsync'); ?></th>
                <th><?php esc_html_e('Subscribed', 'cloudsync'); ?></th>
                <th><?php esc_html_e('IP Address', 'cloudsync'); ?></th>
                <th><?php esc_html_e('Actions', 'cloudsync'); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($subscribers as $email => $data): ?>
                <tr>
                    <td><strong><?php echo esc_html($email); ?></strong></td>
                    <td>
                        <?php if (is_array($data) && isset($data['status'])): ?>
                            <span class="status-<?php echo esc_attr($data['status']); ?>">
                                <?php echo esc_html(ucfirst($data['status'])); ?>
                            </span>
                        <?php else: ?>
                            <span class="status-active"><?php esc_html_e('Active', 'cloudsync'); ?></span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if (is_array($data) && isset($data['subscribed_at'])): ?>
                            <?php echo esc_html(date('Y-m-d H:i:s', strtotime($data['subscribed_at']))); ?>
                        <?php else: ?>
                            <?php esc_html_e('Unknown', 'cloudsync'); ?>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if (is_array($data) && isset($data['ip_address'])): ?>
                            <?php echo esc_html($data['ip_address']); ?>
                        <?php else: ?>
                            <?php esc_html_e('Unknown', 'cloudsync'); ?>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php
                        $status = is_array($data) && isset($data['status']) ? $data['status'] : 'active';
                        if ($status === 'active'):
                        ?>
                            <a href="<?php echo wp_nonce_url(admin_url('tools.php?page=cloudsync-newsletter&action=unsubscribe&email=' . urlencode($email)), 'newsletter_action'); ?>" 
                               class="button-secondary" 
                               onclick="return confirm('<?php esc_attr_e('Are you sure you want to unsubscribe this user?', 'cloudsync'); ?>')">
                                <?php esc_html_e('Unsubscribe', 'cloudsync'); ?>
                            </a>
                        <?php elseif ($status === 'unsubscribed'): ?>
                            <a href="<?php echo wp_nonce_url(admin_url('tools.php?page=cloudsync-newsletter&action=reactivate&email=' . urlencode($email)), 'newsletter_action'); ?>" 
                               class="button-secondary">
                                <?php esc_html_e('Reactivate', 'cloudsync'); ?>
                            </a>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    
    <style>
    .status-active { color: #00a32a; font-weight: bold; }
    .status-unsubscribed { color: #dba617; font-weight: bold; }
    .newsletter-stats div { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    </style>
    <?php
}

/**
 * Export subscribers to CSV
 */
function cloudsync_export_newsletter_subscribers() {
    $subscribers = cloudsync_get_newsletter_subscribers('all');
    
    $filename = 'newsletter-subscribers-' . date('Y-m-d-H-i-s') . '.csv';
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    $output = fopen('php://output', 'w');
    
    // CSV headers
    fputcsv($output, array(
        'Email',
        'Status', 
        'Subscribed At',
        'IP Address',
        'User Agent',
        'Unsubscribed At'
    ));
    
    // CSV data
    foreach ($subscribers as $email => $data) {
        if (is_array($data)) {
            fputcsv($output, array(
                $email,
                $data['status'] ?? 'active',
                $data['subscribed_at'] ?? '',
                $data['ip_address'] ?? '',
                $data['user_agent'] ?? '',
                $data['unsubscribed_at'] ?? ''
            ));
        } else {
            // Old format (just email string)
            fputcsv($output, array(
                $data,
                'active',
                '',
                '',
                '',
                ''
            ));
        }
    }
    
    fclose($output);
    exit;
}

/**
 * Reactivate newsletter subscriber
 */
function cloudsync_reactivate_newsletter_subscriber($email) {
    $email = strtolower($email);
    $subscribers = get_option('cloudsync_newsletter_subscribers', array());
    
    if (isset($subscribers[$email])) {
        $subscribers[$email]['status'] = 'active';
        unset($subscribers[$email]['unsubscribed_at']);
        
        return update_option('cloudsync_newsletter_subscribers', $subscribers);
    }
    
    return false;
}

/**
 * Add admin dashboard widget
 */
function cloudsync_add_newsletter_dashboard_widget() {
    wp_add_dashboard_widget(
        'cloudsync_newsletter_widget',
        __('Newsletter Subscribers', 'cloudsync'),
        'cloudsync_newsletter_dashboard_widget_content'
    );
}
add_action('wp_dashboard_setup', 'cloudsync_add_newsletter_dashboard_widget');

/**
 * Dashboard widget content
 */
function cloudsync_newsletter_dashboard_widget_content() {
    $active_count = count(cloudsync_get_newsletter_subscribers('active'));
    $unsubscribed_count = count(cloudsync_get_newsletter_subscribers('unsubscribed'));
    $total_count = count(cloudsync_get_newsletter_subscribers('all'));
    
    ?>
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #00a32a;"><?php echo $active_count; ?></div>
            <div><?php esc_html_e('Active', 'cloudsync'); ?></div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #dba617;"><?php echo $unsubscribed_count; ?></div>
            <div><?php esc_html_e('Unsubscribed', 'cloudsync'); ?></div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #0073aa;"><?php echo $total_count; ?></div>
            <div><?php esc_html_e('Total', 'cloudsync'); ?></div>
        </div>
    </div>
    
    <p style="text-align: center;">
        <a href="<?php echo admin_url('tools.php?page=cloudsync-newsletter'); ?>" class="button button-primary">
            <?php esc_html_e('Manage Subscribers', 'cloudsync'); ?>
        </a>
    </p>
    <?php
}