# n8n Lead Intake Workflow Sample

A small white-label-style automation sample: receive a lead over HTTP, normalize/validate it, route it by budget, and return a deterministic response.

## Workflow

`Webhook → Normalize + Route → Valid Lead? → Accepted / Rejected`

The workflow intentionally has no credentials or vendor-specific CRM dependency, so it can be imported safely and extended with Google Sheets, HubSpot, Slack, email, or another destination later.

## Included verification

The core normalization/routing rules are mirrored in `src/leadLogic.mjs` and covered by Node's built-in test runner:

```bash
npm test
```

## Example request

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "company": "Acme",
  "budget": 1500
}
```

Expected route: `sales / high`.

This is a self-directed technical sample, not client work.
