<?php
/**
 * Plugin Name: Alev Contact Webhook
 * Description: Minimal contact form shortcode that forwards sanitized submissions to a configured HTTPS webhook.
 * Version: 1.0.0
 * Author: AlevDev
 */

if (!defined('ABSPATH')) {
    exit;
}

const ALEV_CONTACT_OPTION = 'alev_contact_webhook_url';

add_action('admin_init', function () {
    register_setting('alev_contact_settings', ALEV_CONTACT_OPTION, [
        'type' => 'string',
        'sanitize_callback' => function ($value) {
            $url = esc_url_raw(trim((string) $value));
            if ($url === '') return '';
            $parts = wp_parse_url($url);
            if (!$parts || ($parts['scheme'] ?? '') !== 'https') {
                add_settings_error(ALEV_CONTACT_OPTION, 'invalid_url', 'Webhook URL must use HTTPS.');
                return get_option(ALEV_CONTACT_OPTION, '');
            }
            return $url;
        },
        'default' => '',
    ]);
});

add_action('admin_menu', function () {
    add_options_page('Alev Contact Webhook', 'Alev Contact Webhook', 'manage_options', 'alev-contact-webhook', function () {
        if (!current_user_can('manage_options')) return;
        ?>
        <div class="wrap">
            <h1>Alev Contact Webhook</h1>
            <form method="post" action="options.php">
                <?php settings_fields('alev_contact_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="alev-contact-url">Webhook URL</label></th>
                        <td><input id="alev-contact-url" class="regular-text" type="url" name="<?php echo esc_attr(ALEV_CONTACT_OPTION); ?>" value="<?php echo esc_attr(get_option(ALEV_CONTACT_OPTION, '')); ?>" placeholder="https://example.com/webhook"></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    });
});

add_shortcode('alev_contact_form', function () {
    $status = isset($_GET['alev_contact_status']) ? sanitize_key(wp_unslash($_GET['alev_contact_status'])) : '';
    ob_start();
    if ($status === 'sent') echo '<p>Thanks. Your message was sent.</p>';
    if ($status === 'error') echo '<p>Sorry, the message could not be sent.</p>';
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="alev_contact_submit">
        <?php wp_nonce_field('alev_contact_submit', 'alev_contact_nonce'); ?>
        <p><label>Name<br><input required type="text" name="name" maxlength="120"></label></p>
        <p><label>Email<br><input required type="email" name="email" maxlength="254"></label></p>
        <p><label>Message<br><textarea required name="message" rows="6" maxlength="4000"></textarea></label></p>
        <p style="display:none"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>
        <button type="submit">Send</button>
    </form>
    <?php
    return ob_get_clean();
});

function alev_contact_handle_submit() {
    $return = wp_get_referer() ?: home_url('/');

    if (!isset($_POST['alev_contact_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['alev_contact_nonce'])), 'alev_contact_submit')) {
        wp_safe_redirect(add_query_arg('alev_contact_status', 'error', $return));
        exit;
    }

    if (!empty($_POST['website'])) {
        wp_safe_redirect(add_query_arg('alev_contact_status', 'sent', $return));
        exit;
    }

    $name = isset($_POST['name']) ? sanitize_text_field(wp_unslash($_POST['name'])) : '';
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';
    $webhook = get_option(ALEV_CONTACT_OPTION, '');

    if ($name === '' || !is_email($email) || $message === '' || $webhook === '') {
        wp_safe_redirect(add_query_arg('alev_contact_status', 'error', $return));
        exit;
    }

    $response = wp_safe_remote_post($webhook, [
        'timeout' => 8,
        'headers' => ['Content-Type' => 'application/json'],
        'body' => wp_json_encode([
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'submitted_at' => gmdate('c'),
        ]),
    ]);

    $code = wp_remote_retrieve_response_code($response);
    $ok = !is_wp_error($response) && $code >= 200 && $code < 300;
    wp_safe_redirect(add_query_arg('alev_contact_status', $ok ? 'sent' : 'error', $return));
    exit;
}

add_action('admin_post_alev_contact_submit', 'alev_contact_handle_submit');
add_action('admin_post_nopriv_alev_contact_submit', 'alev_contact_handle_submit');
