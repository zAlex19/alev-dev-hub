# ALEV Dev Hub Architecture

## Goal

One portable control plane for local development bridges, game-server adapters, testing, logs, snapshots and future cloud relay connectivity.

## Core model

ChatGPT / client
→ ALEV Dev Hub
→ shared core
→ adapters
→ local apps, repositories, runtimes and test servers

The shared core should own:
- bounded file access
- search/read/patch operations
- command execution
- process lifecycle
- stdout/stderr/log collection
- tests and build commands
- Git status/diff/checkpoints
- snapshots and restore
- secret-safe configuration
- request IDs / idempotency

Adapters should contain only tool-specific behavior.

Planned adapters:
- Roblox Studio
- Minecraft Paper/Purpur
- Rust Carbon/uMod
- ARK server tooling
- FiveM / FXServer
- Blender
- general development workspace

## Portability rule

The system is not considered correctly installed if a new PC cannot reconstruct it from:
1. this repository,
2. documented runtime dependencies,
3. non-secret configuration,
4. separately restored secrets.

No machine-specific absolute paths should be hardcoded in source.

## v0.1 scope

Do not build every adapter yet.

First useful core:
- workspace listing
- file tree
- read/search
- safe patch/write
- bounded command execution
- process status
- logs
- test/build execution
- Git status/diff
- checkpoint metadata

Adapters are added when real work requires them.
