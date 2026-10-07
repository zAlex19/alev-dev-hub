# AlevDev — Technical Portfolio

I am currently completing paid Roblox systems work alongside self-directed technical samples and active development projects. Public demos here focus on work I can show without exposing private client code or assets.

## Roblox / Luau

Current work includes modular Roblox systems for persistent data, progression/economy, pet RNG/inventory/crafting, server validation, monetization, rewards/automation, leaderboards and world progression.

A standalone Pet System package is currently being polished as a reusable product/demo. Play-mode QA has already been used to verify its server bootstrap and remote surface.

- [Roblox Shop & Game Pass System](demos/roblox-shop-gamepass-system/README.md) — functional shop UI, native Roblox purchase flow, ownership handling, client/server integration and Studio QA. Includes a public video demo.
- [Strict Luau RequestGuard](demos/roblox-request-guard/README.md) — per-player token-bucket request limiting plus overlapping-action locks for server-side remote handling.

## Python

- [Python bug-fix sample](demos/python-bug-fix-query-params/README.md) — reproduce a falsey-value query bug, apply the minimal fix, and add regression coverage.

## JavaScript / Web

- [Duplicate form submission bug fix](demos/web-js-double-submit-fix/README.md) — reproduced race condition, regression test, minimal fix and failure recovery.
- [Node.js Secure Webhook Receiver](demos/node-secure-webhook-receiver/README.md) — HMAC verification, timing-safe comparison, event IDs, replay/idempotency protection, body limits and tests.
- [Browser Extension Page Link](demos/browser-extension-page-link/README.md) — small Manifest V3 utility with a minimal permission surface and test-covered formatting logic.

## Automation / Google Workspace

- [Google Sheets + Apps Script Lead Router](demos/google-apps-script-lead-router/README.md) — email validation, deduplication, budget routing, audit trail and trigger/self-test helpers.
- [n8n Lead Intake Workflow](demos/n8n-lead-intake/README.md) — webhook intake, normalization, validation and deterministic routing with test-covered core logic.

## Discord / Integrations

- [Discord Ops Bot](demos/discord-ops-bot/README.md) — slash commands for ping/status/notifications, dependency health checks, bounded input and permission-gated messaging.

## WordPress / PHP

- [WordPress Contact Form → Webhook](demos/wordpress-contact-webhook/README.md) — settings, shortcode, nonce validation, sanitization, honeypot, safe remote POST and clean uninstall behavior.

## Paper / Minecraft

- [SMPDiagnostics](demos/paper-smp-diagnostics/README.md) — read-only Paper diagnostics for TPS/MSPT, world load and plugin presence.

## Working style

Best fit is clear development work where requirements can be discussed primarily in text with regular progress updates. Occasional calls are fine when useful. I prefer scoped milestones, reproducible testing and small, reviewable changes.

## White-label / overflow fit

I am especially interested in scoped overflow work where an agency or studio owns the client relationship and sends implementation tickets for delivery. Current coverage includes bug fixes, automation/webhooks, Node/API work, Apps Script, n8n, Discord, WordPress, browser utilities, Roblox systems and Paper/Minecraft tooling.
