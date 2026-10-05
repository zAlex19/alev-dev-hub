import test from "node:test";
import assert from "node:assert/strict";
import { IdempotencyStore, signBody, validateEvent, verifySignature } from "../src/webhook.mjs";

test("verifies HMAC signatures without accepting altered bodies", () => {
  const secret = "secret";
  const body = JSON.stringify({ type: "lead.created" });
  const signature = signBody(secret, body);
  assert.equal(verifySignature(secret, body, `sha256=${signature}`), true);
  assert.equal(verifySignature(secret, body + "x", `sha256=${signature}`), false);
});

test("idempotency store rejects replay until TTL expires", () => {
  const store = new IdempotencyStore(1000);
  assert.equal(store.claim("evt-1", 100), true);
  assert.equal(store.claim("evt-1", 500), false);
  assert.equal(store.claim("evt-1", 1200), true);
});

test("validates event envelope", () => {
  assert.equal(validateEvent({ type: " lead.created ", data: {} }).event.type, "lead.created");
  assert.deepEqual(validateEvent({}), { ok: false, error: "missing_type" });
});
