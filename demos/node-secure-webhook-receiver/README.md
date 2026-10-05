# Node.js Secure Webhook Receiver

A dependency-free Node.js sample for receiving signed webhook events safely.

## Features

- HMAC-SHA256 signature verification with timing-safe comparison
- required event IDs and in-memory replay/idempotency protection
- bounded request body size
- JSON/event-envelope validation
- deterministic duplicate response
- automated tests for signature tampering, replay handling and validation

## Verify

```bash
npm test
npm run check
```

Run locally with:

```bash
WEBHOOK_SECRET=dev-secret npm start
```

This is a self-directed technical sample, not client work.
