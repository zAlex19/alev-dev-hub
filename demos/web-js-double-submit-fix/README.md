# Web / JavaScript Bug Fix Sample — Duplicate Form Submission

This sample starts from a reproduced race condition: two fast submits can create two API requests for one intended action.

The regression test in this commit demonstrates the failure. The following commit applies the minimal in-flight guard and verifies recovery after API errors.

This is a self-directed technical sample, not client work.
