<?php
/**
 * Template for displaying comments and comment form
 * 
 * This template provides a comprehensive comment system for the CloudSync theme
 * with modern design, accessibility features, and full WordPress compatibility.
 * 
 * @package CloudSync
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Check if post is password protected and require password for comments
if (post_password_required()) {
    return;
}
?>

<div class="comments-area" id="comments">
    
    <?php if (have_comments()) : ?>
        
        <!-- Comments Header -->
        <div class="comments-header">
            <h3 class="comments-title">
                <?php
                $comment_count = get_comments_number();
                if ($comment_count == 1) {
                    printf(
                        esc_html__('One comment on "%s"', 'cloudsync'),
                        '<span>' . get_the_title() . '</span>'
                    );
                } else {
                    printf(
                        esc_html(_nx(
                            '%1$s comment on "%2$s"',
                            '%1$s comments on "%2$s"',
                            $comment_count,
                            'comments title',
                            'cloudsync'
                        )),
                        number_format_i18n($comment_count),
                        '<span>' . get_the_title() . '</span>'
                    );
                }
                ?>
            </h3>
        </div>

        <!-- Comments Navigation (if many comments) -->
        <?php if (get_comment_pages_count() > 1 && get_option('page_comments')) : ?>
            <nav class="comments-navigation" aria-label="<?php esc_attr_e('Comments Navigation', 'cloudsync'); ?>">
                <div class="nav-links">
                    <div class="nav-previous">
                        <?php previous_comments_link(esc_html__('&larr; Older Comments', 'cloudsync')); ?>
                    </div>
                    <div class="nav-next">
                        <?php next_comments_link(esc_html__('Newer Comments &rarr;', 'cloudsync')); ?>
                    </div>
                </div>
            </nav>
        <?php endif; ?>

        <!-- Comments List -->
        <ol class="comment-list">
            <?php
            wp_list_comments(array(
                'style'         => 'ol',
                'short_ping'    => true,
                'avatar_size'   => 50,
                'callback'      => 'cloudsync_comment_callback',
                'end-callback'  => 'cloudsync_comment_end_callback',
            ));
            ?>
        </ol>

        <!-- Comments Navigation (Bottom) -->
        <?php if (get_comment_pages_count() > 1 && get_option('page_comments')) : ?>
            <nav class="comments-navigation comments-navigation-bottom" aria-label="<?php esc_attr_e('Comments Navigation', 'cloudsync'); ?>">
                <div class="nav-links">
                    <div class="nav-previous">
                        <?php previous_comments_link(esc_html__('&larr; Older Comments', 'cloudsync')); ?>
                    </div>
                    <div class="nav-next">
                        <?php next_comments_link(esc_html__('Newer Comments &rarr;', 'cloudsync')); ?>
                    </div>
                </div>
            </nav>
        <?php endif; ?>

    <?php endif; // Check for have_comments() ?>

    <!-- No Comments Message -->
    <?php if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')) : ?>
        <div class="no-comments-message">
            <p class="no-comments-text">
                <i class="fas fa-lock" aria-hidden="true"></i>
                <?php esc_html_e('Comments are closed for this page.', 'cloudsync'); ?>
            </p>
        </div>
    <?php endif; ?>

    <!-- Comment Form -->
    <?php if (comments_open()) : ?>
        <div class="comment-respond-wrapper">
            <?php
            comment_form(array(
                'title_reply'          => esc_html__('Leave a Comment', 'cloudsync'),
                'title_reply_to'       => esc_html__('Leave a Reply to %s', 'cloudsync'),
                'title_reply_before'   => '<h3 id="reply-title" class="comment-reply-title">',
                'title_reply_after'    => '</h3>',
                'cancel_reply_before'  => ' <small>',
                'cancel_reply_after'   => '</small>',
                'cancel_reply_link'    => esc_html__('Cancel Reply', 'cloudsync'),
                'label_submit'         => esc_html__('Post Comment', 'cloudsync'),
                'submit_button'        => '<input name="%1$s" type="submit" id="%2$s" class="%3$s btn btn-primary" value="%4$s" />',
                'comment_field'        => '<div class="comment-form-comment"><label for="comment" class="comment-form-label">' . esc_html__('Comment *', 'cloudsync') . '</label><textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required" placeholder="' . esc_attr__('Enter your comment here...', 'cloudsync') . '" aria-describedby="comment-notes"></textarea></div>',
                'must_log_in'          => '<p class="must-log-in">' . sprintf(
                    wp_kses(
                        __('You must be <a href="%s">logged in</a> to post a comment.', 'cloudsync'),
                        array('a' => array('href' => array()))
                    ),
                    wp_login_url(apply_filters('the_permalink', get_permalink(get_the_ID())))
                ) . '</p>',
                'logged_in_as'         => '<p class="logged-in-as">' . sprintf(
                    wp_kses(
                        __('Logged in as <a href="%1$s" aria-label="View your profile">%2$s</a>. <a href="%3$s">Log out?</a>', 'cloudsync'),
                        array('a' => array('href' => array(), 'aria-label' => array()))
                    ),
                    get_edit_user_link(),
                    $user_identity,
                    wp_logout_url(apply_filters('the_permalink', get_permalink(get_the_ID())))
                ) . '</p>',
                'comment_notes_before' => '<p class="comment-notes" id="comment-notes"><span id="email-notes">' . esc_html__('Your email address will not be published.', 'cloudsync') . '</span> ' . (get_option('require_name_email') ? sprintf(' ' . esc_html__('Required fields are marked %s', 'cloudsync'), '<span class="required">*</span>') : '') . '</p>',
                'comment_notes_after'  => '',
                'fields'               => array(
                    'author' => '<div class="comment-form-author"><label for="author" class="comment-form-label">' . esc_html__('Name', 'cloudsync') . (get_option('require_name_email') ? ' <span class="required">*</span>' : '') . '</label><input id="author" name="author" type="text" value="' . esc_attr($commenter['comment_author']) . '" size="30"' . (get_option('require_name_email') ? ' required="required"' : '') . ' placeholder="' . esc_attr__('Your name', 'cloudsync') . '" /></div>',
                    'email'  => '<div class="comment-form-email"><label for="email" class="comment-form-label">' . esc_html__('Email', 'cloudsync') . (get_option('require_name_email') ? ' <span class="required">*</span>' : '') . '</label><input id="email" name="email" type="email" value="' . esc_attr($commenter['comment_author_email']) . '" size="30" aria-describedby="email-notes"' . (get_option('require_name_email') ? ' required="required"' : '') . ' placeholder="' . esc_attr__('your@email.com', 'cloudsync') . '" /></div>',
                    'url'    => '<div class="comment-form-url"><label for="url" class="comment-form-label">' . esc_html__('Website', 'cloudsync') . '</label><input id="url" name="url" type="url" value="' . esc_attr($commenter['comment_author_url']) . '" size="30" placeholder="' . esc_attr__('https://yourwebsite.com (optional)', 'cloudsync') . '" /></div>',
                ),
            ));
            ?>
        </div>
    <?php endif; ?>

</div>

<?php
/**
 * Custom comment callback function for displaying individual comments
 * 
 * This function renders each comment with the theme's design and functionality
 * including author avatars, metadata, and reply links.
 * 
 * @param WP_Comment $comment Comment object
 * @param array      $args    Array of arguments
 * @param int        $depth   Depth of comment in the threaded display loop
 */
function cloudsync_comment_callback($comment, $args, $depth) {
    if ('div' === $args['style']) {
        $tag       = 'div';
        $add_below = 'comment';
    } else {
        $tag       = 'li';
        $add_below = 'div-comment';
    }

    $commenter = wp_get_current_commenter();
    if ($commenter['comment_author_email']) {
        $moderation_note = esc_html__('Your comment is awaiting moderation.', 'cloudsync');
    } else {
        $moderation_note = esc_html__('Your comment is awaiting moderation.', 'cloudsync');
    }
    ?>
    <<?php echo $tag; ?> <?php comment_class(empty($args['has_children']) ? '' : 'parent'); ?> id="comment-<?php comment_ID(); ?>">
        
        <?php if ('div' != $args['style']) : ?>
            <div id="div-comment-<?php comment_ID(); ?>" class="comment-body">
        <?php endif; ?>
        
        <div class="comment-meta">
            <div class="comment-author vcard">
                <?php if (0 != $args['avatar_size']) : ?>
                    <div class="comment-author-avatar">
                        <?php echo get_avatar($comment, $args['avatar_size'], '', '', array('class' => 'avatar')); ?>
                    </div>
                <?php endif; ?>
                
                <div class="comment-author-info">
                    <div class="comment-author-name">
                        <?php
                        $author_link = get_comment_author_link($comment);
                        if (!empty($author_link) && strpos($author_link, '<a') !== false) {
                            echo $author_link;
                        } else {
                            printf('<span class="fn">%s</span>', get_comment_author($comment));
                        }
                        ?>
                        
                        <?php if (user_can($comment->user_id, 'manage_options')) : ?>
                            <span class="comment-author-badge admin-badge">
                                <i class="fas fa-crown" aria-hidden="true"></i>
                                <?php esc_html_e('Admin', 'cloudsync'); ?>
                            </span>
                        <?php elseif ($comment->user_id == get_post()->post_author) : ?>
                            <span class="comment-author-badge author-badge">
                                <i class="fas fa-pen" aria-hidden="true"></i>
                                <?php esc_html_e('Author', 'cloudsync'); ?>
                            </span>
                        <?php endif; ?>
                    </div>
                    
                    <div class="comment-metadata">
                        <time class="comment-date" datetime="<?php comment_time('c'); ?>">
                            <i class="fas fa-clock" aria-hidden="true"></i>
                            <?php
                            printf(
                                '<a href="%1$s" aria-label="%2$s">%3$s</a>',
                                esc_url(get_comment_link($comment, $args)),
                                esc_attr(sprintf(__('Comment posted on %s', 'cloudsync'), get_comment_date('', $comment))),
                                sprintf(esc_html__('%1$s at %2$s', 'cloudsync'), get_comment_date('', $comment), get_comment_time())
                            );
                            ?>
                        </time>
                        
                        <?php edit_comment_link(esc_html__('Edit', 'cloudsync'), '<span class="edit-link">', '</span>'); ?>
                    </div>
                </div>
            </div>
        </div>

        <?php if ('0' == $comment->comment_approved) : ?>
            <div class="comment-awaiting-moderation">
                <i class="fas fa-hourglass-half" aria-hidden="true"></i>
                <?php echo $moderation_note; ?>
            </div>
        <?php endif; ?>

        <div class="comment-content">
            <?php comment_text(); ?>
        </div>

        <?php if ($depth < $args['max_depth']) : ?>
            <div class="reply">
                <?php
                comment_reply_link(array_merge($args, array(
                    'add_below' => $add_below,
                    'depth'     => $depth,
                    'max_depth' => $args['max_depth'],
                    'before'    => '<i class="fas fa-reply" aria-hidden="true"></i> ',
                    'reply_text' => esc_html__('Reply', 'cloudsync'),
                )));
                ?>
            </div>
        <?php endif; ?>

        <?php if ('div' != $args['style']) : ?>
            </div>
        <?php endif; ?>
    <?php
}

/**
 * Custom comment end callback function
 * 
 * @param WP_Comment $comment Comment object
 * @param array      $args    Array of arguments
 * @param int        $depth   Depth of comment in the threaded display loop
 */
function cloudsync_comment_end_callback($comment, $args, $depth) {
    if ('div' === $args['style']) {
        echo '</div>';
    } else {
        echo '</li>';
    }
}
?>