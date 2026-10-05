# WordPress Contact Form → Webhook Plugin Sample

A small WordPress/PHP integration sample for agency-style website work.

## What it does

- adds a settings page for an HTTPS webhook URL;
- provides an `[alev_contact_form]` shortcode;
- validates a WordPress nonce;
- sanitizes name/email/message input;
- includes a honeypot field;
- forwards submissions with `wp_safe_remote_post()` and a timeout;
- redirects back with a simple success/error state;
- removes its saved option on uninstall.

## Verify

Syntax check:

```bash
php -l alev-contact-webhook.php
php -l uninstall.php
```

Full runtime verification requires a WordPress installation because the plugin intentionally uses WordPress APIs instead of reimplementing them.

This is a self-directed technical sample, not client work.
