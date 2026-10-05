# Discord Ops Bot Sample

A small Discord bot sample for operations/status workflows.

## Commands

- `/ping` — gateway latency
- `/status` — uptime, guild count, gateway ping, optional HTTP dependency health
- `/notify` — permission-gated operations message with mention parsing disabled

## Reliability / safety details

- dependency health requests have a timeout;
- notification input is length-bounded;
- mass mentions are not parsed from notification text;
- `/notify` requires `Manage Server`;
- pure formatting/validation logic has automated tests.

## Local verification

```bash
npm test
npm run check
```

Running the live bot additionally requires a Discord application/token and `npm install`.

This is a self-directed technical sample, not client work.
