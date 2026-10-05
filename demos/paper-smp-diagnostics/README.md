# SMPDiagnostics — Paper Plugin Sample

A small, read-only Paper plugin sample for diagnosing an SMP before changing configs or writing custom replacements.

## What it shows

- `/smpdiag summary` — TPS, average tick time, heap usage, JVM uptime, player count
- `/smpdiag worlds` — loaded chunks and entity counts per world
- `/smpdiag plugins` — plugin inventory plus detection of common SMP tooling such as GriefPrevention, GPFlags, spark, Geyser/Floodgate, Vulcan/Grim, Towny and Lands
- `/smpdiag help` — command summary

The plugin does **not** mutate configuration, optimize automatically, touch claims, or make assumptions about a lag source. The intended workflow is inspect first, change second.

## Cross-play considerations

This sample does not inspect packets, movement, inventory protocol details, or client type. It is intentionally server-side/read-only, so Geyser/Floodgate players are not handled differently.

## Build

Requires Java 21 and Maven.

```bash
mvn clean package
```

The built jar will be under `target/`.

## Install

1. Build the jar.
2. Put it in the Paper server's `plugins/` directory.
3. Restart the server.
4. Run `/smpdiag summary` as an operator.

## Why this exists

This is a self-directed technical sample created to demonstrate clean Paper plugin structure and a conservative debugging workflow. It is not presented as paid client work.
