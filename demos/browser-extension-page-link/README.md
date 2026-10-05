# Chrome / Chromium Extension Sample

A minimal Manifest V3 extension that reads the active tab and copies a Markdown link.

It intentionally requests only `activeTab` and contains no remote code or analytics.

## Verify

```bash
node --test logic.test.mjs
```

Then load the folder as an unpacked extension in a Chromium-based browser for runtime verification.

This is a self-directed technical sample, not client work.
