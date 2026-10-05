import test from "node:test";
import assert from "node:assert/strict";
import { createOrderSubmitter } from "../src/submitOrder.mjs";

test("suppresses duplicate submit while the first request is in flight", async () => {
  let calls = 0;
  let release;
  const api = async () => {
    calls += 1;
    return await new Promise((resolve) => {
      release = resolve;
    });
  };

  const submit = createOrderSubmitter(api);
  const first = submit({ sku: "A-1" });
  const second = await submit({ sku: "A-1" });

  assert.equal(calls, 1);
  assert.deepEqual(second, { ok: false, reason: "in_flight" });

  release({ id: "order-123" });
  assert.deepEqual(await first, { ok: true, id: "order-123" });
});

test("releases the guard after an API failure", async () => {
  let calls = 0;
  const api = async () => {
    calls += 1;
    if (calls === 1) throw new Error("temporary failure");
    return { id: "order-456" };
  };

  const submit = createOrderSubmitter(api);
  await assert.rejects(() => submit({ sku: "B-2" }), /temporary failure/);
  assert.deepEqual(await submit({ sku: "B-2" }), { ok: true, id: "order-456" });
});
