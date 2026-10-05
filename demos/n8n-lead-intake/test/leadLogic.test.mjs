import test from "node:test";
import assert from "node:assert/strict";
import { normalizeLead, routeLead } from "../src/leadLogic.mjs";

test("normalizes and routes a high-value lead", () => {
  const lead = normalizeLead({ name: " Alex ", email: " A@EXAMPLE.COM ", company: "Acme", budget: "1500" });
  assert.deepEqual(lead, { name: "Alex", email: "a@example.com", company: "Acme", budget: 1500, valid: true });
  assert.deepEqual(routeLead(lead), { route: "sales", priority: "high" });
});

test("rejects an invalid email", () => {
  const lead = normalizeLead({ email: "bad", budget: 5000 });
  assert.deepEqual(routeLead(lead), { route: "reject", priority: "none" });
});
