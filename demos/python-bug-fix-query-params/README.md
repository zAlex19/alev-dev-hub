# Python Bug Fix Demo — Falsey Query Parameters

Self-directed bug-fix sample showing a small, reproducible Python defect and a regression test.

## Bug report

A helper that builds HTTP query strings is supposed to omit only values that are actually missing (`None`).

Instead, valid falsey values such as `0`, `False`, and an empty string are also dropped.

Example input:

```python
{"limit": 0, "active": False, "q": ""}
```

Expected:

```text
limit=0&active=False&q=
```

Buggy result: an empty query string.

## Reproduce

From this folder:

```bash
python -m unittest discover -s tests -v
```

The regression test fails on the buggy implementation.

## Goal

Change the smallest possible amount of code so that `None` is omitted, valid falsey values are preserved, and the regression suite passes.

The next commit contains the fix.
