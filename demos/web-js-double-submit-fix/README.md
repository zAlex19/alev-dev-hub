# Web / JavaScript Bug Fix Sample — Duplicate Form Submission

A focused bug-fix sample showing how a small browser-side race condition can create duplicate API requests when a user submits the same action twice before the first request finishes.

## Reproduced bug

The original submit helper had no in-flight guard. Two fast clicks produced two API requests for one intended action.

## Fix

The final implementation:

- rejects a second submit while the first request is still running;
- always releases the guard in `finally`, including after errors;
- includes regression tests for duplicate suppression and failure recovery.

## Verify

```bash
npm test
```

This is a self-directed technical sample, not client work.
