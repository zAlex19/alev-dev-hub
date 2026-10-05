import test from "node:test";
import assert from "node:assert/strict";
import { buildStatus, formatDuration, sanitizeNotification } from "../src/health.mjs";

test("formats status deterministically", () => {
  assert.equal(formatDuration(3_661_000), "1h 1m 1s");
  const output = buildStatus({
    uptimeMs: 120_000,
    guildCount: 3,
    websocketPingMs: 42.7,
    dependency: { ok: false, status: 503 },
  });
  assert.match(output, /Guilds: 3/);
  assert.match(output, /Gateway ping: 43 ms/);
  assert.match(output, /DOWN \(503\)/);
});

test("notification input is bounded", () => {
  assert.equal(sanitizeNotification("  hello  "), "hello");
  assert.throws(() => sanitizeNotification(""), /cannot be empty/);
  assert.throws(() => sanitizeNotification("x".repeat(1801)), /too long/);
});
