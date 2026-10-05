# AlevDev — Technical Portfolio

This repository contains self-directed technical samples and active development work. I do not claim paid-client history that I cannot verify.

## Roblox / Luau

Current work includes modular Roblox systems for:

- persistent player data and session-safe saving
- currencies, progression and rebirth/economy systems
- pet hatching, weighted rarity/luck, inventory and equip flows
- lock/favorite/delete and Base → Golden → Rainbow crafting
- server-authoritative validation and rate limiting
- gamepasses / developer-product logic
- daily rewards, codes, potions and automation systems
- leaderboard and world/teleport progression infrastructure

A standalone Pet System package is currently being polished as a reusable product/demo. Play-mode QA has already been used to verify its server bootstrap and remote surface.

Public code sample:
- [Strict Luau RequestGuard](demos/roblox-request-guard/README.md) — per-player token-bucket request limiting plus overlapping-action locks for server-side remote handling.

## Python

- [Python bug-fix sample](demos/python-bug-fix-query-params/README.md) — reproduce a falsey-value query bug, apply the minimal fix, and add regression coverage.

## Paper / Minecraft

- [SMPDiagnostics](demos/paper-smp-diagnostics/README.md) — a small read-only Paper plugin sample for TPS/MSPT, world-load and plugin diagnostics. Designed to inspect first rather than randomly mutate server configuration.

## Working style

Best fit is clear development work where requirements can be discussed primarily in text with regular progress updates. Occasional calls are fine when useful. I prefer scoped milestones, reproducible testing and small, reviewable changes.
