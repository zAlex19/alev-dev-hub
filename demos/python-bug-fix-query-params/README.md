# Python Bug Fix Demo — Falsey Query Parameters

Self-directed bug-fix sample showing a small, reproducible Python defect, the minimal fix, and a regression test.

## Problem

An HTTP query-string helper was supposed to omit only missing values (`None`).

The original implementation filtered values by truthiness, so valid values such as `0`, `False`, and an empty string were silently dropped.

Example input:

```python
{"limit": 0, "active": False, "q": ""}
```

Expected:

```text
limit=0&active=False&q=
```

Original result: an empty query string.

## Root cause

The buggy filter used:

```python
if value
```

That treats every falsey value as missing.

## Fix

The filter now checks only for `None`:

```python
if value is not None
```

This preserves legitimate falsey values while still omitting missing parameters.

## Regression test

Run from this folder:

```bash
python -m unittest discover -s tests -v
```

The tests cover:

- preserving `0`, `False`, and `""`
- omitting `None`
- preserving normal parameters

## What this sample demonstrates

- reproducing a concrete bug
- identifying the smallest safe change
- adding a regression test
- verifying existing behavior remains intact

This is a self-directed technical sample, not claimed client work.
