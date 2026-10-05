import crypto from "node:crypto";

export function signBody(secret, body) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export function verifySignature(secret, body, provided) {
  if (!secret || !provided) return false;
  const expected = signBody(secret, body);
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(String(provided).replace(/^sha256=/, ""), "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export class IdempotencyStore {
  constructor(ttlMs = 5 * 60_000) {
    this.ttlMs = ttlMs;
    this.seen = new Map();
  }

  claim(key, now = Date.now()) {
    this.prune(now);
    if (this.seen.has(key)) return false;
    this.seen.set(key, now + this.ttlMs);
    return true;
  }

  prune(now = Date.now()) {
    for (const [key, expiresAt] of this.seen) {
      if (expiresAt <= now) this.seen.delete(key);
    }
  }
}

export function validateEvent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "body_must_be_object" };
  }
  const type = String(value.type ?? "").trim();
  if (!type) return { ok: false, error: "missing_type" };
  return { ok: true, event: { ...value, type } };
}
