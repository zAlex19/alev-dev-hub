const CONFIG = Object.freeze({
  LEADS_SHEET: 'Leads',
  AUDIT_SHEET: 'AuditLog',
  HEADER_ROW: 1,
  EMAIL_COLUMN: 3,
  BUDGET_COLUMN: 5,
  STATUS_COLUMN: 6,
});

function onFormSubmit(e) {
  if (!e || !e.range) throw new Error('This handler must run from a spreadsheet form-submit event');

  const sheet = e.range.getSheet();
  if (sheet.getName() !== CONFIG.LEADS_SHEET) return;

  const row = e.range.getRow();
  const email = normalizeEmail_(sheet.getRange(row, CONFIG.EMAIL_COLUMN).getDisplayValue());
  const budget = parseBudget_(sheet.getRange(row, CONFIG.BUDGET_COLUMN).getDisplayValue());

  if (!isValidEmail_(email)) {
    setStatus_(sheet, row, 'Invalid email');
    appendAudit_('rejected', row, email, 'invalid_email');
    return;
  }

  const duplicateRow = findEarlierEmailRow_(sheet, email, row);
  if (duplicateRow) {
    setStatus_(sheet, row, `Duplicate of row ${duplicateRow}`);
    appendAudit_('rejected', row, email, 'duplicate');
    return;
  }

  const status = routeLead_(budget);
  setStatus_(sheet, row, status);
  appendAudit_('accepted', row, email, status);
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseBudget_(value) {
  const cleaned = String(value || '').replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function routeLead_(budget) {
  if (budget >= 1000) return 'High Priority';
  if (budget >= 250) return 'Qualified';
  return 'Review';
}

function findEarlierEmailRow_(sheet, email, currentRow) {
  if (currentRow <= CONFIG.HEADER_ROW + 1) return null;
  const values = sheet
    .getRange(CONFIG.HEADER_ROW + 1, CONFIG.EMAIL_COLUMN, currentRow - CONFIG.HEADER_ROW - 1, 1)
    .getDisplayValues();

  for (let index = 0; index < values.length; index += 1) {
    if (normalizeEmail_(values[index][0]) === email) {
      return CONFIG.HEADER_ROW + 1 + index;
    }
  }
  return null;
}

function setStatus_(sheet, row, status) {
  sheet.getRange(row, CONFIG.STATUS_COLUMN).setValue(status);
}

function appendAudit_(action, row, email, detail) {
  const spreadsheet = SpreadsheetApp.getActive();
  const audit = spreadsheet.getSheetByName(CONFIG.AUDIT_SHEET) || spreadsheet.insertSheet(CONFIG.AUDIT_SHEET);
  if (audit.getLastRow() === 0) {
    audit.appendRow(['Timestamp', 'Action', 'Row', 'Email', 'Detail']);
  }
  audit.appendRow([new Date(), action, row, email, detail]);
}

function installTrigger() {
  const spreadsheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
}
