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
  const second = submit({ sku: "A-1" });

  assert.equal(calls, 1);

  release({ id: "order-123" });
  await first;
  await second;
});
