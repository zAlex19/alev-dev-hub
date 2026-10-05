# Roblox / Luau RequestGuard Sample

A small strict-Luau sample extracted from a reusable Roblox system currently under development.

It provides two server-side primitives that are useful around RemoteEvent / RemoteFunction handlers:

- a per-player, per-action token bucket for request rate limiting
- a lightweight per-player lock to prevent overlapping execution of the same sensitive action

The original system uses this alongside server-authoritative validation rather than trusting client-provided rewards, prices or state transitions.

This file is intentionally a **small code sample**, not the complete product source.
