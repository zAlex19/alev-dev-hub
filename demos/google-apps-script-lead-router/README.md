# Google Sheets + Apps Script Lead Router

A small business-automation sample for routing form-submitted leads inside Google Sheets.

## Behavior

When a new form response lands in the `Leads` sheet, the script:

1. normalizes and validates the email;
2. checks earlier rows for the same normalized email;
3. parses the budget;
4. assigns `High Priority`, `Qualified`, or `Review`;
5. writes every accepted/rejected decision to an `AuditLog` sheet.

It also includes an `installTrigger()` helper and a `runSelfTest()` function for the pure routing/validation helpers.

## Expected Leads columns

`Timestamp | Name | Email | Company | Budget | Status | Owner | Notes`

## Install

1. Create a Google Sheet with a `Leads` tab and the columns above.
2. Open Extensions → Apps Script.
3. Copy `Code.gs` and `Tests.gs` into the Apps Script project.
4. Run `runSelfTest()` once.
5. Run `installTrigger()` once and authorize the project.
6. Connect a Google Form to the sheet or submit rows through another supported workflow.

This is a self-directed technical sample, not client work.
