import test from "node:test";
import assert from "node:assert/strict";
import { formatMarkdownLink } from "./logic.mjs";

test("formats a markdown link and escapes label brackets", () => {
  assert.equal(
    formatMarkdownLink("Docs [v2]", "https://example.com"),
    String.raw`[Docs \[v2\]](https://example.com)`
  );
});
